# Attend la fin de la génération de la voix, puis reconstruit le Setup du niveau avec toutes les phrases.
# Usage : powershell -ExecutionPolicy Bypass -File installateur\reconstruire_a_la_fin.ps1 [-Niveau ce2] [-Version 1.4.0]
# Journal : installateur\reconstruction.log
param([string]$Niveau = "ce2", [string]$Version = "1.4.0")
$here = $PSScriptRoot
$log = Join-Path $here "reconstruction.log"
function Log($m) { Add-Content -Path $log -Value ("{0:yyyy-MM-dd HH:mm:ss}  {1}" -f (Get-Date), $m) -Encoding UTF8 }
$pidFile = Join-Path $here "..\outils-voix\generation.pid"
$genPid = if (Test-Path $pidFile) { [int](Get-Content $pidFile) } else { 0 }
Log "Attente de la fin de la génération de la voix (PID $genPid)…"
while ($genPid -and (Get-Process -Id $genPid -ErrorAction SilentlyContinue)) { Start-Sleep -Seconds 60 }
Start-Sleep -Seconds 30
try {
  & (Join-Path $here "construire_setup.ps1") -Niveau $Niveau -Version $Version *>&1 | ForEach-Object { Log $_ }
  Log "Setup reconstruit."
} catch { Log "ÉCHEC : $_" }
