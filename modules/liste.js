/* L'Atelier de Boulon — liste des modules transversaux.
   Un module est écrit une seule fois, dans modules/<id>/, et se charge dans chaque niveau qu'il déclare.
   Pour ajouter un module : créer son dossier, puis l'ajouter ici. Il apparaît dans tous ces niveaux
   au prochain lancement (et dans leur Setup au prochain assemblage).

   Champs :
   - id       : nom du dossier modules/<id>/
   - nom      : nom lisible
   - scripts  : fichiers JS du module, dans l'ordre (chemins relatifs au dossier du module)
   - styles   : fichiers CSS du module
   - niveaux  : niveaux où il apparaît ; le module lit NIVEAU.id pour adapter son contenu (paliers) */
"use strict";

const MODULES_DISPONIBLES = [
  {
    id: "geo",
    nom: "Le tour du monde (géographie)",
    scripts: ["js/geo-projection.js", "js/geo-formes.js", "js/geo-pays.js", "js/geo.js"],
    styles: ["css/geo.css"],
    niveaux: ["ce2"],      // contenu écrit pour le CE2 ; à ouvrir aux autres niveaux avec des paliers adaptés
  },
  {
    id: "inventions",
    nom: "Les inventions (transports, écriture, communication, ordinateurs)",
    scripts: ["js/inventions-images.js", "js/inventions.js"],
    styles: ["css/inventions.css"],
    niveaux: ["ce2", "cp"],   // le CP a 4 étapes par thème, sans dates (NIVEAU.toutEnVoix)
  },
  {
    id: "robotique",
    nom: "L'atelier de Rivet (informatique et robotique)",
    scripts: ["js/robotique-moteur.js", "js/robotique-niveaux.js", "js/robotique-images.js", "js/robotique.js"],
    styles: ["css/robotique.css"],
    niveaux: ["ce2", "cp"],   // un palier par niveau : les flèches au CP, avance / tourne et les boucles au CE2
  },
];
