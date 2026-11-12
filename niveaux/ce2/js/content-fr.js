/* L'Atelier de Boulon — Français CE2 : leçons et exercices originaux. */
"use strict";

/* ================================================================== */
/* Moteur de conjugaison (présent, futur, imparfait)                   */
/* ================================================================== */
const Conj = {
  persons: ["je", "tu", "il", "nous", "vous", "ils"],
  personsFull: ["je", "tu", "il / elle / on", "nous", "vous", "ils / elles"],
  irregular: {
    "être": { pres: ["suis", "es", "est", "sommes", "êtes", "sont"], fut: "ser", imp: "ét" },
    "avoir": { pres: ["ai", "as", "a", "avons", "avez", "ont"], fut: "aur" },
    "aller": { pres: ["vais", "vas", "va", "allons", "allez", "vont"], fut: "ir" },
    "faire": { pres: ["fais", "fais", "fait", "faisons", "faites", "font"], fut: "fer" },
    "dire": { pres: ["dis", "dis", "dit", "disons", "dites", "disent"], fut: "dir" },
    "venir": { pres: ["viens", "viens", "vient", "venons", "venez", "viennent"], fut: "viendr" },
    "prendre": { pres: ["prends", "prends", "prend", "prenons", "prenez", "prennent"], fut: "prendr" },
    "voir": { pres: ["vois", "vois", "voit", "voyons", "voyez", "voient"], fut: "verr" },
    "pouvoir": { pres: ["peux", "peux", "peut", "pouvons", "pouvez", "peuvent"], fut: "pourr" },
    "vouloir": { pres: ["veux", "veux", "veut", "voulons", "voulez", "veulent"], fut: "voudr" },
    "partir": { pres: ["pars", "pars", "part", "partons", "partez", "partent"], fut: "partir" },
  },
  group2: ["finir", "choisir", "grandir", "remplir", "obéir", "rougir", "réfléchir", "réussir", "nourrir", "applaudir", "bâtir", "salir"],
  group1: ["chanter", "jouer", "parler", "danser", "marcher", "regarder", "aimer", "écouter", "dessiner", "sauter",
    "manger", "nager", "ranger", "bouger", "commencer", "lancer", "avancer", "arriver", "porter", "chercher",
    "trouver", "laver", "colorier", "crier", "oublier", "travailler", "habiter", "inventer", "visiter", "préparer"],

  groupOf(v) {
    if (this.irregular[v]) return 3;
    if (v.endsWith("er")) return 1;
    if (this.group2.includes(v)) return 2;
    return 3;
  },
  present(v) {
    if (this.irregular[v]) return this.irregular[v].pres.slice();
    if (v.endsWith("er")) {
      const st = v.slice(0, -2);
      const nous = v.endsWith("ger") ? st + "eons" : v.endsWith("cer") ? st.slice(0, -1) + "çons" : st + "ons";
      return [st + "e", st + "es", st + "e", nous, st + "ez", st + "ent"];
    }
    if (v.endsWith("ir")) {
      const st = v.slice(0, -2);
      return [st + "is", st + "is", st + "it", st + "issons", st + "issez", st + "issent"];
    }
    return null;
  },
  futur(v) {
    let stem = this.irregular[v]?.fut;
    if (!stem) stem = v.endsWith("re") ? v.slice(0, -1) : v;
    return ["ai", "as", "a", "ons", "ez", "ont"].map((e) => stem + e);
  },
  imparfait(v) {
    let stem = this.irregular[v]?.imp;
    if (!stem) stem = this.present(v)[3].replace(/ons$/, "");
    return ["ais", "ais", "ait", "ions", "iez", "aient"].map((e) => {
      let s = stem;
      if (e.startsWith("i")) { if (/ge$/.test(s)) s = s.slice(0, -1); if (/ç$/.test(s)) s = s.slice(0, -1) + "c"; }
      return s + e;
    });
  },
  tense(v, t) { return t === "futur" ? this.futur(v) : t === "imparfait" ? this.imparfait(v) : this.present(v); },
  pronoun(i, form, full = false) {
    const p = full ? this.personsFull[i] : this.persons[i];
    if (i === 0 && /^[aeiouyéèêâîôûh]/i.test(form)) return "j'";
    return p;
  },
  withPronoun(i, form, full = false) {
    const p = this.pronoun(i, form, full);
    return p === "j'" ? "j'" + form : p + " " + form;
  },
};

/* sujets variés pour les phrases d'exercices */
const SUBJECTS = [
  { s: "Je", p: 0 }, { s: "Tu", p: 1 }, { s: "Léo", p: 2 }, { s: "Mila", p: 2 }, { s: "On", p: 2 },
  { s: "Nous", p: 3 }, { s: "Vous", p: 4 }, { s: "Les enfants", p: 5 }, { s: "Elles", p: 5 }, { s: "Mes cousins", p: 5 },
];
const VERB_COMPLEMENTS = {
  chanter: "une chanson", jouer: "au ballon", parler: "doucement", danser: "dans le salon", marcher: "vers l'école",
  regarder: "les étoiles", aimer: "les crêpes", écouter: "la maîtresse", dessiner: "un dragon", sauter: "très haut",
  manger: "une pomme", nager: "dans la piscine", ranger: "sa chambre", bouger: "sans arrêt", commencer: "le travail",
  lancer: "la balle", avancer: "lentement", arriver: "en avance", porter: "un gros sac", chercher: "ses clés",
  trouver: "un trésor", laver: "la voiture", colorier: "un dessin", crier: "de joie", oublier: "son cahier",
  travailler: "dans le jardin", habiter: "près du parc", inventer: "une machine", visiter: "un musée", préparer: "un gâteau",
  finir: "ses devoirs", choisir: "un livre", grandir: "vite", remplir: "la bouteille", obéir: "à ses parents",
  rougir: "de plaisir", réfléchir: "avant de répondre", réussir: "son tour de magie", nourrir: "le chat", applaudir: "les artistes",
  bâtir: "une cabane", salir: "ses chaussures",
  être: "dans la cour", avoir: "un vélo rouge", aller: "à la piscine", faire: "un puzzle", dire: "bonjour",
  venir: "avec nous", prendre: "le bus", voir: "un arc-en-ciel", pouvoir: "entrer", vouloir: "du chocolat", partir: "en vacances",
};
function sentenceFor(verb, subj, tense = "present") {
  const forms = Conj.tense(verb, tense);
  const form = forms[subj.p];
  let s = subj.s;
  if (subj.p === 0 && /^[aeiouyéèêâîôûh]/i.test(form)) s = "J'";
  const sep = s.endsWith("'") ? "" : " ";
  const c = VERB_COMPLEMENTS[verb];                       // un complément, ou une liste au choix
  return { form, before: s + sep, after: " " + (Array.isArray(c) ? pick(c) : c) + "." };
}
/* question « verbe à conjuguer » générée */
function conjQuestion(verb, tense = "present", type) {
  const subj = pick(SUBJECTS);
  const { form, before, after } = sentenceFor(verb, subj, tense);
  const tname = { present: "au présent", futur: "au futur", imparfait: "à l'imparfait" }[tense];
  type = type || pick(["trous", "qcm"]);
  if (type === "qcm") {
    const forms = Conj.tense(verb, tense);
    const wrong = shuffle([...new Set(forms.filter((f) => f !== form))]).slice(0, 3);
    return {
      type: "qcm", consigne: `Choisis la bonne forme du verbe « ${verb} » ${tname}.`,
      prompt: `${before}<b>…</b>${after}`, choices: shuffle([form, ...wrong]), answer: form,
    };
  }
  return {
    type: "trous", consigne: `Conjugue le verbe entre parenthèses ${tname}.`,
    text: `${before}[${form}] <i>(${verb})</i>${after}`,
  };
}

/* ================================================================== */
/* Banques de questions                                                */
/* ================================================================== */
const FR = {
  id: "fr", name: "Français", color: "#e4572e",
  chapters: [
    /* ---------------------------------------------------------------- */
    {
      id: "fr1", title: "Lire et comprendre", color: "#e4572e", lessons: [
        {
          id: "fr1-1", title: "Lire une consigne",
          lesson: {
            rule: ["Une <b>consigne</b> te dit ce que tu dois faire.",
              "Elle commence souvent par un <b>verbe d'action</b> : <i>entoure, souligne, recopie, complète, relie, colorie, barre</i>.",
              "Avant de répondre, lis la consigne <b>jusqu'au bout</b> et repère le verbe."],
            ex: "« <b>Souligne</b> en rouge les noms. » → je trace un trait rouge <u>sous</u> chaque nom.",
          },
          bank: () => [
            { type: "qcm", consigne: "Que dois-tu faire ?", prompt: "« Entoure le mot le plus long. »", choices: ["Tracer un rond autour du mot", "Tracer un trait sous le mot", "Recopier le mot"], answer: "Tracer un rond autour du mot" },
            { type: "qcm", consigne: "Que dois-tu faire ?", prompt: "« Souligne le titre du texte. »", choices: ["Tracer un trait sous le titre", "Barrer le titre", "Colorier le titre"], answer: "Tracer un trait sous le titre" },
            { type: "qcm", consigne: "Que dois-tu faire ?", prompt: "« Barre l'intrus. »", choices: ["Tracer un trait sur le mot qui ne va pas", "Entourer le bon mot", "Effacer toute la liste"], answer: "Tracer un trait sur le mot qui ne va pas" },
            { type: "qcm", consigne: "Que dois-tu faire ?", prompt: "« Relie chaque animal à son petit. »", choices: ["Tracer des traits entre les mots", "Écrire le nom des animaux", "Dessiner les animaux"], answer: "Tracer des traits entre les mots" },
            { type: "mots", consigne: "Clique sur le verbe qui dit ce qu'il faut faire.", sentence: "Recopie la phrase sans faute .", answer: ["Recopie"] },
            { type: "mots", consigne: "Clique sur le verbe qui dit ce qu'il faut faire.", sentence: "Dans le texte , colorie les mots en bleu .", answer: ["colorie"] },
            { type: "mots", consigne: "Clique sur le verbe qui dit ce qu'il faut faire.", sentence: "Complète chaque phrase avec un mot .", answer: ["Complète"] },
            { type: "vf", consigne: "Vrai ou faux ?", prompt: "Pour bien répondre, il suffit de lire le premier mot de la consigne.", answer: false },
            { type: "vf", consigne: "Vrai ou faux ?", prompt: "« Recopie » veut dire « écris la même chose ».", answer: true },
            { type: "qcm", consigne: "Combien de choses la consigne demande-t-elle ?", prompt: "« Lis le texte, puis souligne les verbes. »", choices: ["1", "2", "3"], answer: "2" },
            { type: "qcm", consigne: "Quelle consigne demande d'écrire ?", prompt: "Choisis la bonne consigne.", choices: ["Recopie le mot", "Entoure le mot", "Barre le mot"], answer: "Recopie le mot" },
          ],
        },
        {
          id: "fr1-2", title: "Remettre une histoire dans l'ordre",
          lesson: {
            rule: ["Une histoire a un <b>début</b>, un <b>milieu</b> et une <b>fin</b>.",
              "Les mots comme <i>d'abord, ensuite, puis, enfin</i> aident à trouver l'ordre.",
              "Dans une phrase aussi, les mots ont un ordre : le sujet, puis le verbe, puis le reste."],
            ex: "<b>D'abord</b> Tom plante une graine. <b>Ensuite</b> il l'arrose. <b>Enfin</b> une fleur pousse.",
          },
          bank: () => [
            { type: "ordre", consigne: "Clique sur les mots dans l'ordre pour écrire la phrase.", words: ["Le", "robot", "répare", "la", "vieille", "horloge."] },
            { type: "ordre", consigne: "Clique sur les mots dans l'ordre pour écrire la phrase.", words: ["Ce", "matin,", "Lina", "a", "raté", "le", "bus."] },
            { type: "ordre", consigne: "Clique sur les mots dans l'ordre pour écrire la phrase.", words: ["Mon", "chien", "court", "après", "les", "pigeons."] },
            { type: "ordre", consigne: "Clique sur les mots dans l'ordre pour écrire la phrase.", words: ["Les", "élèves", "visitent", "une", "ferme."] },
            { type: "qcm", consigne: "Qu'est-ce qui se passe en premier ?", prompt: "Sami mange son goûter. • Sami rentre de l'école. • Sami fait ses devoirs.", choices: ["Sami rentre de l'école.", "Sami mange son goûter.", "Sami fait ses devoirs."], answer: "Sami rentre de l'école." },
            { type: "qcm", consigne: "Qu'est-ce qui se passe en dernier ?", prompt: "Le gâteau cuit. • Zoé mélange la farine et les œufs. • Toute la famille goûte le gâteau.", choices: ["Toute la famille goûte le gâteau.", "Le gâteau cuit.", "Zoé mélange la farine et les œufs."], answer: "Toute la famille goûte le gâteau." },
            { type: "qcm", consigne: "Quel mot montre que c'est la fin ?", prompt: "« …, Enfin, le chat retrouva sa maison. »", choices: ["Enfin", "Le chat", "Maison"], answer: "Enfin" },
            { type: "qcm", consigne: "Qu'est-ce qui se passe en premier ?", prompt: "La tente est montée. • Les enfants dorment sous la tente. • Papa sort la tente du coffre.", choices: ["Papa sort la tente du coffre.", "La tente est montée.", "Les enfants dorment sous la tente."], answer: "Papa sort la tente du coffre." },
            { type: "qcm", consigne: "Quel mot sert à continuer une histoire ?", prompt: "Choisis le bon mot.", choices: ["ensuite", "pourtant", "jamais"], answer: "ensuite" },
          ],
        },
        {
          id: "fr1-3", title: "Les mots qui manquent",
          lesson: {
            rule: ["Pour retrouver un mot qui manque, <b>lis toute la phrase</b>, même après le trou.",
              "Demande-toi : quel mot a du <b>sens</b> ici ? Est-ce un nom, un verbe, un adjectif ?"],
            ex: "Le boulanger fait du <b>pain</b> tous les matins.",
          },
          bank: () => [
            { type: "trous", consigne: "Écris le mot qui manque.", text: "Le facteur apporte le [courrier|journal] tous les jours." },
            { type: "trous", consigne: "Écris le mot qui manque.", text: "Il pleut : prends ton [parapluie|imperméable|manteau] !" },
            { type: "trous", consigne: "Écris le mot qui manque.", text: "La nuit, on voit la [lune|Lune] et les étoiles." },
            { type: "qcm", consigne: "Choisis le mot qui convient.", prompt: "Le pompier monte à l'… pour sauver le chat.", choices: ["échelle", "assiette", "écharpe"], answer: "échelle" },
            { type: "qcm", consigne: "Choisis le mot qui convient.", prompt: "Pour couper le papier, j'utilise des …", choices: ["ciseaux", "oiseaux", "chapeaux"], answer: "ciseaux" },
            { type: "qcm", consigne: "Choisis le mot qui convient.", prompt: "La poule a pondu un … dans son nid.", choices: ["œuf", "œil", "bœuf"], answer: "œuf" },
            { type: "qcm", consigne: "Choisis le mot qui convient.", prompt: "En hiver, le lac est … : on peut patiner.", choices: ["gelé", "chaud", "rempli"], answer: "gelé" },
            { type: "qcm", consigne: "Choisis le mot qui convient.", prompt: "Le jardinier … les fleurs avec un arrosoir.", choices: ["arrose", "attrape", "allume"], answer: "arrose" },
            { type: "trous", consigne: "Écris le mot qui manque.", text: "Le bébé dort dans son [lit|berceau]." },
            { type: "qcm", consigne: "Choisis le mot qui convient.", prompt: "Pour voir les microbes, le savant regarde dans un …", choices: ["microscope", "téléphone", "tambour"], answer: "microscope" },
          ],
        },
        {
          id: "fr1-4", title: "Écrire une petite annonce",
          lesson: {
            rule: ["Une <b>petite annonce</b> est un texte court pour vendre, chercher ou proposer quelque chose.",
              "Elle dit : <b>quoi</b> ? <b>où</b> ? <b>quand</b> ? et <b>comment</b> joindre la personne."],
            ex: "PERDU : chat gris, collier rouge, près de la gare, samedi. Appeler Nina au 06 12 34 56 78.",
          },
          bank: () => {
            const prix = Money.amount(40 * Money.scale());
            const ann = `<div style='text-align:left;background:#fff;border:3px solid #2b2236;border-radius:14px;padding:10px 16px;font-size:22px'><b>À VENDRE</b> : vélo bleu pour enfant, très bon état, ${prix}.<br>Visible au 12 rue des Lilas, le mercredi.<br>Contact : Paul, 06 11 22 33 44.</div>`;
            const ann2 = "<div style='text-align:left;background:#fff;border:3px solid #2b2236;border-radius:14px;padding:10px 16px;font-size:22px'><b>RECHERCHE</b> : partenaire pour jouer aux échecs le samedi matin, à la médiathèque.<br>Écrire à Inès : ines@exemple.fr</div>";
            return [
              { type: "qcm", consigne: "Lis l'annonce et réponds.", prompt: ann + "Que vend Paul ?", choices: ["Un vélo", "Une trottinette", "Des rollers"], answer: "Un vélo" },
              { type: "qcm", consigne: "Lis l'annonce et réponds.", prompt: ann + "Combien coûte l'objet ?", choices: [prix, Money.amount(12 * Money.scale()), Money.amount(11)], answer: prix },
              { type: "qcm", consigne: "Lis l'annonce et réponds.", prompt: ann + "Quel jour peut-on le voir ?", choices: ["Le mercredi", "Le samedi", "Le lundi"], answer: "Le mercredi" },
              { type: "qcm", consigne: "Lis l'annonce et réponds.", prompt: ann2 + "Que cherche Inès ?", choices: ["Quelqu'un pour jouer aux échecs", "Un livre", "Un chat perdu"], answer: "Quelqu'un pour jouer aux échecs" },
              { type: "qcm", consigne: "Lis l'annonce et réponds.", prompt: ann2 + "Où aura lieu le jeu ?", choices: ["À la médiathèque", "À l'école", "Au parc"], answer: "À la médiathèque" },
              { type: "qcm", consigne: "Que manque-t-il à cette annonce ?", prompt: "« PERDU : doudou lapin blanc, au square, dimanche. »", choices: ["Comment joindre la personne", "Ce qui est perdu", "Le lieu"], answer: "Comment joindre la personne" },
              { type: "vf", consigne: "Vrai ou faux ?", prompt: "Une petite annonce doit être très longue.", answer: false },
              { type: "vf", consigne: "Vrai ou faux ?", prompt: "Une annonce doit dire comment contacter la personne.", answer: true },
              { type: "qcm", consigne: "Quel mot commence bien une annonce pour vendre ?", prompt: "Choisis.", choices: ["À VENDRE", "IL ÉTAIT UNE FOIS", "CHÈRE MAMIE"], answer: "À VENDRE" },
            ];
          },
        },
        {
          id: "fr1-5", title: "Comprendre un mot grâce à la phrase",
          lesson: {
            rule: ["Un même mot peut avoir <b>plusieurs sens</b>.",
              "C'est la <b>phrase</b> (le contexte) qui t'aide à trouver le bon sens."],
            ex: "« La <b>souris</b> de l'ordinateur » ≠ « la <b>souris</b> mange du fromage ».",
          },
          bank: () => [
            { type: "qcm", consigne: "Dans cette phrase, que veut dire le mot en gras ?", prompt: "Mamie s'assoit sur le <b>banc</b> du jardin.", choices: ["Un siège long", "Un groupe de poissons"], answer: "Un siège long" },
            { type: "qcm", consigne: "Dans cette phrase, que veut dire le mot en gras ?", prompt: "Un <b>banc</b> de sardines passe sous le bateau.", choices: ["Un groupe de poissons", "Un siège long"], answer: "Un groupe de poissons" },
            { type: "qcm", consigne: "Dans cette phrase, que veut dire le mot en gras ?", prompt: "J'ai mal à la <b>tête</b>.", choices: ["Une partie du corps", "Le premier de la course"], answer: "Une partie du corps" },
            { type: "qcm", consigne: "Dans cette phrase, que veut dire le mot en gras ?", prompt: "Le coureur est en <b>tête</b> de la course.", choices: ["Le premier de la course", "Une partie du corps"], answer: "Le premier de la course" },
            { type: "qcm", consigne: "Dans cette phrase, que veut dire le mot en gras ?", prompt: "Le joueur marque un <b>but</b>.", choices: ["Un point au football", "Un objectif dans la vie"], answer: "Un point au football" },
            { type: "qcm", consigne: "Dans cette phrase, que veut dire le mot en gras ?", prompt: "Papa remplace l'<b>ampoule</b> du salon.", choices: ["Une lampe électrique", "Une bulle sur la peau"], answer: "Une lampe électrique" },
            { type: "qcm", consigne: "Dans cette phrase, que veut dire le mot en gras ?", prompt: "Après la randonnée, Hugo a une <b>ampoule</b> au pied.", choices: ["Une bulle sur la peau", "Une lampe électrique"], answer: "Une bulle sur la peau" },
            { type: "qcm", consigne: "Dans cette phrase, que veut dire le mot en gras ?", prompt: "Le bateau est attaché au <b>quai</b>.", choices: ["Le bord du port", "Une clé de porte"], answer: "Le bord du port" },
            { type: "qcm", consigne: "Que veut dire le mot inconnu ?", prompt: "Le chien était si <b>affamé</b> qu'il dévora toute sa gamelle en une seconde.", choices: ["Qui a très faim", "Qui a très froid", "Qui est très sage"], answer: "Qui a très faim" },
          ],
        },
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: "fr2", title: "Grammaire", color: "#ef7fa8", lessons: [
        {
          id: "fr2-1", title: "La phrase et la ponctuation",
          lesson: {
            rule: ["Une <b>phrase</b> a du sens. Elle commence par une <b>majuscule</b> et finit par un <b>point</b>.",
              "<b>.</b> pour raconter, <b>?</b> pour poser une question, <b>!</b> pour montrer une émotion ou donner un ordre."],
            ex: "Le train arrive<b>.</b> — Où est mon billet<b>?</b> — Quelle vitesse<b>!</b>",
          },
          bank: () => [
            { type: "qcm", consigne: "Quel signe faut-il à la fin ?", prompt: "Est-ce que tu viens au cinéma …", choices: ["?", ".", "!"], answer: "?" },
            { type: "qcm", consigne: "Quel signe faut-il à la fin ?", prompt: "Le soleil se couche derrière la colline …", choices: [".", "?", ","], answer: "." },
            { type: "qcm", consigne: "Quel signe faut-il à la fin ?", prompt: "Attention, le plat est brûlant …", choices: ["!", "?", ","], answer: "!" },
            { type: "qcm", consigne: "Quel signe faut-il à la fin ?", prompt: "Comment s'appelle ton poisson rouge …", choices: ["?", ".", "!"], answer: "?" },
            { type: "vf", consigne: "Est-ce une phrase correcte ?", prompt: "les oiseaux chantent dans l'arbre.", answer: false },
            { type: "vf", consigne: "Est-ce une phrase correcte ?", prompt: "Mon frère joue du piano.", answer: true },
            { type: "vf", consigne: "Est-ce une phrase correcte ?", prompt: "Mange le chat souris la.", answer: false },
            { type: "qcm", consigne: "Combien y a-t-il de phrases ?", prompt: "Il neige. Les enfants sortent les luges. Quelle joie !", choices: ["3", "2", "1"], answer: "3" },
            { type: "qcm", consigne: "Quelle phrase est bien écrite ?", prompt: "Choisis.", choices: ["Le vent souffle fort.", "le vent souffle fort.", "Le vent souffle fort"], answer: "Le vent souffle fort." },
            { type: "qcm", consigne: "Combien y a-t-il de phrases ?", prompt: "Où vas-tu ? Je vais chez Lucas.", choices: ["2", "1", "4"], answer: "2" },
          ],
        },
        {
          id: "fr2-2", title: "Le nom propre et le nom commun",
          lesson: {
            rule: ["Le <b>nom commun</b> désigne une personne, un animal ou une chose : <i>un garçon, une girafe, un stylo</i>.",
              "Le <b>nom propre</b> désigne une personne, un animal ou un lieu <b>unique</b>. Il prend toujours une <b>majuscule</b> : <i>Inès, Paris, la Loire</i>."],
            ex: "<b>Médor</b> (nom propre) est un <b>chien</b> (nom commun).",
          },
          bank: () => [
            { type: "mots", consigne: "Clique sur tous les noms propres.", sentence: "Samedi , Hugo et Lou partent à Marseille .", answer: ["Hugo", "Lou", "Marseille"] },
            { type: "mots", consigne: "Clique sur tous les noms propres.", sentence: "Le chat de Jade s'appelle Pistache .", answer: ["Jade", "Pistache"] },
            { type: "mots", consigne: "Clique sur tous les noms communs.", sentence: "Le singe mange une banane .", answer: ["singe", "banane"] },
            { type: "mots", consigne: "Clique sur tous les noms communs.", sentence: "Ma tante conduit un camion rouge .", answer: ["tante", "camion"] },
            { type: "qcm", consigne: "Quel mot est un nom propre ?", prompt: "Choisis.", choices: ["Bretagne", "montagne", "campagne"], answer: "Bretagne" },
            { type: "qcm", consigne: "Quel mot est un nom propre ?", prompt: "Choisis.", choices: ["Nadia", "voisine", "maîtresse"], answer: "Nadia" },
            { type: "qcm", consigne: "Quel mot est un nom commun ?", prompt: "Choisis.", choices: ["fleuve", "Seine", "Rhône"], answer: "fleuve" },
            { type: "vf", consigne: "Vrai ou faux ?", prompt: "Un nom propre commence toujours par une majuscule.", answer: true },
            { type: "vf", consigne: "Vrai ou faux ?", prompt: "« pomme » est un nom propre.", answer: false },
            { type: "saisie", consigne: "Écris correctement ce nom propre.", prompt: "la ville de <i>lyon</i>", answer: ["Lyon"], caseSensitive: true },
          ],
        },
        {
          id: "fr2-3", title: "Le genre et le nombre du nom",
          lesson: {
            rule: ["Un nom est <b>masculin</b> (un, le) ou <b>féminin</b> (une, la) : c'est son <b>genre</b>.",
              "Il est au <b>singulier</b> (un seul) ou au <b>pluriel</b> (plusieurs : les, des) : c'est son <b>nombre</b>."],
            ex: "<b>un</b> lapin (masculin singulier) — <b>des</b> tortues (féminin pluriel)",
          },
          bank: () => {
            const nouns = [["fusée", "f"], ["bateau", "m"], ["chaise", "f"], ["cahier", "m"], ["pomme", "f"], ["crayon", "m"], ["école", "f"], ["arbre", "m"], ["maison", "f"], ["nuage", "m"], ["lune", "f"], ["soleil", "m"]];
            const qs = sample(nouns, 5).map(([n, g]) => ({
              type: "qcm", consigne: "Quel déterminant va avec ce nom ?", prompt: `<span class="prompt big">… ${n}</span>`,
              choices: ["un", "une"], answer: g === "m" ? "un" : "une",
            }));
            return qs.concat([
              { type: "qcm", consigne: "Ce groupe est-il au singulier ou au pluriel ?", prompt: "des bonbons", choices: ["pluriel", "singulier"], answer: "pluriel" },
              { type: "qcm", consigne: "Ce groupe est-il au singulier ou au pluriel ?", prompt: "la girafe", choices: ["singulier", "pluriel"], answer: "singulier" },
              { type: "qcm", consigne: "Ce groupe est-il au singulier ou au pluriel ?", prompt: "les avions", choices: ["pluriel", "singulier"], answer: "pluriel" },
              { type: "qcm", consigne: "Quel est le genre de ce nom ?", prompt: "une guitare", choices: ["féminin", "masculin"], answer: "féminin" },
              { type: "qcm", consigne: "Quel est le genre de ce nom ?", prompt: "le tambour", choices: ["masculin", "féminin"], answer: "masculin" },
            ]);
          },
        },
        {
          id: "fr2-4", title: "L'adjectif qualificatif",
          lesson: {
            rule: ["L'<b>adjectif qualificatif</b> donne des précisions sur le nom : sa couleur, sa taille, sa forme…",
              "Il est souvent juste <b>avant</b> ou juste <b>après</b> le nom."],
            ex: "un <b>gros</b> chien <b>noir</b>",
          },
          bank: () => [
            { type: "mots", consigne: "Clique sur l'adjectif.", sentence: "Ma sœur porte une robe jaune .", answer: ["jaune"] },
            { type: "mots", consigne: "Clique sur l'adjectif.", sentence: "Un petit oiseau chante .", answer: ["petit"] },
            { type: "mots", consigne: "Clique sur les deux adjectifs.", sentence: "Le vieux pirate cache un coffre lourd .", answer: ["vieux", "lourd"] },
            { type: "mots", consigne: "Clique sur l'adjectif.", sentence: "Nous avons vu un film drôle .", answer: ["drôle"] },
            { type: "mots", consigne: "Clique sur les deux adjectifs.", sentence: "Une grande vague froide arrive .", answer: ["grande", "froide"] },
            { type: "qcm", consigne: "Quel mot est un adjectif ?", prompt: "Choisis.", choices: ["rapide", "courir", "voiture"], answer: "rapide" },
            { type: "qcm", consigne: "Quel mot est un adjectif ?", prompt: "Choisis.", choices: ["joyeux", "joie", "jouer"], answer: "joyeux" },
            { type: "qcm", consigne: "Choisis un adjectif pour compléter.", prompt: "Le dragon crache un feu …", choices: ["brûlant", "brûler", "brûlure"], answer: "brûlant" },
            { type: "vf", consigne: "Vrai ou faux ?", prompt: "Dans « un ciel bleu », « bleu » est un adjectif.", answer: true },
          ],
        },
        {
          id: "fr2-5", title: "Le sujet et le verbe",
          lesson: {
            rule: ["Le <b>verbe</b> dit ce que l'on fait ou ce qui se passe. Il change avec le temps (hier, aujourd'hui, demain).",
              "Le <b>sujet</b> dit <b>qui</b> fait l'action. On le trouve en posant la question « Qui est-ce qui … ? »"],
            ex: "<b>Le lion</b> (sujet) <b>rugit</b> (verbe). → Qui est-ce qui rugit ? Le lion.",
          },
          bank: () => [
            { type: "mots", consigne: "Clique sur le verbe.", sentence: "Le boulanger pétrit la pâte .", answer: ["pétrit"] },
            { type: "mots", consigne: "Clique sur le verbe.", sentence: "Chaque soir , Maé lit une histoire .", answer: ["lit"] },
            { type: "mots", consigne: "Clique sur le verbe.", sentence: "Les feuilles tombent en automne .", answer: ["tombent"] },
            { type: "mots", consigne: "Clique sur le sujet (un ou plusieurs mots).", sentence: "Le petit chat dort sur le canapé .", answer: ["Le", "petit", "chat"] },
            { type: "mots", consigne: "Clique sur le sujet.", sentence: "Demain , nous irons à la plage .", answer: ["nous"] },
            { type: "mots", consigne: "Clique sur le sujet (un ou plusieurs mots).", sentence: "Mes grands-parents habitent à la campagne .", answer: ["Mes", "grands-parents"] },
            { type: "qcm", consigne: "Quel est l'infinitif du verbe ?", prompt: "Les enfants <b>construisent</b> une cabane.", choices: ["construire", "construit", "construction"], answer: "construire" },
            { type: "qcm", consigne: "Quel est l'infinitif du verbe ?", prompt: "Tu <b>finis</b> ton dessin.", choices: ["finir", "finit", "fin"], answer: "finir" },
            { type: "qcm", consigne: "Par quel pronom peut-on remplacer le sujet ?", prompt: "<b>Lucie et Anna</b> font du vélo.", choices: ["Elles", "Il", "Nous"], answer: "Elles" },
          ],
        },
        {
          id: "fr2-6", title: "La phrase négative",
          lesson: {
            rule: ["Une phrase <b>négative</b> dit le contraire d'une phrase affirmative.",
              "On entoure le verbe avec <b>ne … pas</b>, <b>ne … plus</b>, <b>ne … jamais</b> ou <b>ne … rien</b>.",
              "Devant une voyelle, <i>ne</i> devient <b>n'</b> : il <b>n'</b>aime <b>pas</b>."],
            ex: "Je mange des épinards. → Je <b>ne</b> mange <b>pas</b> d'épinards.",
          },
          bank: () => [
            { type: "qcm", consigne: "Quelle phrase est négative ?", prompt: "Choisis.", choices: ["Le chien n'aboie pas.", "Le chien aboie fort.", "Est-ce que le chien aboie ?"], answer: "Le chien n'aboie pas." },
            { type: "qcm", consigne: "Quelle phrase est négative ?", prompt: "Choisis.", choices: ["Nous ne sortons jamais le soir.", "Nous sortons le soir.", "Sortons ce soir !"], answer: "Nous ne sortons jamais le soir." },
            { type: "saisie", consigne: "Écris cette phrase à la forme négative avec « ne … pas ».", prompt: "Lucas joue.", answer: ["Lucas ne joue pas."] },
            { type: "saisie", consigne: "Écris cette phrase à la forme négative avec « ne … pas ».", prompt: "Il aime la soupe.", answer: ["Il n'aime pas la soupe."] },
            { type: "saisie", consigne: "Écris cette phrase à la forme négative avec « ne … plus ».", prompt: "Elle a peur.", answer: ["Elle n'a plus peur."] },
            { type: "qcm", consigne: "Complète la phrase négative.", prompt: "Il fait si noir que je ne vois … .", choices: ["rien", "pas rien", "tout"], answer: "rien" },
            { type: "vf", consigne: "Cette phrase est-elle négative ?", prompt: "Tom ne range jamais ses jouets.", answer: true },
            { type: "vf", consigne: "Cette phrase est-elle négative ?", prompt: "Tom range toujours ses jouets.", answer: false },
            { type: "qcm", consigne: "Quelle est la phrase affirmative ?", prompt: "« Le train n'est pas en retard. »", choices: ["Le train est en retard.", "Le train n'est plus en retard.", "Le train est-il en retard ?"], answer: "Le train est en retard." },
          ],
        },
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: "fr3", title: "Orthographe", color: "#8e6cc9", lessons: [
        {
          id: "fr3-1", title: "L'accord de l'adjectif",
          lesson: {
            rule: ["L'adjectif s'<b>accorde</b> avec le nom : il prend le même genre et le même nombre.",
              "Au féminin, on ajoute souvent un <b>e</b>. Au pluriel, on ajoute souvent un <b>s</b>."],
            ex: "un chat <b>noir</b> — une chatte <b>noire</b> — des chats <b>noirs</b> — des chattes <b>noires</b>",
          },
          bank: () => {
            const adjs = [["petit", "petite", "petits", "petites"], ["grand", "grande", "grands", "grandes"], ["vert", "verte", "verts", "vertes"], ["joli", "jolie", "jolis", "jolies"], ["méchant", "méchante", "méchants", "méchantes"], ["lourd", "lourde", "lourds", "lourdes"]];
            const nouns = [["un ballon", 0], ["une balle", 1], ["des ballons", 2], ["des balles", 3], ["un tapis", 0], ["une boîte", 1], ["des sapins", 2], ["des tasses", 3]];
            const qs = [];
            for (let i = 0; i < 6; i++) {
              const a = pick(adjs), [n, k] = pick(nouns);
              qs.push({ type: "qcm", consigne: "Choisis l'adjectif bien accordé.", prompt: `${n} …`, choices: shuffle(a.slice()), answer: a[k] });
            }
            qs.push({ type: "trous", consigne: "Accorde l'adjectif entre parenthèses.", text: "Les fleurs sont [jolies] <i>(joli)</i>." });
            qs.push({ type: "trous", consigne: "Accorde l'adjectif entre parenthèses.", text: "Ma voisine a une voiture [noire] <i>(noir)</i>." });
            qs.push({ type: "trous", consigne: "Accorde l'adjectif entre parenthèses.", text: "Ces gâteaux sont [délicieux] <i>(délicieux)</i>." });
            return qs;
          },
        },
        {
          id: "fr3-2", title: "L'accord du verbe avec le sujet",
          lesson: {
            rule: ["Le verbe s'accorde avec son <b>sujet</b>.",
              "Sujet au singulier (il, elle, le chat) → verbe en <b>-e</b> ou <b>-t</b>. Sujet au pluriel (ils, elles, les chats) → verbe en <b>-nt</b>."],
            ex: "Le chat <b>miaule</b>. Les chats <b>miaulent</b>.",
          },
          bank: () => [
            { type: "qcm", consigne: "Choisis la bonne forme du verbe.", prompt: "Les oiseaux … dans le ciel.", choices: ["volent", "vole", "voles"], answer: "volent" },
            { type: "qcm", consigne: "Choisis la bonne forme du verbe.", prompt: "Ma grand-mère … des chaussettes.", choices: ["tricote", "tricotent", "tricotes"], answer: "tricote" },
            { type: "qcm", consigne: "Choisis la bonne forme du verbe.", prompt: "Toi et moi … une cabane.", choices: ["construisons", "construisent", "construit"], answer: "construisons" },
            { type: "qcm", consigne: "Choisis la bonne forme du verbe.", prompt: "Le vent et la pluie … les arbres.", choices: ["secouent", "secoue", "secoues"], answer: "secouent" },
            { type: "trous", consigne: "Écris le verbe au présent.", text: "Les clowns [amusent] <i>(amuser)</i> les enfants." },
            { type: "trous", consigne: "Écris le verbe au présent.", text: "Le cuisinier [goûte] <i>(goûter)</i> la sauce." },
            { type: "trous", consigne: "Écris le verbe au présent.", text: "Mes amies [dansent] <i>(danser)</i> ensemble." },
            { type: "vf", consigne: "Le verbe est-il bien accordé ?", prompt: "Les vaches broute l'herbe.", answer: false },
            { type: "vf", consigne: "Le verbe est-il bien accordé ?", prompt: "La maîtresse corrige les cahiers.", answer: true },
          ],
        },
        {
          id: "fr3-3", title: "Le pluriel des noms",
          lesson: {
            rule: ["Au pluriel, la plupart des noms prennent un <b>s</b> : un chat → des chat<b>s</b>.",
              "Les noms en <b>-eau</b>, <b>-au</b>, <b>-eu</b> prennent un <b>x</b> : un bateau → des bateau<b>x</b>.",
              "Les noms en <b>-al</b> font souvent <b>-aux</b> : un cheval → des chev<b>aux</b>.",
              "Les noms qui finissent par <b>s, x, z</b> ne changent pas : une souris → des souris."],
            ex: "un jeu → des jeu<b>x</b> — un journal → des journ<b>aux</b>",
          },
          bank: () => {
            const items = [["un bateau", "bateaux"], ["un cheval", "chevaux"], ["un jeu", "jeux"], ["un crayon", "crayons"], ["une souris", "souris"], ["un gâteau", "gâteaux"], ["un journal", "journaux"], ["un nez", "nez"], ["une fleur", "fleurs"], ["un cheveu", "cheveux"], ["un tuyau", "tuyaux"], ["un animal", "animaux"]];
            return sample(items, 9).map(([sg, pl]) => ({
              type: "saisie", consigne: "Écris ce nom au pluriel.", prompt: `${sg} → des …`, answer: [pl], width: 260,
            }));
          },
        },
        {
          id: "fr3-4", title: "La lettre muette à la fin des mots",
          lesson: {
            rule: ["Beaucoup de mots finissent par une <b>lettre qu'on n'entend pas</b> : c'est une lettre muette.",
              "Pour la trouver, cherche un mot de la même famille ou le féminin : gran<b>d</b> → gran<b>d</b>e, cha<b>t</b> → cha<b>t</b>on."],
            ex: "un dra<b>p</b> → dra<b>p</b>eau — le lai<b>t</b> → lai<b>t</b>ier",
          },
          bank: () => {
            const items = [["gran…", "d", "grande"], ["cha…", "t", "chaton"], ["lon…", "g", "longue"], ["blan…", "c", "blanche"], ["galo…", "p", "galoper"], ["boi…", "s", "boiserie"], ["sau…", "t", "sauter"], ["peti…", "t", "petite"], ["froi…", "d", "froide"], ["bavar…", "d", "bavarde"], ["tapi…", "s", "tapisser"]];
            return sample(items, 8).map(([w, l, help]) => ({
              type: "qcm", consigne: "Quelle est la lettre muette ? Pense au mot de la famille.", prompt: `<span class="prompt big">${w}</span><br><small>(comme dans « ${help} »)</small>`,
              choices: shuffle([l, ...sample(["t", "d", "s", "p", "g", "c", "x"].filter((x) => x !== l), 2)]), answer: l,
            }));
          },
        },
        {
          id: "fr3-5", title: "Les homophones a / à et et / est",
          lesson: {
            rule: ["<b>a</b> est le verbe avoir : on peut le remplacer par <b>avait</b>. <b>à</b> ne se remplace pas.",
              "<b>est</b> est le verbe être : on peut le remplacer par <b>était</b>. <b>et</b> veut dire « et puis »."],
            ex: "Elle <b>a</b> (avait) un vélo. Elle va <b>à</b> l'école. — Le ciel <b>est</b> (était) gris <b>et</b> froid.",
          },
          bank: () => {
            const A = [["Mon frère … un nouveau sac.", "a"], ["Nous allons … la piscine.", "à"], ["Il … très faim ce soir.", "a"], ["Je pense … toi.", "à"], ["Léa … perdu sa gomme.", "a"], ["Le bateau … voiles avance vite.", "à"]];
            const E = [["Le café … chaud.", "est"], ["J'aime le pain … le fromage.", "et"], ["Ce livre … passionnant.", "est"], ["Il pleut … il fait froid.", "et"], ["Ma tortue … très lente.", "est"], ["Prends ton bonnet … tes gants.", "et"]];
            return sample(A, 4).map(([p, r]) => ({ type: "qcm", consigne: "Choisis : a ou à ?", prompt: p, choices: ["a", "à"], answer: r }))
              .concat(sample(E, 4).map(([p, r]) => ({ type: "qcm", consigne: "Choisis : et ou est ?", prompt: p, choices: ["et", "est"], answer: r })));
          },
        },
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: "fr4", title: "Conjugaison", color: "#2e86de", lessons: [
        {
          id: "fr4-1", title: "Le présent des verbes en -er",
          lesson: {
            rule: ["Les verbes en <b>-er</b> (1er groupe) ont les terminaisons : <b>-e, -es, -e, -ons, -ez, -ent</b>.",
              "Attention : nous man<b>ge</b>ons, nous commen<b>ç</b>ons."],
            ex: "je chant<b>e</b>, tu chant<b>es</b>, il chant<b>e</b>, nous chant<b>ons</b>, vous chant<b>ez</b>, ils chant<b>ent</b>",
          },
          bank: () => sample(Conj.group1, 9).map((v) => conjQuestion(v, "present")),
        },
        {
          id: "fr4-2", title: "Le présent de finir (2e groupe)",
          lesson: {
            rule: ["Les verbes comme <b>finir</b> (2e groupe) font <b>-issons</b> avec nous.",
              "Terminaisons : <b>-is, -is, -it, -issons, -issez, -issent</b>."],
            ex: "je fin<b>is</b>, tu fin<b>is</b>, il fin<b>it</b>, nous fin<b>issons</b>, vous fin<b>issez</b>, ils fin<b>issent</b>",
          },
          bank: () => Array.from({ length: 9 }, () => conjQuestion(pick(Conj.group2), "present")),
        },
        {
          id: "fr4-3", title: "Être et avoir au présent",
          lesson: {
            rule: ["<b>Être</b> : je suis, tu es, il est, nous sommes, vous êtes, ils sont.",
              "<b>Avoir</b> : j'ai, tu as, il a, nous avons, vous avez, ils ont."],
            ex: "Nous <b>sommes</b> contents : nous <b>avons</b> gagné !",
          },
          bank: () => Array.from({ length: 9 }, () => conjQuestion(pick(["être", "avoir"]), "present")),
        },
        {
          id: "fr4-4", title: "Aller, faire et dire au présent",
          lesson: {
            rule: ["<b>Aller</b> : je vais, tu vas, il va, nous allons, vous allez, ils vont.",
              "<b>Faire</b> : je fais, tu fais, il fait, nous faisons, vous <b>faites</b>, ils font.",
              "<b>Dire</b> : je dis, tu dis, il dit, nous disons, vous <b>dites</b>, ils disent."],
            ex: "Vous <b>faites</b> du judo et vous <b>dites</b> merci au professeur.",
          },
          bank: () => Array.from({ length: 9 }, () => conjQuestion(pick(["aller", "faire", "dire"]), "present")),
        },
        {
          id: "fr4-5", title: "Venir, prendre et voir au présent",
          lesson: {
            rule: ["<b>Venir</b> : je viens, tu viens, il vient, nous venons, vous venez, ils viennent.",
              "<b>Prendre</b> : je prends, tu prends, il prend, nous prenons, vous prenez, ils prennent.",
              "<b>Voir</b> : je vois, tu vois, il voit, nous voyons, vous voyez, ils voient."],
            ex: "Ils <b>viennent</b> et ils <b>prennent</b> le train.",
          },
          bank: () => Array.from({ length: 9 }, () => conjQuestion(pick(["venir", "prendre", "voir"]), "present")),
        },
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: "fr5", title: "Vocabulaire", color: "#3fa34d", lessons: [
        {
          id: "fr5-1", title: "Les mots contraires",
          lesson: {
            rule: ["Deux mots sont <b>contraires</b> quand ils ont des sens opposés.",
              "On peut aussi former un contraire en ajoutant <b>in-</b>, <b>im-</b>, <b>dé-</b> ou <b>mal-</b> : possible → <b>im</b>possible."],
            ex: "chaud ≠ froid — monter ≠ descendre — heureux ≠ <b>mal</b>heureux",
          },
          bank: () => {
            const pairs = [["grand", "petit"], ["rapide", "lent"], ["ouvrir", "fermer"], ["jour", "nuit"], ["léger", "lourd"], ["propre", "sale"], ["vide", "plein"], ["gagner", "perdre"], ["entrer", "sortir"], ["courageux", "peureux"], ["possible", "impossible"], ["coller", "décoller"], ["adroit", "maladroit"], ["poli", "impoli"], ["allumer", "éteindre"], ["devant", "derrière"]];
            const all = pairs.map((p) => p[1]);
            return sample(pairs, 9).map(([a, b]) => ({
              type: "qcm", consigne: "Clique sur le contraire du mot.", prompt: `<span class="prompt big">${a}</span>`,
              choices: shuffle([b, ...sample(all.filter((x) => x !== b), 2)]), answer: b,
            }));
          },
        },
        {
          id: "fr5-2", title: "Les familles de mots",
          lesson: {
            rule: ["Les mots d'une même <b>famille</b> ont une partie commune : le <b>radical</b>.",
              "Ils parlent de la même idée."],
            ex: "<b>jardin</b> — <b>jardin</b>ier — <b>jardin</b>age — <b>jardin</b>er",
          },
          bank: () => {
            const fams = [
              [["dent", "dentiste", "dentifrice"], "danse"],
              [["terre", "terrain", "enterrer"], "tête"],
              [["lait", "laitier", "allaiter"], "laid"],
              [["port", "portail", "porter"], "porc"],
              [["fleur", "fleuriste", "fleurir"], "fleuve"],
              [["mer", "marin", "maritime"], "mère"],
              [["chant", "chanter", "chanteur"], "champ"],
              [["boulanger", "boulangerie", "boulange"], "boule"],
            ];
            return sample(fams, 8).map(([fam, intrus]) => ({
              type: "qcm", consigne: "Clique sur l'intrus : le mot qui n'est pas de la famille.", prompt: "Trouve l'intrus.",
              choices: shuffle([...fam, intrus]), answer: intrus,
            }));
          },
        },
        {
          id: "fr5-3", title: "La dictée de mots",
          lesson: {
            rule: ["Écoute bien le mot, <b>découpe-le en syllabes</b> dans ta tête, puis écris-le.",
              "Pense aux <b>lettres muettes</b> et aux sons qui s'écrivent de plusieurs façons (o, au, eau)."],
            ex: "bou-tei-lle → <b>bouteille</b>",
          },
          bank: () => {
            const words = [["oiseau", "L'… chante sur la branche."], ["château", "Le roi vit dans un …"], ["bonjour", "Je dis … à la boulangère."], ["maison", "Ma … a un toit rouge."], ["jardin", "Les fleurs poussent dans le …"],
              ["girafe", "La … a un très long cou."], ["chocolat", "J'aime le gâteau au …"], ["vélo", "Je roule à …"], ["hiver", "En …, il neige parfois."], ["poisson", "Le … nage dans le bocal."],
              ["dragon", "Le … crache du feu."], ["étoile", "Une … brille dans le ciel."], ["lapin", "Le … mange une carotte."], ["cartable", "Je range mes cahiers dans mon …"]];
            return sample(words, 8).map(([w, hint]) => ({ type: "dictee", consigne: "Écoute le mot et écris-le.", word: w, hint: `<i>${hint}</i>` }));
          },
        },
      ],
    },
  ],
};
