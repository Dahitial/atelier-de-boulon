/* L'Atelier de Boulon — module « L'atelier de Rivet » : les missions et leurs grilles.
   Deux paliers : le CP (flèches : h = en haut, d = à droite, b = en bas, g = à gauche) et le CE2
   (commandes d'un vrai robot : av = avance, g = tourne à gauche, d = tourne à droite).
   « r2 », « r3 », « r4 » = répète 2, 3, 4 fois la carte qui suit.

   Une grille : { n (côté), depart: [colonne, ligne(, direction au CE2)], but: [c, l], cailloux: [[c, l]…],
                  murs: [[c, l, "d" | "b"]…] (un mur à droite ou en bas de la case), sol: le programme de
                  référence (il sert de limite de cartes pour « répéter », et de base au « bug ») }
   « bug » : le programme de référence, avec la carte bug.i remplacée par bug.faux.
   Toutes les grilles sont vérifiées par outils : robotique-verifier.js (dans le dossier du module). */
"use strict";

const ROBO_MISSIONS = {
  cp: [
    { id: "fleches", nom: "Les flèches", icone: "→", mode: "direct",
      consigne: "Clique sur les flèches : Rivet avance tout de suite. Va chercher l'écrou !",
      grilles: [
        { n: 4, depart: [0, 3], but: [3, 3], cailloux: [] },
        { n: 4, depart: [0, 3], but: [3, 0], cailloux: [[1, 2], [2, 3]] },
        { n: 5, depart: [0, 4], but: [4, 0], cailloux: [[1, 4], [1, 3], [1, 2], [3, 0], [3, 1], [3, 2]] },
        { n: 5, depart: [2, 4], but: [2, 0], cailloux: [[1, 3], [2, 3], [3, 3], [1, 1], [2, 1], [3, 1]] },
      ] },
    { id: "programme", nom: "Le programme", icone: "▶", mode: "programme",
      consigne: "Prépare toutes les flèches, puis appuie sur « Go ! ».",
      grilles: [
        { n: 4, depart: [0, 3], but: [2, 1], cailloux: [[1, 3]] },
        { n: 5, depart: [0, 4], but: [4, 0], cailloux: [[2, 4], [2, 3], [1, 1], [3, 1]] },
        { n: 5, depart: [4, 4], but: [0, 0], cailloux: [[3, 4], [3, 3], [1, 2], [2, 2], [1, 0]] },
        { n: 5, depart: [0, 2], but: [4, 2], cailloux: [[2, 1], [2, 2], [2, 3]] },
      ] },
    { id: "repeter", nom: "Répéter", icone: "3×", mode: "programme", repete: true,
      consigne: "La carte « fois » répète la flèche qui suit. Il y a peu de cases : utilise-la !",
      grilles: [
        { n: 4, depart: [0, 3], but: [3, 3], cailloux: [], sol: ["r3", "d"] },
        { n: 5, depart: [0, 4], but: [2, 1], cailloux: [[3, 4], [1, 2]], sol: ["r2", "d", "r3", "h"] },
        { n: 5, depart: [0, 0], but: [4, 4], cailloux: [[1, 1], [2, 2], [3, 3]], sol: ["r4", "d", "r4", "b"] },
        { n: 5, depart: [0, 4], but: [0, 0], cailloux: [[0, 1], [0, 2], [0, 3], [1, 1], [1, 2], [1, 3], [2, 1], [2, 2], [2, 3], [3, 1], [3, 2], [3, 3]],
          sol: ["r4", "d", "r4", "h", "r4", "g"] },
      ] },
    { id: "bug", nom: "Le bug", icone: "🐞", mode: "bug",
      consigne: "Une flèche fait rater Rivet. Clique dessus pour la changer, puis « Go ! ».",
      grilles: [
        { n: 4, depart: [0, 3], but: [3, 3], cailloux: [], sol: ["d", "d", "d"], bug: { i: 1, faux: "h" } },
        { n: 4, depart: [0, 3], but: [3, 0], cailloux: [[1, 2], [2, 1]], sol: ["h", "h", "h", "d", "d", "d"], bug: { i: 3, faux: "b" } },
        { n: 5, depart: [0, 4], but: [4, 0], cailloux: [[2, 4], [2, 3], [1, 1], [3, 1]], sol: ["h", "h", "h", "h", "d", "d", "d", "d"], bug: { i: 5, faux: "b" } },
        { n: 5, depart: [2, 4], but: [2, 0], cailloux: [[1, 2], [2, 2], [3, 2]], sol: ["g", "g", "h", "h", "h", "h", "d", "d"], bug: { i: 2, faux: "d" } },
      ] },
    { id: "robot", nom: "C'est quoi un robot ?", icone: "🤖", mode: "quiz" },
  ],
  ce2: [
    { id: "programme", nom: "Le programme", icone: "▶", mode: "programme", relatif: true,
      consigne: "Rivet regarde dans la direction de son nez rouge. « Avance » le fait aller tout droit, « tourne » le fait pivoter sur place.",
      grilles: [
        { n: 5, depart: [0, 4, "droite"], but: [4, 4], cailloux: [] },
        { n: 5, depart: [0, 4, "droite"], but: [2, 2], cailloux: [[3, 4], [1, 3]] },
        { n: 5, depart: [0, 4, "haut"], but: [4, 0], cailloux: [[0, 1], [2, 3]], murs: [[1, 2, "d"], [2, 0, "b"]] },
        { n: 6, depart: [0, 5, "droite"], but: [5, 0], cailloux: [[2, 2], [1, 3], [4, 5]], murs: [[4, 4, "b"], [4, 3, "b"], [3, 1, "d"], [4, 0, "b"]] },
      ] },
    { id: "boucles", nom: "Les boucles", icone: "🔁", mode: "programme", relatif: true, repete: true,
      consigne: "« Répète » fait plusieurs fois la carte qui suit. Il y a peu de cases : utilise les boucles !",
      grilles: [
        { n: 6, depart: [0, 5, "droite"], but: [5, 5], cailloux: [], sol: ["r4", "av", "av"] },
        { n: 6, depart: [0, 5, "droite"], but: [5, 0], cailloux: [[2, 2], [1, 3]], murs: [[4, 4, "b"], [4, 3, "b"], [3, 1, "d"], [4, 0, "b"]],
          sol: ["r4", "av", "av", "g", "r4", "av", "av"] },
        { n: 6, depart: [0, 5, "haut"], but: [3, 2], cailloux: [[1, 4], [2, 4], [1, 1]], sol: ["r3", "av", "d", "r3", "av"] },
        { n: 6, depart: [0, 0, "bas"], but: [5, 0], cailloux: [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [3, 0], [3, 1], [3, 2], [3, 3], [3, 4]],
          sol: ["r4", "av", "av", "g", "r4", "av", "av", "g", "r4", "av", "av"] },
      ] },
    { id: "bug", nom: "Le bug", icone: "🐞", mode: "bug", relatif: true,
      consigne: "Le programme a une erreur. Clique sur la carte fausse pour la changer, puis « Go ! ».",
      grilles: [
        { n: 5, depart: [0, 4, "droite"], but: [4, 4], cailloux: [], sol: ["av", "av", "av", "av"], bug: { i: 2, faux: "g" } },
        { n: 5, depart: [0, 4, "droite"], but: [2, 2], cailloux: [[3, 4], [1, 3]], sol: ["av", "av", "g", "av", "av"], bug: { i: 2, faux: "d" } },
        { n: 6, depart: [0, 5, "droite"], but: [5, 0], cailloux: [[2, 2], [1, 3]], murs: [[4, 4, "b"], [4, 3, "b"], [3, 1, "d"], [4, 0, "b"]],
          sol: ["r4", "av", "av", "g", "r4", "av", "av"], bug: { i: 3, faux: "d" } },
        { n: 6, depart: [0, 0, "bas"], but: [5, 0], cailloux: [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [3, 0], [3, 1], [3, 2], [3, 3], [3, 4]],
          sol: ["r4", "av", "av", "g", "r4", "av", "av", "g", "r4", "av", "av"], bug: { i: 7, faux: "d" } },
      ] },
    { id: "pixels", nom: "Code une image", icone: "▦", mode: "pixels",
      consigne: "Lis le code de chaque ligne, et noircis les bonnes cases. Quelle image se cache ?",
      images: [
        { nom: "un cœur", lignes: ["01100110", "11111111", "11111111", "11111111", "01111110", "00111100", "00011000", "00000000"] },
        { nom: "une maison", lignes: ["00011000", "00111100", "01111110", "11111111", "01111110", "01101110", "01110110", "01110110"] },
        { nom: "une flèche", lignes: ["00010000", "00011000", "11111100", "11111110", "11111100", "00011000", "00010000", "00000000"] },
        { nom: "un robot", lignes: ["00011000", "01111110", "01100110", "01111110", "01000010", "01111110", "00100100", "00100100"] },
      ] },
    { id: "capteurs", nom: "Les capteurs", icone: "📡", mode: "quiz" },
  ],
};
