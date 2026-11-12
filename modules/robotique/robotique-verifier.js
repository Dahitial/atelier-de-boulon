/* Vérifie les grilles de l'atelier de Rivet (à lancer avec Node : node robotique-verifier.js).
   Pour chaque grille : le but est atteignable, le programme de référence y mène sans choc,
   et le programme avec « bug » rate. Affiche aussi le plus court chemin. */
"use strict";
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "js", "robotique-niveaux.js"), "utf8");
const ROBO_MISSIONS = new Function(src + "; return ROBO_MISSIONS;")();
const R = require("./js/robotique-moteur.js");

let erreurs = 0;
for (const [palier, missions] of Object.entries(ROBO_MISSIONS)) {
  for (const m of missions) {
    (m.grilles || []).forEach((g, k) => {
      const nom = `${palier}/${m.id}/${k + 1}`;
      const court = R.plusCourt(g, !!m.relatif);
      if (court == null) { console.log("ERREUR", nom, "but inatteignable"); erreurs++; return; }
      let info = `${nom} : plus court ${court} pas`;
      if (g.sol) {
        const r = R.executer(g, g.sol, !!m.relatif);
        if (!r.arrive) { console.log("ERREUR", nom, "la référence n'arrive pas", JSON.stringify(r)); erreurs++; }
        info += `, référence ${g.sol.length} cartes OK`;
      }
      if (g.bug) {
        const p = g.sol.slice(); p[g.bug.i] = g.bug.faux;
        const r = R.executer(g, p, !!m.relatif);
        if (r.arrive) { console.log("ERREUR", nom, "le bug ne fait pas rater"); erreurs++; }
        info += `, bug rate (${r.choc ? "choc" : "arrêt ailleurs"})`;
      }
      console.log(info);
    });
    /* une image : 8 lignes de 8 cases, et au plus 5 codes par ligne (sinon ils débordent du cadre) */
    const codes = (l) => l.split("").filter((x, i) => i === 0 || x !== l[i - 1]).length;
    (m.images || []).forEach((im) => { if (im.lignes.length !== 8 || im.lignes.some((l) => !/^[01]{8}$/.test(l) || codes(l) > 5)) { console.log("ERREUR image", im.nom); erreurs++; } });
  }
}
console.log(erreurs ? `${erreurs} erreur(s)` : "Toutes les grilles sont bonnes.");
process.exit(erreurs ? 1 : 0);
