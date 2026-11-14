# L'Atelier de Boulon

Jeux éducatifs libres pour l'école primaire, avec Boulon le petit robot.
Ils fonctionnent dans le navigateur (Edge, Chrome), sous Windows 10 et 11, sans compte et sans publicité.

- **CE2** : français, maths, sciences, histoire, géographie. Complet.
- **CP** : lire, écrire et compter, tout en voix et en images, pour un enfant qui ne sait pas encore lire.
  Périodes 1 et 2 faites (89 leçons) ; périodes 3 à 5 en cours.

Autour des leçons : un atelier à explorer, des écrous et une boutique, des médailles, un défi contre
Zigzag le renard, un atelier de construction, un chevalet, un petit jardin qui pousse jour après jour,
les grandes inventions, et l'atelier de Rivet pour apprendre à programmer un robot.
Le contexte est marocain : villes, fêtes, dirhams.

## Jouer

- **En ligne**, sans rien installer : **https://dahitial.github.io/atelier-de-boulon/**
- **Installer** : un Setup par niveau, dans les [versions publiées](../../releases).
- **Sans installer** : double-clic sur `niveaux/ce2/Lancer.bat` ou `niveaux/cp/Lancer.bat`
  (ou ouvrir `index.html` dans Edge).

Les progrès des enfants restent sur l'ordinateur, dans le navigateur. L'espace parents (avec un code)
montre le temps de jeu et les résultats, et permet de sauvegarder les élèves dans un fichier.

## Organisation

| Dossier | Contenu |
|---|---|
| [`moteur/`](moteur/LISEZ-MOI.md) | Le moteur commun à tous les niveaux ; il explique comment ajouter un niveau ou un module |
| `modules/` | Les modules écrits une fois pour tous les niveaux : `geo` (le tour du monde), `inventions`, `robotique` (l'atelier de Rivet) |
| [`niveaux/ce2/`](niveaux/ce2/LISEZ-MOI.md) | Le CE2 : contenus, voix enregistrée |
| [`niveaux/cp/`](niveaux/cp/LISEZ-MOI.md) | Le CP |
| `installateur/` | Le programme d'installation Windows (Inno Setup), un Setup par niveau |
| [`outils-voix/`](outils-voix/LISEZ-MOI.md) | Les scripts qui génèrent la voix de Boulon (Chatterbox) |
| `outils-geo/` | Le script qui fabrique la carte du monde et copie les drapeaux |
| `brochure/` | La brochure de présentation (PDF) |

### Construire le Setup d'un niveau

```bash
powershell -ExecutionPolicy Bypass -File installateur\construire_setup.ps1 -Niveau cp -Version 0.2.0
```

Le même Setup se construit sur GitHub (onglet *Actions*, « Construire un Setup ») : c'est cette
version-là qui est publiée, et signée une fois la signature accordée.

## Confidentialité

Le jeu ne crée aucun compte, ne contient ni publicité ni mesure d'audience, et n'envoie aucune donnée
de l'enfant sur Internet. Une seule exception : pour parler, il utilise la synthèse vocale de Microsoft
Edge. Quand une voix « naturelle » en ligne d'Edge est disponible, les phrases à dire (qui peuvent
contenir le prénom de l'enfant) sont traitées par le service vocal de Microsoft, selon sa
[déclaration de confidentialité](https://privacy.microsoft.com/). Sans Internet, ce sont les voix de
Windows qui parlent, et rien ne quitte l'ordinateur.

## Signature du code

Voir [la politique de signature](CODE_SIGNING_POLICY.md).

## Licence

Le code, les textes, les dessins et les sons originaux du jeu sont publiés sous la licence
[GNU GPL version 3](LICENSE) : vous pouvez les utiliser, les étudier, les modifier et les redistribuer,
à condition de publier vos modifications sous la même licence.

Les éléments repris d'autres projets gardent leur propre licence (voir *Crédits*).

## Publier une mise à jour du site

GitHub Pages dit au navigateur de garder chaque fichier 10 minutes. Avant chaque publication, lancer
`node outils-site/marquer_version.js` : il pose un nouveau numéro (« ?v=… ») dans les pages d'entrée,
et `moteur/charger.js` le recopie sur tous les fichiers du jeu. Le navigateur reprend alors toute la
nouvelle version d'un coup (au plus 10 minutes après), sans mélanger anciens et nouveaux fichiers.

## Crédits

- Voix enregistrée : [Chatterbox](https://github.com/resemble-ai/chatterbox) (Resemble AI, licence MIT).
  Le timbre de référence (`outils-voix/reference_boulon.wav`) vient de la voix Piper `fr_FR-siwis-medium`,
  entraînée sur le [SIWIS French Speech Synthesis Database](https://datashare.ed.ac.uk/handle/10283/2353)
  (licence CC BY 4.0).
- Voix de secours : la synthèse vocale du navigateur (voix de Microsoft Edge et de Windows).
- Lettres et sons du CP : le nom des 26 lettres, les voyelles et les nombres de zéro à vingt sont des enregistrements de Sartus85,
  projet [Lingua Libre](https://lingualibre.org/), licence [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/),
  via Wikimedia Commons (détail : `outils-voix/sons-sources/CREDITS.txt`). Les sons des consonnes
  (« mmm », « sss », « pe »…) et ou, on, an, e ont été enregistrés pour le jeu par son auteur
  (seuls les sons du jeu sont publiés, pas les enregistrements d'origine).
- Carte du monde : [world-atlas](https://github.com/topojson/world-atlas) 2.0.2 (licence ISC), d'après
  [Natural Earth](https://www.naturalearthdata.com/) (domaine public).
- Drapeaux : [flag-icons](https://github.com/lipis/flag-icons) 7.6.0 (licence MIT, voir
  `modules/geo/img/drapeaux/LICENSE-flag-icons.txt`).
- Polices du CP : [Andika](https://software.sil.org/andika/) (SIL International) et
  [Fredoka](https://github.com/hafontia/Fredoka-One), licence SIL OFL 1.1 (voir `moteur/polices/`).

---

## In English

*L'Atelier de Boulon* is a free, open-source educational game for French-speaking primary school
children (CP and CE2, ages 6 to 9), with a Moroccan context. It runs locally in the browser on Windows,
with no account, no ads and no tracking. The code and original assets are licensed under the GNU GPL v3.
Windows installers are built with Inno Setup by the GitHub Actions workflow in `.github/workflows/`.
