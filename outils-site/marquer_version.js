/* Pose un nouveau numéro de version (« ?v=AAAAMMJJ-HHMM ») sur les fichiers .js et .css chargés par
   les pages d'entrée : niveaux/<id>/index.html et la page du site (index.html, s'il existe).
   moteur/charger.js recopie ce numéro sur tous les fichiers du jeu.

   Pourquoi : GitHub Pages dit au navigateur de garder chaque fichier 10 minutes. Sans numéro, juste
   après une publication, le navigateur peut mélanger d'anciens et de nouveaux fichiers. Avec un
   nouveau numéro, dès qu'il relit la page d'entrée, il reprend toute la nouvelle version.

   À lancer avant chaque publication : node outils-site/marquer_version.js */
"use strict";
const fs = require("fs");
const path = require("path");

const racine = path.join(__dirname, "..");
const d = new Date();
const deux = (n) => String(n).padStart(2, "0");
const numero = `${d.getFullYear()}${deux(d.getMonth() + 1)}${deux(d.getDate())}-${deux(d.getHours())}${deux(d.getMinutes())}`;

const pages = fs.readdirSync(path.join(racine, "niveaux"))
  .map((n) => path.join(racine, "niveaux", n, "index.html"))
  .concat(path.join(racine, "index.html"))
  .filter((p) => fs.existsSync(p));

/* seulement les adresses locales (pas http://, //, data:) vers un .js ou un .css */
const motif = /\b(src|href)="(?![a-z]+:|\/\/|#)([^"?#]+\.(?:js|css))(?:\?v=[\w.-]*)?"/g;
for (const p of pages) {
  const avant = fs.readFileSync(p, "utf8");
  let n = 0;
  const apres = avant.replace(motif, (_, attr, url) => { n++; return `${attr}="${url}?v=${numero}"`; });
  if (apres !== avant) fs.writeFileSync(p, apres);
  console.log(`${path.relative(racine, p)} : ${n} fichier(s) → ?v=${numero}`);
}
