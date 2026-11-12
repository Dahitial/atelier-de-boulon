/* L'Atelier de Boulon — module « L'atelier de Rivet » : le calcul des déplacements (sans dessin).
   Le même fichier sert au jeu et à l'outil de vérification des grilles (Node). */
"use strict";

const RoboMoteur = {
  DIRS: { haut: [0, -1], droite: [1, 0], bas: [0, 1], gauche: [-1, 0] },
  FLECHES: { h: "haut", d: "droite", b: "bas", g: "gauche" },
  ORDRE: ["haut", "droite", "bas", "gauche"],

  /* peut-on passer de (c, r) à (c2, r2) ? (bords, cailloux, murs) */
  bloque(g, c, r, c2, r2) {
    if (c2 < 0 || r2 < 0 || c2 >= g.n || r2 >= g.n) return true;
    if ((g.cailloux || []).some(([x, y]) => x === c2 && y === r2)) return true;
    return (g.murs || []).some(([x, y, s]) =>
      (s === "d" && y === r && y === r2 && ((x === c && c2 === c + 1) || (x === c2 && c === c2 + 1)))
      || (s === "b" && x === c && x === c2 && ((y === r && r2 === r + 1) || (y === r2 && r === r2 + 1))));
  },

  /* le programme déplié en pas : « r3 » répète 3 fois la carte suivante.
     Chaque pas garde le numéro de la carte (pour l'allumer) et celui de la boucle éventuelle. */
  deplier(prog) {
    const pas = [];
    for (let i = 0; i < prog.length; i++) {
      const p = prog[i];
      if (/^r\d$/.test(p)) {
        const j = i + 1;
        if (j >= prog.length || /^r\d$/.test(prog[j])) continue;   // une boucle sans carte : rien
        for (let k = 0; k < Number(p[1]); k++) pas.push({ cmd: prog[j], i: j, boucle: i });
        i = j;
      } else pas.push({ cmd: p, i, boucle: -1 });
    }
    return pas;
  },

  /* exécute un programme ; renvoie les positions successives et si Rivet arrive sur l'écrou */
  executer(g, prog, relatif) {
    let c = g.depart[0], r = g.depart[1], dir = g.depart[2] || "droite";
    const etapes = [];
    for (const p of this.deplier(prog)) {
      if (relatif && (p.cmd === "g" || p.cmd === "d")) {
        dir = this.ORDRE[(this.ORDRE.indexOf(dir) + (p.cmd === "g" ? 3 : 1)) % 4];
        etapes.push({ c, r, dir, i: p.i, boucle: p.boucle });
        continue;
      }
      const sens = relatif ? dir : this.FLECHES[p.cmd];
      if (!sens) continue;
      const [dc, dr] = this.DIRS[sens];
      if (this.bloque(g, c, r, c + dc, r + dr)) return { etapes, choc: true, i: p.i, arrive: false, c, r, dir };
      c += dc; r += dr;
      etapes.push({ c, r, dir: relatif ? dir : sens, i: p.i, boucle: p.boucle });
    }
    return { etapes, choc: false, arrive: c === g.but[0] && r === g.but[1], c, r, dir };
  },

  /* le plus petit nombre de cartes simples (sans boucle) pour atteindre l'écrou */
  plusCourt(g, relatif) {
    const cle = (c, r, d) => `${c},${r},${relatif ? d : ""}`;
    const dep = { c: g.depart[0], r: g.depart[1], d: g.depart[2] || "droite", k: 0 };
    const vus = new Set([cle(dep.c, dep.r, dep.d)]);
    const file = [dep];
    while (file.length) {
      const s = file.shift();
      if (s.c === g.but[0] && s.r === g.but[1]) return s.k;
      const suites = [];
      if (relatif) {
        const [dc, dr] = this.DIRS[s.d];
        if (!this.bloque(g, s.c, s.r, s.c + dc, s.r + dr)) suites.push({ c: s.c + dc, r: s.r + dr, d: s.d });
        for (const t of [3, 1]) suites.push({ c: s.c, r: s.r, d: this.ORDRE[(this.ORDRE.indexOf(s.d) + t) % 4] });
      } else {
        for (const sens of this.ORDRE) { const [dc, dr] = this.DIRS[sens]; if (!this.bloque(g, s.c, s.r, s.c + dc, s.r + dr)) suites.push({ c: s.c + dc, r: s.r + dr, d: s.d }); }
      }
      for (const n of suites) { const k = cle(n.c, n.r, n.d); if (!vus.has(k)) { vus.add(k); file.push({ ...n, k: s.k + 1 }); } }
    }
    return null;
  },
};
if (typeof module !== "undefined") module.exports = RoboMoteur;
