/* L'Atelier de Boulon — CE2 : schémas animés des leçons de maths et de français.
   Les outils de dessin (IC, Il, chiffres, etiquettes) et le lecteur sont dans moteur/js/illustrations.js. */
"use strict";

/* ------------------------------------------------------------------ */
/* Opérations posées                                                   */
/* ------------------------------------------------------------------ */
function illuAddition() {
  const s = [Il.colonne(1, colX(0), 38, 190), Il.colonne(2, colX(1), 38, 190), Il.colonne(3, colX(2), 38, 190)].join("");
  return {
    svg: s + chiffres(365, 100) + Il.T(colX(3), 160, "+", { s: 40 }) + chiffres(278, 160) + Il.L(110, 180, 330, 180, { w: 4 })
      + Il.E(1, Il.T(colX(0), 225, "3", { s: 40, c: IC.bleu }) + Il.T(colX(1), 62, "1", { s: 22, c: IC.rouge }))
      + Il.E(2, Il.T(colX(1), 225, "4", { s: 40, c: IC.bleu }) + Il.T(colX(2), 62, "1", { s: 22, c: IC.rouge }))
      + Il.E(3, Il.T(colX(2), 225, "6", { s: 40, c: IC.bleu }))
      + Il.E(4, Il.T(200, 268, "365 + 278 = 643", { s: 22, c: IC.vert })),
    legendes: ["On aligne les unités sous les unités, les dizaines sous les dizaines…",
      "Unités : 5 + 8 = 13. J'écris 3 et je retiens 1 dans la colonne des dizaines.",
      "Dizaines : 1 + 6 + 7 = 14. J'écris 4 et je retiens 1.",
      "Centaines : 1 + 3 + 2 = 6. J'écris 6.",
      "Le résultat : 643."],
  };
}

function illuSoustraction() {
  const s = [Il.colonne(1, colX(0), 38, 190), Il.colonne(2, colX(1), 38, 190), Il.colonne(3, colX(2), 38, 190)].join("");
  return {
    svg: s + chiffres(532, 100) + Il.T(colX(3), 160, "−", { s: 40 }) + chiffres(178, 160) + Il.L(110, 180, 330, 180, { w: 4 })
      /* retenue : un petit 1 devant le chiffre du haut (+10) et devant le chiffre du bas de la colonne suivante (+1) */
      + Il.E(1, Il.T(colX(0) - 19, 82, "1", { s: 18, c: IC.rouge }) + Il.T(colX(1) - 19, 142, "1", { s: 18, c: IC.rouge }) + Il.T(colX(0), 225, "4", { s: 40, c: IC.bleu }))
      + Il.E(2, Il.T(colX(1) - 19, 82, "1", { s: 18, c: IC.rouge }) + Il.T(colX(2) - 19, 142, "1", { s: 18, c: IC.rouge }) + Il.T(colX(1), 225, "5", { s: 40, c: IC.bleu }))
      + Il.E(3, Il.T(colX(2), 225, "3", { s: 40, c: IC.bleu }))
      + Il.E(4, Il.T(200, 268, "532 − 178 = 354", { s: 22, c: IC.vert })),
    legendes: ["Le plus grand nombre est en haut. On commence par les unités.",
      "2 − 8, c'est impossible : j'ajoute 10 en haut (12 − 8 = 4) et 1 en bas dans la colonne des dizaines.",
      "3 − (7 + 1), impossible : 13 − 8 = 5, et j'ajoute 1 en bas dans les centaines.",
      "Centaines : 5 − (1 + 1) = 3.",
      "Le résultat : 354. Vérification : 354 + 178 = 532."],
  };
}

function illuMultiplication() {
  const s = [Il.colonne(1, colX(0), 38, 190), Il.colonne(2, colX(1), 38, 190)].join("");
  return {
    svg: s + chiffres(47, 100) + Il.T(colX(2), 160, "×", { s: 40 }) + chiffres(3, 160) + Il.L(140, 180, 330, 180, { w: 4 })
      + Il.E(1, Il.T(colX(0), 225, "1", { s: 40, c: IC.bleu }) + Il.T(colX(1), 62, "2", { s: 22, c: IC.rouge }))
      + Il.E(2, Il.T(colX(1), 225, "4", { s: 40, c: IC.bleu }) + Il.T(colX(2), 225, "1", { s: 40, c: IC.bleu }))
      + Il.E(3, Il.T(200, 268, "47 × 3 = 141", { s: 22, c: IC.vert })),
    legendes: ["On multiplie d'abord les unités, puis les dizaines.",
      "Unités : 7 × 3 = 21. J'écris 1 et je retiens 2.",
      "Dizaines : 4 × 3 = 12, plus la retenue 2 : 14. J'écris 14.",
      "Le résultat : 141."],
  };
}

/* ------------------------------------------------------------------ */
/* Nombres                                                             */
/* ------------------------------------------------------------------ */
function illuMCDU() {
  const cols = [["M", "milliers", IC.violet], ["C", "centaines", IC.rouge], ["D", "dizaines", IC.vert], ["U", "unités", IC.bleu]];
  const ch = ["3", "4", "5", "2"], val = ["3 000", "400", "50", "2"];
  let s = Il.E(0, Il.T(200, 50, "3 452", { s: 44 }), 0);
  cols.forEach(([l, nom, c], i) => {
    const x = 65 + i * 90;
    s += Il.E(1, Il.R(x - 40, 30, 80, 44, { f: c, o: 0.9 }) + Il.T(x, 62, l, { c: "#fff" }) + Il.T(x, 92, nom, { s: 14, b: false }) + Il.R(x - 40, 100, 80, 70, { f: "#fff" }));
    s += Il.E(1, Il.T(x, 150, ch[i], { s: 44, c }));
    s += Il.E(2, Il.T(x, 210, val[i], { s: 22, c }) + (i < 3 ? Il.T(x + 45, 210, "+", { s: 22 }) : ""));
  });
  s += Il.E(3, Il.T(200, 258, "3 452 = 3 000 + 400 + 50 + 2", { s: 20, c: IC.ink }));
  return { svg: s, legendes: ["Voici le nombre 3 452.", "Chaque chiffre a sa place dans le tableau : M, C, D, U.", "Chaque chiffre a une valeur selon sa place : 3 milliers valent 3 000.", "On peut décomposer le nombre."] };
}

function illuComparer() {
  const x = (v) => 40 + (v - 1000) * 0.32;
  let s = Il.L(30, 150, 370, 150);
  for (let v = 1000; v <= 2000; v += 100) s += Il.L(x(v), v % 500 ? 143 : 136, x(v), v % 500 ? 157 : 164, { w: v % 500 ? 2 : 3 }) + (v % 500 ? "" : Il.T(x(v), 190, v === 1000 ? "1 000" : v === 1500 ? "1 500" : "2 000", { s: 15, b: false }));
  s += Il.E(1, Il.C(x(1250), 150, 9, { f: IC.bleu }) + Il.T(x(1250), 118, "1 250", { s: 20, c: IC.bleu }));
  s += Il.E(2, Il.C(x(1700), 150, 9, { f: IC.rouge }) + Il.T(x(1700), 118, "1 700", { s: 20, c: IC.rouge }));
  s += Il.E(3, Il.T(200, 245, "1 250 < 1 700", { s: 34 }) + Il.T(200, 272, "le plus petit est à gauche sur la droite", { s: 15, b: false }));
  return { svg: s, legendes: ["Sur la droite des nombres, les nombres grandissent vers la droite.", "Je place 1 250.", "Je place 1 700 : il est plus à droite, il est plus grand.", "Le signe < s'ouvre toujours vers le plus grand nombre."] };
}

function illuSuites() {
  const x = (i) => 50 + i * 75;
  let s = Il.L(25, 170, 375, 170);
  [120, 130, 140, 150, 160].forEach((v, i) => {
    s += Il.L(x(i), 160, x(i), 180) + Il.E(i === 0 ? 0 : i, Il.T(x(i), 210, String(v), { s: 22, c: i ? IC.bleu : IC.ink }));
    if (i) s += Il.E(i, `<path d="M${x(i - 1)},158 Q${(x(i - 1) + x(i)) / 2},95 ${x(i)},158" fill="none" stroke="${IC.rouge}" stroke-width="3"/>` + Il.T((x(i - 1) + x(i)) / 2, 112, "+10", { s: 17, c: IC.rouge }));
  });
  s += Il.E(5, Il.T(200, 258, "On ajoute toujours 10.", { s: 20, c: IC.vert }));
  return { svg: s, legendes: ["La suite commence à 120.", "On fait un bond de 10 : 130.", "Encore +10 : 140.", "Encore +10 : 150.", "Encore +10 : 160.", "Pour trouver la règle, on regarde l'écart entre deux nombres."] };
}

/* ------------------------------------------------------------------ */
/* Calcul : tables, partage                                            */
/* ------------------------------------------------------------------ */
function illuTables() {
  let s = "";
  for (let r = 0; r < 3; r++) {
    let rang = "";
    for (let c = 0; c < 4; c++) rang += Il.C(90 + c * 46, 60 + r * 50, 16, { f: [IC.rouge, IC.bleu, IC.vert][r] });
    s += Il.E(r, rang + Il.T(300, 68 + r * 50, `${(r + 1) * 4}`, { s: 24, c: [IC.rouge, IC.bleu, IC.vert][r] }));
  }
  s += Il.E(3, Il.T(200, 238, "3 × 4 = 12", { s: 36 }) + Il.T(200, 268, "3 rangées de 4, c'est aussi 4 + 4 + 4", { s: 15, b: false }));
  return { svg: s, legendes: ["Une rangée de 4 jetons : 4.", "Deux rangées de 4 : 8.", "Trois rangées de 4 : 12.", "3 fois 4 égale 12. Et 4 fois 3 aussi !"] };
}

function illuPartage() {
  const N = 12, P = 3;
  let s = "";
  for (let i = 0; i < N; i++) {
    const tour = Math.floor(i / P) + 1;
    s += Il.E(0, Il.C(46 + i * 28, 40, 11, { f: IC.jaune, w: 2 }), tour - 1);
  }
  for (let p = 0; p < P; p++) {
    const cx = 80 + p * 120;
    s += `<ellipse cx="${cx}" cy="185" rx="52" ry="16" fill="#fff" stroke="${IC.ink}" stroke-width="3"/>`;
    for (let t = 0; t < 4; t++) s += Il.E(t + 1, Il.C(cx - 27 + t * 18, 165 - (t % 2) * 6, 10, { f: IC.jaune, w: 2 }));
  }
  s += Il.E(5, Il.T(200, 250, "12 ÷ 3 = 4, car 3 × 4 = 12", { s: 24, c: IC.vert }));
  return { svg: s, legendes: ["12 biscuits à partager entre 3 assiettes.", "Je donne 1 biscuit à chaque assiette.", "Encore 1 chacun.", "Encore 1 chacun.", "Encore 1 : il n'en reste plus.", "Chaque assiette a 4 biscuits. Il ne reste rien : le reste est 0."] };
}

/* ------------------------------------------------------------------ */
/* Monnaie (dirhams ou euros, selon le réglage)                         */
/* ------------------------------------------------------------------ */
function illuMonnaie() {
  const mad = Money.isMAD;
  const parts = mad ? [50, 20, 5] : [20, 10, 5, 2];
  const total = parts.reduce((a, b) => a + b, 0);
  const billet = (x, v, c) => Il.R(x, 70, 92, 52, { f: c, rx: 6 }) + Il.T(x + 46, 104, `${v} ${Money.sym()}`, { s: 20 });
  const piece = (x, v) => Il.C(x + 30, 96, 26, { f: "#d9b44a" }) + Il.C(x + 30, 96, 19, { s: "#a6862e", w: 2 }) + Il.T(x + 30, 103, String(v), { s: 18 });
  const couleurs = { 200: "#b9a0e4", 100: "#9ccbf5", 50: "#f4a983", 20: "#a6dc8f", 10: "#f8c2d6", 5: "#fff0a8" };
  let s = "", x = 20;
  parts.forEach((v, i) => {
    const estBillet = Money.billets().includes(v);
    s += Il.E(i, (estBillet ? billet(x, v, couleurs[v] || "#eee") : piece(x, v)) + (i ? Il.T(x - 8, 102, "+", { s: 24 }) : ""));
    x += estBillet ? 108 : 72;
  });
  s += Il.E(parts.length, Il.T(200, 190, `${parts.join(" + ")} = ${total} ${Money.sym()}`, { s: 26, c: IC.vert })
    + Il.T(200, 236, mad ? "1 dirham = 100 centimes" : "1 euro = 100 centimes", { s: 20, b: false }));
  return { svg: s, legendes: parts.map((v, i) => (i ? `J'ajoute ${v} ${Money.nom(v)}.` : `Je commence par le plus grand : ${v} ${Money.nom(v)}.`))
    .concat([`En tout : ${total} ${Money.nom(total)}. On additionne les billets et les pièces.`]) };
}

/* ------------------------------------------------------------------ */
/* Géométrie                                                           */
/* ------------------------------------------------------------------ */
function illuQuadrillage() {
  const L = ["A", "B", "C", "D", "E"], x0 = 110, y0 = 30, c = 40;
  let s = "";
  for (let i = 0; i <= 5; i++) s += Il.L(x0 + i * c, y0, x0 + i * c, y0 + 5 * c, { w: 2 }) + Il.L(x0, y0 + i * c, x0 + 5 * c, y0 + i * c, { w: 2 });
  L.forEach((l, i) => { s += Il.T(x0 + i * c + c / 2, y0 + 5 * c + 26, l, { s: 20 }); });
  for (let r = 1; r <= 5; r++) s += Il.T(x0 - 18, y0 + (5 - r) * c + 28, String(r), { s: 20 });
  s += Il.E(1, Il.R(x0 + 2 * c, y0, c, 5 * c, { f: "rgba(46,134,222,.25)", s: IC.bleu, rx: 0, w: 2 }));
  s += Il.E(2, Il.R(x0, y0 + 1 * c, 5 * c, c, { f: "rgba(228,87,46,.22)", s: IC.rouge, rx: 0, w: 2 }));
  s += Il.E(3, Il.T(x0 + 2 * c + c / 2, y0 + 1 * c + 30, "★", { s: 32, c: IC.jaune }) + Il.T(350, 120, "C4", { s: 34, c: IC.vert }));
  return { svg: s, legendes: ["Les lettres sont en bas, les chiffres sur le côté.", "Je cherche la colonne C.", "Puis la ligne 4.", "La case où elles se croisent s'appelle C4 : la lettre d'abord, puis le chiffre."] };
}

function illuDroites() {
  let s = Il.E(0, Il.L(60, 70, 260, 70) + Il.C(60, 70, 5, { f: IC.ink }) + Il.C(260, 70, 5, { f: IC.ink }) + Il.T(60, 52, "A", { s: 20 }) + Il.T(260, 52, "B", { s: 20 })) + Il.E(0, Il.T(160, 100, "segment [AB]", { s: 15, b: false }), 0);
  s += Il.E(1, Il.L(10, 70, 390, 70, { c: IC.bleu, d: true }) + Il.L(60, 70, 260, 70, { c: IC.bleu }) + Il.T(200, 52, "droite (AB)", { s: 16, c: IC.bleu }));
  s += Il.E(2, Il.L(120, 240, 330, 240) + Il.L(120, 240, 120, 120));
  s += Il.E(3, `<path d="M120,240 L120,160 L200,240 z" fill="rgba(246,196,69,.55)" stroke="${IC.ink}" stroke-width="2"/>` + Il.R(120, 220, 20, 20, { s: IC.rouge, rx: 0, w: 3 }) + Il.T(270, 200, "angle droit", { s: 17, c: IC.rouge }));
  return { svg: s, legendes: ["Un segment est limité par deux points : A et B.", "Une droite ne s'arrête jamais : on la prolonge des deux côtés.", "Deux traits qui se rencontrent forment un angle.", "L'équerre s'y colle parfaitement : c'est un angle droit. On le marque d'un petit carré."] };
}

function illuFigures() {
  const s = Il.E(0, Il.R(25, 40, 80, 80, { f: "#9ccbf5", rx: 0 }) + Il.T(65, 150, "carré", { s: 17 }))
    + Il.E(1, Il.R(140, 50, 120, 60, { f: "#a6dc8f", rx: 0 }) + Il.T(200, 150, "rectangle", { s: 17 }))
    + Il.E(2, `<path d="M290,120 L335,40 L380,120 z" fill="#f8c2d6" stroke="${IC.ink}" stroke-width="3"/>` + Il.T(335, 150, "triangle", { s: 17 }))
    + Il.E(3, Il.C(200, 215, 40, { f: "#fff0a8" }) + Il.C(200, 215, 3, { f: IC.ink }) + Il.L(200, 215, 240, 215, { w: 2, c: IC.rouge }) + Il.T(290, 222, "cercle", { s: 17 }));
  return { svg: s, legendes: ["Le carré : 4 côtés de même longueur et 4 angles droits.", "Le rectangle : 4 angles droits, ses côtés opposés ont la même longueur.", "Le triangle : 3 côtés et 3 sommets.", "Le cercle : tous ses points sont à la même distance du centre."] };
}

function illuSymetrie() {
  const moitie = "M200,60 L140,110 L140,220 L200,220";
  return {
    svg: Il.L(200, 30, 200, 250, { c: IC.rouge, d: true }) + Il.T(200, 268, "axe de symétrie", { s: 15, c: IC.rouge })
      + `<path d="${moitie} z" fill="#9ccbf5" stroke="${IC.ink}" stroke-width="3"/>` + Il.R(155, 150, 25, 30, { f: "#fff", rx: 2 })
      + Il.E(1, `<g class="illu-pli"><path d="${moitie} z" fill="#a6dc8f" stroke="${IC.ink}" stroke-width="3" transform="translate(400,0) scale(-1,1)"/>${Il.R(220, 150, 25, 30, { f: "#fff", rx: 2 })}</g>`)
      + Il.E(2, Il.T(320, 120, "pareil !", { s: 20, c: IC.vert })),
    legendes: ["Voici la moitié d'une maison et un axe en pointillés.", "Je plie la feuille le long de l'axe : la moitié se retourne de l'autre côté.", "Les deux moitiés se superposent exactement : la figure est symétrique."],
  };
}

function illuSolides() {
  const cube = `<path d="M30,90 h60 v60 h-60 z" fill="#9ccbf5" stroke="${IC.ink}" stroke-width="3"/><path d="M30,90 l22,-20 h60 l-22,20 z M90,90 l22,-20 v60 l-22,20 z" fill="#c9e2fa" stroke="${IC.ink}" stroke-width="3"/>`;
  const pave = `<path d="M145,100 h80 v50 h-80 z" fill="#a6dc8f" stroke="${IC.ink}" stroke-width="3"/><path d="M145,100 l18,-16 h80 l-18,16 z M225,100 l18,-16 v50 l-18,16 z" fill="#cdeec0" stroke="${IC.ink}" stroke-width="3"/>`;
  const cyl = `<path d="M280,80 v60 a35,12 0 0 0 70,0 v-60" fill="#f8c2d6" stroke="${IC.ink}" stroke-width="3"/><ellipse cx="315" cy="80" rx="35" ry="12" fill="#fbd9e6" stroke="${IC.ink}" stroke-width="3"/>`;
  const boule = `<circle cx="200" cy="225" r="34" fill="#fff0a8" stroke="${IC.ink}" stroke-width="3"/><path d="M178,212 q8,-12 20,-12" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`;
  return {
    svg: Il.E(0, cube + Il.T(70, 180, "cube", { s: 16 })) + Il.E(1, pave + Il.T(190, 180, "pavé droit", { s: 16 }))
      + Il.E(2, cyl + Il.T(315, 180, "cylindre", { s: 16 })) + Il.E(3, boule + Il.T(290, 232, "boule", { s: 16 })),
    legendes: ["Le cube : 6 faces carrées, 12 arêtes et 8 sommets. Comme un dé.", "Le pavé droit : 6 faces rectangulaires. Comme une boîte à chaussures.", "Le cylindre : 2 disques et une face qui roule. Comme une boîte de conserve.", "La boule : elle roule dans tous les sens. Comme un ballon."],
  };
}

/* ------------------------------------------------------------------ */
/* Mesures                                                             */
/* ------------------------------------------------------------------ */
function illuLongueurs() {
  const x = (cm) => 40 + cm * 32;
  let regle = Il.R(30, 120, 340, 60, { f: "#fff0a8", rx: 4 });
  for (let mm = 0; mm <= 100; mm++) {
    const hgt = mm % 10 === 0 ? 22 : mm % 5 === 0 ? 15 : 9;
    regle += `<line x1="${x(mm / 10)}" y1="120" x2="${x(mm / 10)}" y2="${120 + hgt}" stroke="${IC.ink}" stroke-width="${mm % 10 ? 1 : 2}"/>`;
    if (mm % 10 === 0) regle += Il.T(x(mm / 10), 168, String(mm / 10), { s: 14 });
  }
  return {
    svg: regle + Il.E(0, Il.L(x(0), 95, x(7), 95, { c: IC.rouge, w: 6 }), 0)
      + Il.E(1, Il.L(x(0), 95, x(7), 95, { c: IC.rouge, w: 6 }) + Il.L(x(0), 85, x(0), 122, { c: IC.bleu, w: 2, d: true }))
      + Il.E(2, Il.L(x(7), 85, x(7), 122, { c: IC.bleu, w: 2, d: true }) + Il.T(x(7) + 46, 102, "7 cm", { s: 22, c: IC.rouge }))
      + Il.E(3, Il.T(200, 228, "1 cm = 10 mm", { s: 22 }) + Il.T(200, 260, "1 m = 100 cm   •   1 km = 1 000 m", { s: 18, b: false })),
    legendes: ["Je veux mesurer ce trait rouge.", "Je place le 0 de la règle au début du trait.", "Je lis le nombre à la fin du trait : 7 cm.", "Entre deux centimètres, il y a 10 petits traits : les millimètres."],
  };
}

function illuMasses() {
  const plateau = (cx, y) => `<path d="M${cx - 55},${y} q55,30 110,0 z" fill="#c9c3d6" stroke="${IC.ink}" stroke-width="3"/>`;
  const balance = (incl) => {
    const yg = 110 + incl, yd = 110 - incl;
    return `<rect x="190" y="110" width="20" height="120" fill="#8a5a24" stroke="${IC.ink}" stroke-width="3"/><rect x="140" y="226" width="120" height="16" rx="5" fill="#8a5a24" stroke="${IC.ink}" stroke-width="3"/>`
      + Il.L(90, yg, 310, yd, { w: 6 }) + Il.L(90, yg, 90, yg + 40, { w: 2 }) + Il.L(310, yd, 310, yd + 40, { w: 2 }) + plateau(90, yg + 40) + plateau(310, yd + 40) + Il.C(200, 110, 7, { f: IC.jaune });
  };
  const pomme = (cy) => `<circle cx="90" cy="${cy}" r="24" fill="#e4572e" stroke="${IC.ink}" stroke-width="3"/><path d="M90,${cy - 24} q4,-10 12,-12" stroke="${IC.vert}" stroke-width="4" fill="none"/>`;
  const poids = (x, cy, txt, w) => Il.R(x - w / 2, cy - 18, w, 34, { f: "#5a4a6b", rx: 4 }) + Il.T(x, cy + 6, txt, { s: 15, c: "#fff" });
  return {
    svg: Il.E(0, balance(28) + pomme(150), 0) + Il.E(1, balance(8) + pomme(130) + poids(305, 124, "200 g", 62), 1)
      + Il.E(2, balance(0) + pomme(122) + poids(285, 132, "200 g", 62) + poids(338, 132, "100 g", 46))
      + Il.E(3, Il.T(200, 30, "La pomme pèse 300 g", { s: 22, c: IC.vert }) + Il.T(200, 270, "1 kg = 1 000 g", { s: 20 })),
    legendes: ["La pomme fait pencher la balance : son plateau descend.", "J'ajoute 200 g : ce n'est pas encore assez.", "J'ajoute 100 g : la balance est équilibrée.", "200 g + 100 g = 300 g. Et 1 kilogramme = 1 000 grammes."],
  };
}

function illuHeure() {
  const horloge = (hh, mm) => Art.clockFace(110, 140, 88, hh, mm);
  const etapes = [[3, 0, "3 h"], [3, 15, "3 h et quart"], [3, 30, "3 h et demie"], [3, 45, "4 h moins le quart"]];
  return {
    svg: etapes.map(([hh, mm, txt], i) => Il.E(i, horloge(hh, mm) + Il.T(298, 120, txt, { s: 18, c: IC.bleu }) + Il.T(298, 160, `${hh} h ${String(mm).padStart(2, "0")}`, { s: 26 }), i)).join(""),
    legendes: ["La petite aiguille montre les heures, la grande les minutes. Il est 3 h.", "La grande aiguille a fait un quart de tour : 15 minutes.", "Elle a fait un demi-tour : 30 minutes.", "Trois quarts de tour : 45 minutes. Encore 15 minutes et il sera 4 h. 1 h = 60 min."],
  };
}

/* ------------------------------------------------------------------ */
/* Français                                                            */
/* ------------------------------------------------------------------ */
function illuPhrase() {
  return {
    svg: etiquettes([["le"], ["chat"], ["dort"], ["sur"], ["le"], ["tapis"]], 70, { s: 18 })
      + Il.E(1, etiquettes([["Le", IC.rouge], ["chat"], ["dort"], ["sur"], ["le"], ["tapis"], [".", IC.rouge]], 140, { s: 18 }))
      + Il.E(2, Il.T(200, 200, "Il dort ?", { s: 24, c: IC.bleu }) + Il.T(110, 240, "Quel bon chat !", { s: 22, c: IC.vert }) + Il.T(290, 240, "Il dort.", { s: 22 })),
    legendes: ["Ces mots ne forment pas encore une phrase écrite.", "Une phrase commence par une majuscule et se termine par un point.", "Le point peut être . ! ou ? selon ce que l'on veut dire."],
  };
}

function illuSujetVerbe() {
  return {
    svg: etiquettes([["Le petit chien"], ["aboie"], ["fort."]], 90)
      + Il.E(1, etiquettes([["Le petit chien"], ["aboie", IC.rouge], ["fort."]], 90) + Il.T(255, 135, "verbe", { s: 18, c: IC.rouge }))
      + Il.E(2, Il.T(200, 225, "Qui est-ce qui aboie ?", { s: 22, c: IC.bleu }) + Il.fleche(160, 200, 115, 150, IC.bleu))
      + Il.E(3, etiquettes([["Le petit chien", IC.bleu], ["aboie", IC.rouge], ["fort."]], 90) + Il.T(112, 135, "sujet", { s: 18, c: IC.bleu })),
    legendes: ["Voici une phrase.", "Le verbe dit ce que l'on fait : aboie. Il change avec le temps (aboyait, aboiera).", "Pour trouver le sujet, je pose la question : qui est-ce qui aboie ?", "La réponse est le sujet : le petit chien."],
  };
}

function illuNegative() {
  return {
    svg: etiquettes([["Léo"], ["mange"], ["sa soupe."]], 70)
      + Il.E(1, etiquettes([["Léo"], ["ne", IC.rouge], ["mange"], ["pas", IC.rouge], ["sa soupe."]], 150))
      + Il.E(2, etiquettes([["Léo"], ["n'", IC.rouge], ["aime"], ["pas", IC.rouge], ["la soupe."]], 230)),
    legendes: ["Une phrase affirmative.", "À la forme négative, ne et pas entourent le verbe, comme un sandwich.", "Devant une voyelle, ne devient n' : Léo n'aime pas."],
  };
}

function illuAccordAdjectif() {
  const lignes = [
    [["un"], ["chat"], ["noir"]],
    [["une"], ["chatte"], ["noir"], ["e", IC.rouge]],
    [["des"], ["chats"], ["noir"], ["s", IC.bleu]],
    [["des"], ["chattes"], ["noir"], ["es", IC.violet]],
  ];
  return {
    svg: lignes.map((l, i) => Il.E(i, etiquettes(l, 50 + i * 62))).join(""),
    legendes: ["L'adjectif s'accorde avec le nom : un chat noir.", "Au féminin, j'ajoute souvent un e.", "Au pluriel, j'ajoute souvent un s.", "Au féminin pluriel : es."],
  };
}

function illuAccordVerbe() {
  return {
    svg: Il.E(0, etiquettes([["Le chien", IC.bleu], ["court", IC.rouge], ["."]], 70))
      + Il.E(1, etiquettes([["Les chiens", IC.bleu], ["courent", IC.rouge], ["."]], 150) + Il.T(290, 190, "-ent avec ils", { s: 16, c: IC.rouge }))
      + Il.E(2, etiquettes([["Tu", IC.bleu], ["chantes", IC.rouge], ["."]], 240) + Il.T(290, 276, "-s avec tu", { s: 16, c: IC.rouge })),
    legendes: ["Le verbe s'accorde avec son sujet : le chien court.", "Si le sujet est au pluriel, le verbe aussi : les chiens courent.", "Avec tu, le verbe se termine par s : tu chantes."],
  };
}

function illuPluriel() {
  const ligne = (y, a, b, fin, c, k) => Il.E(k, Il.T(65, y, a, { s: 21 }) + Il.fleche(118, y - 8, 152, y - 8, IC.gris) + Il.T(218, y, b, { s: 21 }) + Il.T(396, y, fin, { s: 15, c, a: "end" }));
  return {
    svg: ligne(55, "un chat", "des chats", "+ s", IC.bleu, 0) + ligne(115, "un nez", "des nez", "ne change pas", IC.gris, 1)
      + ligne(175, "un cheval", "des chevaux", "-al → -aux", IC.rouge, 2) + ligne(235, "un jeu", "des jeux", "-eu → -eux", IC.violet, 3),
    legendes: ["Le plus souvent, on ajoute un s au pluriel.", "Les noms qui finissent par s, x ou z ne changent pas.", "Beaucoup de noms en -al font leur pluriel en -aux.", "Les noms en -eu, -eau et -au prennent un x."],
  };
}

function illuPresentEr() {
  const p = [["je", "chant", "e"], ["tu", "chant", "es"], ["il / elle", "chant", "e"], ["nous", "chant", "ons"], ["vous", "chant", "ez"], ["ils / elles", "chant", "ent"]];
  let s = Il.E(0, Il.T(200, 32, "chanter", { s: 24 }) + Il.T(200, 54, "radical : chant", { s: 15, b: false }));
  p.forEach(([pr, rad, fin], i) => {
    const y = 90 + i * 32, k = i < 3 ? 1 : 2;
    s += Il.E(k, Il.T(150, y, pr, { s: 20, a: "end", b: false }) + Il.T(165, y, `${rad}<tspan fill="${IC.rouge}">${fin}</tspan>`, { s: 22, a: "start" }));
  });
  s += Il.E(3, Il.T(335, 140, "-e  -es  -e", { s: 17, c: IC.rouge }) + Il.T(335, 166, "-ons  -ez  -ent", { s: 17, c: IC.rouge }));
  return { svg: s, legendes: ["On enlève -er : il reste le radical, chant.", "Au singulier : je chante, tu chantes, il chante.", "Au pluriel : nous chantons, vous chantez, ils chantent.", "Les terminaisons sont les mêmes pour tous les verbes en -er."] };
}

function illuHomophones() {
  const ligne = (y, phrase, test, ok, k) => Il.E(k, Il.T(20, y, phrase, { s: 19, a: "start" }) + Il.T(20, y + 26, test, { s: 16, a: "start", b: false, c: IC.gris }) + Il.T(380, y + 12, ok ? "✓" : "✗", { s: 28, a: "end", c: ok ? IC.vert : IC.rouge }));
  return {
    svg: ligne(40, "Il a un vélo.", "Il avait un vélo : ça marche → a", true, 0) + ligne(105, "Il va à l'école.", "Il va avait l'école : non → à", false, 1)
      + ligne(170, "Le ciel est bleu.", "Le ciel était bleu : ça marche → est", true, 2) + ligne(235, "Un chat et un chien.", "était ? non → et (= et puis)", false, 3),
    legendes: ["Si je peux dire avait, j'écris a (le verbe avoir).", "Si avait ne va pas, j'écris à avec un accent.", "Si je peux dire était, j'écris est (le verbe être).", "Si je peux dire et puis, j'écris et."],
  };
}

function illuContraires() {
  const paire = (y, a, b, k) => Il.E(k, Il.T(110, y, a, { s: 24 }) + Il.L(170, y - 8, 230, y - 8, { c: IC.rouge }) + `<path d="M170,${y - 8} l10,-7 v14 z M230,${y - 8} l-10,-7 v14 z" fill="${IC.rouge}"/>` + Il.T(290, y, b, { s: 24 }));
  return {
    svg: paire(60, "grand", "petit", 0) + paire(125, "chaud", "froid", 1) + paire(190, "ouvrir", "fermer", 2) + Il.E(3, Il.T(200, 250, "heureux ↔ malheureux", { s: 22, c: IC.violet })),
    legendes: ["Deux mots contraires ont des sens opposés : grand et petit.", "Chaud et froid.", "Les verbes aussi : ouvrir et fermer.", "Parfois, on ajoute un début de mot : heureux, malheureux."],
  };
}

function illuFamilles() {
  const branches = [["terrain", 80, 70], ["enterrer", 320, 70], ["terrestre", 80, 220], ["terrier", 320, 220]];
  let s = Il.E(0, Il.C(200, 145, 46, { f: "#a6dc8f" }) + Il.T(200, 153, "terre", { s: 24 }));
  branches.forEach(([m, x, y], i) => {
    s += Il.E(i + 1, Il.L(200 + (x - 200) * 0.32, 145 + (y - 145) * 0.45, x + (200 - x) * 0.28, y + (145 - y) * 0.2, { c: IC.vert }) + Il.R(x - 58, y - 22, 116, 36, { f: "#fff", rx: 10 }) + Il.T(x, y + 4, m.replace("terr", "<tspan fill=\"#3fa34d\">terr</tspan>"), { s: 19 }));
  });
  return { svg: s, legendes: ["Le mot de départ : terre.", "terrain : on y retrouve terr.", "enterrer : mettre dans la terre.", "terrestre : qui vit sur la Terre.", "terrier : la maison du lapin, creusée dans la terre. Tous ces mots sont de la même famille."] };
}

/* lien leçon → schéma */
Object.assign(ILLUSTRATIONS, {
  "m1-2": illuComparer, "m1-3": illuSuites, "m1-4": illuMCDU,
  "m2-1": illuAddition, "m2-2": illuSoustraction, "m2-3": illuTables, "m2-4": illuMultiplication, "m2-6": illuPartage,
  "m3-5": illuMonnaie,
  "m4-1": illuQuadrillage, "m4-2": illuDroites, "m4-3": illuFigures, "m4-4": illuSymetrie, "m4-5": illuSolides,
  "m5-1": illuLongueurs, "m5-2": illuMasses, "m5-3": illuHeure,
  "fr2-1": illuPhrase, "fr2-5": illuSujetVerbe, "fr2-6": illuNegative,
  "fr3-1": illuAccordAdjectif, "fr3-2": illuAccordVerbe, "fr3-3": illuPluriel, "fr3-5": illuHomophones,
  "fr4-1": illuPresentEr, "fr5-1": illuContraires, "fr5-2": illuFamilles,
});
