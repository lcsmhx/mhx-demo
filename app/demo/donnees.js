/* DÉMO MHX — données FICTIVES. Aucune donnée réelle : les comptes, prénoms, chiffres et
   messages sont inventés. Les dates sont calculées par rapport au jour où la démo est
   ouverte, pour que les écrans restent cohérents (« cette semaine », « il y a 3 jours »…).
   Adapté de tests-locaux/fixtures.js (le banc de test de l'app). */
window.DEMO_DONNEES = (function () {
  const iso = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const ilYA = (n) => { const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() - n); return iso(d); };
  const instantIlYA = (n, h) => { const d = new Date(); d.setHours(h == null ? 9 : h, 15, 0, 0); d.setDate(d.getDate() - n); return d.toISOString(); };
  const AUJ = ilYA(0);
  const lundi = (() => { const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d; })();
  const jourSem = (k) => { const d = new Date(lundi); d.setDate(lundi.getDate() + k); return iso(d); };
  const MOIS = AUJ.slice(0, 7);
  const lundiPrec = (() => { const d = new Date(lundi); d.setDate(lundi.getDate() - 7); return iso(d); })();
  const dimPrec = (() => { const d = new Date(lundi); d.setDate(lundi.getDate() - 1); return iso(d); })();
  const lundiPrec2 = (() => { const d = new Date(lundi); d.setDate(lundi.getDate() - 14); return iso(d); })();
  const dimPrec2 = (() => { const d = new Date(lundi); d.setDate(lundi.getDate() - 8); return iso(d); })();

  const IDS = {
    coach: "00000000-0000-4000-8000-00000000c0ac",
    c1: "00000000-0000-4000-8000-000000000c01",   // Thomas : client complet
    c2: "00000000-0000-4000-8000-000000000c02",   // Sarah : cliente, programme en préparation
    c3: "00000000-0000-4000-8000-000000000c03",   // Julien : client inactif
    p1: "00000000-0000-4000-8000-000000000d01",   // Léa : prospecte, questionnaire fait, plan d'action pas encore proposé
    p2: "00000000-0000-4000-8000-000000000d02",   // Nadia : prospecte active, a cliqué « Récupérer mon plan d'action »
    p3: "00000000-0000-4000-8000-000000000d03"    // Karim : inscrit hier, rien fait
  };

  /* comptes de connexion (n'importe quel mot de passe est accepté dans la démo) */
  const utilisateurs = {
    [IDS.coach]: { email: "coach@demo.mhx", meta: { prenom: "Lucas", nom: "Démo" } },
    [IDS.c1]: { email: "thomas@demo.mhx", meta: { prenom: "Thomas", nom: "Démo", consentement: "2026-09-01T10:00:00.000Z", conditions_version: "2026-10-01", consentement_sante: "2026-09-01T10:05:00.000Z", sante_version: "2026-10-01", sante_ecran: "mensurations", newsletter: null } },
    [IDS.c2]: { email: "sarah@demo.mhx", meta: { prenom: "Sarah", nom: "Démo", consentement: "2026-09-05T10:00:00.000Z", conditions_version: "2026-10-01", consentement_sante: "2026-09-05T10:05:00.000Z", sante_version: "2026-10-01", sante_ecran: "calculateur" } },
    [IDS.c3]: { email: "julien@demo.mhx", meta: { prenom: "Julien", nom: "Démo", consentement: "2026-09-10T10:00:00.000Z", conditions_version: "2026-10-01" } },
    [IDS.p1]: { email: "lea@demo.mhx", meta: { prenom: "Léa", nom: "Démo", consentement: instantIlYA(2, 19), conditions_version: "2026-10-01", newsletter: instantIlYA(2, 19), newsletter_version: "2026-10-01" } },
    [IDS.p2]: { email: "nadia@demo.mhx", meta: { prenom: "Nadia", nom: "Démo", consentement: instantIlYA(6, 20), conditions_version: "2026-10-01", consentement_sante: instantIlYA(6, 20), sante_version: "2026-10-01", sante_ecran: "calculateur", newsletter: null } },
    [IDS.p3]: { email: "karim@demo.mhx", meta: { prenom: "Karim", nom: "Démo", consentement: instantIlYA(1, 22), conditions_version: "2026-10-01", newsletter: instantIlYA(1, 22), newsletter_version: "2026-10-01" } }
  };

  const profils = [
    { id: IDS.coach, prenom: "Lucas", nom: "Démo", role: "coach", statut: "client", cree_le: "2026-08-01T10:00:00Z" },
    { id: IDS.c1, prenom: "Thomas", nom: "Démo", role: "client", statut: "client", cree_le: "2026-09-01T10:00:00Z" },
    { id: IDS.c2, prenom: "Sarah", nom: "Démo", role: "client", statut: "client", cree_le: "2026-09-05T10:00:00Z" },
    { id: IDS.c3, prenom: "Julien", nom: "Démo", role: "client", statut: "client", cree_le: "2026-09-10T10:00:00Z" },
    { id: IDS.p1, prenom: "Léa", nom: "Démo", role: "client", statut: "prospect", cree_le: instantIlYA(2, 19) },
    { id: IDS.p2, prenom: "Nadia", nom: "Démo", role: "client", statut: "prospect", cree_le: instantIlYA(6, 20) },
    { id: IDS.p3, prenom: "Karim", nom: "Démo", role: "client", statut: "prospect", cree_le: instantIlYA(1, 22) }
  ];

  /* ---------- Thomas : client complet ---------- */
  const intakeC1 = {
    nom: "Thomas Démo", age: 32, sexe: "Homme", ville: "Lyon", taille: 180, poids: 83, poids_obj: 78,
    m_taille: 88, m_hanches: 96, objectif: "Perte de poids / sèche", objectif_phrase: "Perdre 5 kg d'ici décembre",
    pret: "8", niveau: "Intermédiaire (6 mois à 2 ans)", lieu: "Salle complète", seances: "4", duree: "60 min",
    journee_type: "Petit-déj : tartines. Midi : sandwich. Soir : pâtes.", nb_repas: "4 repas (3 + une collation)",
    regime_type: "Omnivore", allergenes: "Gluten", sommeil_h: 7, stress: "6", energie: "5", fume: "Non", complet: true
  };
  const exo = (nom, series, reps, repos, note, lien) => ({ nom, series, reps, repos, note: note || "", lien: lien || "", id: "" });
  const programmeC1 = {
    nom: "Bloc 1 — 4 semaines", note: "On installe la technique. Charge secondaire, amplitude complète.",
    debut: ilYA(24), maj: "01/09/2026", cycle: "haut_bas", duree_semaines: 4,
    seances: [
      { nom: "Séance A — Haut du corps", note: "Échauffement 8 min avant.", exercices: [
        exo("Développé couché", "4", "8-10", "90 s", "Descente contrôlée"),
        exo("Tirage vertical", "4", "10-12", "90 s"),
        exo("Élévations latérales", "3", "12-15", "60 s"),
        exo("Curl haltères", "3", "10-12", "60 s") ] },
      { nom: "Séance B — Bas du corps", note: "", exercices: [
        exo("Squat barre", "4", "8-10", "150 s", "Talons au sol"),
        exo("Fentes marchées", "3", "10-12", "90 s"),
        exo("Leg curl", "3", "12-15", "60 s") ] },
      { nom: "Séance C — Corps entier", note: "", exercices: [
        exo("Soulevé de terre roumain", "4", "8-10", "120 s"),
        exo("Développé militaire", "3", "8-10", "90 s"),
        exo("Gainage latéral", "3", "30 s", "30 s") ] },
      { nom: "Séance D — Cardio / mobilité", note: "", exercices: [
        exo("Marche sur place", "1", "10 min", "—"),
        exo("Wall angels", "2", "10", "30 s") ] }
    ],
    objectifs: { mois: MOIS, liste: ["4 entraînements par semaine", "Respecter le plan alimentaire à 90 %", "Atteindre 80 kg"], statuts: ["", "", "non_atteint"] }
  };
  /* bilans : la semaine passée est faite (feedback du dimanche : note sur 10 + 3 cases), celle en cours non */
  const checkinsC1 = { liste: [
    { semaine: lundiPrec2, fin: dimPrec2, format: "dimanche", envoye_le: dimPrec2, envoye_a: dimPrec2 + "T19:40:00.000Z",
      reponses: { note: 6, training: "3 séances sur 4, j'ai sauté la séance C.", alimentation: "Correct en semaine, trop de restaurant le week-end.", autre: "Sommeil moyen, je me couche tard." } },
    { semaine: lundiPrec, fin: dimPrec, format: "dimanche", envoye_le: dimPrec, envoye_a: dimPrec + "T20:05:00.000Z",
      reponses: { note: 8, training: "4 séances, les charges montent sur le développé couché.", alimentation: "Bien, sauf samedi soir.", autre: "Un peu fatigué jeudi mais globalement en forme." } }
  ] };
  const feedbacksC1 = { liste: [
    { semaine: lundiPrec2, fin: dimPrec2, date: lundiPrec2 + "T08:30:00.000Z", ecrit_a: lundiPrec2 + "T08:30:00.000Z", bilan: dimPrec2 + "T19:40:00.000Z",
      texte: "Bon boulot sur les 3 séances. Pour la séance C, cale-la le dimanche matin : c'est la plus courte. Côté resto, prends une protéine + légumes et garde le dessert pour une fois sur deux. Le sommeil est ta priorité cette semaine : lumière basse après 22 h." },
    { semaine: lundiPrec, fin: dimPrec, date: jourSem(0) + "T08:10:00.000Z", ecrit_a: jourSem(0) + "T08:10:00.000Z", bilan: dimPrec + "T20:05:00.000Z",
      texte: "4/4, c'est exactement ce qu'on voulait. Tu passes à 60 kg au développé couché cette semaine. Samedi soir : zéro culpabilité, c'est prévu dans la marge. On ajoute 10 min de marche après le dîner les jours sans séance." }
  ] };

  const serie = (r, c) => ({ r, c });
  const seanceJ = (date, si, nom, exos) => ({ date, si, nom, exos });
  const journalC1 = { seances: [
    seanceJ(ilYA(23), 0, "Séance A — Haut du corps", [{ nom: "Développé couché", series: [serie(10, 50), serie(9, 50), serie(8, 50), serie(8, 50)] }]),
    seanceJ(ilYA(21), 1, "Séance B — Bas du corps", [{ nom: "Squat barre", series: [serie(10, 60), serie(10, 60), serie(9, 60)] }]),
    seanceJ(ilYA(16), 0, "Séance A — Haut du corps", [{ nom: "Développé couché", series: [serie(10, 52.5), serie(10, 52.5), serie(9, 52.5), serie(8, 52.5)] }]),
    seanceJ(ilYA(14), 1, "Séance B — Bas du corps", [{ nom: "Squat barre", series: [serie(10, 62.5), serie(10, 62.5), serie(10, 62.5)] }]),
    seanceJ(ilYA(12), 2, "Séance C — Corps entier", [{ nom: "Soulevé de terre roumain", series: [serie(10, 60), serie(10, 60)] }]),
    seanceJ(ilYA(9), 0, "Séance A — Haut du corps", [{ nom: "Développé couché", series: [serie(10, 55), serie(10, 55), serie(10, 55), serie(9, 55)] }]),
    seanceJ(ilYA(7), 1, "Séance B — Bas du corps", [{ nom: "Squat barre", series: [serie(10, 65), serie(10, 65), serie(10, 65)] }]),
    seanceJ(jourSem(0), 0, "Séance A — Haut du corps", [{ nom: "Développé couché", series: [serie(10, 57.5), serie(10, 57.5), serie(9, 57.5), serie(8, 57.5)] }]),
    seanceJ(jourSem(1), 1, "Séance B — Bas du corps", [{ nom: "Squat barre", series: [serie(10, 67.5), serie(10, 67.5), serie(9, 67.5)] }]),
    seanceJ(jourSem(2), 2, "Séance C — Corps entier", [{ nom: "Soulevé de terre roumain", series: [serie(10, 62.5), serie(10, 62.5)] }])
  ] };

  const repasCarte = (moment, moment_nom, ordre, id, nom, ingr, macros) => ({
    moment, moment_nom, ordre, recette_id: id, nom, temps_min: 10,
    etapes: ["Préparer les ingrédients.", "Cuire et assaisonner.", "Servir."],
    ingredients: ingr.map(([n, g]) => ({ aliment_id: "x-" + n.toLowerCase().replace(/[^a-z]+/g, "-"), nom: n, categorie: "Féculents", grammes: g })),
    macros, allergenes: [], inconnus: 0
  });
  const jourRepas = (nom, k) => ({ nom, manquants: [], complement: null, diagnostic: [], repas: [
    repasCarte("petit_dejeuner", "Petit-déjeuner", 0, "r-pdj-" + k, k % 2 ? "Porridge banane et beurre de cacahuète" : "Œufs brouillés, pain complet, fruit",
      [["Flocons d'avoine", 80], ["Lait demi-écrémé", 250], ["Banane", 120], ["Beurre de cacahuète", 20]], { kcal: 560, proteines: 24, glucides: 78, lipides: 16 }),
    repasCarte("dejeuner", "Déjeuner", 1, "r-dej-" + k, k % 2 ? "Poulet, riz basmati et brocolis" : "Saumon, patate douce et haricots verts",
      [["Blanc de poulet", 180], ["Riz basmati cru", 90], ["Brocoli", 200], ["Huile d'olive", 10]], { kcal: 760, proteines: 58, glucides: 82, lipides: 18 }),
    repasCarte("collation", "Collation", 2, "r-col-" + k, "Skyr, fruits rouges et amandes",
      [["Skyr", 200], ["Fruits rouges", 100], ["Amandes", 15]], { kcal: 280, proteines: 26, glucides: 22, lipides: 9 }),
    repasCarte("diner", "Dîner", 3, "r-din-" + k, k % 2 ? "Bœuf haché 5 %, pâtes complètes et courgettes" : "Omelette, pommes de terre et salade",
      [["Bœuf haché 5 %", 150], ["Pâtes complètes crues", 90], ["Courgette", 200], ["Parmesan", 15]], { kcal: 640, proteines: 52, glucides: 70, lipides: 16 })
  ] });
  const repasC1 = {
    nom: "", note: "Bois 2 L d'eau par jour. Les grammages sont crus.",
    cible: { kcal: 2240, prot: 183, gluc: 231, lip: 83 }, regime: "Omnivore", allergenes: ["gluten"], nb_repas: 4, maj: "01/09/2026", debut: ilYA(24),
    jours: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"].map(jourRepas)
  };
  const idxJour = (new Date().getDay() + 6) % 7;
  const hist = {};
  for (let n = 27; n >= 1; n--) hist[ilYA(n)] = { c: n % 5 === 0 ? 2 : n % 3 === 0 ? 3 : 4, p: 4 };
  hist[AUJ] = { c: 2, p: 4 };
  const repasSuiviC1 = { date: AUJ, mange: { [idxJour + ":0"]: true, [idxJour + ":1"]: true }, courses: {}, joursCourses: {}, hist };

  const zones = ["Poitrine", "Épaules", "Bras gauche", "Bras droit", "Taille", "Ventre", "Hanches", "Cuisse gauche", "Cuisse droite", "Mollet"];
  const mensC1 = {
    dstart: ilYA(28), pstart: 84.0, zones, affichees: [4, 5], compo_affichee: "mg",
    mesures: [
      { sem: 1, date: ilYA(21), poids: 83.4, vals: { 0: 101, 4: 88.5, 5: 93 }, compo: { mg: 22.8, mm: 61.5 } },
      { sem: 2, date: ilYA(14), poids: 83.0, vals: { 0: 101, 4: 88, 5: 92.5 }, compo: { mg: 22.4, mm: 61.8 } },
      { sem: 3, date: ilYA(7), poids: 82.6, vals: { 0: 100.5, 4: 87.5, 5: 92 }, compo: { mg: 22.0, mm: 62.0 } },
      { sem: 4, date: jourSem(1), poids: 82.4, vals: { 0: 100.5, 4: 87, 5: 91.5 }, compo: { mg: 21.7, mm: 62.2 } }
    ]
  };
  const complementsC1 = { note: "Whey seulement les jours d'entraînement, si le repas post-séance est loin.", liste: [
    { ref: "whey", nom: "Protéine whey", dose: 30, unite: "g", moment: "Collation ou après la séance", note: "Dans 250 ml d'eau", proteine: true, par100: { kcal: 390, prot: 80, gluc: 6, lip: 6 } },
    { ref: "creatine", nom: "Créatine monohydrate", dose: 3, unite: "g", moment: "Chaque jour, à n'importe quelle heure", note: "", proteine: false, par100: null },
    { ref: "omega3", nom: "Oméga 3", dose: 2, unite: "g", moment: "Pendant un repas", note: "", proteine: false, par100: null }
  ] };
  const formationC1 = {
    coches: { p1a: true, p1b: true, p1c: true, p2a: true, p2b: true, m0a: true, m0b: true, m1a: true, m1b: true, m1c: true },
    ouvert: "m1", lecon: "", challenge: "c1", defis: {}, diete: {}, semaine: 1, jour: 0,
    priorites: { semaine: [{ id: "a1", t: "3 séances", fait: false }], demain: [] }, notes: [], objectifs: []
  };
  const histProgrammeC1 = { liste: [{ nom: "Bloc 0 — mise en route", du: ilYA(52), au: ilYA(24), contenu: { nom: "Bloc 0 — mise en route", note: "", seances: [
    { nom: "Séance A", note: "", exercices: [exo("Squat gobelet", "3", "12", "60 s"), exo("Pompes", "3", "10", "60 s")] } ] } }] };
  const calcC1 = { sexe: "H", age: 32, taille: 180, poids: 83, pas: 8000, heures: 5, objectif: "perte" };
  const notesC1 = { texte: "Répond vite aux messages. Objectif perso : mariage de son frère en décembre. Attention au genou gauche sur les fentes (dit que ça tire parfois).", maj: ilYA(3) + "T10:00:00.000Z" };

  /* ---------- Léa : prospecte, questionnaire fait il y a 2 jours, plan d'action pas encore proposé ---------- */
  const intakeP1 = {
    email_compte: "lea@demo.mhx",
    probleme: "Perdre du gras",
    obstacle: "Le manque de temps, Je craque sur la nourriture — Je travaille en horaires décalés", obstacle_choix: ["temps", "craquages"], obstacle_precision: "Je travaille en horaires décalés",
    projection: "Rentrer à nouveau dans mes vêtements préférés", projection_choix: ["vetements"], projection_precision: "",
    objectif: "Perte de poids / sèche",
    court_le: instantIlYA(2, 19)
  };
  /* ---------- Nadia : prospecte active depuis 6 jours, calcul fait, pesée faite, a cliqué « Récupérer mon plan d'action » ---------- */
  const intakeP2 = {
    email_compte: "nadia@demo.mhx",
    probleme: "Me remettre en forme",
    obstacle: "La motivation retombe vite, Personne pour me suivre et me recadrer", obstacle_choix: ["motivation", "suivi"], obstacle_precision: "",
    projection: "Avoir de l'énergie toute la journée", projection_choix: ["energie"], projection_precision: "",
    objectif: "Santé & énergie au quotidien",
    court_le: instantIlYA(6, 20), bilan_propose: { choix: "plus_tard", le: instantIlYA(6, 20) }
  };
  const challengeP2 = { version: 1, jours: {}, cta: { clics: [{ jour: ilYA(1), source: "declic_premiere_pesee", date: instantIlYA(1, 8) }], plus_tard: [{ jour: ilYA(6), source: "apres_questionnaire", date: instantIlYA(6, 20) }] } };
  const calcP2 = { sexe: "F", age: 34, taille: 167, poids: 71, pas: 6000, heures: 2, objectif: "maintien", enregistre: instantIlYA(4, 12) };
  const mensP2 = { dstart: ilYA(1), pstart: 71.0, zones, affichees: [4, 5], compo_affichee: "mg", mesures: [{ sem: 1, date: ilYA(1), poids: 71.0, vals: {} }] };
  const activiteP2 = { version: 1, jours: [ilYA(6), ilYA(4), ilYA(1)], pages: { "decouverte-accueil": 5, calculateur: 2, mensurations: 1, formation: 3 }, temps_s: 1140, derniere: instantIlYA(1, 8) };
  const activiteP1 = { version: 1, jours: [ilYA(2), ilYA(1)], pages: { "decouverte-questionnaire": 1, "decouverte-accueil": 2, formation: 1 }, temps_s: 420, derniere: instantIlYA(1, 12) };
  const activiteP3 = { version: 1, jours: [ilYA(1)], pages: { "decouverte-questionnaire": 1 }, temps_s: 40, derniere: instantIlYA(1, 22) };
  const activiteC1 = { version: 1, jours: [27, 26, 24, 23, 21, 20, 19, 17, 16, 14, 13, 12, 10, 9, 8, 7, 6, 5, 3, 2, 1, 0].map(ilYA), pages: { accueil: 60, programme: 31, nutrition: 48, mensurations: 9, suivi: 12, formation: 6 }, temps_s: 15600, derniere: instantIlYA(0, 7) };
  const activiteC2 = { version: 1, jours: [13, 12, 10, 8, 6, 3].map(ilYA), pages: { accueil: 9, mensurations: 4, formation: 5, profil: 2 }, temps_s: 2400, derniere: instantIlYA(3, 21) };
  const activiteC3 = { version: 1, jours: [23, 20, 16, 12].map(ilYA), pages: { accueil: 5, mensurations: 2 }, temps_s: 600, derniere: instantIlYA(12, 13) };
  const suiviP2 = { version: 1, issue: null, issue_le: null, note: "", relances: [], historique: [] };

  /* ---------- la table donnees ---------- */
  const donnees = [
    [IDS.c1, "intake", intakeC1, ilYA(2)], [IDS.c1, "programme", programmeC1, ilYA(24)], [IDS.c1, "journal", journalC1, jourSem(2)],
    [IDS.c1, "repas", repasC1, ilYA(24)], [IDS.c1, "repas_suivi", repasSuiviC1, AUJ], [IDS.c1, "mens", mensC1, jourSem(1)],
    [IDS.c1, "complements", complementsC1, ilYA(20)], [IDS.c1, "formation", formationC1, ilYA(3)],
    [IDS.c1, "objectifs_faits", { mois: MOIS, faits: [true, false, false] }, ilYA(1)], [IDS.c1, "prefs", { langue: "fr" }, ilYA(10)],
    [IDS.c1, "hist_programme", histProgrammeC1, ilYA(24)], [IDS.c1, "checkins", checkinsC1, dimPrec], [IDS.c1, "feedbacks", feedbacksC1, ilYA(1)],
    [IDS.c1, "hist_repas", { liste: [] }, ilYA(24)], [IDS.c1, "calc", calcC1, ilYA(24)], [IDS.c1, "notes_coach", notesC1, ilYA(3)], [IDS.c1, "activite", activiteC1, ilYA(0)],
    /* Sarah : questionnaire fait, mesures, pas encore de programme ni de diète (le coach les prépare) */
    [IDS.c2, "intake", Object.assign({}, intakeC1, { nom: "Sarah Démo", sexe: "Femme", age: 29, taille: 165, poids: 68.2, poids_obj: 62, ville: "Bordeaux", lieu: "À la maison (haltères)", seances: "3", objectif_phrase: "Me sentir bien dans mes vêtements avant l'été" }), ilYA(3)],
    [IDS.c2, "mens", { dstart: ilYA(20), pstart: 69.0, zones, affichees: [4, 5], compo_affichee: "mg", mesures: [
      { sem: 1, date: ilYA(13), poids: 68.6, vals: { 4: 74 } }, { sem: 2, date: ilYA(3), poids: 68.2, vals: { 4: 73.5 } }] }, ilYA(3)],
    [IDS.c2, "formation", { coches: { p1a: true }, ouvert: "", lecon: "", challenge: "", defis: {}, diete: {}, semaine: 1, jour: 0, priorites: { semaine: [], demain: [] }, notes: [], objectifs: [] }, ilYA(3)],
    [IDS.c2, "calc", { sexe: "F", age: 29, taille: 165, poids: 68.2, pas: 7000, heures: 3, objectif: "perte" }, ilYA(3)], [IDS.c2, "activite", activiteC2, ilYA(3)],
    /* Julien : questionnaire incomplet, inactif depuis 12 jours */
    [IDS.c3, "intake", { nom: "Julien Démo", age: 41, sexe: "Homme", taille: 176, poids: 91.2, complet: false }, ilYA(12)],
    [IDS.c3, "mens", { dstart: ilYA(30), pstart: 92.0, zones, affichees: [4, 5], compo_affichee: "mg", mesures: [{ sem: 1, date: ilYA(23), poids: 91.6, vals: {} }, { sem: 2, date: ilYA(12), poids: 91.2, vals: {} }] }, ilYA(12)], [IDS.c3, "activite", activiteC3, ilYA(12)],
    /* Léa (prospecte) */
    [IDS.p1, "intake", intakeP1, ilYA(2)], [IDS.p1, "activite", activiteP1, ilYA(1)], [IDS.p1, "emails", { newsletter: true, maj: instantIlYA(2, 19), version: "2026-10-01", source: "inscription" }, ilYA(2)],
    /* Nadia (prospecte) */
    [IDS.p2, "intake", intakeP2, ilYA(6)], [IDS.p2, "challenge", challengeP2, ilYA(1)], [IDS.p2, "calc_perso", calcP2, ilYA(4)], [IDS.p2, "mens", mensP2, ilYA(1)],
    [IDS.p2, "activite", activiteP2, ilYA(1)], [IDS.p2, "suivi_prospect", suiviP2, ilYA(5)], [IDS.p2, "emails", { newsletter: false, maj: instantIlYA(6, 20), version: "2026-10-01", source: "inscription" }, ilYA(6)],
    /* Karim (prospect) : inscrit hier, rien d'autre */
    [IDS.p3, "emails", { newsletter: true, maj: instantIlYA(1, 22), version: "2026-10-01", source: "inscription" }, ilYA(1)], [IDS.p3, "activite", activiteP3, ilYA(1)],
    /* Coach : ses propres outils */
    [IDS.coach, "intake", { nom: "Lucas Démo", complet: true, age: 28, sexe: "Homme", taille: 182, poids: 84, objectif: "Performance / condition physique", niveau: "Avancé (2 ans et +)", lieu: "Salle complète", seances: "5", journee_type: "-", nb_repas: "4 repas (3 + une collation)", regime_type: "Omnivore" }, ilYA(1)]
  ].map(([user_id, outil, contenu, d]) => ({ user_id, outil, contenu, maj_le: d + "T08:30:00+00:00" }));

  const bibliotheque = [
    { id: "b1", coach_id: IDS.coach, nom: "Haut / Bas — 4 séances", note: "", contenu: { type: "entrainement", seances: programmeC1.seances.slice(0, 2) }, cree_le: ilYA(15) + "T09:00:00Z" },
    { id: "b2", coach_id: IDS.coach, nom: "Semaine 2 200 kcal omnivore", note: "", contenu: { type: "repas", jours: repasC1.jours.slice(0, 3) }, cree_le: ilYA(10) + "T09:00:00Z" }
  ];

  /* compteur de connexions (table connexions, lue par le coach) */
  const connexions = [
    { user_id: IDS.c1, nombre: 41, premiere: "2026-09-01T10:12:00+00:00", derniere: instantIlYA(0, 7), dernier_jour: AUJ },
    { user_id: IDS.c2, nombre: 12, premiere: "2026-09-05T18:02:00+00:00", derniere: instantIlYA(3, 21), dernier_jour: ilYA(3) },
    { user_id: IDS.c3, nombre: 4, premiere: "2026-09-10T12:40:00+00:00", derniere: instantIlYA(12, 13), dernier_jour: ilYA(12) },
    { user_id: IDS.p1, nombre: 2, premiere: instantIlYA(2, 19), derniere: instantIlYA(1, 12), dernier_jour: ilYA(1) },
    { user_id: IDS.p2, nombre: 5, premiere: instantIlYA(6, 20), derniere: instantIlYA(1, 8), dernier_jour: ilYA(1) },
    { user_id: IDS.p3, nombre: 1, premiere: instantIlYA(1, 22), derniere: instantIlYA(1, 22), dernier_jour: ilYA(1) }
  ];

  return { IDS, utilisateurs, profils, donnees, bibliotheque, connexions, AUJ };
})();
