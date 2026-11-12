/* L'Atelier de Boulon — Histoire (CE2), avec un axe sur le Maroc.
   HIST_FICHES : personnages, constructions, découvertes et repères, utilisés par les leçons,
   la frise du temps et ses missions. Dates : année (négative = avant J.-C.) ; pour une découverte,
   la date est l'âge de l'objet trouvé, l'année de la découverte est dans le texte. */
"use strict";

const HIST_PERIODES = [
  { id: "avant", nom: "Avant les humains", court: "Avant les humains", fin: -300000, couleur: "#8a8095" },
  { id: "prehistoire", nom: "la Préhistoire", court: "Préhistoire", fin: -3300, couleur: "#9c6b3c" },
  { id: "antiquite", nom: "l'Antiquité", court: "Antiquité", fin: 476, couleur: "#e0a800" },
  { id: "moyenage", nom: "le Moyen Âge", court: "Moyen Âge", fin: 1492, couleur: "#3fa34d" },
  { id: "modernes", nom: "les Temps modernes", court: "Temps modernes", fin: 1789, couleur: "#2e86de" },
  { id: "contemporain", nom: "l'époque contemporaine", court: "Époque contemporaine", fin: Infinity, couleur: "#8e6cc9" },
];
function periodeDe(annee) { return HIST_PERIODES.find((p) => annee < p.fin) || HIST_PERIODES[HIST_PERIODES.length - 1]; }

/* chiffres romains (pour les siècles) */
function romain(n) {
  const t = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
  let s = "";
  for (const [v, r] of t) while (n >= v) { s += r; n -= v; }
  return s;
}
const siecleDe = (annee) => Math.floor((annee - 1) / 100) + 1;      // années après J.-C.
const siecleTexte = (annee) => `${romain(siecleDe(annee))}e siècle`;

/* cat : repere | savant | construction | decouverte ; maroc : lié au Maroc */
const HIST_FICHES = [
  /* ---------- repères ---------- */
  { id: "ecriture", cat: "repere", e: "📜", titre: "L'invention de l'écriture", annee: -3300, date: "vers 3300 av. J.-C.", lieu: "Mésopotamie (Irak actuel)",
    texte: "Les premiers textes sont gravés sur des tablettes d'argile. L'invention de l'écriture marque la fin de la Préhistoire et le début de l'Antiquité." },
  { id: "hegire", cat: "repere", e: "🌙", titre: "L'hégire", annee: 622, date: "622", lieu: "de La Mecque à Médine",
    texte: "Le prophète Mohammed quitte La Mecque pour Médine. Cette année est l'an 1 du calendrier musulman, le calendrier de l'hégire." },
  { id: "idriss", cat: "repere", maroc: true, e: "👑", titre: "Idriss Ier et les Idrissides", annee: 788, date: "788", lieu: "Volubilis (Walili), Maroc",
    texte: "Idriss Ier arrive à Volubilis et fonde la dynastie des Idrissides. C'est le début du premier État marocain musulman." },
  { id: "fes", cat: "repere", maroc: true, e: "🏙️", titre: "La fondation de Fès", annee: 789, date: "789", lieu: "Fès, Maroc",
    texte: "Idriss Ier fonde Fès en 789, puis son fils Idriss II l'agrandit. Fès devient une grande capitale du savoir." },
  { id: "marrakech", cat: "repere", maroc: true, e: "🌴", titre: "La fondation de Marrakech", annee: 1070, date: "vers 1070", lieu: "Marrakech, Maroc",
    texte: "Les Almoravides fondent Marrakech. La ville a donné son nom au pays : en français, Maroc vient de « Marrakech »." },
  { id: "almohades", cat: "repere", maroc: true, e: "⚔️", titre: "Les Almohades", annee: 1147, date: "1147", lieu: "Marrakech, Maroc",
    texte: "Les Almohades prennent Marrakech. Leur empire s'étend sur tout le Maghreb et une partie de l'Espagne. Ils construisent la Koutoubia et la Tour Hassan." },
  { id: "saadiens", cat: "repere", maroc: true, e: "🏺", titre: "Les Saadiens", annee: 1554, date: "XVIe siècle", lieu: "Marrakech, Maroc",
    texte: "La dynastie saadienne règne sur le Maroc. Le sultan Ahmed al-Mansour fait construire le palais El Badi à Marrakech." },
  { id: "alaouites", cat: "repere", maroc: true, e: "🕌", titre: "Les Alaouites", annee: 1666, date: "1666", lieu: "Fès, Maroc",
    texte: "Moulay Rachid prend Fès en 1666. La dynastie alaouite règne encore aujourd'hui sur le Maroc." },
  { id: "colomb", cat: "repere", e: "⛵", titre: "Christophe Colomb arrive en Amérique", annee: 1492, date: "1492", lieu: "Amérique",
    texte: "Cette traversée de l'océan Atlantique marque la fin du Moyen Âge et le début des Temps modernes." },
  { id: "revolution", cat: "repere", e: "⚖️", titre: "La Révolution française", annee: 1789, date: "1789", lieu: "France",
    texte: "Cette révolution marque le début de l'époque contemporaine sur la frise du temps." },
  { id: "independance", cat: "repere", maroc: true, e: "🕊️", titre: "L'indépendance du Maroc", annee: 1956, date: "1956", lieu: "Maroc",
    texte: "Le 2 mars 1956, le Maroc retrouve son indépendance. Le roi Mohammed V est accueilli comme un héros." },
  /* ---------- savants et innovateurs ---------- */
  { id: "fihriya", cat: "savant", maroc: true, e: "👩‍🏫", titre: "Fatima al-Fihriya", annee: 859, date: "859", lieu: "Fès, Maroc",
    texte: "Fatima al-Fihriya utilise l'héritage de son père pour fonder la mosquée Al Quaraouiyine à Fès. Elle devient un grand lieu d'études : c'est la plus ancienne université encore en activité dans le monde." },
  { id: "idrissi", cat: "savant", maroc: true, e: "🗺️", titre: "Al-Idrissi, le géographe", annee: 1154, date: "1154", lieu: "né à Sebta (Ceuta), il travaille en Sicile",
    texte: "Al-Idrissi dessine pour le roi Roger II de Sicile une immense carte du monde connu, accompagnée d'un livre qui décrit les pays. Elle sera utilisée pendant des siècles." },
  { id: "ibnrochd", cat: "savant", maroc: true, e: "📚", titre: "Ibn Rochd (Averroès)", annee: 1170, date: "1126 – 1198", lieu: "Cordoue et Marrakech",
    texte: "Né à Cordoue, Ibn Rochd est médecin, juge et philosophe. Il travaille à la cour des Almohades et meurt à Marrakech. Ses livres ont été lus dans le monde entier." },
  { id: "ibnbanna", cat: "savant", maroc: true, e: "🔢", titre: "Ibn al-Banna, le mathématicien", annee: 1300, date: "1256 – 1321", lieu: "Marrakech, Maroc",
    texte: "Ibn al-Banna al-Marrakchi est un mathématicien et astronome de Marrakech. Il a écrit des livres de calcul étudiés pendant des siècles." },
  { id: "battuta", cat: "savant", maroc: true, e: "🧭", titre: "Ibn Battuta, le grand voyageur", annee: 1325, date: "1325", lieu: "départ de Tanger, Maroc",
    texte: "En 1325, Ibn Battuta quitte Tanger. Il voyage près de 30 ans, de l'Afrique jusqu'à la Chine, et parcourt environ 120 000 km. Il raconte tout dans un livre, la Rihla." },
  { id: "yazami", cat: "savant", maroc: true, e: "🔋", titre: "Rachid Yazami, l'inventeur", annee: 1980, date: "1980", lieu: "né à Fès, Maroc",
    texte: "Né à Fès, le scientifique Rachid Yazami a participé à l'invention des batteries au lithium qui font marcher nos téléphones. Il a reçu un grand prix d'ingénierie en 2014." },
  /* ---------- grandes constructions ---------- */
  { id: "volubilis", cat: "construction", maroc: true, e: "🏛️", titre: "Volubilis", annee: -250, date: "IIIe siècle av. J.-C.", lieu: "près de Meknès, Maroc",
    texte: "Ville antique devenue romaine, avec ses arcs, ses colonnes et ses maisons décorées de mosaïques. Elle est inscrite au patrimoine mondial de l'UNESCO." },
  { id: "quaraouiyine", cat: "construction", maroc: true, e: "🕌", titre: "Al Quaraouiyine", annee: 859, date: "859", lieu: "Fès, Maroc",
    texte: "Mosquée et université fondée par Fatima al-Fihriya. On y étudie depuis plus de 1 100 ans : c'est la plus ancienne université encore en activité." },
  { id: "koutoubia", cat: "construction", maroc: true, e: "🕌", titre: "La Koutoubia", annee: 1158, date: "XIIe siècle", lieu: "Marrakech, Maroc",
    texte: "Construite par les Almohades, la mosquée de la Koutoubia a un minaret d'environ 77 mètres. Il sert de modèle à d'autres minarets." },
  { id: "tourhassan", cat: "construction", maroc: true, e: "🗼", titre: "La Tour Hassan", annee: 1195, date: "vers 1195", lieu: "Rabat, Maroc",
    texte: "Le sultan almohade Yacoub al-Mansour voulait bâtir une immense mosquée. Elle n'a jamais été terminée : il reste la tour, haute de 44 mètres, et des colonnes." },
  { id: "bouinania", cat: "construction", maroc: true, e: "🎨", titre: "La médersa Bou Inania", annee: 1355, date: "vers 1355", lieu: "Fès, Maroc",
    texte: "Une médersa est une école où logent les étudiants. Celle-ci, construite par les Mérinides, est décorée de zellige, de bois sculpté et de plâtre ciselé." },
  { id: "badi", cat: "construction", maroc: true, e: "🏰", titre: "Le palais El Badi", annee: 1578, date: "1578", lieu: "Marrakech, Maroc",
    texte: "Le sultan saadien Ahmed al-Mansour fait construire ce palais immense, avec de grands bassins. Il n'en reste aujourd'hui que les murs." },
  { id: "aitbenhaddou", cat: "construction", maroc: true, e: "🏜️", titre: "Le ksar d'Aït-Ben-Haddou", annee: 1650, date: "XVIIe siècle", lieu: "près de Ouarzazate, Maroc",
    texte: "Un ksar est un village fortifié. Celui-ci est construit en terre crue (le pisé). Il est inscrit au patrimoine mondial de l'UNESCO depuis 1987." },
  { id: "babmansour", cat: "construction", maroc: true, e: "🚪", titre: "Bab Mansour", annee: 1732, date: "1732", lieu: "Meknès, Maroc",
    texte: "Cette porte monumentale a été voulue par le sultan Moulay Ismaïl, qui avait fait de Meknès sa capitale. Elle est couverte de zellige." },
  { id: "hassan2", cat: "construction", maroc: true, e: "🕌", titre: "La mosquée Hassan II", annee: 1993, date: "1993", lieu: "Casablanca, Maroc",
    texte: "Construite en partie au-dessus de l'océan Atlantique, elle a un minaret de 210 mètres, l'un des plus hauts du monde." },
  { id: "pyramide", cat: "construction", e: "🔺", titre: "La pyramide de Khéops", annee: -2560, date: "vers 2560 av. J.-C.", lieu: "Gizeh, Égypte",
    texte: "Tombeau du pharaon Khéops, haute d'environ 146 mètres à l'origine. C'est la seule des sept merveilles du monde antique encore debout." },
  { id: "muraille", cat: "construction", e: "🧱", titre: "La Grande Muraille de Chine", annee: -220, date: "à partir du IIIe siècle av. J.-C.", lieu: "Chine",
    texte: "Une très longue muraille construite et agrandie pendant des siècles pour protéger la Chine." },
  { id: "colisee", cat: "construction", e: "🏟️", titre: "Le Colisée", annee: 80, date: "80", lieu: "Rome, Italie",
    texte: "Un immense amphithéâtre romain où des milliers de spectateurs assistaient aux spectacles." },
  { id: "eiffel", cat: "construction", e: "🗼", titre: "La tour Eiffel", annee: 1889, date: "1889", lieu: "Paris, France",
    texte: "Construite en fer pour l'Exposition universelle de 1889, elle mesure aujourd'hui 330 mètres." },
  /* ---------- découvertes (la date est l'âge des objets) ---------- */
  { id: "spinosaurus", cat: "decouverte", maroc: true, e: "🦖", titre: "Le Spinosaurus du Kem Kem", annee: -95000000, date: "il y a 95 millions d'années", lieu: "Kem Kem, sud-est du Maroc",
    texte: "Des fossiles trouvés au Maroc ont montré que ce dinosaure géant, long d'environ 15 mètres, vivait près de l'eau et nageait. Ce sont des paléontologues qui étudient les fossiles." },
  { id: "irhoud", cat: "decouverte", maroc: true, e: "💀", titre: "Les fossiles de Jebel Irhoud", annee: -300000, date: "il y a environ 300 000 ans", lieu: "Jebel Irhoud, près de Safi, Maroc",
    texte: "Découverts à partir de 1961 dans une mine, ces fossiles ont été datés en 2017 : ce sont les plus anciens Homo sapiens connus, c'est-à-dire des humains comme nous !" },
  { id: "bizmoune", cat: "decouverte", maroc: true, e: "🐚", titre: "Les perles de Bizmoune", annee: -145000, date: "il y a environ 145 000 ans", lieu: "grotte de Bizmoune, près d'Essaouira, Maroc",
    texte: "Des petits coquillages percés, portés comme bijoux. Publiés en 2021, ils comptent parmi les plus anciennes parures connues au monde." },
  { id: "oukaimeden", cat: "decouverte", maroc: true, e: "🪨", titre: "Les gravures de l'Oukaïmeden", annee: -2000, date: "il y a 3 000 à 4 000 ans", lieu: "Haut Atlas, Maroc",
    texte: "Sur les rochers de ce plateau de montagne, les hommes ont gravé des animaux, des armes et des dessins. On les appelle des gravures rupestres." },
  { id: "mosaiques", cat: "decouverte", maroc: true, e: "🖼️", titre: "Les mosaïques de Volubilis", annee: 200, date: "IIe – IIIe siècle", lieu: "Volubilis, Maroc",
    texte: "Les fouilles commencées en 1915 ont dégagé de magnifiques mosaïques faites de milliers de petites pierres colorées, toujours visibles sur place." },
  { id: "saadiens-tombeaux", cat: "decouverte", maroc: true, e: "⚱️", titre: "Les tombeaux saadiens", annee: 1590, date: "fin du XVIe siècle", lieu: "Marrakech, Maroc",
    texte: "Ces tombeaux des sultans saadiens, cachés derrière des murs, ont été redécouverts en 1917. On peut admirer leur décor de marbre et de zellige." },
  { id: "lascaux", cat: "decouverte", e: "🐂", titre: "La grotte de Lascaux", annee: -17000, date: "il y a environ 18 000 ans", lieu: "France",
    texte: "En 1940, quatre adolescents découvrent une grotte couverte de peintures d'animaux faites par les hommes de la Préhistoire." },
  { id: "toutankhamon", cat: "decouverte", e: "👑", titre: "Le tombeau de Toutânkhamon", annee: -1323, date: "vers 1323 av. J.-C.", lieu: "Vallée des Rois, Égypte",
    texte: "En 1922, l'archéologue Howard Carter découvre le tombeau presque intact de ce jeune pharaon, rempli de trésors, dont un masque en or." },
  { id: "rosette", cat: "decouverte", e: "🪨", titre: "La pierre de Rosette", annee: -196, date: "196 av. J.-C.", lieu: "Égypte",
    texte: "Trouvée en 1799, cette pierre porte le même texte en trois écritures. Grâce à elle, Champollion a réussi à lire les hiéroglyphes en 1822." },
  { id: "terrecuite", cat: "decouverte", e: "🗿", titre: "L'armée de terre cuite", annee: -210, date: "vers 210 av. J.-C.", lieu: "Xi'an, Chine",
    texte: "En 1974, des paysans qui creusaient un puits découvrent des milliers de soldats en terre cuite qui gardaient le tombeau du premier empereur de Chine." },
  { id: "pompei", cat: "decouverte", e: "🌋", titre: "Pompéi", annee: 79, date: "79", lieu: "Italie",
    texte: "Cette ville romaine a été ensevelie par l'éruption du Vésuve en 79. Les fouilles, commencées au XVIIIe siècle, ont révélé des rues et des maisons intactes." },
];
const HF = Object.fromEntries(HIST_FICHES.map((f) => [f.id, f]));
const HIST_CATS = { repere: ["📌", "Repères"], savant: ["🧑‍🔬", "Savants et innovateurs"], construction: ["🏛️", "Grandes constructions"], decouverte: ["⛏️", "Découvertes"] };

/* ------------------------------------------------------------------ */
/* Questions générées à partir des fiches                              */
/* ------------------------------------------------------------------ */
const HQ = {
  periode(f) {
    const p = periodeDe(f.annee);
    const autres = HIST_PERIODES.filter((x) => x !== p && x.id !== "avant").map((x) => x.court);
    return QS.qcm(`À quelle période appartient : ${f.titre} (${f.date}) ?`, p.court, sample(autres, 2), `<span style="font-size:44px">${f.e}</span>`);
  },
  ordre(fiches, consigne = "Remets dans l'ordre, du plus ancien au plus récent.") {
    const tri = [...fiches].sort((a, b) => a.annee - b.annee);
    return QS.ordre(consigne, tri.map((f) => f.titre), " → ");
  },
  ou(f, pool) {
    const ville = (x) => x.lieu.split(",")[0].replace(/^près de /, "");
    const autres = [...new Set(pool.filter((x) => ville(x) !== ville(f)).map(ville))];
    return QS.qcm(`Où se trouve ${f.titre.replace(/^(La|Le|Les|L')\s?/, (m) => m.toLowerCase())} ?`, ville(f), sample(autres, 2), `<span style="font-size:44px">${f.e}</span>`);
  },
  qui(f, pool, question) {
    return QS.qcm(question, f.titre, sample(pool.filter((x) => x !== f).map((x) => x.titre), 2));
  },
};
const ordreDe = (ids) => HQ.ordre(sample(ids, Math.min(4, ids.length)).map((i) => HF[i]));

const HIST_BANQUES = {
  /* ---------- se repérer dans le temps ---------- */
  "hi1-1": () => {
    const a = rand(101, 2100), s = siecleDe(a);
    const b = pick([1956, 1492, 1789, 859, 1325, 2026, 1070]);
    return [
      QS.qcm(`En quel siècle est l'année ${a} ?`, `${romain(s)}e siècle`, [`${romain(s + 1)}e siècle`, `${romain(Math.max(1, s - 1))}${s - 1 === 1 ? "er" : "e"} siècle`].filter((x) => x !== `${romain(s)}e siècle`)),
      QS.qcm(`En quel siècle est l'année ${b} ?`, siecleTexte(b), [`${romain(siecleDe(b) - 1)}e siècle`, `${romain(siecleDe(b) + 1)}e siècle`]),
      QS.qcm("Combien d'années y a-t-il dans un siècle ?", "100", ["10", "1 000"]),
      QS.qcm("Combien d'années y a-t-il dans un millénaire ?", "1 000", ["100", "10"]),
      QS.qcm("Dans quel siècle vivons-nous ?", "le XXIe siècle", ["le XXe siècle", "le XIXe siècle"]),
      QS.qcm("Comment écrit-on 15 en chiffres romains ?", "XV", ["VX", "XIV"]),
      QS.qcm("Que vaut XIX en chiffres romains ?", "19", ["21", "11"]),
      QS.vf("L'année 2000 fait partie du XXe siècle.", true),
      QS.vf("L'année 1900 fait partie du XXe siècle.", false),
      QS.ordre("Range du plus court au plus long.", ["une année", "une décennie (10 ans)", "un siècle", "un millénaire"], " < "),
    ];
  },
  "hi1-2": () => [
    QS.ordre("Remets les périodes de l'histoire dans l'ordre.", ["Préhistoire", "Antiquité", "Moyen Âge", "Temps modernes", "Époque contemporaine"], " → "),
    QS.qcm("Quel événement marque la fin de la Préhistoire ?", "l'invention de l'écriture", ["la découverte du feu", "la Révolution française"]),
    QS.qcm("Christophe Colomb arrive en Amérique en 1492. Cela marque le début…", "des Temps modernes", ["du Moyen Âge", "de la Préhistoire"]),
    QS.qcm("Nous vivons à…", "l'époque contemporaine", ["l'Antiquité", "au Moyen Âge"]),
    HQ.periode(pick(HIST_FICHES.filter((f) => f.cat !== "decouverte" && f.annee > -300000))),
    HQ.periode(pick(HIST_FICHES.filter((f) => f.cat !== "decouverte" && f.annee > -300000))),
    QS.vf("Sur une frise chronologique, les dates les plus anciennes sont à gauche.", true),
    QS.vf("Le Moyen Âge vient avant l'Antiquité.", false),
    ordreDe(["ecriture", "hegire", "colomb", "revolution", "independance"]),
  ],
  "hi1-3": () => [
    QS.qcm("Les années « av. J.-C. » sont…", "avant la naissance de Jésus-Christ", ["après la naissance de Jésus-Christ", "au XXIe siècle"]),
    QS.qcm("Qu'est-ce qui est le plus ancien ?", "500 av. J.-C.", ["100 av. J.-C.", "300 apr. J.-C."]),
    QS.qcm("Qu'est-ce qui est le plus ancien ?", "3300 av. J.-C.", ["2560 av. J.-C.", "80 apr. J.-C."]),
    QS.qcm("L'an 1 du calendrier de l'hégire correspond à l'année…", "622", ["1", "1956"]),
    QS.qcm("Le calendrier de l'hégire est le calendrier…", "musulman", ["chinois", "romain"]),
    QS.vf("Avant J.-C., plus le nombre est grand, plus c'est ancien.", true),
    QS.vf("L'an 100 av. J.-C. vient après l'an 50 av. J.-C.", false),
    QS.ordre("Remets ces dates dans l'ordre, de la plus ancienne à la plus récente.", ["2560 av. J.-C.", "196 av. J.-C.", "80", "622", "1956"], " → "),
    QS.qcm("Les mois du calendrier musulman suivent…", "la Lune", ["le Soleil", "les saisons"]),
  ],
  /* ---------- le Maroc à travers le temps ---------- */
  "hi2-1": () => [
    QS.qcm("Quels fossiles marocains sont les plus anciens Homo sapiens connus ?", "ceux de Jebel Irhoud", ["ceux de Lascaux", "ceux de Pompéi"]),
    QS.qcm("Environ quel âge ont les fossiles de Jebel Irhoud ?", "300 000 ans", ["3 000 ans", "30 ans"]),
    QS.qcm("Qu'a-t-on trouvé dans la grotte de Bizmoune, près d'Essaouira ?", "des perles en coquillage", ["un dinosaure", "une pyramide"]),
    QS.qcm("Comment s'appellent les premiers habitants connus de l'Afrique du Nord ?", "les Amazighs", ["les Romains", "les Vikings"]),
    QS.qcm("Comment s'appelle l'alphabet très ancien utilisé pour écrire l'amazighe ?", "le tifinagh", ["l'alphabet latin", "les hiéroglyphes"]),
    QS.qcm("Où trouve-t-on des gravures rupestres dans le Haut Atlas ?", "à l'Oukaïmeden", ["à Casablanca", "à Tanger"]),
    QS.vf("Des humains vivaient déjà au Maroc il y a 300 000 ans.", true),
    QS.vf("Les perles de Bizmoune étaient des bijoux.", true),
    QS.vf("L'amazighe est une langue officielle du Maroc.", true),
    HQ.ordre([HF.irhoud, HF.bizmoune, HF.oukaimeden], "Remets dans l'ordre, du plus ancien au plus récent."),
  ],
  "hi2-2": () => [
    QS.qcm("Près de quelle ville se trouve Volubilis ?", "Meknès", ["Agadir", "Oujda"]),
    QS.qcm("Volubilis est devenue une ville…", "romaine", ["chinoise", "viking"]),
    QS.qcm("Qu'admire-t-on dans les maisons de Volubilis ?", "des mosaïques", ["des gratte-ciel", "des fusées"]),
    QS.qcm("À quelle période appartient Volubilis ?", "l'Antiquité", ["le Moyen Âge", "l'époque contemporaine"]),
    QS.qcm("Lixus, une autre ville antique du Maroc, se trouve près de…", "Larache", ["Ifrane", "Errachidia"]),
    QS.qcm("Une mosaïque est faite…", "de petits morceaux de pierre colorés", ["de papier", "de verre fondu"]),
    QS.vf("Volubilis est inscrite au patrimoine mondial de l'UNESCO.", true),
    QS.vf("Idriss Ier est arrivé à Volubilis en 788.", true),
    QS.vf("Volubilis a été construite en 1993.", false),
  ],
  "hi2-3": () => [
    QS.ordre("Remets les dynasties du Maroc dans l'ordre.", ["Idrissides", "Almoravides", "Almohades", "Mérinides", "Saadiens", "Alaouites"], " → "),
    QS.qcm("Qui a fondé la dynastie des Idrissides en 788 ?", "Idriss Ier", ["Mohammed V", "Ibn Battuta"]),
    QS.qcm("Quelle ville Idriss Ier a-t-il fondée en 789 ?", "Fès", ["Casablanca", "Agadir"]),
    QS.qcm("Quelle dynastie a fondé Marrakech ?", "les Almoravides", ["les Alaouites", "les Saadiens"]),
    QS.qcm("Quelle dynastie règne aujourd'hui sur le Maroc ?", "les Alaouites", ["les Idrissides", "les Almohades"]),
    QS.qcm("En quelle année le Maroc a-t-il retrouvé son indépendance ?", "1956", ["1492", "1789"]),
    QS.qcm("Quel roi est revenu au Maroc lors de l'indépendance ?", "Mohammed V", ["Idriss II", "Moulay Ismaïl"]),
    QS.vf("Le mot « Maroc » vient du nom de la ville de Marrakech.", true),
    QS.vf("Les Almohades ont construit la Koutoubia.", true),
    ordreDe(["idriss", "marrakech", "almohades", "saadiens", "alaouites", "independance"]),
  ],
  /* ---------- savants et innovateurs ---------- */
  "hi3-1": () => [
    QS.qcm("Qui a fondé la Quaraouiyine à Fès ?", "Fatima al-Fihriya", ["Ibn Battuta", "Idriss Ier"]),
    QS.qcm("En quelle année la Quaraouiyine a-t-elle été fondée ?", "859", ["1956", "1325"]),
    QS.qcm("Dans quelle ville se trouve la Quaraouiyine ?", "Fès", ["Rabat", "Tanger"]),
    QS.qcm("Quel record détient la Quaraouiyine ?", "la plus ancienne université encore en activité", ["la plus haute tour du monde", "le plus grand stade"]),
    QS.qcm("Avec quel argent Fatima al-Fihriya a-t-elle fondé la mosquée ?", "l'héritage de son père", ["un trésor de pirates", "l'argent d'un roi étranger"]),
    QS.vf("La Quaraouiyine est à la fois une mosquée et un lieu d'études.", true),
    QS.vf("Fatima al-Fihriya était une femme.", true),
    QS.vf("La Quaraouiyine a été construite il y a moins de 100 ans.", false),
    QS.mots("Clique sur le nom de la ville.", "Fatima al-Fihriya a fondé la Quaraouiyine à Fès .", ["Fès"]),
  ],
  "hi3-2": () => [
    QS.qcm("De quelle ville Ibn Battuta est-il parti en 1325 ?", "Tanger", ["Marrakech", "Agadir"]),
    QS.qcm("Combien de temps Ibn Battuta a-t-il voyagé ?", "près de 30 ans", ["2 semaines", "1 an"]),
    QS.qcm("Jusqu'où Ibn Battuta est-il allé ?", "jusqu'en Chine", ["jusque sur la Lune", "seulement à Fès"]),
    QS.qcm("Comment s'appelle le livre où Ibn Battuta raconte ses voyages ?", "la Rihla", ["le Coran", "l'Odyssée"]),
    QS.qcm("Pour quel roi al-Idrissi a-t-il dessiné sa carte du monde ?", "Roger II de Sicile", ["Mohammed V", "Louis XIV"]),
    QS.qcm("Quel était le métier d'al-Idrissi ?", "géographe", ["boulanger", "pilote"]),
    QS.vf("Ibn Battuta a parcouru environ 120 000 kilomètres.", true),
    QS.vf("Al-Idrissi est né à Sebta (Ceuta).", true),
    HQ.qui(HF.battuta, [HF.battuta, HF.idrissi, HF.fihriya, HF.yazami], "Qui est le grand voyageur parti de Tanger ?"),
    HQ.qui(HF.idrissi, [HF.battuta, HF.idrissi, HF.ibnbanna, HF.yazami], "Qui a dessiné une grande carte du monde au XIIe siècle ?"),
  ],
  "hi3-3": () => [
    HQ.qui(HF.ibnrochd, [HF.ibnrochd, HF.battuta, HF.yazami, HF.ibnbanna], "Quel savant était médecin, juge et philosophe, et est mort à Marrakech ?"),
    HQ.qui(HF.ibnbanna, [HF.ibnrochd, HF.ibnbanna, HF.idrissi, HF.fihriya], "Quel mathématicien de Marrakech a écrit des livres de calcul ?"),
    HQ.qui(HF.yazami, [HF.yazami, HF.battuta, HF.ibnbanna, HF.idrissi], "Quel inventeur né à Fès a travaillé sur les batteries des téléphones ?"),
    QS.qcm("Comment appelle-t-on aussi Ibn Rochd ?", "Averroès", ["Archimède", "Aristote"]),
    QS.qcm("Où est né Ibn Rochd ?", "à Cordoue", ["à Tokyo", "à Dakhla"]),
    QS.qcm("Sur quoi a travaillé Rachid Yazami ?", "les batteries au lithium", ["les avions", "les pyramides"]),
    QS.vf("Ibn al-Banna était mathématicien et astronome.", true),
    QS.vf("Rachid Yazami a vécu au Moyen Âge.", false),
    HQ.ordre([HF.fihriya, HF.ibnrochd, HF.battuta, HF.yazami], "Remets ces savants dans l'ordre, du plus ancien au plus récent."),
  ],
  /* ---------- grandes constructions ---------- */
  "hi4-1": () => {
    const mos = [HF.koutoubia, HF.tourhassan, HF.hassan2, HF.quaraouiyine];
    return [
      HQ.ou(pick(mos), mos),
      QS.qcm("Quel minaret mesure 210 mètres ?", "celui de la mosquée Hassan II", ["celui de la Koutoubia", "la Tour Hassan"]),
      QS.qcm("Quel minaret de Marrakech mesure environ 77 mètres ?", "la Koutoubia", ["la Tour Hassan", "Bab Mansour"]),
      QS.qcm("Pourquoi la Tour Hassan est-elle seule avec des colonnes ?", "la mosquée n'a jamais été terminée", ["un dragon l'a détruite", "elle a été construite hier"]),
      QS.qcm("Quelle dynastie a construit la Koutoubia et la Tour Hassan ?", "les Almohades", ["les Alaouites", "les Romains"]),
      QS.qcm("La mosquée Hassan II est construite en partie au-dessus…", "de l'océan Atlantique", ["d'un volcan", "du désert"]),
      QS.vf("La mosquée Hassan II a été inaugurée en 1993.", true),
      QS.vf("La Koutoubia est plus haute que le minaret de la mosquée Hassan II.", false),
      HQ.ordre([HF.quaraouiyine, HF.koutoubia, HF.tourhassan, HF.hassan2]),
    ];
  },
  "hi4-2": () => {
    const mon = [HF.bouinania, HF.badi, HF.aitbenhaddou, HF.babmansour, HF.volubilis];
    return [
      HQ.ou(pick(mon), mon),
      QS.qcm("Qu'est-ce qu'un ksar ?", "un village fortifié", ["un bateau", "une montagne"]),
      QS.qcm("En quoi est construit le ksar d'Aït-Ben-Haddou ?", "en terre crue (le pisé)", ["en verre", "en métal"]),
      QS.qcm("Qu'est-ce qu'une médersa ?", "une école où logent les étudiants", ["un marché", "un port"]),
      QS.qcm("Quel sultan a fait de Meknès sa capitale ?", "Moulay Ismaïl", ["Idriss Ier", "Yacoub al-Mansour"]),
      QS.qcm("Comment appelle-t-on les carreaux de céramique colorés des monuments marocains ?", "le zellige", ["le béton", "le plastique"]),
      QS.qcm("Quel sultan saadien a construit le palais El Badi ?", "Ahmed al-Mansour", ["Mohammed V", "Idriss II"]),
      QS.vf("La médersa Bou Inania se trouve à Fès.", true),
      QS.vf("Bab Mansour est une porte monumentale.", true),
      HQ.ordre([HF.volubilis, HF.bouinania, HF.badi, HF.babmansour]),
    ];
  },
  "hi4-3": () => {
    const monde = [HF.pyramide, HF.muraille, HF.colisee, HF.eiffel];
    return [
      HQ.ou(pick(monde), monde),
      QS.qcm("La pyramide de Khéops était le tombeau…", "d'un pharaon", ["d'un empereur chinois", "d'un roi de France"]),
      QS.qcm("À quoi servait la Grande Muraille ?", "à protéger la Chine", ["à faire du sport", "à stocker de l'eau"]),
      QS.qcm("Que regardait-on au Colisée ?", "des spectacles", ["des films", "des matchs de basket"]),
      QS.qcm("En quel métal est construite la tour Eiffel ?", "en fer", ["en or", "en bois"]),
      QS.qcm("Quelle construction est la plus haute ?", "la tour Eiffel (330 m)", ["la pyramide de Khéops (146 m)", "la Koutoubia (77 m)"]),
      QS.vf("La pyramide de Khéops est la seule merveille du monde antique encore debout.", true),
      QS.vf("Le Colisée se trouve à Paris.", false),
      HQ.ordre(monde),
      HQ.periode(pick(monde)),
    ];
  },
  /* ---------- découvertes archéologiques ---------- */
  "hi5-1": () => [
    QS.qcm("Que fait un archéologue ?", "il fouille le sol pour retrouver les traces du passé", ["il construit des maisons", "il observe les étoiles"]),
    QS.qcm("Qui étudie les fossiles de dinosaures ?", "le paléontologue", ["le boulanger", "le pharaon"]),
    QS.qcm("Dans une fouille, les objets les plus anciens sont en général…", "les plus profonds", ["tout en haut", "dans les arbres"]),
    QS.qcm("Avec quel outil l'archéologue nettoie-t-il délicatement un objet ?", "un pinceau", ["un marteau-piqueur", "une tondeuse"]),
    QS.qcm("Les dinosaures ont-ils vécu en même temps que les humains ?", "non, bien avant", ["oui, ensemble", "oui, au Moyen Âge"]),
    QS.vf("Un fossile est une trace d'un être vivant conservée dans la pierre.", true),
    QS.vf("Le Spinosaurus a été trouvé au Maroc.", true),
    QS.vf("Les archéologues inventent les objets qu'ils trouvent.", false),
    QS.ordre("Remets dans l'ordre le travail de l'archéologue.", ["creuser doucement", "trouver un objet", "le nettoyer", "l'étudier", "l'exposer au musée"], " → "),
  ],
  "hi5-2": () => {
    const ma = HIST_FICHES.filter((f) => f.cat === "decouverte" && f.maroc && f.id !== "spinosaurus");
    const f = pick(ma);
    return [
      QS.qcm(`Où a-t-on trouvé : ${f.titre} ?`, f.lieu.split(",")[0], sample(ma.filter((x) => x !== f).map((x) => x.lieu.split(",")[0]), 2), `<span style="font-size:44px">${f.e}</span>`),
      QS.qcm("Que sont les fossiles de Jebel Irhoud ?", "les plus anciens Homo sapiens connus", ["des dinosaures", "des statues romaines"]),
      QS.qcm("En quelle année les tombeaux saadiens ont-ils été redécouverts ?", "1917", ["1056", "2020"]),
      QS.qcm("Dans quelle ville se trouvent les tombeaux saadiens ?", "Marrakech", ["Tétouan", "Laâyoune"]),
      QS.qcm("De quoi sont faites les mosaïques de Volubilis ?", "de petites pierres colorées", ["de chocolat", "de plastique"]),
      QS.qcm("Les dessins gravés sur les rochers s'appellent…", "des gravures rupestres", ["des affiches", "des timbres"]),
      QS.vf("Les perles de Bizmoune ont environ 145 000 ans.", true),
      QS.vf("Les fouilles de Volubilis ont commencé en 1915.", true),
      HQ.ordre([HF.irhoud, HF.bizmoune, HF.oukaimeden, HF.mosaiques, HF["saadiens-tombeaux"]]),
    ];
  },
  "hi5-3": () => {
    const mo = [HF.lascaux, HF.toutankhamon, HF.rosette, HF.terrecuite, HF.pompei];
    const f = pick(mo);
    return [
      QS.qcm(`Dans quel pays a-t-on trouvé : ${f.titre} ?`, f.lieu.split(",").pop().trim(), sample(["France", "Égypte", "Chine", "Italie", "Maroc"].filter((x) => x !== f.lieu.split(",").pop().trim()), 2), `<span style="font-size:44px">${f.e}</span>`),
      QS.qcm("Qui a découvert le tombeau de Toutânkhamon en 1922 ?", "Howard Carter", ["Ibn Battuta", "Christophe Colomb"]),
      QS.qcm("Grâce à quoi Champollion a-t-il pu lire les hiéroglyphes ?", "la pierre de Rosette", ["la tour Eiffel", "une carte au trésor"]),
      QS.qcm("Qui a découvert la grotte de Lascaux en 1940 ?", "quatre adolescents", ["un roi", "un robot"]),
      QS.qcm("Qu'a-t-on découvert en Chine en 1974 ?", "une armée de soldats en terre cuite", ["un dinosaure", "une pyramide en or"]),
      QS.qcm("Quel volcan a enseveli Pompéi ?", "le Vésuve", ["le Toubkal", "l'Etna"]),
      QS.vf("Les peintures de Lascaux datent de la Préhistoire.", true),
      QS.vf("Le masque de Toutânkhamon est en or.", true),
      HQ.ordre(mo),
    ];
  },
};

/* ------------------------------------------------------------------ */
/* La matière « Histoire »                                             */
/* ------------------------------------------------------------------ */
const HIST = {
  id: "hist", name: "Histoire", color: "#9c6b3c",
  chapters: [
    {
      id: "hi1", title: "Se repérer dans le temps", color: "#9c6b3c", lessons: [
        { id: "hi1-1", title: "Les siècles", lesson: { rule: ["Un <b>siècle</b> = 100 ans ; un <b>millénaire</b> = 1 000 ans.", "Les siècles s'écrivent en <b>chiffres romains</b> : I = 1, V = 5, X = 10. De 2001 à 2100, c'est le <b>XXIe siècle</b>."], ex: "1956 est au <b>XXe siècle</b> (de 1901 à 2000)." } },
        { id: "hi1-2", title: "La frise et les grandes périodes", lesson: { rule: ["L'histoire est découpée en 5 périodes : <b>Préhistoire</b>, <b>Antiquité</b>, <b>Moyen Âge</b>, <b>Temps modernes</b> et <b>époque contemporaine</b>.", "Sur une frise, le temps avance de gauche à droite. L'invention de l'écriture (vers 3300 av. J.-C.) termine la Préhistoire."], ex: "1492, Christophe Colomb arrive en Amérique : c'est le début des <b>Temps modernes</b>." } },
        { id: "hi1-3", title: "Avant et après J.-C., l'hégire", lesson: { rule: ["On compte les années à partir de la naissance de Jésus-Christ : <b>av. J.-C.</b> (avant) et apr. J.-C. (après). Avant J.-C., plus le nombre est grand, plus c'est ancien.", "Le <b>calendrier de l'hégire</b>, musulman, commence en <b>622</b> ; ses mois suivent la Lune."], ex: "2560 av. J.-C. est plus ancien que 196 av. J.-C." } },
      ],
    },
    {
      id: "hi2", title: "Le Maroc à travers le temps", color: "#c4401d", lessons: [
        { id: "hi2-1", title: "Les premiers habitants du Maroc", lesson: { rule: ["Les fossiles de <b>Jebel Irhoud</b> (environ 300 000 ans) sont les plus anciens Homo sapiens connus. À Bizmoune, on a trouvé des perles de coquillage de 145 000 ans.", "Les <b>Amazighs</b> sont les premiers habitants connus de l'Afrique du Nord. Leur alphabet très ancien s'appelle le <b>tifinagh</b>."], ex: "Les gravures rupestres de l'<b>Oukaïmeden</b> ont 3 000 à 4 000 ans." } },
        { id: "hi2-2", title: "Volubilis et l'Antiquité", lesson: { rule: ["Pendant l'Antiquité, des villes comme <b>Lixus</b> (près de Larache) et <b>Volubilis</b> (près de Meknès) se développent.", "Volubilis devient romaine : on y voit encore des arcs, des colonnes et des <b>mosaïques</b>. Elle est inscrite au patrimoine mondial de l'UNESCO."], ex: "Idriss Ier arrive à Volubilis en <b>788</b>." } },
        { id: "hi2-3", title: "Les grandes dynasties", lesson: { rule: ["Les dynasties du Maroc : <b>Idrissides</b> (788, Fès), <b>Almoravides</b> (Marrakech), <b>Almohades</b> (Koutoubia), <b>Mérinides</b> (médersas), <b>Saadiens</b>, puis <b>Alaouites</b> depuis 1666.", "Le Maroc retrouve son <b>indépendance en 1956</b>, avec le roi Mohammed V."], ex: "Le mot « Maroc » vient du nom de <b>Marrakech</b>." } },
      ],
    },
    {
      id: "hi3", title: "Savants et innovateurs", color: "#8e6cc9", lessons: [
        { id: "hi3-1", title: "Fatima al-Fihriya et la Quaraouiyine", lesson: { rule: ["En <b>859</b>, <b>Fatima al-Fihriya</b> fonde à <b>Fès</b> la mosquée Al Quaraouiyine, avec l'héritage de son père.", "On y étudie depuis plus de 1 100 ans : c'est la <b>plus ancienne université encore en activité</b> du monde."], ex: "Une femme est à l'origine de la plus ancienne université du monde." } },
        { id: "hi3-2", title: "Ibn Battuta et al-Idrissi", lesson: { rule: ["<b>Ibn Battuta</b> quitte <b>Tanger</b> en 1325 et voyage près de 30 ans, jusqu'en Chine (environ 120 000 km). Il raconte tout dans la <b>Rihla</b>.", "Le géographe <b>al-Idrissi</b>, né à Sebta, dessine en 1154 une grande carte du monde pour le roi Roger II de Sicile."], ex: "Ibn Battuta est l'un des plus grands voyageurs de l'histoire." } },
        { id: "hi3-3", title: "Savants d'hier et d'aujourd'hui", lesson: { rule: ["<b>Ibn Rochd</b> (Averroès), médecin, juge et philosophe, travaille à la cour des Almohades et meurt à Marrakech en 1198. <b>Ibn al-Banna</b> est un mathématicien et astronome de Marrakech.", "Aujourd'hui, <b>Rachid Yazami</b>, né à Fès, a participé à l'invention des batteries au lithium de nos téléphones."], ex: "Les savants du Maroc ont marqué la médecine, les mathématiques et les sciences." } },
      ],
    },
    {
      id: "hi4", title: "Grandes constructions", color: "#2e86de", lessons: [
        { id: "hi4-1", title: "Mosquées et minarets", lesson: { rule: ["Les Almohades construisent la <b>Koutoubia</b> à Marrakech (minaret d'environ 77 m) et la <b>Tour Hassan</b> à Rabat (44 m, jamais terminée).", "La <b>mosquée Hassan II</b> de Casablanca (1993), en partie au-dessus de l'océan, a un minaret de <b>210 m</b>."], ex: "Le minaret de la mosquée Hassan II est l'un des plus hauts du monde." } },
        { id: "hi4-2", title: "Villes, palais et ksour", lesson: { rule: ["La médersa <b>Bou Inania</b> (Fès, Mérinides), le palais <b>El Badi</b> (Marrakech, Saadiens) et la porte <b>Bab Mansour</b> (Meknès, Moulay Ismaïl) sont décorés de <b>zellige</b>.", "Le ksar d'<b>Aït-Ben-Haddou</b> est un village fortifié construit en terre crue (pisé)."], ex: "Un <b>ksar</b> (pluriel : ksour) est un village fortifié." } },
        { id: "hi4-3", title: "Les merveilles du monde", lesson: { rule: ["La <b>pyramide de Khéops</b> (Égypte, vers 2560 av. J.-C.), la <b>Grande Muraille</b> (Chine), le <b>Colisée</b> (Rome, 80) et la <b>tour Eiffel</b> (Paris, 1889) sont des constructions célèbres.", "Chaque époque construit avec ses matériaux : pierre, brique, terre, puis fer et béton."], ex: "La tour Eiffel (330 m) est plus haute que le minaret de la mosquée Hassan II (210 m)." } },
      ],
    },
    {
      id: "hi5", title: "Découvertes archéologiques", color: "#3fa34d", lessons: [
        { id: "hi5-1", title: "Le métier d'archéologue", lesson: { rule: ["L'<b>archéologue</b> fouille le sol avec patience (pelle, truelle, pinceau) pour retrouver les traces des humains d'autrefois. Plus on creuse profond, plus c'est ancien.", "Le <b>paléontologue</b> étudie les <b>fossiles</b>, comme ceux des dinosaures, qui ont vécu bien avant les humains."], ex: "Au Maroc, on a trouvé le <b>Spinosaurus</b>, un dinosaure géant qui nageait." } },
        { id: "hi5-2", title: "Trésors du Maroc", lesson: { rule: ["<b>Jebel Irhoud</b> : les plus anciens Homo sapiens connus (300 000 ans). <b>Bizmoune</b> : des perles de 145 000 ans.", "Les <b>mosaïques de Volubilis</b> (fouilles depuis 1915), les <b>tombeaux saadiens</b> de Marrakech (redécouverts en 1917) et les gravures de l'<b>Oukaïmeden</b>."], ex: "Le Maroc est l'un des pays les plus importants pour comprendre l'origine des humains." } },
        { id: "hi5-3", title: "Trésors du monde", lesson: { rule: ["<b>Lascaux</b> (France, 1940) : des peintures de la Préhistoire. <b>Toutânkhamon</b> (Égypte, 1922) : le tombeau d'un pharaon et son masque en or.", "La <b>pierre de Rosette</b> a permis de lire les hiéroglyphes. En Chine, l'<b>armée de terre cuite</b> ; en Italie, <b>Pompéi</b>, ensevelie par le Vésuve."], ex: "Ce sont souvent des découvertes dues au hasard : un puits, une grotte, un chantier." } },
      ],
    },
  ],
};
HIST.chapters.forEach((ch) => ch.lessons.forEach((l) => { l.bank = () => shuffle(HIST_BANQUES[l.id]()); }));

CONTENT.hist = HIST;
for (const ch of HIST.chapters) {
  ch.subject = HIST.id;
  ch.lessons.forEach((l, i) => { l.chapter = ch; l.subject = HIST.id; l.index = i; LESSONS[l.id] = l; });
}
