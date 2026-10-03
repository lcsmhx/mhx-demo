/* DÉMO MHX — réglages de la démo, chargés juste après js/config.js.
   Tout ce qui diffère de l'app réelle est ici, et seulement ici. */
(function () {
  /* la « base » : une adresse fictive, interceptée par demo/simulation.js (rien ne part sur le réseau) */
  CONFIG.supabase.url = "https://demo-mhx.supabase.co";
  CONFIG.supabase.cle = "demo";
  /* le pied de page dit qu'on regarde la démo */
  CONFIG.marque.version = CONFIG.marque.version + " · démo";
  /* les nouveautés sont montrées à tout le monde dans la démo (feedback du dimanche, suivi des visites des clients) */
  CONFIG.nouveautes.feedback_dimanche = "tous";
  CONFIG.nouveautes.suivi_visites_clients = "tous";
  CONFIG.nouveautes.comptes_test = [];
  /* l'inscription est ouverte : le parcours complet « Créer mon compte » se joue dans la démo */
  CONFIG.marque.inscription_libre = true;
  /* le lien du plan d'action : celui de Lucas (à remplacer ici si la démo ne doit pas mener à son vrai Calendly) */
  // CONFIG.marque.calendly = "https://calendly.com/…";

  /* la petite étiquette « Démo » : un retour vers la page de choix du rôle, toujours visible */
  const poser = () => {
    if (document.getElementById("demo-pastille")) return;
    const a = document.createElement("a");
    a.id = "demo-pastille";
    a.href = "../index.html";
    a.setAttribute("data-notr", "");
    a.innerHTML = "<b>Démo</b><span>changer de rôle</span>";
    document.body.appendChild(a);
    const s = document.createElement("style");
    s.textContent = "#demo-pastille{position:fixed;right:12px;bottom:14px;z-index:60;display:flex;align-items:center;gap:7px;padding:7px 11px;border-radius:999px;background:var(--accent,#d4a844);color:#111;font:600 12px/1 IBM Plex Sans,system-ui,sans-serif;text-decoration:none;box-shadow:0 6px 18px rgba(0,0,0,.35);letter-spacing:.01em}" +
      "#demo-pastille span{font-weight:500;opacity:.85}" +
      "@media (max-width:720px){#demo-pastille{bottom:74px;right:10px}#demo-pastille span{display:none}}";
    document.head.appendChild(s);
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", poser); else poser();
})();
