/* L'Atelier de Boulon — fiche du niveau CP.
   Le moteur (dossier moteur/) lit cette fiche pour savoir quoi charger et comment s'afficher.
   Design retenu : direction A, « le petit atelier » (moins d'objets, plus gros, tout en voix). */
"use strict";

const NIVEAU = {
  id: "cp",
  classe: "CP",
  sousTitre: "Lire, écrire et compter • CP",
  cle: "atelier-boulon-cp-v1",                 // sauvegarde dans le navigateur : NE JAMAIS CHANGER

  contenus: ["js/contenu-cp.js"],
  ecrans: ["js/atelier-cp.js"],
  styles: ["css/cp.css"],

  /* un enfant de CP ne sait pas encore lire : */
  toutEnVoix: true,          // bouton « réécouter » dans chaque bulle, nom des objets dit au survol
  etiquettes: true,          // étiquette visible sous chaque objet de l'atelier
  lampeBouton: true,         // la lampe : un petit bouton en haut à droite ; allumée, Boulon explique chaque objet
  sansNote: true,            // pas de note sur 20 pour l'enfant : seulement des étoiles
  questionsParSeance: 5,     // séances courtes (environ 5 minutes)

  /* ce que la voix de synthèse dit mal tout seul : le jeu joue ces enregistrements à la place (Voice.morceaux,
     fichiers faits par outils-voix/fabriquer_sons.py) :
     - sons : le SON, pour « [p] », « mmm », « le son « i » »… ;
     - lettres : le NOM de la lettre, pour une lettre seule dans la phrase (« la lettre pé », « èl et a font la ») ;
     - mots : un nombre dit TOUT SEUL (la voix dit « un » comme « hein » ; dans une phrase, la voix le garde). */
  sons: Object.fromEntries(["a", "i", "o", "u", "e", "ou", "on", "an", "m", "n", "l", "r", "s", "f", "ch", "v", "j", "p", "b", "t", "d"]
          .map((s) => [s, `audio/sons/${s}.ogg`]).concat([["é", "audio/sons/e-aigu.ogg"], ["è", "audio/sons/e-grave.ogg"]])),
  lettres: Object.fromEntries([..."abcdefghijklmnopqrstuvwxyz"].map((l) => [l, `audio/lettres/${l}.ogg`])),
  /* les nombres dits tout seuls, de zéro à vingt, en lettres ou en chiffres (« sept », « 7 »), et « une » */
  mots: Object.fromEntries(["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze",
    "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf", "vingt"]
    .flatMap((m, n) => { const f = `audio/mots/${m.replace("é", "e")}.ogg`; return [[m, f], [String(n), f]]; })
    .concat([["une", "audio/mots/une.ogg"],
      /* les syllabes « bé » et « pé » : aucun mot ne passait ; le nom des lettres B et P se dit pareil */
      ["bé", "audio/lettres/b.ogg"], ["pé", "audio/lettres/p.ogg"]])),
  /* ce que la voix lit de travers (« pa » devient « P A », « vi » le chiffre romain « six ») : elle dit à la place
     un mot qui se prononce pareil (l'écran ne change pas). Choisis à l'écoute avec outils-voix/ecouter_syllabes.html.
     prononcer : partout ; prononcerSeul : seulement la syllabe dite toute seule (« me », « ne », « te » sont aussi
     des mots de tous les jours : « il me donne »). */
  prononcer: { pa: "pas", be: "beu", fe: "feu", pe: "peu", re: "reu", ve: "veu", vi: "vie", fo: "faux", lo: "lot", fu: "fût" },
  prononcerSeul: { me: "meuh", ne: "neu", te: "teu" },
  vitesseVoix: 0.85,          // Boulon parle plus lentement qu'au CE2 : l'enfant apprend à lire

  /* objets de l'atelier du moteur qui ne servent pas au CP */
  sansObjets: ["horloge", "radio", "conjugueur", "aide", "magneto", "entrainement", "orient", "calculatrice", "carnet", "construction"],
  sansModules: [],

  /* la borne de jeux du CP : des jeux sans lecture, et l'atelier de construction (ouvert en battant Zigzag) */
  jeuxBorne: ["memo-images", "course-nombres", "construction"],
  questionsDefi: 5,          // le défi de Zigzag : 5 questions
  cadreAtelier: { x: 716, y: 100, w: 150, h: 112 },   // le dessin accroché : au mur de la véranda

  /* l'atelier est en trois pièces (véranda, classe, salle de jeux) : voir js/atelier-cp.js */
  /* Boulon en bas à gauche dans chaque pièce ; sa bulle en bas, sous les étiquettes */
  mascotteAtelier: { x: 90, y: 560, side: "right", bulle: { x: 250, bas: 12, largeur: 700 } },
  textesAtelier: {
    premier: (u) => `Bienvenue dans mon atelier, ${u.name} ! Clique sur le livre pour lire avec moi.`,
    retour: (u) => `Re-bonjour ${u.name} ! Clique sur un objet.`,
    reviser: (u) => `Re-bonjour ${u.name} ! Clique sur le bouton « À réviser » pour ne pas oublier.`,
    hasard: ["Clique sur un objet !", "Que veux-tu faire ?", "On lit, on compte, ou on joue ?"],
  },
};
