@echo off
rem L'Atelier de Boulon - CP : ouvre le jeu dans une fenetre Edge sans barre d'adresse.
start "" msedge --app="%~dp0index.html" --window-size=1100,860 || start "" "%~dp0index.html"
