; Programme d'installation de « L'Atelier de Boulon » (Inno Setup 6), un Setup par niveau.
; Construire : installateur\construire_setup.ps1 -Niveau ce2 -Version 1.4.0
; Ce script écrit d'abord niveau-courant.iss (Niveau, Classe, AppName, AppGuid, Dossier…)
; à partir de niveaux\<niveau>\installation.json, puis compile ce fichier.

#ifndef AppVer
  #define AppVer "1.0.0"
#endif
#include "niveau-courant.iss"

[Setup]
AppId={{{#AppGuid}}
AppName={#AppName}
AppVersion={#AppVer}
AppVerName={#AppName} {#AppVer}
AppPublisher=Tihadi
AppComments={#Description}
DefaultDirName={localappdata}\Programs\{#Dossier}
DefaultGroupName={#Dossier}
DisableProgramGroupPage=yes
PrivilegesRequired=lowest
MinVersion=10.0
OutputDir=Setup
OutputBaseFilename=AtelierBoulon-{#Classe}-Setup-{#AppVer}
SetupIconFile=boulon.ico
UninstallDisplayIcon={app}\boulon.ico
UninstallDisplayName={#AppName}
WizardStyle=modern
Compression=lzma2/max
SolidCompression=yes
VersionInfoVersion={#AppVer}
VersionInfoDescription=Installation de {#AppName}

[Languages]
Name: "fr"; MessagesFile: "compiler:Languages\French.isl"

[Tasks]
Name: "desktopicon"; Description: "Créer un raccourci sur le Bureau"; GroupDescription: "Raccourcis :"

[Files]
; le moteur commun, les modules transversaux et le dossier du niveau (sans vidéos, documentation ni outils)
Source: "..\moteur\*"; DestDir: "{app}\moteur"; Flags: ignoreversion recursesubdirs
Source: "..\modules\*"; DestDir: "{app}\modules"; Flags: ignoreversion recursesubdirs
Source: "..\niveaux\{#Niveau}\*"; DestDir: "{app}\niveaux\{#Niveau}"; Excludes: "\video,\docs,\Lancer.bat,\LISEZ-MOI.md,\installation.json,\audio\phrases.json,*.tmp,*.tmp.ogg,*.mp4"; Flags: ignoreversion recursesubdirs
Source: "boulon.ico"; DestDir: "{app}"; Flags: ignoreversion

[InstallDelete]
; ancienne organisation (versions 1.3.x et avant : tout à la racine) et anciens fichiers du moteur
Type: filesandordirs; Name: "{app}\js"
Type: filesandordirs; Name: "{app}\css"
Type: filesandordirs; Name: "{app}\img"
Type: filesandordirs; Name: "{app}\audio"
Type: files; Name: "{app}\index.html"
Type: filesandordirs; Name: "{app}\moteur"
Type: filesandordirs; Name: "{app}\modules"
Type: filesandordirs; Name: "{app}\niveaux"

[Icons]
Name: "{autoprograms}\{#AppName}"; Filename: "{code:LaunchTarget}"; Parameters: "{code:LaunchParams}"; WorkingDir: "{app}"; IconFilename: "{app}\boulon.ico"; Comment: "{#Raccourci}"
Name: "{autodesktop}\{#AppName}"; Filename: "{code:LaunchTarget}"; Parameters: "{code:LaunchParams}"; WorkingDir: "{app}"; IconFilename: "{app}\boulon.ico"; Tasks: desktopicon

[Run]
Filename: "{code:LaunchTarget}"; Parameters: "{code:LaunchParams}"; Description: "Lancer {#AppName}"; Flags: nowait postinstall skipifsilent shellexec

[Code]
{ Le jeu s'ouvre dans Microsoft Edge en mode application (fenêtre sans barre d'adresse).
  Si Edge est introuvable, on ouvre simplement index.html avec le navigateur par défaut. }

function EdgePath(): String;
var P: String;
begin
  Result := '';
  if RegQueryStringValue(HKCU, 'SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\msedge.exe', '', P) and FileExists(P) then
    Result := P
  else if RegQueryStringValue(HKLM, 'SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\msedge.exe', '', P) and FileExists(P) then
    Result := P
  else if FileExists(ExpandConstant('{commonpf32}\Microsoft\Edge\Application\msedge.exe')) then
    Result := ExpandConstant('{commonpf32}\Microsoft\Edge\Application\msedge.exe')
  else if FileExists(ExpandConstant('{commonpf64}\Microsoft\Edge\Application\msedge.exe')) then
    Result := ExpandConstant('{commonpf64}\Microsoft\Edge\Application\msedge.exe');
end;

function AppUrl(): String;
var S: String;
begin
  S := ExpandConstant('{app}\niveaux\{#Niveau}\index.html');
  StringChangeEx(S, '\', '/', True);
  StringChangeEx(S, '%', '%25', True);
  StringChangeEx(S, ' ', '%20', True);
  StringChangeEx(S, '#', '%23', True);
  Result := 'file:///' + S;
end;

function LaunchTarget(Param: String): String;
begin
  Result := EdgePath();
  if Result = '' then
    Result := ExpandConstant('{app}\niveaux\{#Niveau}\index.html');
end;

function LaunchParams(Param: String): String;
begin
  if EdgePath() <> '' then
    Result := '--app="' + AppUrl() + '" --window-size=1100,860'
  else
    Result := '';
end;
