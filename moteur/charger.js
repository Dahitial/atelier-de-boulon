/* L'Atelier de Boulon — chargeur.
   Chaque niveau a sa page niveaux/<id>/index.html qui charge, dans l'ordre :
     1. niveau.js            (la fiche NIVEAU)
     2. ../../modules/liste.js (MODULES_DISPONIBLES)
     3. ce fichier, qui écrit les styles et les scripts du moteur, du niveau et des modules.
   document.write garde l'ordre d'exécution et marche en file:// (jeu installé, sans serveur).
   window.NE_PAS_DEMARRER = true avant ce fichier : tout est chargé mais le jeu ne démarre pas
   (utilisé par les outils, ex. outils-voix/extraire_phrases.html). */
(function () {
  "use strict";
  const ici = document.currentScript.src;                       // …/moteur/charger.js
  const racine = ici.slice(0, ici.lastIndexOf("/moteur/") + 1);
  const dossierNiveau = racine + "niveaux/" + NIVEAU.id + "/";
  const dossierModule = (id) => racine + "modules/" + id + "/";

  const sans = NIVEAU.sansModules || [];
  const modules = MODULES_DISPONIBLES.filter((m) => m.niveaux.includes(NIVEAU.id) && !sans.includes(m.id));

  /* chemins utiles au code (images des modules, etc.) */
  window.CHEMINS = { racine, moteur: racine + "moteur/", niveau: dossierNiveau, module: dossierModule };
  window.MODULES = modules;

  const moteur = (f) => racine + "moteur/js/" + f + ".js";
  const styles = [racine + "moteur/css/style.css"]
    .concat(...modules.map((m) => (m.styles || []).map((s) => dossierModule(m.id) + s)))
    .concat((NIVEAU.styles || []).map((s) => dossierNiveau + s));      // le style du niveau en dernier
  const scripts = [].concat(
    ["core", "art", "pictos"].map(moteur),
    NIVEAU.contenus.map((f) => dossierNiveau + f),
    ["exercise", "exercices-images", "screens", "training", "illustrations", "revision", "aventure", "objets", "jardin", "parents", "tools", "games", "construction", "chevalet"].map(moteur),
    (NIVEAU.ecrans || []).map((f) => dossierNiveau + f),
    ...modules.map((m) => m.scripts.map((s) => dossierModule(m.id) + s)),
  );

  const attr = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  let html = styles.map((s) => `<link rel="stylesheet" href="${attr(s)}">`).join("");
  html += scripts.map((s) => `<script src="${attr(s)}" charset="utf-8"><\/script>`).join("");
  if (!window.NE_PAS_DEMARRER) html += "<script>App.start();<\/script>";
  document.write(html);
})();
