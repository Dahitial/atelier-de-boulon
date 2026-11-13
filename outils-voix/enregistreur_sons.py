"""Enregistreur des sons du CP : un petit serveur sur l'ordinateur (http://127.0.0.1:8840), seulement local.

La page enregistrer_sons.html montre le son à faire, enregistre le micro et envoie l'enregistrement ici.
- POST /api/essai?son=m   (corps : WAV)  → on l'améliore (fabriquer_sons.traiter_enregistrement) et on
  renvoie la version améliorée (WAV) à écouter. L'essai est gardé dans un dossier temporaire.
- POST /api/garder?son=m                 → l'essai devient sons-sources/voix/m.wav (l'original, à garder)
  et niveaux/cp/audio/sons/m.ogg (le son du jeu).
- GET  /api/etat                         → les sons déjà enregistrés.
Le reste : les fichiers du dépôt (la page, les sons actuels du jeu).

Lancement : double-clic sur « Enregistrer les sons.bat », ou
  .venv-chatterbox\\Scripts\\python.exe enregistreur_sons.py
"""
import io, json, os, sys, tempfile, threading, webbrowser
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

import numpy as np
import soundfile as sf

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import fabriquer_sons as F  # noqa: E402

PORT = 8840
RACINE = os.path.normpath(os.path.join(F.HERE, ".."))
ESSAIS = os.path.join(tempfile.gettempdir(), "atelier-boulon-enregistreur")
SONS = ["m", "n", "l", "r", "s", "f", "ch", "v", "j", "p", "b", "t", "d", "ou", "on", "an", "e"]


class Gestion(SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=RACINE, **k)

    def log_message(self, fmt, *args):            # on n'affiche que les actions utiles
        if "/api/" in self.path:
            sys.stderr.write("  " + (fmt % args) + "\n")

    def envoyer(self, code, corps, type_="application/json; charset=utf-8"):
        self.send_response(code)
        self.send_header("Content-Type", type_)
        self.send_header("Content-Length", str(len(corps)))
        self.send_header("Cache-Control", "no-store")
        for k, v in getattr(self, "entetes", {}).items():
            self.send_header(k, v)
        self.end_headers()
        self.wfile.write(corps)

    def son_demande(self):
        son = parse_qs(urlparse(self.path).query).get("son", [""])[0]
        return son if son in SONS else None

    def do_GET(self):
        if urlparse(self.path).path == "/api/etat":
            etat = {s: os.path.exists(os.path.join(F.VOIX, s + ".wav")) for s in SONS}
            return self.envoyer(200, json.dumps(etat).encode())
        return super().do_GET()

    def end_headers(self):                         # pas de cache : on veut toujours la dernière version
        if not self.path.startswith("/api/"):
            self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_POST(self):
        chemin, son = urlparse(self.path).path, self.son_demande()
        if not son:
            return self.envoyer(400, "son inconnu".encode(), "text/plain; charset=utf-8")
        essai = os.path.join(ESSAIS, son + ".wav")
        try:
            if chemin == "/api/essai":
                corps = self.rfile.read(int(self.headers.get("Content-Length", 0)))
                x, sr = sf.read(io.BytesIO(corps), dtype="float64")
                os.makedirs(ESSAIS, exist_ok=True)
                sf.write(essai, x, sr, subtype="PCM_16")           # l'original, tel qu'enregistré
                brut = F.lire(essai)
                y = F.traiter_enregistrement(brut, son)
                sortie = io.BytesIO()
                sf.write(sortie, y.astype(np.float32), F.SR, format="WAV", subtype="PCM_16")
                # pour la page : la crête de l'original (1 = saturé) et le gain appliqué, pour réécouter
                # l'original au même volume que la version améliorée (comparaison juste)
                self.entetes = {"X-Crete": f"{np.max(np.abs(x)):.3f}",
                                "X-Gain-dB": f"{20 * np.log10(F.rms_actif(y) / F.rms_actif(brut)):.1f}",
                                "X-Niveau-dB": f"{20 * np.log10(F.rms_actif(brut)):.1f}"}
                return self.envoyer(200, sortie.getvalue(), "audio/wav")
            if chemin == "/api/garder":
                if not os.path.exists(essai):
                    return self.envoyer(400, "pas d'essai à garder".encode(), "text/plain; charset=utf-8")
                os.makedirs(F.VOIX, exist_ok=True)
                os.replace(essai, os.path.join(F.VOIX, son + ".wav"))
                y = F.traiter_enregistrement(F.lire(os.path.join(F.VOIX, son + ".wav")), son)
                F.ecrire_ogg(os.path.join(F.CP, "sons"), son, y)
                print(f"  ✓ {son} gardé : sons-sources/voix/{son}.wav → niveaux/cp/audio/sons/{son}.ogg")
                return self.envoyer(200, b'{"ok": true}')
        except ValueError as e:
            return self.envoyer(422, str(e).encode(), "text/plain; charset=utf-8")
        except Exception as e:                                     # on renvoie l'erreur à la page
            return self.envoyer(500, f"{type(e).__name__} : {e}".encode(), "text/plain; charset=utf-8")
        return self.envoyer(404, b"?", "text/plain")


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    serveur = ThreadingHTTPServer(("127.0.0.1", PORT), Gestion)
    url = f"http://127.0.0.1:{PORT}/outils-voix/enregistrer_sons.html"
    print(f"Enregistreur des sons du CP : {url}\nGarde cette fenêtre ouverte. Pour arrêter : ferme-la (ou Ctrl+C).")
    if "--sans-navigateur" not in sys.argv:
        threading.Timer(0.8, lambda: webbrowser.open(url)).start()
    try:
        serveur.serve_forever()
    except KeyboardInterrupt:
        pass
