/* L'Atelier de Boulon — CP : matières et leçons (phase 2, étape 6 et phase 3 : la période 1 en français et en maths).
   Six matières : Lire, Dictée, Compter, Sciences (le tabouret du labo), Le temps (le sablier) et
   Le monde (le globe : l'espace et les paysages). Les exercices utilisent les images de
   moteur/js/pictos.js et les types de moteur/js/exercices-images.js (écoute, position du son,
   syllabes, dictée en étiquettes, compter, tri). La période 1 complète arrive en phase 3. */
"use strict";

const CP = {
  un: (t) => t[Math.floor(Math.random() * t.length)],
  plusieurs: (t, n) => shuffle(t.slice()).slice(0, n),
  entre: (a, b) => a + Math.floor(Math.random() * (b - a + 1)),
  /* série de n questions produites par un générateur */
  serie: (gen, n = 8) => () => Array.from({ length: n }, gen),
};

/* une carte image pour les choix : l'image, et son nom dit au survol */
const carte = (nom, taille = 160) => ({ svg: picto(nom, taille), img: true, cls: "carte", dire: motDe(nom), aria: motDe(nom) });

/* un groupe de n images dans un seul dessin (pour comparer des quantités) */
function groupeSvg(nom, n, cote = 44) {
  const col = Math.min(4, n), lig = Math.ceil(n / 4);
  const g = Array.from({ length: n }, (_, i) =>
    `<g transform="translate(${(i % 4) * cote} ${Math.floor(i / 4) * cote}) scale(${cote / 100})">${PICTOS[nom]}</g>`).join("");
  return `<svg width="${col * cote}" height="${lig * cote}" viewBox="0 0 ${col * cote} ${lig * cote}" aria-hidden="true">${g}</svg>`;
}

/* ------------------------------------------------------------------ */
/* Lire                                                                 */
/* ------------------------------------------------------------------ */
/* les mots « avec » font entendre le son ; les mots « sans » ne le font pas entendre du tout
   (on a écarté les mots douteux : « on », « ou », « oi » pour le son [o], « s » dit [z]…).
   Une consonne se dit mal toute seule avec la voix de synthèse : on la fait entendre au début d'un mot (indice). */
const CP_SONS = {
  a: { avec: ["ananas", "chat", "arbre", "lapin", "avion", "carotte", "banane", "salade", "table", "cheval", "tomate"],
       sans: ["poisson", "lune", "velo", "souris", "hibou", "pomme", "robot", "tortue", "fusee", "livre", "lit", "bol", "mur", "moto", "etoile", "plume"] },
  i: { avec: ["lit", "souris", "livre", "hibou", "radis", "lion"],
       sans: ["chat", "lune", "banane", "pomme", "robot", "tortue", "velo", "gateau", "moto", "ballon", "bol", "tomate", "carotte", "table", "mur", "arbre", "salade", "cheval", "plume", "tambour"] },
  o: { avec: ["moto", "robot", "velo", "gateau", "bol", "tomate", "pomme", "carotte", "tortue", "orange"],
       sans: ["chat", "lune", "lit", "table", "banane", "ananas", "salade", "radis", "plume", "mur", "livre", "lapin", "cheval", "fusee", "arbre", "etoile", "hibou", "tambour", "voiture", "souris"] },
  u: { avec: ["lune", "plume", "tortue", "mur", "fusee", "voiture"],
       sans: ["chat", "lit", "moto", "table", "banane", "radis", "salade", "robot", "pomme", "velo", "ananas", "livre", "bol", "lapin", "cheval", "gateau", "tomate", "carotte"] },
  "é": { avec: ["velo", "fusee", "etoile", "cle", "ete"],
       sans: ["chat", "lune", "lit", "moto", "bol", "mur", "pomme", "souris", "robot", "tortue", "lapin", "banane", "ananas", "radis", "salade", "table", "tomate", "lion"] },
  l: { indice: ["lune", "lit", "lapin"], avec: ["lune", "lit", "lapin", "livre", "lion", "ballon", "salade", "velo", "bol", "cheval", "table", "plume", "etoile", "palmier", "soleil"],
       sans: ["chat", "radis", "moto", "robot", "tomate", "banane", "pomme", "souris", "tortue", "mur", "fusee", "ananas", "carotte", "gateau", "poisson", "main"] },
  r: { indice: ["radis", "robot", "rose"], avec: ["radis", "robot", "carotte", "souris", "tortue", "mur", "arbre", "orange", "tambour", "livre", "fleur", "arrosoir", "rose"],
       sans: ["chat", "lune", "lit", "moto", "pomme", "tomate", "velo", "salade", "ballon", "lapin", "bol", "table", "banane", "lion", "fusee", "plume", "poisson", "ananas"] },
  m: { indice: ["moto", "mur", "main"], avec: ["moto", "mur", "pomme", "tomate", "main", "aimant", "montagne"],
       sans: ["chat", "lune", "lit", "radis", "velo", "souris", "robot", "salade", "ballon", "livre", "tortue", "table", "bol", "lapin", "cheval", "banane", "carotte", "fusee", "ananas"] },
  s: { indice: ["souris", "salade", "soleil"], avec: ["souris", "salade", "soleil", "cactus", "ananas", "poisson"],
       sans: ["chat", "lune", "lit", "moto", "mur", "pomme", "tomate", "velo", "robot", "lapin", "bol", "table", "banane", "carotte", "tortue", "livre", "ballon"] },
};
function questionSon(son) {
  const { avec, sans, indice } = CP_SONS[son];
  const bon = CP.un(avec), choix = shuffle([bon, ...CP.plusieurs(sans, 2)]);
  const consigne = indice
    ? `Écoute : ${indice.map(motDe).join(", ")}. Clique sur l'image où tu entends le même son qu'au début de « ${motDe(indice[0])} ».`
    : `Clique sur l'image où tu entends le son « ${son} ».`;
  return { type: "img", consigne, prompt: "", choices: choix.map((n) => carte(n)), answer: choix.indexOf(bon) };
}
/* les rimes : des mots qui finissent par le même son */
const CP_RIMES = [["velo", "moto", "robot", "gateau"], ["souris", "radis", "lit"], ["ballon", "lion", "avion"]];
/* le nombre de syllabes qu'on entend (à l'oral : « lune » = 1) */
const CP_NB_SYLLABES = { chat: 1, lit: 1, mur: 1, bol: 1, main: 1, lapin: 2, velo: 2, robot: 2, radis: 2, moto: 2, hibou: 2, souris: 2, ballon: 2,
  tortue: 2, cheval: 2, salade: 2, banane: 2, tomate: 2, gateau: 2, fusee: 2, avion: 2, palmier: 2, ananas: 3, arrosoir: 3 };
/* la première syllabe des mots */
const CP_DEBUTS = { la: ["lapin"], "vé": ["velo"], ro: ["robot"], ra: ["radis"], mo: ["moto"], to: ["tomate"], ba: ["banane", "ballon"], sa: ["salade"],
  sou: ["souris"], ca: ["carotte"], li: ["livre", "lit"], lu: ["lune"], ta: ["table"], fu: ["fusee"] };
/* une image sans voix au survol (quand c'est le nom qu'on cherche) */
const carteMuette = (nom, taille = 160) => ({ svg: picto(nom, taille), img: true, cls: "carte", aria: "Image" });
/* un nombre à cliquer (dit au survol, sauf quand c'est la lecture du nombre qu'on travaille) */
const choixNombre = (n, parle = true) => ({ cls: "nombre", html: `<span class="nb">${n}</span>`, aria: String(n), dire: parle ? NOMS_NOMBRES[n] : undefined });
/* trois nombres différents, dont le bon, entre min et max */
function nombresAutour(n, min = 0, max = 10, k = 3) {
  const autres = shuffle([n - 2, n - 1, n + 1, n + 2, n + 3].filter((x) => x >= min && x <= max && x !== n)).slice(0, k - 1);
  return [n, ...autres].sort((a, b) => a - b);
}
const CP_LETTRES_VOYELLES = ["a", "i", "o", "u", "é"];
const CP_MOTS_ECRITS = { moto: "moto", velo: "vélo", lapin: "lapin", robot: "robot", radis: "radis", tomate: "tomate", salade: "salade", lune: "lune",
  livre: "livre", lit: "lit", mur: "mur", banane: "banane", souris: "souris", table: "table" };
const CP_MOTS_OUTILS = ["le", "la", "les", "un", "une", "et", "il", "elle", "dans", "avec"];

/* écoute : toutes les images de la banque, sauf celles du corps (moins parlantes seules) */
const CP_ECOUTE = Object.keys(PICTOS).filter((n) => !["yeux", "oreille", "nez", "bouche", "main"].includes(n));

/* position d'un son : 0 = au début, 1 = au milieu, 2 = à la fin */
const CP_POSITIONS = {
  l: [["lune", 0], ["lit", 0], ["lapin", 0], ["livre", 0], ["lion", 0], ["ballon", 1], ["salade", 1], ["velo", 1], ["bol", 2], ["cheval", 2], ["table", 2]],
  r: [["radis", 0], ["robot", 0], ["carotte", 1], ["souris", 1], ["tortue", 1], ["mur", 2], ["tambour", 2]],
};

/* mots découpés en syllabes (écriture du CP) */
const CP_SYLLABES_MOTS = {
  lapin: ["la", "pin"], velo: ["vé", "lo"], robot: ["ro", "bot"], radis: ["ra", "dis"], moto: ["mo", "to"],
  tomate: ["to", "ma", "te"], banane: ["ba", "na", "ne"], salade: ["sa", "la", "de"], cheval: ["che", "val"],
  hibou: ["hi", "bou"], souris: ["sou", "ris"], ballon: ["bal", "lon"], tortue: ["tor", "tue"],
  carotte: ["ca", "rot", "te"], livre: ["li", "vre"], lune: ["lu", "ne"], pomme: ["pom", "me"], table: ["ta", "ble"],
};
const toutesSyllabes = [...new Set(Object.values(CP_SYLLABES_MOTS).flat())];
const intrusPour = (unites, n) => CP.plusieurs(toutesSyllabes.filter((s) => !unites.includes(s)), n);

const CP_LIRE = {
  id: "lire", name: "Lire", color: "#e4572e",
  chapters: [
    {
      id: "l1", title: "J'entends les sons", picto: "oreille", color: "#e4572e", lessons: [
        { id: "l1-1", title: "Écoute et trouve l'image", bank: CP.serie(() => {
          const choix = CP.plusieurs(CP_ECOUTE, 3), bon = CP.entre(0, 2);
          return { type: "ecoute", consigne: "Écoute bien, et clique sur la bonne image.", mot: motDe(choix[bon]), choix, answer: bon };
        }),
          lesson: { rule: ["Écoute bien le mot que dit Boulon.", "Regarde les images, puis clique sur la bonne."], ex: "Boulon dit « lune » → je clique sur la lune" } },
        { id: "l1-4", title: "Où est le son ?", bank: CP.serie(() => {
          const son = CP.un(["l", "r"]), [image, answer] = CP.un(CP_POSITIONS[son]);
          return { type: "son-position", consigne: `Où entends-tu le son « ${son} » dans « ${motDe(image)} » ?`, image, son, answer };
        }),
          lesson: { rule: ["Dis le mot lentement, comme un petit train : chaque morceau est un wagon.", "Le son est-il <b>au début</b>, <b>au milieu</b> ou <b>à la fin</b> du mot ?"], ex: "<b>l</b>une : le son [l] est au début" } },
        { id: "l1-8", title: "Les rimes", bank: CP.serie(() => {
          const groupe = CP.un(CP_RIMES), [modele, bon] = CP.plusieurs(groupe, 2);
          const autres = CP_RIMES.filter((g) => g !== groupe).map((g) => CP.un(g)), choix = shuffle([bon, ...autres]);
          return { type: "img", consigne: `Quel mot finit comme « ${motDe(modele)} » ? Passe sur les images pour les entendre.`, prompt: `<div class="groupes"><span class="boite">${picto(modele, 120)}</span></div>`,
            choices: choix.map((n) => carte(n)), answer: choix.indexOf(bon) };
        }),
          lesson: { rule: ["Deux mots <b>riment</b> quand ils finissent par le même son.", "Dis les deux mots, et écoute bien leur fin."], ex: "vél<b>o</b> et mot<b>o</b> riment ; sour<b>is</b> et rad<b>is</b> aussi" } },
      ],
    },
    {
      id: "l5", title: "Les voyelles", picto: "ananas", color: "#f08a3c", lessons: [
        { id: "l1-2", title: "Le son [a]", bank: CP.serie(() => questionSon("a")),
          lesson: { rule: ["La lettre <b>a</b> chante <b>[a]</b>, comme dans <b>a</b>nanas.", "Dis chaque mot tout bas : entends-tu [a] ?"], ex: "ch<b>a</b>t, l<b>a</b>pin, b<b>a</b>n<b>a</b>ne" } },
        { id: "l1-3", title: "Le son [i]", bank: CP.serie(() => questionSon("i")),
          lesson: { rule: ["La lettre <b>i</b> chante <b>[i]</b>, comme dans l<b>i</b>t.", "Dis chaque mot tout bas : entends-tu [i] ?"], ex: "sour<b>i</b>s, rad<b>i</b>s, h<b>i</b>bou" } },
        { id: "l1-5", title: "Le son [o]", bank: CP.serie(() => questionSon("o")),
          lesson: { rule: ["La lettre <b>o</b> chante <b>[o]</b>, comme dans m<b>o</b>t<b>o</b>.", "Dis chaque mot tout bas : entends-tu [o] ?"], ex: "r<b>o</b>b<b>o</b>t, t<b>o</b>mate, p<b>o</b>mme" } },
        { id: "l1-6", title: "Le son [u]", bank: CP.serie(() => questionSon("u")),
          lesson: { rule: ["La lettre <b>u</b> chante <b>[u]</b>, comme dans l<b>u</b>ne.", "Attention : « ou », comme dans hibou, ce n'est pas le même son."], ex: "pl<b>u</b>me, m<b>u</b>r, tort<b>u</b>e" } },
        { id: "l1-7", title: "Le son [é]", bank: CP.serie(() => questionSon("é")),
          lesson: { rule: ["La lettre <b>é</b> (avec son petit accent) chante <b>[é]</b>, comme dans v<b>é</b>lo.", "Dis chaque mot tout bas : entends-tu [é] ?"], ex: "<b>é</b>toile, fus<b>ée</b>, cl<b>é</b>" } },
      ],
    },
    {
      id: "l4", title: "Les consonnes", picto: "lune", color: "#d1495b", lessons: [
        { id: "l4-1", title: "Le son [l]", bank: CP.serie(() => questionSon("l")),
          lesson: { rule: ["La lettre <b>l</b> fait chanter la langue derrière les dents, comme au début de <b>l</b>une.", "Écoute chaque mot : entends-tu ce son ?"], ex: "<b>l</b>apin, sa<b>l</b>ade, bo<b>l</b>" } },
        { id: "l4-2", title: "Le son [r]", bank: CP.serie(() => questionSon("r")),
          lesson: { rule: ["La lettre <b>r</b> se dit au fond de la gorge, comme au début de <b>r</b>adis.", "Écoute chaque mot : entends-tu ce son ?"], ex: "<b>r</b>obot, sou<b>r</b>is, mu<b>r</b>" } },
        { id: "l4-3", title: "Le son [m]", bank: CP.serie(() => questionSon("m")),
          lesson: { rule: ["La lettre <b>m</b> se dit la bouche fermée : « mmm », comme au début de <b>m</b>oto.", "Écoute chaque mot : entends-tu ce son ?"], ex: "<b>m</b>ur, po<b>mm</b>e, to<b>m</b>ate" } },
        { id: "l4-4", title: "Le son [s]", bank: CP.serie(() => questionSon("s")),
          lesson: { rule: ["La lettre <b>s</b> siffle comme un serpent : « sss », comme au début de <b>s</b>ouris.", "Écoute chaque mot : entends-tu ce son ?"], ex: "<b>s</b>alade, <b>s</b>oleil, poi<b>ss</b>on" } },
      ],
    },
    {
      id: "l2", title: "Les syllabes", picto: "lapin", color: "#c2410c", lessons: [
        { id: "l2-2", title: "Combien de syllabes ?", bank: CP.serie(() => {
          const mot = CP.un(Object.keys(CP_NB_SYLLABES)), n = CP_NB_SYLLABES[mot];
          return { type: "img", consigne: `Dis « ${motDe(mot)} » en tapant dans tes mains. Combien de syllabes entends-tu ?`, prompt: `<div class="groupes"><span class="boite">${picto(mot, 130)}</span></div>`,
            choices: [1, 2, 3].map((k) => ({ cls: "nombre", html: `<span class="nb">${k}</span>${pointsSvg(k, "#e4572e")}`, aria: String(k), dire: NOMS_NOMBRES[k] })), answer: n - 1 };
        }),
          lesson: { rule: ["Pour compter les syllabes, on tape dans les mains à chaque morceau du mot.", "Un clap, deux claps, trois claps…"], ex: "chat : 1 clap ; la-pin : 2 claps ; a-na-nas : 3 claps" } },
        { id: "l2-3", title: "La première syllabe", bank: CP.serie(() => {
          const syl = CP.un(Object.keys(CP_DEBUTS)), bon = CP.un(CP_DEBUTS[syl]);
          const autres = CP.plusieurs(Object.keys(CP_DEBUTS).filter((x) => x !== syl), 2).map((x) => CP.un(CP_DEBUTS[x])), choix = shuffle([bon, ...autres]);
          return { type: "img", consigne: `Clique sur l'image dont le mot commence par « ${syl} ».`, prompt: "", choices: choix.map((n) => carte(n)), answer: choix.indexOf(bon) };
        }),
          lesson: { rule: ["La <b>première syllabe</b>, c'est le premier morceau du mot.", "Dis le mot et arrête-toi après le premier clap."], ex: "<b>mo</b>-to commence par « mo »" } },
        { id: "l2-1", title: "Reconstruis le mot", bank: CP.serie(() => {
          const image = CP.un(Object.keys(CP_SYLLABES_MOTS)), unites = CP_SYLLABES_MOTS[image];
          return { type: "syllabes", consigne: "Remets les syllabes dans l'ordre pour écrire le mot de l'image.", image, unites, intrus: intrusPour(unites, 2) };
        }),
          lesson: { rule: ["Un mot est fait de <b>syllabes</b> : on les entend quand on tape dans les mains.", "Clique sur les étiquettes dans l'ordre où tu les entends."], ex: "la-pin → <b>la</b> + <b>pin</b> = lapin" } },
      ],
    },
    {
      id: "l3", title: "Je lis", picto: "livre", color: "#b3361b", lessons: [
        { id: "l3-1", title: "Lis la voyelle", bank: CP.serie(() => {
          const choix = CP.plusieurs(CP_LETTRES_VOYELLES, 3), bon = CP.entre(0, 2);
          return { type: "ecoute-ecrit", consigne: "Écoute le son, puis clique sur la lettre qui l'écrit.", dit: choix[bon], choix, answer: bon };
        }),
          lesson: { rule: ["Chaque voyelle a son son : <b>a</b>, <b>i</b>, <b>o</b>, <b>u</b>, <b>é</b>.", "Regarde bien la forme de la lettre."], ex: "on entend [o] → c'est la lettre <b>o</b>" } },
        { id: "l3-2", title: "Lis la syllabe", bank: CP.serie(() => {
          const c = CP.un(["l", "r", "m", "s"]), v = CP.un(["a", "i", "o", "u"]);
          const autreV = CP.un(["a", "i", "o", "u"].filter((x) => x !== v)), autreC = CP.un(["l", "r", "m", "s"].filter((x) => x !== c));
          const choix = shuffle([c + v, c + autreV, autreC + v]);
          return { type: "ecoute-ecrit", consigne: "Écoute la syllabe, puis clique sur celle qui est écrite.", dit: c + v, choix, answer: choix.indexOf(c + v) };
        }),
          lesson: { rule: ["Une consonne et une voyelle font une <b>syllabe</b> : on les lit ensemble.", "<b>l</b> et <b>a</b> font <b>la</b> ; <b>m</b> et <b>o</b> font <b>mo</b>."], ex: "l + a → <b>la</b> ; r + i → <b>ri</b>" } },
        { id: "l3-3", title: "Lis le mot", bank: CP.serie(() => {
          const choix = CP.plusieurs(Object.keys(CP_MOTS_ECRITS), 3), bon = CP.entre(0, 2);
          return { type: "ecoute-ecrit", consigne: "Écoute le mot, puis clique sur le mot écrit.", dit: motDe(choix[bon]), choix: choix.map((m) => CP_MOTS_ECRITS[m]), answer: bon };
        }),
          lesson: { rule: ["Pour lire un mot, on lit ses syllabes l'une après l'autre.", "Puis on les dit ensemble, bien vite."], ex: "mo + to → <b>moto</b>" } },
        { id: "l3-4", title: "Les petits mots", bank: CP.serie(() => {
          const choix = CP.plusieurs(CP_MOTS_OUTILS, 3), bon = CP.entre(0, 2);
          return { type: "ecoute-ecrit", consigne: "Écoute le petit mot, puis clique sur le mot écrit.", dit: choix[bon], choix, answer: bon };
        }),
          lesson: { rule: ["Certains petits mots reviennent tout le temps : <b>le</b>, <b>la</b>, <b>un</b>, <b>une</b>, <b>et</b>…", "On les apprend par cœur, pour les reconnaître tout de suite."], ex: "<b>le</b> chat, <b>la</b> lune, <b>un</b> vélo, <b>une</b> pomme" } },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Dictée : du son à l'écriture, avec des étiquettes                     */
/* ------------------------------------------------------------------ */
const CP_VOYELLES = ["a", "i", "o", "u", "e", "é"];
const CP_CONSONNES = ["m", "l", "r", "s", "p", "t"];
const CP_MOTS_DICTEE = ["moto", "velo", "lapin", "robot", "radis", "tomate", "salade", "banane", "lune", "pomme", "table", "livre"];
const CP_DICTEE = {
  id: "dictee", name: "Dictée", color: "#8e6cc9",
  chapters: [
    {
      id: "d1", title: "J'écris ce que j'entends", picto: "plume", color: "#8e6cc9", lessons: [
        { id: "d1-1", title: "Les voyelles", bank: CP.serie(() => {
          const v = CP.un(CP_VOYELLES);
          return { type: "dictee-etiquettes", consigne: "Écoute le son, puis clique sur la lettre qui l'écrit.", mot: v, unites: [v], intrus: CP.plusieurs(CP_VOYELLES.filter((x) => x !== v), 2) };
        }),
          lesson: { rule: ["Les voyelles sont <b>a, e, i, o, u</b> (et <b>é</b>).", "Écoute le son, puis trouve la lettre qui l'écrit."], ex: "on entend [o] → on écrit <b>o</b>" } },
        { id: "d1-2", title: "Les syllabes", bank: CP.serie(() => {
          const c = CP.un(CP_CONSONNES), v = CP.un(CP_VOYELLES);
          return { type: "dictee-etiquettes", consigne: "Écoute la syllabe, puis écris-la avec les lettres.", mot: c + v, unites: [c, v],
            intrus: [CP.un(CP_CONSONNES.filter((x) => x !== c)), CP.un(CP_VOYELLES.filter((x) => x !== v))] };
        }),
          lesson: { rule: ["Une <b>syllabe</b>, c'est un morceau de mot qu'on dit d'un seul coup.", "On écrit d'abord la consonne, puis la voyelle : <b>m</b> et <b>a</b> font <b>ma</b>."], ex: "m + a → <b>ma</b> ; l + i → <b>li</b>" } },
        { id: "d1-3", title: "Les petits mots", bank: CP.serie(() => {
          const m = CP.un(CP_MOTS_DICTEE), unites = CP_SYLLABES_MOTS[m];
          return { type: "dictee-etiquettes", consigne: "Écoute le mot, puis écris-le avec les syllabes.", mot: motDe(m), unites, intrus: intrusPour(unites, 2) };
        }),
          lesson: { rule: ["Dis le mot lentement et compte ses syllabes.", "Écris les syllabes une par une, dans l'ordre."], ex: "moto → <b>mo</b> + <b>to</b>" } },
      ],
    },
    {
      id: "d2", title: "Les petits mots", picto: "etoile", color: "#6b4fb0", lessons: [
        { id: "d2-1", title: "J'écris les petits mots", bank: CP.serie(() => {
          const m = CP.un(["le", "la", "les", "un", "une", "il", "et"]), unites = m.split("");
          const intrus = CP.plusieurs(["a", "e", "i", "o", "u", "l", "n", "s", "t", "r"].filter((x) => !unites.includes(x)), 2);
          return { type: "dictee-etiquettes", consigne: "Écoute le petit mot, puis écris-le avec les lettres.", mot: m, unites, intrus };
        }),
          lesson: { rule: ["Les petits mots s'écrivent toujours de la même façon : on les apprend par cœur.", "Écris les lettres dans l'ordre."], ex: "<b>un</b> : u + n ; <b>la</b> : l + a" } },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Compter                                                              */
/* ------------------------------------------------------------------ */
const CP_A_COMPTER = [["pomme", "pommes"], ["orange", "oranges"], ["etoile", "étoiles"], ["ballon", "ballons"], ["poisson", "poissons"], ["voiture", "voitures"], ["carotte", "carottes"], ["banane", "bananes"]];
const CP_COMPTER = {
  id: "math", name: "Compter", color: "#2e86de",
  chapters: [
    {
      id: "c1", title: "Les nombres jusqu'à 10", picto: "pomme", color: "#2e86de", lessons: [
        { id: "c1-1", title: "Compter jusqu'à 10", bank: CP.serie(() => {
          const [image, pluriel] = CP.un(CP_A_COMPTER), n = CP.entre(1, 10);
          const voisins = [n - 2, n - 1, n + 1, n + 2].filter((x) => x >= 1 && x <= 10);
          const choix = [n, ...CP.plusieurs(voisins, 3)].sort((a, b) => a - b);
          return { type: "compter", consigne: `Combien y a-t-il de ${pluriel} ?`, image, n, choix };
        }),
          lesson: { rule: ["Pour compter, on touche chaque image <b>une seule fois</b>.", "Le dernier nombre dit, c'est le nombre d'images."], ex: "pomme, pomme, pomme → un, deux, <b>trois</b>" } },
        { id: "c1-2", title: "Le plus, le moins", bank: CP.serie(() => {
          const [image] = CP.un(CP_A_COMPTER), nb = CP.plusieurs([1, 2, 3, 4, 5, 6, 7, 8], 3);
          const plus = Math.random() < 0.5, cible = plus ? Math.max(...nb) : Math.min(...nb);
          return { type: "img", consigne: plus ? "Clique sur le groupe où il y en a le plus." : "Clique sur le groupe où il y en a le moins.", prompt: "",
            choices: nb.map((n) => ({ svg: groupeSvg(image, n), img: true, cls: "carte groupe", aria: n + " images" })), answer: nb.indexOf(cible) };
        }),
          lesson: { rule: ["Pour savoir où il y en a <b>le plus</b>, on compte chaque groupe.", "Le plus grand nombre gagne ; le plus petit, c'est <b>le moins</b>."], ex: "4 pommes, c'est <b>plus</b> que 2 pommes" } },
        { id: "c1-3", title: "Lis le nombre", bank: CP.serie(() => {
          const n = CP.entre(0, 10), choix = nombresAutour(n).map(String);
          return { type: "ecoute-ecrit", consigne: "Écoute le nombre, puis clique sur le nombre écrit.", dit: NOMS_NOMBRES[n], choix, answer: choix.indexOf(String(n)) };
        }),
          lesson: { rule: ["Chaque nombre a son nom et son chiffre.", "<b>sept</b> s'écrit <b>7</b> ; <b>dix</b> s'écrit avec deux chiffres : <b>10</b>."], ex: "trois → <b>3</b> ; huit → <b>8</b>" } },
        { id: "c1-4", title: "Les points du dé", bank: CP.serie(() => {
          const n = CP.entre(1, 10), choix = nombresAutour(n, 1, 10);
          return { type: "img", consigne: "Combien de points vois-tu ? Essaie de les voir sans les compter un par un.", prompt: `<div class="des">${desSvg(n, 110)}</div>`,
            choices: choix.map((k) => choixNombre(k)), answer: choix.indexOf(n) };
        }),
          lesson: { rule: ["Sur un dé, les points sont toujours rangés de la même façon.", "On reconnaît vite le 5 et le 6 ; avec deux dés, on ajoute les deux."], ex: "un dé de 6 et un dé de 2 → <b>8</b>" } },
      ],
    },
    {
      id: "c2", title: "Comparer et ranger", picto: "n5", color: "#1f5fa0", lessons: [
        { id: "c2-1", title: "Le plus grand, le plus petit", bank: CP.serie(() => {
          const choix = CP.plusieurs([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3), grand = Math.random() < 0.5, cible = grand ? Math.max(...choix) : Math.min(...choix);
          return { type: "img", consigne: grand ? "Clique sur le plus grand nombre." : "Clique sur le plus petit nombre.", prompt: "",
            choices: choix.map((k) => choixNombre(k)), answer: choix.indexOf(cible) };
        }),
          lesson: { rule: ["Le <b>plus grand</b> nombre est celui qu'on dit le plus tard quand on compte.", "Le <b>plus petit</b> est celui qu'on dit en premier."], ex: "entre 4 et 7, le plus grand est <b>7</b>" } },
        { id: "c2-2", title: "Range les nombres", bank: CP.serie(() => ({
          type: "suite-images", consigne: "Range les nombres du plus petit au plus grand.",
          images: CP.plusieurs([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 4).sort((a, b) => a - b).map((k) => "n" + k),
        }), 6),
          lesson: { rule: ["Pour ranger, on commence par le plus petit.", "Puis on prend à chaque fois le plus petit de ceux qui restent."], ex: "2, 5, 6, 9" } },
        { id: "c2-3", title: "Juste avant, juste après", bank: CP.serie(() => {
          const apres = Math.random() < 0.6, n = apres ? CP.entre(0, 9) : CP.entre(1, 10), bon = apres ? n + 1 : n - 1;
          const choix = [...new Set([bon, n, apres ? n + 2 : n - 2, apres ? n - 1 : n + 1])].filter((x) => x >= 0 && x <= 10 && x !== n).slice(0, 3).sort((a, b) => a - b);
          return { type: "img", consigne: `Quel nombre vient juste ${apres ? "après" : "avant"} ${NOMS_NOMBRES[n]} ?`, prompt: `<div class="groupes"><span class="boite">${picto("n" + n, 110)}</span></div>`,
            choices: choix.map((k) => choixNombre(k)), answer: choix.indexOf(bon) };
        }),
          lesson: { rule: ["Le nombre <b>juste après</b>, c'est celui qu'on dit ensuite en comptant : il y a un de plus.", "Le nombre <b>juste avant</b> a un de moins."], ex: "juste après 6, c'est <b>7</b> ; juste avant 6, c'est <b>5</b>" } },
      ],
    },
    {
      id: "c3", title: "Ajouter", picto: "orange", color: "#2a6fb8", lessons: [
        { id: "c3-1", title: "Combien en tout ?", bank: CP.serie(() => {
          const [image, pluriel] = CP.un(CP_A_COMPTER), a = CP.entre(1, 5), b = CP.entre(1, Math.min(5, 10 - a)), choix = nombresAutour(a + b, 1, 10);
          return { type: "img", consigne: `Combien de ${pluriel} en tout ?`,
            prompt: `<div class="groupes"><span class="boite">${groupeSvg(image, a)}</span><span class="plus">+</span><span class="boite">${groupeSvg(image, b)}</span></div>`,
            choices: choix.map((k) => choixNombre(k)), answer: choix.indexOf(a + b) };
        }),
          lesson: { rule: ["Pour savoir combien il y en a <b>en tout</b>, on réunit les deux groupes.", "On peut compter tout, ou partir du premier nombre et continuer."], ex: "3 pommes et 2 pommes → 3, 4, <b>5</b>" } },
        { id: "c3-2", title: "La maison du 5", bank: CP.serie(() => {
          const k = CP.entre(0, 5), cases = Array.from({ length: 5 }, (_, i) => `<rect x="${4 + i * 76}" y="4" width="70" height="70" rx="10" fill="#fff" stroke="#2b2236" stroke-width="4"/>`
            + (i < k ? `<g transform="translate(${9 + i * 76} 9) scale(.6)">${PICTOS.pomme}</g>` : "")).join("");
          return { type: "img", consigne: "La maison du 5 a cinq cases. Combien de pommes manque-t-il pour la remplir ?",
            prompt: `<div class="groupes"><svg width="480" height="97" viewBox="0 0 386 78" aria-hidden="true">${cases}</svg></div>`,
            choices: [0, 1, 2, 3, 4, 5].map((x) => choixNombre(x)), answer: 5 - k };
        }),
          lesson: { rule: ["Pour faire 5, on compte les cases vides.", "4 et 1 font 5 ; 3 et 2 font 5."], ex: "3 pommes → il en manque <b>2</b> pour faire 5" } },
        { id: "c3-3", title: "Petits problèmes", bank: CP.serie(() => {
          const [image, pluriel] = CP.un(CP_A_COMPTER), qui = CP.un([["Yasmine", "elle"], ["Adam", "il"], ["Salma", "elle"], ["Youssef", "il"], ["Inès", "elle"], ["Rayan", "il"]]);
          const a = CP.entre(1, 6), b = CP.entre(1, Math.min(4, 10 - a)), choix = nombresAutour(a + b, 1, 10);
          return { type: "img", consigne: `${qui[0]} a ${NOMS_NOMBRES[a]} ${a > 1 ? pluriel : motDe(image)}. Boulon lui en donne ${NOMS_NOMBRES[b]}. Combien en a-t-${qui[1]} maintenant ?`,
            prompt: `<div class="groupes"><span class="boite">${groupeSvg(image, a)}</span><span class="plus">+</span><span class="boite">${groupeSvg(image, b)}</span></div>`,
            choices: choix.map((k) => choixNombre(k)), answer: choix.indexOf(a + b) };
        }),
          lesson: { rule: ["Écoute bien l'histoire : on <b>ajoute</b> quand on en reçoit encore.", "Regarde les images pour t'aider à compter."], ex: "j'ai 2 ballons, on m'en donne 3 → <b>5</b> ballons" } },
      ],
    },
    {
      id: "c4", title: "Formes et rangs", picto: "triangle", color: "#3a5fa8", lessons: [
        { id: "c4-1", title: "Les formes", bank: CP.serie(() => {
          const formes = ["carre", "rond", "triangle", "rectangle"], choix = CP.plusieurs(formes, 3), bon = CP.un(choix);
          return { type: "img", consigne: `Clique sur ${PICTOS_NOMS[bon].replace(/^un /, "le ")}.`, prompt: "", choices: choix.map((n) => carteMuette(n)), answer: choix.indexOf(bon) };
        }),
          lesson: { rule: ["Le <b>carré</b> a 4 côtés pareils ; le <b>rectangle</b> a 4 côtés, deux longs et deux courts.", "Le <b>triangle</b> a 3 côtés ; le <b>rond</b> n'a pas de coin."], ex: "une fenêtre carrée, une roue ronde" } },
        { id: "c4-2", title: "Premier, deuxième, dernier", bank: CP.serie(() => {
          const rang = CP.plusieurs(["chat", "lapin", "tortue", "lion", "souris", "hibou", "cheval", "poisson"], 4), k = CP.un([0, 1, 2, 3]);
          const mot = ["la première", "la deuxième", "la troisième", "la dernière"][k];
          return { type: "img", consigne: `On commence à compter à gauche. Clique sur ${mot} image.`, prompt: "", choices: rang.map((n) => carteMuette(n, 130)), answer: k };
        }),
          lesson: { rule: ["Dans une file, on compte à partir du début : <b>premier</b>, <b>deuxième</b>, <b>troisième</b>…", "Le <b>dernier</b> est tout au bout."], ex: "1er, 2e, 3e… dernier" } },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Le monde                                                             */
/* ------------------------------------------------------------------ */
const CP_SENS = [["voir", "yeux"], ["entendre", "oreille"], ["sentir les odeurs", "nez"], ["goûter", "bouche"], ["toucher", "main"]];
const CP_VIVANTS = ["chat", "lapin", "poisson", "souris", "hibou", "tortue", "cheval", "lion", "arbre"];
const CP_OBJETS = ["robot", "velo", "ballon", "voiture", "moto", "avion", "table", "lit", "fusee", "livre"];
const CP_FRUITS = ["pomme", "orange", "banane", "ananas"];
const CP_LEGUMES = ["carotte", "radis", "salade"];
/* Sciences : le corps, le vivant, les plantes (ces chapitres étaient dans « Le monde » : mêmes
   identifiants, l'élève garde ses étoiles), et la matière (l'aimant, ce qui flotte ou qui coule) */
const CP_AIMANT = { oui: ["clou", "trombone", "conserve"], non: ["plume", "ballon", "livre", "pomme", "bol", "table"] };
const CP_EAU = { flotte: ["ballon", "plume", "pomme"], coule: ["cle", "cuillere", "clou", "cailloux"] };
const CP_SCIENCES = {
  id: "sciences", name: "Sciences", color: "#d4691e",
  chapters: [
    {
      id: "w1", title: "Mon corps", picto: "main", color: "#3fa34d", lessons: [
        { id: "w1-1", title: "Les cinq sens", bank: CP.serie(() => {
          const bon = CP.un(CP_SENS), choix = shuffle([bon, ...CP.plusieurs(CP_SENS.filter((s) => s !== bon), 2)]);
          return { type: "img", consigne: `Avec quoi peux-tu ${bon[0]} ?`, prompt: "", choices: choix.map(([, o]) => carte(o)), answer: choix.indexOf(bon) };
        }),
          lesson: { rule: ["Nous avons <b>cinq sens</b> : la vue, l'ouïe, l'odorat, le goût et le toucher.", "Chaque sens a son organe : les yeux, les oreilles, le nez, la langue, la peau."], ex: "J'entends la musique avec mes <b>oreilles</b>." } },
      ],
    },
    {
      id: "w2", title: "Le vivant", picto: "chat", color: "#2a7a36", lessons: [
        { id: "w2-1", title: "Vivant ou pas vivant ?", bank: CP.serie(() => ({
          type: "tri", consigne: "Range chaque image dans le bon panier : vivant, ou pas vivant.", paniers: ["vivant", "pas vivant"],
          objets: [...CP.plusieurs(CP_VIVANTS, 3).map((n) => [n, 0]), ...CP.plusieurs(CP_OBJETS, 3).map((n) => [n, 1])],
        })),
          lesson: { rule: ["Un être <b>vivant</b> naît, grandit, se nourrit et meurt : les animaux, les plantes.", "Un objet n'est <b>pas vivant</b> : il ne grandit pas, il ne mange pas."], ex: "le chat est vivant ; le vélo n'est pas vivant" } },
        { id: "w2-2", title: "Fruit ou légume ?", bank: CP.serie(() => ({
          type: "tri", consigne: "Range chaque image dans le bon panier : les fruits, ou les légumes.", paniers: ["fruits", "légumes"],
          objets: [...CP.plusieurs(CP_FRUITS, 3).map((n) => [n, 0]), ...CP.plusieurs(CP_LEGUMES, 2).map((n) => [n, 1])],
        })),
          lesson: { rule: ["Les <b>fruits</b> sont souvent sucrés : la pomme, la banane, l'orange.", "Les <b>légumes</b> se mangent souvent cuits ou en salade : la carotte, le radis."], ex: "la banane est un fruit ; la carotte est un légume" } },
      ],
    },
    {
      id: "w3", title: "Les plantes", picto: "fleur", color: "#5a9a2e", lessons: [
        { id: "w3-1", title: "De quoi la plante a besoin ?", bank: CP.serie(() => {
          const bon = CP.un(["goutte", "soleil"]), choix = shuffle([bon, ...CP.plusieurs(["ballon", "gateau", "voiture", "livre", "robot", "tambour"], 2)]);
          return { type: "img", consigne: "Clique sur ce dont la plante a besoin pour pousser.", prompt: "", choices: choix.map((n) => carte(n)), answer: choix.indexOf(bon) };
        }),
          lesson: { rule: ["Pour pousser, une plante a besoin d'<b>eau</b> et de <b>soleil</b>.", "Sans eau, elle a soif et ses feuilles tombent. Sans lumière, elle devient toute pâle."], ex: "J'arrose ma plante et je la mets près de la fenêtre." } },
        { id: "w3-2", title: "De la graine à la fleur", bank: CP.serie(() => ({
          type: "suite-images", consigne: "Remets les images dans l'ordre : qu'est-ce qui vient en premier ?",
          images: CP.un([["graine", "pousse", "fleur"], ["graine", "pousse", "arbre"]]),
        })),
          lesson: { rule: ["On plante une <b>graine</b> dans la terre et on l'arrose.", "Une petite <b>pousse</b> sort de la terre, puis elle grandit et fait une <b>fleur</b>."], ex: "graine → pousse → fleur" } },
        { id: "w3-3", title: "Grand arbre ou petite plante ?", bank: CP.serie(() => ({
          type: "tri", consigne: "Range chaque image : un grand arbre, ou une petite plante ?", paniers: ["grand arbre", "petite plante"],
          objets: [...CP.plusieurs(["arbre", "palmier"], 2).map((n) => [n, 0]), ...CP.plusieurs(["fleur", "cactus", "salade", "radis", "rose", "carotte"], 3).map((n) => [n, 1])],
        })),
          lesson: { rule: ["Un <b>arbre</b> a un gros tronc en bois : il devient très grand et vit très longtemps.", "Une <b>petite plante</b> reste petite : la fleur, la salade, le radis."], ex: "le palmier est un grand arbre ; la salade est une petite plante" } },
      ],
    },
    {
      id: "s1", title: "La matière et les objets", picto: "aimant", color: "#d4691e", lessons: [
        { id: "s1-1", title: "L'aimant attire ou pas ?", bank: CP.serie(() => ({
          type: "tri", consigne: "Range chaque image : l'aimant l'attire, ou il ne l'attire pas.", paniers: ["l'aimant l'attire", "il ne l'attire pas"],
          objets: [...CP.plusieurs(CP_AIMANT.oui, 3).map((n) => [n, 0]), ...CP.plusieurs(CP_AIMANT.non, 3).map((n) => [n, 1])],
        })),
          lesson: { rule: ["L'<b>aimant</b> attire les objets en <b>fer</b> : le clou, le trombone, la boîte de conserve.", "Il n'attire pas le bois, le papier, le plastique ni les fruits."], ex: "l'aimant attire le clou ; il n'attire pas la plume" } },
        { id: "s1-2", title: "Flotte ou coule ?", bank: CP.serie(() => ({
          type: "tri", consigne: "Dans l'eau, est-ce que l'objet flotte, ou est-ce qu'il coule ?", paniers: ["il flotte", "il coule"],
          objets: [...CP.plusieurs(CP_EAU.flotte, 3).map((n) => [n, 0]), ...CP.plusieurs(CP_EAU.coule, 3).map((n) => [n, 1])],
        })),
          lesson: { rule: ["Un objet qui <b>flotte</b> reste sur l'eau : le ballon, la plume, la pomme.", "Un objet qui <b>coule</b> tombe au fond : la clé, le clou, les cailloux."], ex: "le ballon flotte ; la clé coule" } },
      ],
    },
  ],
};

/* Le temps : la journée, la semaine, les saisons, autrefois et aujourd'hui (les images des
   inventions viennent du module modules/inventions, chargé au CP) */
const CP_MOMENTS = [["matin", "le matin"], ["midi", "le midi"], ["soir", "le soir"], ["nuit", "la nuit"]];
const CP_MOMENTS_INDICES = [["Quand dort-on ?", "nuit"], ["Quand le soleil se lève-t-il ?", "matin"], ["Quand le soleil se couche-t-il ?", "soir"],
  ["Quand le soleil est-il tout en haut du ciel ?", "midi"], ["Quand voit-on la lune et les étoiles ?", "nuit"], ["Quand prend-on le petit-déjeuner ?", "matin"]];
const CP_JOURS = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
const CP_SAISONS = ["printemps", "ete", "automne", "hiver"];
const CP_SAISONS_INDICES = [["En quelle saison les feuilles tombent-elles des arbres ?", "automne"], ["En quelle saison fait-il très froid ? Il peut neiger.", "hiver"],
  ["En quelle saison les fleurs poussent-elles ?", "printemps"], ["En quelle saison fait-il très chaud ? On va à la plage.", "ete"]];
const CP_AUTREFOIS = ["inv-charrette", "inv-train", "inv-tablette", "inv-pigeon", "inv-telephone", "inv-boulier", "inv-grotte"];
const CP_AUJOURDHUI = ["inv-electrique", "inv-smartphone", "inv-tactile", "inv-ordi", "inv-tgv"];
const cartesChoix = (bon, tous, n = 3) => { const choix = shuffle([bon, ...CP.plusieurs(tous.filter((x) => x !== bon), n - 1)]); return { choix, cartes: choix.map((x) => carte(x)) }; };
const CP_TEMPS = {
  id: "temps", name: "Le temps", color: "#2e6fd6",
  chapters: [
    {
      id: "t1", title: "La journée", picto: "matin", color: "#2e6fd6", lessons: [
        { id: "t1-1", title: "Le matin, le midi, le soir, la nuit", bank: CP.serie(() => {
          if (Math.random() < 0.5) {
            const [nom, mot] = CP.un(CP_MOMENTS), { choix, cartes } = cartesChoix(nom, CP_MOMENTS.map((m) => m[0]));
            return { type: "img", consigne: `Clique sur ${mot}.`, prompt: "", choices: cartes, answer: choix.indexOf(nom) };
          }
          const [question, bon] = CP.un(CP_MOMENTS_INDICES), { choix, cartes } = cartesChoix(bon, CP_MOMENTS.map((m) => m[0]));
          return { type: "img", consigne: question, prompt: "", choices: cartes, answer: choix.indexOf(bon) };
        }),
          lesson: { rule: ["Une journée commence le <b>matin</b>, quand le soleil se lève.", "Puis vient le <b>midi</b>, puis le <b>soir</b>, quand le soleil se couche, et enfin la <b>nuit</b>."], ex: "matin → midi → soir → nuit" } },
        { id: "t1-2", title: "Dans l'ordre de la journée", bank: CP.serie(() => ({
          type: "suite-images", consigne: "Remets la journée dans l'ordre : qu'est-ce qui vient en premier ?", images: ["matin", "midi", "soir", "nuit"],
        }), 5),
          lesson: { rule: ["Le matin vient en premier, la nuit à la fin.", "Après la nuit, un nouveau matin commence !"], ex: "matin → midi → soir → nuit" } },
      ],
    },
    {
      id: "t2", title: "La semaine et les saisons", picto: "printemps", color: "#1f5fa0", lessons: [
        { id: "t2-1", title: "Les jours de la semaine", bank: CP.serie(() => {
          const i = CP.entre(0, 6), apres = Math.random() < 0.6, bon = CP_JOURS[apres ? (i + 1) % 7 : (i + 6) % 7];
          const choix = shuffle([bon, ...CP.plusieurs(CP_JOURS.filter((j) => j !== bon && j !== CP_JOURS[i]), 2)]);
          return { type: "img", consigne: `Quel jour vient ${apres ? "après" : "avant"} ${CP_JOURS[i]} ?`, prompt: "",
            choices: choix.map((j) => ({ text: j, dire: j, aria: j, cls: "jour" })), answer: choix.indexOf(bon) };
        }),
          lesson: { rule: ["Une semaine a <b>sept jours</b> : lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche.", "Après dimanche, une nouvelle semaine recommence avec lundi."], ex: "après lundi vient mardi" } },
        { id: "t2-2", title: "Les quatre saisons", bank: CP.serie(() => {
          if (Math.random() < 0.3) return { type: "suite-images", consigne: "Remets les saisons dans l'ordre, en commençant par le printemps.", images: CP_SAISONS.slice() };
          const [question, bon] = CP.un(CP_SAISONS_INDICES), { choix, cartes } = cartesChoix(bon, CP_SAISONS);
          return { type: "img", consigne: question, prompt: "", choices: cartes, answer: choix.indexOf(bon) };
        }),
          lesson: { rule: ["Une année a <b>quatre saisons</b> : le printemps, l'été, l'automne et l'hiver.", "Au printemps, les fleurs poussent ; en été, il fait chaud ; en automne, les feuilles tombent ; en hiver, il fait froid."], ex: "printemps → été → automne → hiver" } },
      ],
    },
    {
      id: "t3", title: "Autrefois et aujourd'hui", picto: "inv-train", color: "#5a4a9b", lessons: [
        { id: "t3-1", title: "De très longtemps à aujourd'hui", bank: CP.serie(() => {
          const theme = CP.un(["transports", "ecriture", "communication", "ordinateurs"]);
          const images = typeof Inventions !== "undefined" ? Inventions.etapes(theme).map((e) => e.id) : ["inv-pied", "inv-charrette", "inv-train", "inv-electrique"];
          return { type: "suite-images", consigne: "Remets les images dans l'ordre : d'abord la plus ancienne, et aujourd'hui à la fin.", images };
        }, 5),
          lesson: { rule: ["<b>Autrefois</b>, il y a très longtemps, on allait à pied ou en charrette.", "<b>Aujourd'hui</b>, on a le train, la voiture électrique, le téléphone portable."], ex: "à pied → la charrette → le train → la voiture électrique" } },
        { id: "t3-2", title: "Autrefois ou aujourd'hui ?", bank: CP.serie(() => ({
          type: "tri", consigne: "Range chaque image : c'était autrefois, ou c'est aujourd'hui ?", paniers: ["autrefois", "aujourd'hui"],
          objets: [...CP.plusieurs(CP_AUTREFOIS, 3).map((n) => [n, 0]), ...CP.plusieurs(CP_AUJOURDHUI, 3).map((n) => [n, 1])],
        })),
          lesson: { rule: ["Certaines choses existaient <b>autrefois</b> : la charrette, le pigeon voyageur, le boulier.", "D'autres sont d'<b>aujourd'hui</b> : la tablette, le téléphone portable."], ex: "le pigeon voyageur, c'était autrefois ; la tablette, c'est aujourd'hui" } },
      ],
    },
  ],
};

/* Le monde : se repérer dans l'espace, et les paysages du Maroc */
/* une petite scène : le chat sur la table, sous la table, ou à côté */
function sceneChat(ou, taille = 160) {
  const table = ou === "a-cote" ? `<g transform="translate(-4 22) scale(.74)">${PICTOS.table}</g>` : `<g transform="translate(0 10)">${PICTOS.table}</g>`;
  const chat = { sur: "translate(34 14) scale(.32)", sous: "translate(34 64) scale(.32)", "a-cote": "translate(64 60) scale(.34)" }[ou];
  return `<svg class="picto" width="${taille}" height="${taille}" viewBox="0 0 100 100" aria-hidden="true"><path d="M2 96 H98" stroke="#2b2236" stroke-width="3" stroke-linecap="round"/>${table}<g transform="${chat}">${PICTOS.chat}</g></svg>`;
}
const CP_OU = [["sur", "sur la table"], ["sous", "sous la table"], ["a-cote", "à côté de la table"]];
const CP_RANGEES = ["pomme", "ballon", "chat", "lune", "velo", "livre", "poisson", "etoile", "fleur", "voiture"];
const CP_PAYSAGES = [["mer", "la mer"], ["montagne", "la montagne"], ["desert", "le désert"]];
const CP_PAYSAGES_INDICES = [["Où nagent les poissons ?", "mer"], ["Où trouve-t-on des dunes de sable ?", "desert"],
  ["Où trouve-t-on de la neige en hiver, au Maroc ?", "montagne"], ["Où pousse le cactus, sous un soleil brûlant ?", "desert"],
  ["Où trouve-t-on des vagues et une plage ?", "mer"], ["Où sont les grands sommets de l'Atlas ?", "montagne"]];
const CP_MONDE = {
  id: "monde", name: "Le monde", color: "#3fa34d",
  chapters: [
    {
      id: "e1", title: "Se repérer", picto: "table", color: "#3fa34d", lessons: [
        { id: "e1-1", title: "Sur, sous, à côté", bank: CP.serie(() => {
          const ordre = shuffle(CP_OU.slice()), bon = CP.un(ordre);
          return { type: "img", consigne: `Clique sur l'image où le chat est ${bon[1]}.`, prompt: "",
            choices: ordre.map(([ou, mot]) => ({ svg: sceneChat(ou), img: true, cls: "carte", dire: "le chat est " + mot, aria: "le chat est " + mot })), answer: ordre.indexOf(bon) };
        }),
          lesson: { rule: ["Le chat peut être <b>sur</b> la table, <b>sous</b> la table, ou <b>à côté</b> de la table.", "Ces petits mots disent où sont les choses."], ex: "Le chat dort sous la table." } },
        { id: "e1-2", title: "À gauche, au milieu, à droite", bank: CP.serie(() => {
          const rangee = CP.plusieurs(CP_RANGEES, 3), k = CP.entre(0, 2);
          const mot = ["tout à gauche", "au milieu", "tout à droite"][k];
          return { type: "img", consigne: `Clique sur l'image qui est ${mot}.`, prompt: "",
            choices: rangee.map((n) => ({ svg: picto(n, 150), img: true, cls: "carte", aria: motDe(n) })), answer: k };
        }),
          lesson: { rule: ["Sur l'écran, la <b>gauche</b> est du côté où l'on commence à lire.", "La <b>droite</b> est de l'autre côté. Entre les deux, c'est le <b>milieu</b>."], ex: "gauche — milieu — droite" } },
      ],
    },
    {
      id: "e2", title: "Les paysages du Maroc", picto: "montagne", color: "#2a7a36", lessons: [
        { id: "e2-1", title: "La mer, la montagne, le désert", bank: CP.serie(() => {
          const noms = CP_PAYSAGES.map((x) => x[0]);
          if (Math.random() < 0.4) {
            const [nom, mot] = CP.un(CP_PAYSAGES), ordre = shuffle(noms.slice());
            return { type: "img", consigne: `Clique sur ${mot}.`, prompt: "", choices: ordre.map((x) => carte(x)), answer: ordre.indexOf(nom) };
          }
          const [question, bon] = CP.un(CP_PAYSAGES_INDICES), ordre = shuffle(noms.slice());
          return { type: "img", consigne: question, prompt: "", choices: ordre.map((x) => carte(x)), answer: ordre.indexOf(bon) };
        }),
          lesson: { rule: ["Au Maroc, il y a <b>la mer</b> : la Méditerranée et l'océan Atlantique.", "Il y a <b>la montagne</b> : l'Atlas, avec de la neige en hiver, et <b>le désert</b> : le Sahara, avec ses dunes."], ex: "Les poissons nagent dans la mer." } },
      ],
    },
  ],
};

/* ================================================================== */
/* Période 2 (novembre-décembre)                                        */
/* ================================================================== */
/* les sons de chaque mot (une transcription simple, son par son) : les listes « avec » et « sans »
   des nouveaux sons en sont tirées, pour qu'un mot ne soit jamais mal rangé. « e » = le son de « le ». */
const CP_PHON = {
  chat: "ch a", lapin: "l a p in", poisson: "p wa s on", souris: "s ou r i", hibou: "i b ou", tortue: "t o r t u", cheval: "ch e v a l",
  lion: "l i on", pomme: "p o m", orange: "o r an j", banane: "b a n a n", ananas: "a n a n a s", carotte: "k a r o t", radis: "r a d i",
  tomate: "t o m a t", salade: "s a l a d", ballon: "b a l on", etoile: "é t wa l", lune: "l u n", plume: "p l u m", livre: "l i v r",
  lit: "l i", table: "t a b l", bol: "b o l", mur: "m u r", tambour: "t an b ou r", gateau: "g a t o", velo: "v é l o", moto: "m o t o",
  voiture: "v wa t u r", avion: "a v i on", fusee: "f u z é", robot: "r o b o", arbre: "a r b r", nez: "n é", fleur: "f l eu r",
  soleil: "s o l è y", cle: "k l é", poule: "p ou l", poussin: "p ou s in", vache: "v a ch", veau: "v o", mouton: "m ou t on",
  agneau: "a gn o", chien: "ch y in", oeuf: "eu f", canard: "k a n a r", bateau: "b a t o", bebe: "b é b é", dent: "d an",
  brosse: "b r o s", savon: "s a v on", pain: "p in", lait: "l è", bonbon: "b on b on", soda: "s o d a", verre: "v è r", tasse: "t a s",
  tapis: "t a p i", de: "d é", domino: "d o m i n o", nid: "n i", feu: "f eu", girafe: "j i r a f", jupe: "j u p", chapeau: "ch a p o",
  mouche: "m ou ch", loup: "l ou", cochon: "k o ch on", chemise: "ch e m i z", renard: "r e n a r", melon: "m e l on",
};
const phonDe = (m) => CP_PHON[m].split(" ");
/* les mots où l'on entend le son, et ceux où on ne l'entend pas (sans son cousin trop proche : u / ou, o / on…) */
const COUSINS = { ou: ["u", "o"], on: ["o", "an"], e: ["é", "è", "eu"], p: ["b"], b: ["p"], t: ["d"], d: ["t"], f: ["v"], v: ["f"], ch: ["j", "s"], j: ["ch"] };
function sonP2(son, indice, consigne) {
  const mots = Object.keys(CP_PHON);
  const avec = mots.filter((m) => phonDe(m).includes(son));
  const sans = mots.filter((m) => !phonDe(m).includes(son) && !(COUSINS[son] || []).some((c) => phonDe(m).includes(c)));
  return { avec, sans, indice, consigne };
}
Object.assign(CP_SONS, {
  p: sonP2("p", ["poule", "pomme", "pain"]), t: sonP2("t", ["tomate", "table", "tortue"]), d: sonP2("d", ["dent", "domino", "de"]),
  b: sonP2("b", ["ballon", "bateau", "banane"]), n: sonP2("n", ["nez", "nid", "domino"]), v: sonP2("v", ["vache", "velo", "veau"]),
  f: sonP2("f", ["fusee", "fleur", "feu"]), j: sonP2("j", ["jupe", "girafe", "orange"]), ch: sonP2("ch", ["chat", "chapeau", "cheval"]),
  ou: sonP2("ou"), on: sonP2("on"),
  e: sonP2("e", null, "Écoute : cheval, melon, renard. Clique sur l'image où tu entends le son « e », comme dans « le » et « cheval »."),
});
/* questionSon sait déjà lire indice ; une consigne à part pour le son « e » */
const questionSonP2 = (son) => {
  const q = questionSon(son);
  if (CP_SONS[son].consigne) q.consigne = CP_SONS[son].consigne;
  return q;
};
/* un son ou l'autre : deux paniers */
function triDeuxSons(a, b, motA, motB) {
  const avecA = CP_SONS[a].avec.filter((m) => !phonDe(m).includes(b)), avecB = CP_SONS[b].avec.filter((m) => !phonDe(m).includes(a));
  return { type: "tri", consigne: `Range chaque image : entends-tu le son de « ${motDe(motA)} », ou celui de « ${motDe(motB)} » ?`, paniers: [`comme ${motDe(motA)}`, `comme ${motDe(motB)}`],
    objets: [...CP.plusieurs(avecA, 3).map((n) => [n, 0]), ...CP.plusieurs(avecB, 3).map((n) => [n, 1])] };
}

/* des mots qu'on sait lire à la période 2 (graphèmes déjà vus), et comment ils s'écrivent */
const CP_MOTS_P2 = { mouton: "mouton", poule: "poule", loup: "loup", domino: "domino", jupe: "jupe", cochon: "cochon", bonbon: "bonbon",
  melon: "melon", savon: "savon", bebe: "bébé", vache: "vache", mouche: "mouche", renard: "renard", tomate: "tomate", moto: "moto",
  velo: "vélo", robot: "robot", tapis: "tapis", tasse: "tasse", chat: "chat" };
const CP_MOTS_OUTILS_P2 = ["est", "sur", "sous", "dans", "avec", "il", "elle", "un", "une", "et"];
/* découpés en syllabes, pour la dictée (sans lettre muette) */
const CP_SYLLABES_P2 = { domino: ["do", "mi", "no"], moto: ["mo", "to"], velo: ["vé", "lo"], tomate: ["to", "ma", "te"], bebe: ["bé", "bé"],
  salade: ["sa", "la", "de"], mouton: ["mou", "ton"], melon: ["me", "lon"], bonbon: ["bon", "bon"], cochon: ["co", "chon"], jupe: ["ju", "pe"],
  poule: ["pou", "le"], savon: ["sa", "von"] };
const toutesSyllabesP2 = [...new Set(Object.values(CP_SYLLABES_P2).flat())];

/* lis la phrase : une petite scène (un animal sur ou sous un meuble), ou quelqu'un qui a un objet */
function sceneAnimal(animal, meuble, ou, t = 180) {
  const m = `<g transform="translate(0 10)">${PICTOS[meuble]}</g>`;
  const a = ou === "sur" ? (meuble === "lit" ? "translate(27 12) scale(.45)" : "translate(28 1) scale(.45)") : "translate(31 60) scale(.37)";
  return `<svg class="picto" width="${t}" height="${t}" viewBox="0 0 100 100" aria-hidden="true"><path d="M2 96 H98" stroke="#2b2236" stroke-width="3" stroke-linecap="round"/>${m}<g transform="${a}">${PICTOS[animal]}</g></svg>`;
}
const sceneAvec = (qui, quoi, t = 180) => `<svg class="picto" width="${t}" height="${t}" viewBox="0 0 100 100" aria-hidden="true"><g transform="translate(0 14) scale(.58)">${PICTOS[qui]}</g><g transform="translate(52 34) scale(.46)">${PICTOS[quoi]}</g></svg>`;
const CP_ANIMAUX_PHRASE = [["chat", "Le chat"], ["poule", "La poule"], ["vache", "La vache"]];
const CP_LIEUX_PHRASE = [["table", "sur", "sur la table"], ["table", "sous", "sous la table"], ["lit", "sur", "sur le lit"]];
const CP_OBJETS_PHRASE = [["bonbon", "un bonbon"], ["ballon", "un ballon"], ["domino", "un domino"], ["tasse", "une tasse"], ["melon", "un melon"], ["jupe", "une jupe"]];
function questionPhrase() {
  if (Math.random() < 0.6) {
    const [an, anTxt] = CP.un(CP_ANIMAUX_PHRASE), lieu = CP.un(CP_LIEUX_PHRASE);
    const autreAnimal = CP.un(CP_ANIMAUX_PHRASE.filter((x) => x[0] !== an))[0], autreLieu = CP.un(CP_LIEUX_PHRASE.filter((x) => x !== lieu));
    const scenes = shuffle([[an, lieu, true], [autreAnimal, lieu, false], [an, autreLieu, false]]);
    return { type: "lis-phrase", consigne: "Lis la phrase, puis clique sur la bonne image.", phrase: `${anTxt} est ${lieu[2]}.`,
      choices: scenes.map(([a, l]) => ({ svg: sceneAnimal(a, l[0], l[1]), cls: "carte", aria: "Une image" })), answer: scenes.findIndex((x) => x[2]) };
  }
  const [obj, objTxt] = CP.un(CP_OBJETS_PHRASE), autres = CP.plusieurs(CP_OBJETS_PHRASE.filter((x) => x[0] !== obj), 2).map((x) => x[0]);
  const choix = shuffle([obj, ...autres]);
  return { type: "lis-phrase", consigne: "Lis la phrase, puis clique sur la bonne image.", phrase: `Le bébé a ${objTxt}.`,
    choices: choix.map((o) => ({ svg: sceneAvec("bebe", o), cls: "carte", aria: "Une image" })), answer: choix.indexOf(obj) };
}
const CP_PHRASES_DICTEE = [["Le", "chat", "est", "sur", "le", "lit."], ["La", "poule", "est", "sous", "la", "table."], ["Le", "bébé", "a", "un", "bonbon."],
  ["Le", "mouton", "est", "sur", "le", "tapis."], ["La", "vache", "a", "une", "tasse."]];

/* les dessins des nombres : la barrette de 10, des images barrées, deux dés pareils, la maison du 10, des crayons */
function barretteSvg(image, n) {
  const dizaines = Math.floor(n / 10), unites = n % 10, c = 46;
  let s = "", x = 4;
  for (let d = 0; d < dizaines; d++) {
    s += `<rect x="${x - 2}" y="2" width="${10 * c + 6}" height="${c + 8}" rx="12" fill="#fff3c4" stroke="#2b2236" stroke-width="3"/>`;
    for (let k = 0; k < 10; k++) s += `<g transform="translate(${x + 3 + k * c} 6) scale(${(c - 4) / 100})">${PICTOS[image]}</g>`;
    x += 10 * c + 18;
  }
  for (let k = 0; k < unites; k++) s += `<g transform="translate(${x + k * c} 6) scale(${(c - 4) / 100})">${PICTOS[image]}</g>`;
  x += unites * c;
  return `<svg width="${Math.min(x, 900)}" height="${c + 12}" viewBox="0 0 ${x} ${c + 12}" aria-hidden="true">${s}</svg>`;
}
function groupeBarre(image, n, enleves, cote = 52) {
  const col = Math.min(5, n), lig = Math.ceil(n / 5);
  const g = Array.from({ length: n }, (_, i) => {
    const x = (i % 5) * cote, y = Math.floor(i / 5) * cote, barre = i >= n - enleves;
    return `<g transform="translate(${x} ${y}) scale(${cote / 100})" opacity="${barre ? 0.45 : 1}">${PICTOS[image]}</g>`
      + (barre ? `<path d="M${x + 6} ${y + 6} L${x + cote - 6} ${y + cote - 6} M${x + cote - 6} ${y + 6} L${x + 6} ${y + cote - 6}" stroke="#e4572e" stroke-width="5" stroke-linecap="round"/>` : "");
  }).join("");
  return `<svg width="${col * cote}" height="${lig * cote}" viewBox="0 0 ${col * cote} ${lig * cote}" aria-hidden="true">${g}</svg>`;
}
function maison10(k) {
  const cases = Array.from({ length: 10 }, (_, i) => { const x = 4 + (i % 5) * 76, y = 4 + Math.floor(i / 5) * 76;
    return `<rect x="${x}" y="${y}" width="70" height="70" rx="10" fill="#fff" stroke="#2b2236" stroke-width="4"/>` + (i < k ? `<g transform="translate(${x + 5} ${y + 5}) scale(.6)">${PICTOS.pomme}</g>` : ""); }).join("");
  return `<svg width="386" height="156" viewBox="0 0 386 156" aria-hidden="true">${cases}</svg>`;
}
const crayonChoix = (l, x, c) => `<svg width="620" height="44" viewBox="0 0 620 44" aria-hidden="true">${crayonSvg(l, x + 6, 6, c, 30)}</svg>`;
const CP_HISTOIRES = [["Yasmine", "elle"], ["Adam", "il"], ["Salma", "elle"], ["Youssef", "il"], ["Inès", "elle"], ["Rayan", "il"]];

const CP_LIRE_P2 = [
  {
    id: "l6", periode: 2, title: "p, t, d, b", picto: "poule", color: "#c2410c", lessons: [
      { id: "l6-1", title: "Le son [p]", bank: CP.serie(() => questionSonP2("p")),
        lesson: { rule: ["La lettre <b>p</b> fait un petit bruit avec les lèvres, comme au début de <b>p</b>oule.", "Écoute chaque mot : entends-tu ce son ?"], ex: "<b>p</b>omme, <b>p</b>ain, ta<b>p</b>is" } },
      { id: "l6-2", title: "Le son [t]", bank: CP.serie(() => questionSonP2("t")),
        lesson: { rule: ["La lettre <b>t</b> se dit avec la langue contre les dents, comme au début de <b>t</b>omate.", "Écoute chaque mot : entends-tu ce son ?"], ex: "<b>t</b>able, <b>t</b>asse, mo<b>t</b>o" } },
      { id: "l6-3", title: "Le son [d]", bank: CP.serie(() => questionSonP2("d")),
        lesson: { rule: ["La lettre <b>d</b> ressemble au [t], mais la gorge vibre, comme au début de <b>d</b>ent.", "Écoute chaque mot : entends-tu ce son ?"], ex: "<b>d</b>omino, <b>d</b>é, sala<b>d</b>e" } },
      { id: "l6-4", title: "Le son [b]", bank: CP.serie(() => questionSonP2("b")),
        lesson: { rule: ["La lettre <b>b</b> ressemble au [p], mais la gorge vibre, comme au début de <b>b</b>allon.", "Écoute chaque mot : entends-tu ce son ?"], ex: "<b>b</b>ateau, <b>b</b>ébé, ro<b>b</b>ot" } },
      { id: "l6-5", title: "[p] ou [b] ?", bank: CP.serie(() => triDeuxSons("p", "b", "poule", "ballon"), 6),
        lesson: { rule: ["[p] et [b] se disent avec les lèvres. Pour le [b], la gorge vibre : pose la main sur ton cou !", "Range chaque image dans le bon panier."], ex: "<b>p</b>oule, <b>b</b>allon" } },
    ],
  },
  {
    id: "l7", periode: 2, title: "n, v, f, j, ch", picto: "vache", color: "#b8452a", lessons: [
      { id: "l7-1", title: "Le son [n]", bank: CP.serie(() => questionSonP2("n")),
        lesson: { rule: ["La lettre <b>n</b> chante dans le nez, comme au début de <b>n</b>id.", "Écoute chaque mot : entends-tu ce son ?"], ex: "<b>n</b>ez, ba<b>n</b>a<b>n</b>e, domi<b>n</b>o" } },
      { id: "l7-2", title: "Le son [v]", bank: CP.serie(() => questionSonP2("v")),
        lesson: { rule: ["La lettre <b>v</b> vibre entre les dents et la lèvre, comme au début de <b>v</b>ache.", "Écoute chaque mot : entends-tu ce son ?"], ex: "<b>v</b>élo, a<b>v</b>ion, sa<b>v</b>on" } },
      { id: "l7-3", title: "Le son [f]", bank: CP.serie(() => questionSonP2("f")),
        lesson: { rule: ["La lettre <b>f</b> souffle comme le vent : « fff », comme au début de <b>f</b>eu.", "Écoute chaque mot : entends-tu ce son ?"], ex: "<b>f</b>usée, <b>f</b>leur, gira<b>f</b>e" } },
      { id: "l7-4", title: "Le son [j]", bank: CP.serie(() => questionSonP2("j")),
        lesson: { rule: ["La lettre <b>j</b> chuinte doucement, comme au début de <b>j</b>upe.", "Attention : « ge » dans orange, et « gi » dans girafe, font aussi [j]."], ex: "<b>j</b>upe, <b>g</b>irafe, oran<b>g</b>e" } },
      { id: "l7-5", title: "Le son [ch]", bank: CP.serie(() => questionSonP2("ch")),
        lesson: { rule: ["Les lettres <b>c</b> et <b>h</b> ensemble font [ch], comme au début de <b>ch</b>at.", "Chut ! C'est le son qu'on fait pour demander le silence."], ex: "<b>ch</b>apeau, va<b>ch</b>e, mou<b>ch</b>e" } },
    ],
  },
  {
    id: "l8", periode: 2, title: "ou, on, e", picto: "mouton", color: "#a8452a", lessons: [
      { id: "l8-1", title: "Le son [ou]", bank: CP.serie(() => questionSonP2("ou")),
        lesson: { rule: ["Les lettres <b>o</b> et <b>u</b> ensemble font [ou], comme dans l<b>ou</b>p.", "Écoute chaque mot : entends-tu [ou] ?"], ex: "p<b>ou</b>le, m<b>ou</b>ton, hib<b>ou</b>" } },
      { id: "l8-2", title: "Le son [on]", bank: CP.serie(() => questionSonP2("on")),
        lesson: { rule: ["Les lettres <b>o</b> et <b>n</b> ensemble font [on], comme dans ball<b>on</b>.", "Écoute chaque mot : entends-tu [on] ?"], ex: "m<b>ou</b>t<b>on</b>, coch<b>on</b>, sav<b>on</b>" } },
      { id: "l8-3", title: "Le son [e], comme dans « le »", bank: CP.serie(() => questionSonP2("e")),
        lesson: { rule: ["La lettre <b>e</b> chante [e], tout doucement, comme dans « l<b>e</b> » et ch<b>e</b>val.", "Ce n'est pas [é] : pas de petit accent."], ex: "ch<b>e</b>val, m<b>e</b>lon, r<b>e</b>nard" } },
      { id: "l8-4", title: "[u] ou [ou] ?", bank: CP.serie(() => triDeuxSons("u", "ou", "lune", "loup"), 6),
        lesson: { rule: ["[u] et [ou] ne sont pas pareils : l<b>u</b>ne, l<b>ou</b>p.", "Pour [u], les lèvres sont toutes rondes et en avant."], ex: "pl<b>u</b>me, p<b>ou</b>le" } },
    ],
  },
  {
    id: "l9", periode: 2, title: "Je lis des phrases", picto: "livre", color: "#962d16", lessons: [
      { id: "l9-1", title: "Lis la syllabe", bank: CP.serie(() => {
        const cs = ["p", "t", "d", "b", "n", "v", "f"], vs = ["a", "i", "o", "u", "é"];
        const c = CP.un(cs), v = CP.un(vs), choix = shuffle([c + v, c + CP.un(vs.filter((x) => x !== v)), CP.un(cs.filter((x) => x !== c)) + v]);
        return { type: "ecoute-ecrit", consigne: "Écoute la syllabe, puis clique sur celle qui est écrite.", dit: c + v, choix, answer: choix.indexOf(c + v) };
      }),
        lesson: { rule: ["Une consonne et une voyelle font une syllabe.", "<b>p</b> et <b>a</b> font <b>pa</b> ; <b>d</b> et <b>o</b> font <b>do</b>."], ex: "pa, to, di, bu, vé" } },
      { id: "l9-2", title: "Lis le mot", bank: CP.serie(() => {
        const choix = CP.plusieurs(Object.keys(CP_MOTS_P2), 3), bon = CP.entre(0, 2);
        return { type: "ecoute-ecrit", consigne: "Écoute le mot, puis clique sur le mot écrit.", dit: motDe(choix[bon]), choix: choix.map((m) => CP_MOTS_P2[m]), answer: bon };
      }),
        lesson: { rule: ["Lis le mot syllabe par syllabe, puis dis-le d'un coup.", "ou, on : deux lettres pour un seul son !"], ex: "mou + ton → <b>mouton</b>" } },
      { id: "l9-3", title: "Lis la phrase", bank: CP.serie(questionPhrase),
        lesson: { rule: ["Une <b>phrase</b> commence par une majuscule et finit par un point.", "Lis chaque mot, puis cherche l'image qui montre toute la phrase."], ex: "Le chat est <b>sur</b> le lit ; la poule est <b>sous</b> la table." } },
      { id: "l9-4", title: "Les petits mots : est, sur, dans…", bank: CP.serie(() => {
        const choix = CP.plusieurs(CP_MOTS_OUTILS_P2, 3), bon = CP.entre(0, 2);
        return { type: "ecoute-ecrit", consigne: "Écoute le petit mot, puis clique sur le mot écrit.", dit: choix[bon], choix, answer: bon };
      }),
        lesson: { rule: ["Encore des petits mots à connaître par cœur : <b>est</b>, <b>sur</b>, <b>sous</b>, <b>dans</b>, <b>avec</b>.", "On les voit dans presque toutes les phrases."], ex: "Le chat <b>est sur</b> le lit." } },
    ],
  },
];

const CP_DICTEE_P2 = [
  {
    id: "d3", periode: 2, title: "J'écris des mots et des phrases", picto: "bebe", color: "#5a3f9b", lessons: [
      { id: "d3-1", title: "Les syllabes avec p, t, d, b…", bank: CP.serie(() => {
        const cs = ["p", "t", "d", "b", "n", "v", "f"], vs = ["a", "i", "o", "u", "é"], c = CP.un(cs), v = CP.un(vs);
        return { type: "dictee-etiquettes", consigne: "Écoute la syllabe, puis écris-la avec les lettres.", mot: c + v, unites: [c, v],
          intrus: [CP.un(cs.filter((x) => x !== c)), CP.un(vs.filter((x) => x !== v))] };
      }),
        lesson: { rule: ["Écoute bien la première lettre : [p] ou [b] ? [t] ou [d] ? [f] ou [v] ?", "Puis écris la voyelle."], ex: "pa, bo, ti, du, fé" } },
      { id: "d3-2", title: "Les mots", bank: CP.serie(() => {
        const m = CP.un(Object.keys(CP_SYLLABES_P2)), unites = CP_SYLLABES_P2[m];
        return { type: "dictee-etiquettes", consigne: "Écoute le mot, puis écris-le avec les syllabes.", mot: motDe(m), unites, intrus: CP.plusieurs(toutesSyllabesP2.filter((x) => !unites.includes(x)), 2) };
      }),
        lesson: { rule: ["Dis le mot lentement, en tapant dans tes mains.", "Écris une syllabe à chaque clap."], ex: "do-mi-no → <b>domino</b>" } },
      { id: "d3-3", title: "Les petits mots : est, sur, avec…", bank: CP.serie(() => {
        const m = CP.un(["est", "sur", "sous", "dans", "avec"]), unites = m.split("");
        return { type: "dictee-etiquettes", consigne: "Écoute le petit mot, puis écris-le avec les lettres.", mot: m, unites,
          intrus: CP.plusieurs(["a", "e", "i", "o", "u", "l", "n", "s", "t", "r", "d", "c"].filter((x) => !unites.includes(x)), 2) };
      }),
        lesson: { rule: ["<b>est</b> s'écrit avec un <b>s</b> et un <b>t</b> qu'on n'entend pas.", "<b>sur</b>, <b>sous</b>, <b>dans</b>, <b>avec</b> : on les apprend par cœur."], ex: "Le chat <b>est</b> <b>sur</b> le lit." } },
      { id: "d3-4", title: "J'écris la phrase", bank: CP.serie(() => {
        const unites = CP.un(CP_PHRASES_DICTEE), autres = ["sur", "sous", "un", "une", "le", "la", "est"].filter((x) => !unites.includes(x));
        return { type: "dictee-etiquettes", consigne: "Écoute la phrase, puis écris-la avec les étiquettes de mots.", mot: unites.join(" "), unites, sep: " ",
          intrus: CP.plusieurs(autres, 2) };
      }, 6),
        lesson: { rule: ["Une phrase est faite de <b>mots</b>, séparés par des espaces.", "Elle commence par une majuscule et finit par un point."], ex: "<b>Le</b> chat est sur le lit<b>.</b>" } },
    ],
  },
];

const CP_COMPTER_P2 = [
  {
    id: "c5", periode: 2, title: "Les nombres jusqu'à 20", picto: "n15", color: "#1f6fbf", lessons: [
      { id: "c5-1", title: "Compter jusqu'à 20", bank: CP.serie(() => {
        const [image, pluriel] = CP.un(CP_A_COMPTER), n = CP.entre(11, 20), choix = nombresAutour(n, 10, 20);
        return { type: "img", consigne: `Combien y a-t-il de ${pluriel} ? La boîte jaune en contient toujours dix.`, prompt: `<div class="groupes">${barretteSvg(image, n)}</div>`,
          choices: choix.map((k) => choixNombre(k)), answer: choix.indexOf(n) };
      }),
        lesson: { rule: ["Pour compter beaucoup d'objets, on fait un paquet de <b>dix</b>.", "Puis on continue à partir de dix : onze, douze, treize…"], ex: "dix et trois → <b>treize</b> (13)" } },
      { id: "c5-2", title: "Lis le nombre jusqu'à 20", bank: CP.serie(() => {
        const n = CP.entre(10, 20), choix = nombresAutour(n, 10, 20).map(String);
        return { type: "ecoute-ecrit", consigne: "Écoute le nombre, puis clique sur le nombre écrit.", dit: NOMS_NOMBRES[n], choix, answer: choix.indexOf(String(n)) };
      }),
        lesson: { rule: ["De 11 à 19, le premier chiffre est un <b>1</b> : c'est le paquet de dix.", "Le deuxième chiffre dit combien il y en a en plus."], ex: "seize → <b>16</b> : dix et six" } },
      { id: "c5-3", title: "Le plus grand jusqu'à 20", bank: CP.serie(() => {
        const choix = CP.plusieurs(Array.from({ length: 21 }, (_, k) => k), 3), grand = Math.random() < 0.5, cible = grand ? Math.max(...choix) : Math.min(...choix);
        return { type: "img", consigne: grand ? "Clique sur le plus grand nombre." : "Clique sur le plus petit nombre.", prompt: "", choices: choix.map((k) => choixNombre(k)), answer: choix.indexOf(cible) };
      }),
        lesson: { rule: ["Un nombre avec deux chiffres, comme 12, est plus grand qu'un nombre avec un seul chiffre, comme 9.", "Entre 14 et 17, on regarde le deuxième chiffre."], ex: "17 est plus grand que 14" } },
      { id: "c5-4", title: "Range jusqu'à 20", bank: CP.serie(() => ({
        type: "suite-images", consigne: "Range les nombres du plus petit au plus grand.",
        images: CP.plusieurs(Array.from({ length: 21 }, (_, k) => k), 4).sort((a, b) => a - b).map((k) => "n" + k),
      }), 6),
        lesson: { rule: ["On commence par le plus petit, et on finit par le plus grand.", "Pense à la file des nombres : 0, 1, 2… jusqu'à 20."], ex: "3, 9, 12, 18" } },
    ],
  },
  {
    id: "c6", periode: 2, title: "Décomposer et retirer", picto: "de", color: "#2a6fb8", lessons: [
      { id: "c6-1", title: "Les doubles", bank: CP.serie(() => {
        const k = CP.entre(1, 5), choix = nombresAutour(2 * k, 2, 10);
        return { type: "img", consigne: "Deux dés pareils : combien de points en tout ?", prompt: `<div class="des" style="gap:20px">${desSvg(k, 100)}${desSvg(k, 100)}</div>`,
          choices: choix.map((x) => choixNombre(x)), answer: choix.indexOf(2 * k) };
      }),
        lesson: { rule: ["Un <b>double</b>, c'est deux fois le même nombre.", "1 et 1 font 2 ; 2 et 2 font 4 ; 3 et 3 font 6 ; 4 et 4 font 8 ; 5 et 5 font 10."], ex: "le double de 3 → <b>6</b>" } },
      { id: "c6-2", title: "La maison du 10", bank: CP.serie(() => {
        const k = CP.entre(1, 9), choix = nombresAutour(10 - k, 0, 10, 4);
        return { type: "img", consigne: "La maison du 10 a dix cases. Combien de pommes manque-t-il pour la remplir ?", prompt: `<div class="groupes">${maison10(k)}</div>`,
          choices: choix.map((x) => choixNombre(x)), answer: choix.indexOf(10 - k) };
      }),
        lesson: { rule: ["Pour faire 10, on compte les cases vides.", "7 et 3 font 10 ; 6 et 4 font 10 ; 5 et 5 font 10."], ex: "7 pommes → il en manque <b>3</b>" } },
      { id: "c6-3", title: "Retirer : combien en reste-t-il ?", bank: CP.serie(() => {
        const [image, pluriel] = CP.un(CP_A_COMPTER), n = CP.entre(3, 10), r = CP.entre(1, n - 1), choix = nombresAutour(n - r, 0, 10);
        return { type: "img", consigne: `Il y avait ${NOMS_NOMBRES[n]} ${pluriel}. On en enlève ${NOMS_NOMBRES[r]}. Combien en reste-t-il ?`, prompt: `<div class="groupes"><span class="boite">${groupeBarre(image, n, r)}</span></div>`,
          choices: choix.map((x) => choixNombre(x)), answer: choix.indexOf(n - r) };
      }),
        lesson: { rule: ["Quand on <b>retire</b>, il en reste moins.", "On compte seulement les images qui ne sont pas barrées."], ex: "6 pommes, on en enlève 2 → il en reste <b>4</b>" } },
      { id: "c6-4", title: "Ajouter ou retirer ?", bank: CP.serie(() => {
        const [image, pluriel] = CP.un(CP_A_COMPTER), [qui, pr] = CP.un(CP_HISTOIRES), gagne = Math.random() < 0.5, a = CP.entre(2, 6), b = CP.entre(1, 3);
        const histoire = gagne ? `${qui} a ${NOMS_NOMBRES[a]} ${pluriel}. Boulon lui en donne ${NOMS_NOMBRES[b]}.` : `${qui} a ${NOMS_NOMBRES[a + b]} ${pluriel}. ${pr === "il" ? "Il" : "Elle"} en perd ${NOMS_NOMBRES[b]}.`;
        return { type: "img", consigne: `${histoire} ${qui} en a-t-${pr} plus, ou moins ? On ajoute, ou on retire ?`, prompt: "",
          choices: [{ cls: "jour", text: "+ On ajoute", dire: "On ajoute", aria: "On ajoute" }, { cls: "jour", text: "− On retire", dire: "On retire", aria: "On retire" }], answer: gagne ? 0 : 1 };
      }),
        lesson: { rule: ["Quand on <b>reçoit</b>, on en a plus : on <b>ajoute</b> (+).", "Quand on <b>perd</b> ou qu'on <b>mange</b>, on en a moins : on <b>retire</b> (−)."], ex: "on me donne 2 bonbons → + ; j'en mange 2 → −" } },
    ],
  },
  {
    id: "c7", periode: 2, title: "Problèmes et longueurs", picto: "crayon-9", color: "#3a5fa8", lessons: [
      { id: "c7-1", title: "Petits problèmes", bank: CP.serie(() => {
        const [image, pluriel] = CP.un(CP_A_COMPTER), [qui, pr] = CP.un(CP_HISTOIRES), gagne = Math.random() < 0.5;
        if (gagne) {
          const a = CP.entre(1, 6), b = CP.entre(1, Math.min(4, 10 - a)), choix = nombresAutour(a + b, 1, 10);
          return { type: "img", consigne: `${qui} a ${NOMS_NOMBRES[a]} ${a > 1 ? pluriel : motDe(image)}. Boulon lui en donne ${NOMS_NOMBRES[b]}. Combien en a-t-${pr} maintenant ?`,
            prompt: `<div class="groupes"><span class="boite">${groupeSvg(image, a)}</span><span class="plus">+</span><span class="boite">${groupeSvg(image, b)}</span></div>`,
            choices: choix.map((k) => choixNombre(k)), answer: choix.indexOf(a + b) };
        }
        const n = CP.entre(3, 10), r = CP.entre(1, n - 1), choix = nombresAutour(n - r, 0, 10);
        return { type: "img", consigne: `${qui} a ${NOMS_NOMBRES[n]} ${pluriel}. ${pr === "il" ? "Il" : "Elle"} en mange ${NOMS_NOMBRES[r]}. Combien lui en reste-t-il ?`,
          prompt: `<div class="groupes"><span class="boite">${groupeBarre(image, n, r)}</span></div>`, choices: choix.map((k) => choixNombre(k)), answer: choix.indexOf(n - r) };
      }),
        lesson: { rule: ["Écoute bien l'histoire : on en reçoit (on ajoute), ou on en perd (on retire) ?", "Regarde les images pour t'aider."], ex: "j'ai 5 bonbons, j'en mange 2 → il en reste <b>3</b>" } },
      { id: "c7-2", title: "Le plus long, le plus court", bank: CP.serie(() => {
        const coul = shuffle(["#e4572e", "#2e86de", "#7bc950", "#f6c445", "#8e6cc9"]);
        const longs = CP.plusieurs([220, 280, 340, 400, 460, 520], 3), long = Math.random() < 0.6, cible = long ? Math.max(...longs) : Math.min(...longs);
        return { type: "img", consigne: long ? "Clique sur le crayon le plus long." : "Clique sur le crayon le plus court.", prompt: "",
          choices: longs.map((l, i) => ({ svg: crayonChoix(l, CP.entre(0, 600 - l - 20), coul[i]), cls: "crayon", aria: "Un crayon" })), answer: longs.indexOf(cible) };
      }),
        lesson: { rule: ["Pour comparer deux longueurs, il faut les mettre <b>côte à côte</b>, au même départ.", "Attention : un crayon qui commence plus loin n'est pas forcément plus long !"], ex: "le crayon bleu est le plus long" } },
      { id: "c7-3", title: "Range du plus court au plus long", bank: CP.serie(() => ({
        type: "suite-images", consigne: "Range les crayons du plus court au plus long.",
        images: CP.plusieurs([3, 4, 5, 6, 7, 8, 9], 4).sort((a, b) => a - b).map((k) => "crayon-" + k),
      }), 6),
        lesson: { rule: ["On commence par le plus court.", "Puis on prend à chaque fois le plus court de ceux qui restent."], ex: "le rouge, le jaune, le bleu, le rose" } },
    ],
  },
];

const CP_PETITS = [["poule", "poussin", "de la poule", "du poussin"], ["vache", "veau", "de la vache", "du veau"], ["mouton", "agneau", "du mouton", "de l'agneau"], ["chien", "chiot", "du chien", "du chiot"]];
const CP_SCIENCES_P2 = [
  {
    id: "s2", periode: 2, title: "Les animaux et leurs petits", picto: "poussin", color: "#c25a1a", lessons: [
      { id: "s2-1", title: "Qui est le petit de… ?", bank: CP.serie(() => {
        const paire = CP.un(CP_PETITS), autres = CP.plusieurs(CP_PETITS.filter((p) => p !== paire), 2), petit = Math.random() < 0.6;
        const choix = shuffle([paire, ...autres]);
        return { type: "img", consigne: petit ? `Qui est le petit ${paire[2]} ?` : `Qui est la maman ${paire[3]} ?`,
          prompt: `<div class="groupes"><span class="boite">${picto(petit ? paire[0] : paire[1], 120)}</span></div>`,
          choices: choix.map((p) => carte(petit ? p[1] : p[0])), answer: choix.indexOf(paire) };
      }),
        lesson: { rule: ["Les petits ressemblent souvent à leurs parents, en plus petit.", "Ils ont un nom à eux : le poussin, le veau, l'agneau, le chiot."], ex: "le petit de la poule est le <b>poussin</b>" } },
      { id: "s2-2", title: "Œuf ou pas œuf ?", bank: CP.serie(() => ({
        type: "tri", consigne: "Range chaque animal : il pond des œufs, ou il n'en pond pas ?", paniers: ["il pond des œufs", "pas d'œufs"],
        objets: [...CP.plusieurs(["poule", "canard", "tortue", "poisson"], 3).map((n) => [n, 0]), ...CP.plusieurs(["vache", "chien", "chat", "lapin", "cheval", "mouton"], 3).map((n) => [n, 1])],
      })),
        lesson: { rule: ["Certains animaux naissent dans un <b>œuf</b> : les oiseaux, les tortues, les poissons.", "D'autres naissent du ventre de leur maman : la vache, le chien, le chat."], ex: "le poussin sort de l'œuf ; le veau naît du ventre de la vache" } },
    ],
  },
  {
    id: "s3", periode: 2, title: "Bien manger, bien grandir", picto: "pomme", color: "#d4691e", lessons: [
      { id: "s3-1", title: "Tous les jours, ou de temps en temps ?", bank: CP.serie(() => ({
        type: "tri", consigne: "Range chaque aliment : on en mange tous les jours, ou seulement de temps en temps ?", paniers: ["tous les jours", "de temps en temps"],
        objets: [...CP.plusieurs(["pomme", "carotte", "pain", "lait", "salade", "banane", "verre", "orange"], 3).map((n) => [n, 0]), ...CP.plusieurs(["bonbon", "gateau", "soda"], 3).map((n) => [n, 1])],
      })),
        lesson: { rule: ["Tous les jours : des fruits, des légumes, du pain, du lait, et de l'<b>eau</b>.", "Les bonbons, les gâteaux et le soda sont très sucrés : seulement de temps en temps."], ex: "une pomme au goûter, un gâteau pour la fête" } },
      { id: "s3-2", title: "Les dents et la toilette", bank: CP.serie(() => {
        const r = Math.random();
        if (r < 0.35) return { type: "tri", consigne: "Range chaque image : c'est bon pour les dents, ou mauvais pour les dents ?", paniers: ["bon pour les dents", "mauvais pour les dents"],
          objets: [...CP.plusieurs(["pomme", "carotte", "lait", "verre"], 3).map((n) => [n, 0]), ...CP.plusieurs(["bonbon", "soda", "gateau"], 3).map((n) => [n, 1])] };
        const [question, bon] = CP.un([["Avec quoi te brosses-tu les dents ?", "brosse"], ["Avec quoi te laves-tu les mains ?", "savon"], ["Que bois-tu quand tu as soif ?", "verre"]]);
        const choix = shuffle([bon, ...CP.plusieurs(["brosse", "savon", "verre", "tasse", "chapeau", "jupe"].filter((x) => x !== bon), 2)]);
        return { type: "img", consigne: question, prompt: "", choices: choix.map((n) => carte(n)), answer: choix.indexOf(bon) };
      }),
        lesson: { rule: ["On se brosse les dents matin et soir, avec une <b>brosse à dents</b>.", "On se lave les mains avec du <b>savon</b>, avant de manger et après les toilettes."], ex: "le sucre abîme les dents ; la brosse les nettoie" } },
    ],
  },
];
CP_LIRE.chapters.push(...CP_LIRE_P2);
CP_DICTEE.chapters.push(...CP_DICTEE_P2);
CP_COMPTER.chapters.push(...CP_COMPTER_P2);
CP_SCIENCES.chapters.push(...CP_SCIENCES_P2);
/* tout ce qui n'a pas de période est de la période 1 */
for (const s of [CP_LIRE, CP_DICTEE, CP_COMPTER, CP_SCIENCES, CP_TEMPS, CP_MONDE]) for (const ch of s.chapters) ch.periode = ch.periode || 1;

/* index des matières et des leçons (CONTENT et LESSONS sont créés par le moteur) */
for (const subj of [CP_LIRE, CP_DICTEE, CP_COMPTER, CP_SCIENCES, CP_TEMPS, CP_MONDE]) {
  CONTENT[subj.id] = subj;
  for (const ch of subj.chapters) {
    ch.subject = subj.id;
    ch.lessons.forEach((l, i) => { l.chapter = ch; l.subject = subj.id; l.index = i; LESSONS[l.id] = l; });
  }
}
