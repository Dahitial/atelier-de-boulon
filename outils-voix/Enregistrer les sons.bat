@echo off
rem Ouvre l enregistreur des sons du CP (page dans le navigateur + petit serveur local).
rem Garder la fenetre noire ouverte pendant l enregistrement ; la fermer a la fin.
cd /d "%~dp0"
if not exist ".venv-chatterbox\Scripts\python.exe" (
  echo Les outils Python ne sont pas installes : voir README.md, partie "Recreer les outils de voix".
  pause
  exit /b 1
)
echo Enregistreur des sons du CP : la page va s ouvrir dans le navigateur.
echo Garde cette fenetre ouverte. Pour arreter : ferme-la.
".venv-chatterbox\Scripts\python.exe" enregistreur_sons.py %*
pause
