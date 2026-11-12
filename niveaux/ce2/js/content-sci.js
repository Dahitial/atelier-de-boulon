/* L'Atelier de Boulon — Sciences (« Questionner le monde », CE2).
   4 chapitres, 12 leçons. Chaque banque mélange des questions écrites à la main
   et des questions tirées au hasard (états de l'eau, régimes alimentaires, conducteurs, aimants…). */
"use strict";

/* fabrique de questions : les choix sont mélangés à chaque tirage */
const QS = {
  qcm: (consigne, bonne, fausses, prompt = "") => ({ type: "qcm", consigne, prompt, choices: shuffle([bonne, ...fausses]), answer: bonne }),
  vf: (prompt, ok) => ({ type: "vf", consigne: "Vrai ou faux ?", prompt, answer: ok }),
  img: (consigne, items, bon, prompt = "") => {
    const ordre = shuffle(items.map((_, i) => i));
    return { type: "img", consigne, prompt, choices: ordre.map((i) => ({ e: items[i][0], label: items[i][1] })), answer: ordre.indexOf(bon) };
  },
  ordre: (consigne, words, joiner = " → ") => ({ type: "ordre", consigne, words, joiner }),
  mots: (consigne, sentence, answer) => ({ type: "mots", consigne, sentence, answer }),
};
const grand = (t) => `<span style="font-size:30px">${t}</span>`;

/* données utilisées par plusieurs questions */
const SCI_ANIMAUX = [
  ["🐰", "le lapin", "herbivore", "de l'herbe et des carottes"], ["🐄", "la vache", "herbivore", "de l'herbe"], ["🐑", "le mouton", "herbivore", "de l'herbe"],
  ["🦒", "la girafe", "herbivore", "des feuilles"], ["🐘", "l'éléphant", "herbivore", "des feuilles et des fruits"], ["🐪", "le dromadaire", "herbivore", "des plantes du désert"],
  ["🦁", "le lion", "carnivore", "d'autres animaux"], ["🦊", "le renard", "carnivore", "des petits animaux"], ["🦉", "la chouette", "carnivore", "des souris"],
  ["🦈", "le requin", "carnivore", "des poissons"], ["🐺", "le loup", "carnivore", "d'autres animaux"], ["🦅", "l'aigle", "carnivore", "des petits animaux"],
  ["🐻", "l'ours", "omnivore", "des fruits, du miel et des poissons"], ["🐗", "le sanglier", "omnivore", "des racines et des vers"], ["🐔", "la poule", "omnivore", "des graines et des vers"],
];
const SCI_OBJETS_ELEC = [
  ["🔩", "un clou en fer", true], ["📎", "un trombone", true], ["🥄", "une cuillère en métal", true], ["🔑", "une clé", true], ["🪙", "une pièce de monnaie", true],
  ["✏️", "un crayon en bois", false], ["🧽", "une gomme", false], ["📏", "une règle en plastique", false], ["🥛", "un verre", false], ["🧶", "une pelote de laine", false], ["📄", "une feuille de papier", false],
];
/* attiré par l'aimant : fer et acier seulement (la canette en aluminium et la pièce ne le sont pas) */
const SCI_OBJETS_AIMANT = [
  ["🔩", "un clou en fer", true], ["📎", "un trombone en acier", true], ["🪡", "une aiguille", true], ["🔧", "une clé à molette", true], ["✂️", "des ciseaux en acier", true],
  ["✏️", "un crayon en bois", false], ["🧽", "une gomme", false], ["🥤", "une canette en aluminium", false], ["🧸", "un ours en peluche", false], ["📄", "une feuille de papier", false], ["🥛", "un verre", false],
];
const SCI_ALIMENTS = [
  ["🍎", "une pomme", "fruits et légumes"], ["🥕", "une carotte", "fruits et légumes"], ["🍌", "une banane", "fruits et légumes"], ["🥦", "un brocoli", "fruits et légumes"],
  ["🥖", "du pain", "féculents"], ["🍝", "des pâtes", "féculents"], ["🍚", "du riz", "féculents"], ["🥔", "une pomme de terre", "féculents"],
  ["🥛", "du lait", "produits laitiers"], ["🧀", "du fromage", "produits laitiers"], ["🍦", "un yaourt glacé", "produits laitiers"],
  ["🍗", "du poulet", "viande, poisson, œufs"], ["🐟", "du poisson", "viande, poisson, œufs"], ["🥚", "un œuf", "viande, poisson, œufs"],
  ["🍬", "des bonbons", "produits sucrés"], ["🍫", "du chocolat", "produits sucrés"],
];

/* ------------------------------------------------------------------ */
/* Banques de questions                                                */
/* ------------------------------------------------------------------ */
const SCI_BANQUES = {
  /* ---------- le vivant ---------- */
  "sc1-1": () => {
    const vivants = [["🐱", "un chat"], ["🌳", "un arbre"], ["🐝", "une abeille"], ["🌻", "un tournesol"], ["🐟", "un poisson"], ["🍄", "un champignon"]];
    const nonVivants = [["🪨", "un caillou"], ["🚲", "un vélo"], ["🧸", "un ours en peluche"], ["💧", "une goutte d'eau"], ["🤖", "un robot"], ["⚽", "un ballon"]];
    const v = pick(vivants), nv = sample(nonVivants, 2);
    const nv1 = pick(nonVivants), v2 = sample(vivants, 2);
    return [
      QS.img("Clique sur l'être vivant.", [v, ...nv], 0),
      QS.img("Clique sur ce qui n'est PAS vivant.", [nv1, ...v2], 0),
      QS.vf("Une plante est un être vivant.", true),
      QS.vf("Un robot qui bouge est un être vivant.", false),
      QS.vf("Tous les êtres vivants naissent, grandissent et meurent.", true),
      QS.vf("Le feu est vivant parce qu'il bouge et grandit.", false),
      QS.qcm("Que fait un être vivant ?", "Il se nourrit et grandit.", ["Il rouille.", "Il fond au soleil."]),
      QS.qcm("Pour grandir, un être vivant a besoin…", "de se nourrir", ["de dormir dans une boîte", "d'être peint"]),
      QS.ordre("Remets dans l'ordre la vie d'un être vivant.", ["naître", "grandir", "se reproduire", "mourir"]),
      QS.ordre("Remets dans l'ordre la vie d'une poule.", ["l'œuf", "le poussin", "la poule"]),
      QS.ordre("Remets dans l'ordre la vie d'une grenouille.", ["l'œuf", "le têtard", "la grenouille"]),
      QS.mots("Clique sur les deux êtres vivants.", "Le chat dort près du caillou et de la fleur .", ["chat", "fleur"]),
    ];
  },
  "sc1-2": () => [
    QS.qcm("De quoi une graine a-t-elle besoin pour germer ?", "d'eau", ["de lumière", "de sucre"]),
    QS.qcm("De quoi une plante verte a-t-elle besoin pour fabriquer sa nourriture ?", "de lumière", ["de musique", "de sable"]),
    QS.vf("Une plante peut grandir longtemps sans eau.", false),
    QS.vf("Une plante a besoin de lumière pour rester verte et grandir.", true),
    QS.vf("Les racines puisent l'eau dans la terre.", true),
    QS.vf("Une graine plantée dans du coton bien mouillé peut germer.", true),
    QS.ordre("Remets dans l'ordre la germination.", ["la graine", "la racine sort", "la tige pousse", "les feuilles apparaissent"]),
    QS.qcm("Quelle partie de la plante puise l'eau dans le sol ?", "les racines", ["les feuilles", "les fleurs"]),
    QS.qcm("Quelle partie de la plante deviendra un fruit ?", "la fleur", ["la racine", "la tige"]),
    QS.mots("Clique sur les trois besoins de la plante.", "Sans lumière , sans air et sans eau , la plante meurt .", ["lumière", "air", "eau"]),
    QS.qcm("Une plante est restée dans un placard noir. Elle devient…", "jaune et toute molle", ["plus verte", "bleue"]),
  ],
  "sc1-3": () => {
    const a = pick(SCI_ANIMAUX), b = pick(SCI_ANIMAUX.filter((x) => x[2] !== a[2]));
    return [
      QS.qcm(`${a[1].charAt(0).toUpperCase() + a[1].slice(1)} mange ${a[3]}. C'est un…`, a[2], ["herbivore", "carnivore", "omnivore"].filter((x) => x !== a[2]), grand(a[0])),
      QS.qcm(`${b[1].charAt(0).toUpperCase() + b[1].slice(1)} mange ${b[3]}. C'est un…`, b[2], ["herbivore", "carnivore", "omnivore"].filter((x) => x !== b[2]), grand(b[0])),
      QS.img("Clique sur l'animal herbivore.", [pick(SCI_ANIMAUX.filter((x) => x[2] === "herbivore")), ...sample(SCI_ANIMAUX.filter((x) => x[2] === "carnivore"), 2)].map((x) => [x[0], x[1]]), 0),
      QS.img("Clique sur l'animal carnivore.", [pick(SCI_ANIMAUX.filter((x) => x[2] === "carnivore")), ...sample(SCI_ANIMAUX.filter((x) => x[2] === "herbivore"), 2)].map((x) => [x[0], x[1]]), 0),
      QS.ordre("Remets la chaîne alimentaire dans l'ordre : qui est mangé par qui ?", ["l'herbe", "le lapin", "le renard"]),
      QS.ordre("Remets la chaîne alimentaire dans l'ordre.", ["la salade", "l'escargot", "le hérisson"]),
      QS.ordre("Remets la chaîne alimentaire dans l'ordre.", ["les graines", "la souris", "la chouette"]),
      QS.ordre("Remets la chaîne alimentaire dans l'ordre.", ["les algues", "le petit poisson", "le requin"]),
      QS.vf("Une chaîne alimentaire commence toujours par une plante.", true),
      QS.vf("Un herbivore mange de la viande.", false),
      QS.qcm("Un animal qui mange des plantes ET des animaux est…", "omnivore", ["herbivore", "carnivore"]),
      QS.qcm("Dans la chaîne « herbe → lapin → renard », qui mange le lapin ?", "le renard", ["l'herbe", "personne"]),
    ];
  },
  /* ---------- le corps humain ---------- */
  "sc2-1": () => [
    QS.qcm("Quel os protège le cerveau ?", "le crâne", ["le fémur", "les côtes"]),
    QS.qcm("Quels os protègent le cœur et les poumons ?", "les côtes", ["le crâne", "les phalanges"]),
    QS.qcm("Comment s'appelle l'endroit où deux os se rejoignent et bougent ?", "une articulation", ["un muscle", "une veine"]),
    QS.qcm("Qu'est-ce qui fait bouger les os ?", "les muscles", ["la peau", "les cheveux"]),
    QS.img("Clique sur une articulation.", [["🦵", "le genou"], ["👃", "le nez"], ["👂", "l'oreille"]], 0),
    QS.vf("Le squelette soutient notre corps.", true),
    QS.vf("Un adulte a environ 206 os.", true),
    QS.vf("Les muscles poussent les os.", false),
    QS.vf("Le coude et le genou sont des articulations.", true),
    QS.qcm("Quel est l'os le plus long du corps ?", "le fémur (la cuisse)", ["le crâne", "un os du doigt"]),
    QS.mots("Clique sur les deux articulations.", "Je plie le coude et le genou pour sauter .", ["coude", "genou"]),
  ],
  "sc2-2": () => {
    const d = pick([["les incisives", "couper"], ["les canines", "déchirer"], ["les molaires", "broyer"]]);
    return [
      QS.qcm(`À quoi servent ${d[0]} ?`, d[1], ["couper", "déchirer", "broyer"].filter((x) => x !== d[1])),
      QS.qcm("Quelles dents coupent les aliments, comme des ciseaux ?", "les incisives", ["les molaires", "les canines"]),
      QS.qcm("Quelles dents broient les aliments, au fond de la bouche ?", "les molaires", ["les incisives", "les canines"]),
      QS.qcm("Combien un enfant a-t-il de dents de lait ?", "20", ["32", "10"]),
      QS.qcm("Combien un adulte a-t-il de dents définitives ?", "32", ["20", "50"]),
      QS.vf("Il faut se brosser les dents au moins deux fois par jour.", true),
      QS.vf("Les bonbons sont bons pour les dents.", false),
      QS.vf("Vers 6 ans, les dents de lait tombent et les dents définitives poussent.", true),
      QS.qcm("Combien de temps faut-il se brosser les dents ?", "2 minutes", ["5 secondes", "1 heure"]),
      QS.img("Clique sur ce qui protège tes dents.", [["🪥", "la brosse à dents"], ["🍬", "les bonbons"], ["🥤", "le soda"]], 0),
      QS.ordre("Remets les dents dans l'ordre, de l'avant vers le fond de la bouche.", ["les incisives", "les canines", "les molaires"]),
    ];
  },
  "sc2-3": () => {
    const a = pick(SCI_ALIMENTS);
    const autres = ["fruits et légumes", "féculents", "produits laitiers", "viande, poisson, œufs", "produits sucrés"].filter((x) => x !== a[2]);
    return [
      QS.qcm(`Dans quelle famille range-t-on ${a[1]} ?`, a[2], sample(autres, 2), grand(a[0])),
      QS.qcm("Que faut-il boire pendant les repas ?", "de l'eau", ["du soda", "du sirop"]),
      QS.qcm("Combien de fruits et légumes faut-il manger par jour ?", "5", ["1", "15"]),
      QS.qcm("Combien d'heures un enfant de 8 ans doit-il dormir ?", "environ 10 heures", ["4 heures", "20 heures"]),
      QS.img("Clique sur le meilleur goûter.", [["🍎", "une pomme et du pain"], ["🍭", "une sucette"], ["🍟", "des frites"]], 0),
      QS.vf("Pour être en bonne santé, il faut bouger tous les jours.", true),
      QS.vf("On peut manger des bonbons à chaque repas.", false),
      QS.vf("Les produits laitiers aident à construire des os solides.", true),
      QS.vf("Il faut manger un peu de chaque famille d'aliments.", true),
      QS.qcm("Un repas équilibré contient…", "un peu de chaque famille d'aliments", ["seulement des féculents", "seulement du dessert"]),
    ];
  },
  /* ---------- la matière ---------- */
  "sc3-1": () => {
    const t = pick([-18, -5, -2, 4, 15, 25, 37, 60, 85, 110]);   // jamais 0 ni 100 °C : à ces températures, deux états coexistent
    const etat = t <= 0 ? "solide (glace)" : t >= 100 ? "gazeuse (vapeur)" : "liquide";
    return [
      QS.qcm(`À ${t < 0 ? "−" + -t : t} °C, l'eau pure est…`, etat, ["solide (glace)", "liquide", "gazeuse (vapeur)"].filter((x) => x !== etat), grand(t <= 0 ? "🧊" : t >= 100 ? "♨️" : "💧")),
      QS.qcm("À quelle température l'eau gèle-t-elle ?", "0 °C", ["100 °C", "50 °C"]),
      QS.qcm("À quelle température l'eau bout-elle ?", "100 °C", ["0 °C", "20 °C"]),
      QS.qcm("La glace qui devient de l'eau liquide, c'est…", "la fusion", ["la solidification", "l'ébullition"]),
      QS.qcm("L'eau liquide qui devient de la glace, c'est…", "la solidification", ["la fusion", "l'évaporation"]),
      QS.img("Clique sur l'eau à l'état solide.", [["🧊", "un glaçon"], ["🌧️", "la pluie"], ["♨️", "la vapeur"]], 0),
      QS.img("Clique sur l'eau à l'état liquide.", [["🌧️", "la pluie"], ["🧊", "un glaçon"], ["❄️", "un flocon"]], 0),
      QS.vf("Un glaçon qu'on laisse au soleil fond.", true),
      QS.vf("La vapeur d'eau est de l'eau à l'état gazeux.", true),
      QS.vf("Quand l'eau gèle, elle disparaît.", false),
      QS.ordre("Remets dans l'ordre : on chauffe un glaçon.", ["glace", "eau liquide", "vapeur"]),
    ];
  },
  "sc3-2": () => [
    QS.ordre("Remets le cycle de l'eau dans l'ordre.", ["la mer chauffe au soleil", "la vapeur monte", "les nuages se forment", "il pleut"]),
    QS.qcm("Le soleil chauffe la mer : l'eau devient de la vapeur. C'est…", "l'évaporation", ["la condensation", "la fusion"]),
    QS.qcm("La vapeur se refroidit en altitude et forme les nuages. C'est…", "la condensation", ["l'évaporation", "la solidification"]),
    QS.qcm("Comment s'appellent la pluie, la neige et la grêle ?", "les précipitations", ["les évaporations", "les nuages"]),
    QS.qcm("Où va l'eau de pluie qui coule sur le sol ?", "dans les rivières, puis la mer", ["dans les nuages directement", "nulle part"]),
    QS.vf("Les nuages sont faits de minuscules gouttes d'eau.", true),
    QS.vf("L'eau de la Terre se perd après la pluie.", false),
    QS.vf("Le Soleil fait fonctionner le cycle de l'eau.", true),
    QS.img("Clique sur une précipitation.", [["🌨️", "la neige"], ["☀️", "le soleil"], ["🌈", "l'arc-en-ciel"]], 0),
    QS.mots("Clique sur les deux mots du cycle de l'eau.", "Après évaporation puis condensation , les nuages se forment .", ["évaporation", "condensation"]),
  ],
  "sc3-3": () => {
    const o = pick([["le sucre", true], ["le sel", true], ["le sirop", true], ["le sable", false], ["l'huile", false], ["les cailloux", false]]);
    return [
      QS.qcm(`On met ${o[0]} dans un verre d'eau et on remue. Que se passe-t-il ?`, o[1] ? "il se dissout : on ne le voit plus" : "il ne se dissout pas : on le voit toujours", [o[1] ? "il ne se dissout pas : on le voit toujours" : "il se dissout : on ne le voit plus"]),
      QS.vf("Le sucre qui se dissout dans l'eau a disparu pour toujours.", false),
      QS.vf("On peut séparer le sable de l'eau avec un filtre.", true),
      QS.vf("L'huile et l'eau se mélangent parfaitement.", false),
      QS.qcm("Comment récupérer le sel dissous dans l'eau de mer ?", "en laissant l'eau s'évaporer", ["avec un aimant", "avec un filtre à café"]),
      QS.qcm("Comment séparer le sable de l'eau ?", "en filtrant", ["en remuant", "en ajoutant du sucre"]),
      QS.img("Clique sur ce qui se dissout dans l'eau.", [["🧂", "le sel"], ["🪨", "un caillou"], ["🏖️", "le sable"]], 0),
      QS.qcm("L'eau sucrée a toujours un goût sucré. Cela prouve que le sucre…", "est encore dans l'eau", ["s'est envolé", "est devenu du sel"]),
    ];
  },
  /* ---------- objets et énergie ---------- */
  "sc4-1": () => [
    QS.qcm("Que faut-il pour allumer une ampoule ?", "une pile, des fils et une ampoule", ["seulement une ampoule", "un aimant et une ampoule"]),
    QS.qcm("Pour que l'ampoule s'allume, le circuit doit être…", "fermé", ["ouvert", "coupé"]),
    QS.qcm("À quoi sert l'interrupteur ?", "à ouvrir ou fermer le circuit", ["à recharger la pile", "à changer la couleur"]),
    QS.vf("Si un fil est débranché, l'ampoule s'éteint.", true),
    QS.vf("On peut jouer avec les prises électriques de la maison.", false),
    QS.vf("Une pile neuve, une ampoule et deux fils bien branchés font un circuit qui marche.", true),
    QS.vf("Le courant de la prise (230 volts) est dangereux.", true),
    QS.img("Clique sur ce qui fournit l'énergie au circuit.", [["🔋", "la pile"], ["💡", "l'ampoule"], ["〰️", "le fil"]], 0),
    QS.img("Clique sur l'objet DANGEREUX à toucher.", [["🔌", "la prise de la maison"], ["🔋", "une petite pile"], ["🧸", "une peluche"]], 0),
    QS.vf("L'ampoule peut s'allumer avec un seul fil branché.", false),
  ],
  "sc4-2": () => {
    const o = pick(SCI_OBJETS_ELEC);
    const conducteurs = SCI_OBJETS_ELEC.filter((x) => x[2]), isolants = SCI_OBJETS_ELEC.filter((x) => !x[2]);
    return [
      QS.qcm(`On met ${o[1]} dans le circuit. L'ampoule…`, o[2] ? "s'allume : c'est un conducteur" : "reste éteinte : c'est un isolant", [o[2] ? "reste éteinte : c'est un isolant" : "s'allume : c'est un conducteur"], grand(o[0])),
      QS.img("Clique sur l'objet conducteur.", [pick(conducteurs), ...sample(isolants, 2)].map((x) => [x[0], x[1]]), 0),
      QS.img("Clique sur l'objet isolant.", [pick(isolants), ...sample(conducteurs, 2)].map((x) => [x[0], x[1]]), 0),
      QS.vf("Les métaux laissent passer le courant électrique.", true),
      QS.vf("Le plastique laisse passer le courant électrique.", false),
      QS.qcm("Pourquoi les fils électriques sont-ils entourés de plastique ?", "pour nous protéger du courant", ["pour la décoration", "pour qu'ils soient lourds"]),
      QS.qcm("Un matériau qui laisse passer le courant est…", "un conducteur", ["un isolant", "un aimant"]),
      QS.qcm("Un matériau qui ne laisse pas passer le courant est…", "un isolant", ["un conducteur", "une pile"]),
    ];
  },
  "sc4-3": () => {
    const o = pick(SCI_OBJETS_AIMANT);
    const oui = SCI_OBJETS_AIMANT.filter((x) => x[2]), non = SCI_OBJETS_AIMANT.filter((x) => !x[2]);
    return [
      QS.qcm(`L'aimant attire-t-il ${o[1]} ?`, o[2] ? "oui" : "non", [o[2] ? "non" : "oui"], grand(o[0])),
      QS.img("Clique sur l'objet attiré par l'aimant.", [pick(oui), ...sample(non, 2)].map((x) => [x[0], x[1]]), 0),
      QS.img("Clique sur l'objet que l'aimant n'attire PAS.", [pick(non), ...sample(oui, 2)].map((x) => [x[0], x[1]]), 0),
      QS.qcm("Un aimant attire les objets en…", "fer ou en acier", ["bois", "plastique"]),
      QS.qcm("Le pôle nord d'un aimant et le pôle sud d'un autre aimant…", "s'attirent", ["se repoussent", "ne font rien"]),
      QS.qcm("Deux pôles nord placés face à face…", "se repoussent", ["s'attirent", "se collent"]),
      QS.vf("Un aimant attire tous les métaux.", false),
      QS.vf("Un aimant peut attirer un trombone à travers une feuille de papier.", true),
      QS.vf("La boussole contient une aiguille aimantée qui montre le nord.", true),
    ];
  },
  /* ---------- les plantes ---------- */
  "sc5-1": () => [
    QS.qcm("À quoi servent les racines ?", "à boire l'eau et à tenir la plante", ["à faire des fleurs", "à attraper la lumière"]),
    QS.qcm("Quelle partie de la plante fabrique sa nourriture avec la lumière ?", "les feuilles", ["les racines", "les graines"]),
    QS.qcm("Que fait la tige ?", "elle porte les feuilles et fait monter l'eau", ["elle boit l'eau dans la terre", "elle devient un fruit"]),
    QS.qcm("Que devient la fleur ?", "un fruit", ["une racine", "une feuille"]),
    QS.qcm("Où sont les graines d'une tomate ?", "dans le fruit", ["dans les racines", "dans la tige"]),
    QS.img("Clique sur le fruit.", [["🍅", "une tomate"], ["🌿", "une feuille"], ["🌸", "une fleur"]], 0),
    QS.img("Clique sur la fleur.", [["🌻", "un tournesol"], ["🥕", "une carotte"], ["🌰", "une graine"]], 0),
    QS.vf("Les racines sont sous la terre.", true),
    QS.vf("Les feuilles ont besoin de lumière.", true),
    QS.vf("Les graines poussent sur les racines.", false),
    QS.ordre("Remets les parties dans l'ordre, du bas vers le haut de la plante.", ["les racines", "la tige", "les feuilles", "la fleur"]),
    QS.mots("Clique sur les deux parties de la plante qui sont au soleil.", "Les racines boivent sous la terre , les feuilles et les fleurs regardent le soleil .", ["feuilles", "fleurs"]),
  ],
  "sc5-2": () => [
    QS.ordre("Remets le cycle de vie de la plante dans l'ordre.", ["la graine", "la jeune pousse", "la plante en fleur", "le fruit", "les nouvelles graines"]),
    QS.qcm("Qui transporte le pollen d'une fleur à l'autre ?", "les abeilles", ["les vers de terre", "les escargots"]),
    QS.qcm("Après la pollinisation, que devient la fleur ?", "un fruit", ["une racine", "une graine qui vole"]),
    QS.qcm("Comment s'appellent les graines de la pomme ?", "les pépins", ["les noyaux de cerise", "les feuilles"]),
    QS.qcm("Que se passe-t-il quand on plante une graine du fruit ?", "une nouvelle plante pousse", ["rien du tout", "elle devient une pierre"]),
    QS.img("Clique sur l'animal qui aide les fleurs à devenir des fruits.", [["🐝", "l'abeille"], ["🐌", "l'escargot"], ["🐟", "le poisson"]], 0),
    QS.vf("Les graines sont dans le fruit.", true),
    QS.vf("Le cycle de vie d'une plante recommence avec ses graines.", true),
    QS.vf("Une plante à fleurs fait ses fruits avant ses fleurs.", false),
    QS.qcm("Quel est le bon ordre ?", "graine → plante → fleur → fruit", ["fruit → racine → fleur → graine", "fleur → graine → tige → fruit"]),
  ],
  "sc5-3": () => {
    const PLANTES = [["l'olivier", "un arbre"], ["l'oranger", "un arbre"], ["le palmier dattier", "un arbre"], ["l'arganier", "un arbre"],
      ["le rosier", "un arbuste"], ["le laurier-rose", "un arbuste"], ["la menthe", "une plante herbacée"], ["le tournesol", "une plante herbacée"],
      ["la tomate", "une plante herbacée"], ["la salade", "une plante herbacée"]];
    const CAT = ["un arbre", "un arbuste", "une plante herbacée"];
    const a = pick(PLANTES), b = pick(PLANTES.filter((x) => x[1] !== a[1]));
    const maj = (t) => t.charAt(0).toUpperCase() + t.slice(1);
    return [
      QS.qcm(`${maj(a[0])} est…`, a[1], CAT.filter((c) => c !== a[1])),
      QS.qcm(`${maj(b[0])} est…`, b[1], CAT.filter((c) => c !== b[1])),
      QS.qcm("Qu'est-ce qui montre qu'une plante est un arbre ?", "un seul gros tronc en bois", ["des fleurs jaunes", "une tige verte et souple"]),
      QS.qcm("Un arbuste a…", "plusieurs tiges en bois", ["un seul gros tronc", "une tige verte et molle"]),
      QS.qcm("Une plante aromatique, comme la menthe…", "sent bon et parfume les plats", ["pique comme un cactus", "a un tronc en bois"]),
      QS.qcm("Quelle plante est une plante potagère ?", "la tomate", ["le rosier", "l'olivier"]),
      QS.vf("L'arganier pousse au Maroc ; avec ses fruits, on fait de l'huile d'argan.", true),
      QS.vf("La menthe a un tronc en bois.", false),
      QS.vf("L'olivier est un arbre.", true),
      QS.img("Clique sur l'arbre.", [["🌳", "un arbre"], ["🌷", "une tulipe"], ["🌿", "une herbe"]], 0),
    ];
  },
  "sc5-4": () => [
    QS.qcm("Laquelle de ces plantes deviendra la plus grande ?", "l'oranger", ["le radis", "la menthe"]),
    QS.qcm("Combien de temps peut vivre un olivier ?", "plus de 1 000 ans", ["un mois", "10 jours"]),
    QS.qcm("Un arbre adulte mesure souvent…", "plusieurs mètres", ["quelques centimètres", "un kilomètre"]),
    QS.qcm("Le radis vit…", "une seule saison", ["plus de 100 ans", "toute la vie d'un arbre"]),
    QS.ordre("Range ces plantes adultes de la plus petite à la plus grande.", ["le radis", "le rosier", "l'oranger"]),
    QS.vf("Un arbre grandit pendant de nombreuses années.", true),
    QS.vf("Le radis vit plusieurs années.", false),
    QS.vf("Le rosier reste plus petit qu'un arbre.", true),
    QS.img("Clique sur la plante qui vit le plus longtemps.", [["🌳", "un arbre"], ["🌻", "un tournesol"], ["🥬", "une salade"]], 0),
  ],
};


/* ------------------------------------------------------------------ */
/* La matière « Sciences »                                             */
/* ------------------------------------------------------------------ */
const SCI = {
  id: "sci", name: "Sciences", color: "#3fa34d",
  chapters: [
    {
      id: "sc1", title: "Le vivant", color: "#3fa34d", lessons: [
        { id: "sc1-1", title: "Vivant ou non vivant ?",
          lesson: { rule: ["Un <b>être vivant</b> naît, se nourrit, grandit, se reproduit et meurt.", "Les animaux, les plantes et les champignons sont vivants. Un caillou ou un robot ne le sont pas."], ex: "Le chat et l'arbre sont <b>vivants</b> ; le vélo ne l'est pas." } },
        { id: "sc1-2", title: "Les besoins des plantes",
          lesson: { rule: ["Pour <b>germer</b>, une graine a besoin d'<b>eau</b>.", "Pour grandir et rester verte, la plante a besoin d'eau, de <b>lumière</b> et d'air. Les <b>racines</b> puisent l'eau dans le sol."], ex: "Sans lumière, une plante devient jaune et molle." } },
        { id: "sc1-3", title: "Qui mange qui ?",
          lesson: { rule: ["Un <b>herbivore</b> mange des plantes, un <b>carnivore</b> mange d'autres animaux, un <b>omnivore</b> mange les deux.", "Une <b>chaîne alimentaire</b> commence par une plante : chaque être vivant est mangé par le suivant."], ex: "l'herbe → le lapin → le renard" } },
      ],
    },
    {
      id: "sc2", title: "Le corps humain", color: "#ef7fa8", lessons: [
        { id: "sc2-1", title: "Le squelette et les muscles",
          lesson: { rule: ["Le <b>squelette</b> (environ 206 os) soutient le corps et protège les organes : le <b>crâne</b> protège le cerveau, les <b>côtes</b> protègent le cœur et les poumons.", "Les <b>muscles</b> tirent sur les os pour les faire bouger, au niveau des <b>articulations</b> (coude, genou…)."], ex: "Quand je plie le bras, le muscle se contracte et le <b>coude</b> se plie." } },
        { id: "sc2-2", title: "Les dents",
          lesson: { rule: ["Les <b>incisives</b> coupent, les <b>canines</b> déchirent, les <b>molaires</b> broient.", "Un enfant a 20 dents de lait ; un adulte a 32 dents définitives. On se brosse les dents 2 minutes, au moins 2 fois par jour."], ex: "Je croque la pomme avec mes <b>incisives</b>." } },
        { id: "sc2-3", title: "Bien manger, bien vivre",
          lesson: { rule: ["Un repas équilibré contient un peu de chaque <b>famille d'aliments</b> : fruits et légumes, féculents, produits laitiers, viande-poisson-œufs. On boit de l'<b>eau</b>.", "Pour être en forme, on bouge chaque jour et on dort environ 10 heures."], ex: "Midi : salade, poisson, riz, yaourt et une pomme." } },
      ],
    },
    {
      id: "sc3", title: "La matière et l'eau", color: "#2e86de", lessons: [
        { id: "sc3-1", title: "Les trois états de l'eau",
          lesson: { rule: ["L'eau peut être <b>solide</b> (glace), <b>liquide</b> ou <b>gazeuse</b> (vapeur).", "Elle gèle à <b>0 °C</b> (solidification) et la glace fond au-dessus (fusion). Elle bout à <b>100 °C</b>."], ex: "Un glaçon posé au soleil <b>fond</b> : il devient liquide." } },
        { id: "sc3-2", title: "Le cycle de l'eau",
          lesson: { rule: ["Le Soleil chauffe la mer : l'eau s'<b>évapore</b>. En montant, la vapeur refroidit et forme les nuages (<b>condensation</b>).", "Il pleut ou il neige (<b>précipitations</b>) ; l'eau rejoint les rivières puis la mer. Le cycle recommence."], ex: "mer → vapeur → nuage → pluie → rivière → mer" } },
        { id: "sc3-3", title: "Mélanger et dissoudre",
          lesson: { rule: ["Le sucre et le sel se <b>dissolvent</b> dans l'eau : on ne les voit plus, mais ils sont toujours là (l'eau a leur goût).", "Le sable ne se dissout pas : on peut le séparer en <b>filtrant</b>. Le sel se récupère quand l'eau s'<b>évapore</b>."], ex: "Dans les marais salants, l'eau de mer s'évapore et laisse le <b>sel</b>." } },
      ],
    },
    {
      id: "sc4", title: "Électricité et aimants", color: "#e0a800", lessons: [
        { id: "sc4-1", title: "Le circuit électrique",
          lesson: { rule: ["Pour allumer une ampoule, il faut un <b>circuit fermé</b> : une pile, des fils et l'ampoule, reliés sans interruption.", "L'<b>interrupteur</b> ouvre ou ferme le circuit. Le courant des prises de la maison est <b>dangereux</b> : on n'y touche jamais."], ex: "Interrupteur fermé : l'ampoule s'<b>allume</b>." } },
        { id: "sc4-2", title: "Conducteurs et isolants",
          lesson: { rule: ["Un <b>conducteur</b> laisse passer le courant : les métaux (fer, cuivre, aluminium…).", "Un <b>isolant</b> ne le laisse pas passer : plastique, bois, verre, papier. Les fils sont entourés de plastique pour nous protéger."], ex: "Un clou dans le circuit : l'ampoule s'allume. Une gomme : elle reste éteinte." } },
        { id: "sc4-3", title: "L'aimant",
          lesson: { rule: ["Un <b>aimant</b> attire les objets en <b>fer</b> ou en <b>acier</b>, même à travers une feuille. Il n'attire pas le bois, le plastique, ni l'aluminium.", "Un aimant a deux <b>pôles</b> : deux pôles différents s'attirent, deux pôles pareils se repoussent."], ex: "L'aimant attire le <b>trombone</b>, pas la gomme." } },
      ],
    },
    {
      id: "sc5", title: "Les plantes", color: "#2a8a4a", lessons: [
        { id: "sc5-1", title: "Les parties de la plante",
          lesson: { rule: ["Les <b>racines</b> sont dans la terre : elles boivent l'eau et tiennent la plante. La <b>tige</b> porte les feuilles et fait monter l'eau. Les <b>feuilles</b> fabriquent la nourriture de la plante avec la lumière.", "La <b>fleur</b> devient un <b>fruit</b>, et dans le fruit il y a les <b>graines</b>."], ex: "Coupe une tomate : tu vois ses petites <b>graines</b>." } },
        { id: "sc5-2", title: "Le cycle de vie d'une plante",
          lesson: { rule: ["La graine <b>germe</b>, la plante grandit, puis elle fait des <b>fleurs</b>.", "Les abeilles transportent le pollen de fleur en fleur : c'est la <b>pollinisation</b>. La fleur devient un <b>fruit</b> plein de <b>graines</b>… et le cycle recommence."], ex: "graine → plante → fleur → fruit → graines" } },
        { id: "sc5-3", title: "Les familles de plantes",
          lesson: { rule: ["Un <b>arbre</b> a un seul gros tronc en bois et vit très longtemps : l'olivier, l'oranger, l'arganier. Un <b>arbuste</b> a plusieurs tiges en bois : le rosier, le laurier-rose.", "Les <b>plantes herbacées</b> ont une tige verte et souple : les fleurs (le tournesol), les plantes <b>potagères</b> (la tomate, la salade) et <b>aromatiques</b> (la menthe)."], ex: "L'olivier est un arbre ; le rosier, un arbuste ; la menthe, une plante herbacée." } },
        { id: "sc5-4", title: "Grand arbre ou petite plante ?",
          lesson: { rule: ["Certaines plantes ne vivent qu'<b>une saison</b> : elles poussent, fleurissent, font leurs graines puis meurent (le radis, le tournesol).", "D'autres vivent <b>des années</b> et grandissent un peu chaque année : les arbustes, et surtout les <b>arbres</b>, qui dépassent souvent 10 mètres."], ex: "Un radis vit quelques semaines ; un olivier peut vivre plus de 1 000 ans." } },
      ],
    },
  ],
};
SCI.chapters.forEach((ch) => ch.lessons.forEach((l) => { l.bank = () => shuffle(SCI_BANQUES[l.id]()); }));

/* on ajoute la matière au cahier (après le français et les maths) */
CONTENT.sci = SCI;
for (const ch of SCI.chapters) {
  ch.subject = SCI.id;
  ch.lessons.forEach((l, i) => { l.chapter = ch; l.subject = SCI.id; l.index = i; LESSONS[l.id] = l; });
}
