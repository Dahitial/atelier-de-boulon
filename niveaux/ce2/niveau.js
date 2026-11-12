/* L'Atelier de Boulon — fiche du niveau CE2.
   Le moteur (dossier moteur/) lit cette fiche pour savoir quoi charger et comment s'afficher. */
"use strict";

const NIVEAU = {
  id: "ce2",                                   // nom du dossier niveaux/ce2
  classe: "CE2",                               // affiché sur l'enseigne de l'atelier, dans les textes
  sousTitre: "Français et maths • CE2",        // sous le titre, devant la maison
  cle: "atelier-boulon-ce2-v1",                // sauvegarde dans le navigateur : NE JAMAIS CHANGER (les élèves perdraient leurs progrès)

  /* contenus des leçons : chargés juste après le moteur de base (core, art) */
  contenus: ["js/content-fr.js", "js/content-math.js", "js/content-fr-gen.js", "js/content-sci.js", "js/content-hist.js"],
  /* écrans et schémas propres au niveau : chargés après tout le moteur */
  ecrans: ["js/illustrations-ce2.js", "js/sciences.js", "js/histoire.js"],

  /* objets de l'atelier du moteur à cacher pour ce niveau (ex. ["conjugueur"]) */
  sansObjets: [],
  /* modules transversaux à ne pas charger pour ce niveau (ex. ["echecs"]) */
  sansModules: [],
};
