/* L'Atelier de Boulon — banque d'images (pictogrammes) pour les plus jeunes.
   Même style que Boulon : contour encré, couleurs franches. Repère 100 × 100.
   picto("chat", 140) renvoie un <svg> ; PICTOS_NOMS["chat"] donne le mot (avec son article).
   Pour ajouter une image : une entrée dans PICTOS (le dessin) et une dans PICTOS_NOMS (le mot). */
"use strict";

const PK = `stroke="#2b2236" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;

const PICTOS = {
  /* ---------- animaux ---------- */
  chat: `<path d="M24 40 L30 12 L48 30 Z M76 40 L70 12 L52 30 Z" fill="#f08a3c" ${PK}/>
    <circle cx="50" cy="52" r="30" fill="#f08a3c" ${PK}/>
    <ellipse cx="39" cy="48" rx="4.5" ry="6" fill="#2b2236"/><ellipse cx="61" cy="48" rx="4.5" ry="6" fill="#2b2236"/>
    <path d="M46 60 h8 l-4 5 z" fill="#ef7fa8" ${PK} stroke-width="2"/>
    <path d="M50 65 q-5 6 -11 3 M50 65 q5 6 11 3 M14 56 h18 M15 64 l17 -4 M86 56 h-18 M85 64 l-17 -4" fill="none" ${PK} stroke-width="2"/>`,
  lapin: `<path d="M36 40 C 28 6 40 4 44 38 Z M64 40 C 72 6 60 4 56 38 Z" fill="#e9e4f0" ${PK}/>
    <path d="M37 34 C 33 14 38 12 41 34 M63 34 C 67 14 62 12 59 34" fill="none" stroke="#ef7fa8" stroke-width="4" stroke-linecap="round"/>
    <circle cx="50" cy="60" r="28" fill="#e9e4f0" ${PK}/>
    <circle cx="40" cy="56" r="4" fill="#2b2236"/><circle cx="60" cy="56" r="4" fill="#2b2236"/>
    <path d="M46 66 h8 l-4 5 z" fill="#ef7fa8" ${PK} stroke-width="2"/><path d="M50 71 v5" ${PK} stroke-width="2"/>`,
  poisson: `<path d="M16 50 C 30 26 62 26 76 50 C 62 74 30 74 16 50 Z" fill="#5bc0eb" ${PK}/>
    <path d="M74 50 L94 34 L92 66 Z" fill="#2e86de" ${PK}/>
    <circle cx="32" cy="46" r="4" fill="#2b2236"/><path d="M48 36 q6 14 0 28" fill="none" ${PK} stroke-width="2"/>`,
  souris: `<path d="M14 72 C 14 42 44 30 66 44 C 80 52 82 66 74 72 Z" fill="#b9b3c4" ${PK}/>
    <circle cx="56" cy="38" r="12" fill="#e9e4f0" ${PK}/><circle cx="30" cy="64" r="3.5" fill="#2b2236"/>
    <circle cx="15" cy="70" r="3" fill="#ef7fa8"/><path d="M74 70 C 92 70 94 86 80 88" fill="none" ${PK}/>`,
  hibou: `<path d="M24 30 L30 14 L40 24 Z M76 30 L70 14 L60 24 Z" fill="#9c6b3c" ${PK}/>
    <ellipse cx="50" cy="56" rx="28" ry="34" fill="#c98a3c" ${PK}/>
    <ellipse cx="50" cy="70" rx="16" ry="16" fill="#f3d9a4"/>
    <circle cx="39" cy="42" r="11" fill="#fff" ${PK}/><circle cx="61" cy="42" r="11" fill="#fff" ${PK}/>
    <circle cx="40" cy="43" r="5" fill="#2b2236"/><circle cx="60" cy="43" r="5" fill="#2b2236"/>
    <path d="M46 52 h8 l-4 7 z" fill="#f6c445" ${PK} stroke-width="2"/>`,
  tortue: `<path d="M16 66 C 18 34 70 34 74 66 Z" fill="#3fa34d" ${PK}/>
    <path d="M30 64 l6 -14 h16 l6 14 M44 50 v-10" fill="none" stroke="#2a7a36" stroke-width="3" stroke-linejoin="round"/>
    <circle cx="84" cy="58" r="10" fill="#7bc950" ${PK}/><circle cx="87" cy="55" r="2.5" fill="#2b2236"/>
    <rect x="22" y="64" width="12" height="12" rx="5" fill="#7bc950" ${PK}/><rect x="56" y="64" width="12" height="12" rx="5" fill="#7bc950" ${PK}/>
    <path d="M12 66 h66" ${PK}/>`,
  cheval: `<path d="M30 92 L34 56 C 26 50 24 40 32 30 L52 12 L58 22 L74 44 C 80 52 74 60 66 56 L56 50 L58 92 Z" fill="#9c6b3c" ${PK}/>
    <path d="M52 12 C 40 20 34 34 36 52 L30 56 C 24 40 30 22 46 12 Z" fill="#5a3a20" ${PK}/>
    <circle cx="58" cy="32" r="3.5" fill="#2b2236"/><circle cx="72" cy="50" r="2" fill="#2b2236"/>`,
  lion: `<g fill="#f08a3c" ${PK}><circle cx="50" cy="50" r="40"/></g>
    <g fill="#e06d1e"><circle cx="20" cy="40" r="6"/><circle cx="80" cy="40" r="6"/><circle cx="24" cy="70" r="6"/><circle cx="76" cy="70" r="6"/><circle cx="50" cy="14" r="6"/></g>
    <circle cx="50" cy="52" r="26" fill="#f6c445" ${PK}/>
    <circle cx="41" cy="47" r="3.5" fill="#2b2236"/><circle cx="59" cy="47" r="3.5" fill="#2b2236"/>
    <path d="M45 56 h10 l-5 6 z" fill="#2b2236"/><path d="M50 62 q-6 7 -12 3 M50 62 q6 7 12 3" fill="none" ${PK} stroke-width="2"/>`,

  /* ---------- fruits et légumes ---------- */
  pomme: `<path d="M50 30 C 30 18 12 34 16 56 C 20 80 38 92 50 84 C 62 92 80 80 84 56 C 88 34 70 18 50 30 Z" fill="#e4572e" ${PK}/>
    <path d="M50 30 C 50 22 52 16 56 10" fill="none" ${PK}/><path d="M56 18 C 64 8 78 12 78 16 C 70 24 62 22 56 18 Z" fill="#7bc950" ${PK}/>
    <path d="M30 44 q4 -8 12 -10" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".7"/>`,
  orange: `<circle cx="50" cy="54" r="34" fill="#f08a3c" ${PK}/>
    <g fill="#e06d1e"><circle cx="38" cy="50" r="1.8"/><circle cx="58" cy="44" r="1.8"/><circle cx="62" cy="64" r="1.8"/><circle cx="44" cy="70" r="1.8"/></g>
    <path d="M50 20 C 56 10 70 10 72 16 C 64 24 56 24 50 20 Z" fill="#7bc950" ${PK}/>`,
  banane: `<path d="M18 30 C 22 66 52 86 84 72 C 86 66 82 64 78 66 C 52 72 34 56 28 28 Z" fill="#f6c445" ${PK}/>
    <path d="M18 30 l-4 -8 l8 -2 l6 8" fill="#9c6b3c" ${PK}/><path d="M78 66 l8 4" ${PK}/>`,
  ananas: `<path d="M50 34 L40 8 L48 18 L50 4 L52 18 L60 8 Z" fill="#3fa34d" ${PK}/>
    <ellipse cx="50" cy="62" rx="24" ry="32" fill="#f6c445" ${PK}/>
    <path d="M32 44 L68 84 M28 60 L56 92 M40 34 L72 70 M68 44 L32 84 M72 60 L44 92 M60 34 L28 70" stroke="#c98a3c" stroke-width="2.5"/>`,
  carotte: `<path d="M38 30 L62 30 L52 94 Z" fill="#f08a3c" ${PK}/>
    <path d="M44 44 h8 M46 58 h7 M48 72 h5" ${PK} stroke-width="2"/>
    <path d="M50 30 L40 6 L48 14 L52 4 L56 14 L64 6 Z" fill="#3fa34d" ${PK}/>`,
  radis: `<path d="M50 36 q-15 -20 -25 -23 q6 15 20 25 z M50 36 q15 -20 25 -23 q-6 15 -20 25 z" fill="#3fa34d" ${PK}/>
    <path d="M50 36 C 24 36 22 70 50 84 C 78 70 76 36 50 36 Z" fill="#ef4f7a" ${PK}/>
    <path d="M50 84 q0 7 -2 12" fill="none" ${PK}/><path d="M38 52 q3 -6 9 -7" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>`,
  tomate: `<circle cx="50" cy="56" r="34" fill="#e4572e" ${PK}/>
    <path d="M50 24 L42 16 L48 26 L36 26 L48 30 L44 38 L52 30 L60 36 L56 28 L66 26 L54 25 L58 16 Z" fill="#3fa34d" ${PK} stroke-width="2"/>
    <path d="M30 50 q4 -10 12 -12" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".7"/>`,
  salade: `<path d="M50 18 C 60 8 74 14 74 26 C 86 26 92 40 86 50 C 94 60 88 74 76 76 C 74 88 60 92 50 86 C 40 92 26 88 24 76 C 12 74 6 60 14 50 C 8 40 14 26 26 26 C 26 14 40 8 50 18 Z" fill="#7bc950" ${PK}/>
    <path d="M50 30 C 62 26 70 36 68 48 C 76 56 70 70 58 70 C 54 78 46 78 42 70 C 30 70 24 56 32 48 C 30 36 38 26 50 30 Z" fill="#b5e48c" ${PK} stroke-width="2.5"/>
    <path d="M50 34 V72 M50 48 l-8 -6 M50 58 l8 -6 M50 66 l-7 -5" fill="none" stroke="#3fa34d" stroke-width="2.5" stroke-linecap="round"/>`,

  /* ---------- objets ---------- */
  ballon: `<ellipse cx="50" cy="40" rx="26" ry="30" fill="#e4572e" ${PK}/>
    <path d="M46 70 h8 l-4 5 z" fill="#e4572e" ${PK} stroke-width="2"/><path d="M50 75 C 44 84 56 88 50 98" fill="none" ${PK} stroke-width="2"/>
    <path d="M36 30 q4 -10 12 -12" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".7"/>`,
  etoile: `<path d="M50 8 L61 36 L92 38 L68 58 L76 90 L50 72 L24 90 L32 58 L8 38 L39 36 Z" fill="#f6c445" ${PK}/>`,
  lune: `<path d="M62 10 A40 40 0 1 0 82 78 A32 32 0 1 1 62 10 Z" fill="#f6c445" ${PK}/>`,
  plume: `<path d="M80 10 C 40 18 24 52 28 88 C 58 82 80 56 80 10 Z" fill="#5bc0eb" ${PK}/>
    <path d="M80 10 L 20 94 M66 32 l-14 2 M58 48 l-15 1 M50 64 l-13 0" fill="none" ${PK} stroke-width="2.5"/>`,
  livre: `<path d="M8 80 V26 Q30 18 50 28 Q70 18 92 26 V80 Q70 72 50 82 Q30 72 8 80 Z" fill="#e4572e" ${PK}/>
    <path d="M14 74 V24 Q32 16 50 26 V78 Q32 68 14 74 Z M86 74 V24 Q68 16 50 26 V78 Q68 68 86 74 Z" fill="#fff8ea" ${PK}/>
    <path d="M22 36 Q32 32 42 37 M22 46 Q32 42 42 47 M22 56 Q32 52 42 57 M58 37 Q68 32 78 36 M58 47 Q68 42 78 46 M58 57 Q68 52 78 56" fill="none" stroke="#8a8095" stroke-width="2.5" stroke-linecap="round"/>`,
  lit: `<rect x="10" y="30" width="12" height="56" rx="4" fill="#a8672d" ${PK}/>
    <rect x="20" y="56" width="70" height="18" rx="6" fill="#fff8ea" ${PK}/>
    <rect x="24" y="44" width="22" height="14" rx="7" fill="#fff" ${PK}/>
    <path d="M44 54 h46 v20 h-46 z" fill="#5bc0eb" ${PK}/><path d="M86 74 v12 M22 74 h68" ${PK}/>`,
  table: `<rect x="10" y="34" width="80" height="12" rx="4" fill="#c98a3c" ${PK}/>
    <path d="M18 46 v40 M82 46 v40 M30 46 v28 M70 46 v28" ${PK} stroke-width="6"/>
    <path d="M18 46 v40 M82 46 v40" stroke="#a8672d" stroke-width="2.5"/>`,
  bol: `<path d="M12 44 h76 C 86 72 70 84 50 84 C 30 84 14 72 12 44 Z" fill="#2e86de" ${PK}/>
    <ellipse cx="50" cy="44" rx="38" ry="7" fill="#9fd4f5" ${PK}/><path d="M38 84 h24 v6 h-24 z" fill="#2e86de" ${PK}/>`,
  mur: `<rect x="8" y="20" width="84" height="64" fill="#c8553d" ${PK}/>
    <path d="M8 36 h84 M8 52 h84 M8 68 h84 M30 20 v16 M60 20 v16 M18 36 v16 M46 36 v16 M76 36 v16 M30 52 v16 M60 52 v16 M18 68 v16 M46 68 v16 M76 68 v16" stroke="#2b2236" stroke-width="2.5"/>`,
  tambour: `<path d="M18 40 v34 C 18 86 82 86 82 74 V40" fill="#e4572e" ${PK}/>
    <ellipse cx="50" cy="40" rx="32" ry="10" fill="#fff8ea" ${PK}/>
    <path d="M20 46 L36 78 L52 48 L66 80 L80 46" fill="none" stroke="#f6c445" stroke-width="3"/>
    <path d="M30 8 L46 34 M74 10 L56 34" ${PK} stroke-width="4"/><circle cx="29" cy="7" r="4" fill="#f6c445" ${PK} stroke-width="2"/><circle cx="75" cy="9" r="4" fill="#f6c445" ${PK} stroke-width="2"/>`,
  gateau: `<rect x="16" y="50" width="68" height="38" rx="6" fill="#f3b27a" ${PK}/>
    <path d="M16 62 C 26 70 34 56 44 64 C 54 72 62 56 72 64 C 78 68 82 62 84 60 V52 H16 Z" fill="#ef7fa8" ${PK}/>
    <rect x="30" y="30" width="6" height="20" fill="#5bc0eb" ${PK} stroke-width="2"/><rect x="47" y="30" width="6" height="20" fill="#f6c445" ${PK} stroke-width="2"/><rect x="64" y="30" width="6" height="20" fill="#7bc950" ${PK} stroke-width="2"/>
    <g fill="#f08a3c"><path d="M33 28 q-4 -6 0 -12 q4 6 0 12z"/><path d="M50 28 q-4 -6 0 -12 q4 6 0 12z"/><path d="M67 28 q-4 -6 0 -12 q4 6 0 12z"/></g>`,

  /* ---------- transports et machines ---------- */
  velo: `<circle cx="24" cy="66" r="16" fill="none" ${PK} stroke-width="4"/><circle cx="76" cy="66" r="16" fill="none" ${PK} stroke-width="4"/>
    <path d="M24 66 L40 40 L66 40 L76 66 M40 40 L50 66 L66 40 M50 66 H24" fill="none" stroke="#e4572e" stroke-width="4" stroke-linejoin="round"/>
    <path d="M34 34 h12 M62 30 l4 10 M60 30 h10" ${PK} stroke-width="4"/>`,
  moto: `<circle cx="22" cy="68" r="14" fill="#5a4a6b" ${PK}/><circle cx="78" cy="68" r="14" fill="#5a4a6b" ${PK}/>
    <circle cx="22" cy="68" r="5" fill="#fff8ea"/><circle cx="78" cy="68" r="5" fill="#fff8ea"/>
    <path d="M22 68 L40 48 H66 L78 68 Z" fill="#e4572e" ${PK}/><path d="M36 48 C 40 38 56 38 58 48" fill="#2b2236"/>
    <path d="M66 48 L72 30 h8" fill="none" ${PK} stroke-width="4"/>`,
  voiture: `<path d="M10 64 V50 L24 46 L34 30 H66 L78 46 L90 50 V64 Z" fill="#2e86de" ${PK}/>
    <path d="M38 34 H50 V46 H30 Z M54 34 H64 L72 46 H54 Z" fill="#bfe8ff" ${PK} stroke-width="2"/>
    <circle cx="28" cy="66" r="10" fill="#5a4a6b" ${PK}/><circle cx="72" cy="66" r="10" fill="#5a4a6b" ${PK}/>`,
  avion: `<path d="M8 52 C 8 44 18 42 30 42 H78 L92 26 H98 L90 46 C 96 50 96 56 88 58 H30 C 18 58 8 58 8 52 Z" fill="#e9e4f0" ${PK}/>
    <path d="M44 44 L60 14 H70 L62 44 Z M46 58 L58 84 H68 L62 58 Z" fill="#5bc0eb" ${PK}/>
    <g fill="#2e86de"><circle cx="24" cy="50" r="3"/><circle cx="34" cy="50" r="3"/><circle cx="74" cy="50" r="3"/></g>`,
  fusee: `<path d="M50 6 C 66 18 70 42 66 68 H34 C 30 42 34 18 50 6 Z" fill="#fff8ea" ${PK}/>
    <circle cx="50" cy="36" r="9" fill="#5bc0eb" ${PK}/>
    <path d="M34 52 L18 72 L34 70 Z M66 52 L82 72 L66 70 Z" fill="#e4572e" ${PK}/>
    <path d="M40 68 L50 94 L60 68 Z" fill="#f6c445" ${PK}/>`,
  robot: `<line x1="50" y1="18" x2="50" y2="8" ${PK}/><circle cx="50" cy="7" r="5" fill="#ffe27a" ${PK}/>
    <rect x="22" y="18" width="56" height="44" rx="16" fill="#d98b4a" ${PK}/>
    <rect x="30" y="26" width="40" height="24" rx="11" fill="#fff8ea" ${PK}/>
    <circle cx="41" cy="38" r="5" fill="#2b2236"/><circle cx="59" cy="38" r="5" fill="#2b2236"/>
    <rect x="30" y="62" width="40" height="26" rx="8" fill="#d98b4a" ${PK}/><circle cx="50" cy="74" r="5" fill="#5bc0eb" ${PK} stroke-width="2"/>`,

  /* ---------- nature ---------- */
  arbre: `<rect x="42" y="56" width="16" height="36" rx="4" fill="#9c6b3c" ${PK}/>
    <circle cx="50" cy="38" r="30" fill="#3fa34d" ${PK}/>
    <g fill="#e4572e"><circle cx="38" cy="30" r="4.5"/><circle cx="60" cy="26" r="4.5"/><circle cx="56" cy="48" r="4.5"/><circle cx="36" cy="48" r="4.5"/></g>`,

  /* ---------- le corps ---------- */
  yeux: `<path d="M6 50 C 18 32 38 32 46 50 C 38 68 18 68 6 50 Z M54 50 C 62 32 82 32 94 50 C 82 68 62 68 54 50 Z" fill="#fff" ${PK}/>
    <circle cx="26" cy="50" r="9" fill="#2e86de" ${PK} stroke-width="2"/><circle cx="74" cy="50" r="9" fill="#2e86de" ${PK} stroke-width="2"/>
    <circle cx="26" cy="50" r="4" fill="#2b2236"/><circle cx="74" cy="50" r="4" fill="#2b2236"/>`,
  oreille: `<path d="M38 88 C 22 82 22 64 30 54 C 18 32 30 10 52 10 C 74 10 84 30 76 50 C 70 64 58 66 56 78 C 54 90 46 92 38 88 Z" fill="#f3b27a" ${PK}/>
    <path d="M44 66 C 40 54 38 36 52 28 C 64 24 70 38 62 46 C 56 50 52 44 54 40" fill="none" ${PK}/>`,
  nez: `<path d="M44 10 C 44 34 26 54 24 70 C 22 84 40 88 50 82 C 60 88 78 84 76 70 C 74 54 56 34 56 10 Z" fill="#f3b27a" ${PK}/>
    <ellipse cx="38" cy="74" rx="6" ry="4" fill="#2b2236"/><ellipse cx="62" cy="74" rx="6" ry="4" fill="#2b2236"/>`,
  bouche: `<path d="M8 46 C 30 30 70 30 92 46 C 80 80 20 80 8 46 Z" fill="#e4572e" ${PK}/>
    <path d="M14 48 C 34 42 66 42 86 48 C 80 56 20 56 14 48 Z" fill="#fff" ${PK} stroke-width="2"/>
    <path d="M32 72 C 34 56 66 56 68 72 C 60 80 40 80 32 72 Z" fill="#ef7fa8" ${PK}/><path d="M50 62 v12" stroke="#c94f7c" stroke-width="2.5" stroke-linecap="round"/>`,
  main: `<path d="M30 92 C 22 80 22 66 22 52 V30 C 22 24 30 24 30 30 V48 V18 C 30 12 38 12 38 18 V46 V12 C 38 6 46 6 46 12 V46 V16 C 46 10 54 10 54 16 V52 C 58 46 62 40 68 42 C 74 44 72 50 68 56 L58 76 C 54 84 52 88 50 92 Z" fill="#f3b27a" ${PK}/>`,
};

/* le mot de chaque image, avec son article (pour la voix et les étiquettes) */
const PICTOS_NOMS = {
  chat: "un chat", lapin: "un lapin", poisson: "un poisson", souris: "une souris", hibou: "un hibou", tortue: "une tortue",
  cheval: "un cheval", lion: "un lion", pomme: "une pomme", orange: "une orange", banane: "une banane", ananas: "un ananas",
  carotte: "une carotte", radis: "un radis", tomate: "une tomate", salade: "une salade", ballon: "un ballon", etoile: "une étoile",
  lune: "la lune", plume: "une plume", livre: "un livre", lit: "un lit", table: "une table", bol: "un bol", mur: "un mur",
  tambour: "un tambour", gateau: "un gâteau", velo: "un vélo", moto: "une moto", voiture: "une voiture", avion: "un avion",
  fusee: "une fusée", robot: "un robot", arbre: "un arbre", yeux: "les yeux", oreille: "une oreille", nez: "le nez",
  bouche: "la bouche", main: "la main",
};

/* le mot seul, sans article : « un vélo » → « vélo » */
function motDe(nom) { return (PICTOS_NOMS[nom] || nom).replace(/^(un|une|le|la|les|l')\s+/, ""); }

/* une image en <svg> ; taille en px */
function picto(nom, taille = 120) {
  const d = PICTOS[nom];
  if (!d) return `<svg width="${taille}" height="${taille}" viewBox="0 0 100 100" aria-hidden="true"><rect x="10" y="10" width="80" height="80" rx="12" fill="#eee" ${PK}/><text x="50" y="58" text-anchor="middle" font-size="16">${nom}</text></svg>`;
  return `<svg class="picto" width="${taille}" height="${taille}" viewBox="0 0 100 100" aria-hidden="true">${d}</svg>`;
}

/* ---------- les plantes et le jardin (ajoutées avec Mon petit jardin) ---------- */
const petalesSvg = (cx, cy, r, couleur) => Array.from({ length: 10 }, (_, i) =>
  `<ellipse cx="${cx}" cy="${cy - r}" rx="${r * 0.36}" ry="${r * 0.6}" transform="rotate(${36 * i} ${cx} ${cy})" fill="${couleur}" ${PK} stroke-width="2"/>`).join("");
Object.assign(PICTOS, {
  graine: `<ellipse cx="50" cy="56" rx="24" ry="16" fill="#d9a86b" ${PK}/><path d="M34 52 q16 -9 32 0" fill="none" stroke="#a8763c" stroke-width="3" stroke-linecap="round"/>`,
  pousse: `<rect x="12" y="72" width="76" height="18" rx="6" fill="#9c6b3c" ${PK}/><path d="M50 72 q-3 -20 2 -36" fill="none" stroke="#3f8a2e" stroke-width="6" stroke-linecap="round"/>
    <path d="M52 40 q-24 -14 -32 3 q17 10 32 -3 z M52 40 q24 -16 32 0 q-17 12 -32 0 z" fill="#7bc950" ${PK}/>`,
  fleur: `<path d="M50 96 V44" stroke="#3f8a2e" stroke-width="6" stroke-linecap="round"/><path d="M50 74 q-24 -10 -30 6 q18 8 30 -6 z" fill="#7bc950" ${PK}/>
    ${petalesSvg(50, 34, 20, "#f6c445")}<circle cx="50" cy="34" r="11" fill="#8a5a24" ${PK}/>`,
  rose: `<path d="M50 96 V48" stroke="#3f8a2e" stroke-width="5" stroke-linecap="round"/><path d="M50 70 q20 -12 28 2 q-16 10 -28 -2 z" fill="#5fb648" ${PK}/>
    <path d="M30 38 q0 -24 20 -24 q20 0 20 24 q0 16 -20 16 q-20 0 -20 -16 z" fill="#e4577a" ${PK}/><path d="M40 34 q10 -12 20 0 q-6 8 -16 4" fill="none" stroke="#a8324f" stroke-width="2.5"/>`,
  cactus: `<path d="M38 50 h-10 q-6 0 -6 -8 v-10" fill="none" stroke="#2b2236" stroke-width="10" stroke-linecap="round"/><path d="M38 50 h-10 q-6 0 -6 -8 v-10" fill="none" stroke="#5fb648" stroke-width="5" stroke-linecap="round"/>
    <rect x="38" y="18" width="24" height="60" rx="12" fill="#5fb648" ${PK}/><path d="M30 76 h40 l-5 20 h-30 z" fill="#e07a4a" ${PK}/><circle cx="50" cy="17" r="6" fill="#ef7fa8" ${PK} stroke-width="2"/>`,
  palmier: `<path d="M46 96 q-2 -36 4 -60 h6 q-4 26 -2 60 z" fill="#9c6b3c" ${PK}/>
    <path d="M52 34 q-26 -16 -42 0 q22 -4 42 4 z M52 34 q26 -16 42 0 q-22 -4 -42 4 z M52 34 q-14 -24 -34 -26 q18 10 30 28 z M52 34 q14 -24 34 -26 q-18 10 -30 28 z" fill="#3fa34d" ${PK}/>`,
  soleil: `<g stroke="#f6b100" stroke-width="6" stroke-linecap="round"><path d="M50 6 v12 M50 82 v12 M6 50 h12 M82 50 h12 M19 19 l8 8 M73 73 l8 8 M19 81 l8 -8 M73 27 l8 -8"/></g><circle cx="50" cy="50" r="24" fill="#ffd84a" ${PK}/>`,
  goutte: `<path d="M50 10 q-30 40 -30 56 a30 28 0 0 0 60 0 q0 -16 -30 -56 z" fill="#5bc0eb" ${PK}/><path d="M36 64 q2 10 10 14" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`,
  arrosoir: `<path d="M22 44 h44 v42 h-44 z" fill="#7bc950" ${PK}/><path d="M66 56 l22 -20" stroke="#2b2236" stroke-width="9" stroke-linecap="round"/><path d="M66 56 l22 -20" stroke="#7bc950" stroke-width="4" stroke-linecap="round"/>
    <path d="M30 44 q14 -22 28 0" fill="none" ${PK} stroke-width="5"/><circle cx="90" cy="34" r="5" fill="#5bc0eb" ${PK} stroke-width="2"/>`,
});
Object.assign(PICTOS_NOMS, {
  graine: "une graine", pousse: "une pousse", fleur: "une fleur", rose: "une rose", cactus: "un cactus", palmier: "un palmier",
  soleil: "le soleil", goutte: "une goutte d'eau", arrosoir: "un arrosoir",
});

/* ---------- les sciences, le temps et l'espace du CP (ajoutées à l'étape 6) ---------- */
Object.assign(PICTOS, {
  /* la matière et les objets : l'aimant, ce qu'il attire, ce qui flotte ou coule */
  aimant: `<path d="M22 86 V44 a28 28 0 0 1 56 0 V86 H60 V44 a10 10 0 0 0 -20 0 V86 Z" fill="#e4572e" ${PK}/>
    <rect x="22" y="70" width="18" height="16" fill="#e8e3f0" ${PK}/><rect x="60" y="70" width="18" height="16" fill="#e8e3f0" ${PK}/>
    <path d="M14 96 l-6 -6 M86 96 l6 -6 M50 8 v-6" stroke="#9aa4b5" stroke-width="3" stroke-linecap="round"/>`,
  clou: `<rect x="26" y="14" width="48" height="12" rx="4" fill="#9aa4b5" ${PK}/><path d="M44 26 h12 v50 l-6 18 l-6 -18 z" fill="#b9c3d1" ${PK}/>`,
  trombone: `<path d="M38 82 V26 a12 12 0 0 1 24 0 V74 a8 8 0 0 1 -16 0 V34" fill="none" stroke="#2b2236" stroke-width="9" stroke-linecap="round"/>
    <path d="M38 82 V26 a12 12 0 0 1 24 0 V74 a8 8 0 0 1 -16 0 V34" fill="none" stroke="#9aa4b5" stroke-width="4" stroke-linecap="round"/>`,
  cle: `<circle cx="30" cy="40" r="20" fill="#f6c445" ${PK}/><circle cx="30" cy="40" r="7" fill="#fff8ea" ${PK} stroke-width="2"/>
    <path d="M48 46 h40 v10 h-6 v10 h-8 v-10 h-6 v8 h-8 v-8 h-12 z" fill="#f6c445" ${PK}/>`,
  cuillere: `<ellipse cx="50" cy="28" rx="16" ry="22" fill="#b9c3d1" ${PK}/><path d="M46 48 h8 l2 44 h-12 z" fill="#b9c3d1" ${PK}/>
    <path d="M44 20 q2 -6 8 -6" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`,
  conserve: `<rect x="24" y="22" width="52" height="66" rx="6" fill="#b9c3d1" ${PK}/><ellipse cx="50" cy="22" rx="26" ry="7" fill="#dbe2ea" ${PK}/>
    <rect x="24" y="40" width="52" height="30" fill="#e4572e" ${PK}/><circle cx="50" cy="55" r="9" fill="#f6c445" ${PK} stroke-width="2"/>`,
  cailloux: `<path d="M10 82 q0 -20 18 -22 q18 0 18 22 z" fill="#9aa4b5" ${PK}/><path d="M40 84 q2 -26 24 -26 q22 2 22 26 z" fill="#b9b3c4" ${PK}/>
    <path d="M28 60 q2 -16 16 -16 q14 0 14 14 q-14 -2 -30 2 z" fill="#c9c2b0" ${PK}/>`,
  /* les moments de la journée */
  matin: `<rect x="6" y="6" width="88" height="88" rx="12" fill="#ffe3b3" ${PK}/><circle cx="50" cy="66" r="20" fill="#ffd84a" ${PK}/>
    <path d="M50 34 v-10 M26 50 l-8 -6 M74 50 l8 -6" stroke="#f6b100" stroke-width="5" stroke-linecap="round"/>
    <path d="M6 70 q22 -10 44 -2 q22 8 44 -2 V82 q0 12 -12 12 H18 q-12 0 -12 -12 z" fill="#7bc950" ${PK}/>`,
  midi: `<rect x="6" y="6" width="88" height="88" rx="12" fill="#bfe6f7" ${PK}/><circle cx="50" cy="32" r="16" fill="#ffd84a" ${PK}/>
    <path d="M28 32 h-6 M78 32 h-6 M34 16 l-4 -4 M66 16 l4 -4" stroke="#f6b100" stroke-width="4" stroke-linecap="round"/>
    <path d="M6 72 h88 V82 q0 12 -12 12 H18 q-12 0 -12 -12 z" fill="#7bc950" ${PK}/>`,
  soir: `<rect x="6" y="6" width="88" height="88" rx="12" fill="#f39b6d" ${PK}/><path d="M24 72 a26 26 0 0 1 52 0 z" fill="#e4572e" ${PK}/>
    <path d="M6 72 h88 V82 q0 12 -12 12 H18 q-12 0 -12 -12 z" fill="#5a8a3c" ${PK}/><circle cx="76" cy="22" r="3" fill="#fff8ea"/>`,
  nuit: `<rect x="6" y="6" width="88" height="88" rx="12" fill="#1f3a6b" ${PK}/><path d="M60 22 a22 22 0 1 0 14 38 a18 18 0 1 1 -14 -38 z" fill="#fff1a8" ${PK}/>
    <g fill="#fff8ea"><circle cx="24" cy="24" r="3"/><circle cx="36" cy="52" r="2.5"/><circle cx="20" cy="70" r="2"/><circle cx="80" cy="76" r="2.5"/></g>`,
  /* les saisons */
  printemps: `<rect x="6" y="6" width="88" height="88" rx="12" fill="#e2f5d0" ${PK}/>${petalesSvg(34, 46, 12, "#ef7fa8")}<circle cx="34" cy="46" r="7" fill="#f6c445" ${PK} stroke-width="2"/>
    ${petalesSvg(68, 58, 10, "#f6c445")}<circle cx="68" cy="58" r="6" fill="#e4572e" ${PK} stroke-width="2"/><path d="M34 58 v30 M68 68 v20" stroke="#3f8a2e" stroke-width="4"/>`,
  ete: `<rect x="6" y="6" width="88" height="88" rx="12" fill="#5bc0eb" ${PK}/><circle cx="70" cy="28" r="12" fill="#ffd84a" ${PK}/>
    <path d="M6 64 q11 -6 22 0 q11 6 22 0 q11 -6 22 0 q11 6 22 0 V72 H6 z" fill="#2e86de"/><path d="M6 72 h88 V82 q0 12 -12 12 H18 q-12 0 -12 -12 z" fill="#f6dc8c" ${PK}/>
    <path d="M30 76 v-30 M18 46 q12 -12 24 0 z" fill="#e4572e" ${PK}/>`,
  automne: `<rect x="6" y="6" width="88" height="88" rx="12" fill="#fde9cf" ${PK}/>
    <path d="M30 20 q22 0 22 26 q-26 2 -22 -26 z" fill="#e4572e" ${PK}/><path d="M60 46 q24 -4 26 20 q-26 6 -26 -20 z" fill="#f08a3c" ${PK}/>
    <path d="M24 64 q20 -6 26 16 q-22 6 -26 -16 z" fill="#c98a3c" ${PK}/><path d="M32 22 l18 22 M62 48 l22 16 M26 66 l22 12" stroke="#7a4a24" stroke-width="2"/>`,
  hiver: `<rect x="6" y="6" width="88" height="88" rx="12" fill="#dbeaf7" ${PK}/>
    <g stroke="#2e86de" stroke-width="4" stroke-linecap="round"><path d="M50 18 v40 M32 28 l36 20 M68 28 l-36 20"/><path d="M44 20 l6 6 l6 -6 M44 56 l6 -6 l6 6"/></g>
    <path d="M6 74 q22 -8 44 0 q22 8 44 0 V82 q0 12 -12 12 H18 q-12 0 -12 -12 z" fill="#fff" ${PK}/>`,
  /* les paysages du Maroc */
  mer: `<rect x="6" y="6" width="88" height="88" rx="12" fill="#bfe6f7" ${PK}/><circle cx="72" cy="26" r="10" fill="#ffd84a" ${PK}/>
    <path d="M6 50 q11 -8 22 0 q11 8 22 0 q11 -8 22 0 q11 8 22 0 V82 q0 12 -12 12 H18 q-12 0 -12 -12 z" fill="#2e86de" ${PK}/>
    <path d="M18 66 q8 -6 16 0 M54 74 q8 -6 16 0" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`,
  montagne: `<rect x="6" y="6" width="88" height="88" rx="12" fill="#bfe6f7" ${PK}/>
    <path d="M6 84 L38 26 L58 60 L70 42 L94 84 V82 q0 12 -12 12 H18 q-12 0 -12 -12 z" fill="#8a7a6a" ${PK}/>
    <path d="M28 44 L38 26 L48 44 q-5 -4 -10 0 q-5 -4 -10 0 z M64 52 l6 -10 l6 10 q-6 -4 -12 0 z" fill="#fff" ${PK} stroke-width="2"/>`,
  desert: `<rect x="6" y="6" width="88" height="88" rx="12" fill="#ffe7a8" ${PK}/><circle cx="72" cy="26" r="11" fill="#ffd84a" ${PK}/>
    <path d="M6 70 q24 -22 50 -4 q20 -14 38 0 V82 q0 12 -12 12 H18 q-12 0 -12 -12 z" fill="#f0b45a" ${PK}/>
    <path d="M6 84 q30 -14 60 -2 q16 -6 28 -2" fill="none" stroke="#c98a3c" stroke-width="3"/>`,
});
Object.assign(PICTOS_NOMS, {
  aimant: "un aimant", clou: "un clou", trombone: "un trombone", cle: "une clé", cuillere: "une cuillère", conserve: "une boîte de conserve", cailloux: "des cailloux",
  matin: "le matin", midi: "le midi", soir: "le soir", nuit: "la nuit",
  printemps: "le printemps", ete: "l'été", automne: "l'automne", hiver: "l'hiver",
  mer: "la mer", montagne: "la montagne", desert: "le désert",
});

/* ---------- les nombres (n0 à n10) et les formes, pour Compter (phase 3 du CP) ---------- */
const COULEURS_NOMBRES = ["#e4572e", "#2e86de", "#3fa34d", "#8e6cc9", "#f08a3c", "#d4691e", "#1f5fa0", "#c2410c", "#5a4a9b", "#2a7a36", "#b07a10"];
const NOMS_NOMBRES = ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix",
  "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf", "vingt"];
for (let n = 0; n <= 20; n++) {
  PICTOS["n" + n] = `<rect x="8" y="8" width="84" height="84" rx="16" fill="#fff8ea" ${PK} stroke-width="4"/>`
    + `<text x="50" y="72" text-anchor="middle" font-family="Andika, Trebuchet MS, sans-serif" font-size="${n >= 10 ? 50 : 62}" font-weight="700" fill="${COULEURS_NOMBRES[n % 11]}">${n}</text>`;
  PICTOS_NOMS["n" + n] = NOMS_NOMBRES[n];
}
Object.assign(PICTOS, {
  carre: `<rect x="18" y="18" width="64" height="64" fill="#f6c445" ${PK} stroke-width="4"/>`,
  rond: `<circle cx="50" cy="50" r="36" fill="#5bc0eb" ${PK} stroke-width="4"/>`,
  triangle: `<path d="M50 14 L88 84 H12 Z" fill="#e4572e" ${PK} stroke-width="4"/>`,
  rectangle: `<rect x="8" y="28" width="84" height="44" fill="#7bc950" ${PK} stroke-width="4"/>`,
});
Object.assign(PICTOS_NOMS, { carre: "un carré", rond: "un rond", triangle: "un triangle", rectangle: "un rectangle" });

/* des crayons de longueurs différentes (crayon-3 à crayon-9 : de 30 à 90), pour ranger des longueurs */
const crayonSvg = (l, x = 0, y = 0, couleur = "#2e86de", h = 16) => `<g transform="translate(${x} ${y})"><rect x="0" y="0" width="${l - h * 1.3}" height="${h}" rx="3" fill="${couleur}" ${PK} stroke-width="2.5"/>`
  + `<path d="M${l - h * 1.3} 0 L${l} ${h / 2} L${l - h * 1.3} ${h} Z" fill="#f3d9a4" ${PK} stroke-width="2.5"/><path d="M${l - h * 0.4} ${h / 2 - 2.5} L${l} ${h / 2} L${l - h * 0.4} ${h / 2 + 2.5} Z" fill="#2b2236"/></g>`;
["#e4572e", "#f08a3c", "#f6c445", "#7bc950", "#2e86de", "#8e6cc9", "#ef7fa8"].forEach((c, k) => {
  const l = 30 + k * 10;
  PICTOS["crayon-" + (k + 3)] = crayonSvg(l, (100 - l) / 2, 42, c);
  PICTOS_NOMS["crayon-" + (k + 3)] = "un crayon";
});

/* ---------- la période 2 du CP : les animaux et leurs petits, manger, la toilette, les mots des nouveaux sons ---------- */
const oeil = (x, y, r = 3.5) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#2b2236"/>`;
Object.assign(PICTOS, {
  /* les animaux et leurs petits */
  poule: `<path d="M22 60 q0 -26 26 -30 q8 -16 22 -10 q8 4 6 14 l10 4 l-10 4 q4 20 -10 34 q-22 12 -38 2 q-10 -6 -6 -18 z" fill="#fff" ${PK}/>
    <path d="M58 22 q2 -10 8 -8 q4 -6 8 0 q6 0 2 8 z" fill="#e4572e" ${PK} stroke-width="2"/><path d="M76 40 q4 6 -2 10" fill="#e4572e" ${PK} stroke-width="2"/>
    ${oeil(66, 34)}<path d="M30 58 q14 10 30 -2" fill="none" ${PK}/><path d="M40 86 v8 M54 86 v8" ${PK}/>`,
  poussin: `<ellipse cx="50" cy="60" rx="28" ry="24" fill="#ffd84a" ${PK}/><circle cx="58" cy="36" r="16" fill="#ffd84a" ${PK}/>
    ${oeil(62, 33)}<path d="M72 38 l10 3 l-10 4 z" fill="#f08a3c" ${PK} stroke-width="2"/><path d="M32 58 q8 8 18 0" fill="none" ${PK} stroke-width="2.5"/>
    <path d="M44 84 v8 M58 84 v8" ${PK}/>`,
  vache: `<rect x="18" y="40" width="58" height="34" rx="12" fill="#fff" ${PK}/><path d="M30 42 q8 10 0 20 q-10 -4 -8 -16 z M54 56 q10 -6 14 6 q-8 8 -14 -6 z" fill="#2b2236"/>
    <path d="M26 74 v14 M38 74 v14 M58 74 v14 M70 74 v14" ${PK} stroke-width="5"/><rect x="66" y="22" width="26" height="30" rx="10" fill="#fff" ${PK}/>
    <rect x="68" y="40" width="22" height="14" rx="7" fill="#ef7fa8" ${PK} stroke-width="2"/>${oeil(74, 32, 3)}${oeil(86, 32, 3)}<path d="M66 24 l-6 -8 M92 24 l6 -8" ${PK}/>`,
  veau: `<rect x="14" y="42" width="54" height="30" rx="12" fill="#e9c9a0" ${PK}/><path d="M28 44 q8 10 0 20 q-10 -4 -8 -16 z" fill="#a8672d"/>
    <path d="M22 72 v16 M34 72 v16 M52 72 v16 M62 72 v16" ${PK} stroke-width="5"/><rect x="60" y="24" width="28" height="30" rx="11" fill="#e9c9a0" ${PK}/>
    <rect x="62" y="42" width="24" height="13" rx="6" fill="#ef7fa8" ${PK} stroke-width="2"/>${oeil(68, 35, 3)}${oeil(80, 35, 3)}<path d="M60 26 l-6 -6 M88 26 l6 -6" ${PK}/>`,
  mouton: `<path d="M20 58 q-8 -14 6 -20 q2 -14 16 -12 q8 -10 20 -2 q14 -4 16 10 q12 6 4 20 q4 14 -10 16 q-6 10 -20 4 q-12 6 -20 -4 q-14 0 -12 -12 z" fill="#f4f1ea" ${PK}/>
    <ellipse cx="78" cy="48" rx="12" ry="14" fill="#5a4a6b" ${PK}/>${oeil(80, 44, 2.5)}<path d="M34 80 v10 M64 80 v10" ${PK} stroke-width="5"/>`,
  agneau: `<path d="M28 62 q-6 -10 4 -15 q2 -10 12 -9 q6 -7 14 -1 q10 -3 12 7 q8 5 3 15 q2 10 -8 11 q-5 7 -14 3 q-9 4 -15 -3 q-10 0 -8 -8 z" fill="#fff" ${PK}/>
    <ellipse cx="74" cy="52" rx="9" ry="11" fill="#d9c9b6" ${PK}/>${oeil(76, 49, 2.2)}<path d="M40 78 v10 M60 78 v10" ${PK} stroke-width="4"/>`,
  chien: `<rect x="12" y="44" width="58" height="28" rx="12" fill="#c98a3c" ${PK}/><path d="M20 72 v18 M34 72 v18 M50 72 v18 M62 72 v18" ${PK} stroke-width="5"/>
    <path d="M14 50 q-10 -6 -6 -20" fill="none" ${PK} stroke-width="5"/><circle cx="72" cy="36" r="18" fill="#c98a3c" ${PK}/>
    <path d="M58 26 q-10 6 -4 24 q8 -2 8 -16 z M86 26 q10 6 4 24 q-8 -2 -8 -16 z" fill="#8a5a24" ${PK} stroke-width="2"/>${oeil(66, 34)}${oeil(78, 34)}<ellipse cx="72" cy="45" rx="5" ry="3.5" fill="#2b2236"/>`,
  chiot: `<rect x="20" y="52" width="46" height="24" rx="11" fill="#e3b06a" ${PK}/><path d="M28 76 v12 M40 76 v12 M52 76 v12 M60 76 v12" ${PK} stroke-width="4"/>
    <path d="M22 58 q-8 -4 -6 -14" fill="none" ${PK} stroke-width="4"/><circle cx="70" cy="46" r="17" fill="#e3b06a" ${PK}/>
    <path d="M56 36 q-10 6 -4 22 q8 -2 8 -14 z M84 36 q10 6 4 22 q-8 -2 -8 -14 z" fill="#a8672d" ${PK} stroke-width="2"/>${oeil(64, 45, 3.5)}${oeil(76, 45, 3.5)}<ellipse cx="70" cy="54" rx="4" ry="3" fill="#2b2236"/>`,
  oeuf: `<path d="M50 10 q28 4 30 46 q0 34 -30 34 q-30 0 -30 -34 q2 -42 30 -46 z" fill="#f6ead0" ${PK}/><path d="M36 36 q4 -10 12 -14" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`,
  canard: `<path d="M16 58 q4 -12 22 -12 h18 q4 -18 20 -18 q14 0 14 14 q0 10 -10 12 q14 4 10 22 q-6 14 -36 14 q-30 0 -38 -32 z" fill="#ffd84a" ${PK}/>
    <path d="M88 40 l12 4 l-12 4 z" fill="#f08a3c" ${PK} stroke-width="2"/>${oeil(80, 36)}<path d="M36 62 q14 12 30 0" fill="none" ${PK} stroke-width="2.5"/>`,
  /* les objets et les aliments */
  bateau: `<path d="M8 62 h84 l-12 22 h-60 z" fill="#e4572e" ${PK}/><path d="M50 62 v-50" ${PK}/><path d="M52 14 l30 40 h-30 z" fill="#fff" ${PK}/><path d="M48 22 l-24 32 h24 z" fill="#f6c445" ${PK}/>
    <path d="M4 92 q12 -6 24 0 q12 6 24 0 q12 -6 24 0 q12 6 22 0" fill="none" stroke="#2e86de" stroke-width="4" stroke-linecap="round"/>`,
  bebe: `<circle cx="50" cy="42" r="26" fill="#f3c9a0" ${PK}/><path d="M38 20 q12 -10 18 2" fill="none" ${PK}/>${oeil(41, 40)}${oeil(59, 40)}
    <path d="M42 54 q8 6 16 0" fill="none" ${PK} stroke-width="2.5"/><circle cx="34" cy="50" r="4" fill="#ef7fa8" opacity=".6"/><circle cx="66" cy="50" r="4" fill="#ef7fa8" opacity=".6"/>
    <path d="M28 96 q0 -26 22 -26 q22 0 22 26 z" fill="#5bc0eb" ${PK}/>`,
  dent: `<path d="M24 22 q12 -10 26 0 q14 -10 26 0 q8 10 4 26 q-4 14 -6 34 q-2 10 -8 8 q-4 -2 -6 -22 q-2 -8 -10 -8 q-8 0 -10 8 q-2 20 -6 22 q-6 2 -8 -8 q-2 -20 -6 -34 q-4 -16 4 -26 z" fill="#fff" ${PK}/>
    <path d="M34 26 q4 -4 10 -2" fill="none" stroke="#bfe6f7" stroke-width="4" stroke-linecap="round"/>`,
  brosse: `<rect x="10" y="56" width="62" height="12" rx="6" fill="#5bc0eb" ${PK} transform="rotate(-20 41 62)"/><rect x="62" y="20" width="26" height="22" rx="4" fill="#fff" ${PK} transform="rotate(-20 75 31)"/>
    <path d="M64 22 l-4 -12 M70 20 l-4 -12 M76 18 l-4 -12 M82 16 l-4 -12" ${PK} stroke-width="2.5" transform="rotate(-20 75 31)"/>`,
  savon: `<rect x="16" y="40" width="68" height="40" rx="16" fill="#ef7fa8" ${PK}/><path d="M28 52 q10 -6 20 0" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
    <circle cx="34" cy="24" r="8" fill="#e8f6ff" ${PK} stroke-width="2"/><circle cx="54" cy="16" r="6" fill="#e8f6ff" ${PK} stroke-width="2"/><circle cx="70" cy="28" r="7" fill="#e8f6ff" ${PK} stroke-width="2"/>`,
  pain: `<path d="M10 64 q0 -24 40 -26 q40 2 40 26 q0 12 -40 12 q-40 0 -40 -12 z" fill="#e0a85a" ${PK}/>
    <path d="M28 50 l8 10 M46 46 l8 12 M64 48 l8 10" stroke="#a8672d" stroke-width="4" stroke-linecap="round"/>`,
  lait: `<path d="M30 30 l10 -16 h20 l10 16 v58 h-40 z" fill="#fff" ${PK}/><path d="M40 14 v-6 h20 v6" fill="#5bc0eb" ${PK}/>
    <rect x="30" y="46" width="40" height="22" fill="#5bc0eb" ${PK}/><text x="50" y="62" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">LAIT</text>`,
  bonbon: `<path d="M8 36 l22 10 l-22 10 z M92 36 l-22 10 l22 10 z" fill="#ef7fa8" ${PK}/><ellipse cx="50" cy="46" rx="22" ry="16" fill="#e4572e" ${PK}/>
    <path d="M38 38 q12 8 24 0 M38 54 q12 -8 24 0" fill="none" stroke="#fff" stroke-width="3"/>`,
  soda: `<rect x="32" y="16" width="36" height="72" rx="8" fill="#e4572e" ${PK}/><rect x="36" y="10" width="28" height="8" rx="3" fill="#9aa4b5" ${PK} stroke-width="2"/>
    <path d="M32 40 q18 10 36 0 v14 q-18 10 -36 0 z" fill="#fff"/><circle cx="44" cy="70" r="3" fill="#fff"/><circle cx="54" cy="76" r="2" fill="#fff"/>`,
  verre: `<path d="M26 14 h48 l-6 76 h-36 z" fill="#e8f6ff" ${PK}/><path d="M29 40 h42 l-4 48 h-34 z" fill="#5bc0eb"/><path d="M26 14 h48 l-6 76 h-36 z" fill="none" ${PK}/>`,
  tasse: `<path d="M18 34 h52 v30 q0 18 -26 18 q-26 0 -26 -18 z" fill="#fff" ${PK}/><path d="M70 42 q16 0 14 12 q-2 10 -14 8" fill="none" ${PK} stroke-width="5"/>
    <path d="M30 26 q-4 -8 2 -14 M44 24 q-4 -8 2 -14" fill="none" stroke="#9aa4b5" stroke-width="3" stroke-linecap="round"/><path d="M12 88 h66" ${PK}/>`,
  tapis: `<rect x="10" y="30" width="80" height="44" rx="4" fill="#e4572e" ${PK}/><rect x="18" y="38" width="64" height="28" fill="#f6c445" ${PK} stroke-width="2"/>
    <path d="M30 52 l10 -8 l10 8 l10 -8 l10 8" fill="none" stroke="#e4572e" stroke-width="3"/><path d="M10 34 h-6 M10 42 h-6 M10 50 h-6 M10 58 h-6 M10 66 h-6 M90 34 h6 M90 42 h6 M90 50 h6 M90 58 h6 M90 66 h6" ${PK} stroke-width="2"/>`,
  de: `<rect x="18" y="18" width="64" height="64" rx="12" fill="#fff" ${PK} stroke-width="4"/>${oeil(34, 34, 6)}${oeil(50, 50, 6)}${oeil(66, 66, 6)}`,
  domino: `<rect x="30" y="8" width="40" height="84" rx="8" fill="#fff" ${PK} stroke-width="4"/><path d="M32 50 h36" ${PK}/>
    ${oeil(42, 22, 4.5)}${oeil(58, 36, 4.5)}${oeil(42, 64, 4.5)}${oeil(58, 64, 4.5)}${oeil(50, 78, 4.5)}`,
  nid: `<path d="M10 56 q40 40 80 0 q-6 -10 -40 -10 q-34 0 -40 10 z" fill="#a8672d" ${PK}/><path d="M14 58 q36 -4 72 0 M18 66 q32 6 64 0" fill="none" stroke="#7a4a24" stroke-width="3"/>
    <ellipse cx="38" cy="48" rx="10" ry="8" fill="#bfe6f7" ${PK} stroke-width="2"/><ellipse cx="56" cy="46" rx="10" ry="8" fill="#bfe6f7" ${PK} stroke-width="2"/>`,
  feu: `<path d="M50 8 q20 22 18 40 q10 -6 8 -16 q14 18 6 38 q-8 20 -32 20 q-24 0 -32 -20 q-8 -20 8 -34 q0 10 8 14 q-4 -22 16 -42 z" fill="#f08a3c" ${PK}/>
    <path d="M50 46 q12 14 8 26 q-4 10 -8 10 q-10 0 -12 -10 q-2 -12 12 -26 z" fill="#ffd84a"/>`,
  girafe: `<path d="M56 8 h10 l2 52 h-14 z" fill="#f6c445" ${PK}/><rect x="52" y="6" width="22" height="14" rx="7" fill="#f6c445" ${PK}/>${oeil(66, 12, 2.5)}
    <path d="M22 54 q0 -6 8 -6 h40 q8 0 8 10 v10 h-56 z" fill="#f6c445" ${PK}/><path d="M28 68 v24 M40 68 v24 M62 68 v24 M72 68 v24" ${PK} stroke-width="5"/>
    <g fill="#c98a3c"><circle cx="36" cy="58" r="4"/><circle cx="52" cy="56" r="4"/><circle cx="66" cy="60" r="3.5"/><circle cx="60" cy="30" r="3"/><circle cx="62" cy="44" r="3"/></g>`,
  jupe: `<path d="M34 16 h32 l4 12 h-40 z" fill="#8e6cc9" ${PK}/><path d="M30 28 h40 l18 60 h-76 z" fill="#ef7fa8" ${PK}/><path d="M40 28 l-8 60 M60 28 l8 60 M50 28 v60" stroke="#c94f7c" stroke-width="2"/>`,
  chapeau: `<ellipse cx="50" cy="70" rx="44" ry="12" fill="#2b2236" ${PK}/><path d="M28 70 v-40 q22 -12 44 0 v40 z" fill="#2b2236" ${PK}/><rect x="28" y="56" width="44" height="10" fill="#e4572e"/>`,
  mouche: `<ellipse cx="50" cy="58" rx="16" ry="22" fill="#3d3550" ${PK}/><circle cx="50" cy="32" r="12" fill="#3d3550" ${PK}/><circle cx="44" cy="30" r="5" fill="#e4572e"/><circle cx="56" cy="30" r="5" fill="#e4572e"/>
    <ellipse cx="30" cy="44" rx="16" ry="10" fill="#e8f6ff" ${PK} stroke-width="2" transform="rotate(-25 30 44)"/><ellipse cx="70" cy="44" rx="16" ry="10" fill="#e8f6ff" ${PK} stroke-width="2" transform="rotate(25 70 44)"/>`,
  loup: `<path d="M22 22 l12 22 l-16 4 z M78 22 l-12 22 l16 4 z" fill="#7d8796" ${PK}/><path d="M18 48 q2 -20 32 -22 q30 2 32 22 q-6 22 -32 40 q-26 -18 -32 -40 z" fill="#9aa4b5" ${PK}/>
    <path d="M38 60 q12 26 24 0 q-6 6 -12 6 q-6 0 -12 -6 z" fill="#e8e3f0"/>${oeil(38, 48)}${oeil(62, 48)}<ellipse cx="50" cy="70" rx="5" ry="4" fill="#2b2236"/>`,
  cochon: `<ellipse cx="50" cy="54" rx="36" ry="30" fill="#f6b3c8" ${PK}/><path d="M22 34 l-4 -16 l16 10 z M78 34 l4 -16 l-16 10 z" fill="#ef7fa8" ${PK}/>
    <ellipse cx="50" cy="62" rx="14" ry="10" fill="#ef7fa8" ${PK}/><circle cx="45" cy="62" r="3" fill="#2b2236"/><circle cx="55" cy="62" r="3" fill="#2b2236"/>${oeil(38, 44)}${oeil(62, 44)}`,
  chemise: `<path d="M34 12 l16 10 l16 -10 l22 12 l-8 20 l-10 -4 v50 h-40 v-50 l-10 4 l-8 -20 z" fill="#bfe6f7" ${PK}/><path d="M50 22 v68" ${PK} stroke-width="2"/>
    <circle cx="50" cy="38" r="2.5" fill="#2b2236"/><circle cx="50" cy="54" r="2.5" fill="#2b2236"/><circle cx="50" cy="70" r="2.5" fill="#2b2236"/><path d="M34 12 l16 14 l16 -14" fill="#fff" ${PK} stroke-width="2"/>`,
  renard: `<path d="M20 18 l14 24 l-18 4 z M80 18 l-14 24 l18 4 z" fill="#f08a3c" ${PK}/><path d="M16 46 q4 -22 34 -22 q30 0 34 22 q-6 22 -34 42 q-28 -20 -34 -42 z" fill="#f08a3c" ${PK}/>
    <path d="M30 60 q20 34 40 0 q-20 6 -40 0 z" fill="#fff8ea"/>${oeil(38, 48)}${oeil(62, 48)}<ellipse cx="50" cy="76" rx="5" ry="4" fill="#2b2236"/>`,
  melon: `<path d="M10 50 a40 36 0 0 0 80 0 z" fill="#7bc950" ${PK}/><path d="M16 50 a34 30 0 0 0 68 0 z" fill="#f6a35c"/>
    <g fill="#8a5a24"><ellipse cx="38" cy="60" rx="2" ry="4"/><ellipse cx="50" cy="66" rx="2" ry="4"/><ellipse cx="62" cy="60" rx="2" ry="4"/></g><path d="M10 50 h80" ${PK}/>`,
});
Object.assign(PICTOS_NOMS, {
  poule: "une poule", poussin: "un poussin", vache: "une vache", veau: "un veau", mouton: "un mouton", agneau: "un agneau",
  chien: "un chien", chiot: "un chiot", oeuf: "un œuf", canard: "un canard",
  bateau: "un bateau", bebe: "un bébé", dent: "une dent", brosse: "une brosse à dents", savon: "un savon", pain: "du pain", lait: "du lait",
  bonbon: "un bonbon", soda: "une canette de soda", verre: "un verre d'eau", tasse: "une tasse", tapis: "un tapis", de: "un dé", domino: "un domino",
  nid: "un nid", feu: "le feu", girafe: "une girafe", jupe: "une jupe", chapeau: "un chapeau", mouche: "une mouche", loup: "un loup",
  cochon: "un cochon", chemise: "une chemise", renard: "un renard", melon: "un melon",
});
