# Le moteur commun de L'Atelier de Boulon

Ce dossier contient tout ce qui est partagé par les niveaux (CP, CE1, CE2, CM1, CM2, 6e, 5e) :

- la sauvegarde, les profils et la navigation (`core.js`) ;
- les dessins de Boulon et de l'atelier (`art.js`) ;
- les types d'exercices (`exercise.js`), les écrans d'accueil et d'atelier (`screens.js`) ;
- le cahier, les leçons, le défi, la boussole et le carnet (`training.js`) ;
- le lecteur de schémas (`illustrations.js`) ;
- la révision adaptée, l'aventure et l'espace parents ;
- les outils et les mini-jeux.

Une correction faite ici profite à tous les niveaux.

## Organisation du dépôt

```
moteur/           le moteur commun (ce dossier) + charger.js
modules/          les modules transversaux (un dossier par module) + liste.js
niveaux/<id>/     un niveau : index.html, niveau.js, contenus, voix, installation.json
installateur/     un seul script d'installation, qui fabrique un Setup par niveau
```

## Comment une page de niveau se charge

`niveaux/<id>/index.html` charge trois fichiers, dans cet ordre :

1. `niveau.js`, la fiche `NIVEAU` du niveau ;
2. `../../modules/liste.js`, la liste `MODULES_DISPONIBLES` ;
3. `../../moteur/charger.js`, qui écrit ensuite les styles et les scripts dans l'ordre suivant :

```
core, art, pictos  →  NIVEAU.contenus  →  exercise, exercices-images, screens, training, illustrations,
revision, aventure, objets, jardin, parents, tools, games, construction, chevalet  →  NIVEAU.ecrans  →  scripts des modules  →  App.start()
```

Tout marche en `file://` (jeu installé, sans serveur). Les progrès des élèves sont rangés
dans le navigateur sous la clé `NIVEAU.cle`, une par niveau.

## La fiche du niveau (`niveaux/<id>/niveau.js`)

| Champ | Rôle |
|---|---|
| `id` | Nom du dossier (`ce2`) |
| `classe` | Texte court affiché (`CE2`) : enseigne de l'atelier, conjugueur… |
| `sousTitre` | Ligne sous le titre, devant la maison |
| `cle` | Clé de sauvegarde. **Ne jamais la changer** une fois le niveau distribué |
| `contenus` | Fichiers des leçons : ils remplissent `CONTENT` et `LESSONS` |
| `ecrans` | Écrans, schémas et objets propres au niveau |
| `sansObjets` | Objets de l'atelier du moteur à cacher (ex. `["conjugueur"]` au CP) |
| `sansModules` | Modules à ne pas charger pour ce niveau |
| `styles` | Feuilles de style du niveau, chargées après celles du moteur (ex. `["css/cp.css"]`) |
| `toutEnVoix` | Bouton « réécouter » dans chaque bulle de Boulon ; le nom des objets est dit au survol |
| `lampeBouton` | La lampe devient un petit bouton (ampoule) en haut à droite de l'atelier, au lieu d'un objet : allumée, Boulon explique chaque objet survolé, d'une pièce à l'autre (le CP) |
| `etiquettes` | Étiquette visible (avec un haut-parleur) sous chaque objet de l'atelier qui en déclare une |
| `sansNote` | Pas de note sur 20 pour l'enfant : des étoiles seulement (l'espace parents garde les notes) |
| `questionsParSeance` | Nombre de questions par séance (8 par défaut) |
| `mascotteAtelier` | Place de Boulon dans l'atelier : `{ x, y, side, bulle: { x, y } }`. La bulle peut aussi avoir `bas` (ancrée en bas, elle grandit vers le haut) et `largeur` |
| `textesAtelier` | Phrases d'accueil de Boulon : `premier(u)`, `retour(u)`, `reviser(u)`, `hasard: [...]` |
| `jeuxBorne` | Jeux de la borne (`games.js`, `JEUX_BORNE`). Par défaut `["course", "memo", "construction"]` ; le CP a `["memo-images", "course-nombres", "construction"]` |
| `constructionEtoiles` | La construction s'ouvre avec ce nombre d'étoiles plutôt qu'en battant Zigzag (le CP, en attendant son défi) |
| `cadreAtelier` | Place du dessin accroché dans l'atelier : `{ x, y, w, h }` (par défaut, au-dessus de la porte du CE2) |
| `pieces`, `pieceDepart` | L'atelier en plusieurs pièces (voir « Les pièces de l'atelier » plus bas). Le CP les remplit dans `js/atelier-cp.js` |
| `questionsDefi` | Nombre de questions du défi de Zigzag (10 par défaut, 5 au CP). Un chapitre peut avoir une image (`picto`) pour le défi |

Le Setup lit en plus `niveaux/<id>/installation.json` : titre, description, identifiant
d'installation (`appGuid`) et dossier d'installation. Chaque niveau a son propre `appGuid`.

## Ce qu'un niveau ou un module peut ajouter

- **Une matière** : `CONTENT.<id> = { id, name, chapters: [...] }`, puis indexer ses
  leçons dans `LESSONS`. Voir `niveaux/ce2/js/content-math.js`.
- **Un objet cliquable dans l'atelier** : `objetAtelier({ id, ecran, params, ordre, label, desc, svg, etiquette })`.
  `params` est passé à l'écran ouvert (ex. `{ subject: "lire" }`), `etiquette` = `{ x, y, w, texte, couleur }`.
  Le repère est de 1024 × 768. `ordre` règle la superposition : un ordre plus petit est
  dessiné en dessous. Le même `id` remplace un objet du moteur. Exemple : le globe à la fin
  de `modules/geo/js/geo.js`.
- **Le décor de l'atelier** : redéfinir `Art.fondAtelier`, une fonction qui renvoie le SVG du décor. Exemple : `niveaux/cp/js/atelier-cp.js`.
- **Les pièces de l'atelier** (`Pieces`, dans `art.js`) : un niveau peut répartir son atelier en
  plusieurs pièces, comme dans un jeu point-and-click. `NIVEAU.pieces` liste les pièces de gauche
  à droite : `{ id, nom, court, dans, mur, sol, fond(), entree, objets: [ids], decors: [ids],
  passages: [{ vers, x, sens: "g" | "d" }] }`, et `NIVEAU.pieceDepart` dit où l'on arrive.
  Un objet ou un décor rangé nulle part va dans la pièce de départ. Chaque pièce a son décor,
  ses passages (une arche et un panneau qui parle) ; un petit plan en haut de l'écran mène aussi
  aux autres pièces. On revient dans la dernière pièce visitée en quittant un écran, et dans la
  pièce de départ en changeant d'élève. Les décors y sont dessinés sous les objets.
  `ETIQUETTES_DECORS` donne une étiquette parlante aux décors actifs (le pot, le tapis du CP).
  La boutique dit dans quelle pièce va un décor. Sans `NIVEAU.pieces` (le CE2), rien ne change.
- **Des images** pour les plus jeunes : `Object.assign(PICTOS, { … })` et `PICTOS_NOMS` (le mot dit
  par la voix). Repère 100 × 100. Un module peut ajouter les siennes (ex. `modules/inventions`).
- **Un bouton dans l'espace parents**, sur la fiche d'un enfant : `PARENTS_ACTIONS.push((u) => bouton ou null)`
  (ex. « Offrir Rivet », `modules/robotique`).
- **Des périodes** : un chapitre peut avoir `periode: 1, 2…`. Dès qu'une matière a plusieurs
  périodes, le sommaire montre un onglet par période (il s'ouvre sur celle de la leçon à faire),
  et le défi de Zigzag aussi (le CP).
- **Un écran** : `App.register("mon-ecran", (root, params) => { … })`.
- **Des médailles** : `ajouterMedailles([...], { apres: "boussole" })` ou `{ avant: "regulier" }`.
  Leur `icone` est un emoji ou un petit dessin SVG (ex. `Art.sablier()`, le sablier bleu et vert) ;
  `icone(ic)` (dans `core.js`) affiche l'un ou l'autre. `retirerMedailles(["boussole"])` enlève
  celles qui sont impossibles dans le niveau.
- **Les objets de la boutique** (`objets.js`) : chaque décor acheté est cliquable dans l'atelier.
  `DECORS_ACTIFS` dit ce qu'il fait (« Le savais-tu ? » avec une question par jour, défi du jour,
  fête, atelier des couleurs…), `MAISON_DEHORS` ce qui se voit sur la maison dehors.
  Un niveau déplace les décors dans son atelier avec `PLACE_DECORS` (ex. `niveaux/cp/js/atelier-cp.js`).
  `MAISON_AJOUTS` reçoit d'autres dessins pour la maison (la jardinière, l'arbre planté).
- **Le jardin** (`jardin.js`) : le pot de fleurs, les graines, la croissance au fil des jours,
  l'herbier et la serre en accéléré (écran `serre`). Un niveau relie ses leçons aux graines :
  `Object.assign(JARDIN_DEBLOCAGES, { tournesol: "id-leçon", … })`, dans un fichier de `ecrans`
  (chargé après le moteur). `dessinPlante(espece, etape, sante, hauteur)` dessine une plante,
  utile aussi pour les schémas des leçons.
- **Le chevalet** (`chevalet.js`) : la peinture (un canvas) et les éléments qu'on reprend (un SVG
  par-dessus), la galerie des dessins, le cadre accroché et `MISSIONS_CHEVALET`.
  `Chevalet.ajouterPhoto(u, svg, viewBox)` range une image dans l'onglet « Photos ».
- **L'atelier de construction** (`construction.js`) : `JEUX_CONSTRUCTION` (la tour, le puzzle des
  formes, le quadrillage, les cubes, la machine de Boulon). Les défis du puzzle sont dans
  `PZ_DEFIS` ; ceux du quadrillage, des cubes et de la machine sont tirés au hasard, mais toujours
  les mêmes pour un défi donné (`Construction.hasard`).
- **Des images** pour les exercices : une entrée dans `PICTOS` et une dans `PICTOS_NOMS`
  (`moteur/js/pictos.js`), puis `picto("chat", 140)` dans les questions.
- **Des exercices en images** (CP, CE1) : les types `ecoute`, `son-position`, `syllabes`,
  `dictee-etiquettes`, `compter`, `tri`, `suite-images` (remettre des images dans l'ordre) et `ecoute-ecrit` (cliquer sur ce qui écrit ce que Boulon dit), `lis-phrase` (lire une phrase, choisir l'image ; la phrase n'est dite qu'après la réponse). `dictee-etiquettes` accepte des mots (`sep: " "`) pour écrire une phrase sont décrits en tête de `moteur/js/exercices-images.js`.
  Un nouveau type s'ajoute avec `Object.assign(Exercise.types, { … })`.
- **Des schémas de leçon** : `Object.assign(ILLUSTRATIONS, { "id-lecon": fonction })`.
  Les outils de dessin sont `Il`, `IC`, `chiffres` et `etiquettes`.
- **Des images** : avec le chemin donné par le chargeur, `CHEMINS.module("geo") + "img/…"`
  ou `CHEMINS.niveau + "img/…"`.

## Les modules d'aujourd'hui

| Module | Niveaux | Ce qu'il apporte |
|---|---|---|
| `geo` | CE2 | Le tour du monde : la carte, les pays, les missions de géographie |
| `robotique` | CE2, CP | L'atelier de Rivet, ouvert en achetant Rivet : la programmation (flèches au CP ; avance, tourne et boucles au CE2), le bug, le code d'une image (CE2), un quiz. Les grilles sont vérifiées par `robotique-verifier.js` (Node) |
| `inventions` | CE2, CP | Les inventions (transports, écriture, communication, ordinateurs), la course Tanger → Marrakech, et l'écran « sablier » qui propose la frise du temps (CE2) ou les leçons du temps (CP), et les inventions. Au CP (`NIVEAU.toutEnVoix`), 4 étapes par thème, sans dates |

## Ajouter un module transversal (échecs, informatique, robotique…)

1. Créer `modules/<id>/` avec ses fichiers : `js/`, `css/`, `img/`.
2. L'ajouter dans `modules/liste.js`, avec la liste des niveaux où il apparaît.
3. Dans son code, lire `NIVEAU.id` pour proposer le palier adapté (CP–CE1, CE2–CM2, 6e–5e).
4. Lui donner un objet dans l'atelier (`objetAtelier`) et, si on veut, des médailles.

Il apparaît alors dans chaque niveau listé. Ensuite, on reconstruit le Setup de chaque niveau.

## Ajouter un niveau

1. Créer `niveaux/<id>/` avec :
   - `index.html` : copie de celui du CE2, avec un autre titre ;
   - `niveau.js` : une nouvelle `cle` ;
   - `installation.json` : un nouvel `appGuid` et un nouveau `dossier` ;
   - les contenus du niveau.
2. Ajouter `<id>` dans les `niveaux` des modules qui le concernent.
3. Lancer le jeu, puis construire son Setup :

   ```bash
   powershell -ExecutionPolicy Bypass -File installateur\construire_setup.ps1 -Niveau <id> -Version 1.0.0
   ```
