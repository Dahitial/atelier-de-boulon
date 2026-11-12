/* L'Atelier de Boulon — schémas animés des leçons.
   Chaque schéma est un SVG (repère 400 × 280) découpé en étapes :
   un élément marqué data-e="k" apparaît à l'étape k ; data-f="k" le fait disparaître après l'étape k.
   legendes[k] explique l'étape k. */
"use strict";

const IC = { ink: "#2b2236", rouge: "#e4572e", bleu: "#2e86de", vert: "#3fa34d", violet: "#8e6cc9", jaune: "#f6c445", gris: "#8a8095", papier: "#fff8ea" };

/* petits outils de dessin */
const Il = {
  T(x, y, txt, o = {}) {
    return `<text x="${x}" y="${y}" font-size="${o.s || 26}" text-anchor="${o.a || "middle"}" fill="${o.c || IC.ink}"${o.b === false ? "" : ' font-weight="700"'}${o.i ? ' font-style="italic"' : ""}>${txt}</text>`;
  },
  E(k, inner, f) { return `<g data-e="${k}"${f != null ? ` data-f="${f}"` : ""}>${inner}</g>`; },
  R(x, y, w, h, o = {}) { return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 6}" fill="${o.f || "none"}" stroke="${o.s || IC.ink}" stroke-width="${o.w ?? 3}"${o.d ? ' stroke-dasharray="7 6"' : ""}${o.o ? ` opacity="${o.o}"` : ""}/>`; },
  L(x1, y1, x2, y2, o = {}) { return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${o.c || IC.ink}" stroke-width="${o.w || 3}" stroke-linecap="round"${o.d ? ' stroke-dasharray="8 7"' : ""}/>`; },
  C(cx, cy, r, o = {}) { return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${o.f || "none"}" stroke="${o.s || IC.ink}" stroke-width="${o.w ?? 3}"/>`; },
  fleche(x1, y1, x2, y2, c = IC.rouge) {
    const a = Math.atan2(y2 - y1, x2 - x1), l = 11;
    const p = (d) => `${(x2 - l * Math.cos(a + d)).toFixed(1)},${(y2 - l * Math.sin(a + d)).toFixed(1)}`;
    return `${this.L(x1, y1, x2, y2, { c })}<path d="M${x2},${y2} L${p(0.45)} L${p(-0.45)} z" fill="${c}"/>`;
  },
  /* surligneur de colonne (visible seulement à l'étape k) */
  colonne(k, x, y, h) { return this.E(k, this.R(x - 22, y, 44, h, { f: "rgba(246,196,69,.35)", s: "none", w: 0 }), k); },
};

/* ------------------------------------------------------------------ */
/* Outils communs : chiffres alignés (opérations posées), étiquettes   */
/* ------------------------------------------------------------------ */
/* chiffres alignés à droite : x de la colonne i (0 = unités) */
const colX = (i) => 300 - i * 52;
function chiffres(n, y, o = {}) { return String(n).split("").reverse().map((d, i) => Il.T(colX(i), y, d, { s: 40, ...o })).join(""); }

/* une phrase en étiquettes : mots = [[texte, couleur?]] ; renvoie le SVG centré */
function etiquettes(mots, y, o = {}) {
  const tailles = mots.map(([m]) => m.length * (o.s || 22) * 0.56 + 18);
  const total = tailles.reduce((a, b) => a + b, 0) + (mots.length - 1) * 8;
  let x = 200 - total / 2, s = "";
  mots.forEach(([m, c, k], i) => {
    const w = tailles[i];
    const bloc = Il.R(x, y - 26, w, 38, { f: c ? c + "33" : "#fff", s: c || IC.ink, w: 2, rx: 8 }) + Il.T(x + w / 2, y, m, { s: o.s || 22, c: c || IC.ink });
    s += k != null ? Il.E(k, bloc) : bloc;
    x += w + 8;
  });
  return s;
}

/* lien leçon → schéma : chaque niveau (ou module) le remplit avec Object.assign(ILLUSTRATIONS, {...}) */
const ILLUSTRATIONS = {};

/* lecteur : affiche le schéma dans `zone`, joue les étapes ; renvoie { rejouer, arreter } */
function monterIllustration(zone, id) {
  const fab = ILLUSTRATIONS[id];
  if (!fab) return null;
  const { svg, legendes } = fab();
  const n = legendes.length;
  const figure = h("div", { class: "illu-svg", html: `<svg viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg">${svg}</svg>` });
  const legende = h("div", { class: "illu-legende" });
  const points = h("div", { class: "illu-points" });
  let etape = 0, minuterie = null, touche = false;   // touche : l'enfant a déjà utilisé les boutons
  const els = [...figure.querySelectorAll("[data-e]")];
  const afficher = (k) => {
    etape = k;
    els.forEach((el) => {
      const e = Number(el.dataset.e), f = el.dataset.f == null ? Infinity : Number(el.dataset.f);
      el.classList.toggle("vu", e <= k && k <= f);
    });
    legende.textContent = legendes[k];
    points.innerHTML = legendes.map((_, i) => `<i class="${i === k ? "on" : i < k ? "fait" : ""}"></i>`).join("");
    prec.disabled = k === 0; suiv.disabled = k === n - 1;
  };
  const arreter = () => { touche = true; clearInterval(minuterie); minuterie = null; lecture.textContent = "▶"; };
  const jouer = () => {
    arreter();
    if (etape >= n - 1) afficher(0);
    lecture.textContent = "⏸";
    minuterie = setInterval(() => { if (etape >= n - 1) { arreter(); return; } afficher(etape + 1); }, 2600);
  };
  const prec = h("button", { class: "btn round small white", title: "Étape précédente", "aria-label": "Étape précédente", onclick: () => { arreter(); afficher(Math.max(0, etape - 1)); } }, "◀");
  const lecture = h("button", { class: "btn round small green", title: "Lecture / pause", "aria-label": "Lecture ou pause", onclick: () => (minuterie ? arreter() : jouer()) }, "▶");
  const suiv = h("button", { class: "btn round small white", title: "Étape suivante", "aria-label": "Étape suivante", onclick: () => { arreter(); afficher(Math.min(n - 1, etape + 1)); } }, "▶|");
  zone.append(figure, legende, h("div", { class: "illu-commandes" }, prec, lecture, suiv, points));
  afficher(0);
  setTimeout(() => { if (!touche) jouer(); }, 1200);   // démarre seul, sauf si l'enfant a déjà pris la main
  return { rejouer: () => { afficher(0); jouer(); }, arreter };
}
