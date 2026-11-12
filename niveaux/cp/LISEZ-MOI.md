# L'Atelier de Boulon — CP (période 1 complète, en construction)

Le CP utilise le moteur commun (`../../moteur/`) avec le design « le petit atelier »
(direction A), validé le 11 novembre 2026.

## Lancer le jeu

Double-clic sur **`Lancer.bat`**, ou ouvrir **`index.html`** dans Edge ou Chrome.
Les élèves du CP sont enregistrés à part de ceux du CE2.

## Ce qui est fait

**Phase 1 : l'interface du CP**
- **L'atelier** : de gros objets, chacun avec une étiquette parlante (aujourd'hui en trois pièces, voir plus bas). Boulon dit le nom de
  l'objet survolé. Les objets sont Lire (le livre), Dictée (l'ardoise), Compter (le boulier),
  Le monde (le globe), Jeux (la borne) et Trésors (le coffre). La porte sert à changer d'élève.
- **Tout en voix** : chaque bulle de Boulon a un bouton jaune « réécouter ». Les consignes
  sont lues à l'arrivée de chaque question, avec un gros bouton pour les réentendre.
- **Pas de note sur 20** : des ronds pour la progression de la séance, des étoiles à la fin.
  Les parents voient toujours le détail dans l'espace parents.
- **Séances de 5 questions.**
- **Polices Andika** (lecture : « a » et « g » comme à l'école) **et Fredoka** (titres),
  fournies avec le jeu dans `../../moteur/polices/`. Elles marchent sans Internet.

**Phase 2 : les exercices du CP**
- **39 images dessinées** dans le style de Boulon (`../../moteur/js/pictos.js`) : animaux, fruits et
  légumes, objets, transports, parties du corps. Elles remplacent les emojis.
- **Six types d'exercices** (`../../moteur/js/exercices-images.js`), sans besoin de savoir lire :

  | Type | Ce que fait l'enfant |
  |---|---|
  | écoute | Boulon dit un mot, l'enfant clique sur la bonne image |
  | position du son | il place le son dans le bon wagon du petit train : début, milieu ou fin |
  | syllabes | il reconstruit le mot de l'image avec des étiquettes de syllabes |
  | dictée en étiquettes | Boulon dit un son, une syllabe ou un mot ; l'enfant l'écrit avec des étiquettes |
  | compter | il compte des images et choisit le nombre (avec ses points, comme sur un dé) |
  | tri | il range des images dans deux paniers |

  Le nom de chaque image est dit au survol, pour l'enfant qui ne la reconnaît pas.
- **13 leçons de démonstration** :
  - Lire : écoute et trouve l'image, le son [a], le son [i], où est le son ?, reconstruis le mot ;
  - Dictée : les voyelles, les syllabes, les petits mots ;
  - Compter : compter jusqu'à 10, le plus et le moins ;
  - Le monde : les cinq sens, vivant ou pas vivant ?, fruit ou légume ? (aujourd'hui dans Sciences)

Le jeu de memory existe déjà dans la borne de jeux (moteur commun) : il n'a pas été refait.

**Gamification du CP** (nouvelle version, étape 2)
- **Les décors de la boutique** ont leur place dans l'atelier du CP, et ils sont tous cliquables,
  comme au CE2 : la fête, « Le savais-tu ? », le défi du jour, l'atelier des couleurs.
- **Les médailles** : la boussole et les deux médailles de Zigzag sont retirées (pas encore de
  défi au CP). Cinq médailles du CP sont ajoutées : Oreille fine, Petit lecteur, As de la dictée,
  As du calcul, Petit savant.
- **La borne de jeux du CP** : le mémo en images, la course aux nombres (compter jusqu'à 10 en
  cliquant) et la construction, ouverte avec 10 étoiles.
- **Tout en voix** : dans le coffre et la borne, chaque objet, médaille ou jeu se présente au survol.

**Mon petit jardin et les plantes** (nouvelle version, étape 3)
- Le **pot de fleurs** de la boutique ouvre le jardin, comme au CE2, mais tout en voix :
  pas de règle ni d'engrais, et les étapes de la plante se disent au survol.
- Le pot est posé dans la véranda, sur le rebord de la fenêtre.
- Un nouveau chapitre « Les plantes » dans Le monde (aujourd'hui dans Sciences) : de quoi la plante a besoin, de la
  graine à la fleur (nouvel exercice : remettre les images dans l'ordre), grand arbre ou
  petite plante. Ces leçons débloquent des graines du jardin.
- 9 nouvelles images : graine, pousse, fleur, rose, cactus, palmier, soleil, goutte d'eau, arrosoir.

**Le défi de Zigzag et l'atelier de construction** (nouvelle version, étape 4)
- Le **trophée** (étiquette « Défi ») est dans la salle de jeux, entre la borne et le coffre. Le défi a 5 questions ;
  chaque chapitre a son image, et son nom est dit au survol. Le score se lit en écrous.
- Battre Zigzag ouvre l'**atelier de construction** (dans la borne de jeux) : la tour, le
  quadrillage (sans symétrie au CP : trois couleurs au niveau 3) et le puzzle des formes ;
  puis **les cubes** (à 5 victoires ; au CP, piles de 2 étages au plus) et **la machine de
  Boulon** (une victoire en Sciences, ou Rivet adopté) : tuyaux, engrenages, sens des roues.
- Les médailles de Zigzag reviennent au CP (Plus rusé que Zigzag, Champion).

**Le chevalet** (nouvelle version, étape 5)
- Le chevalet (étiquette « Dessin ») est le même qu'au CE2, en plus simple :
  quatre formes (carré, rectangle, cercle, triangle), des boutons ＋ et － pour la taille,
  les outils et les images se disent au survol.
- La bulle de Boulon grandit vers le haut, pour laisser voir les objets du plancher.

**Les trois pièces de l'atelier** (nouvelle version)
- L'atelier était devenu trop plein. Il est maintenant en trois pièces, comme dans un jeu
  point-and-click. On passe de l'une à l'autre par les arches (avec un panneau qui parle), ou
  par le petit plan en haut de l'écran. Boulon suit l'enfant et dit le nom de la pièce.

  | Pièce | Ce qu'il y a dedans |
  |---|---|
  | La véranda (à gauche) | Le pot du jardin (« Jardin »), au soleil sur le rebord de la grande fenêtre ; le chevalet (« Dessin ») et le tapis des couleurs (« Couleurs ») ; le dessin accroché, au mur ; le cactus et la grande plante ; la porte du dehors (« Dehors ») |
  | La classe (au milieu, on arrive ici) | Lire, Dictée, Compter sur l'étagère ; Le monde (le globe), Sciences (le tabouret du savant) et Le temps (le sablier) ; le tableau noir |
  | La salle de jeux (à droite) | La borne (« Jeux »), le trophée de Zigzag sur un socle (« Défi »), le coffre (« Trésors »), Rivet et son atelier (« Rivet ») ; la guirlande et l'affiche de fusée |

- En quittant un écran (le jardin, le chevalet…), on revient dans la même pièce. En changeant
  d'élève, on repart de la classe. La boutique dit dans quelle pièce va l'objet acheté.

**Sciences, Le temps et les inventions** (nouvelle version, étape 6)
- « Le monde » est partagé en trois matières, chacune avec son objet dans la classe :

  | Matière (objet) | Chapitres |
  |---|---|
  | Sciences (le tabouret, la fiole et l'aimant) | Mon corps, Le vivant, Les plantes (les leçons d'avant : l'élève garde ses étoiles), et La matière : l'aimant attire ou pas ?, flotte ou coule ? |
  | Le temps (le sablier) | La journée (matin, midi, soir, nuit), La semaine et les saisons, Autrefois et aujourd'hui |
  | Le monde (le globe) | Se repérer (sur, sous, à côté ; gauche, milieu, droite), Les paysages du Maroc (la mer, la montagne, le désert) |

- Le sablier propose « Le temps qui passe » (les leçons) ou **les inventions** : le même écran
  qu'au CE2, en plus simple. Quatre images par thème, sans dates (« il y a très, très
  longtemps », « il y a longtemps », « aujourd'hui »), tout se dit à la voix. Le mini-défi
  remet les quatre images dans l'ordre ; la course Tanger → Marrakech est aussi là.
- 18 nouvelles images : l'aimant, le clou, le trombone, la boîte de conserve, la clé, la
  cuillère, les cailloux, les moments de la journée, les saisons, la mer, la montagne, le
  désert. Les images des inventions viennent du module.
- La médaille « Petit savant » demande maintenant toutes les leçons de Sciences ; la médaille
  « Petit inventeur » arrive avec les inventions.

**L'atelier de Rivet : informatique et robotique** (nouvelle version, étape 7)
- Rivet, acheté au coffre (150 écrous) ou offert par le parent (espace parents, « 🐱 Offrir
  Rivet »), s'installe dans la salle de jeux avec l'étiquette « Rivet ». Un clic ouvre son atelier.
- Cinq missions, en flèches et en voix, qui s'ouvrent l'une après l'autre :
  1. **Les flèches** : chaque flèche fait avancer Rivet tout de suite ;
  2. **Le programme** : on prépare les flèches, puis « Go ! » ; une flèche qui fait heurter un
     caillou devient rouge ;
  3. **Répéter** : la carte « 2×, 3×, 4× » répète la flèche suivante ; il n'y a pas assez de
     cases sans elle ;
  4. **Le bug** : on clique sur la flèche fausse pour la changer ;
  5. **C'est quoi un robot ?** Robot ou pas robot (l'aspirateur robot, le bras robot, le robot
     de Mars), l'écran, le clavier, la souris.
- Médaille « Programmeur » : les 5 missions réussies.

**Phase 3 : la période 1 en français et en maths** (nouvelle version, étape 8)
- **Lire** (19 leçons, 5 chapitres, dans l'ordre d'apprentissage) :

  | Chapitre | Leçons |
  |---|---|
  | J'entends les sons | Écoute et trouve l'image, Où est le son ?, Les rimes |
  | Les voyelles | Les sons [a], [i], [o], [u], [é] |
  | Les consonnes | Les sons [l], [r], [m], [s] |
  | Les syllabes | Combien de syllabes ?, La première syllabe, Reconstruis le mot |
  | Je lis | Lis la voyelle, Lis la syllabe, Lis le mot, Les petits mots (le, la, un, une, et…) |

- **Dictée** : un chapitre « Les petits mots » (j'écris le, la, les, un, une, il, et).
- **Compter** (11 leçons, 4 chapitres) :

  | Chapitre | Leçons |
  |---|---|
  | Les nombres jusqu'à 10 | Compter jusqu'à 10, Le plus, le moins, Lis le nombre, Les points du dé |
  | Comparer et ranger | Le plus grand, le plus petit, Range les nombres, Juste avant, juste après |
  | Ajouter | Combien en tout ?, La maison du 5, Petits problèmes (Yasmine, Adam, Salma…) |
  | Formes et rangs | Les formes (carré, rond, triangle, rectangle), Premier, deuxième, dernier |

- **Un nouveau type d'exercice**, `ecoute-ecrit` : Boulon dit une lettre, une syllabe, un mot
  ou un nombre, et l'enfant clique sur ce qui l'écrit. Rien n'est dit au survol : c'est la
  lecture qu'on travaille.
- **Les sons des consonnes** sont entendus dans des mots (« Écoute : lune, lit, lapin… le même
  son qu'au début de lune »), car la voix de synthèse dit mal un son tout seul. Les listes de
  mots « avec » et « sans » chaque son ont été vérifiées : aucun mot douteux (« on », « ou »,
  « oi » pour le [o], « s » qui se dit [z]…).
- **Nouvelles images** : les nombres de 0 à 10, le carré, le rond, le triangle, le rectangle,
  et les dés (de 1 à 10 points, avec deux dés au-delà de 6).
- **Le sommaire** montre tous les chapitres côte à côte, sur toute la hauteur : plus rien ne
  défile. Les identifiants des leçons d'avant n'ont pas changé : l'enfant garde ses étoiles.
- Le CP compte maintenant 52 leçons.

**La lampe** (plan complet du CP, étape A)
- Un petit bouton en forme d'ampoule, en haut à droite de l'atelier (à côté de ⚙), dans les
  trois pièces. Un clic l'allume, un autre l'éteint ; elle reste allumée quand on change de pièce.
- Allumée, l'ampoule brille et les objets bougent un peu : au survol d'un objet, de son
  étiquette ou d'un passage, Boulon dit à quoi il sert, avec des mots simples (« Le sablier :
  la journée, la semaine, les saisons, et les inventions d'autrefois »). Éteinte, il dit seulement
  le nom de l'objet.

**La période 2** (novembre-décembre ; plan complet du CP, étape B)
- Le sommaire et le défi de Zigzag ont un onglet par période : on voit les chapitres d'une
  période à la fois (le sommaire s'ouvre sur la période de la leçon à faire).
- **Lire** (18 leçons) : les sons p, t, d, b (et « p ou b ? ») ; n, v, f, j, ch ; ou, on, le [e]
  de « le » (et « u ou ou ? ») ; je lis des phrases (la syllabe, le mot, **la phrase**, les petits
  mots est, sur, sous, dans, avec). Pour « Lis la phrase », Boulon lit la consigne, et ne lit la
  phrase qu'après la bonne réponse.
- **Dictée** (4 leçons) : les syllabes, les mots, les petits mots, et **écrire une phrase** avec
  des étiquettes de mots.
- **Compter** (11 leçons) : les nombres jusqu'à 20 (la **barrette de 10**, lire, comparer, ranger) ;
  les doubles, la maison du 10, **retirer**, ajouter ou retirer ? ; les petits problèmes, **le plus
  long, le plus court**, ranger des crayons.
- **Sciences** (4 leçons) : les animaux et leurs petits (poussin, veau, agneau, chiot), œuf ou pas
  œuf ; tous les jours ou de temps en temps, les dents et la toilette.
- Les listes de mots des nouveaux sons sont tirées d'une transcription son par son de chaque mot
  (`CP_PHON`) : un mot n'est jamais rangé du mauvais côté, et les sons cousins (p/b, u/ou, o/on…)
  sont écartés des mots « sans ».
- 37 nouvelles images : poule, poussin, vache, veau, mouton, agneau, chien, chiot, œuf, canard,
  bateau, bébé, dent, brosse à dents, savon, pain, lait, bonbon, soda, verre d'eau… et les nombres
  jusqu'à 20, des crayons de 7 longueurs.
- Le CP compte maintenant **89 leçons**.

## À venir

- **Périodes 3 à 5** en français et en maths (les sons p, t, b, d, ch, ou, on, an…, les nombres
  jusqu'à 100, la monnaie en dirhams).
- **Les sons isolés** : on pourra les enregistrer avec une vraie voix pour remplacer les mots
  d'appui.
- **La voix enregistrée** : lancer les outils de voix avec `-Niveau cp`.

## Fichiers

| Fichier | Rôle |
|---|---|
| `niveau.js` | Fiche du niveau (options du moteur, objets cachés, textes de Boulon) |
| `installation.json` | Fiche du Setup (titre, identifiant d'installation, dossier) |
| `js/contenu-cp.js` | Matières et leçons |
| `js/atelier-cp.js` | Les trois pièces de l'atelier : décors, objets, place des décors de la boutique |
| `css/cp.css` | Style du CP (polices, tailles, couleurs des matières) |
