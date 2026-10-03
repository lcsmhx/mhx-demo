# Démo — Plateforme MHX Coaching

Une copie de l'application MHX Coaching qui tourne **sans serveur et sans vraie base** : les comptes, les données et les chiffres sont inventés (`app/demo/donnees.js`). Elle sert à présenter l'app (prospect, client, coach) sans jamais montrer une donnée réelle.

- `index.html` — la page d'entrée : choix du rôle (Prospect, Client, Coach, Nouvelle inscription).
- `app/` — l'application telle quelle (`index.html`, `css/`, `js/`, `polices/`), copiée depuis le dépôt `mhx-plateforme`.
- `app/demo/` — ce qui fait la démo :
  - `donnees.js` : les données fictives (dates calculées par rapport au jour où on ouvre la démo) ;
  - `simulation.js` : le faux backend dans le navigateur (remplace Supabase : comptes, tables, photos, fonctions) ;
  - `reglages.js` : les réglages propres à la démo (adresse fictive de la base, nouveautés ouvertes à tous, bouton « Démo ») ;
  - `donnees/` : le catalogue public (aliments, recettes, programmes, exercices), lu par l'app comme sur une base vide.

Dans `app/index.html`, la seule différence avec l'app réelle : trois fichiers `demo/` ajoutés à la liste `MHX_JS` (deux avant `js/config.js`, un juste après). Tout le reste est identique.

## Comptes de la démo
`coach@demo.mhx` (Lucas Démo), `thomas@demo.mhx`, `sarah@demo.mhx`, `julien@demo.mhx` (clients), `lea@demo.mhx`, `nadia@demo.mhx`, `karim@demo.mhx` (prospects) — n'importe quel mot de passe. Les modifications faites dans la démo restent dans l'onglet (sessionStorage) et disparaissent quand on le ferme ; « Réinitialiser la démo » sur la page d'entrée efface tout.

## Mettre la démo à jour quand l'app change
```
bash mettre-a-jour.sh /chemin/vers/mhx-plateforme
```
Le script recopie `index.html`, `css/`, `js/`, `polices/` et les fichiers du catalogue, puis remet les trois lignes `demo/` dans `app/index.html`. Ensuite : `git add -A && git commit -m "démo : app vNN" && git push`.

## Mise en ligne
GitHub Pages, branche `main`, dossier racine. Aucun service payant, aucune donnée réelle.
