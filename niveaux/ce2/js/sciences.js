/* L'Atelier de Boulon — Sciences : schémas des leçons et laboratoire d'expériences. */
"use strict";

/* ================================================================== */
/* Schémas animés des leçons de sciences (même lecteur que les autres)  */
/* ================================================================== */
const EMO = (x, y, e, s = 40) => `<text x="${x}" y="${y}" font-size="${s}" text-anchor="middle" dominant-baseline="central">${e}</text>`;

function illuVivant() {
  const etapes = [["🥚", "naître", 200, 50], ["🐥", "grandir", 330, 140], ["🐔", "se reproduire", 200, 230], ["🪦", "mourir", 70, 140]];
  let s = "";
  etapes.forEach(([e, t, x, y], i) => {
    s += Il.E(i, EMO(x, y - 6, e, 44) + Il.T(x, y + 34, t, { s: 17 }));
    const [nx, ny] = etapes[(i + 1) % 4].slice(2);
    if (i < 3) s += Il.E(i + 1, Il.fleche(x + (nx - x) * 0.3, y + (ny - y) * 0.3, x + (nx - x) * 0.66, y + (ny - y) * 0.66, IC.vert));
  });
  return { svg: s, legendes: ["Un être vivant naît : le poussin sort de l'œuf.", "Il se nourrit et grandit.", "Adulte, il peut se reproduire : la poule pond des œufs.", "Un jour, il meurt. Un caillou, lui, ne naît pas et ne grandit pas : il n'est pas vivant."] };
}

function illuGermination() {
  const sol = `<rect x="20" y="190" width="360" height="70" fill="#9c6b3c"/><line x1="20" y1="190" x2="380" y2="190" stroke="${IC.ink}" stroke-width="3"/>`;
  const graine = (x) => `<ellipse cx="${x}" cy="205" rx="10" ry="7" fill="#d9a86b" stroke="${IC.ink}" stroke-width="2"/>`;
  const racine = (x) => `<path d="M${x},210 q-4,18 2,38 M${x},222 q-10,8 -14,16 M${x},226 q10,6 13,14" stroke="#f3e2c7" stroke-width="3" fill="none"/>`;
  const tige = (x, h) => `<path d="M${x},200 q-6,-${h / 2} 0,-${h}" stroke="#5fb648" stroke-width="5" fill="none"/>`;
  const feuilles = (x, y) => `<path d="M${x},${y} q-26,-14 -34,4 q20,10 34,-4 z M${x},${y} q26,-14 34,4 q-20,10 -34,-4 z" fill="#7bc950" stroke="${IC.ink}" stroke-width="2"/>`;
  return {
    svg: sol + Il.E(0, graine(80) + Il.T(80, 160, "graine", { s: 16 }))
      + Il.E(1, graine(170) + racine(170) + Il.T(170, 160, "racine", { s: 16 }))
      + Il.E(2, graine(260) + racine(260) + tige(260, 70) + Il.T(260, 110, "tige", { s: 16 }))
      + Il.E(3, racine(345) + tige(345, 110) + feuilles(345, 95) + Il.T(345, 60, "feuilles", { s: 16 }) + EMO(345, 20, "☀️", 26) + EMO(300, 20, "💧", 22)),
    legendes: ["Une graine dans la terre. Pour germer, elle a besoin d'eau.", "La racine sort la première : elle puise l'eau.", "La tige pousse vers la lumière.", "Les feuilles apparaissent. Avec de l'eau, de la lumière et de l'air, la plante grandit."],
  };
}

function illuChaine() {
  const maillons = [["🌿", "l'herbe", 60], ["🐰", "le lapin", 200], ["🦊", "le renard", 340]];
  let s = "";
  maillons.forEach(([e, t, x], i) => {
    s += Il.E(i, EMO(x, 110, e, 54) + Il.T(x, 170, t, { s: 18 }));
    if (i) s += Il.E(i, Il.fleche(maillons[i - 1][2] + 38, 110, x - 38, 110, IC.rouge) + Il.T((maillons[i - 1][2] + x) / 2, 92, "mangé par", { s: 13, c: IC.rouge, b: false }));
  });
  s += Il.E(3, Il.T(200, 230, "herbivore : le lapin   •   carnivore : le renard", { s: 16, c: IC.vert }));
  return { svg: s, legendes: ["Une chaîne alimentaire commence par une plante : l'herbe.", "L'herbe est mangée par le lapin, un herbivore.", "Le lapin est mangé par le renard, un carnivore.", "La flèche se lit « est mangé par »."] };
}

function illuSquelette() {
  const os = `<g stroke="${IC.ink}" stroke-width="3" fill="#fffaf0">
    <circle cx="200" cy="48" r="26"/><rect x="194" y="74" width="12" height="94" rx="5"/>
    <path d="M168,92 q32,-10 64,0 M166,108 q34,-10 68,0 M168,124 q32,-10 64,0" fill="none"/>
    <path d="M200,84 l-56,10 l-12,60 M200,84 l56,10 l12,60" fill="none"/>
    <path d="M176,168 h48 l-6,20 h-36 z"/><path d="M186,188 l-10,74 M214,188 l10,74" fill="none"/></g>`;
  return {
    svg: os + Il.E(1, Il.R(166, 18, 68, 60, { s: IC.rouge, d: true, rx: 30 }) + Il.T(300, 52, "le crâne", { s: 17, c: IC.rouge }))
      + Il.E(2, Il.R(160, 82, 80, 52, { s: IC.bleu, d: true }) + Il.T(300, 112, "les côtes", { s: 17, c: IC.bleu }))
      + Il.E(3, Il.C(132, 154, 10, { s: IC.vert }) + Il.C(181, 228, 10, { s: IC.vert }) + Il.T(80, 154, "coude", { s: 16, c: IC.vert }) + Il.T(118, 232, "genou", { s: 16, c: IC.vert })),
    legendes: ["Le squelette soutient le corps : environ 206 os.", "Le crâne protège le cerveau.", "Les côtes protègent le cœur et les poumons.", "Aux articulations (coude, genou), les muscles font bouger les os."],
  };
}

function illuDents() {
  const types = [["incisive", IC.bleu, 4], ["canine", IC.rouge, 2], ["molaire", IC.vert, 4]];
  let s = `<path d="M60,250 Q200,-40 340,250" fill="none" stroke="#ef9ab4" stroke-width="34" stroke-linecap="round"/>`;
  const pos = (t) => [(1 - t) ** 2 * 60 + 2 * (1 - t) * t * 200 + t * t * 340, (1 - t) ** 2 * 250 + 2 * (1 - t) * t * -40 + t * t * 250];
  const dents = [];   // de gauche à droite : molaires, canine, incisives, canine, molaires
  for (let i = 0; i < 4; i++) dents.push([2, 0.06 + i * 0.07]);
  dents.push([1, 0.36]);
  for (let i = 0; i < 4; i++) dents.push([0, 0.42 + i * 0.053]);
  dents.push([1, 0.64]);
  for (let i = 0; i < 4; i++) dents.push([2, 0.73 + i * 0.07]);
  const etape = [1, 2, 3];
  dents.forEach(([k, t]) => { const [x, y] = pos(t); s += Il.E(etape[k], `<rect x="${x - 10}" y="${y - 12}" width="20" height="24" rx="${k === 1 ? 10 : 5}" fill="#fff" stroke="${types[k][1]}" stroke-width="3"/>`); });
  s += Il.E(1, Il.T(200, 180, "incisives : couper", { s: 16, c: IC.bleu })) + Il.E(2, Il.T(200, 206, "canines : déchirer", { s: 16, c: IC.rouge })) + Il.E(3, Il.T(200, 232, "molaires : broyer", { s: 16, c: IC.vert }));
  return { svg: Il.E(0, "") + s, legendes: ["Voici la mâchoire du haut.", "Devant, les incisives coupent les aliments.", "Les canines, pointues, déchirent.", "Au fond, les molaires broient. Brosse-toi les dents 2 minutes, 2 fois par jour !"] };
}

function illuAssiette() {
  const parts = [["🥦", "fruits et légumes", 0], ["🍚", "féculents", 1], ["🐟", "viande, poisson, œufs", 2], ["🧀", "produits laitiers", 3]];
  let s = Il.C(118, 140, 100, { f: "#fff" }) + Il.L(118, 40, 118, 240, { w: 2 }) + Il.L(18, 140, 218, 140, { w: 2 });
  const coins = [[78, 98], [158, 98], [78, 182], [158, 182]];
  parts.forEach(([e, t, i]) => { s += Il.E(i, EMO(coins[i][0], coins[i][1], e, 40) + Il.T(236, 62 + i * 32, t, { s: 14, a: "start" })); });
  s += Il.E(4, EMO(345, 225, "💧", 40) + Il.T(345, 268, "de l'eau", { s: 15 }));
  return { svg: s, legendes: ["Un repas équilibré : des fruits et des légumes.", "Des féculents pour l'énergie : riz, pâtes, pain.", "Un peu de viande, de poisson ou un œuf.", "Un produit laitier pour les os.", "Et pour boire : de l'eau !"] };
}

function illuEtats() {
  return {
    svg: Il.E(0, EMO(80, 120, "🧊", 60) + Il.T(80, 185, "solide", { s: 19, c: IC.bleu }) + Il.T(80, 210, "la glace", { s: 14, b: false }))
      + Il.E(1, Il.fleche(120, 120, 160, 120, IC.rouge) + Il.T(140, 100, "fond", { s: 13, c: IC.rouge, b: false }) + EMO(200, 120, "💧", 56) + Il.T(200, 185, "liquide", { s: 19, c: IC.bleu }) + Il.T(200, 210, "plus de 0 °C", { s: 14, b: false }))
      + Il.E(2, Il.fleche(240, 120, 280, 120, IC.rouge) + Il.T(260, 100, "bout", { s: 13, c: IC.rouge, b: false }) + EMO(320, 120, "♨️", 56) + Il.T(320, 185, "gazeux", { s: 19, c: IC.bleu }) + Il.T(320, 210, "la vapeur", { s: 14, b: false }))
      + Il.E(3, Il.T(200, 255, "Quand on refroidit, c'est l'inverse.", { s: 17, c: IC.vert })),
    legendes: ["En dessous de 0 °C, l'eau est solide : c'est la glace.", "Quand on la chauffe, la glace fond : l'eau devient liquide.", "À 100 °C, l'eau bout et devient de la vapeur : elle est gazeuse.", "Quand on refroidit, la vapeur redevient liquide, puis l'eau gèle à 0 °C."],
  };
}

function illuCycleEau() {
  const decor = `<rect x="0" y="210" width="190" height="70" fill="#5bc0eb"/><path d="M190,280 L190,210 L300,110 L400,190 L400,280 z" fill="#7bc950" stroke="${IC.ink}" stroke-width="2"/>`;
  return {
    svg: decor + Il.T(90, 255, "la mer", { s: 16, c: "#fff" }) + EMO(50, 45, "☀️", 44)
      + Il.E(1, Il.fleche(80, 200, 120, 110, IC.rouge) + Il.fleche(130, 200, 170, 110, IC.rouge) + Il.T(70, 150, "évaporation", { s: 14, c: IC.rouge }))
      + Il.E(2, EMO(230, 60, "☁️", 70) + Il.T(230, 108, "condensation", { s: 14, c: IC.bleu }))
      + Il.E(3, `<g stroke="${IC.bleu}" stroke-width="3" stroke-linecap="round"><line x1="250" y1="110" x2="244" y2="130"/><line x1="270" y1="112" x2="264" y2="132"/><line x1="290" y1="110" x2="284" y2="130"/></g>` + Il.T(330, 135, "pluie", { s: 15, c: IC.bleu }))
      + Il.E(4, `<path d="M300,140 q-20,40 -60,60 q-30,14 -50,20" fill="none" stroke="${IC.bleu}" stroke-width="7" stroke-linecap="round"/>` + Il.T(270, 240, "rivière", { s: 15, c: IC.ink })),
    legendes: ["Le Soleil chauffe la mer.", "L'eau s'évapore : elle devient vapeur et monte.", "En haut, il fait froid : la vapeur forme des nuages (condensation).", "Les gouttes deviennent lourdes : il pleut (précipitations).", "L'eau ruisselle, rejoint la rivière puis la mer… et tout recommence !"],
  };
}

function illuDissolution() {
  const verre = (x, contenu) => `<path d="M${x - 40},70 l8,150 h64 l8,-150" fill="rgba(91,192,235,.25)" stroke="${IC.ink}" stroke-width="3"/>${contenu}`;
  return {
    svg: Il.E(0, verre(110, "") + verre(290, "") + Il.T(110, 250, "eau + sucre", { s: 16 }) + Il.T(290, 250, "eau + sable", { s: 16 }))
      + Il.E(1, `<g fill="#fff" stroke="${IC.gris}" stroke-width="1">${[0, 1, 2, 3, 4].map((i) => `<rect x="${92 + i * 8}" y="${190 - (i % 2) * 6}" width="6" height="6"/>`).join("")}</g>` + `<g fill="#d9a86b">${[0, 1, 2, 3, 4, 5, 6].map((i) => `<circle cx="${270 + i * 6}" cy="${210 - (i % 3) * 3}" r="3"/>`).join("")}</g>`, 1)
      + Il.E(2, `<g fill="#d9a86b">${[0, 1, 2, 3, 4, 5, 6].map((i) => `<circle cx="${270 + i * 6}" cy="${210 - (i % 3) * 3}" r="3"/>`).join("")}</g>` + Il.T(110, 30, "on ne voit plus le sucre,", { s: 14, c: IC.vert }) + Il.T(110, 50, "mais l'eau est sucrée !", { s: 14, c: IC.vert }) + Il.T(290, 30, "le sable", { s: 14, c: IC.rouge }) + Il.T(290, 50, "reste au fond", { s: 14, c: IC.rouge })),
    legendes: ["Deux verres d'eau. J'ajoute du sucre dans l'un, du sable dans l'autre.", "Je remue…", "Le sucre s'est dissous : on ne le voit plus, mais il est toujours là. Le sable ne se dissout pas : on peut le filtrer."],
  };
}

/* circuit dessiné : pile à gauche, ampoule en haut, interrupteur en bas */
function circuitSvg({ ferme, allume, objet = null, x = 0 }) {
  const fil = (d) => `<path d="${d}" fill="none" stroke="${IC.ink}" stroke-width="6" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#e07a4a" stroke-width="3" stroke-linejoin="round"/>`;
  return `<g transform="translate(${x},0)">
    ${fil("M80,150 V60 H180")}${fil("M220,60 H320 V120")}${fil("M320,180 V240 H230")}${fil("M170,240 H80 V190")}
    <rect x="58" y="150" width="44" height="40" rx="6" fill="#5a4a6b" stroke="${IC.ink}" stroke-width="3"/><rect x="72" y="142" width="16" height="8" fill="#c9c3d6" stroke="${IC.ink}" stroke-width="2"/>
    <text x="80" y="176" font-size="14" text-anchor="middle" fill="#fff" font-weight="700">pile</text>
    ${allume ? `<circle cx="200" cy="52" r="44" fill="rgba(255,226,122,.55)"/>` : ""}
    <circle cx="200" cy="48" r="22" fill="${allume ? "#ffe27a" : "#eeeeee"}" stroke="${IC.ink}" stroke-width="3"/><rect x="190" y="66" width="20" height="14" fill="#c9c3d6" stroke="${IC.ink}" stroke-width="2"/>
    <circle cx="170" cy="240" r="6" fill="${IC.ink}"/><circle cx="230" cy="240" r="6" fill="${IC.ink}"/>
    <line x1="170" y1="240" x2="${ferme ? 230 : 222}" y2="${ferme ? 240 : 206}" stroke="${IC.ink}" stroke-width="6" stroke-linecap="round" class="inter"/>
    ${objet ? `<circle cx="320" cy="150" r="30" fill="#fff" stroke="${IC.ink}" stroke-width="3" stroke-dasharray="5 4"/><text x="320" y="152" font-size="34" text-anchor="middle" dominant-baseline="central">${objet}</text>` : fil("M320,120 V180")}
  </g>`;
}

function illuCircuit() {
  return {
    svg: Il.E(0, circuitSvg({ ferme: false, allume: false }), 0) + Il.E(1, circuitSvg({ ferme: true, allume: true }))
      + Il.E(1, Il.T(200, 275, "circuit fermé : le courant passe", { s: 16, c: IC.vert })) + Il.E(0, Il.T(200, 275, "circuit ouvert : l'ampoule est éteinte", { s: 16, c: IC.rouge }), 0),
    legendes: ["Pile, fils, ampoule et interrupteur. L'interrupteur est ouvert : le courant ne passe pas.", "Je ferme l'interrupteur : le circuit est fermé, l'ampoule s'allume !"],
  };
}

function illuConducteurs() {
  return {
    svg: `<g transform="scale(.5) translate(0,40)">${circuitSvg({ ferme: true, allume: false, objet: "🧽" })}</g><g transform="scale(.5) translate(400,40)">${circuitSvg({ ferme: true, allume: false, objet: "🔩" })}</g>`
      + Il.E(1, `<g transform="scale(.5) translate(400,40)">${circuitSvg({ ferme: true, allume: true, objet: "🔩" })}</g>` + Il.T(300, 190, "le clou en fer : conducteur", { s: 15, c: IC.vert }))
      + Il.E(2, Il.T(100, 190, "la gomme : isolant", { s: 15, c: IC.rouge }) + Il.T(200, 240, "Les métaux conduisent le courant ;", { s: 16 }) + Il.T(200, 264, "plastique, bois, verre l'arrêtent.", { s: 16 })),
    legendes: ["Je place un objet dans le circuit pour le tester : une gomme, un clou.", "Avec le clou, l'ampoule s'allume : le fer est un conducteur.", "Avec la gomme, elle reste éteinte : c'est un isolant."],
  };
}

function illuAimant() {
  const aimant = (x, y, rot = 0) => `<g transform="translate(${x},${y}) rotate(${rot})"><path d="M-40,-30 h24 v40 a16,16 0 0 0 32,0 v-40 h24 v40 a40,40 0 0 1 -80,0 z" fill="#e4572e" stroke="${IC.ink}" stroke-width="3"/><rect x="-40" y="-30" width="24" height="16" fill="#c9c3d6" stroke="${IC.ink}" stroke-width="2"/><rect x="16" y="-30" width="24" height="16" fill="#c9c3d6" stroke="${IC.ink}" stroke-width="2"/></g>`;
  return {
    svg: aimant(200, 80, 180)
      + Il.E(0, EMO(120, 230, "📎", 40) + EMO(200, 230, "🧽", 40) + EMO(280, 230, "🔩", 40), 0)
      + Il.E(1, EMO(200, 150, "📎", 34) + EMO(240, 150, "🔩", 34) + EMO(200, 235, "🧽", 40) + Il.T(330, 155, "attirés !", { s: 16, c: IC.vert }) + Il.T(300, 240, "pas attirée", { s: 15, c: IC.rouge })),
    legendes: ["Un aimant, un trombone, une gomme et un clou.", "J'approche l'aimant : le trombone et le clou (fer, acier) sont attirés ; la gomme ne bouge pas."],
  };
}

Object.assign(ILLUSTRATIONS, {
  "sc1-1": illuVivant, "sc1-2": illuGermination, "sc1-3": illuChaine,
  "sc2-1": illuSquelette, "sc2-2": illuDents, "sc2-3": illuAssiette,
  "sc3-1": illuEtats, "sc3-2": illuCycleEau, "sc3-3": illuDissolution,
  "sc4-1": illuCircuit, "sc4-2": illuConducteurs, "sc4-3": illuAimant,
});

/* ---------- les plantes (les dessins viennent du jardin : moteur/js/jardin.js) ---------- */
const solIllu = (y = 200) => `<rect x="0" y="${y}" width="400" height="${280 - y}" fill="#9c6b3c"/><line x1="0" y1="${y}" x2="400" y2="${y}" stroke="${IC.ink}" stroke-width="3"/>`;
function illuPartiesPlante() {
  const racines = `<path d="M150 200 q-6 24 -2 50 M150 210 q-20 12 -28 30 M150 214 q18 10 26 28" fill="none" stroke="#f3e2c7" stroke-width="5" stroke-linecap="round"/>`;
  const tomateCoupee = `<circle cx="336" cy="74" r="30" fill="#e4572e" stroke="${IC.ink}" stroke-width="3"/><circle cx="336" cy="74" r="22" fill="#f7a08a"/>`
    + [[-8, -6], [8, -6], [0, 8], [-10, 8], [10, 8]].map(([dx, dy]) => `<ellipse cx="${336 + dx}" cy="${74 + dy}" rx="3" ry="4.5" fill="#fff3c4" stroke="${IC.ink}" stroke-width="1"/>`).join("");
  return {
    svg: solIllu() + `<g transform="translate(150 200)">${dessinPlante("tomate", 5, "ok", 165)}</g>`
      + Il.E(0, racines + Il.fleche(60, 240, 128, 232, IC.rouge) + Il.T(40, 262, "les racines", { s: 16, a: "start", c: "#fff8ea" }))
      + Il.E(1, Il.fleche(70, 150, 144, 150, IC.rouge) + Il.T(20, 140, "la tige", { s: 16, a: "start" }))
      + Il.E(2, Il.fleche(250, 168, 180, 140, IC.rouge) + Il.T(254, 176, "les feuilles", { s: 16, a: "start" }))
      + Il.E(3, Il.fleche(250, 60, 168, 82, IC.rouge) + Il.T(240, 30, "le fruit", { s: 16 }) + tomateCoupee + Il.T(336, 124, "les graines", { s: 15 })),
    legendes: ["Les racines sont dans la terre : elles boivent l'eau et tiennent la plante.", "La tige porte les feuilles et fait monter l'eau.",
      "Les feuilles fabriquent la nourriture de la plante avec la lumière.", "La fleur est devenue un fruit, la tomate. Dedans, il y a les graines."],
  };
}
function illuCyclePlante() {
  const P = [[200, 52], [320, 120], [280, 236], [120, 236], [80, 120]];
  const dessins = [
    `<ellipse cx="0" cy="0" rx="12" ry="8" fill="#d9a86b" stroke="${IC.ink}" stroke-width="2"/>`,
    `<g transform="translate(0 20)">${dessinPlante("tournesol", 2, "ok", 90)}</g>`,
    `<g transform="translate(0 24)">${dessinPlante("tournesol", 5, "ok", 64)}</g>` + EMO(28, -36, "🐝", 22),
    `<circle cx="0" cy="0" r="20" fill="#e4572e" stroke="${IC.ink}" stroke-width="3"/>`,
    [[-12, 0], [0, -6], [12, 2]].map(([dx, dy]) => `<ellipse cx="${dx}" cy="${dy}" rx="6" ry="4.5" fill="#d9a86b" stroke="${IC.ink}" stroke-width="2"/>`).join(""),
  ];
  const noms = ["la graine", "la pousse", "la fleur", "le fruit", "les graines"];
  let s = "";
  P.forEach(([x, y], i) => {
    s += Il.E(i, `<g transform="translate(${x} ${y})">${dessins[i]}</g>` + Il.T(x, y + (i === 0 ? 30 : i >= 2 && i <= 3 ? 40 : 36), noms[i], { s: 15 }));
    const [x2, y2] = P[(i + 1) % P.length];
    if (i < 4) s += Il.E(i + 1, Il.fleche(x + (x2 - x) * 0.3, y + (y2 - y) * 0.3, x + (x2 - x) * 0.7, y + (y2 - y) * 0.7, IC.vert));
  });
  s += Il.E(5, Il.fleche(98, 98, 172, 56, IC.vert) + Il.T(200, 150, "et ça recommence !", { s: 16, c: IC.vert }));
  return {
    svg: s,
    legendes: ["Tout commence par une graine.", "La graine germe : une jeune pousse sort de terre.", "La plante grandit et fait des fleurs. L'abeille transporte le pollen.",
      "La fleur devient un fruit.", "Dans le fruit, il y a des graines.", "Une graine plantée donne une nouvelle plante : le cycle recommence."],
  };
}
function illuFamillesPlantes() {
  return {
    svg: solIllu(220)
      + Il.E(0, `<g transform="translate(80 220)">${dessinPlante("oranger", 5, "ok", 180, { fruits: true })}</g>` + Il.T(80, 252, "un arbre", { s: 17, c: "#fff8ea" }))
      + Il.E(1, `<g transform="translate(210 220)">${dessinPlante("rosier", 5, "ok", 120)}</g>` + Il.T(210, 252, "un arbuste", { s: 17, c: "#fff8ea" }))
      + Il.E(2, `<g transform="translate(330 220)">${dessinPlante("menthe", 4, "ok", 80)}</g>` + Il.T(330, 252, "une herbacée", { s: 17, c: "#fff8ea" })),
    legendes: ["Un arbre : un seul gros tronc en bois. Il vit très longtemps.", "Un arbuste : plusieurs tiges en bois. Il reste plus petit.", "Une plante herbacée : une tige verte et souple, comme la menthe."],
  };
}
function illuArbreOuPetite() {
  const regle = `<rect x="16" y="40" width="22" height="180" fill="#f6c445" stroke="${IC.ink}" stroke-width="2"/>`
    + [0, 1, 2, 3].map((m) => `<line x1="16" y1="${220 - m * 60}" x2="30" y2="${220 - m * 60}" stroke="${IC.ink}" stroke-width="2"/>${m ? Il.T(44, 225 - m * 60, m + " m", { s: 13, a: "start" }) : ""}`).join("");
  return {
    svg: solIllu(220) + regle
      + Il.E(0, `<g transform="translate(130 220)">${dessinPlante("radis", 5, "ok", 22)}</g>` + Il.T(130, 252, "le radis", { s: 16, c: "#fff8ea" }))
      + Il.E(1, `<g transform="translate(220 220)">${dessinPlante("rosier", 5, "ok", 75)}</g>` + Il.T(220, 252, "le rosier", { s: 16, c: "#fff8ea" }))
      + Il.E(2, `<g transform="translate(320 220)">${dessinPlante("oranger", 5, "ok", 190, { fruits: true })}</g>` + Il.T(320, 252, "l'oranger", { s: 16, c: "#fff8ea" })),
    legendes: ["Le radis vit une seule saison et reste tout petit.", "Le rosier, un arbuste, vit des années ; il dépasse rarement 2 mètres.", "L'oranger, un arbre, grandit pendant des années et dépasse 3 mètres."],
  };
}
Object.assign(ILLUSTRATIONS, { "sc5-1": illuPartiesPlante, "sc5-2": illuCyclePlante, "sc5-3": illuFamillesPlantes, "sc5-4": illuArbreOuPetite });

/* les leçons sur les plantes débloquent des graines du jardin (moteur/js/jardin.js) */
Object.assign(JARDIN_DEBLOCAGES, { tournesol: "sc5-1", tomate: "sc5-2", rosier: "sc5-3", oranger: "sc5-3" });

/* ================================================================== */
/* Le laboratoire                                                      */
/* ================================================================== */
const LABO_EXPERIENCES = [
  { id: "eau", ecran: "labo-eau", icone: "🧊", titre: "L'eau change d'état", desc: "Chauffe ou refroidis l'eau et observe-la.", lecon: "sc3-1" },
  { id: "circuit", ecran: "labo-circuit", icone: "💡", titre: "Le circuit électrique", desc: "Allume l'ampoule et teste des objets.", lecon: "sc4-1" },
  { id: "graine", ecran: "labo-graine", icone: "🌱", titre: "Faire pousser une graine", desc: "Eau, lumière… de quoi a-t-elle besoin ?", lecon: "sc1-2" },
  { id: "chaine", ecran: "labo-chaine", icone: "🦊", titre: "Qui mange qui ?", desc: "Construis des chaînes alimentaires.", lecon: "sc1-3" },
  { id: "aimant", ecran: "labo-aimant", icone: "🧲", titre: "L'aimant", desc: "Quels objets l'aimant attire-t-il ?", lecon: "sc4-3" },
  { id: "serre", ecran: "serre", icone: "🌿", titre: "La serre en accéléré", desc: "Grand arbre ou petite plante ? Fais passer les années.", lecon: "sc5-4" },
];

const Labo = {
  vu(id) {
    const u = Store.user; if (!u) return;
    if (!u.sciences || typeof u.sciences !== "object") u.sciences = {};
    if (!u.sciences.vus || typeof u.sciences.vus !== "object") u.sciences.vus = {};
    if (!u.sciences.vus[id]) { u.sciences.vus[id] = Revision.jour(0); Store.save(); if (typeof Aventure !== "undefined") Aventure.evenement(); }
  },
  /* cadre commun d'une expérience : titre, scène à gauche, explications à droite */
  cadre(root, xp) {
    App.backdrop(root);
    root.appendChild(h("div", { class: "screen-header" }, h("h2", { class: "title" }, `${xp.icone} ${xp.titre}`)));
    const scene = h("div", { class: "panel abs labo-scene" });
    const cote = h("div", { class: "panel abs labo-cote" });
    const texte = h("div", { class: "labo-texte" });
    const commandes = h("div", { class: "labo-commandes" });
    cote.append(texte, commandes, h("button", { class: "btn white small labo-lecon", onclick: () => App.go("lecon", { id: xp.lecon }) }, "📖 La leçon"));
    root.append(scene, cote);
    App.backButton(root, "labo");
    Labo.vu(xp.id);
    let dernier = "";
    const dire = (html, parler = true) => {
      texte.innerHTML = html;
      const t = texte.textContent;
      if (parler && t !== dernier) { dernier = t; Voice.speak(t); }
    };
    return { scene, commandes, dire };
  },
};
const labo = (id) => LABO_EXPERIENCES.find((x) => x.id === id);

App.register("labo", (root) => {
  const u = Store.user; if (!u) return App.go("identif");
  App.backdrop(root);
  root.appendChild(h("div", { class: "screen-header" }, h("h2", { class: "title" }, "🔬 Le laboratoire")));
  const vus = (u.sciences && u.sciences.vus) || {};
  const grille = h("div", { class: "abs labo-grille" });
  LABO_EXPERIENCES.forEach((xp) => grille.appendChild(h("button", { class: "labo-carte" + (vus[xp.id] ? " vue" : ""), onclick: () => { Sound.click(); App.go(xp.ecran); } },
    h("span", { class: "labo-ic" }, xp.icone), h("b", null, xp.titre), h("small", null, xp.desc), vus[xp.id] ? h("em", null, "✔ déjà essayée") : null)));
  grille.appendChild(h("button", { class: "labo-carte lecons", onclick: () => { Sound.click(); App.go("sommaire", { subject: "sci" }); } },
    h("span", { class: "labo-ic" }, "📒"), h("b", null, "Les leçons de sciences"), h("small", null, `${CONTENT.sci.chapters.reduce((n, c) => n + c.lessons.length, 0)} leçons et leurs exercices`)));
  root.appendChild(grille);
  App.backButton(root, "atelier");
  const m = App.mascot(root, { x: 880, y: 600 });
  setTimeout(() => m.say("Bienvenue au laboratoire ! Choisis une expérience : on observe, on essaie, et on comprend."), 300);
});

/* ---------- 1. L'eau change d'état ---------- */
App.register("labo-eau", (root) => {
  const { scene, commandes, dire } = Labo.cadre(root, labo("eau"));
  let t = 20;
  const zone = h("div", { class: "labo-svg" });
  scene.appendChild(zone);
  const curseur = h("input", { type: "range", min: "-20", max: "120", step: "1", value: String(t), class: "labo-range", "aria-label": "Température" });
  const valeur = h("div", { class: "labo-valeur" });
  commandes.append(valeur, curseur, h("div", { class: "row", style: { gap: "8px", justifyContent: "center" } },
    h("button", { class: "btn sky small", onclick: () => regler(t - 10) }, "❄️ Refroidir"), h("button", { class: "btn red small", onclick: () => regler(t + 10) }, "🔥 Chauffer")));
  curseur.addEventListener("input", () => regler(Number(curseur.value), false));
  function dessiner() {
    const etat = t <= 0 ? "solide" : t >= 100 ? "gaz" : "liquide";
    const haut = 300 - Math.max(0, Math.min(1, (t + 20) / 140)) * 220;
    let contenu = "";
    if (etat === "solide") contenu = `<rect x="150" y="225" width="110" height="80" rx="10" fill="#d6f0ff" stroke="#5bc0eb" stroke-width="4"/><path d="M165,240 l30,0 M175,255 l40,0" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`;
    else contenu = `<rect x="122" y="${etat === "gaz" ? 255 : 225}" width="166" height="${etat === "gaz" ? 50 : 80}" fill="#5bc0eb" opacity=".8"/>`;
    if (etat === "gaz") contenu += `<g class="vapeur">${[160, 205, 250].map((x, i) => `<path d="M${x},215 q-12,-20 0,-40 q12,-20 0,-40" stroke="#c9d6e0" stroke-width="7" fill="none" stroke-linecap="round" style="animation-delay:${i * 0.4}s"/>`).join("")}</g>`
      + `<g class="bulles">${[140, 175, 215, 255].map((x, i) => `<circle cx="${x}" cy="295" r="5" fill="#fff" style="animation-delay:${i * 0.3}s"/>`).join("")}</g>`;
    zone.innerHTML = `<svg viewBox="0 0 520 380" xmlns="http://www.w3.org/2000/svg">
      <path d="M110,140 v170 q0,16 16,16 h158 q16,0 16,-16 v-170" fill="rgba(255,255,255,.6)" stroke="${IC.ink}" stroke-width="4"/>
      ${contenu}
      ${t > 40 ? `<g>${[0, 1, 2].map((i) => `<path d="M${150 + i * 55},350 q-10,-14 0,-24 q10,10 0,24 z" fill="#f08a3c" stroke="${IC.ink}" stroke-width="2"/>`).join("")}</g>` : ""}
      ${t < 0 ? `<text x="205" y="110" font-size="40" text-anchor="middle">❄️</text>` : ""}
      <rect x="400" y="60" width="26" height="250" rx="13" fill="#fff" stroke="${IC.ink}" stroke-width="3"/>
      <circle cx="413" cy="320" r="22" fill="#e4572e" stroke="${IC.ink}" stroke-width="3"/>
      <rect x="406" y="${haut}" width="14" height="${310 - haut}" fill="#e4572e"/>
      ${[[-20, 300], [0, 300 - 20 / 140 * 220], [100, 300 - 120 / 140 * 220]].map(([v, y]) => `<line x1="426" y1="${y}" x2="440" y2="${y}" stroke="${IC.ink}" stroke-width="2"/><text x="446" y="${y + 5}" font-size="15" font-weight="700" fill="${IC.ink}">${v} °C</text>`).join("")}
    </svg>`;
    valeur.textContent = `${t < 0 ? "−" + -t : t} °C`;
    const msgs = {
      solide: "L'eau est <b>solide</b> : c'est de la <b>glace</b>. En dessous de 0 °C, l'eau gèle.",
      liquide: t < 10 ? "L'eau est <b>liquide</b>. Au-dessus de 0 °C, la glace <b>fond</b>." : "L'eau est <b>liquide</b> : elle coule et prend la forme du récipient.",
      gaz: "L'eau <b>bout</b> : elle devient de la <b>vapeur</b>, de l'eau à l'état <b>gazeux</b>. C'est à 100 °C.",
    };
    dire(msgs[etat]);
  }
  function regler(v, maj = true) { t = Math.max(-20, Math.min(120, v)); if (maj) curseur.value = String(t); dessiner(); }
  dessiner();
});

/* ---------- 2. Le circuit électrique ---------- */
App.register("labo-circuit", (root) => {
  const { scene, commandes, dire } = Labo.cadre(root, labo("circuit"));
  let ferme = false, objet = null;   // objet = null : les fils sont reliés directement
  const zone = h("div", { class: "labo-svg cliquable" });
  scene.appendChild(zone);
  const choix = h("div", { class: "labo-objets" });
  const objets = [["〰️", "un fil", true], ...SCI_OBJETS_ELEC];
  const bouton = h("button", { class: "btn small", onclick: () => { ferme = !ferme; Sound.click(); dessiner(); } });
  commandes.append(bouton, h("p", { class: "labo-aide" }, "Choisis ce qu'on place à droite du circuit :"), choix);
  objets.forEach((o) => {
    const b = h("button", { class: "labo-objet", title: o[1], onclick: () => { objet = o; Sound.pop(); [...choix.children].forEach((x) => x.classList.toggle("on", x === b)); dessiner(); } }, h("span", null, o[0]), h("small", null, o[1]));
    if (o[1] === "un fil") b.classList.add("on");
    choix.appendChild(b);
  });
  objet = objets[0];
  function dessiner() {
    const passe = ferme && objet[2];
    zone.innerHTML = `<svg viewBox="0 0 400 290" xmlns="http://www.w3.org/2000/svg">${circuitSvg({ ferme, allume: passe, objet: objet[1] === "un fil" ? null : objet[0] })}</svg>`;
    zone.querySelector(".inter").addEventListener("click", () => { ferme = !ferme; Sound.click(); dessiner(); });
    bouton.textContent = ferme ? "🔓 Ouvrir l'interrupteur" : "🔒 Fermer l'interrupteur";
    if (!ferme) dire("L'interrupteur est <b>ouvert</b> : le circuit est coupé, le courant ne passe pas. Ferme-le !");
    else if (passe) dire(objet[1] === "un fil" ? "Le circuit est <b>fermé</b> : le courant passe, l'ampoule <b>brille</b> !" : `${objet[1].charAt(0).toUpperCase() + objet[1].slice(1)} laisse passer le courant : c'est un <b>conducteur</b>. L'ampoule brille !`);
    else dire(`${objet[1].charAt(0).toUpperCase() + objet[1].slice(1)} ne laisse pas passer le courant : c'est un <b>isolant</b>. L'ampoule reste éteinte.`);
  }
  dessiner();
});

/* ---------- 3. Faire pousser une graine ---------- */
App.register("labo-graine", (root) => {
  const { scene, commandes, dire } = Labo.cadre(root, labo("graine"));
  let jour = 0, eau = true, lumiere = true, minuterie = null;
  const zone = h("div", { class: "labo-svg" });
  scene.appendChild(zone);
  const bEau = h("button", { class: "btn small", onclick: () => { eau = !eau; recommencer(); } });
  const bLum = h("button", { class: "btn small", onclick: () => { lumiere = !lumiere; recommencer(); } });
  const bJour = h("button", { class: "btn green small", onclick: () => avancer() }, "▶ Jour suivant");
  const bAuto = h("button", { class: "btn sky small", onclick: () => auto() }, "⏩ Voir 14 jours");
  commandes.append(h("p", { class: "labo-aide" }, "Choisis les conditions, puis fais passer les jours :"), h("div", { class: "row", style: { gap: "8px", flexWrap: "wrap" } }, bEau, bLum),
    h("div", { class: "row", style: { gap: "8px", flexWrap: "wrap", marginTop: "8px" } }, bJour, bAuto));
  App.onLeave(() => clearInterval(minuterie));
  function recommencer() { clearInterval(minuterie); minuterie = null; jour = 0; Sound.click(); dessiner(); }
  function avancer() { if (jour < 14) { jour++; dessiner(); } }
  function auto() { clearInterval(minuterie); if (jour >= 14) jour = 0; minuterie = setInterval(() => { if (jour >= 14) { clearInterval(minuterie); return; } avancer(); }, 700); }
  function dessiner() {
    bEau.textContent = eau ? "💧 Arrosée : oui" : "💧 Arrosée : non"; bEau.className = "btn small " + (eau ? "sky" : "white");
    bLum.textContent = lumiere ? "☀️ Lumière : oui" : "🌑 Lumière : non"; bLum.className = "btn small" + (lumiere ? "" : " white");
    const germe = eau && jour >= 2, hTige = eau ? Math.max(0, Math.min(lumiere ? 140 : 190, (jour - 3) * (lumiere ? 13 : 19))) : 0;
    const vert = lumiere ? "#5fb648" : "#d8d27a", feuille = lumiere ? "#7bc950" : "#e6e09a";
    const nFeuilles = lumiere ? Math.max(0, Math.min(3, Math.floor((jour - 5) / 2))) : (jour >= 7 ? 1 : 0);
    const fleur = lumiere && eau && jour >= 12;
    const base = 290, top = base - hTige;
    let plante = `<ellipse cx="260" cy="${base + 18}" rx="12" ry="8" fill="#d9a86b" stroke="${IC.ink}" stroke-width="2"/>`;
    if (germe) plante += `<path d="M260,${base + 24} q-5,22 3,46 M260,${base + 34} q-12,10 -18,22 M260,${base + 38} q12,8 16,20" stroke="#f3e2c7" stroke-width="3" fill="none"/>`;
    if (hTige > 0) plante += `<path d="M260,${base + 12} Q252,${base - hTige / 2} 260,${top}" stroke="${vert}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
    for (let i = 0; i < nFeuilles; i++) {
      const y = base - 30 - i * 40, c = i % 2 ? 1 : -1;
      if (y > top) plante += `<path d="M260,${y} q${c * 34},-18 ${c * 46},4 q${-c * 24},12 ${-c * 46},-4 z" fill="${feuille}" stroke="${IC.ink}" stroke-width="2"/>`;
    }
    if (fleur) plante += `<g transform="translate(260,${top})">${[0, 72, 144, 216, 288].map((a) => `<ellipse rx="10" ry="18" cx="0" cy="-16" transform="rotate(${a})" fill="#ef7fa8" stroke="${IC.ink}" stroke-width="2"/>`).join("")}<circle r="9" fill="#f6c445" stroke="${IC.ink}" stroke-width="2"/></g>`;
    zone.innerHTML = `<svg viewBox="0 0 520 380" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="520" height="380" fill="${lumiere ? "#fff9e0" : "#3b3550"}" rx="14"/>
      ${lumiere ? `<text x="70" y="70" font-size="50" text-anchor="middle">☀️</text>` : `<text x="70" y="70" font-size="34" text-anchor="middle" fill="#fff">placard</text>`}
      ${eau ? `<text x="420" y="70" font-size="40" text-anchor="middle">🚿</text>` : ""}
      <path d="M180,290 h160 l-18,80 h-124 z" fill="#c9673a" stroke="${IC.ink}" stroke-width="3"/><rect x="172" y="282" width="176" height="16" rx="4" fill="#e07a4a" stroke="${IC.ink}" stroke-width="3"/>
      <rect x="188" y="298" width="144" height="40" fill="${eau ? "#6b4a2a" : "#b58a5a"}"/>
      ${plante}
      <text x="460" y="360" font-size="22" font-weight="700" text-anchor="middle" fill="${lumiere ? IC.ink : "#fff"}">jour ${jour}</text>
    </svg>`;
    if (!eau) dire(jour < 3 ? "La graine est dans la terre <b>sèche</b>. Fais passer les jours…" : "Sans <b>eau</b>, la graine ne germe pas : rien ne pousse.");
    else if (jour < 2) dire("La graine est dans la terre humide. Fais passer les jours…");
    else if (jour < 4) dire("La graine <b>germe</b> : la <b>racine</b> sort la première pour puiser l'eau.");
    else if (!lumiere) dire(jour < 9 ? "La tige pousse, mais elle est <b>jaune</b>…" : "Sans <b>lumière</b>, la plante devient longue, jaune et molle. Elle a besoin de lumière pour rester verte !");
    else dire(fleur ? "Avec de l'eau, de la lumière et de l'air, la plante a bien grandi : elle <b>fleurit</b> !" : "La tige et les <b>feuilles</b> poussent vers la lumière.");
  }
  dessiner();
});

/* ---------- 4. Qui mange qui ? ---------- */
const LABO_CHAINES = [
  [["🌿", "l'herbe"], ["🐰", "le lapin"], ["🦊", "le renard"]],
  [["🥬", "la salade"], ["🐌", "l'escargot"], ["🦔", "le hérisson"]],
  [["🌾", "les graines"], ["🐭", "la souris"], ["🦉", "la chouette"]],
  [["🌱", "les algues"], ["🐟", "le petit poisson"], ["🦈", "le requin"]],
  [["🍃", "les feuilles"], ["🐛", "la chenille"], ["🐦", "la mésange"], ["🦅", "l'épervier"]],
];
App.register("labo-chaine", (root, params) => {
  const { scene, commandes, dire } = Labo.cadre(root, labo("chaine"));
  const n = (params.n || 0) % LABO_CHAINES.length;
  const chaine = LABO_CHAINES[n];
  const intrus = pick([["🪨", "un caillou"], ["🚗", "une voiture"], ["⚽", "un ballon"]]);
  const cartes = shuffle([...chaine, intrus]);
  let pris = [];
  const ligne = h("div", { class: "labo-chaine" });
  const reserve = h("div", { class: "labo-reserve" });
  scene.append(h("p", { class: "labo-consigne" }, "Clique sur les êtres vivants dans l'ordre : on commence par la plante, puis celui qui la mange…"), ligne, reserve);
  const verifier = h("button", { class: "btn green small", onclick: () => controle() }, "✔ Vérifier");
  commandes.append(verifier, h("button", { class: "btn white small", onclick: () => App.go("labo-chaine", { n }) }, "↻ Recommencer"),
    h("button", { class: "btn sky small", onclick: () => App.go("labo-chaine", { n: n + 1 }) }, "➜ Autre chaîne"));
  function dessiner() {
    ligne.innerHTML = "";
    pris.forEach((c, i) => {
      if (i) ligne.appendChild(h("span", { class: "labo-fleche" }, "→"));
      ligne.appendChild(h("button", { class: "labo-maillon", title: "Enlever", onclick: () => { pris.splice(i); Sound.pop(); dessiner(); } }, h("span", null, c[0]), h("small", null, c[1])));
    });
    if (!pris.length) ligne.appendChild(h("span", { class: "labo-vide" }, "ta chaîne apparaît ici"));
    reserve.innerHTML = "";
    cartes.filter((c) => !pris.includes(c)).forEach((c) => reserve.appendChild(h("button", { class: "labo-maillon", onclick: () => { pris.push(c); Sound.pop(); dessiner(); } }, h("span", null, c[0]), h("small", null, c[1]))));
  }
  function controle() {
    if (pris.includes(intrus)) { Sound.bad(); dire(`Attention : ${intrus[1]} n'est pas un être vivant ! Touche sa carte pour la retirer de la chaîne.`); return; }
    if (pris.length < chaine.length) { dire("Il manque des êtres vivants dans ta chaîne."); return; }
    if (pris.every((c, i) => c === chaine[i])) {
      Sound.fanfare(); App.confetti(40);
      dire("Bravo, ta chaîne est juste ! Elle commence bien par une <b>plante</b>, et chaque flèche veut dire « est mangé par ».");
    } else { Sound.bad(); dire("Pas tout à fait : une chaîne alimentaire commence par une <b>plante</b>, puis vient celui qui la mange. Touche une carte pour l'enlever."); }
  }
  dire("Construis la chaîne alimentaire, puis clique sur Vérifier.", false);
  dessiner();
});

/* ---------- 5. L'aimant ---------- */
App.register("labo-aimant", (root) => {
  const { scene, commandes, dire } = Labo.cadre(root, labo("aimant"));
  const objets = sample(SCI_OBJETS_AIMANT.filter((o) => o[2]), 3).concat(sample(SCI_OBJETS_AIMANT.filter((o) => !o[2]), 3));
  const ordre = shuffle(objets);
  const table = h("div", { class: "labo-table" });
  const resultats = h("div", { class: "labo-resultats" });
  scene.append(h("p", { class: "labo-consigne" }, "Clique sur un objet pour en approcher l'aimant 🧲."), table);
  commandes.append(h("p", { class: "labo-aide" }, "Mes observations :"), resultats);
  const vus = new Map();
  ordre.forEach((o) => {
    const b = h("button", { class: "labo-cible", title: o[1] }, h("span", { class: "obj" }, o[0]), h("span", { class: "aim" }, "🧲"), h("small", null, o[1]));
    b.addEventListener("click", () => {
      if (b.classList.contains("teste")) return;
      b.classList.add("approche");
      setTimeout(() => {
        b.classList.add("teste", o[2] ? "attire" : "rien");
        if (o[2]) Sound.good(); else Sound.pop();
        vus.set(o, o[2]);
        resultats.appendChild(h("p", null, `${o[0]} ${o[1]} : `, h("b", { style: { color: o[2] ? "#2f8f3c" : "#c0392b" } }, o[2] ? "l'aimant l'attire ✔" : "l'aimant ne l'attire pas ✖")));
        dire(o[2] ? `L'aimant attire ${o[1]} : cet objet est en <b>fer</b> ou en <b>acier</b>.` : `L'aimant n'attire pas ${o[1]}.`);
        if (vus.size === ordre.length) setTimeout(() => dire("Bilan : l'aimant attire seulement les objets en <b>fer</b> ou en <b>acier</b>. Le bois, le plastique, le papier et l'aluminium ne sont pas attirés."), 1800);
      }, 600);
    });
    table.appendChild(b);
  });
  dire("Teste chaque objet : l'aimant va-t-il l'attirer ?", false);
});

/* ---------------- Objet de l'atelier apporté par les sciences du CE2 ---------------- */
/* laboratoire : sciences */
objetAtelier({
  id: "labo", ecran: "labo", ordre: 160, label: "Le laboratoire",
  desc: "Les sciences : des expériences sur l'eau, l'électricité, les plantes, les animaux et les aimants.",
  transform: "translate(0,-46)",
  svg: () => `
        <rect x="640" y="436" width="122" height="12" rx="4" fill="#8a5a24" ${S}/>
        <path d="M652,448 l8,10 M750,448 l-8,10" ${S}/>
        <rect x="656" y="426" width="44" height="10" rx="3" fill="#5a4a6b" ${S}/>
        <path d="M672,426 v-26 l12,-30 l12,6 l-10,26 v24" fill="#c9c3d6" ${S}/>
        <rect x="680" y="356" width="14" height="22" rx="3" fill="#5a4a6b" ${S} transform="rotate(22 687 367)"/>
        <path d="M694,410 q14,0 14,16" fill="none" ${S}/>
        <path d="M722,382 v14 l-14,30 h44 l-14,-30 v-14 z" fill="#fff" ${S}/>
        <path d="M712,416 h36 l4,10 h-44 z" fill="#7bc950"/>
        <path d="M722,382 v14 l-14,30 h44 l-14,-30 v-14 z" fill="none" ${S}/>
        <circle cx="730" cy="404" r="3" fill="#7bc950"/><circle cx="738" cy="396" r="2" fill="#7bc950"/>
  `,
});

/* ---------------- Médaille des sciences du CE2 ---------------- */
ajouterMedailles([
  { id: "chercheur", icone: "🔬", nom: "Petit chercheur", desc: "Essaie toutes les expériences du laboratoire.",
    ok: (u) => typeof LABO_EXPERIENCES !== "undefined" && LABO_EXPERIENCES.every((x) => u.sciences && u.sciences.vus && u.sciences.vus[x.id]) },
], { avant: "regulier" });
