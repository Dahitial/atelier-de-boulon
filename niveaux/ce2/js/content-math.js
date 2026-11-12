/* L'Atelier de Boulon — Mathématiques CE2 : exercices générés (toujours nouveaux). */
"use strict";

/* ------------------------------------------------------------------ */
/* Nombres en lettres (orthographe traditionnelle)                      */
/* ------------------------------------------------------------------ */
function numToFr(n) {
  const U = ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize"];
  const T = { 20: "vingt", 30: "trente", 40: "quarante", 50: "cinquante", 60: "soixante" };
  function under100(x) {
    if (x <= 16) return U[x];
    if (x < 20) return "dix-" + U[x - 10];
    if (x < 70) {
      const t = Math.floor(x / 10) * 10, u = x % 10;
      if (!u) return T[t];
      return T[t] + (u === 1 ? " et un" : "-" + U[u]);
    }
    if (x < 80) return x === 71 ? "soixante et onze" : "soixante-" + under100(x - 60);
    if (x === 80) return "quatre-vingts";
    return "quatre-vingt-" + under100(x - 80);
  }
  function under1000(x) {
    const c = Math.floor(x / 100), r = x % 100;
    let s = "";
    if (c === 1) s = "cent"; else if (c > 1) s = U[c] + (r === 0 ? " cents" : " cent");
    if (r) s += (s ? " " : "") + under100(r);
    return s || "zéro";
  }
  if (n === 0) return "zéro";
  const m = Math.floor(n / 1000), r = n % 1000;
  let s = "";
  if (m === 1) s = "mille"; else if (m > 1) s = under1000(m).replace(/cents$/, "cent") + " mille";
  if (r) s += (s ? " " : "") + under1000(r);
  return s;
}

/* petits utilitaires de génération */
function distinctNums(correct, makeWrong, count = 3) {
  const set = new Set([correct]);
  let guard = 0;
  while (set.size < count + 1 && guard++ < 60) { const w = makeWrong(); if (w > 0) set.add(w); }
  return shuffle([...set]);
}
const NAMES = ["Léo", "Mila", "Sami", "Inès", "Noé", "Lina", "Hugo", "Jade", "Adam", "Zoé", "Tom", "Nora"];
const tableHtml = (rows) => `<table style="border-collapse:collapse;font-size:22px;margin:auto;background:#fff">${rows.map((r, i) => `<tr>${r.map((c) => `<td style="border:2px solid #2b2236;padding:4px 14px;${i === 0 ? "font-weight:700;background:#f6c445" : ""}">${c}</td>`).join("")}</tr>`).join("")}</table>`;

/* ------------------------------------------------------------------ */
/* Générateurs par leçon                                              */
/* ------------------------------------------------------------------ */
const G = {
  lireNombres() {
    const n = rand(1000, 9999);
    if (Math.random() < 0.5) {
      return {
        type: "qcm", consigne: "Clique sur le nombre qui correspond.", prompt: `« ${numToFr(n)} »`,
        choices: distinctNums(n, () => {
          const s = String(n).split(""); const i = rand(1, 3); [s[i], s[i - 1]] = [s[i - 1], s[i]];
          return Math.random() < 0.5 ? +s.join("") : n + pick([10, 100, -10, -100, 1000]);
        }).map(fmtNum), answer: fmtNum(n),
      };
    }
    return { type: "saisie", consigne: "Écris ce nombre en chiffres.", prompt: `« ${numToFr(n)} »`, answer: [String(n)], numeric: true };
  },
  comparer() {
    if (Math.random() < 0.6) {
      let a = rand(1000, 9999), b = Math.random() < 0.5 ? a + pick([1, 10, 100, -1, -10, -100]) : rand(1000, 9999);
      if (Math.random() < 0.1) b = a;
      const ans = a < b ? "<" : a > b ? ">" : "=";
      return { type: "qcm", consigne: "Choisis le bon signe.", prompt: `<span class="prompt big">${fmtNum(a)} … ${fmtNum(b)}</span>`, choices: ["<", ">", "="], answer: ans };
    }
    const base = rand(1, 9) * 1000;
    const nums = [...new Set(Array.from({ length: 4 }, () => base + rand(0, 999)))];
    while (nums.length < 4) nums.push(base + rand(0, 999));
    const sorted = [...new Set(nums)].sort((x, y) => x - y);
    return { type: "ordre", consigne: "Range ces nombres du plus petit au plus grand.", words: sorted.map(fmtNum), joiner: " < " };
  },
  suites() {
    const step = pick([2, 5, 10, 100, 1000, 25, 50]) * (Math.random() < 0.25 ? -1 : 1);
    let start = rand(1, 80) * (Math.abs(step) >= 100 ? 10 : 1) + (step < 0 ? 4000 : 0);
    const seq = Array.from({ length: 5 }, (_, i) => start + step * i);
    const hide = rand(2, 4);
    const shown = seq.map((x, i) => (i === hide ? "…" : fmtNum(x))).join(" ; ");
    return { type: "saisie", consigne: "Trouve le nombre qui manque dans la suite.", prompt: `<span class="prompt big">${shown}</span>`, answer: [String(seq[hide])], numeric: true };
  },
  decomposer() {
    const n = rand(1000, 9999);
    const d = String(n).split("").map(Number);
    const r = Math.random();
    if (r < 0.4) {
      const k = rand(0, 3), names = ["milliers", "centaines", "dizaines", "unités"];
      const set = new Set([String(d[k])]);
      for (const x of shuffle(d)) if (set.size < 4) set.add(String(x));
      while (set.size < 4) set.add(String(rand(0, 9)));
      return { type: "qcm", consigne: `Quel est le chiffre des ${names[k]} ?`, prompt: `<span class="prompt big">${fmtNum(n)}</span>`, choices: shuffle([...set]), answer: String(d[k]) };
    }
    if (r < 0.75) {
      return { type: "saisie", consigne: "Écris le nombre.", prompt: `${d[0]} milliers + ${d[1]} centaines + ${d[2]} dizaines + ${d[3]} unités`, answer: [String(n)], numeric: true };
    }
    return { type: "saisie", consigne: "Complète la décomposition.", prompt: `${fmtNum(n)} = ${fmtNum(d[0] * 1000)} + ${fmtNum(d[1] * 100)} + … + ${d[3]}`, answer: [String(d[2] * 10)], numeric: true };
  },
  addition() {
    const a = rand(100, 4999), b = rand(100, 4999);
    return { type: "saisie", consigne: "Calcule (tu peux poser l'opération sur une feuille).", prompt: `<span class="prompt big">${fmtNum(a)} + ${fmtNum(b)} = …</span>`, answer: [String(a + b)], numeric: true };
  },
  soustraction() {
    const a = rand(500, 9999), b = rand(100, a - 1);
    return { type: "saisie", consigne: "Calcule (pense aux retenues !).", prompt: `<span class="prompt big">${fmtNum(a)} − ${fmtNum(b)} = …</span>`, answer: [String(a - b)], numeric: true };
  },
  tables() {
    const a = rand(2, 9), b = rand(2, 10);
    if (Math.random() < 0.3) {
      return { type: "qcm", consigne: "Clique sur le bon résultat.", prompt: `<span class="prompt big">${a} × ${b}</span>`, choices: distinctNums(a * b, () => a * b + pick([-a, a, -b, b, 1, -1, 10])).map(String), answer: String(a * b) };
    }
    if (Math.random() < 0.3) {
      return { type: "saisie", consigne: "Trouve le nombre qui manque.", prompt: `<span class="prompt big">${a} × … = ${a * b}</span>`, answer: [String(b)], numeric: true };
    }
    return { type: "saisie", consigne: "Calcule.", prompt: `<span class="prompt big">${a} × ${b} = …</span>`, answer: [String(a * b)], numeric: true };
  },
  mult1() {
    const a = rand(12, 499), b = rand(2, 9);
    return { type: "saisie", consigne: "Calcule (pose l'opération si besoin).", prompt: `<span class="prompt big">${a} × ${b} = …</span>`, answer: [String(a * b)], numeric: true };
  },
  mult2() {
    if (Math.random() < 0.35) {
      const a = rand(2, 99), b = pick([10, 20, 30, 40, 50, 100]);
      return { type: "saisie", consigne: "Calcule. Astuce : multiplier par 10, c'est ajouter un zéro !", prompt: `<span class="prompt big">${a} × ${b} = …</span>`, answer: [String(a * b)], numeric: true };
    }
    const a = rand(11, 99), b = rand(11, 39);
    return { type: "saisie", consigne: "Calcule (pose l'opération sur une feuille).", prompt: `<span class="prompt big">${a} × ${b} = …</span>`, answer: [String(a * b)], numeric: true };
  },
  partage() {
    const parts = rand(2, 6), each = rand(2, 9), reste = Math.random() < 0.5 ? 0 : rand(1, parts - 1);
    const total = parts * each + reste;
    const who = pick(NAMES), obj = pick(["billes", "cartes", "bonbons", "images", "perles", "crêpes"]);
    if (reste === 0) {
      return { type: "saisie", consigne: "Résous le problème.", prompt: `${who} partage ${total} ${obj} entre ${parts} amis. Combien chacun en reçoit-il ?`, answer: [String(each)], numeric: true };
    }
    return Math.random() < 0.5
      ? { type: "saisie", consigne: "Résous le problème.", prompt: `${who} partage ${total} ${obj} entre ${parts} amis, de façon égale. Combien chacun en reçoit-il ?`, answer: [String(each)], numeric: true }
      : { type: "saisie", consigne: "Résous le problème.", prompt: `${who} partage ${total} ${obj} entre ${parts} amis, de façon égale. Combien en reste-t-il ?`, answer: [String(reste)], numeric: true };
  },
  choisirOperation() {
    const who = pick(NAMES), a = rand(12, 60), b = rand(3, 9);
    const items = [
      [`${who} a ${a} billes. Il en gagne ${b}. Combien en a-t-il maintenant ?`, "+"],
      [`${who} a ${a} billes. Il en perd ${b}. Combien lui en reste-t-il ?`, "−"],
      [`Il y a ${b} boîtes de ${a} crayons. Combien de crayons en tout ?`, "×"],
      [`${who} range ${b * 4} œufs dans des boîtes de ${b}. Combien de boîtes ?`, ":"],
      [`Dans le bus, il y a ${a} passagers. ${b} descendent. Combien en reste-t-il ?`, "−"],
      [`Un livre coûte ${Money.amount(a * Money.scale())}, un stylo ${Money.amount(b * Money.scale())}. Combien pour les deux ?`, "+"],
      [`Une table a 4 pieds. Combien de pieds pour ${b} tables ?`, "×"],
    ];
    const [p, op] = pick(items);
    return { type: "qcm", consigne: "Quelle opération faut-il faire ?", prompt: p, choices: ["+", "−", "×", ":"], answer: op };
  },
  probleme1() {
    const who = pick(NAMES), r = rand(0, 3);
    if (r === 0) { const a = rand(120, 480), b = rand(50, 300); return { type: "saisie", consigne: "Résous le problème.", prompt: `La bibliothèque a ${a} livres. Elle en achète ${b}. Combien de livres a-t-elle maintenant ?`, answer: [String(a + b)], numeric: true }; }
    if (r === 1) { const a = rand(300, 900), b = rand(50, a - 50); return { type: "saisie", consigne: "Résous le problème.", prompt: `Un fermier récolte ${a} pommes. Il en vend ${b}. Combien lui en reste-t-il ?`, answer: [String(a - b)], numeric: true }; }
    if (r === 2) { const a = rand(3, 9), b = rand(12, 48); return { type: "saisie", consigne: "Résous le problème.", prompt: `${who} achète ${a} paquets de ${b} gâteaux. Combien de gâteaux a-t-il en tout ?`, answer: [String(a * b)], numeric: true }; }
    const a = rand(80, 200), b = rand(a + 20, a + 300);
    return { type: "saisie", consigne: "Résous le problème.", prompt: `${who} a ${a} points au jeu. Sa sœur a ${b} points. Combien de points de plus a sa sœur ?`, answer: [String(b - a)], numeric: true };
  },
  probleme2() {
    const who = pick(NAMES), r = rand(0, 2);
    if (r === 0) { const k = Money.scale(), p = rand(3, 8) * k, n = rand(2, 5), argent = n * p + rand(1, 15) * k; return { type: "saisie", consigne: "Résous le problème en deux étapes.", prompt: `${who} a ${Money.amount(argent)}. Il achète ${n} cahiers à ${Money.amount(p)} chacun. Combien d'argent lui reste-t-il ?`, answer: [String(argent - n * p)], numeric: true, unit: Money.sym() }; }
    if (r === 1) { const a = rand(20, 40), b = rand(15, 35), c = rand(5, 15); return { type: "saisie", consigne: "Résous le problème en deux étapes.", prompt: `Dans un car, il y a ${a} enfants et ${b} adultes. ${c} personnes descendent au premier arrêt. Combien de personnes reste-t-il ?`, answer: [String(a + b - c)], numeric: true }; }
    const rangs = rand(3, 8), par = rand(4, 9), plus = rand(5, 20);
    return { type: "saisie", consigne: "Résous le problème en deux étapes.", prompt: `Dans un jardin, il y a ${rangs} rangées de ${par} salades. Le jardinier en plante encore ${plus}. Combien de salades en tout ?`, answer: [String(rangs * par + plus)], numeric: true };
  },
  tableau() {
    const fruits = shuffle(["pommes", "poires", "bananes", "kiwis", "prunes"]).slice(0, 4);
    const vals = fruits.map(() => rand(5, 40));
    const t = tableHtml([["Fruit", ...fruits], ["Nombre vendu", ...vals]]);
    const r = rand(0, 2);
    if (r === 0) { const i = vals.indexOf(Math.max(...vals)); return { type: "qcm", consigne: "Lis le tableau et réponds.", prompt: t + "<br>Quel fruit a été le plus vendu ?", choices: fruits, answer: fruits[i] }; }
    if (r === 1) { const i = rand(0, 3); return { type: "saisie", consigne: "Lis le tableau et réponds.", prompt: t + `<br>Combien de ${fruits[i]} ont été vendus ?`, answer: [String(vals[i])], numeric: true }; }
    const i = rand(0, 1), j = rand(2, 3);
    return { type: "saisie", consigne: "Lis le tableau et réponds.", prompt: t + `<br>Combien de ${fruits[i]} et de ${fruits[j]} en tout ?`, answer: [String(vals[i] + vals[j])], numeric: true };
  },
  monnaie() {
    const r = rand(0, 2), S = Money.sym();
    if (r === 0) {
      // deux prix (en centimes) à additionner
      const a = Money.isMAD ? rand(12, 95) * 100 + pick([0, 50, 0]) : rand(1, 9) * 100 + pick([0, 50, 20, 80]);
      const b = Money.isMAD ? rand(10, 60) * 100 + pick([0, 50]) : rand(1, 5) * 100 + pick([0, 50, 30]);
      return { type: "saisie", consigne: `Combien faut-il payer ? (écris le résultat en ${Money.nom()})`, prompt: `Un livre à <b>${Money.fmt(a)}</b> et un jeu de cartes à <b>${Money.fmt(b)}</b>.`, answer: [String((a + b) / 100)], numeric: true, unit: S };
    }
    if (r === 1) {
      // rendre la monnaie avec le plus petit billet qui suffit
      const prix = rand(3, 17) * Money.scale();
      const billet = Money.billets().slice().sort((x, y) => x - y).find((x) => x > prix);
      return { type: "saisie", consigne: "Combien la marchande rend-elle ?", prompt: `${pick(NAMES)} paie un article à <b>${Money.amount(prix)}</b> avec un billet de <b>${Money.amount(billet)}</b>.`, answer: [String(billet - prix)], numeric: true, unit: S };
    }
    // la tirelire : quelques billets et quelques pièces
    const billets = Money.billets().slice(-2), pieces = Money.pieces().slice(0, 2);
    const items = [...billets.map((v) => [v, "billet", rand(0, 2)]), ...pieces.map((v) => [v, "pièce", rand(0, 4)])];
    const total = items.reduce((s, [v, , n]) => s + v * n, 0);
    const parts = items.filter(([, , n]) => n).map(([v, k, n]) => `${n} ${k}${n > 1 ? "s" : ""} de ${Money.amount(v)}`);
    if (!parts.length) return this.monnaie();
    return { type: "saisie", consigne: "Combien d'argent y a-t-il dans la tirelire ?", prompt: parts.join(", ") + ".", answer: [String(total)], numeric: true, unit: S };
  },
  quadrillage() {
    const cols = "ABCDEF", c = rand(0, 5), r = rand(0, 4), cell = 52;
    const icon = pick(["⭐", "🍎", "🐞", "🚀", "🎈", "🐟"]);
    let svg = `<svg width="${cell * 7}" height="${cell * 6}" viewBox="0 0 ${cell * 7} ${cell * 6}"><rect x="${cell}" y="0" width="${cell * 6}" height="${cell * 5}" fill="#fff"/>`;
    for (let i = 0; i <= 6; i++) svg += `<line x1="${cell * (i + 1)}" y1="0" x2="${cell * (i + 1)}" y2="${cell * 5}" stroke="#2b2236" stroke-width="2"/>`;
    for (let j = 0; j <= 5; j++) svg += `<line x1="${cell}" y1="${cell * j}" x2="${cell * 7}" y2="${cell * j}" stroke="#2b2236" stroke-width="2"/>`;
    for (let i = 0; i < 6; i++) svg += `<text x="${cell * (i + 1.5)}" y="${cell * 5.7}" text-anchor="middle" font-size="24" font-weight="700" fill="#2e86de">${cols[i]}</text>`;
    for (let j = 0; j < 5; j++) svg += `<text x="${cell * 0.5}" y="${cell * (j + 0.65)}" text-anchor="middle" font-size="24" font-weight="700" fill="#e4572e">${5 - j}</text>`;
    svg += `<text x="${cell * (c + 1.5)}" y="${cell * (4 - r + 0.72)}" text-anchor="middle" font-size="32">${icon}</text></svg>`;
    return { type: "saisie", consigne: "Écris le code de la case où se trouve le dessin (lettre puis chiffre).", prompt: svg, answer: [cols[c] + (r + 1)], width: 160 };
  },
  droites() {
    const qs = [
      { prompt: "Un trait droit limité par deux points s'appelle…", choices: ["un segment", "une droite", "un cercle"], answer: "un segment" },
      { prompt: "Un trait droit qui ne s'arrête jamais s'appelle…", choices: ["une droite", "un segment", "un angle"], answer: "une droite" },
      { prompt: "Pour tracer un trait bien droit, j'utilise…", choices: ["une règle", "un compas", "une gomme"], answer: "une règle" },
      { prompt: "Pour vérifier un angle droit, j'utilise…", choices: ["une équerre", "un compas", "un crayon"], answer: "une équerre" },
      { prompt: `${Art.shape("carre", 110, "#f6c445")}<br>Combien d'angles droits a ce carré ?`, choices: ["4", "2", "0"], answer: "4" },
      { prompt: `${Art.shape("triangle", 110, "#7bc950")}<br>Combien de côtés a ce triangle ?`, choices: ["3", "4", "2"], answer: "3" },
      { prompt: `${Art.shape("rectangle", 120, "#5bc0eb")}<br>Combien d'angles droits a ce rectangle ?`, choices: ["4", "1", "2"], answer: "4" },
      { prompt: `${Art.shape("hexagone", 110, "#ef7fa8")}<br>Combien de côtés a cette figure ?`, choices: ["6", "5", "8"], answer: "6" },
    ];
    const q = pick(qs);
    return { type: "qcm", consigne: "Réponds à la question.", prompt: q.prompt, choices: shuffle(q.choices), answer: q.answer };
  },
  figures() {
    const shapes = { carre: "carré", rectangle: "rectangle", triangle: "triangle", cercle: "cercle", losange: "losange", pentagone: "pentagone" };
    const keys = sample(Object.keys(shapes), 4);
    const target = pick(keys);
    const colors = ["#f6c445", "#5bc0eb", "#7bc950", "#ef7fa8"];
    return {
      type: "img", consigne: `Clique sur le ${shapes[target]}.`, prompt: "",
      choices: keys.map((k, i) => ({ svg: Art.shape(k, 110, colors[i]) })), answer: keys.indexOf(target),
    };
  },
  symetrie() {
    // motif gauche aléatoire sur 3 colonnes × 5 lignes, complété en miroir
    const left = [];
    for (let r = 0; r < 5; r++) for (let c = 0; c < 3; c++) if (Math.random() < 0.4) left.push([c, r]);
    if (left.length < 3) left.push([2, 1], [1, 2], [0, 3]);
    const mirror = (cells) => cells.map(([c, r]) => [5 - c, r]);
    const good = left.concat(mirror(left));
    const variants = [];
    // faux 1 : décalage d'une case vers le bas à droite
    variants.push(left.concat(mirror(left).map(([c, r]) => [c, (r + 1) % 5])));
    // faux 2 : copie sans miroir (translation)
    variants.push(left.concat(left.map(([c, r]) => [c + 3, r])));
    // faux 3 : une case retirée à droite
    const m = mirror(left); m.splice(rand(0, m.length - 1), 1);
    variants.push(left.concat(m));
    const items = shuffle([{ cells: good, ok: true }, ...variants.map((v) => ({ cells: v, ok: false }))]);
    // garde seulement les faux réellement différents du bon motif
    const key = (cells) => cells.map((x) => x.join(",")).sort().join(";");
    const gk = key(good);
    const uniq = items.filter((it, i) => it.ok || (key(it.cells) !== gk && items.findIndex((o) => key(o.cells) === key(it.cells)) === i));
    return {
      type: "img", consigne: "Clique sur la figure qui est symétrique par rapport à l'axe bleu.", prompt: "",
      choices: uniq.map((it) => ({ svg: Art.gridPattern(it.cells, 6, 5, 28) })), answer: uniq.findIndex((it) => it.ok),
    };
  },
  solides() {
    const qs = [
      { type: "qcm", consigne: "Réponds.", prompt: "Combien de faces a un cube ?", choices: ["6", "4", "8"], answer: "6" },
      { type: "qcm", consigne: "Réponds.", prompt: "Combien de sommets (coins) a un cube ?", choices: ["8", "6", "12"], answer: "8" },
      { type: "qcm", consigne: "Réponds.", prompt: "Quel solide roule dans tous les sens ?", choices: ["la boule", "le cube", "le pavé"], answer: "la boule" },
      { type: "img", consigne: "Clique sur l'objet qui a la forme d'un cylindre.", prompt: "", choices: [{ e: "🥫", label: "boîte de conserve" }, { e: "🎲", label: "dé" }, { e: "⚽", label: "ballon" }], answer: 0 },
      { type: "img", consigne: "Clique sur l'objet qui a la forme d'un cube.", prompt: "", choices: [{ e: "⚽", label: "ballon" }, { e: "🎲", label: "dé" }, { e: "🍦", label: "cornet" }], answer: 1 },
      { type: "img", consigne: "Clique sur l'objet qui a la forme d'une boule.", prompt: "", choices: [{ e: "📦", label: "carton" }, { e: "🥫", label: "boîte" }, { e: "🏀", label: "ballon" }], answer: 2 },
      { type: "img", consigne: "Clique sur l'objet qui a la forme d'un cône.", prompt: "", choices: [{ e: "🍦", label: "cornet" }, { e: "📦", label: "carton" }, { e: "🎲", label: "dé" }], answer: 0 },
      { type: "qcm", consigne: "Réponds.", prompt: "Les faces d'un cube sont des…", choices: ["carrés", "triangles", "cercles"], answer: "carrés" },
      { type: "qcm", consigne: "Réponds.", prompt: "Une boîte à chaussures a la forme d'un…", choices: ["pavé", "cylindre", "cône"], answer: "pavé" },
    ];
    const q = Object.assign({}, pick(qs));
    if (q.type === "qcm") q.choices = shuffle(q.choices);
    else { const order = shuffle(q.choices.map((c, i) => i)); q.choices = order.map((i) => q.choices[i]); q.answer = order.indexOf(q.answer); }
    return q;
  },
  longueurs() {
    const r = rand(0, 3);
    if (r === 0) { const m = rand(1, 9); return { type: "saisie", consigne: "Convertis.", prompt: `${m} m = … cm`, answer: [String(m * 100)], numeric: true }; }
    if (r === 1) { const km = rand(1, 9); return { type: "saisie", consigne: "Convertis.", prompt: `${km} km = … m`, answer: [String(km * 1000)], numeric: true }; }
    if (r === 2) { const cm = rand(1, 20); return { type: "saisie", consigne: "Convertis.", prompt: `${cm} cm = … mm`, answer: [String(cm * 10)], numeric: true }; }
    const q = pick([["la longueur d'un crayon", "cm"], ["la distance entre deux villes", "km"], ["la hauteur d'une maison", "m"], ["l'épaisseur d'une pièce de monnaie", "mm"], ["la longueur d'une piscine", "m"]]);
    return { type: "qcm", consigne: "Quelle unité choisir ?", prompt: `Pour mesurer ${q[0]}, j'utilise le…`, choices: ["km", "m", "cm", "mm"], answer: q[1] };
  },
  masses() {
    const r = rand(0, 2);
    if (r === 0) { const kg = rand(1, 9); return { type: "saisie", consigne: "Convertis.", prompt: `${kg} kg = … g`, answer: [String(kg * 1000)], numeric: true }; }
    if (r === 1) {
      const a = rand(1, 4) * 100 + pick([0, 50]), b = rand(1, 5) * 100;
      return { type: "saisie", consigne: "Calcule la masse totale (en grammes).", prompt: `Un paquet de farine de ${a} g et un sachet de sucre de ${b} g.`, answer: [String(a + b)], numeric: true, unit: "g" };
    }
    const q = pick([["un éléphant", "t"], ["une pomme", "g"], ["un sac de pommes de terre", "kg"], ["une plume", "g"], ["un enfant de CE2", "kg"]]);
    return { type: "qcm", consigne: "Quelle unité choisir ?", prompt: `Pour peser ${q[0]}, j'utilise…`, choices: ["g", "kg", "t"], answer: q[1] };
  },
  temps() {
    const r = rand(0, 3);
    if (r === 0) {
      const hh = rand(1, 12), mm = pick([0, 15, 30, 45, 5, 10, 20, 40, 50]);
      const fmt = (h, m) => `${h} h ${String(m).padStart(2, "0")}`;
      const wrong = [fmt(hh, (mm + 30) % 60), fmt((hh % 12) + 1, mm), fmt(mm === 0 ? 12 : Math.max(1, Math.round(mm / 5)), hh * 5 % 60)];
      return { type: "qcm", consigne: "Quelle heure indique l'horloge ?", prompt: Art.clockSvg(hh, mm, 200), choices: shuffle([...new Set([fmt(hh, mm), ...wrong])]), answer: fmt(hh, mm) };
    }
    if (r === 1) { const h = rand(1, 4); return { type: "saisie", consigne: "Convertis.", prompt: `${h} h = … min`, answer: [String(h * 60)], numeric: true }; }
    if (r === 2) {
      const sh = rand(8, 16), sm = pick([0, 15, 30, 45]), dh = rand(0, 2), dm = pick([15, 30, 45]);
      const t = sh * 60 + sm + dh * 60 + dm;
      return { type: "saisie", consigne: "À quelle heure se termine-t-il ? (écris par exemple 15 h 30)", prompt: `Le film commence à ${sh} h ${String(sm).padStart(2, "0")} et dure ${dh ? dh + " h " : ""}${dm} min.`, answer: [`${Math.floor(t / 60)} h ${String(t % 60).padStart(2, "0")}`, `${Math.floor(t / 60)}h${String(t % 60).padStart(2, "0")}`, `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`], timeAnswer: true, width: 220 };
    }
    const q = pick([["Combien de jours dans une semaine ?", "7"], ["Combien de mois dans une année ?", "12"], ["Combien de minutes dans une heure ?", "60"], ["Combien d'heures dans une journée ?", "24"], ["Combien de jours en février (année normale) ?", "28"]]);
    return { type: "saisie", consigne: "Réponds.", prompt: q[0], answer: [q[1]], numeric: true };
  },
};

function repeatGen(fn, n = 8) { return () => Array.from({ length: n }, () => fn.call(G)); }

const MATH = {
  id: "math", name: "Mathématiques", color: "#2e86de",
  chapters: [
    {
      id: "m1", title: "Les nombres", color: "#2e86de", lessons: [
        { id: "m1-1", title: "Lire et écrire les nombres jusqu'à 9 999", gen: G.lireNombres,
          lesson: { rule: ["Un nombre jusqu'à 9 999 a au plus <b>4 chiffres</b> : milliers, centaines, dizaines, unités.", "On laisse un <b>petit espace</b> entre les milliers et les centaines : 3 405.", "<b>mille</b> ne prend jamais de « s »."], ex: "3 405 → <b>trois mille quatre cent cinq</b>" } },
        { id: "m1-2", title: "Comparer et ranger les nombres", gen: G.comparer,
          lesson: { rule: ["Pour comparer deux nombres, compte d'abord leurs chiffres : le plus long est le plus grand.", "S'ils ont autant de chiffres, compare les milliers, puis les centaines, puis les dizaines…", "<b>&lt;</b> veut dire « plus petit que », <b>&gt;</b> veut dire « plus grand que »."], ex: "4 <b>3</b>12 &lt; 4 <b>5</b>01 car 3 centaines &lt; 5 centaines" } },
        { id: "m1-3", title: "Les suites de nombres", gen: G.suites,
          lesson: { rule: ["Dans une suite, on ajoute (ou on enlève) toujours <b>le même nombre</b>.", "Cherche l'écart entre deux nombres qui se suivent."], ex: "250 ; 275 ; 300 ; 325 → on ajoute <b>25</b> à chaque fois" } },
        { id: "m1-4", title: "Milliers, centaines, dizaines, unités", gen: G.decomposer,
          lesson: { rule: ["Chaque chiffre a une <b>valeur</b> selon sa place.", "1 millier = 10 centaines = 100 dizaines = 1 000 unités."], ex: "6 <b>2</b>48 : le chiffre des centaines est <b>2</b> ; 6 248 = 6 000 + 200 + 40 + 8" } },
      ],
    },
    {
      id: "m2", title: "Le calcul", color: "#3fa34d", lessons: [
        { id: "m2-1", title: "L'addition posée", gen: G.addition,
          lesson: { rule: ["On aligne bien les <b>unités sous les unités</b>, les dizaines sous les dizaines…", "On commence par la droite. Si on dépasse 9, on écrit l'unité et on pose une <b>retenue</b>."], ex: "1 258 + 374 = <b>1 632</b>" } },
        { id: "m2-2", title: "La soustraction posée", gen: G.soustraction,
          lesson: { rule: ["On met toujours le <b>plus grand nombre en haut</b>.", "Si le chiffre du haut est trop petit, on ajoute 10 en haut et 1 en bas dans la colonne suivante (la <b>retenue</b>)."], ex: "502 − 147 = <b>355</b>" } },
        { id: "m2-3", title: "Les tables de multiplication", gen: G.tables,
          lesson: { rule: ["Multiplier, c'est ajouter plusieurs fois le même nombre : 4 × 3 = 4 + 4 + 4.", "On peut échanger les nombres : 4 × 3 = 3 × 4.", "Apprends une table par semaine et récite-la à voix haute !"], ex: "7 × 8 = <b>56</b>" } },
        { id: "m2-4", title: "Multiplier par un nombre à 1 chiffre", gen: G.mult1,
          lesson: { rule: ["On multiplie d'abord les unités, puis les dizaines, puis les centaines.", "N'oublie pas d'<b>ajouter les retenues</b>."], ex: "246 × 3 = <b>738</b>" } },
        { id: "m2-5", title: "Multiplier par un nombre à 2 chiffres", gen: G.mult2,
          lesson: { rule: ["Multiplier par 10, c'est écrire un <b>0</b> à droite : 34 × 10 = 340.", "Pour 34 × 23 : on calcule 34 × 3 = 102, puis 34 × 20 = 680, puis on additionne : 782."], ex: "34 × 23 = <b>782</b>" } },
        { id: "m2-6", title: "Partager : approche de la division", gen: G.partage,
          lesson: { rule: ["Partager en parts égales, c'est chercher <b>combien de fois</b> le nombre de parts tient dans le total.", "Ce qui ne peut pas être partagé s'appelle le <b>reste</b>."], ex: "17 billes pour 5 enfants : 3 billes chacun (5 × 3 = 15), il <b>reste 2</b> billes." } },
      ],
    },
    {
      id: "m3", title: "Problèmes", color: "#f08a3c", lessons: [
        { id: "m3-1", title: "Choisir la bonne opération", gen: G.choisirOperation,
          lesson: { rule: ["<b>+</b> quand on ajoute, on réunit, on gagne.", "<b>−</b> quand on enlève, on perd, on cherche un écart.", "<b>×</b> quand on répète plusieurs fois la même quantité.", "<b>:</b> quand on partage ou qu'on fait des groupes."], ex: "« 5 sacs de 6 billes » → <b>5 × 6</b>" } },
        { id: "m3-2", title: "Problèmes à une opération", gen: G.probleme1,
          lesson: { rule: ["1. Lis l'énoncé deux fois. 2. Repère la <b>question</b>. 3. Choisis l'opération. 4. Calcule. 5. Fais une phrase-réponse."], ex: "Question : combien en reste-t-il ? → c'est une <b>soustraction</b>." } },
        { id: "m3-3", title: "Problèmes à deux opérations", gen: G.probleme2,
          get lesson() {
            const k = Money.scale();
            return { rule: ["Certains problèmes demandent <b>deux calculs</b>.", "Cherche d'abord la question cachée, puis réponds à la vraie question."],
              ex: `3 cahiers à ${Money.amount(4 * k)}, je paie avec ${Money.amount(20 * k)} : d'abord 3 × ${4 * k} = ${12 * k}, puis ${20 * k} − ${12 * k} = <b>${Money.amount(8 * k)}</b>.` };
          } },
        { id: "m3-4", title: "Lire un tableau", gen: G.tableau,
          lesson: { rule: ["Un tableau range des informations en <b>lignes</b> et en <b>colonnes</b>.", "Pour trouver une information, suis la ligne et la colonne avec ton doigt."], ex: "Ligne « Nombre vendu », colonne « pommes » → le nombre de pommes vendues." } },
        { id: "m3-5", title: "La monnaie : billets, pièces et centimes", gen: G.monnaie,
          get lesson() {
            if (Money.isMAD) return {
              rule: ["Au Maroc, la monnaie est le <b>dirham</b> (DH). 1 dirham = <b>100 centimes</b>.",
                "Billets : 20, 50, 100 et 200 DH. Pièces : 1, 2, 5 et 10 DH, et des pièces en centimes.",
                "On écrit 12 dirhams et 50 centimes : <b>12,50 DH</b>.",
                "Rendre la monnaie, c'est calculer la différence entre ce qu'on donne et le prix."],
              ex: "Je paie 35 DH avec un billet de 50 DH : on me rend <b>15 DH</b>." };
            return {
              rule: ["1 euro = <b>100 centimes</b>.", "On écrit 2 euros et 50 centimes : <b>2,50 €</b>.", "Rendre la monnaie, c'est calculer la différence entre ce qu'on donne et le prix."],
              ex: "Je paie 7 € avec un billet de 10 € : on me rend <b>3 €</b>." };
          } },
      ],
    },
    {
      id: "m4", title: "Géométrie", color: "#8e6cc9", lessons: [
        { id: "m4-1", title: "Se repérer sur un quadrillage", gen: G.quadrillage,
          lesson: { rule: ["Chaque case a un <b>code</b> : la lettre de sa colonne, puis le chiffre de sa ligne.", "Les lettres sont en bas, les chiffres sur le côté."], ex: "La case en bas à gauche est <b>A1</b>." } },
        { id: "m4-2", title: "Droites, segments et angles droits", gen: G.droites,
          lesson: { rule: ["Un <b>segment</b> est un trait droit limité par deux points. Une <b>droite</b> ne s'arrête jamais.", "Un <b>angle droit</b> se vérifie avec l'<b>équerre</b>."], ex: "Le carré et le rectangle ont <b>4 angles droits</b>." } },
        { id: "m4-3", title: "Les figures planes", gen: G.figures,
          lesson: { rule: ["<b>Carré</b> : 4 côtés égaux et 4 angles droits.", "<b>Rectangle</b> : 4 angles droits, côtés opposés égaux.", "<b>Triangle</b> : 3 côtés. <b>Cercle</b> : tous ses points sont à la même distance du centre.", "<b>Losange</b> : 4 côtés égaux."], ex: "Une fenêtre a souvent la forme d'un <b>rectangle</b>." } },
        { id: "m4-4", title: "La symétrie", gen: G.symetrie,
          lesson: { rule: ["Une figure est <b>symétrique</b> si, en la pliant le long de l'axe, les deux moitiés se superposent exactement.", "Chaque case a sa jumelle à la <b>même distance</b> de l'axe, de l'autre côté."], ex: "Un papillon, un cœur, la lettre A sont symétriques." } },
        { id: "m4-5", title: "Les solides", gen: G.solides,
          lesson: { rule: ["Un <b>solide</b> a du volume : cube, pavé, cylindre, cône, boule, pyramide.", "Le <b>cube</b> a 6 faces carrées, 12 arêtes et 8 sommets."], ex: "Un dé est un <b>cube</b> ; une boîte de conserve est un <b>cylindre</b>." } },
      ],
    },
    {
      id: "m5", title: "Les mesures", color: "#e4572e", lessons: [
        { id: "m5-1", title: "Les longueurs", gen: G.longueurs,
          lesson: { rule: ["1 km = 1 000 m — 1 m = 100 cm — 1 cm = 10 mm.", "On choisit l'unité selon la taille de l'objet."], ex: "3 m = <b>300 cm</b>" } },
        { id: "m5-2", title: "Les masses", gen: G.masses,
          lesson: { rule: ["La masse se mesure avec une balance.", "1 kg = <b>1 000 g</b> — 1 tonne (t) = 1 000 kg."], ex: "2 kg = <b>2 000 g</b>" } },
        { id: "m5-3", title: "L'heure et les durées", gen: G.temps,
          lesson: { rule: ["La <b>petite aiguille</b> montre les heures, la <b>grande aiguille</b> montre les minutes.", "1 h = 60 min — 1 jour = 24 h.", "Pour trouver une heure de fin, on ajoute la durée à l'heure de début."], ex: "14 h 30 + 45 min = <b>15 h 15</b>" } },
      ],
    },
  ],
};
MATH.chapters.forEach((ch) => ch.lessons.forEach((l) => { l.bank = repeatGen(l.gen, 8); }));

/* index global des matières, chapitres et leçons */
CONTENT.fr = FR;      // CONTENT et LESSONS sont créés par le moteur (moteur/js/core.js)
CONTENT.math = MATH;
for (const subj of Object.values(CONTENT)) {
  for (const ch of subj.chapters) {
    ch.subject = subj.id;
    ch.lessons.forEach((l, i) => { l.chapter = ch; l.subject = subj.id; l.index = i; LESSONS[l.id] = l; });
  }
}
