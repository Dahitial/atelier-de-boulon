/* L'Atelier de Boulon — module « L'atelier de Rivet » : les images (banque PICTOS du moteur, repère 100 × 100)
   et les dessins de Rivet sur la grille. */
"use strict";

Object.assign(PICTOS, {
  aspirateur: `<ellipse cx="50" cy="66" rx="40" ry="16" fill="#3d3550" ${PK}/><path d="M10 58 a40 16 0 0 1 80 0 v8 a40 16 0 0 1 -80 0 z" fill="#5a4a6b" ${PK}/>
    <ellipse cx="50" cy="56" rx="40" ry="16" fill="#9aa4b5" ${PK}/><circle cx="50" cy="54" r="7" fill="#7bc950" ${PK} stroke-width="2"/>
    <path d="M26 50 q6 -6 12 0 M62 50 q6 -6 12 0" fill="none" stroke="#2b2236" stroke-width="2"/>`,
  bras: `<rect x="20" y="80" width="44" height="12" rx="4" fill="#5a4a6b" ${PK}/><path d="M42 80 V54" stroke="#2b2236" stroke-width="12" stroke-linecap="round"/>
    <path d="M42 80 V54" stroke="#f6c445" stroke-width="7" stroke-linecap="round"/><path d="M42 54 L70 30" stroke="#2b2236" stroke-width="12" stroke-linecap="round"/>
    <path d="M42 54 L70 30" stroke="#f6c445" stroke-width="7" stroke-linecap="round"/><circle cx="42" cy="54" r="7" fill="#9aa4b5" ${PK}/><circle cx="70" cy="30" r="6" fill="#9aa4b5" ${PK}/>
    <path d="M74 26 l12 -8 M74 34 l14 2" stroke="#2b2236" stroke-width="5" stroke-linecap="round"/>`,
  rover: `<rect x="18" y="40" width="64" height="22" rx="4" fill="#e8e3d0" ${PK}/><path d="M50 40 v-16 M40 24 h20" ${PK}/><rect x="40" y="14" width="20" height="10" rx="2" fill="#9aa4b5" ${PK}/>
    <path d="M10 44 h-4 M20 62 l-6 10 M80 62 l6 10 M50 62 v10" ${PK}/><circle cx="14" cy="78" r="9" fill="#5a4a6b" ${PK}/><circle cx="50" cy="78" r="9" fill="#5a4a6b" ${PK}/>
    <circle cx="86" cy="78" r="9" fill="#5a4a6b" ${PK}/><rect x="24" y="44" width="30" height="8" fill="#2e86de" ${PK} stroke-width="2"/><path d="M2 92 h96" stroke="#c9532e" stroke-width="5" stroke-linecap="round"/>`,
  ecran: `<rect x="8" y="10" width="84" height="58" rx="6" fill="#2b2236" ${PK}/><rect x="15" y="17" width="70" height="44" fill="#bfe6f7"/>
    <circle cx="66" cy="30" r="7" fill="#ffd84a"/><path d="M15 61 l20 -18 l14 12 l12 -8 l24 14 z" fill="#7bc950"/>
    <path d="M42 68 h16 v12 h-16 z" fill="#5a4a6b" ${PK}/><path d="M28 86 h44" stroke="#2b2236" stroke-width="7" stroke-linecap="round"/>`,
  clavier: `<rect x="4" y="30" width="92" height="44" rx="7" fill="#d6d0bc" ${PK}/>
    <g fill="#fff8ea" ${PK} stroke-width="2">${[0, 1, 2].map((l) => Array.from({ length: 8 }, (_, k) => `<rect x="${10 + k * 10.4 + l * 2}" y="${36 + l * 11}" width="8" height="8" rx="2"/>`).join("")).join("")}
    <rect x="26" y="62" width="48" height="7" rx="2"/></g>`,
  "souris-ordi": `<path d="M50 4 q0 12 -2 18" fill="none" ${PK}/><rect x="26" y="22" width="48" height="70" rx="24" fill="#e8e3f0" ${PK}/>
    <path d="M26 46 h48 M50 22 v24" ${PK}/><rect x="46" y="28" width="8" height="12" rx="4" fill="#9aa4b5" ${PK} stroke-width="2"/>`,
});
Object.assign(PICTOS_NOMS, {
  aspirateur: "un aspirateur robot", bras: "un bras robot", rover: "un robot sur Mars",
  ecran: "l'écran", clavier: "le clavier", "souris-ordi": "la souris de l'ordinateur",
});

/* Rivet sur la grille : de face au CP ; vu de dessus au CE2, son nez rouge montre où il regarde */
const RIVET_FACE = (t) => `<svg width="${t}" height="${t}" viewBox="0 0 100 100" aria-hidden="true">
  <path d="M92 64 q12 -4 6 -24" fill="none" stroke="#2b2236" stroke-width="8" stroke-linecap="round"/><path d="M92 64 q12 -4 6 -24" fill="none" stroke="#9aa6b8" stroke-width="3" stroke-linecap="round"/>
  <rect x="14" y="50" width="72" height="40" rx="18" fill="#9aa6b8" ${PK}/><path d="M18 34 l4 -26 l18 16 z M82 34 l-4 -26 l-18 16 z" fill="#9aa6b8" ${PK}/>
  <rect x="14" y="18" width="72" height="44" rx="20" fill="#b9c3d1" ${PK}/>
  <circle cx="36" cy="38" r="7" fill="#7bc950" ${PK} stroke-width="2"/><circle cx="64" cy="38" r="7" fill="#7bc950" ${PK} stroke-width="2"/>
  <circle cx="36" cy="38" r="2.5" fill="#2b2236"/><circle cx="64" cy="38" r="2.5" fill="#2b2236"/>
  <path d="M46 50 l4 3 l4 -3" fill="none" ${PK} stroke-width="2"/><circle cx="50" cy="72" r="5" fill="#f6c445" ${PK} stroke-width="2"/></svg>`;
const RIVET_DESSUS = (t) => `<svg width="${t}" height="${t}" viewBox="0 0 100 100" aria-hidden="true">
  <circle cx="50" cy="54" r="34" fill="#b9c3d1" ${PK}/><path d="M26 30 l4 -20 l14 14 z M74 30 l-4 -20 l-14 14 z" fill="#9aa6b8" ${PK}/>
  <circle cx="38" cy="42" r="6" fill="#7bc950" ${PK} stroke-width="2"/><circle cx="62" cy="42" r="6" fill="#7bc950" ${PK} stroke-width="2"/>
  <path d="M40 9 l10 -8 l10 8 z" fill="#e4572e" ${PK} stroke-width="2"/></svg>`;
const ROBO_ECROU = (t) => `<svg width="${t}" height="${t}" viewBox="0 0 100 100" aria-hidden="true"><path d="M50 8 l36 21 v42 l-36 21 l-36 -21 v-42 z" fill="#f6c445" ${PK} stroke-width="4"/><circle cx="50" cy="50" r="16" fill="#e9e2cf" ${PK} stroke-width="4"/></svg>`;
const ROBO_CAILLOU = (t) => `<svg width="${t}" height="${t}" viewBox="0 0 100 100" aria-hidden="true"><path d="M14 80 q0 -34 30 -40 q30 -4 42 26 q4 14 -6 14 z" fill="#8a7a6a" ${PK}/><path d="M30 56 q8 -8 18 -6" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".5"/></svg>`;
