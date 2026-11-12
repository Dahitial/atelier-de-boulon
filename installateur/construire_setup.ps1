# Construit le programme d'installation d'un niveau : installateur\Setup\AtelierBoulon-<CLASSE>-Setup-<version>.exe
# Usage : powershell -ExecutionPolicy Bypass -File installateur\construire_setup.ps1 [-Niveau ce2] [-Version 1.4.0]
# Le Setup contient le moteur commun, les modules et le dossier niveaux\<niveau> (fiche : niveaux\<niveau>\installation.json).
param([string]$Niveau = "ce2", [string]$Version = "1.4.0")
$ErrorActionPreference = "Stop"
$here = $PSScriptRoot                                   # installateur
$racine = Split-Path -Parent $here                      # dépôt
$dossierNiveau = Join-Path $racine "niveaux\$Niveau"
$fiche = Join-Path $dossierNiveau "installation.json"
if (-not (Test-Path $fiche)) { throw "Niveau inconnu : $Niveau (fichier manquant : $fiche)" }
$info = Get-Content $fiche -Raw -Encoding UTF8 | ConvertFrom-Json

$iscc = @("$env:LOCALAPPDATA\Programs\Inno Setup 6\ISCC.exe", "C:\Program Files (x86)\Inno Setup 6\ISCC.exe", "C:\Program Files\Inno Setup 6\ISCC.exe") |
  Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $iscc) { throw "Inno Setup 6 est introuvable. Installe-le : winget install JRSoftware.InnoSetup" }

# fiche du niveau pour Inno Setup (UTF-8 avec BOM : accents et tiret long conservés)
function Def($nom, $valeur) {
  if ("$valeur" -match '"') { throw "Guillemet interdit dans installation.json ($nom)" }
  return '#define {0} "{1}"' -f $nom, $valeur
}
$inc = @(
  "; Généré par construire_setup.ps1 à partir de niveaux\$Niveau\installation.json — ne pas modifier à la main",
  (Def "Niveau" $Niveau),
  (Def "Classe" $info.classe),
  (Def "AppName" $info.titre),
  (Def "Description" $info.description),
  (Def "Raccourci" $info.raccourci),
  (Def "AppGuid" $info.appGuid),
  (Def "Dossier" $info.dossier)
) -join "`r`n"
[IO.File]::WriteAllText((Join-Path $here "niveau-courant.iss"), $inc + "`r`n", (New-Object Text.UTF8Encoding $true))

$n = (Get-ChildItem (Join-Path $dossierNiveau "audio\boulon\*.ogg") -ErrorAction SilentlyContinue).Count
Write-Host "$($info.titre) — version $Version — $n phrases de voix enregistrée incluses"
& $iscc "/DAppVer=$Version" "/Q" (Join-Path $here "atelier-boulon.iss")
if ($LASTEXITCODE -ne 0) { throw "La compilation a échoué (code $LASTEXITCODE)." }
$nomExe = "AtelierBoulon-$($info.classe)-Setup-$Version.exe"
$exe = Join-Path $here "Setup\$nomExe"
Write-Host ("Créé : {0} ({1:N1} Mo)" -f $exe, ((Get-Item $exe).Length / 1MB))

# Paquet à partager : le Setup + la notice (complétée pour ce niveau), dans un seul .zip
$notice = Join-Path $here "Setup\Comment-installer.txt"
$texte = (Get-Content (Join-Path $here "Comment-installer.txt") -Raw -Encoding UTF8).
  Replace("{{TITRE_MAJ}}", $info.titre.ToUpper()).Replace("{{TITRE}}", $info.titre).
  Replace("{{DESCRIPTION}}", $info.description).Replace("{{EXE}}", $nomExe)
[IO.File]::WriteAllText($notice, $texte, (New-Object Text.UTF8Encoding $true))
$zip = Join-Path $here "Setup\AtelierBoulon-$($info.classe)-$Version.zip"
Compress-Archive -Path $exe, $notice -DestinationPath $zip -Force
Write-Host ("Paquet : {0} ({1:N1} Mo)" -f $zip, ((Get-Item $zip).Length / 1MB))

# Copie sur le Bureau seulement quand toute la voix enregistrée est présente
$phrases = Join-Path $dossierNiveau "audio\phrases.json"
$attendu = if (Test-Path $phrases) { (Get-Content $phrases -Raw -Encoding UTF8 | ConvertFrom-Json).Count } else { 0 }
if ($attendu -gt 0 -and $n -ge $attendu) {
  $dest = Join-Path ([Environment]::GetFolderPath("Desktop")) (Split-Path $zip -Leaf)
  Copy-Item $zip $dest -Force
  Write-Host "Voix complète ($n/$attendu) : paquet copié sur le Bureau → $dest"
} else {
  Write-Host "Voix incomplète ($n/$attendu) : paquet NON copié sur le Bureau."
}
