/* L'Atelier de Boulon — illustrations vectorielles originales (SVG en code). */
"use strict";

const INK = "#2b2236";
const S = `stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
/* place des décors de la boutique dans l'atelier : { id: "translate(x y) scale(k)" }.
   Vide = la place dessinée dans ATELIER_DECORS (celle de l'atelier du CE2) */
const PLACE_DECORS = {};
/* couleurs du sablier du temps (choisies le 14/11/2026) : bois noir, sable orange qui brille un peu */
const SABLIER_BOIS = "#2a2530", SABLIER_REFLET = "#5d5668", SABLIER_SABLE = "#ff8a1c", SABLIER_BRILLE = "#ffc35c";

/* ---------- Boutique de l'aventure : couleurs et accessoires de Boulon (repère 150 × 170) ---------- */
const BOULON_COULEURS = {
  orange: ["#d98b4a", "#f3b27a"], bleu: ["#4a9be6", "#9ccbf5"], vert: ["#5fb648", "#a6dc8f"],
  violet: ["#8e6cc9", "#c3aee8"], rose: ["#ef7fa8", "#f8c2d6"],
};
const BOULON_ACCESSOIRES = {
  casquette: `<path d="M34 44 q2 -28 41 -28 q39 0 41 28 z" fill="#e4572e" ${S}/>
    <path d="M110 42 q22 -2 32 8 q-18 6 -36 -2 z" fill="#c4401d" ${S}/><circle cx="75" cy="17" r="4" fill="#f6c445" ${S}/>`,
  chantier: `<path d="M36 42 q0 -30 39 -30 q39 0 39 30 z" fill="#f6c445" ${S}/><path d="M75 14 v26" stroke="#d9a400" stroke-width="6"/>
    <rect x="28" y="38" width="94" height="10" rx="5" fill="#f6c445" ${S}/>`,
  magicien: `<path d="M50 36 L75 -16 L100 36 z" fill="#5a4a9b" ${S}/><ellipse cx="75" cy="36" rx="40" ry="8" fill="#5a4a9b" ${S}/>
    <path d="M66 14 l2 5 l5 0 l-4 3 l2 5 l-5 -3 l-5 3 l2 -5 l-4 -3 l5 0z M82 0 l1.5 4 l4 0 l-3 2.5 l1.5 4 l-4 -2.5 l-4 2.5 l1.5 -4 l-3 -2.5 l4 0z" fill="#f6c445"/>`,
  couronne: `<path d="M44 34 l4 -26 l14 14 l13 -20 l13 20 l14 -14 l4 26 z" fill="#f6c445" ${S}/>
    <circle cx="75" cy="25" r="4" fill="#e4572e" ${S} stroke-width="2"/><circle cx="57" cy="28" r="3" fill="#5bc0eb" ${S} stroke-width="2"/><circle cx="93" cy="28" r="3" fill="#7bc950" ${S} stroke-width="2"/>`,
  lunettes: `<g fill="rgba(255,255,255,.25)" ${S}><circle cx="60" cy="68" r="14"/><circle cx="90" cy="68" r="14"/></g><path d="M74 67 h2 M46 65 l-6 -3 M104 65 l6 -3" ${S}/>`,
  soleil: `<path d="M44 60 h30 v8 q0 12 -15 12 q-15 0 -15 -12z M76 60 h30 v8 q0 12 -15 12 q-15 0 -15 -12z" fill="#2b2236" ${S}/>
    <path d="M74 63 h2 M44 62 l-6 -3 M106 62 l6 -3" ${S}/><path d="M50 64 l8 0 M82 64 l8 0" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".7"/>`,
  noeud: `<path d="M75 118 l-19 -11 v22 z M75 118 l19 -11 v22 z" fill="#e4572e" ${S}/><circle cx="75" cy="118" r="5" fill="#c4401d" ${S}/>`,
  echarpe: `<path d="M30 104 q45 16 90 0 v13 q-45 16 -90 0 z" fill="#5bc0eb" ${S}/><path d="M94 116 l6 32 l13 -3 l-5 -31 z" fill="#5bc0eb" ${S}/>
    <path d="M50 113 v10 M66 116 v10 M84 116 v10 M98 132 l12 -2" stroke="#fff8ea" stroke-width="4" stroke-linecap="round"/>`,
};

/* ---------- Boutique de l'aventure : décorations de l'atelier (repère 1024 × 768) ---------- */
function guirlandeSvg() {
  const cols = ["#e4572e", "#f6c445", "#5bc0eb", "#7bc950", "#8e6cc9", "#ef7fa8"];
  const pt = (t) => [(1 - t) ** 2 * 240 + 2 * (1 - t) * t * 580 + t * t * 920, (1 - t) ** 2 * 14 + 2 * (1 - t) * t * 70 + t * t * 14];
  let f = "";
  for (let i = 0; i < 14; i++) {
    const [x1, y1] = pt((i + 0.15) / 14), [x2, y2] = pt((i + 0.85) / 14);
    f += `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)} L${((x1 + x2) / 2).toFixed(1)} ${((y1 + y2) / 2 + 30).toFixed(1)} z" fill="${cols[i % 6]}" ${S} stroke-width="2"/>`;
  }
  return `<path d="M240 14 Q580 70 920 14" fill="none" ${S}/>${f}`;
}
/* box : cadrage de la vignette dans la boutique */
const ATELIER_DECORS = {
  guirlande: { box: "238 4 330 72", svg: guirlandeSvg },
  cactus: { box: "170 192 56 70", svg: () => `
    <path d="M190 222 h-6 q-4 0 -4 -6 v-6" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M190 222 h-6 q-4 0 -4 -6 v-6" fill="none" stroke="#5fb648" stroke-width="3" stroke-linecap="round"/>
    <path d="M206 228 h6 q4 0 4 -6 v-6" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M206 228 h6 q4 0 4 -6 v-6" fill="none" stroke="#5fb648" stroke-width="3" stroke-linecap="round"/>
    <rect x="190" y="204" width="16" height="38" rx="8" fill="#5fb648" ${S}/>
    <circle cx="198" cy="203" r="4" fill="#ef7fa8" ${S} stroke-width="2"/>
    <path d="M182 238 h32 l-4 20 h-24 z" fill="#e07a4a" ${S}/>` },
  plante: { box: "190 540 96 166", svg: () => `
    <path d="M238 640 q-40 -30 -30 -80 q20 30 30 80 z M238 640 q-4 -60 18 -90 q10 40 -18 90 z M238 640 q30 -40 40 -60 q6 40 -40 60 z M238 640 q-30 -10 -40 -30 q30 0 40 30 z" fill="#5fb648" ${S}/>
    <path d="M238 640 q-14 -40 -22 -70 M238 640 q4 -44 14 -76 M238 640 q22 -28 34 -50" fill="none" stroke="#3f8a2e" stroke-width="2"/>
    <path d="M208 636 h60 l-9 64 h-42 z" fill="#2e86de" ${S}/><rect x="204" y="632" width="68" height="12" rx="4" fill="#4a9be6" ${S}/>` },
  affiche: { box: "770 70 140 192", svg: () => `
    <rect x="780" y="80" width="120" height="172" rx="6" fill="#1f2b52" ${S} stroke-width="5"/>
    <g fill="#fff8ea"><circle cx="800" cy="104" r="2.5"/><circle cx="878" cy="98" r="2"/><circle cx="866" cy="140" r="2.5"/><circle cx="796" cy="170" r="2"/><circle cx="884" cy="200" r="2"/></g>
    <circle cx="806" cy="214" r="14" fill="#f6c445" ${S} stroke-width="2"/>
    <path d="M830 170 q10 34 10 40 q0 -6 10 -40 z" fill="#f6c445" ${S} stroke-width="2"/>
    <path d="M824 156 l-12 20 h14 z M856 156 l12 20 h-14 z" fill="#e4572e" ${S} stroke-width="2"/>
    <path d="M840 106 q18 22 16 62 h-32 q-2 -40 16 -62 z" fill="#e8e3f0" ${S}/>
    <circle cx="840" cy="138" r="8" fill="#5bc0eb" ${S} stroke-width="2"/>
    <text x="840" y="244" text-anchor="middle" font-family="Segoe Print, Comic Sans MS" font-size="15" font-weight="700" fill="#f6c445">EN ROUTE !</text>` },
  tableau: { box: "418 278 214 144", svg: () => `
    <rect x="430" y="288" width="190" height="120" rx="6" fill="#2f5446" stroke="#8a5a24" stroke-width="8"/>
    <rect x="426" y="284" width="198" height="128" rx="8" fill="none" ${S}/>
    <g font-family="Segoe Print, Comic Sans MS" font-weight="700" fill="#f2efe4">
      <text x="448" y="322" font-size="20">7 × 8 = 56</text><text x="448" y="352" font-size="18">le petit chat</text>
      <text x="448" y="384" font-size="18">½ + ½ = 1</text><text x="586" y="384" font-size="22" fill="#f6c445">★</text></g>
    <rect x="560" y="402" width="26" height="6" rx="2" fill="#fff8ea" ${S} stroke-width="1.5"/>` },
  tapis: { box: "330 704 380 64", svg: () => ["#e4572e", "#f08a3c", "#f6c445", "#7bc950", "#5bc0eb", "#8e6cc9"]
    .map((c, i) => `<ellipse cx="520" cy="736" rx="${262 - i * 38}" ry="${27 - i * 4}" fill="${c}" ${i === 0 ? S : ""}/>`).join("") },
  chat: { box: "822 664 104 100", svg: () => `
    <ellipse cx="872" cy="756" rx="40" ry="6" fill="rgba(0,0,0,.25)"/>
    <path d="M904 736 q22 -6 16 -34" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M904 736 q22 -6 16 -34" fill="none" stroke="#9aa6b8" stroke-width="3" stroke-linecap="round"/>
    <rect x="836" y="716" width="72" height="40" rx="18" fill="#9aa6b8" ${S}/>
    <path d="M840 700 l4 -26 l18 16 z M904 700 l-4 -26 l-18 16 z" fill="#9aa6b8" ${S}/>
    <rect x="836" y="684" width="72" height="44" rx="20" fill="#b9c3d1" ${S}/>
    <circle cx="858" cy="704" r="7" fill="#7bc950" ${S} stroke-width="2"/><circle cx="886" cy="704" r="7" fill="#7bc950" ${S} stroke-width="2"/>
    <circle cx="858" cy="704" r="2.5" fill="${INK}"/><circle cx="886" cy="704" r="2.5" fill="${INK}"/>
    <path d="M868 716 l4 3 l4 -3" fill="none" ${S} stroke-width="2"/><path d="M848 716 h-12 M896 716 h12" stroke="${INK}" stroke-width="2"/>
    <circle cx="872" cy="738" r="5" fill="#f6c445" ${S} stroke-width="2"/>` },
};

/* ---------------- Objets cliquables de l'atelier ----------------
   Chaque objet : { id, ecran (écran ouvert au clic), ordre (plus petit = dessiné en dessous),
   label, desc (aide de la lampe), transform?, svg() }. Le moteur ajoute les siens ci-dessous ;
   un niveau ou un module ajoute les siens avec objetAtelier({...}) dans ses propres fichiers.
   Un niveau peut en cacher avec NIVEAU.sansObjets. Repère : 1024 × 768. */
const ATELIER_OBJETS = [];

/* ---------------- Les pièces de l'atelier (facultatif) ----------------
   Un niveau peut répartir son atelier en plusieurs pièces reliées par des passages (le CP) :
   NIVEAU.pieces = [{ id, nom: "La classe", court: "Classe", dans: "dans la classe", mur, sol,
     fond(), entree (phrase de Boulon en entrant), objets: [ids], decors: [ids], passages: [{ vers, x, sens }] }],
   dans l'ordre du plan (de gauche à droite), et NIVEAU.pieceDepart (la pièce où l'on arrive).
   Un objet ou un décor qui n'est rangé dans aucune pièce va dans la pièce de départ.
   Sans NIVEAU.pieces, l'atelier reste une seule pièce (le CE2). */
const Pieces = {
  courante: null,   // la pièce où est l'élève (on y revient en quittant un écran)
  liste() { return NIVEAU.pieces && NIVEAU.pieces.length ? NIVEAU.pieces : null; },
  depart() { const l = this.liste(); return l && (l.find((p) => p.id === NIVEAU.pieceDepart) || l[0]); },
  get(id) { const l = this.liste(); return (l && l.find((p) => p.id === id)) || null; },
  /* la pièce d'un objet (sorte = "objets") ou d'un décor de la boutique (sorte = "decors") */
  de(id, sorte) { const l = this.liste(); return l ? (l.find((p) => (p[sorte] || []).includes(id)) || this.depart()) : null; },
};
/* étiquettes parlantes des décors actifs (comme objet.etiquette) : { pot: { x, y, w, texte, couleur } } */
const ETIQUETTES_DECORS = {};
function objetAtelier(o) {
  const i = ATELIER_OBJETS.findIndex((x) => x.id === o.id);
  if (i >= 0) ATELIER_OBJETS.splice(i, 1);           // remplacer un objet du moteur
  ATELIER_OBJETS.push(o);
  ATELIER_OBJETS.sort((a, b) => (a.ordre ?? 1000) - (b.ordre ?? 1000));
}

const Art = {
  /* ---------------- Personnages ---------------- */
  /* style = { couleur, tete, yeux, cou } ; par défaut, celui de l'élève (boutique de l'aventure) */
  boulon(style) {
    const st = style || (typeof Aventure !== "undefined" ? Aventure.style() : {}) || {};
    const [c1, c2] = BOULON_COULEURS[st.couleur] || BOULON_COULEURS.orange;
    const acc = (id) => (id && BOULON_ACCESSOIRES[id]) || "";
    return `<svg viewBox="0 0 150 170" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="75" cy="164" rx="44" ry="6" fill="rgba(0,0,0,.25)"/>
      <g class="bob">
        <line x1="75" y1="30" x2="75" y2="12" ${S}/>
        <circle class="bulb" cx="75" cy="10" r="8" fill="#ffe27a" ${S}/>
        <rect x="55" y="118" width="14" height="30" rx="6" fill="#9c6b3c" ${S}/>
        <rect x="81" y="118" width="14" height="30" rx="6" fill="#9c6b3c" ${S}/>
        <ellipse cx="62" cy="152" rx="14" ry="7" fill="#5a4a6b" ${S}/>
        <ellipse cx="88" cy="152" rx="14" ry="7" fill="#5a4a6b" ${S}/>
        <path d="M30 96 q-18 4 -16 24" fill="none" ${S} stroke-width="7"/>
        <path d="M30 96 q-18 4 -16 24" fill="none" stroke="${c1}" stroke-width="3" stroke-linecap="round"/>
        <circle cx="14" cy="122" r="7" fill="#f6c445" ${S}/>
        <path d="M120 96 q20 -6 22 -26" fill="none" ${S} stroke-width="7"/>
        <path d="M120 96 q20 -6 22 -26" fill="none" stroke="${c1}" stroke-width="3" stroke-linecap="round"/>
        <circle cx="142" cy="68" r="7" fill="#f6c445" ${S}/>
        <rect x="28" y="28" width="94" height="96" rx="34" fill="${c1}" ${S}/>
        <path d="M40 40 q35 -14 70 0" fill="none" stroke="${c2}" stroke-width="6" stroke-linecap="round"/>
        <rect x="40" y="48" width="70" height="44" rx="20" fill="#fff8ea" ${S}/>
        <circle cx="60" cy="68" r="10" fill="#fff" ${S}/>
        <circle cx="90" cy="68" r="10" fill="#fff" ${S}/>
        <circle cx="62" cy="70" r="5" fill="${INK}"/>
        <circle cx="92" cy="70" r="5" fill="${INK}"/>
        <circle cx="64" cy="67" r="1.8" fill="#fff"/>
        <circle cx="94" cy="67" r="1.8" fill="#fff"/>
        <ellipse class="mouth" cx="75" cy="92" rx="11" ry="6" fill="#e4572e" ${S}/>
        <circle cx="46" cy="104" r="5" fill="#f6c445" ${S}/>
        <circle cx="104" cy="104" r="5" fill="#f6c445" ${S}/>
        <circle cx="75" cy="110" r="6" fill="#5bc0eb" ${S}/>
        ${acc(st.cou)}${acc(st.yeux)}${acc(st.tete)}
      </g>
    </svg>`;
  },

  zigzag() {
    return `<svg viewBox="0 0 150 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="75" cy="154" rx="44" ry="6" fill="rgba(0,0,0,.25)"/>
      <path d="M118 120 q34 -10 26 -48 q-10 20 -30 22" fill="#f08a3c" ${S}/>
      <path d="M140 76 q-4 10 -14 14" fill="#fff" ${S}/>
      <rect x="48" y="104" width="54" height="46" rx="20" fill="#f08a3c" ${S}/>
      <path d="M62 112 q13 18 26 0 v30 h-26z" fill="#fff8ea" ${S}/>
      <path d="M30 30 L50 62 L26 70 Z" fill="#f08a3c" ${S}/>
      <path d="M120 30 L100 62 L124 70 Z" fill="#f08a3c" ${S}/>
      <path d="M34 40 L44 60 L32 64 Z" fill="${INK}" opacity=".6"/>
      <path d="M116 40 L106 60 L118 64 Z" fill="${INK}" opacity=".6"/>
      <path d="M28 66 q47 -40 94 0 q4 30 -20 44 l-27 14 l-27 -14 q-24 -14 -20 -44z" fill="#f08a3c" ${S}/>
      <path d="M48 90 q27 34 54 0 q-6 18 -27 32 q-21 -14 -27 -32z" fill="#fff8ea" ${S}/>
      <circle cx="58" cy="78" r="13" fill="#5bc0eb" ${S}/>
      <circle cx="92" cy="78" r="13" fill="#5bc0eb" ${S}/>
      <line x1="71" y1="78" x2="79" y2="78" ${S}/>
      <circle cx="60" cy="80" r="4" fill="${INK}"/>
      <circle cx="94" cy="80" r="4" fill="${INK}"/>
      <ellipse cx="75" cy="106" rx="6" ry="4" fill="${INK}"/>
      <path d="M66 114 q9 6 18 0" fill="none" ${S}/>
    </svg>`;
  },

  /* ---------------- Petit sablier (bois bleu, sable vert) : titres, médaille ---------------- */
  sablier() {
    return `<svg class="sablier-ic" viewBox="0 0 40 52" aria-hidden="true"><g stroke="${INK}" stroke-width="2.5" stroke-linejoin="round">
      <rect x="2" y="2" width="36" height="7" rx="3" fill="${SABLIER_BOIS}"/><rect x="2" y="43" width="36" height="7" rx="3" fill="${SABLIER_BOIS}"/>
      <path d="M8 9 h24 q0 14 -12 17 q12 3 12 17 h-24 q0 -14 12 -17 q-12 -3 -12 -17 z" fill="#e8f6ff"/>
      <path d="M12 13 h16 q-2 8 -8 10 q-6 -2 -8 -10 z M10 42 q10 -14 20 0 z" fill="${SABLIER_SABLE}" stroke="none"/></g></svg>`;
  },

  /* ---------------- Fonds ---------------- */
  backdrop(kind) {
    const wall = kind === "board" ? "#28524f" : "#2f6f73";
    return `<svg class="scene-svg" viewBox="0 0 1024 768" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <pattern id="wallp" width="64" height="64" patternUnits="userSpaceOnUse">
          <rect width="64" height="64" fill="${wall}"/>
          <circle cx="16" cy="16" r="3" fill="rgba(255,255,255,.07)"/>
          <circle cx="48" cy="48" r="3" fill="rgba(255,255,255,.07)"/>
          <path d="M40 10 l6 0 M43 7 l0 6" stroke="rgba(255,255,255,.06)" stroke-width="2"/>
        </pattern>
        <pattern id="floorp" width="120" height="40" patternUnits="userSpaceOnUse">
          <rect width="120" height="40" fill="#b9793a"/>
          <path d="M0 39 h120 M60 0 v40" stroke="#8a5a24" stroke-width="3"/>
        </pattern>
      </defs>
      <rect width="1024" height="768" fill="url(#wallp)"/>
      <rect y="700" width="1024" height="68" fill="url(#floorp)"/>
      <rect y="694" width="1024" height="10" fill="#8a5a24"/>
    </svg>`;
  },

  /* ---------------- Extérieur : la maison-atelier ---------------- */
  exterior() {
    return `<svg class="scene-svg" viewBox="0 0 1024 768" aria-hidden="false">
      <defs>
        <linearGradient id="skyg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#7fd0f5"/><stop offset="1" stop-color="#d9f3ff"/>
        </linearGradient>
        <linearGradient id="hillg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#8fd468"/><stop offset="1" stop-color="#5aa83d"/>
        </linearGradient>
      </defs>
      <rect width="1024" height="768" fill="url(#skyg)"/>
      <g class="sun"><circle cx="880" cy="110" r="56" fill="#ffd84a" ${S}/>
        <g stroke="#f6b100" stroke-width="6" stroke-linecap="round">
          <line x1="880" y1="30" x2="880" y2="10"/><line x1="960" y1="110" x2="980" y2="110"/>
          <line x1="937" y1="53" x2="951" y2="39"/><line x1="937" y1="167" x2="951" y2="181"/>
          <line x1="800" y1="110" x2="780" y2="110"/><line x1="823" y1="53" x2="809" y2="39"/>
        </g></g>
      <g fill="#fff" ${S}>
        <path d="M120 120 q10 -40 50 -30 q20 -30 60 -6 q40 -6 40 30 q10 30 -30 30 h-110 q-30 0 -10 -24z"/>
        <path d="M560 80 q8 -30 40 -24 q16 -24 48 -4 q32 -4 30 24 q6 24 -24 24 h-86 q-24 0 -8 -20z"/>
      </g>
      <path d="M0 520 q180 -90 380 -20 q200 -110 400 -10 q140 -50 244 0 v278 h-1024z" fill="url(#hillg)" ${S}/>
      <path d="M0 640 q260 -50 520 0 q260 50 504 -10 v138 h-1024z" fill="#6fbf4a" ${S}/>
      <path d="M440 768 q40 -120 80 -150 q40 30 80 150z" fill="#e8c88a" ${S}/>
      <!-- arbre -->
      <rect x="110" y="430" width="34" height="140" rx="8" fill="#8a5a24" ${S}/>
      <circle cx="127" cy="400" r="80" fill="#4f9d3a" ${S}/>
      <circle cx="90" cy="380" r="12" fill="#e4572e" ${S}/><circle cx="150" cy="360" r="12" fill="#e4572e" ${S}/>
      <circle cx="160" cy="420" r="12" fill="#e4572e" ${S}/>
      <!-- maison -->
      <rect x="330" y="300" width="380" height="320" fill="#f6ead0" ${S}/>
      <path d="M300 310 L520 150 L740 310 Z" fill="#e4572e" ${S}/>
      <path d="M330 300 L520 165 L710 300" fill="none" stroke="#b8401f" stroke-width="5"/>
      <rect x="620" y="170" width="44" height="100" fill="#8e6cc9" ${S}/>
      <circle cx="642" cy="150" r="14" fill="#fff" opacity=".8"/><circle cx="660" cy="122" r="18" fill="#fff" opacity=".6"/>
      <!-- engrenage enseigne -->
      <g transform="translate(520 250)">
        <circle r="38" fill="#f6c445" ${S}/>
        <g fill="#f6c445" ${S}>
          <rect x="-8" y="-52" width="16" height="16" rx="3"/><rect x="-8" y="36" width="16" height="16" rx="3"/>
          <rect x="-52" y="-8" width="16" height="16" rx="3"/><rect x="36" y="-8" width="16" height="16" rx="3"/>
        </g>
        <circle r="38" fill="#f6c445" stroke="none"/>
        <circle r="14" fill="#fff8ea" ${S}/>
        <text y="6" text-anchor="middle" font-family="Segoe Print, Comic Sans MS" font-size="16" font-weight="700" fill="${INK}">${NIVEAU.classe}</text>
      </g>
      <!-- fenêtres -->
      <g>
        <rect x="360" y="360" width="100" height="90" rx="6" fill="#bfe8ff" ${S}/>
        <path d="M410 360 v90 M360 405 h100" ${S}/>
        <rect x="350" y="450" width="120" height="14" rx="4" fill="#8a5a24" ${S}/>
        <circle cx="375" cy="446" r="9" fill="#ef7fa8" ${S}/><circle cx="410" cy="444" r="9" fill="#f6c445" ${S}/><circle cx="445" cy="446" r="9" fill="#ef7fa8" ${S}/>
        <rect x="580" y="360" width="100" height="90" rx="6" fill="#bfe8ff" ${S}/>
        <path d="M630 360 v90 M580 405 h100" ${S}/>
      </g>
      <!-- porte (cliquable) -->
      <g class="hot" data-id="entrer" data-label="Entrer dans l'atelier" data-desc="Clique sur la porte pour commencer.">
        <rect x="468" y="430" width="104" height="190" rx="50" ry="50" fill="#2e86de" ${S}/>
        <rect x="468" y="520" width="104" height="100" fill="#2e86de" stroke="none"/>
        <path d="M468 480 v140 h104 v-140" fill="none" ${S}/>
        <circle cx="550" cy="540" r="7" fill="#f6c445" ${S}/>
        <rect x="490" y="458" width="60" height="40" rx="18" fill="#bfe8ff" ${S}/>
      </g>
      <!-- boîte aux lettres -->
      <rect x="780" y="520" width="12" height="90" fill="#8a5a24" ${S}/>
      <rect x="752" y="480" width="68" height="46" rx="20" fill="#e4572e" ${S}/>
      <!-- fleurs -->
      <g ${S}>
        <circle cx="250" cy="640" r="10" fill="#ef7fa8"/><circle cx="290" cy="660" r="10" fill="#f6c445"/>
        <circle cx="820" cy="650" r="10" fill="#ef7fa8"/><circle cx="880" cy="630" r="10" fill="#5bc0eb"/>
      </g>
    </svg>`;
  },

  /* ---------------- L'atelier (hub) ---------------- */
  /* piece (facultatif, voir Pieces) : seulement les objets de cette pièce, son décor et ses passages ;
     decors : les décors achetés, dessinés alors sous les objets (le tapis sous le chevalet…) */
  atelier(piece, decors) {
    const sans = NIVEAU.sansObjets || [];
    const attr = (t) => String(t).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
    /* les objets cliquables viennent du moteur, du niveau et des modules (objetAtelier) */
    const objets = ATELIER_OBJETS.filter((o) => !sans.includes(o.id) && (!piece || Pieces.de(o.id, "objets") === piece)).map((o) =>
      `<g class="hot" data-id="${o.id}"${o.transform ? ` transform="${o.transform}"` : ""} data-label="${attr(o.label)}" data-desc="${attr(o.desc)}">${o.svg()}</g>`).join("\n");
    if (!piece) return `<svg class="scene-svg" viewBox="0 0 1024 768">${this.fondAtelier()}
      ${objets}
    </svg>`;
    return `<svg class="scene-svg" viewBox="0 0 1024 768">${piece.fond()}
      ${decors ? `<g class="decors">${decors}</g>` : ""}
      ${(piece.passages || []).map((p) => this.passage(p)).join("")}
      ${objets}
    </svg>`;
  },

  /* le passage vers une autre pièce : une arche qui laisse voir la pièce d'à côté (sa couleur),
     et un panneau en forme de flèche avec son nom. p = { vers, x, sens: "g" | "d" } */
  passage({ vers, x, sens }) {
    const p = (NIVEAU.pieces || []).find((q) => q.id === vers);
    if (!p) return "";
    const fl = sens === "g" ? `M${x - 16} 218 l20 -24 h126 v48 h-126 z` : `M${x + 104} 218 l-20 -24 h-126 v48 h126 z`;
    const arche = `M${x} 540 V300 q0 -54 45 -54 q45 0 45 54 V540`;
    return `<g class="hot passage" data-id="piece-${p.id}" data-label="${p.nom}" data-desc="Pour aller ${p.dans}.">
      <path d="${arche} Z" fill="${p.mur}" ${S} stroke-width="4"/>
      <path d="M${x + 3} 540 V500 h84 V540 Z" fill="${p.sol}"/>
      <path d="M${x + 3} 500 h84" stroke="${INK}" stroke-width="2" opacity=".5"/>
      <path d="${arche}" fill="none" stroke="#7a4a24" stroke-width="10"/>
      <path d="${arche}" fill="none" ${S}/>
      <path d="${fl}" fill="#fff8ea" ${S}/>
      <g transform="translate(${sens === "g" ? x + 8 : x - 36} 206)"><path d="M4 9h4l5-4v14l-5-4H4z" fill="${INK}" ${S} stroke-width="2.4"/><path d="M16.5 8.5a5 5 0 0 1 0 7" fill="none" ${S} stroke-width="2.4"/></g>
      <text x="${sens === "g" ? x + 72 : x + 28}" y="226" text-anchor="middle" font-family="Fredoka, Trebuchet MS, sans-serif" font-size="20" font-weight="700" fill="${INK}">${p.court}</text>
    </g>`;
  },

  /* décor de l'atelier (murs, fenêtre, étagère, bureau, tapis) : un niveau peut le remplacer
     en redéfinissant Art.fondAtelier dans ses propres fichiers */
  fondAtelier() {
    return `
      <defs>
        <pattern id="wp2" width="64" height="64" patternUnits="userSpaceOnUse">
          <rect width="64" height="64" fill="#2f6f73"/>
          <circle cx="16" cy="16" r="3" fill="rgba(255,255,255,.07)"/><circle cx="48" cy="48" r="3" fill="rgba(255,255,255,.07)"/>
        </pattern>
        <pattern id="fl2" width="120" height="40" patternUnits="userSpaceOnUse">
          <rect width="120" height="40" fill="#b9793a"/><path d="M0 39 h120 M60 0 v40" stroke="#8a5a24" stroke-width="3"/>
        </pattern>
        <linearGradient id="wins" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fd0f5"/><stop offset="1" stop-color="#d9f3ff"/></linearGradient>
      </defs>
      <rect width="1024" height="768" fill="url(#wp2)"/>
      <rect y="560" width="1024" height="140" fill="#c98a3c"/>
      <path d="M0 560 h1024" ${S}/>
      <g stroke="#8a5a24" stroke-width="3">${Array.from({ length: 16 }, (_, i) => `<line x1="${i * 64 + 32}" y1="562" x2="${i * 64 + 32}" y2="698"/>`).join("")}</g>
      <rect y="698" width="1024" height="70" fill="url(#fl2)"/>
      <path d="M0 698 h1024" ${S}/>

      <!-- fenêtre -->
      <rect x="40" y="60" width="190" height="200" rx="10" fill="url(#wins)" ${S} stroke-width="5"/>
      <path d="M135 60 v200 M40 160 h190" ${S}/>
      <circle cx="90" cy="105" r="22" fill="#ffd84a"/>
      <path d="M150 220 q20 -40 40 0 z M60 240 q30 -60 60 0z" fill="#6fbf4a" ${S}/>
      <rect x="30" y="258" width="210" height="16" rx="5" fill="#8a5a24" ${S}/>
      <path d="M40 60 q40 70 0 200" fill="#ef7fa8" opacity=".85" ${S}/>
      <path d="M230 60 q-40 70 0 200" fill="#ef7fa8" opacity=".85" ${S}/>

      <!-- étagère -->
      <rect x="290" y="232" width="460" height="18" rx="5" fill="#8a5a24" ${S}/>
      <path d="M310 250 l14 26 M730 250 l-14 26" ${S}/>

      <!-- bureau -->
      <rect x="250" y="500" width="500" height="30" rx="8" fill="#a8672d" ${S}/>
      <rect x="270" y="530" width="460" height="60" fill="#8a5a24" ${S}/>
      <rect x="300" y="540" width="180" height="40" rx="6" fill="#a8672d" ${S}/>
      <rect x="520" y="540" width="180" height="40" rx="6" fill="#a8672d" ${S}/>
      <circle cx="390" cy="560" r="6" fill="#f6c445" ${S}/><circle cx="610" cy="560" r="6" fill="#f6c445" ${S}/>
      <rect x="276" y="590" width="26" height="110" fill="#8a5a24" ${S}/>
      <rect x="698" y="590" width="26" height="110" fill="#8a5a24" ${S}/>

      <!-- tapis -->
      <ellipse cx="520" cy="736" rx="260" ry="26" fill="#e4572e" ${S}/>
      <ellipse cx="520" cy="736" rx="220" ry="16" fill="none" stroke="#f6c445" stroke-width="4"/>`;
  },


  /* ---------------- Horloge ---------------- */
  clockFace(cx, cy, r, hh, mm, opts = {}) {
    const ticks = Array.from({ length: 60 }, (_, i) => {
      const a = (i / 60) * Math.PI * 2, big = i % 5 === 0;
      const r1 = r - (big ? 10 : 5), r2 = r - 3;
      return `<line x1="${cx + r1 * Math.sin(a)}" y1="${cy - r1 * Math.cos(a)}" x2="${cx + r2 * Math.sin(a)}" y2="${cy - r2 * Math.cos(a)}" stroke="${INK}" stroke-width="${big ? 3 : 1.5}"/>`;
    }).join("");
    const nums = opts.numbers === false ? "" : Array.from({ length: 12 }, (_, i) => {
      const n = i + 1, a = (n / 12) * Math.PI * 2, rr = r - 22;
      return `<text x="${cx + rr * Math.sin(a)}" y="${cy - rr * Math.cos(a) + r * 0.09}" text-anchor="middle" font-family="Trebuchet MS" font-weight="700" font-size="${Math.max(9, r * 0.22)}" fill="${INK}">${n}</text>`;
    }).join("");
    const ma = (mm / 60) * Math.PI * 2;
    const ha = (((hh % 12) + mm / 60) / 12) * Math.PI * 2;
    return `<g>
      <circle cx="${cx}" cy="${cy}" r="${r + 8}" fill="${opts.rim || "#e4572e"}" ${S}/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff8ea" ${S}/>
      ${ticks}${nums}
      <line x1="${cx}" y1="${cy}" x2="${cx + r * 0.5 * Math.sin(ha)}" y2="${cy - r * 0.5 * Math.cos(ha)}" stroke="${INK}" stroke-width="${Math.max(4, r * 0.09)}" stroke-linecap="round"/>
      <line x1="${cx}" y1="${cy}" x2="${cx + r * 0.78 * Math.sin(ma)}" y2="${cy - r * 0.78 * Math.cos(ma)}" stroke="#2e86de" stroke-width="${Math.max(3, r * 0.06)}" stroke-linecap="round"/>
      <circle cx="${cx}" cy="${cy}" r="${Math.max(4, r * 0.07)}" fill="${INK}"/>
    </g>`;
  },
  clockSvg(hh, mm, size = 220, opts) {
    const r = size / 2 - 12;
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${this.clockFace(size / 2, size / 2, r, hh, mm, opts)}</svg>`;
  },

  /* ---------------- Figures géométriques ---------------- */
  shape(kind, size = 110, color = "#5bc0eb") {
    const s = size, m = 12;
    const inner = {
      carre: `<rect x="${m}" y="${m}" width="${s - 2 * m}" height="${s - 2 * m}" fill="${color}" ${S}/>`,
      rectangle: `<rect x="${m - 4}" y="${s * 0.25}" width="${s - 2 * m + 8}" height="${s * 0.5}" fill="${color}" ${S}/>`,
      triangle: `<path d="M${s / 2} ${m} L${s - m} ${s - m} L${m} ${s - m} Z" fill="${color}" ${S}/>`,
      cercle: `<circle cx="${s / 2}" cy="${s / 2}" r="${s / 2 - m}" fill="${color}" ${S}/>`,
      losange: `<path d="M${s / 2} ${m} L${s - m} ${s / 2} L${s / 2} ${s - m} L${m} ${s / 2} Z" fill="${color}" ${S}/>`,
      pentagone: `<path d="${[0, 1, 2, 3, 4].map((i) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5; return `${i ? "L" : "M"}${(s / 2 + (s / 2 - m) * Math.cos(a)).toFixed(1)} ${(s / 2 + (s / 2 - m) * Math.sin(a)).toFixed(1)}`; }).join(" ")} Z" fill="${color}" ${S}/>`,
      hexagone: `<path d="${[0, 1, 2, 3, 4, 5].map((i) => { const a = (i * Math.PI) / 3; return `${i ? "L" : "M"}${(s / 2 + (s / 2 - m) * Math.cos(a)).toFixed(1)} ${(s / 2 + (s / 2 - m) * Math.sin(a)).toFixed(1)}`; }).join(" ")} Z" fill="${color}" ${S}/>`,
    }[kind];
    return `<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">${inner}</svg>`;
  },

  /* motif sur quadrillage (pour la symétrie) : cells = [[col,row],...] */
  gridPattern(cells, cols = 6, rows = 5, cell = 22, axis = true, color = "#e4572e") {
    const w = cols * cell, hgt = rows * cell;
    const grid = [];
    for (let c = 0; c <= cols; c++) grid.push(`<line x1="${c * cell}" y1="0" x2="${c * cell}" y2="${hgt}" stroke="#9bb" stroke-width="1"/>`);
    for (let r = 0; r <= rows; r++) grid.push(`<line x1="0" y1="${r * cell}" x2="${w}" y2="${r * cell}" stroke="#9bb" stroke-width="1"/>`);
    const fills = cells.map(([c, r]) => `<rect x="${c * cell}" y="${r * cell}" width="${cell}" height="${cell}" fill="${color}" stroke="${INK}" stroke-width="1.5"/>`).join("");
    const ax = axis ? `<line x1="${w / 2}" y1="-6" x2="${w / 2}" y2="${hgt + 6}" stroke="#2e86de" stroke-width="4" stroke-dasharray="6 4"/>` : "";
    return `<svg width="${w + 12}" height="${hgt + 12}" viewBox="-6 -6 ${w + 12} ${hgt + 12}"><rect width="${w}" height="${hgt}" fill="#fff"/>${grid.join("")}${fills}${ax}</svg>`;
  },
};


/* ---------------- Objets du moteur (présents dans tous les niveaux) ---------------- */
/* jeux : borne d'arcade */
objetAtelier({
  id: "jeux", ecran: "jeux", ordre: 10, label: "La borne de jeux",
  desc: "Des jeux pour te détendre et gagner des récompenses.",
  svg: () => `
        <path d="M40 330 h150 l10 40 v330 h-170 v-330z" fill="#8e6cc9" ${S}/>
        <rect x="55" y="350" width="120" height="96" rx="10" fill="#1b1724" ${S}/>
        <text x="115" y="392" text-anchor="middle" font-family="Consolas, monospace" font-size="20" fill="#7bc950">JEUX</text>
        <text x="115" y="420" text-anchor="middle" font-family="Consolas, monospace" font-size="14" fill="#f6c445">★ ★ ★</text>
        <rect x="45" y="470" width="150" height="40" rx="6" fill="#5a4a6b" ${S}/>
        <circle cx="85" cy="490" r="10" fill="#e4572e" ${S}/><circle cx="125" cy="490" r="8" fill="#f6c445" ${S}/><circle cx="155" cy="490" r="8" fill="#5bc0eb" ${S}/>
        <rect x="70" y="540" width="100" height="120" rx="8" fill="#a68ad6" ${S}/>
        <path d="M95 600 h50" ${S}/>
  `,
});

/* horloge */
objetAtelier({
  id: "horloge", ecran: "horloge", ordre: 20, label: "L'horloge",
  desc: "Apprends à lire l'heure.",
  svg: () => `
        ${Art.clockFace(512, 112, 58, 10, 10)}
  `,
});

/* radio */
objetAtelier({
  id: "radio", ecran: "radio", ordre: 30, label: "La radio",
  desc: "Écoute des musiques et des bruitages.",
  svg: () => `
        <line x1="320" y1="176" x2="300" y2="140" ${S}/><circle cx="300" cy="138" r="5" fill="#e4572e" ${S}/>
        <rect x="300" y="174" width="110" height="58" rx="14" fill="#e4572e" ${S}/>
        <circle cx="330" cy="203" r="17" fill="#fff8ea" ${S}/>
        <circle cx="330" cy="203" r="7" fill="#2b2236"/>
        <rect x="356" y="186" width="44" height="14" rx="4" fill="#f6c445" ${S}/>
        <circle cx="366" cy="217" r="5" fill="#fff" ${S}/><circle cx="388" cy="217" r="5" fill="#fff" ${S}/>
  `,
});

/* conjugueur : livres */
objetAtelier({
  id: "conjugueur", ecran: "conjugueur", ordre: 40, label: "Le livre des verbes",
  desc: "Le conjugueur : tous les verbes du " + NIVEAU.classe + ".",
  svg: () => `
        <rect x="428" y="150" width="26" height="82" rx="3" fill="#2e86de" ${S}/>
        <rect x="456" y="140" width="30" height="92" rx="3" fill="#7bc950" ${S}/>
        <rect x="488" y="160" width="24" height="72" rx="3" fill="#f6c445" ${S}/>
        <path d="M514 232 l14 -84 l26 4 l-14 84z" fill="#e4572e" ${S}/>
        <path d="M462 160 h18 M462 168 h18" ${S} stroke-width="2"/>
        <text x="471" y="215" text-anchor="middle" font-family="Segoe Print, Comic Sans MS" font-size="14" font-weight="700" fill="${INK}">ABC</text>
  `,
});

/* trophée : défi */
objetAtelier({
  id: "defi", ecran: "defi", ordre: 50, label: "Le défi de Zigzag",
  desc: "Affronte Zigzag le renard sur un chapitre !",
  svg: () => `
        <path d="M572 152 h56 v18 q0 40 -28 44 q-28 -4 -28 -44z" fill="#f6c445" ${S}/>
        <path d="M572 160 q-22 0 -18 18 q4 14 22 14" fill="none" ${S}/>
        <path d="M628 160 q22 0 18 18 q-4 14 -22 14" fill="none" ${S}/>
        <rect x="592" y="212" width="16" height="8" fill="#f6c445" ${S}/>
        <rect x="580" y="218" width="40" height="14" rx="3" fill="#8a5a24" ${S}/>
        <text x="600" y="186" text-anchor="middle" font-size="20" font-weight="700" fill="${INK}">★</text>
  `,
});

/* chevalet : peinture */
objetAtelier({
  id: "peinture", ecran: "peinture", ordre: 70, label: "Le chevalet",
  desc: "Dessine et peins ce que tu veux.",
  svg: () => `
        <path d="M810 300 l-40 400 M870 300 l40 400 M840 290 v410" ${S} stroke-width="7" stroke="#8a5a24"/>
        <path d="M810 300 l-40 400 M870 300 l40 400 M840 290 v410" fill="none" ${S}/>
        <rect x="770" y="330" width="140" height="170" rx="6" fill="#fff" ${S}/>
        <path d="M790 470 q30 -80 60 -40 q20 -40 44 10" fill="none" stroke="#e4572e" stroke-width="6" stroke-linecap="round"/>
        <circle cx="880" cy="365" r="16" fill="#f6c445"/>
        <path d="M790 420 l30 -30" stroke="#2e86de" stroke-width="8" stroke-linecap="round"/>
        <rect x="760" y="500" width="160" height="14" rx="4" fill="#8a5a24" ${S}/>
  `,
});

/* porte : sortie */
objetAtelier({
  id: "sortie", ecran: null, ordre: 80, label: "La porte",
  desc: "Sortir voir ta maison. Pour changer d'élève, rentre par la porte.",
  svg: () => `
        <rect x="930" y="250" width="94" height="450" fill="#6b4a2a" ${S}/>
        <rect x="944" y="270" width="80" height="420" rx="6" fill="#2e86de" ${S}/>
        <circle cx="962" cy="480" r="9" fill="#f6c445" ${S}/>
        <rect x="960" y="300" width="50" height="70" rx="6" fill="#4a9be6" ${S}/>
        <rect x="960" y="390" width="50" height="60" rx="6" fill="#4a9be6" ${S}/>
  `,
});

/* lampe : aide */
objetAtelier({
  id: "aide", ecran: null, ordre: 90, label: "La lampe",
  desc: "Allume-la pour voir ce que fait chaque objet.",
  svg: () => `
        <ellipse cx="300" cy="498" rx="30" ry="8" fill="#5a4a6b" ${S}/>
        <path d="M300 494 l20 -60 l-30 -40" fill="none" ${S} stroke-width="6"/>
        <path d="M300 494 l20 -60 l-30 -40" fill="none" stroke="#8e6cc9" stroke-width="3"/>
        <path d="M262 384 l44 -28 l18 34 z" fill="#f6c445" ${S}/>
        <ellipse class="lamp-light" cx="300" cy="404" rx="12" ry="6" fill="#fff6c2" opacity=".8"/>
  `,
});

/* micro : magnétophone */
objetAtelier({
  id: "magneto", ecran: "magneto", ordre: 100, label: "Le micro",
  desc: "Enregistre ta voix et réécoute-toi.",
  svg: () => `
        <rect x="346" y="490" width="44" height="10" rx="4" fill="#5a4a6b" ${S}/>
        <line x1="368" y1="490" x2="368" y2="462" ${S}/>
        <rect x="354" y="420" width="28" height="44" rx="14" fill="#c9c3d6" ${S}/>
        <path d="M358 432 h20 M358 442 h20 M358 452 h20" stroke="${INK}" stroke-width="2"/>
  `,
});

/* cahier : entraînement */
objetAtelier({
  id: "entrainement", ecran: "sommaire", ordre: 110, label: "Le cahier d'exercices",
  desc: "Leçons et exercices de français et de maths.",
  svg: () => `
        <path d="M400 498 l10 -40 h70 l6 40z" fill="#fff8ea" ${S}/>
        <path d="M486 498 l6 -40 h70 l10 40z" fill="#fff8ea" ${S}/>
        <path d="M486 458 v40" ${S}/>
        <g stroke="#5bc0eb" stroke-width="2"><line x1="414" y1="470" x2="476" y2="470"/><line x1="412" y1="480" x2="478" y2="480"/><line x1="410" y1="490" x2="480" y2="490"/>
        <line x1="496" y1="470" x2="558" y2="470"/><line x1="496" y1="480" x2="561" y2="480"/></g>
        <path d="M520 492 l20 -6" stroke="#e4572e" stroke-width="3"/>
        <path d="M548 470 l40 -30 l6 8 l-40 30z" fill="#f6c445" ${S}/>
  `,
});

/* boussole : test de niveau */
objetAtelier({
  id: "orient", ecran: "orient", ordre: 120, label: "La boussole",
  desc: "Le test de niveau : je te conseille des leçons.",
  svg: () => `
        <circle cx="610" cy="482" r="20" fill="#f6c445" ${S}/>
        <circle cx="610" cy="482" r="13" fill="#fff8ea" ${S} stroke-width="2"/>
        <path d="M610 470 l4 12 l-4 12 l-4 -12z" fill="#e4572e" stroke="${INK}" stroke-width="1.5"/>
  `,
});

/* calculatrice */
objetAtelier({
  id: "calculatrice", ecran: "calculatrice", ordre: 130, label: "La calculatrice",
  desc: "Pour vérifier tes calculs.",
  svg: () => `
        <rect x="640" y="452" width="46" height="48" rx="8" fill="#3d3550" ${S}/>
        <rect x="646" y="458" width="34" height="12" rx="3" fill="#b9d8a8"/>
        <g fill="#fff8ea">${[0, 1, 2].map((r) => [0, 1, 2].map((c) => `<rect x="${648 + c * 11}" y="${474 + r * 8}" width="8" height="6" rx="2"/>`).join("")).join("")}</g>
  `,
});

/* carnet de notes */
objetAtelier({
  id: "carnet", ecran: "carnet", ordre: 140, label: "Le carnet de notes",
  desc: "Tous tes résultats, leçon par leçon.",
  svg: () => `
        <rect x="698" y="456" width="44" height="44" rx="5" fill="#e4572e" ${S}/>
        <rect x="704" y="464" width="32" height="12" rx="3" fill="#fff8ea" ${S} stroke-width="2"/>
        <path d="M698 462 h-6 M698 474 h-6 M698 486 h-6" ${S} stroke-width="2"/>
        <text x="720" y="495" text-anchor="middle" font-size="14" font-weight="700" fill="#fff8ea">A+</text>
  `,
});

/* coffre aux trésors : l'aventure */
objetAtelier({
  id: "coffre", ecran: "aventure", ordre: 170, label: "Le coffre aux trésors",
  desc: "Tes écrous, ton rang, tes médailles, et la boutique pour décorer l'atelier et habiller Boulon.",
  svg: () => `
        <rect x="62" y="712" width="128" height="50" rx="6" fill="#a8672d" ${S}/>
        <path d="M62 714 q0 -36 64 -36 q64 0 64 36 z" fill="#c98a3c" ${S}/>
        <path d="M84 680 v80 M168 680 v80" stroke="#f6c445" stroke-width="7"/>
        <path d="M84 680 v80 M168 680 v80" fill="none" ${S} stroke-width="1.5"/>
        <rect x="114" y="704" width="24" height="22" rx="4" fill="#f6c445" ${S}/>
        <circle cx="126" cy="714" r="3" fill="${INK}"/>
  `,
});
