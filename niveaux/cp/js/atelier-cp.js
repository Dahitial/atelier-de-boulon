/* L'Atelier de Boulon — CP : l'atelier de la direction A (« le petit atelier »), en trois pièces.
   La véranda (jardin, dessin, couleurs, porte du dehors), la classe (Lire, Dictée, Compter, Le monde)
   et la salle de jeux (borne, défi de Zigzag, trésors). Chaque gros objet a son étiquette parlante. */
"use strict";

/* ---------------- Les trois pièces : la véranda, la classe, la salle de jeux ----------------
   (moteur : Pieces dans art.js). On arrive dans la classe ; les passages et le petit plan
   en haut de l'écran mènent aux autres pièces. */
const plancherCP = (couleur, lignes) => `<rect x="0" y="540" width="1024" height="228" fill="${couleur}"/>
  <path d="M0 540 H1024" stroke="${INK}" stroke-width="4"/>
  <g stroke="${lignes}" stroke-width="3">${[128, 320, 512, 704, 896].map((x) => `<line x1="${x}" y1="544" x2="${x}" y2="768"/>`).join("")}</g>`;

/* la classe : le mur bleu-vert, des fanions, l'étagère des trois livres */
Art.fondAtelier = () => `
  <rect width="1024" height="768" fill="#3d8b86"/>
  <g fill="#ffffff" opacity="0.08"><circle cx="620" cy="130" r="5"/><circle cx="180" cy="430" r="5"/><circle cx="860" cy="460" r="5"/></g>
  <path d="M300 96 Q512 130 740 96" fill="none" stroke="${INK}" stroke-width="3"/>
  <g stroke="${INK}" stroke-width="3" stroke-linejoin="round">
    <path d="M360 104 l34 3 l-19 30z" fill="#7bc950"/><path d="M450 113 l34 1 l-18 30z" fill="#5bc0eb"/>
    <path d="M546 114 l34 -1 l-16 30z" fill="#ef7fa8"/><path d="M640 108 l34 -4 l-15 30z" fill="#f6c445"/>
  </g>
  ${plancherCP("#d99a4e", "#b47a35")}
  <rect x="120" y="318" width="784" height="20" rx="8" fill="#a86a2c" ${S}/>
  <path d="M160 338 l16 26 M864 338 l-16 26" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;

/* la salle de jeux : un mur bleu nuit étoilé */
const fondJeux = () => `
  <rect width="1024" height="768" fill="#34507f"/>
  <g fill="#fff8ea" opacity=".5"><circle cx="330" cy="150" r="2.5"/><circle cx="600" cy="120" r="2"/><circle cx="760" cy="200" r="3"/><circle cx="880" cy="140" r="2"/><circle cx="460" cy="260" r="2"/><circle cx="940" cy="300" r="2.5"/><circle cx="560" cy="330" r="2"/></g>
  ${plancherCP("#c98a4e", "#a86a35")}`;

/* la véranda : un mur vert d'eau et une grande fenêtre au soleil (un oranger dehors) */
const fondVeranda = () => `
  <rect width="1024" height="768" fill="#7cc7a0"/>
  <g stroke="#6ab48e" stroke-width="3" opacity=".7"><path d="M0 150 H1024 M0 250 H1024 M0 350 H1024 M0 450 H1024"/></g>
  ${plancherCP("#e8c48a", "#c9a46a")}
  <rect x="236" y="62" width="428" height="236" rx="10" fill="#a86a2c" ${S} stroke-width="4"/>
  <rect x="252" y="78" width="396" height="204" fill="#bfe6f7"/>
  <circle cx="590" cy="122" r="26" fill="#f6c445" ${S}/>
  <path d="M252 250 q90 -60 180 -10 q100 -50 216 4 V282 H252 Z" fill="#9bd36a" ${S}/>
  <g ${S}><rect x="580" y="218" width="10" height="30" fill="#8a5a24"/><circle cx="585" cy="206" r="22" fill="#4f9e3a"/>
    <circle cx="576" cy="200" r="4" fill="#f08a3c" stroke-width="1.5"/><circle cx="594" cy="212" r="4" fill="#f08a3c" stroke-width="1.5"/><circle cx="582" cy="216" r="4" fill="#f08a3c" stroke-width="1.5"/></g>
  <path d="M450 78 V282 M252 180 H648" stroke="#a86a2c" stroke-width="10"/>
  <path d="M450 78 V282 M252 180 H648" stroke="${INK}" stroke-width="2" opacity=".6"/>
  <rect x="224" y="290" width="452" height="18" rx="6" fill="#c98a3c" ${S}/>`;

NIVEAU.pieceDepart = "classe";
NIVEAU.pieces = [
  { id: "veranda", nom: "La véranda", court: "Véranda", dans: "dans la véranda", mur: "#7cc7a0", sol: "#e8c48a", fond: fondVeranda,
    entree: "La véranda : le jardin, le dessin, les couleurs !",
    objets: ["sortie", "peinture", "cadre"], decors: ["pot", "cactus", "plante", "tapis"],
    passages: [{ vers: "classe", x: 920, sens: "d" }] },
  { id: "classe", nom: "La classe", court: "Classe", dans: "dans la classe", mur: "#3d8b86", sol: "#d99a4e", fond: () => Art.fondAtelier(),
    entree: "La classe : on lit, on écrit, on compte !",
    objets: ["lire", "dictee", "compter", "monde", "sciences", "temps"], decors: ["tableau"],
    passages: [{ vers: "veranda", x: 14, sens: "g" }, { vers: "jeux", x: 920, sens: "d" }] },
  { id: "jeux", nom: "La salle de jeux", court: "Jeux", dans: "dans la salle de jeux", mur: "#34507f", sol: "#c98a4e", fond: fondJeux,
    entree: "La salle de jeux ! On joue, et on bat Zigzag ?",
    objets: ["jeux", "defi", "coffre"], decors: ["guirlande", "affiche", "chat"],
    passages: [{ vers: "classe", x: 14, sens: "g" }] },
];

/* ---------------- La classe : Lire, Dictée, Compter, Le monde ---------------- */
objetAtelier({
  id: "lire", ecran: "sommaire", params: { subject: "lire" }, ordre: 200, label: "Lire",
  desc: "Le livre de lecture : tu apprends les sons, les lettres, et à lire des mots.",
  etiquette: { x: 172, y: 350, w: 156, texte: "Lire", couleur: "#e4572e" },
  svg: () => `
    <g stroke="${INK}" stroke-width="3" stroke-linejoin="round">
      <path d="M150 314 L150 186 Q200 168 250 186 L250 314 Q200 298 150 314 Z" fill="#fff8ea"/>
      <path d="M350 314 L350 186 Q300 168 250 186 L250 314 Q300 298 350 314 Z" fill="#fff8ea"/>
      <path d="M144 318 L144 192 L150 186 L150 314 Q200 298 250 314 Q300 298 350 314 L350 186 L356 192 L356 318 Q300 304 250 320 Q200 304 144 318 Z" fill="#e4572e"/>
    </g>
    <text x="200" y="272" text-anchor="middle" font-family="Andika, Trebuchet MS, sans-serif" font-size="72" font-weight="700" fill="#e4572e">a</text>
    <text x="300" y="272" text-anchor="middle" font-family="Andika, Trebuchet MS, sans-serif" font-size="72" font-weight="700" fill="#2e86de">b</text>`,
});

objetAtelier({
  id: "dictee", ecran: "sommaire", params: { subject: "dictee" }, ordre: 210, label: "La dictée",
  desc: "L'ardoise : je te dis un son ou un mot, et tu l'écris avec des étiquettes.",
  etiquette: { x: 424, y: 350, w: 176, texte: "Dictée", couleur: "#8e6cc9" },
  svg: () => `
    <g stroke="${INK}" stroke-width="3" stroke-linejoin="round">
      <rect x="424" y="170" width="176" height="144" rx="12" fill="#a86a2c"/>
      <rect x="438" y="184" width="148" height="116" rx="6" fill="#2f5a46"/>
    </g>
    <text x="512" y="268" text-anchor="middle" font-family="Andika, Trebuchet MS, sans-serif" font-size="64" font-weight="700" fill="#fff8ea">ma</text>
    <rect x="556" y="296" width="30" height="10" rx="4" fill="#fff8ea" stroke="${INK}" stroke-width="2"/>`,
});

objetAtelier({
  id: "compter", ecran: "sommaire", params: { subject: "math" }, ordre: 220, label: "Compter",
  desc: "Le boulier : tu comptes, tu ajoutes, et tu apprends les nombres.",
  etiquette: { x: 690, y: 350, w: 180, texte: "Compter", couleur: "#2e86de" },
  svg: () => `
    <rect x="684" y="170" width="192" height="152" fill="transparent"/>
    <rect x="690" y="176" width="180" height="140" rx="10" fill="none" stroke="${INK}" stroke-width="8"/>
    <rect x="690" y="176" width="180" height="140" rx="10" fill="none" stroke="#a86a2c" stroke-width="4"/>
    <g stroke="${INK}" stroke-width="3">
      <line x1="696" y1="212" x2="864" y2="212"/><line x1="696" y1="246" x2="864" y2="246"/><line x1="696" y1="280" x2="864" y2="280"/>
      <circle cx="716" cy="212" r="13" fill="#e4572e"/><circle cx="742" cy="212" r="13" fill="#e4572e"/><circle cx="768" cy="212" r="13" fill="#e4572e"/>
      <circle cx="716" cy="246" r="13" fill="#f6c445"/><circle cx="742" cy="246" r="13" fill="#f6c445"/><circle cx="840" cy="246" r="13" fill="#f6c445"/>
      <circle cx="716" cy="280" r="13" fill="#5bc0eb"/><circle cx="814" cy="280" r="13" fill="#5bc0eb"/><circle cx="840" cy="280" r="13" fill="#5bc0eb"/>
    </g>`,
});

/* le tabouret en bois de la classe : le globe, les sciences et le sablier ont chacun le leur
   (cx : milieu ; le plateau est à y = 532, les pieds touchent le sol à y = 586) */
const tabouretClasse = (cx) => `<g stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
    <rect x="${cx - 67}" y="532" width="134" height="14" rx="5" fill="#a86a2c"/>
    <path d="M${cx - 53} 546 l-6 40 M${cx + 53} 546 l6 40" stroke-width="5"/></g>`;

objetAtelier({
  id: "monde", ecran: "sommaire", params: { subject: "monde" }, ordre: 230, label: "Le monde",
  desc: "Le globe : tu apprends à te repérer, et tu découvres les paysages du Maroc.",
  etiquette: { x: 250, y: 600, w: 180, texte: "Le monde", couleur: "#3fa34d" },
  svg: () => `${tabouretClasse(330)}
    <g transform="translate(330 532) scale(0.74) translate(-250 -584)" stroke="${INK}" stroke-width="3" stroke-linejoin="round">
      <path d="M220 584 h60 l-8 -24 h-44 z" fill="#a86a2c"/>
      <line x1="250" y1="560" x2="250" y2="536"/>
      <path d="M196 476 a58 58 0 1 0 108 0" fill="none" stroke="#a86a2c" stroke-width="8"/>
      <circle cx="250" cy="480" r="52" fill="#5bc0eb"/>
      <path d="M214 462 q18 -20 38 -8 q6 20 -14 28 q-8 18 -26 6z" fill="#7bc950"/>
      <path d="M262 470 q20 -8 30 10 q-2 26 -22 34 q-12 -18 -8 -44z" fill="#7bc950"/>
    </g>`,
});

/* Sciences : le tabouret du petit savant, avec la fiole et l'aimant (maquette validée) */
objetAtelier({
  id: "sciences", ecran: "sommaire", params: { subject: "sciences" }, ordre: 232, label: "Sciences",
  desc: "Le tabouret du savant : le corps, les animaux, les plantes, l'aimant et l'eau.",
  etiquette: { x: 474, y: 600, w: 150, texte: "Sciences", couleur: "#d4691e" },
  svg: () => `<g transform="translate(354 -10)">
    <g stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
      <rect x="132" y="542" width="134" height="14" rx="5" fill="#a86a2c"/>
      <path d="M146 556 l-6 40 M252 556 l6 40" stroke-width="5"/>
      <path d="M166 450 h28 v26 l22 52 q4 12 -10 12 h-52 q-14 0 -10 -12 l22 -52 z" fill="#e8f6ff"/>
      <path d="M152 512 h56 l6 14 q4 12 -10 12 h-48 q-14 0 -10 -12 z" fill="#7bc950"/>
      <rect x="162" y="440" width="36" height="12" rx="4" fill="#9aa4b5"/>
      <circle cx="172" cy="498" r="4" fill="#ffffff" stroke-width="2"/><circle cx="186" cy="488" r="3" fill="#ffffff" stroke-width="2"/>
      <path d="M222 540 v-34 a20 20 0 0 1 40 0 v34 h-12 v-34 a8 8 0 0 0 -16 0 v34 z" fill="#e4572e"/>
      <rect x="222" y="528" width="12" height="12" fill="#e8e3f0"/><rect x="250" y="528" width="12" height="12" fill="#e8e3f0"/>
    </g></g>`,
});

/* Le temps : le petit sablier en bois noir et sable orange, sur son tabouret (le module des inventions lui
   ajoute le choix « Le temps qui passe » / « Les inventions » : modules/inventions/js/inventions.js) */
objetAtelier({
  id: "temps", ecran: "sommaire", params: { subject: "temps" }, ordre: 234, label: "Le temps",
  desc: "Le sablier : la journée, la semaine, les saisons, et les inventions d'autrefois.",
  etiquette: { x: 684, y: 600, w: 150, texte: "Le temps", couleur: "#2e6fd6" },
  svg: () => `${tabouretClasse(740)}
    <g transform="translate(740 532) scale(0.66) translate(-346 -594)">
    <g stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
      <rect x="296" y="430" width="100" height="16" rx="5" fill="${SABLIER_BOIS}"/>
      <rect x="296" y="578" width="100" height="16" rx="5" fill="${SABLIER_BOIS}"/>
      <path d="M302 435 h88 M302 583 h88" stroke="${SABLIER_REFLET}" stroke-width="2.5"/>
      <path d="M306 446 v132 M386 446 v132" stroke-width="7"/><path d="M306 446 v132 M386 446 v132" stroke="${SABLIER_REFLET}" stroke-width="3"/>
      <path d="M318 446 h56 q0 50 -28 66 q28 16 28 66 h-56 q0 -50 28 -66 q-28 -16 -28 -66 z" fill="#e8f6ff"/>
      <path d="M327 460 h38 q-4 30 -19 42 q-15 -12 -19 -42 z" fill="${SABLIER_SABLE}" stroke="none"/>
      <path d="M333 464 h14 q-2 14 -8 20 q-5 -8 -6 -20 z" fill="${SABLIER_BRILLE}" stroke="none"/>
      <path d="M346 512 v52" stroke="${SABLIER_SABLE}" stroke-width="3"/>
      <path d="M322 577 q24 -38 48 0 z" fill="${SABLIER_SABLE}" stroke="none"/>
      <path d="M336 570 q8 -16 16 -18" stroke="${SABLIER_BRILLE}" stroke-width="3" fill="none"/>
      <path d="M362 452 v18 M366 456 v8" stroke="#ffffff" stroke-width="3"/>
    </g></g>`,
});

/* ---------------- La salle de jeux : la borne, le trophée, le coffre ---------------- */
/* (dans le dessin, un groupe à part porte l'agrandissement : .hot a son propre transform-origin) */
objetAtelier({
  id: "jeux", ecran: "jeux", ordre: 240, label: "Les jeux",
  desc: "La borne : des jeux pour t'amuser, et l'atelier de construction.",
  etiquette: { x: 246, y: 600, w: 140, texte: "Jeux", couleur: "#8e6cc9" },
  svg: () => `
    <g transform="translate(-344.6 -195.2) scale(1.3)" stroke="${INK}" stroke-width="3" stroke-linejoin="round">
      <path d="M452 404 h112 l10 30 v162 h-132 v-162z" fill="#8e6cc9"/>
      <rect x="464" y="420" width="88" height="70" rx="10" fill="#1b1724"/>
      <circle cx="490" cy="455" r="10" fill="#f6c445"/><circle cx="526" cy="455" r="10" fill="#7bc950"/>
      <rect x="450" y="506" width="116" height="30" rx="6" fill="#5a4a6b"/>
      <circle cx="480" cy="521" r="9" fill="#e4572e"/><circle cx="512" cy="521" r="7" fill="#f6c445"/><circle cx="538" cy="521" r="7" fill="#5bc0eb"/>
    </g>`,
});

objetAtelier({
  id: "coffre", ecran: "aventure", ordre: 250, label: "Le coffre aux trésors",
  desc: "Le coffre aux trésors : tes écrous, tes médailles, et la boutique pour acheter des objets.",
  etiquette: { x: 660, y: 600, w: 166, texte: "Trésors", couleur: "#b07a10" },
  svg: () => `<g transform="translate(-145.1 -99.8) scale(1.15)">
    <g stroke="${INK}" stroke-width="3" stroke-linejoin="round">
      <rect x="704" y="500" width="140" height="90" rx="8" fill="#a8672d"/>
      <path d="M704 504 q0 -46 70 -46 q70 0 70 46 z" fill="#c98a3c"/>
      <path d="M728 462 v126 M820 462 v126" stroke="#f6c445" stroke-width="9"/>
      <path d="M728 462 v126 M820 462 v126" fill="none" stroke-width="1.5"/>
      <rect x="760" y="494" width="28" height="26" rx="5" fill="#f6c445"/>
      <circle cx="774" cy="506" r="4" fill="${INK}"/>
    </g>
    <g fill="#f6c445" stroke="${INK}" stroke-width="2"><path d="M690 470 l5 10 l11 2 l-8 8 l2 11 l-10 -5 l-10 5 l2 -11 l-8 -8 l11 -2 z"/><path d="M858 452 l4 8 l9 1 l-7 6 l2 9 l-8 -4 l-8 4 l2 -9 l-7 -6 l9 -1 z"/></g></g>`,
});

/* le défi de Zigzag : le trophée, sur un socle entre la borne et le coffre */
objetAtelier({
  id: "defi", ecran: "defi", ordre: 245, label: "Le défi de Zigzag",
  desc: "Le trophée : joue contre Zigzag le renard. Si tu gagnes, tu ouvres des jeux de construction.",
  etiquette: { x: 450, y: 600, w: 124, texte: "Défi", couleur: "#f08a3c" },
  svg: () => `
    <g ${S}><rect x="438" y="468" width="140" height="114" rx="8" fill="#e9875a"/><rect x="428" y="458" width="160" height="18" rx="6" fill="#f3a67a"/></g>
    <path d="M458 500 h100 M458 530 h100" stroke="${INK}" stroke-width="2" opacity=".4"/>
    <g transform="translate(-434.5 -424) scale(1.5)" stroke="${INK}" stroke-width="3" stroke-linejoin="round">
      <path d="M604 512 h52 v20 q0 38 -26 42 q-26 -4 -26 -42 z" fill="#f6c445"/>
      <path d="M604 522 q-22 0 -18 18 q4 14 20 14 M656 522 q22 0 18 18 q-4 14 -20 14" fill="none"/>
      <rect x="623" y="574" width="14" height="10" fill="#f6c445"/>
      <rect x="608" y="582" width="44" height="14" rx="4" fill="#8a5a24"/>
      <path d="M620 532 l10 -10 l10 10 l-3 14 h-14 z" fill="#f08a3c" stroke-width="2"/>
      <circle cx="626" cy="534" r="2" fill="${INK}" stroke="none"/><circle cx="634" cy="534" r="2" fill="${INK}" stroke="none"/>
    </g>`,
});

/* ---------------- La véranda : le chevalet, la porte du dehors (et le pot, le tapis : des décors) ---------------- */
objetAtelier({
  id: "peinture", ecran: "peinture", ordre: 248, label: "Le chevalet",
  desc: "Le chevalet : dessine, colorie, et garde tes plus beaux dessins.",
  etiquette: { x: 616, y: 606, w: 140, texte: "Dessin", couleur: "#e4572e" },
  svg: () => `<g transform="translate(-884 -828) scale(2)">
    <g stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
      <path d="M738 714 l26 -64 M802 714 l-26 -64 M770 648 v66" stroke="#a86a2c" stroke-width="6"/>
      <rect x="726" y="652" width="88" height="46" rx="3" fill="#fff"/>
      <path d="M736 686 q12 -26 26 -8 q14 16 28 -12" fill="none" stroke="#e4572e" stroke-width="5"/>
      <circle cx="800" cy="664" r="7" fill="#f6c445" stroke-width="2"/>
      <path d="M738 670 l12 -10" stroke="#2e86de" stroke-width="5"/>
      <rect x="722" y="698" width="96" height="8" rx="3" fill="#a86a2c"/>
    </g></g>`,
});

{
  const porte = ATELIER_OBJETS.find((o) => o.id === "sortie");
  if (porte) {
    const dessin = porte.svg;
    porte.svg = () => `<g transform="translate(1024 0) scale(-1 1)">${dessin()}</g>`;
    porte.etiquette = { x: 4, y: 192, w: 120, texte: "Dehors", couleur: "#2e86de" };
    porte.desc = "La porte : tu sors voir ta maison. Pour changer d'enfant, on passe aussi par là.";
  }
}

/* ---------------- Les décors de la boutique, chacun dans sa pièce ---------------- */
/* (dessinés pour l'atelier du CE2 : on les déplace ici ; la pièce de chacun est dans NIVEAU.pieces) */
Object.assign(PLACE_DECORS, {
  tableau: "translate(130 -52) scale(.5)",                  // classe : en haut à gauche, au-dessus du livre
  guirlande: "translate(0 70)",                             // salle de jeux : en travers du mur
  affiche: "translate(-620 60)",                            // salle de jeux : à côté du passage
  chat: "translate(28 -174)",                               // salle de jeux : Rivet, à droite du coffre (son atelier : modules/robotique)
  pot: "translate(215.4 -142.8) scale(1.7)",                // véranda : en grand, au soleil sur le rebord
  cactus: "translate(70 -45) scale(1.3)",                   // véranda : sur le rebord, à gauche
  plante: "translate(612 -100)",                            // véranda : dans le coin, à droite
  tapis: "translate(610 594) scale(.6) translate(-520 -736)",    // véranda : au pied du chevalet
});
/* ce que Boulon dit des décors quand la lampe est allumée */
const DESC_DECORS_CP = {
  pot: "Le pot de fleurs : ton petit jardin. Arrose ta plante chaque jour pour qu'elle pousse.",
  tapis: "Le tapis arc-en-ciel : mélange deux couleurs pour en trouver une nouvelle.",
  tableau: "Le tableau noir : une question par jour, pour gagner des écrous.",
  guirlande: "La guirlande : c'est la fête ! Je te raconte une fête du Maroc.",
  affiche: "L'affiche de fusée : je te pose une question sur l'espace.",
  cactus: "Le cactus : je te pose une question sur le désert.",
  plante: "La grande plante : découvre comment vit une plante.",
};
for (const [id, desc] of Object.entries(DESC_DECORS_CP)) if (DECORS_ACTIFS[id]) DECORS_ACTIFS[id].desc = desc;

/* le pot (Mon petit jardin) et le tapis (l'atelier des couleurs) ont leur étiquette, comme les objets */
Object.assign(ETIQUETTES_DECORS, {
  pot: { x: 385, y: 318, w: 130, texte: "Jardin", couleur: "#3fa34d" },
  tapis: { x: 380, y: 606, w: 150, texte: "Couleurs", couleur: "#8e6cc9" },
  chat: { x: 846, y: 600, w: 130, texte: "Rivet", couleur: "#5d7391" },
});

/* les leçons « Les plantes » débloquent des graines du jardin (moteur/js/jardin.js) */
Object.assign(JARDIN_DEBLOCAGES, { tournesol: "w3-1", tomate: "w3-2", rosier: "w3-3", oranger: "w3-3" });

/* ---------------- Les médailles du CP ---------------- */
/* pas de boussole au CP */
retirerMedailles(["boussole"]);
const leconsDe = (sujet) => (CONTENT[sujet] ? CONTENT[sujet].chapters.flatMap((c) => c.lessons.map((l) => l.id)) : []);
const nbTroisEtoiles = (u, sujet) => leconsDe(sujet).filter((id) => u.lessons[id] && u.lessons[id].best >= 16).length;
const toutTravaille = (u, sujet) => leconsDe(sujet).length > 0 && leconsDe(sujet).every((id) => u.lessons[id]);
ajouterMedailles([
  { id: "oreille-fine", icone: "👂", nom: "Oreille fine", desc: "Obtiens 3 étoiles à 3 leçons de Lire.", ok: (u) => nbTroisEtoiles(u, "lire") >= 3 },
  { id: "petit-lecteur", icone: "📖", nom: "Petit lecteur", desc: "Travaille toutes les leçons de Lire.", ok: (u) => toutTravaille(u, "lire") },
  { id: "as-dictee", icone: "✏️", nom: "As de la dictée", desc: "Obtiens 3 étoiles à une dictée.", ok: (u) => nbTroisEtoiles(u, "dictee") >= 1 },
  { id: "as-calcul", icone: "🔢", nom: "As du calcul", desc: "Obtiens 3 étoiles à toutes les leçons de Compter.", ok: (u) => leconsDe("math").length > 0 && nbTroisEtoiles(u, "math") === leconsDe("math").length },
  { id: "petit-savant", icone: "🔬", nom: "Petit savant", desc: "Travaille toutes les leçons de Sciences.", ok: (u) => toutTravaille(u, "sciences") },
], { avant: "regulier" });
