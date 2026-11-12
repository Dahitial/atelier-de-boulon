@echo off
rem Superviseur : relance generer_voix.py s'il s'arrête avant la fin (il reprend là où il en était).
rem Journal des démarrages et arrêts : outils-voix\superviseur.log
setlocal enabledelayedexpansion
cd /d "%~dp0"
set PYTHONIOENCODING=utf-8
set PYTHONUNBUFFERED=1
for /l %%i in (1,1,25) do (
  echo !date! !time! demarrage %%i>> superviseur.log
  ".venv-chatterbox\Scripts\python.exe" generer_voix.py >> generation.log 2> generation_err.log
  echo !date! !time! arret, code !errorlevel!>> superviseur.log
  findstr /c:"TERMIN" /c:"Rien " generation.log >nul && goto fin
  timeout /t 15 /nobreak >nul
)
:fin
echo !date! !time! superviseur termine>> superviseur.log
