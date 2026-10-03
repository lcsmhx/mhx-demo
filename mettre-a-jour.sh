#!/usr/bin/env bash
# Recopie l'app depuis le dépôt mhx-plateforme dans app/, puis remet les trois lignes demo/ dans app/index.html.
# Usage : bash mettre-a-jour.sh /chemin/vers/mhx-plateforme
set -e
SRC="$1"
ICI="$(cd "$(dirname "$0")" && pwd)"
if [ -z "$SRC" ] || [ ! -f "$SRC/index.html" ] || [ ! -d "$SRC/js" ]; then
  echo "Donne le chemin du dépôt mhx-plateforme : bash mettre-a-jour.sh /chemin/vers/mhx-plateforme"; exit 1
fi
rm -rf "$ICI/app/css" "$ICI/app/js" "$ICI/app/polices"
cp -R "$SRC/css" "$SRC/js" "$SRC/polices" "$ICI/app/"
cp "$SRC/index.html" "$ICI/app/index.html"
for f in aliments.json recettes.json programmes.json exercices.json liensexercices.json; do
  [ -f "$SRC/donnees/$f" ] && cp "$SRC/donnees/$f" "$ICI/app/demo/donnees/$f"
done
python3 - "$ICI/app/index.html" <<'EOF'
import sys
p = sys.argv[1]; s = open(p, encoding="utf-8").read()
old = 'var MHX_JS = [\n    "js/config.js",'
new = ('var MHX_JS = [\n'
       '    "demo/donnees.js",      /* DÉMO : données fictives */\n'
       '    "demo/simulation.js",   /* DÉMO : faux backend dans le navigateur (remplace Supabase) */\n'
       '    "js/config.js",\n'
       '    "demo/reglages.js",     /* DÉMO : réglages propres à la démo */')
if old not in s:
    print("ATTENTION : la liste MHX_JS n'a pas la forme attendue, index.html n'a pas été retouché"); sys.exit(1)
s = s.replace(old, new).replace("<title>Plateforme MHX Coaching</title>", "<title>Démo — Plateforme MHX Coaching</title>")
open(p, "w", encoding="utf-8").write(s)
print("app/index.html retouché pour la démo")
EOF
echo "Démo mise à jour depuis $SRC (version : $(grep -o 'MHX_FICHIERS = "[^"]*"' "$ICI/app/index.html"))"
