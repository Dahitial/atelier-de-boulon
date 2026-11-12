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

## Fichiers utiles

| Fichier | Rôle |
|---|---|
| `generation.log` | Journal de suivi : phrase en cours, temps restant estimé |
| `reference_boulon.wav` | Extrait de voix française qui fixe le timbre de Boulon |
| `ecoute.html` + `echantillons/` | Page de comparaison des voix (Edge, Chatterbox, Piper) |
