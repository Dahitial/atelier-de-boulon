# Voix enregistrée de Boulon (Chatterbox)

Ce dossier sert à fabriquer la voix enregistrée de Boulon. La voix choisie est
Chatterbox Multilingual, réglage « joyeux » (`exaggeration` à 0,85).

## Le principe

1. `extraire_phrases.html` charge le jeu sans le lancer et recense tout ce que Boulon dit
   toujours de la même façon : consignes, encouragements, leçons, aides… Le résultat est
   enregistré dans `niveaux/<niveau>/audio/phrases.json`.
2. `generer_voix.py` lit chaque phrase avec Chatterbox (sur le processeur) et produit :
   - un fichier par phrase, `niveaux/<niveau>/audio/boulon/<id>.ogg` ;
   - la table qui relie chaque phrase à son fichier, `niveaux/<niveau>/audio/voix.js`.
3. Le jeu joue le fichier enregistré quand il existe. Sinon, c'est la voix d'Edge qui parle :
   prénoms, calculs, heures, mots isolés.

## Commandes

Ouvre PowerShell dans ce dossier. Le niveau traité est donné par la variable
`ATELIER_NIVEAU` (`ce2` par défaut), par exemple `$env:ATELIER_NIVEAU = "cp"`.
L'extraction se fait avec `extraire_phrases.html?niveau=<niveau>`.

Reprendre ou continuer la génération (les phrases déjà faites sont sautées) :

```bash
.venv-chatterbox\Scripts\python.exe generer_voix.py
```

Refaire une phrase ratée (son identifiant est le nom du fichier `.ogg`) :

```bash
.venv-chatterbox\Scripts\python.exe generer_voix.py --refaire fd83da6e391f
```

Après un changement de texte dans le jeu, il faut d'abord relancer l'extraction, en
ouvrant `extraire_phrases.html` dans Edge sans afficher de fenêtre. `maj_phrases.py`
lit le résultat et met à jour `phrases.json`, dans le dossier `audio` du niveau. Il garde toujours les phrases déjà
enregistrées.

Tout cela est enchaîné par `deuxieme_passe.ps1 -Niveau <niveau>`, qui va jusqu'à la
reconstruction du Setup (journal : `deuxieme_passe.log`). Il suit quatre étapes :
1. attendre la génération en cours ;
2. extraire les phrases ;
3. générer celles qui manquent ;
4. envoyer la voix sur GitHub, puis reconstruire le Setup.

Les consignes qui contiennent des nombres tirés au hasard (années, températures…) ne
sont pas enregistrées : la voix d'Edge les lit.

## Les lettres et les sons du CP

La voix de synthèse dit mal une lettre ou un son tout seul : « mmm » devient « èm, èm, èm », « é » devient
« hé ». Le CP joue donc de vrais enregistrements : le moteur coupe la phrase en morceaux (`Voice.morceaux`)
et joue entre deux :
- le **son** (`niveaux/cp/audio/sons/`, liste `NIVEAU.sons`) pour « [p] », « fff », « le son « i » »… ;
- le **nom** de la lettre (`niveaux/cp/audio/lettres/`, liste `NIVEAU.lettres`) pour une lettre seule :
  « La lettre p fait… », « l et a font la », « m + a → ma ».
Restent à la voix : « a » quand c'est le verbe (« Zigzag a gagné », « il y a »), « y », « à », et une
lettre après un nombre (« 8 h »).

D'où viennent les fichiers (`fabriquer_sons.py` les refait tous) :
- le nom des 26 lettres, les voyelles a, i, o, u, é, è, et les nombres de zéro à vingt dits tout seuls
  (la voix de synthèse dit « un » comme « hein ») : Sartus85 (Lingua Libre, CC BY-SA 4.0), dans
  `sons-sources/` ;
- les consonnes (m, n, l, r, s, f, ch, v, j, p, b, t, d) et ou, on, an, e : enregistrés par l'auteur
  du jeu avec l'enregistreur, dans `sons-sources/voix/` (ils passent avant tout le reste).

**L'enregistreur** : double-clic sur `Enregistrer les sons.bat` (page dans le navigateur et petit serveur
local `enregistreur_sons.py`). On voit le son à faire, on l'enregistre, on écoute la version améliorée,
puis on la garde ou on recommence. La version améliorée : bruit constant enlevé (bourdonnement électrique à
50 Hz et ses multiples, sifflement aigu de l'ordinateur : mesuré dans les silences puis soustrait), silence
coupé avant et après, volume PERÇU égalisé à −27 dB A (un peu sous les lettres de Sartus85 : réglés sur le
volume brut, les sons enregistrés paraissaient trop forts). Le timbre de la voix ne change pas. Conseil :
enregistrer sur batterie, chargeur débranché (le bourdonnement vient souvent de là). Le micro
est fermé après chaque prise : tant qu'il est ouvert, Windows passe en « mode communication » (sons
baissés, casque Bluetooth en qualité téléphone) et l'écoute devient étouffée ou muette.

Essais abandonnés, pour mémoire : prolonger les consonnes de Sartus85 par calcul (sons de robot), les
découper dans le nom des lettres (saccadé), les faire dire par Chatterbox (il invente : on dirait une
autre langue).

## Fichiers utiles

| Fichier | Rôle |
|---|---|
| `generation.log` | Journal de suivi : phrase en cours, temps restant estimé |
| `reference_boulon.wav` | Extrait de voix française qui fixe le timbre de Boulon |
| `ecoute.html` + `echantillons/` | Page de comparaison des voix (Edge, Chatterbox, Piper) |
