/* L'Atelier de Boulon — module « Les inventions » : les images des étapes.
   Elles s'ajoutent à la banque d'images du moteur (moteur/js/pictos.js, repère 100 × 100) :
   picto("inv-train", 120) marche partout, aussi dans les leçons du CP (« Autrefois et aujourd'hui »).
   Certaines étapes reprennent des images qui existent déjà : cheval, tambour, plume, cailloux, avion, voiture. */
"use strict";

Object.assign(PICTOS, {
  /* ---------- les transports ---------- */
  "inv-pied": `<ellipse cx="34" cy="64" rx="13" ry="22" fill="#c98a3c" ${PK}/><ellipse cx="66" cy="38" rx="13" ry="22" fill="#c98a3c" ${PK}/>
    <g fill="#c98a3c" ${PK} stroke-width="2"><circle cx="26" cy="36" r="4"/><circle cx="34" cy="34" r="4"/><circle cx="42" cy="37" r="3.5"/>
    <circle cx="58" cy="10" r="4"/><circle cx="66" cy="8" r="4"/><circle cx="74" cy="11" r="3.5"/></g>`,
  "inv-charrette": `<rect x="18" y="38" width="56" height="24" rx="3" fill="#c98a3c" ${PK}/><path d="M28 38 v24 M42 38 v24 M56 38 v24" stroke="#8a5a24" stroke-width="2"/>
    <path d="M74 52 h22" ${PK} stroke-width="5"/><circle cx="40" cy="70" r="18" fill="#fff8ea" ${PK}/>
    <path d="M40 52 v36 M22 70 h36 M27 57 l26 26 M53 57 l-26 26" ${PK} stroke-width="2"/><circle cx="40" cy="70" r="4" fill="#8a5a24" ${PK} stroke-width="2"/>`,
  "inv-train": `<rect x="10" y="44" width="56" height="26" rx="4" fill="#2b2236" ${PK}/><rect x="52" y="30" width="30" height="40" rx="3" fill="#e4572e" ${PK}/>
    <rect x="58" y="36" width="18" height="12" fill="#bfe6f7" ${PK} stroke-width="2"/><rect x="18" y="26" width="12" height="18" fill="#2b2236" ${PK}/>
    <circle cx="20" cy="16" r="7" fill="#e8e8e8" ${PK} stroke-width="2"/><circle cx="34" cy="8" r="5" fill="#e8e8e8" ${PK} stroke-width="2"/>
    <circle cx="24" cy="76" r="10" fill="#9aa4b5" ${PK}/><circle cx="50" cy="76" r="10" fill="#9aa4b5" ${PK}/><circle cx="74" cy="78" r="8" fill="#9aa4b5" ${PK}/>
    <path d="M82 70 l10 14 h-12" fill="#f6c445" ${PK}/>`,
  "inv-tgv": `<path d="M6 66 V46 q0 -10 10 -10 H66 q22 0 30 22 v8 z" fill="#fff8ea" ${PK}/><path d="M70 40 q16 2 22 18 h-24 z" fill="#2e86de" ${PK}/>
    <path d="M6 56 h88" stroke="#e4572e" stroke-width="5"/><rect x="14" y="42" width="12" height="9" rx="2" fill="#2e86de" ${PK} stroke-width="2"/>
    <rect x="32" y="42" width="12" height="9" rx="2" fill="#2e86de" ${PK} stroke-width="2"/><rect x="50" y="42" width="12" height="9" rx="2" fill="#2e86de" ${PK} stroke-width="2"/>
    <circle cx="22" cy="70" r="6" fill="#2b2236"/><circle cx="76" cy="70" r="6" fill="#2b2236"/><path d="M2 80 h96" ${PK}/>`,
  "inv-auto": `<path d="M14 62 v-20 h34 v-12 h20 v32 z" fill="#2e86de" ${PK}/><path d="M48 30 l-4 -10 h28 l-4 10" fill="#2b2236" ${PK}/>
    <path d="M68 50 h18 v12 h-18" fill="#c98a3c" ${PK}/><circle cx="26" cy="68" r="14" fill="#fff8ea" ${PK}/><circle cx="74" cy="70" r="12" fill="#fff8ea" ${PK}/>
    <path d="M26 56 v24 M14 68 h24 M74 60 v20 M64 70 h20" ${PK} stroke-width="2"/>`,
  "inv-biplan": `<rect x="20" y="30" width="62" height="8" rx="3" fill="#f6c445" ${PK}/><rect x="20" y="58" width="62" height="8" rx="3" fill="#f6c445" ${PK}/>
    <path d="M30 38 v20 M72 38 v20" ${PK}/><path d="M8 50 q20 -8 64 -4 l14 4 l-14 4 q-44 4 -64 -4 z" fill="#c98a3c" ${PK}/>
    <path d="M86 40 v20" stroke="#2b2236" stroke-width="5" stroke-linecap="round"/><path d="M8 44 v12" ${PK}/>`,
  "inv-electrique": `<path d="M6 70 v-14 l14 -18 h40 l16 18 h8 q6 0 6 8 v6 z" fill="#5bc0eb" ${PK}/><path d="M26 42 h14 v14 h-24 z M46 42 h12 l12 14 h-24 z" fill="#e8f6ff" ${PK} stroke-width="2"/>
    <circle cx="24" cy="72" r="9" fill="#2b2236"/><circle cx="72" cy="72" r="9" fill="#2b2236"/>
    <path d="M52 8 l-12 18 h10 l-8 16 l18 -22 h-10 l8 -12 z" fill="#f6c445" ${PK} stroke-width="2"/>`,
  /* ---------- l'écriture ---------- */
  "inv-grotte": `<path d="M4 94 V40 q4 -32 46 -34 q42 2 46 34 V94 z" fill="#b9875a" ${PK}/><path d="M14 94 V46 q6 -26 36 -28 q30 2 36 28 V94" fill="#e2c296"/>
    <g fill="#8c2d3a"><ellipse cx="50" cy="56" rx="20" ry="10"/><circle cx="72" cy="50" r="6"/><path d="M36 62 l-3 14 h4 l3 -12 z M46 64 l-1 13 h4 l1 -12 z M56 64 l1 13 h4 l-1 -13 z M64 62 l3 13 h4 l-3 -14 z"/>
    <path d="M30 54 q-6 -4 -8 4 q4 -2 8 0 z"/></g><path d="M70 45 q2 -8 -4 -10 M75 45 q4 -7 0 -11" fill="none" stroke="#8c2d3a" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M26 86 v-10 q0 -3 3 -3 v-6 q0 -3 3 -3 q3 0 3 3 v-3 q0 -3 3 -3 q3 0 3 3 v3 q0 -3 3 -3 q3 0 3 3 v13 q0 6 -6 6 h-8 q-7 0 -7 -6 z" fill="#d9822b" opacity=".8"/>`,
  "inv-tablette": `<rect x="18" y="10" width="64" height="80" rx="10" fill="#d9a86b" ${PK}/>
    <g fill="#8a5a24">${[22, 40, 58, 74].map((y) => [30, 46, 62].map((x) => `<path d="M${x} ${y} l8 4 l-8 4 z M${x + 9} ${y} v8" stroke="#8a5a24" stroke-width="2"/>`).join("")).join("")}</g>`,
  "inv-alphabet": `<rect x="10" y="14" width="80" height="72" rx="8" fill="#e8e3f0" ${PK}/>
    <text x="30" y="48" text-anchor="middle" font-size="28" font-weight="700" fill="#2e86de" font-family="Georgia, serif">A</text>
    <text x="54" y="48" text-anchor="middle" font-size="28" font-weight="700" fill="#e4572e" font-family="Georgia, serif">B</text>
    <text x="76" y="48" text-anchor="middle" font-size="28" font-weight="700" fill="#3fa34d" font-family="Georgia, serif">C</text>
    <g fill="none" stroke="#8e6cc9" stroke-width="4" stroke-linecap="round"><circle cx="30" cy="68" r="8"/><path d="M48 60 v16 M60 60 v16 M48 68 h12"/><path d="M72 60 l10 16 M82 60 l-10 16"/></g>`,
  "inv-papier": `<path d="M22 12 h44 l14 14 v62 h-58 z" fill="#fff8ea" ${PK}/><path d="M66 12 v14 h14" fill="#e8e3f0" ${PK}/>
    <path d="M32 40 h36 M32 52 h36 M32 64 h26" stroke="#9aa4b5" stroke-width="4" stroke-linecap="round"/>
    <path d="M70 92 l20 -38 l6 3 l-20 38 l-8 4 z" fill="#2b2236" ${PK} stroke-width="2"/>`,
  "inv-imprimerie": `<rect x="14" y="70" width="72" height="18" rx="3" fill="#8a5a24" ${PK}/><path d="M22 70 V16 M78 70 V16 M16 16 h68" ${PK} stroke-width="6"/>
    <path d="M50 16 v18" ${PK} stroke-width="5"/><rect x="30" y="34" width="40" height="14" rx="2" fill="#9aa4b5" ${PK}/>
    <rect x="30" y="56" width="40" height="14" fill="#fff8ea" ${PK}/><path d="M36 61 h28 M36 66 h20" stroke="#2b2236" stroke-width="2"/><path d="M86 22 h10" ${PK} stroke-width="5"/>`,
  "inv-machine": `<rect x="18" y="8" width="64" height="30" fill="#fff8ea" ${PK}/><path d="M26 18 h40 M26 27 h30" stroke="#9aa4b5" stroke-width="3"/>
    <rect x="8" y="36" width="84" height="14" rx="5" fill="#5a4a6b" ${PK}/><path d="M10 50 h80 l6 36 h-92 z" fill="#3d3550" ${PK}/>
    <g fill="#fff8ea" ${PK} stroke-width="2">${[0, 1, 2].map((r) => [0, 1, 2, 3, 4, 5].map((c) => `<circle cx="${20 + c * 12 + r * 4}" cy="${60 + r * 9}" r="4"/>`).join("")).join("")}</g>`,
  "inv-ordi": `<rect x="18" y="12" width="64" height="44" rx="5" fill="#2b2236" ${PK}/><rect x="24" y="18" width="52" height="32" fill="#bfe6f7"/>
    <path d="M30 26 h30 M30 33 h38 M30 40 h22" stroke="#2e86de" stroke-width="3" stroke-linecap="round"/>
    <path d="M10 82 l8 -26 h64 l8 26 z" fill="#9aa4b5" ${PK}/><path d="M24 64 h52 M22 72 h56" stroke="#5a4a6b" stroke-width="3"/>`,
  /* ---------- la communication ---------- */
  "inv-pigeon": `<path d="M18 62 q8 -34 40 -30 q16 2 24 -10 q8 6 4 16 q-4 10 -12 12 q-6 22 -36 22 q-14 0 -20 -10 z" fill="#b9c3d1" ${PK}/>
    <path d="M32 50 q14 -24 34 -10 q-16 6 -34 10 z" fill="#9aa4b5" ${PK}/><circle cx="80" cy="26" r="3" fill="#2b2236"/><path d="M88 30 l8 2 l-8 3" fill="#f6c445" ${PK} stroke-width="2"/>
    <rect x="44" y="70" width="18" height="12" rx="2" fill="#fff8ea" ${PK} stroke-width="2"/><path d="M44 70 l9 7 l9 -7" fill="none" ${PK} stroke-width="2"/>`,
  "inv-telegraphe": `<rect x="14" y="62" width="72" height="22" rx="4" fill="#8a5a24" ${PK}/><path d="M30 62 l34 -22" stroke="#2b2236" stroke-width="7" stroke-linecap="round"/>
    <path d="M30 62 l34 -22" stroke="#c98a3c" stroke-width="3" stroke-linecap="round"/><circle cx="66" cy="38" r="7" fill="#2b2236"/>
    <circle cx="30" cy="62" r="5" fill="#9aa4b5" ${PK} stroke-width="2"/>
    <g fill="#2b2236"><circle cx="16" cy="20" r="4"/><rect x="26" y="17" width="14" height="6" rx="3"/><circle cx="50" cy="20" r="4"/><rect x="60" y="17" width="14" height="6" rx="3"/></g>`,
  "inv-telephone": `<path d="M18 86 l6 -40 h52 l6 40 z" fill="#2b2236" ${PK}/><circle cx="50" cy="64" r="15" fill="#fff8ea" ${PK}/>
    <g fill="#2b2236">${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<circle cx="${50 + 10 * Math.cos(i * 0.75)}" cy="${64 + 10 * Math.sin(i * 0.75)}" r="2.2"/>`).join("")}</g>
    <path d="M14 32 q0 -14 14 -14 h44 q14 0 14 14 v6 h-18 v-8 h-36 v8 h-18 z" fill="#2b2236" ${PK}/>`,
  "inv-radio": `<rect x="10" y="30" width="80" height="54" rx="10" fill="#c98a3c" ${PK}/><circle cx="34" cy="57" r="16" fill="#8a5a24" ${PK}/>
    <path d="M24 50 h20 M22 57 h24 M24 64 h20" stroke="#5a3a1a" stroke-width="2"/><rect x="58" y="42" width="24" height="12" rx="2" fill="#fff1a8" ${PK} stroke-width="2"/>
    <circle cx="62" cy="68" r="5" fill="#2b2236"/><circle cx="78" cy="68" r="5" fill="#2b2236"/><path d="M30 30 l40 -22" ${PK}/><circle cx="70" cy="8" r="3" fill="#2b2236"/>`,
  "inv-tele": `<rect x="8" y="22" width="84" height="58" rx="12" fill="#8a5a24" ${PK}/><rect x="16" y="30" width="54" height="42" rx="8" fill="#9aa4b5" ${PK}/>
    <path d="M24 60 q10 -18 22 -4 q8 -10 16 0" fill="none" stroke="#fff8ea" stroke-width="3"/><circle cx="80" cy="40" r="4" fill="#f6c445" ${PK} stroke-width="2"/>
    <circle cx="80" cy="56" r="4" fill="#f6c445" ${PK} stroke-width="2"/><path d="M36 22 l-10 -16 M64 22 l10 -16" ${PK}/><path d="M24 80 l-4 10 M76 80 l4 10" ${PK}/>`,
  "inv-smartphone": `<rect x="28" y="6" width="44" height="88" rx="9" fill="#2b2236" ${PK}/><rect x="33" y="14" width="34" height="66" rx="3" fill="#bfe6f7"/>
    <g ${PK} stroke-width="1.5"><rect x="37" y="20" width="11" height="11" rx="3" fill="#7bc950"/><rect x="52" y="20" width="11" height="11" rx="3" fill="#e4572e"/>
    <rect x="37" y="35" width="11" height="11" rx="3" fill="#f6c445"/><rect x="52" y="35" width="11" height="11" rx="3" fill="#8e6cc9"/></g>
    <path d="M38 58 h24 q4 0 4 4 v6 q0 4 -4 4 h-16 l-6 5 v-5 q-2 0 -2 -4 v-6 q0 -4 4 -4 z" fill="#fff" ${PK} stroke-width="2"/><circle cx="50" cy="87" r="3" fill="#9aa4b5"/>`,
  /* ---------- le calcul et les ordinateurs ---------- */
  "inv-boulier": `<rect x="10" y="14" width="80" height="72" rx="6" fill="none" stroke="#2b2236" stroke-width="9"/><rect x="10" y="14" width="80" height="72" rx="6" fill="none" stroke="#a86a2c" stroke-width="5"/>
    <g ${PK} stroke-width="2"><path d="M14 34 h72 M14 50 h72 M14 66 h72" fill="none"/>
    <circle cx="24" cy="34" r="7" fill="#e4572e"/><circle cx="38" cy="34" r="7" fill="#e4572e"/><circle cx="76" cy="34" r="7" fill="#e4572e"/>
    <circle cx="24" cy="50" r="7" fill="#f6c445"/><circle cx="62" cy="50" r="7" fill="#f6c445"/><circle cx="76" cy="50" r="7" fill="#f6c445"/>
    <circle cx="24" cy="66" r="7" fill="#5bc0eb"/><circle cx="38" cy="66" r="7" fill="#5bc0eb"/><circle cx="52" cy="66" r="7" fill="#5bc0eb"/></g>`,
  "inv-pascaline": `<rect x="8" y="30" width="84" height="46" rx="6" fill="#c98a3c" ${PK}/><rect x="8" y="24" width="84" height="12" rx="4" fill="#a86a2c" ${PK}/>
    <g ${PK} stroke-width="2">${[22, 41, 60, 79].map((x) => `<circle cx="${x}" cy="56" r="8" fill="#f6c445"/><path d="M${x} 48 v16 M${x - 8} 56 h16" fill="none"/><rect x="${x - 5}" y="27" width="10" height="7" fill="#fff8ea"/>`).join("")}</g>`,
  "inv-eniac": `<rect x="4" y="18" width="28" height="66" fill="#9aa4b5" ${PK}/><rect x="36" y="18" width="28" height="66" fill="#9aa4b5" ${PK}/><rect x="68" y="18" width="28" height="66" fill="#9aa4b5" ${PK}/>
    <g fill="#e4572e">${[10, 42, 74].map((x) => [26, 38, 50].map((y) => `<circle cx="${x + 4}" cy="${y}" r="3"/><circle cx="${x + 14}" cy="${y}" r="3" fill="#7bc950"/>`).join("")).join("")}</g>
    <path d="M10 64 q8 10 16 0 M42 64 q8 10 16 0 M74 64 q8 10 16 0" fill="none" stroke="#2b2236" stroke-width="2"/>`,
  "inv-pc": `<rect x="18" y="8" width="64" height="54" rx="6" fill="#e8e3d0" ${PK}/><rect x="26" y="16" width="48" height="36" rx="4" fill="#1f5a3a"/>
    <path d="M32 26 h22 M32 34 h30 M32 42 h14" stroke="#7bc950" stroke-width="3"/><rect x="40" y="62" width="20" height="8" fill="#d6d0bc" ${PK}/>
    <rect x="12" y="74" width="76" height="16" rx="3" fill="#e8e3d0" ${PK}/><path d="M18 80 h64 M18 85 h64" stroke="#9aa4b5" stroke-width="2"/>`,
  "inv-web": `<circle cx="50" cy="50" r="34" fill="#5bc0eb" ${PK}/><path d="M26 34 q14 -10 24 0 q4 16 -12 20 q-10 10 -18 0 z M58 56 q16 -6 22 6 q-4 16 -18 18 q-8 -12 -4 -24 z" fill="#7bc950" ${PK} stroke-width="2"/>
    <g fill="#f6c445" ${PK} stroke-width="2"><circle cx="18" cy="18" r="6"/><circle cx="84" cy="18" r="6"/><circle cx="84" cy="84" r="6"/><circle cx="16" cy="82" r="6"/></g>
    <path d="M22 22 l10 10 M80 22 l-10 10 M80 80 l-10 -10 M20 78 l10 -10" stroke="#2b2236" stroke-width="2" stroke-dasharray="3 3"/>`,
  "inv-tactile": `<rect x="10" y="16" width="80" height="62" rx="9" fill="#2b2236" ${PK}/><rect x="17" y="22" width="66" height="50" rx="3" fill="#bfe6f7"/>
    <g ${PK} stroke-width="1.5"><rect x="22" y="28" width="14" height="14" rx="4" fill="#7bc950"/><rect x="42" y="28" width="14" height="14" rx="4" fill="#e4572e"/><rect x="62" y="28" width="14" height="14" rx="4" fill="#f6c445"/></g>
    <path d="M58 98 V62 q0 -6 6 -6 q6 0 6 6 v12 q8 -2 10 4 q6 -2 8 4 v20" fill="#f3b27a" ${PK}/>`,
});

Object.assign(PICTOS_NOMS, {
  "inv-pied": "à pied", "inv-charrette": "la charrette", "inv-train": "le train à vapeur", "inv-tgv": "le train à grande vitesse",
  "inv-auto": "la première voiture", "inv-biplan": "le premier avion", "inv-electrique": "la voiture électrique",
  "inv-grotte": "les dessins des grottes", "inv-tablette": "la tablette d'argile", "inv-alphabet": "l'alphabet", "inv-papier": "le papier",
  "inv-imprimerie": "l'imprimerie", "inv-machine": "la machine à écrire", "inv-ordi": "l'ordinateur",
  "inv-pigeon": "le pigeon voyageur", "inv-telegraphe": "le télégraphe", "inv-telephone": "le téléphone à cadran", "inv-radio": "la radio",
  "inv-tele": "la télévision", "inv-smartphone": "le téléphone portable",
  "inv-boulier": "le boulier", "inv-pascaline": "la machine à calculer", "inv-eniac": "le premier ordinateur", "inv-pc": "l'ordinateur de la maison",
  "inv-web": "Internet", "inv-tactile": "la tablette",
});
