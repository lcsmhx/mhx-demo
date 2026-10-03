/* DÉMO MHX — faux backend dans le navigateur.
   Remplace les appels réseau de l'app vers Supabase par une petite base en mémoire (données fictives de
   demo/donnees.js). Rien ne part vers un serveur : pas de vraie base, pas de vrais comptes, aucune donnée
   réelle. La base vit dans l'onglet (sessionStorage) : ce qu'on modifie reste tant que l'onglet est ouvert ;
   « Réinitialiser la démo » (page d'accueil de la démo) remet tout à zéro.
   Chargé AVANT tous les fichiers de l'app (voir index.html). */
(function () {
  const D = window.DEMO_DONNEES;
  const CLE = "mhx_demo_base";
  const vraiFetch = window.fetch.bind(window);
  const clone = (x) => JSON.parse(JSON.stringify(x));
  const maintenant = () => new Date().toISOString();
  const uuid = () => "00000000-0000-4000-8000-" + Math.random().toString(16).slice(2, 14).padEnd(12, "0");

  /* ---------- la base ---------- */
  function initiale() {
    return { profils: clone(D.profils), donnees: clone(D.donnees), bibliotheque: clone(D.bibliotheque), connexions: clone(D.connexions), utilisateurs: clone(D.utilisateurs), cree: maintenant() };
  }
  let base = null;
  try { const b = JSON.parse(sessionStorage.getItem(CLE) || "null"); if (b && b.profils && b.donnees) base = b; } catch (e) { }
  if (!base) base = initiale();
  const sauver = () => { try { sessionStorage.setItem(CLE, JSON.stringify(base)); } catch (e) { } };
  window.DEMO_RESET = function () { base = initiale(); sauver(); };
  /* catalogue : vide par défaut (l'app lit alors les fichiers demo/donnees/, comme elle le fait sur une base vide) ;
     rempli en mémoire si le coach lance « recharger » dans Catalogue */
  const catalogue = { aliments: [], recettes: [], programmes_types: [], exercices: [] };
  /* photos de progression : en mémoire seulement */
  const photos = {};

  /* ---------- outils ---------- */
  const json = (corps, statut, entetes) => new Response(corps === undefined || corps === null ? "" : JSON.stringify(corps), {
    status: statut || 200, headers: Object.assign({ "Content-Type": "application/json" }, entetes || {})
  });
  const erreur = (statut, message, code) => json({ message, code: code || "", error: message, error_description: message, msg: message }, statut);
  const lireCorps = async (init) => {
    if (!init || init.body == null) return null;
    if (typeof init.body === "string") { try { return JSON.parse(init.body); } catch (e) { return init.body; } }
    return init.body;
  };
  const entete = (init, nom) => {
    if (!init || !init.headers) return "";
    const h = init.headers;
    if (typeof h.get === "function") return h.get(nom) || "";
    const k = Object.keys(h).find(x => x.toLowerCase() === nom.toLowerCase());
    return k ? h[k] : "";
  };
  const jetonVers = (init) => {
    const a = entete(init, "Authorization");
    const m = /^Bearer demo-([0-9a-f-]{36})$/.exec(a || "");
    return m ? m[1] : null;
  };
  const session = (id) => {
    const u = base.utilisateurs[id] || { email: "", meta: {} };
    return { access_token: "demo-" + id, refresh_token: "demo-refresh-" + id, token_type: "bearer", expires_in: 86400,
      user: { id, email: u.email, role: "authenticated", aud: "authenticated", user_metadata: clone(u.meta || {}), app_metadata: { provider: "email" }, created_at: (base.profils.find(p => p.id === id) || {}).cree_le || maintenant() } };
  };
  const profil = (id) => base.profils.find(p => p.id === id) || null;
  const estCoach = (id) => { const p = profil(id); return !!(p && p.role === "coach"); };

  /* ---------- filtres façon PostgREST ---------- */
  function valeur(v) { if (v === "null") return null; if (v === "true") return true; if (v === "false") return false; return v; }
  function filtrer(lignes, params) {
    let l = lignes.slice();
    params.forEach((v, k) => {
      if (["select", "order", "limit", "offset", "on_conflict"].indexOf(k) > -1) return;
      const m = /^(not\.)?([a-z]+)\.(.*)$/s.exec(v);
      if (!m) return;
      const non = !!m[1], op = m[2], arg = m[3];
      const test = (x) => {
        const c = x[k];
        switch (op) {
          case "eq": return String(c) === arg;
          case "neq": return String(c) !== arg;
          case "gt": return c > arg; case "gte": return c >= arg; case "lt": return c < arg; case "lte": return c <= arg;
          case "is": return arg === "null" ? c == null : c === valeur(arg);
          case "in": { const liste = arg.replace(/^\(|\)$/g, "").split(",").map(s => s.trim().replace(/^"|"$/g, "")); return liste.indexOf(String(c)) > -1; }
          case "like": case "ilike": { const re = new RegExp("^" + arg.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/%/g, ".*") + "$", op === "ilike" ? "i" : ""); return re.test(String(c)); }
          default: return true;
        }
      };
      l = l.filter(x => non ? !test(x) : test(x));
    });
    const ordre = params.get("order");
    if (ordre) {
      const cles = ordre.split(",").map(s => { const [c, sens] = s.split("."); return { c, desc: sens === "desc" }; });
      l.sort((a, b) => { for (const o of cles) { const x = a[o.c], y = b[o.c]; if (x === y) continue; const r = x == null ? 1 : y == null ? -1 : (x < y ? -1 : 1); return o.desc ? -r : r; } return 0; });
    }
    return l;
  }
  function projeter(lignes, params) {
    const sel = (params.get("select") || "*").split(",").map(s => s.trim());
    if (sel.indexOf("*") > -1) return clone(lignes);
    return lignes.map(x => Object.fromEntries(sel.map(k => [k, x[k]])));
  }
  function paginer(lignes, init) {
    const r = entete(init, "Range");
    if (!r) return { lignes, entetes: {} };
    const [a, b] = r.split("-").map(Number);
    if (a >= lignes.length && lignes.length) return { statut: 416, lignes: [], entetes: {} };
    const page = lignes.slice(a, (isNaN(b) ? lignes.length - 1 : b) + 1);
    return { lignes: page, entetes: { "Content-Range": a + "-" + (a + page.length - 1) + "/" + lignes.length } };
  }

  /* ---------- tables ---------- */
  function tableDe(nom) {
    if (nom === "profils") return base.profils;
    if (nom === "donnees") return base.donnees;
    if (nom === "bibliotheque") return base.bibliotheque;
    if (nom === "connexions") return base.connexions;
    if (catalogue[nom]) return catalogue[nom];
    return null;
  }
  const CLES_TABLES = { profils: ["id"], donnees: ["user_id", "outil"], bibliotheque: ["id"], connexions: ["user_id"], aliments: ["id"], recettes: ["id"], programmes_types: ["id"], exercices: ["id"] };
  const memeCle = (nom, a, b) => CLES_TABLES[nom].every(k => String(a[k]) === String(b[k]));

  async function rest(nom, params, methode, init) {
    const t = tableDe(nom);
    if (!t) return json([]);
    const uid = jetonVers(init), coach = estCoach(uid);
    /* règles d'accès simplifiées (comme les RLS) : un compte ne lit que ses lignes, le coach lit tout ;
       notes_coach et suivi_prospect ne sont jamais lus par leur propriétaire */
    const visible = (x) => {
      if (!uid) return nom !== "profils" && nom !== "donnees" && nom !== "connexions" && nom !== "bibliotheque";
      if (coach) return true;
      if (nom === "profils") return x.id === uid;
      if (nom === "donnees") return x.user_id === uid && ["notes_coach", "suivi_prospect"].indexOf(x.outil) === -1;
      if (nom === "connexions") return false;
      if (nom === "bibliotheque") return x.coach_id === uid;
      return true;
    };
    const prefer = entete(init, "Prefer") || "";
    const representer = /return=representation/.test(prefer);
    if (methode === "GET" || methode === "HEAD") {
      const l = filtrer(t.filter(visible), params);
      const p = paginer(l, init);
      if (p.statut === 416) return json([], 416);
      return json(projeter(p.lignes, params), 200, p.entetes);
    }
    if (methode === "POST") {
      const corps = await lireCorps(init);
      const lignes = Array.isArray(corps) ? corps : [corps];
      const upsert = params.has("on_conflict") || /merge-duplicates/.test(prefer);
      const sorties = [];
      for (const ligne of lignes) {
        if (!ligne || typeof ligne !== "object") continue;
        if (nom === "donnees") {
          if (!uid) return erreur(401, "JWT manquant");
          const proprio = ligne.user_id === uid;
          if (!coach && (!proprio || ["feedbacks", "notes_coach", "suivi_prospect"].indexOf(ligne.outil) > -1)) return erreur(403, "new row violates row-level security policy", "42501");
          if (!("maj_le" in ligne)) ligne.maj_le = maintenant();
        }
        if (nom === "bibliotheque") { if (!ligne.id) ligne.id = uuid(); if (!ligne.cree_le) ligne.cree_le = maintenant(); }
        if (nom === "profils" && !ligne.cree_le) ligne.cree_le = maintenant();
        const i = t.findIndex(x => memeCle(nom, x, ligne));
        if (i > -1) {
          if (!upsert) return erreur(409, "duplicate key value violates unique constraint", "23505");
          t[i] = Object.assign({}, t[i], ligne);
          sorties.push(t[i]);
        } else { t.push(ligne); sorties.push(ligne); }
      }
      sauver();
      return representer ? json(projeter(sorties, params), 201) : json(null, 201);
    }
    if (methode === "PATCH") {
      const corps = await lireCorps(init);
      if (!corps || typeof corps !== "object") return erreur(400, "corps vide");
      if (nom === "profils" && !coach) { if ("role" in corps || "statut" in corps) return erreur(403, "seul un coach change le rôle ou le statut", "42501"); }
      const cibles = filtrer(t.filter(visible), params);
      const sorties = [];
      cibles.forEach(x => { const i = t.indexOf(x); t[i] = Object.assign({}, x, corps); sorties.push(t[i]); });
      sauver();
      return representer ? json(projeter(sorties, params), 200) : json(null, 204);
    }
    if (methode === "DELETE") {
      const cibles = filtrer(t.filter(visible), params);
      cibles.forEach(x => { const i = t.indexOf(x); if (i > -1) t.splice(i, 1); });
      sauver();
      return representer ? json(cibles, 200) : json(null, 204);
    }
    return erreur(405, "méthode non gérée");
  }

  /* ---------- auth ---------- */
  async function auth(chemin, params, methode, init) {
    const corps = await lireCorps(init);
    if (chemin === "/auth/v1/token") {
      const grant = params.get("grant_type");
      if (grant === "password") {
        const email = String((corps && corps.email) || "").trim().toLowerCase();
        const id = Object.keys(base.utilisateurs).find(k => base.utilisateurs[k].email.toLowerCase() === email);
        if (!id || !corps.password) return erreur(400, "Invalid login credentials", "invalid_grant");
        return json(session(id));
      }
      if (grant === "refresh_token") {
        const m = /^demo-refresh-([0-9a-f-]{36})$/.exec(String((corps && corps.refresh_token) || ""));
        if (!m || !base.utilisateurs[m[1]]) return erreur(400, "Invalid Refresh Token", "refresh_token_not_found");
        return json(session(m[1]));
      }
      return erreur(400, "grant_type inconnu");
    }
    if (chemin === "/auth/v1/signup") {
      const email = String((corps && corps.email) || "").trim().toLowerCase();
      if (!email || !/.+@.+\..+/.test(email)) return erreur(422, "Unable to validate email address: invalid format", "validation_failed");
      if (!corps.password || String(corps.password).length < 6) return erreur(422, "Password should be at least 6 characters.", "weak_password");
      if (Object.keys(base.utilisateurs).some(k => base.utilisateurs[k].email.toLowerCase() === email)) return erreur(422, "User already registered", "user_already_exists");
      const id = uuid(), data = (corps.data && typeof corps.data === "object") ? corps.data : {};
      base.utilisateurs[id] = { email, meta: clone(data) };
      base.profils.push({ id, prenom: String(data.prenom || ""), nom: String(data.nom || ""), role: "client", statut: "prospect", cree_le: maintenant() });
      sauver();
      return json(session(id));
    }
    if (chemin === "/auth/v1/user") {
      const uid = jetonVers(init);
      if (!uid || !base.utilisateurs[uid]) return erreur(401, "invalid JWT", "bad_jwt");
      const u = base.utilisateurs[uid];
      if (methode === "PUT") {
        if (corps && corps.data && typeof corps.data === "object") u.meta = Object.assign({}, u.meta || {}, corps.data);
        if (corps && typeof corps.email === "string" && corps.email.trim()) u.email = corps.email.trim().toLowerCase();
        sauver();
      }
      return json(session(uid).user);
    }
    if (chemin === "/auth/v1/logout") return json(null, 204);
    if (chemin === "/auth/v1/recover") return json({});
    return json({});
  }

  /* ---------- fonctions (edge functions) ---------- */
  async function fonctions(chemin, init) {
    const corps = await lireCorps(init), uid = jetonVers(init);
    if (!estCoach(uid)) return json({ erreur: "Réservé au coach." }, 403);
    if (chemin === "/functions/v1/creer-acces") {
      const email = String((corps && corps.email) || "").trim().toLowerCase();
      if (!email) return json({ erreur: "Email manquant." }, 400);
      if (Object.keys(base.utilisateurs).some(k => base.utilisateurs[k].email.toLowerCase() === email)) return json({ erreur: "Un compte existe déjà avec cet email." }, 409);
      const id = uuid(), role = corps.role === "coach" ? "coach" : "client";
      base.utilisateurs[id] = { email, meta: { prenom: corps.prenom || "", nom: corps.nom || "" } };
      base.profils.push({ id, prenom: String(corps.prenom || ""), nom: String(corps.nom || ""), role, statut: "client", cree_le: maintenant() });
      sauver();
      return json({ id, email, role, statut: "client" });
    }
    if (chemin === "/functions/v1/supprimer-acces") {
      const id = String((corps && (corps.id || corps.user_id)) || "");
      if (!base.utilisateurs[id]) return json({ erreur: "Compte introuvable." }, 404);
      delete base.utilisateurs[id];
      base.profils = base.profils.filter(p => p.id !== id);
      base.donnees = base.donnees.filter(d => d.user_id !== id);
      base.connexions = base.connexions.filter(c => c.user_id !== id);
      Object.keys(photos).forEach(k => { if (k.startsWith(id + "/")) delete photos[k]; });
      sauver();
      return json({ ok: true });
    }
    return json({ ok: true });
  }

  /* ---------- storage (photos) ---------- */
  async function storage(chemin, methode, init) {
    const uid = jetonVers(init);
    if (!uid) return erreur(401, "JWT manquant");
    const m = /^\/storage\/v1\/object\/(authenticated\/)?photos\/(.+)$/.exec(chemin);
    if (!m) return erreur(404, "Object not found");
    const cle = decodeURIComponent(m[2]);
    const sien = cle.startsWith(uid + "/");
    if (methode === "GET") {
      if (!sien && !estCoach(uid)) return erreur(403, "accès refusé");
      const b = photos[cle]; if (!b) return erreur(404, "Object not found");
      return new Response(b, { status: 200, headers: { "Content-Type": "image/jpeg" } });
    }
    if (methode === "POST" || methode === "PUT") {
      const p = profil(uid);
      if (!sien || !p || p.statut !== "client" || p.role !== "client") return erreur(403, "new row violates row-level security policy");
      let corps = init && init.body;
      if (corps && typeof corps.arrayBuffer === "function") corps = await corps.arrayBuffer();
      photos[cle] = new Blob([corps], { type: "image/jpeg" });
      return json({ Key: "photos/" + cle });
    }
    if (methode === "DELETE") { if (!sien) return erreur(403, "accès refusé"); delete photos[cle]; return json([{ name: cle }]); }
    return erreur(405, "méthode non gérée");
  }

  /* ---------- aiguillage ---------- */
  async function simuler(url, init) {
    const u = new URL(url), chemin = u.pathname, params = u.searchParams, methode = ((init && init.method) || "GET").toUpperCase();
    if (chemin.startsWith("/auth/v1/")) return auth(chemin, params, methode, init);
    if (chemin.startsWith("/functions/v1/")) return fonctions(chemin, init);
    if (chemin.startsWith("/storage/v1/")) return storage(chemin, methode, init);
    if (chemin === "/rest/v1/rpc/noter_connexion") {
      const uid = jetonVers(init);
      if (uid) {
        const jour = new Date().toISOString().slice(0, 10);
        let c = base.connexions.find(x => x.user_id === uid);
        if (!c) { c = { user_id: uid, nombre: 0, premiere: maintenant(), derniere: maintenant(), dernier_jour: "" }; base.connexions.push(c); }
        if (c.dernier_jour !== jour) { c.nombre += 1; c.dernier_jour = jour; }
        c.derniere = maintenant(); sauver();
      }
      return json(null, 204);
    }
    if (chemin.startsWith("/rest/v1/rpc/")) return json(null, 204);
    if (chemin.startsWith("/rest/v1/")) return rest(chemin.slice("/rest/v1/".length), params, methode, init);
    return erreur(404, "chemin inconnu : " + chemin);
  }

  const SOURCE = "https://raw.githubusercontent.com/lcsmhx/mhx-plateforme/main/donnees/";
  window.fetch = function (entree, init) {
    const url = typeof entree === "string" ? entree : (entree && entree.url) || "";
    let h = ""; try { h = new URL(url, location.href).hostname; } catch (e) { }
    if (/\.supabase\.co$/.test(h)) {
      const i = Object.assign({}, init || {});
      if (entree && typeof entree !== "string") { i.method = i.method || entree.method; i.headers = i.headers || entree.headers; }
      /* un petit délai : l'app affiche ses états « Chargement… » / « Enregistrement… » comme en vrai */
      return new Promise(r => setTimeout(r, 60)).then(() => simuler(url, i));
    }
    if (url.startsWith(SOURCE)) return vraiFetch(new URL("demo/donnees/" + url.slice(SOURCE.length), location.href).href, init);
    return vraiFetch(entree, init);
  };
})();
