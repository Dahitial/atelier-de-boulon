# Attend la fin de generer_voix.py, puis envoie les fichiers de voix sur GitHub (commit + push).
# Lancé en arrière-plan ; journal : outils-voix\envoi_voix.log
# Usage : envoyer_voix_a_la_fin.ps1 [-Niveau ce2]
param([string]$Niveau = "ce2")
$ErrorActionPreference = "Continue"
$root = Split-Path -Parent $PSScriptRoot
$here = $PSScriptRoot
$git = "C:\Program Files\Git\cmd\git.exe"
$log = Join-Path $here "envoi_voix.log"
function Log($m) { Add-Content -Path $log -Value ("{0:yyyy-MM-dd HH:mm:ss}  {1}" -f (Get-Date), $m) -Encoding UTF8 }

$pidFile = Join-Path $here "generation.pid"
$genPid = if (Test-Path $pidFile) { [int](Get-Content $pidFile) } else { 0 }
Log "Attente de la fin de la génération (PID $genPid)…"
while ($genPid -and (Get-Process -Id $genPid -ErrorAction SilentlyContinue)) { Start-Sleep -Seconds 60 }

$genLog = Join-Path $here "generation.log"
$fini = (Test-Path $genLog) -and ((Get-Content $genLog -Tail 3 -Encoding UTF8) -match "TERMIN")
$n = (Get-ChildItem (Join-Path $root "niveaux\$Niveau\audio\boulon\*.ogg")).Count
Log "Génération arrêtée : $(if ($fini) { 'terminée' } else { 'interrompue' }) — $n fichiers de voix."

Set-Location $root
& $git add -- "niveaux/$Niveau/audio" 2>&1 | Out-Null
& $git diff --cached --quiet
if ($LASTEXITCODE -eq 0) { Log "Rien de nouveau à envoyer."; exit 0 }
$classe = $Niveau.ToUpper()
$msg = if ($fini) { "Voix de Boulon $classe : génération complète ($n phrases)" } else { "Voix de Boulon $classe : génération partielle ($n phrases)" }
& $git commit -q -m $msg -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>" -- "niveaux/$Niveau/audio" 2>&1 | ForEach-Object { Log $_ }
& $git push origin main 2>&1 | ForEach-Object { Log $_ }
if ($LASTEXITCODE -eq 0) { Log "Envoyé sur GitHub : $msg" } else { Log "ÉCHEC de l'envoi (code $LASTEXITCODE). Relancer : git push origin main" }
