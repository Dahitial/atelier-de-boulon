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
