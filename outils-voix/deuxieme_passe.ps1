# Deuxième passe de la voix de Boulon, enchaînée après la génération en cours :
#   1. attend la fin de la génération (PID dans generation.pid) puis l'envoi et le Setup qui la suivent ;
#   2. relance l'extraction des phrases (Edge sans fenêtre) pour ajouter les nouveaux textes du jeu ;
#   3. génère les phrases manquantes avec le superviseur ;
#   4. envoie la voix sur GitHub et reconstruit le Setup.
# Usage : powershell -ExecutionPolicy Bypass -File outils-voix\deuxieme_passe.ps1 [-Niveau ce2] [-Version 1.4.0]
# Journal : outils-voix\deuxieme_passe.log
param([string]$Niveau = "ce2", [string]$Version = "1.4.0")
$env:ATELIER_NIVEAU = $Niveau      # lu par maj_phrases.py et generer_voix.py
$ErrorActionPreference = "Continue"
$ici = $PSScriptRoot
$log = Join-Path $ici "deuxieme_passe.log"
function Log($m) { Add-Content -Path $log -Value ("{0:yyyy-MM-dd HH:mm:ss}  {1}" -f (Get-Date), $m) -Encoding UTF8 }

# 1. attendre la génération en cours
$pidFile = Join-Path $ici "generation.pid"
$genPid = if (Test-Path $pidFile) { [int](Get-Content $pidFile) } else { 0 }
Log "Attente de la fin de la génération en cours (PID $genPid)…"
while ($genPid -and (Get-Process -Id $genPid -ErrorAction SilentlyContinue)) { Start-Sleep -Seconds 60 }
Log "Génération terminée. Attente de l'envoi et du Setup (5 min)…"
Start-Sleep -Seconds 300

# 2. extraction des phrases
$edge = @("${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe", "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe") | Where-Object { Test-Path $_ } | Select-Object -First 1
$tmp = Join-Path $env:TEMP "atelier-boulon-extraction"
New-Item -ItemType Directory -Force $tmp | Out-Null
$dom = Join-Path $tmp "dom.html"
$url = "file:///" + ((Join-Path $ici "extraire_phrases.html") -replace '\\', '/') + "?niveau=$Niveau"
$p = Start-Process -FilePath $edge -ArgumentList @("--headless=new", "--disable-gpu", "--allow-file-access-from-files", "--user-data-dir=`"$tmp\profil`"", "--virtual-time-budget=60000", "--dump-dom", $url) -RedirectStandardOutput $dom -RedirectStandardError (Join-Path $tmp "edge.err") -PassThru -WindowStyle Hidden
$p.WaitForExit(300000) | Out-Null
$py = Join-Path $ici ".venv-chatterbox\Scripts\python.exe"
$env:PYTHONIOENCODING = "utf-8"; [Console]::OutputEncoding = [Text.Encoding]::UTF8
$res = & $py -I (Join-Path $ici "maj_phrases.py") $dom 2>&1
Log "Extraction : $res"
if ("$res" -match "ERREUR" -or "$res" -match ", 0 ") { Log "Rien à générer : fin."; exit 0 }

# 3. génération (on archive l'ancien journal, sinon le superviseur croirait que c'est déjà fini)
$genLog = Join-Path $ici "generation.log"
if (Test-Path $genLog) { Move-Item $genLog (Join-Path $ici ("generation-{0:yyyy-MM-dd-HHmm}.log" -f (Get-Date))) -Force }
$sup = Start-Process -FilePath "cmd.exe" -ArgumentList "/c `"$(Join-Path $ici 'superviser_generation.cmd')`"" -WorkingDirectory $ici -WindowStyle Hidden -PassThru
Set-Content -Path $pidFile -Value $sup.Id -Encoding ascii
Log "Génération lancée (superviseur PID $($sup.Id))."

# 4. envoi sur GitHub puis Setup (chacun attend la fin du superviseur)
& (Join-Path $ici "envoyer_voix_a_la_fin.ps1") -Niveau $Niveau
Log "Envoi terminé (voir envoi_voix.log)."
& (Join-Path $ici "..\installateur\reconstruire_a_la_fin.ps1") -Niveau $Niveau -Version $Version
Log "Setup $Version reconstruit (voir installateur\reconstruction.log). Fin de la deuxième passe."
