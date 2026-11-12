/* L'Atelier de Boulon — Français CE2 : exercices GÉNÉRÉS (toujours nouveaux).
   Un lexique (noms, adjectifs, verbes, prénoms…) et des modèles de phrases produisent
   des centaines de questions différentes. Elles s'ajoutent aux questions écrites à la main. */
"use strict";

/* ================================================================== */
/* Lexique                                                             */
/* ================================================================== */
const LX = {
  garcons: ["Léo", "Hugo", "Sami", "Adam", "Noé", "Tom", "Youssef", "Omar", "Amine", "Ilyes", "Rayan", "Malik"],
  filles: ["Mila", "Inès", "Lina", "Jade", "Zoé", "Nora", "Salma", "Yasmine", "Aya", "Sofia", "Hiba", "Rania"],
  villes: ["Rabat", "Casablanca", "Marrakech", "Fès", "Tanger", "Agadir", "Meknès", "Paris", "Madrid", "Londres", "Lyon", "Tétouan"],
  animauxNoms: ["Pistache", "Caramel", "Moustache", "Biscuit", "Noisette", "Filou", "Câline", "Réglisse"],
  /* [mot, genre, pluriel, élision devant le/la] — tous des noms courants du CE2 */
  noms: [
    ["chat", "m", "chats"], ["chien", "m", "chiens"], ["lapin", "m", "lapins"], ["cheval", "m", "chevaux"],
    ["oiseau", "m", "oiseaux"], ["bateau", "m", "bateaux"], ["livre", "m", "livres"], ["crayon", "m", "crayons"],
    ["cahier", "m", "cahiers"], ["vélo", "m", "vélos"], ["ballon", "m", "ballons"], ["gâteau", "m", "gâteaux"],
    ["jardin", "m", "jardins"], ["château", "m", "châteaux"], ["arbre", "m", "arbres", 1], ["avion", "m", "avions", 1],
    ["camion", "m", "camions"], ["manteau", "m", "manteaux"], ["journal", "m", "journaux"], ["jeu", "m", "jeux"],
    ["hibou", "m", "hiboux"], ["bijou", "m", "bijoux"], ["caillou", "m", "cailloux"], ["genou", "m", "genoux"],
    ["clou", "m", "clous"], ["sac", "m", "sacs"], ["nez", "m", "nez"], ["tapis", "m", "tapis"], ["robot", "m", "robots"],
    ["éléphant", "m", "éléphants", 1], ["ordinateur", "m", "ordinateurs", 1], ["animal", "m", "animaux", 1],
    ["maison", "f", "maisons"], ["fleur", "f", "fleurs"], ["pomme", "f", "pommes"], ["table", "f", "tables"],
    ["chaise", "f", "chaises"], ["voiture", "f", "voitures"], ["poupée", "f", "poupées"], ["fenêtre", "f", "fenêtres"],
    ["porte", "f", "portes"], ["girafe", "f", "girafes"], ["tortue", "f", "tortues"], ["souris", "f", "souris"],
    ["étoile", "f", "étoiles", 1], ["école", "f", "écoles", 1], ["orange", "f", "oranges", 1], ["robe", "f", "robes"],
    ["lampe", "f", "lampes"], ["valise", "f", "valises"], ["rivière", "f", "rivières"], ["montagne", "f", "montagnes"],
    ["fusée", "f", "fusées"], ["chanson", "f", "chansons"], ["histoire", "f", "histoires", 1], ["plage", "f", "plages"],
    ["forêt", "f", "forêts"], ["lettre", "f", "lettres"], ["trousse", "f", "trousses"], ["gomme", "f", "gommes"],
    ["règle", "f", "règles"], ["bouteille", "f", "bouteilles"], ["noix", "f", "noix"], ["abeille", "f", "abeilles", 1],
  ],
  /* adjectifs : masculin, féminin, masculin pluriel, féminin pluriel, place (avant / après le nom) */
  adjectifs: [
    ["petit", "petite", "petits", "petites", "avant"], ["grand", "grande", "grands", "grandes", "avant"],
    ["joli", "jolie", "jolis", "jolies", "avant"], ["gros", "grosse", "gros", "grosses", "avant"],
    ["vert", "verte", "verts", "vertes"], ["noir", "noire", "noirs", "noires"], ["gris", "grise", "gris", "grises"],
    ["bleu", "bleue", "bleus", "bleues"], ["lourd", "lourde", "lourds", "lourdes"], ["rond", "ronde", "ronds", "rondes"],
    ["blanc", "blanche", "blancs", "blanches"], ["long", "longue", "longs", "longues"],
    ["content", "contente", "contents", "contentes"], ["méchant", "méchante", "méchants", "méchantes"],
    ["heureux", "heureuse", "heureux", "heureuses"], ["rouge", "rouge", "rouges", "rouges"],
    ["rapide", "rapide", "rapides", "rapides"], ["froid", "froide", "froids", "froides"],
    ["chaud", "chaude", "chauds", "chaudes"], ["neuf", "neuve", "neufs", "neuves"],
  ],
  /* êtres qui agissent (sujets) : [nom du lexique] */
  sujets: ["chat", "chien", "lapin", "cheval", "oiseau", "girafe", "tortue", "souris", "robot", "éléphant", "abeille"],
  /* verbes du 1er groupe et compléments qui leur vont (groupe nominal déjà accordé) */
  verbes: {
    regarder: ["les étoiles", "la mer", "les nuages", "la lune", "le ciel"],
    chercher: ["un trésor", "le chemin", "une cachette", "le ballon"],
    porter: ["un sac", "une valise", "des cartons", "un panier"],
    dessiner: ["un dragon", "une maison", "des fleurs", "un robot"],
    ranger: ["la chambre", "les jouets", "les livres", "la trousse"],
    laver: ["la voiture", "les assiettes", "le chien", "les fenêtres"],
    trouver: ["un coquillage", "une plume", "des champignons", "une clé"],
    chanter: ["une chanson", "une comptine", "très fort"],
    aimer: ["les crêpes", "le chocolat", "les histoires", "la musique"],
    écouter: ["la musique", "la maîtresse", "le vent", "les oiseaux"],
    manger: ["une pomme", "des gâteaux", "la soupe", "une banane"],
    marcher: ["dans la forêt", "vers l'école", "sur la plage"],
    sauter: ["très haut", "dans les flaques", "sur le lit"],
    nager: ["dans la mer", "dans le lac", "très vite"],
    jouer: ["au ballon", "aux billes", "dans le jardin"],
  },
  lieux: ["la plage", "la piscine", "l'école", "la mosquée", "la médina", "la boulangerie", "la gare", "la bibliothèque", "la montagne", "la campagne"],
};

/* ================================================================== */
/* Outils de grammaire                                                 */
/* ================================================================== */
const FRG = {
  nom(m) { const n = LX.noms.find((x) => x[0] === m); return { m: n[0], g: n[1], pl: n[2], el: !!n[3] }; },
  randNom(filter) { const l = LX.noms.filter((n) => !filter || filter(n)); const n = pick(l); return { m: n[0], g: n[1], pl: n[2], el: !!n[3] }; },
  voyelle: (w) => /^[aeiouyéèêâîôûh]/i.test(w),
  cap: (s) => s.charAt(0).toUpperCase() + s.slice(1),
  /* déterminant + nom (+ adjectif accordé) : def = le/la/l'/les, indef = un/une/des */
  gn(n, { def = true, plural = false, adj = null } = {}) {
    const mot = plural ? n.pl : n.m;
    let a = "";
    if (adj) a = adj[(plural ? 2 : 0) + (n.g === "f" ? 1 : 0)];
    const avant = adj && adj[4] === "avant";
    const premier = avant ? a : mot;
    let det;
    if (plural) det = def ? "les" : "des";
    else if (def) det = (avant ? this.voyelle(a) : n.el) ? "l'" : n.g === "m" ? "le" : "la";
    else det = n.g === "m" ? "un" : "une";
    if (plural && !def && avant) det = "de";                 // « de petits chats »
    const coeur = avant ? `${a} ${mot}` : adj ? `${mot} ${a}` : mot;
    return det.endsWith("'") ? det + coeur : `${det} ${coeur}`;
  },
  /* « que » / « de » devant une voyelle : qu'Inès, d'Omar */
  que(x) { return this.voyelle(x) ? "qu'" + x : "que " + x; },
  de(x) { return this.voyelle(x) ? "d'" + x : "de " + x; },
  /* adjectifs qui vont bien avec un animal ou une personne */
  adjVivant() { return pick(LX.adjectifs.filter((x) => ["petit", "grand", "joli", "gros", "noir", "gris", "blanc", "content", "méchant", "heureux", "rapide"].includes(x[0]))); },
  /* adjectifs pour un objet, placés après le nom */
  adjObjet() { return pick(LX.adjectifs.filter((x) => ["vert", "noir", "bleu", "rouge", "rond", "lourd", "blanc", "neuf", "gris", "long"].includes(x[0]))); },
  /* sujet varié : prénom, deux prénoms ou groupe nominal ; renvoie texte, nombre, genre */
  sujet({ prenoms = true, gn = true } = {}) {
    const r = Math.random();
    if (prenoms && r < 0.35) { const f = Math.random() < 0.5; return { t: pick(f ? LX.filles : LX.garcons), pl: false, g: f ? "f" : "m" }; }
    if (prenoms && r < 0.5) {
      const a = Math.random() < 0.5, b = Math.random() < 0.5;
      const p1 = pick(a ? LX.filles : LX.garcons); let p2 = pick(b ? LX.filles : LX.garcons); if (p2 === p1) p2 = pick(LX.garcons.concat(LX.filles).filter((x) => x !== p1));
      const g = LX.filles.includes(p1) && LX.filles.includes(p2) ? "f" : "m";
      return { t: `${p1} et ${p2}`, pl: true, g };
    }
    const n = this.nom(pick(LX.sujets)), pl = Math.random() < 0.45;
    const adj = Math.random() < 0.35 ? this.adjVivant() : null;
    return { t: this.gn(n, { plural: pl, adj }), pl, g: n.g, n, adj };
  },
  pronom(s) { return s.pl ? (s.g === "f" ? "elles" : "ils") : (s.g === "f" ? "elle" : "il"); },
  /* phrase simple « sujet + verbe + complément » au présent */
  phrase({ prenoms = true } = {}) {
    const s = this.sujet({ prenoms });
    const v = pick(Object.keys(LX.verbes));
    const forme = Conj.present(v)[s.pl ? 5 : 2];
    const c = pick(LX.verbes[v]);
    return { s, v, forme, c, texte: `${this.cap(s.t)} ${forme} ${c}` };
  },
  /* découpe en mots pour les exercices « clique sur les mots » ; ponctuation séparée */
  tokens: (texte) => texte.replace(/([.,!?])/g, " $1").replace(/\s+/g, " ").trim(),
  /* phrase négative avec élision devant une voyelle */
  negative(p, mot = "pas") {
    const ne = this.voyelle(p.forme) ? "n'" : "ne ";
    return `${this.cap(p.s.t)} ${ne}${p.forme} ${mot} ${p.c}`;
  },
  uniq: (arr) => [...new Set(arr)],
  qcm(consigne, prompt, bonne, fausses, n = 3) {
    const choix = shuffle(this.uniq([bonne, ...shuffle(fausses.filter((f) => f !== bonne)).slice(0, n - 1)]));
    return { type: "qcm", consigne, prompt, choices: choix, answer: bonne };
  },
};
const many = (n, f) => Array.from({ length: n }, f);

/* ================================================================== */
/* Banques complémentaires                                             */
/* ================================================================== */
const CONSIGNES_V = [
  ["Entoure", "Tracer un rond autour", ["le mot le plus long", "les nombres pairs", "la bonne réponse", "les animaux de la ferme"]],
  ["Souligne", "Tracer un trait en dessous", ["le titre du texte", "les verbes", "les noms propres", "la phrase la plus courte"]],
  ["Barre", "Tracer un trait par-dessus", ["l'intrus", "les mots mal écrits", "les mauvaises réponses"]],
  ["Recopie", "Écrire exactement la même chose", ["la phrase sans faute", "le mot en lettres attachées", "la date"]],
  ["Colorie", "Mettre de la couleur", ["les cases paires", "le dessin en vert", "les étoiles en jaune"]],
  ["Relie", "Tracer des traits pour associer", ["chaque animal à son petit", "chaque mot à son dessin", "les phrases à leur image"]],
  ["Complète", "Ajouter ce qui manque", ["chaque phrase avec un mot", "le tableau", "la suite de nombres"]],
  ["Coche", "Faire une petite croix dans la case", ["la bonne réponse", "les phrases vraies"]],
  ["Range", "Mettre dans l'ordre", ["les mots dans l'ordre alphabétique", "les nombres du plus petit au plus grand"]],
];
const SEQUENCES = [
  ["se réveille", "s'habille", "part à l'école"], ["plante une graine", "arrose la terre", "voit une fleur pousser"],
  ["mélange la farine et les œufs", "fait cuire le gâteau", "goûte le gâteau"], ["met son maillot", "plonge dans la piscine", "se sèche avec une serviette"],
  ["achète un billet", "monte dans le train", "arrive à la gare"], ["écrit une lettre", "la glisse dans une enveloppe", "la poste"],
  ["se lave les mains", "se met à table", "mange son repas"], ["cherche un livre", "l'emprunte à la bibliothèque", "le lit dans son lit"],
];
const CLOZE = [
  ["Le boulanger cuit le … dans son four.", "pain", ["bain", "vin"]], ["La vache donne du … .", "lait", ["laid", "lit"]],
  ["Pour écrire, je prends mon … .", "stylo", ["vélo", "sirop"]], ["Le soir, on allume la … pour y voir clair.", "lampe", ["rampe", "pompe"]],
  ["Le pêcheur attrape un … avec sa canne.", "poisson", ["poison", "buisson"]], ["En été, il fait très … .", "chaud", ["froid", "faux"]],
  ["Le pilote conduit l'… .", "avion", ["évier", "aviron"]], ["Je bois de l'eau dans un … .", "verre", ["vert", "ver"]],
  ["Le facteur dépose une … dans la boîte.", "lettre", ["fenêtre", "lessive"]], ["Pour couper la viande, j'utilise un … .", "couteau", ["château", "gâteau"]],
  ["La nuit, le hibou … dans la forêt.", "chasse", ["chante", "classe"]], ["Le dentiste soigne les … .", "dents", ["dons", "dames"]],
  ["Quand il pleut, je mets mes … .", "bottes", ["boîtes", "bottines de bal"]], ["La maîtresse écrit au … avec une craie.", "tableau", ["taureau", "bateau"]],
  ["Les abeilles fabriquent du … .", "miel", ["ciel", "fiel"]], ["Le jardinier coupe l'herbe avec une … .", "tondeuse", ["tortue", "trousse"]],
  ["Je me brosse les dents avec du … .", "dentifrice", ["dessert", "dictionnaire"]], ["Le marin dirige son … sur la mer.", "bateau", ["râteau", "plateau"]],
  ["Pour voir les étoiles, on utilise une … .", "lunette", ["luge", "lunettes de soleil"]], ["Au zoo, le … rugit très fort.", "lion", ["lin", "lait"]],
];
const SENS = [
  ["glace", "Je mange une <b>glace</b> à la fraise.", "Un dessert froid", "Je me regarde dans la <b>glace</b>.", "Un miroir"],
  ["avocat", "L'<b>avocat</b> défend son client au tribunal.", "Un métier", "J'ai mangé un <b>avocat</b> bien mûr.", "Un fruit"],
  ["carte", "Le pilote regarde la <b>carte</b> du pays.", "Un plan pour se repérer", "Mamie m'envoie une <b>carte</b> d'anniversaire.", "Un petit message illustré"],
  ["feuille", "Une <b>feuille</b> tombe de l'arbre.", "Une partie de la plante", "J'écris sur une <b>feuille</b> blanche.", "Du papier"],
  ["souris", "La <b>souris</b> mange le fromage.", "Un petit animal", "Je clique avec la <b>souris</b> de l'ordinateur.", "Un objet pour l'ordinateur"],
  ["mousse", "La <b>mousse</b> pousse sur les rochers humides.", "Une petite plante", "Le savon fait beaucoup de <b>mousse</b>.", "Des petites bulles"],
  ["livre", "Je lis un <b>livre</b> de contes.", "Un objet avec des pages", "Le boucher pèse une <b>livre</b> de viande.", "Une mesure de poids"],
  ["pêche", "Papa part à la <b>pêche</b> au bord du lac.", "L'action d'attraper des poissons", "Je croque une <b>pêche</b> bien juteuse.", "Un fruit"],
  ["tour", "La <b>tour</b> Hassan se trouve à Rabat.", "Un bâtiment très haut", "C'est mon <b>tour</b> de jouer.", "Le moment où on joue"],
  ["bouton", "J'ai un <b>bouton</b> sur le nez.", "Un petit gonflement sur la peau", "Appuie sur le <b>bouton</b> pour allumer.", "Un petit objet sur lequel on appuie"],
  ["vol", "L'oiseau prend son <b>vol</b>.", "Le fait de voler dans les airs", "Le voleur a commis un <b>vol</b>.", "Le fait de prendre ce qui n'est pas à soi"],
  ["note", "Mon cahier a une bonne <b>note</b>.", "Un résultat à l'école", "Le piano joue une <b>note</b> aiguë.", "Un son de musique"],
];
const MUETTES = [
  ["bavar…", "d", "bavarde"], ["blan…", "c", "blanche"], ["cha…", "t", "chaton"], ["den…", "t", "dentiste"], ["lai…", "t", "laitier"],
  ["tapi…", "s", "tapisser"], ["bra…", "s", "brassard"], ["spor…", "t", "sportif"], ["gro…", "s", "grosse"], ["gri…", "s", "grise"],
  ["lon…", "g", "longue"], ["ran…", "g", "ranger"], ["chan…", "t", "chanter"], ["galo…", "p", "galoper"], ["lou…", "p", "louve"],
  ["froi…", "d", "froide"], ["gran…", "d", "grande"], ["lour…", "d", "lourde"], ["ron…", "d", "ronde"], ["peti…", "t", "petite"],
  ["ver…", "t", "verte"], ["hau…", "t", "hauteur"], ["for…", "t", "forte"], ["sour…", "d", "sourde"], ["trico…", "t", "tricoter"],
  ["débu…", "t", "débuter"], ["sau…", "t", "sauter"], ["bon…", "d", "bondir"], ["marchan…", "d", "marchande"], ["plom…", "b", "plombier"],
  ["dra…", "p", "draper"], ["gou…", "t", "goûter"],
];
const CONTRAIRES = [
  ["grand", "petit"], ["rapide", "lent"], ["ouvrir", "fermer"], ["jour", "nuit"], ["léger", "lourd"], ["propre", "sale"], ["vide", "plein"],
  ["gagner", "perdre"], ["entrer", "sortir"], ["courageux", "peureux"], ["possible", "impossible"], ["coller", "décoller"], ["adroit", "maladroit"],
  ["poli", "impoli"], ["allumer", "éteindre"], ["devant", "derrière"], ["chaud", "froid"], ["monter", "descendre"], ["jeune", "vieux"],
  ["large", "étroit"], ["mouillé", "sec"], ["haut", "bas"], ["dur", "mou"], ["acheter", "vendre"], ["donner", "prendre"], ["aimer", "détester"],
  ["commencer", "finir"], ["toujours", "jamais"], ["beaucoup", "peu"], ["dedans", "dehors"], ["heureux", "malheureux"], ["visible", "invisible"],
  ["faire", "défaire"], ["habiller", "déshabiller"], ["calme", "agité"], ["silencieux", "bruyant"], ["épais", "mince"], ["riche", "pauvre"],
  ["premier", "dernier"], ["remplir", "vider"], ["lever", "baisser"], ["oublier", "se souvenir"], ["avancer", "reculer"], ["clair", "sombre"],
];
const PHRASES_CONTRAIRES = [
  ["Le café est chaud mais la glace est froide .", ["chaud", "froide"]], ["Mon frère est grand et ma sœur est petite .", ["grand", "petite"]],
  ["Le lièvre est rapide , la tortue est lente .", ["rapide", "lente"]], ["Le matin on ouvre les volets , le soir on les ferme .", ["ouvre", "ferme"]],
  ["Ce sac est lourd , cette plume est légère .", ["lourd", "légère"]], ["La bouteille est pleine , le verre est vide .", ["pleine", "vide"]],
  ["Je monte l'escalier puis je le descends .", ["monte", "descends"]], ["Le jour il fait clair , la nuit il fait sombre .", ["clair", "sombre"]],
];
const FAMILLES = [
  [["dent", "dentiste", "dentifrice"], "danse"], [["terre", "terrain", "enterrer"], "tête"], [["lait", "laitier", "laitage"], "laid"],
  [["port", "portail", "porter"], "porc"], [["fleur", "fleuriste", "fleurir"], "fleuve"], [["mer", "marin", "maritime"], "mère"],
  [["chant", "chanter", "chanteur"], "champ"], [["boulanger", "boulangerie", "boulange"], "boule"], [["jardin", "jardinier", "jardiner"], "jardinet ? non"],
  [["glace", "glacier", "glacer"], "glisser"], [["neige", "neiger", "enneigé"], "nager"], [["pain", "panier", "panetière"], "pin"],
  [["dessin", "dessiner", "dessinateur"], "dessous"], [["nuage", "nuageux", "nuée"], "nuit"], [["coiffer", "coiffeur", "coiffure"], "coffre"],
  [["école", "écolier", "scolaire"], "écureuil"], [["vent", "venteux", "éventail"], "vendre"], [["sable", "sablier", "ensablé"], "sabot"],
  [["livre", "livret", "librairie"], "lèvre"], [["poisson", "poissonnier", "poissonnerie"], "poison"], [["pêche", "pêcheur", "pêcher"], "pêle-mêle"],
];
const DICTEE = [
  ["oiseau", "L'… chante sur la branche."], ["château", "Le roi vit dans un …"], ["bonjour", "Je dis … à la boulangère."], ["maison", "Ma … a un toit rouge."],
  ["jardin", "Les fleurs poussent dans le …"], ["girafe", "La … a un très long cou."], ["chocolat", "J'aime le gâteau au …"], ["vélo", "Je roule à …"],
  ["hiver", "En …, il neige parfois."], ["poisson", "Le … nage dans le bocal."], ["dragon", "Le … crache du feu."], ["étoile", "Une … brille dans le ciel."],
  ["lapin", "Le … mange une carotte."], ["cartable", "Je range mes cahiers dans mon …"], ["mouton", "Le … donne de la laine."], ["parapluie", "Il pleut : j'ouvre mon …"],
  ["crayon", "J'écris avec un …"], ["fenêtre", "Je regarde par la …"], ["pantalon", "Je mets mon … bleu."], ["chapeau", "Le magicien sort un lapin de son …"],
  ["cheval", "Le … galope dans le pré."], ["voiture", "Papa lave la …"], ["montagne", "Il y a de la neige sur la …"], ["gâteau", "Maman prépare un …"],
  ["tortue", "La … avance lentement."], ["éléphant", "L'… a une longue trompe."], ["anniversaire", "J'ai reçu des cadeaux pour mon …"], ["papillon", "Le … vole de fleur en fleur."],
  ["soleil", "Le … brille."], ["forêt", "Les arbres poussent dans la …"], ["histoire", "Papi me lit une …"], ["sorcière", "La … vole sur un balai."],
];
const ANNONCES = {
  objets: [["un vélo bleu", "Un vélo"], ["une trottinette rouge", "Une trottinette"], ["des rollers", "Des rollers"], ["une guitare", "Une guitare"], ["un jeu de société", "Un jeu de société"], ["une console de jeux", "Une console de jeux"]],
  perdus: [["chat gris", "Un chat"], ["chien noir", "Un chien"], ["doudou lapin", "Un doudou"], ["perroquet vert", "Un perroquet"]],
  jours: ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"],
};

/* ================================================================== */
/* Générateurs (un par leçon)                                          */
/* ================================================================== */
const FRGEN = {
  /* ---------- Lire et comprendre ---------- */
  "fr1-1": () => many(10, () => {
    const [v, action, objs] = pick(CONSIGNES_V);
    const r = rand(0, 2);
    if (r === 0) {
      const pre = pick(["", "Dans le texte ,", "Avec ta règle ,", "Au crayon ,"]);
      const verbe = pre ? v.toLowerCase() : v;
      return { type: "mots", consigne: "Clique sur le verbe qui dit ce qu'il faut faire.", sentence: `${pre} ${verbe} ${FRG.tokens(pick(objs))} .`.trim(), answer: [verbe] };
    }
    if (r === 1) return FRG.qcm("Que dois-tu faire ?", `« ${v} ${pick(objs)}. »`, action, CONSIGNES_V.map((c) => c[1]));
    return FRG.qcm("Quelle consigne te demande de faire cela ?", `${action}.`, v, CONSIGNES_V.map((c) => c[0]));
  }),
  "fr1-2": () => many(10, () => {
    if (Math.random() < 0.55) {
      const p = FRG.phrase();
      const words = (p.texte + ".").split(" ");
      if (words.length < 3 || words.length > 9) return FRGEN["fr1-2"]()[0];
      return { type: "ordre", consigne: "Clique sur les mots dans l'ordre pour écrire la phrase.", words };
    }
    const seq = pick(SEQUENCES), qui = pick(LX.garcons.concat(LX.filles));
    const etapes = seq.map((e) => `${qui} ${e}.`);
    const q = rand(0, 2), lab = ["en premier", "au milieu", "en dernier"][q];
    return FRG.qcm(`Qu'est-ce qui se passe ${lab} ?`, shuffle(etapes).join(" • "), etapes[q], etapes);
  }),
  "fr1-3": () => sample(CLOZE, 10).map(([t, a, d]) =>
    Math.random() < 0.7 ? FRG.qcm("Choisis le mot qui convient.", t, a, d) : { type: "trous", consigne: "Écris le mot qui manque.", text: t.replace("…", `[${a}]`) }),
  "fr1-4": () => many(8, () => {
    const qui = pick(LX.garcons.concat(LX.filles)), jour = pick(ANNONCES.jours), lieu = pick(LX.lieux);
    const box = (html) => `<div style='text-align:left;background:#fff;border:3px solid #2b2236;border-radius:14px;padding:10px 16px;font-size:22px'>${html}</div>`;
    const r = rand(0, 1);
    if (r === 0) {
      const [obj, objCourt] = pick(ANNONCES.objets), prix = Money.isMAD ? rand(5, 60) * 10 : rand(5, 60);
      const ann = box(`<b>À VENDRE</b> : ${obj}, très bon état, ${Money.amount(prix)}.<br>Visible le ${jour}.<br>Contact : ${qui}.`);
      const q = rand(0, 2);
      if (q === 0) return FRG.qcm("Lis l'annonce et réponds.", ann + "Qu'est-ce qui est à vendre ?", objCourt, ANNONCES.objets.map((o) => o[1]));
      if (q === 1) return FRG.qcm("Lis l'annonce et réponds.", ann + "Quel jour peut-on le voir ?", `Le ${jour}`, ANNONCES.jours.map((j) => `Le ${j}`));
      return FRG.qcm("Lis l'annonce et réponds.", ann + "Qui faut-il contacter ?", qui, LX.garcons.concat(LX.filles));
    }
    const [animal, court] = pick(ANNONCES.perdus);
    const ann = box(`<b>PERDU</b> : ${animal}, près de ${lieu}, ${jour}.<br>Récompense ! Appeler ${qui}.`);
    const q = rand(0, 2);
    if (q === 0) return FRG.qcm("Lis l'annonce et réponds.", ann + "Qu'est-ce qui a été perdu ?", court, ANNONCES.perdus.map((o) => o[1]));
    if (q === 1) return FRG.qcm("Lis l'annonce et réponds.", ann + "Où a-t-il été perdu ?", `Près de ${lieu}`, LX.lieux.map((l) => `Près de ${l}`));
    return FRG.qcm("Lis l'annonce et réponds.", ann + "Que va recevoir celui qui le retrouve ?", "Une récompense", ["Une punition", "Un billet de train", "Rien du tout"]);
  }),
  "fr1-5": () => sample(SENS, 8).map(([mot, p1, s1, p2, s2]) => {
    const deux = Math.random() < 0.5;
    return FRG.qcm("Dans cette phrase, que veut dire le mot en gras ?", deux ? p2 : p1, deux ? s2 : s1, [s1, s2, ...sample(SENS.map((x) => x[2]), 2)], 3);
  }),

  /* ---------- Grammaire ---------- */
  "fr2-1": () => many(10, () => {
    const p = FRG.phrase(), r = rand(0, 4);
    if (r === 0) return FRG.qcm("Quel signe faut-il à la fin ?", `${p.texte} …`, ".", ["?", "!"]);
    if (r === 1) {
      const qs = [`Est-ce ${FRG.que(p.s.t)} ${p.forme} ${p.c}`, `Qui ${Conj.present(p.v)[2]} ${p.c}`];
      return FRG.qcm("Quel signe faut-il à la fin ?", `${FRG.cap(pick(qs))} …`, "?", [".", "!"]);
    }
    if (r === 2) {
      const n = FRG.randNom(), adj = pick(["magnifique", "formidable", "superbe", "incroyable"]);
      const ex = pick([`Quel${n.g === "f" ? "le" : ""} ${n.m} ${adj}`, `Attention, ${FRG.gn(n)} va tomber`, `Comme ${FRG.gn(n)} est ${n.g === "f" ? "belle" : "beau"}`, "Bravo, tu as gagné"]);
      return FRG.qcm("Quel signe faut-il à la fin ?", `${FRG.cap(ex)} …`, "!", [".", "?"]);
    }
    if (r === 3) {
      const bad = Math.random() < 0.6;
      let t = p.texte + ".";
      if (bad) t = pick([t.charAt(0).toLowerCase() + t.slice(1), p.texte, `${p.c} ${p.forme} ${p.s.t.toLowerCase()}.`]);
      return { type: "vf", consigne: "Est-ce une phrase bien écrite ?", prompt: t, answer: !bad };
    }
    const nb = rand(1, 4), ph = many(nb, () => FRG.phrase().texte + pick([".", ".", " !"]));   // espace avant « ! » en français
    return FRG.qcm("Combien y a-t-il de phrases ?", ph.join(" "), String(nb), ["1", "2", "3", "4"].filter((x) => x !== String(nb)));
  }),
  "fr2-2": () => many(10, () => {
    const p1 = pick(LX.filles.concat(LX.garcons)), v = pick(LX.villes), an = pick(LX.animauxNoms);
    const t = rand(0, 3);
    if (t === 0) return { type: "mots", consigne: "Clique sur tous les noms propres.", sentence: `${p1} habite à ${v} avec son chien ${an} .`, answer: [p1, v, an] };
    if (t === 1) {
      const n1 = FRG.randNom((n) => !n[3] && n[0] !== n[2]), n2 = FRG.randNom((n) => !n[3] && n[1] === "f" && n[0] !== n1.m);
      const sent = `${FRG.cap(FRG.gn(n1))} ${FRG.de(p1)} est sous la ${n2.m} .`;
      return { type: "mots", consigne: "Clique sur tous les noms communs.", sentence: sent, answer: [n1.m, n2.m] };
    }
    if (t === 2) {
      const n = FRG.randNom();
      return FRG.qcm("Quel mot est un nom propre ?", "Choisis.", pick([p1, v, an]), [n.m, FRG.randNom().m, FRG.randNom().m]);
    }
    return { type: "saisie", consigne: "Écris correctement ce nom propre.", prompt: `la ville de <i>${v.toLowerCase()}</i>`, answer: [v], caseSensitive: true, width: 280 };
  }),
  "fr2-3": () => many(10, () => {
    const n = FRG.randNom(), r = rand(0, 4);
    if (r === 0) return FRG.qcm("Quel déterminant va avec ce nom ?", `<span class="prompt big">… ${n.m}</span>`, n.g === "m" ? "un" : "une", ["un", "une"], 2);
    if (r === 1) return FRG.qcm("Quel déterminant va avec ce nom ?", `<span class="prompt big">… ${n.m}</span>`, n.el ? "l'" : n.g === "m" ? "le" : "la", ["le", "la", "l'"]);
    if (r === 2) {
      const pl = Math.random() < 0.5, def = Math.random() < 0.5;
      return FRG.qcm("Ce groupe est-il au singulier ou au pluriel ?", `<span class="prompt big">${FRG.gn(n, { plural: pl, def })}</span>`, pl ? "pluriel" : "singulier", ["singulier", "pluriel"], 2);
    }
    if (r === 3) return FRG.qcm("Quel est le genre de ce nom ?", `<span class="prompt big">${FRG.gn(n, { def: false })}</span>`, n.g === "m" ? "masculin" : "féminin", ["masculin", "féminin"], 2);
    return FRG.qcm("Mets ce groupe au pluriel.", `<span class="prompt big">${FRG.gn(n, { def: true })}</span>`, FRG.gn(n, { plural: true }), [FRG.gn(n), `les ${n.m}${n.m === n.pl ? "s" : ""}`, `des ${n.m}`]);
  }),
  "fr2-4": () => many(10, () => {
    if (Math.random() < 0.25) {
      const a = pick(LX.adjectifs), n = FRG.randNom();
      return FRG.qcm("Quel mot est un adjectif ?", "Choisis.", a[0], [n.m, pick(Object.keys(LX.verbes)), pick(["vite", "demain", "souvent"])]);
    }
    const n = FRG.nom(pick(LX.sujets)), pl = Math.random() < 0.4, a = FRG.adjVivant();
    const v = pick(Object.keys(LX.verbes)), forme = Conj.present(v)[pl ? 5 : 2];
    const deux = Math.random() < 0.4;
    let comp = pick(LX.verbes[v]), rep = [a[(pl ? 2 : 0) + (n.g === "f" ? 1 : 0)]];
    if (deux) {
      const o = FRG.randNom((x) => !LX.sujets.includes(x[0]));
      let a2 = FRG.adjObjet(); while (a2 === a) a2 = FRG.adjObjet();
      comp = FRG.gn(o, { def: true, adj: a2 });
      rep.push(a2[o.g === "f" ? 1 : 0]);
      if (!["regarder", "chercher", "porter", "dessiner", "ranger", "laver", "trouver", "aimer", "écouter", "manger"].includes(v)) return FRGEN["fr2-4"]()[0];
    }
    const sent = FRG.tokens(`${FRG.cap(FRG.gn(n, { plural: pl, adj: a }))} ${forme} ${comp}.`);
    return { type: "mots", consigne: deux ? "Clique sur les deux adjectifs." : "Clique sur l'adjectif.", sentence: sent, answer: rep };
  }),
  "fr2-5": () => many(10, () => {
    const p = FRG.phrase(), r = rand(0, 3);
    const sent = FRG.tokens(p.texte + ".");
    if (r === 0) return { type: "mots", consigne: "Clique sur le verbe.", sentence: sent, answer: [p.forme] };
    if (r === 1) return { type: "mots", consigne: "Clique sur le sujet (un ou plusieurs mots).", sentence: sent, answer: FRG.tokens(FRG.cap(p.s.t)).split(" ") };
    if (r === 2) return FRG.qcm("Par quel pronom peut-on remplacer le sujet ?", `<b>${FRG.cap(p.s.t)}</b> ${p.forme} ${p.c}.`, FRG.cap(FRG.pronom(p.s)), ["Il", "Elle", "Ils", "Elles"]);
    return FRG.qcm("Quel est l'infinitif du verbe ?", `${FRG.cap(p.s.t)} <b>${p.forme}</b> ${p.c}.`, p.v, FRG.uniq([Conj.present(p.v)[2], Conj.present(p.v)[5], p.v.slice(0, -1)]));
  }),
  "fr2-6": () => many(10, () => {
    // pas de « un / une / des » après une négation (on dirait « pas de pomme ») : on les évite
    let p = FRG.phrase();
    while (/^(un|une|des) /.test(p.c)) p = FRG.phrase();
    const r = rand(0, 3), aff = p.texte + ".";
    if (r <= 1) {
      const mot = r === 0 ? "pas" : pick(["plus", "jamais"]);
      return { type: "saisie", consigne: `Écris cette phrase à la forme négative avec « ne … ${mot} ».`, prompt: aff, answer: [FRG.negative(p, mot) + "."], width: 620 };
    }
    if (r === 2) {
      const qst = `Est-ce ${FRG.que(p.s.t)} ${p.forme} ${p.c} ?`;
      return FRG.qcm("Quelle phrase est négative ?", "Choisis.", FRG.negative(p, pick(["pas", "jamais", "plus"])) + ".", [aff, qst]);
    }
    const neg = Math.random() < 0.5;
    return { type: "vf", consigne: "Cette phrase est-elle négative ?", prompt: neg ? FRG.negative(p) + "." : aff, answer: neg };
  }),

  /* ---------- Orthographe ---------- */
  "fr3-1": () => many(10, () => {
    const n = FRG.randNom(), pl = Math.random() < 0.5, a = LX.sujets.includes(n.m) ? FRG.adjVivant() : FRG.adjObjet();
    const bonne = a[(pl ? 2 : 0) + (n.g === "f" ? 1 : 0)];
    const gnSans = FRG.gn(n, { plural: pl, def: Math.random() < 0.5 });
    if (Math.random() < 0.6) return FRG.qcm("Choisis l'adjectif bien accordé.", `${gnSans} …`, bonne, a.slice(0, 4), 4);
    return { type: "trous", consigne: "Accorde l'adjectif entre parenthèses.", text: `${FRG.cap(gnSans)} [${bonne}] <i>(${a[0]})</i>.` };
  }),
  "fr3-2": () => many(10, () => {
    const s = FRG.sujet(), v = pick(Object.keys(LX.verbes)), f = Conj.present(v), bonne = f[s.pl ? 5 : 2];
    const c = pick(LX.verbes[v]);
    if (Math.random() < 0.6) return FRG.qcm("Choisis la bonne forme du verbe.", `${FRG.cap(s.t)} … ${c}.`, bonne, [f[2], f[5], f[1]]);
    if (Math.random() < 0.5) return { type: "trous", consigne: "Écris le verbe au présent.", text: `${FRG.cap(s.t)} [${bonne}] <i>(${v})</i> ${c}.` };
    const faux = Math.random() < 0.5;
    return { type: "vf", consigne: "Le verbe est-il bien accordé ?", prompt: `${FRG.cap(s.t)} ${faux ? f[s.pl ? 2 : 5] : bonne} ${c}.`, answer: !faux };
  }),
  "fr3-3": () => sample(LX.noms, 9).map(([m, g, pl, el]) => {
    const det = g === "m" ? "un" : "une"; void el;
    if (Math.random() < 0.75) return { type: "saisie", consigne: "Écris ce nom au pluriel.", prompt: `${det} ${m} → des …`, answer: [pl], width: 260 };
    const fausses = FRG.uniq([m + "s", m + "x", m.replace(/al$/, "aux"), m]).filter((x) => x !== pl);
    return FRG.qcm("Quel est le pluriel de ce nom ?", `${det} ${m} → des …`, pl, fausses);
  }),
  "fr3-4": () => sample(MUETTES, 8).map(([w, l, help]) =>
    FRG.qcm("Quelle est la lettre muette ? Pense au mot de la famille.", `<span class="prompt big">${w}</span><br><small>(comme dans « ${help} »)</small>`, l, ["t", "d", "s", "p", "g", "c", "b"])),
  "fr3-5": () => many(10, () => {
    const s = FRG.sujet({ gn: false }), n = FRG.randNom(), lieu = pick(LX.lieux.concat(LX.villes));
    const r = rand(0, 3);
    if (r === 0 && !s.pl) return FRG.qcm("Choisis : a ou à ?", `${FRG.cap(s.t)} … ${FRG.gn(n, { def: false })}.`, "a", ["à"], 2);
    if (r === 1) return FRG.qcm("Choisis : a ou à ?", `${FRG.cap(s.t)} ${s.pl ? "vont" : "va"} … ${lieu}.`, "à", ["a"], 2);
    if (r === 2 && !s.pl) {
      const adj = FRG.adjVivant();
      return FRG.qcm("Choisis : et ou est ?", `${FRG.cap(s.t)} … ${adj[s.g === "f" ? 1 : 0]}.`, "est", ["et"], 2);
    }
    const n2 = FRG.randNom((x) => x[0] !== n.m);
    return FRG.qcm("Choisis : et ou est ?", `J'aime ${FRG.gn(n, { plural: true })} … ${FRG.gn(n2, { plural: true })}.`, "et", ["est"], 2);
  }),

  /* ---------- Conjugaison ---------- */
  "fr4-1": () => genConj(Conj.group1),
  "fr4-2": () => genConj(Conj.group2),
  "fr4-3": () => genConj(["être", "avoir"]),
  "fr4-4": () => genConj(["aller", "faire", "dire"]),
  "fr4-5": () => genConj(["venir", "prendre", "voir"]),

  /* ---------- Vocabulaire ---------- */
  "fr5-1": () => many(9, () => {
    if (Math.random() < 0.3) { const [s, rep] = pick(PHRASES_CONTRAIRES); return { type: "mots", consigne: "Clique sur les deux mots de sens contraire.", sentence: s, answer: rep }; }
    const [a, b] = pick(CONTRAIRES), inv = Math.random() < 0.5;
    return FRG.qcm("Clique sur le contraire du mot.", `<span class="prompt big">${inv ? b : a}</span>`, inv ? a : b, CONTRAIRES.map((c) => (inv ? c[0] : c[1])));
  }),
  "fr5-2": () => sample(FAMILLES.filter((f) => !f[1].includes("?")), 8).map(([fam, intrus]) => {
    if (Math.random() < 0.6) return FRG.qcm("Clique sur l'intrus : le mot qui n'est pas de la famille.", "Trouve l'intrus.", intrus, fam, 4);
    const [base, ...autres] = shuffle(fam);
    return FRG.qcm(`Quel mot est de la même famille que « ${base} » ?`, "Choisis.", pick(autres), [intrus, ...sample(FAMILLES.map((f) => f[1]), 2)]);
  }),
  "fr5-3": () => sample(DICTEE, 8).map(([w, hint]) => ({ type: "dictee", consigne: "Écoute le mot et écris-le.", word: w, hint: `<i>${hint}</i>` })),
};

/* conjugaison : verbe à compléter, bonne forme, pronom à retrouver */
function genConj(verbs) {
  return many(10, () => {
    const v = pick(verbs), r = Math.random();
    if (r < 0.7) return conjQuestion(v, "present");
    const f = Conj.present(v);
    const uniques = [2, 3, 4, 5].filter((p) => f.indexOf(f[p]) === f.lastIndexOf(f[p]));
    const p = pick(uniques), pr = ["Je", "Tu", "Il", "Nous", "Vous", "Ils"];
    return FRG.qcm(`Quel pronom va avec cette forme du verbe « ${v} » ?`, `<span class="prompt big">… ${f[p]}</span>`, pr[p], pr.filter((x, i) => f[i] !== f[p]), 4);
  });
}

/* plus de sujets et de compléments pour les leçons de conjugaison écrites à la main */
SUBJECTS.push({ s: "Youssef", p: 2 }, { s: "Salma", p: 2 }, { s: "Le chat", p: 2 }, { s: "Ma sœur", p: 2 }, { s: "Les oiseaux", p: 5 }, { s: "Mes amies", p: 5 }, { s: "Toi et moi", p: 3 }, { s: "Ton frère et toi", p: 4 });
for (const [v, comps] of Object.entries(LX.verbes)) {
  const c = VERB_COMPLEMENTS[v];
  VERB_COMPLEMENTS[v] = FRG.uniq([].concat(c || [], comps));
}

/* ================================================================== */
/* Branchement : chaque leçon mélange ses questions écrites à la main   */
/* et des questions générées                                           */
/* ================================================================== */
for (const [id, gen] of Object.entries(FRGEN)) {
  const l = LESSONS[id];
  if (!l) continue;
  const base = l.bank;
  /* une même question (ou un même mot de dictée) ne doit pas apparaître deux fois dans une série */
  l.bank = () => {
    const vues = new Set();
    return shuffle(base().concat(gen())).filter((q) => {
      const cle = JSON.stringify([q.type, q.consigne, q.prompt, q.word, q.sentence, q.words, q.text, q.answer]);
      if (vues.has(cle)) return false;
      vues.add(cle); return true;
    });
  };
}
