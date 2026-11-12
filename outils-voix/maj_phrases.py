"""Met à jour niveaux/<niveau>/audio/phrases.json à partir de la page extraire_phrases.html rendue par Edge (--dump-dom).

Usage : python maj_phrases.py <fichier dom.html> [--essai]   (--essai : compte sans écrire phrases.json)
Niveau : variable d'environnement ATELIER_NIVEAU (ce2 par défaut).
Affiche le nombre total de phrases et le nombre de phrases qui n'ont pas encore de fichier audio.
"""
import hashlib
import html
import json
import os
import re
import sys

ICI = os.path.dirname(os.path.abspath(__file__))
NIVEAU = os.environ.get("ATELIER_NIVEAU", "ce2")
AUDIO = os.path.join(ICI, "..", "niveaux", NIVEAU, "audio", "boulon")
PHRASES = os.path.join(ICI, "..", "niveaux", NIVEAU, "audio", "phrases.json")


def main():
    dom = open(sys.argv[1], encoding="utf-8").read()
    m = re.search(r'<pre id="out">(.*?)</pre>', dom, re.S)
    if not m or m.group(1).strip() in ("", "attente"):
        print("ERREUR : l'extraction n'a rien produit")
        sys.exit(1)
    phrases = json.loads(html.unescape(m.group(1)))
    faits = {f[:-4] for f in os.listdir(AUDIO) if f.endswith(".ogg") and not f.endswith(".tmp.ogg")}
    ident = lambda p: hashlib.sha1(p["key"].encode("utf-8")).hexdigest()[:12]
    # on garde aussi les anciennes phrases déjà enregistrées, même si l'extraction ne les voit plus
    try:
        anciennes = json.load(open(PHRASES, encoding="utf-8"))
    except (OSError, ValueError):
        anciennes = []
    cles = {p["key"] for p in phrases}
    phrases += [p for p in anciennes if p["key"] not in cles and ident(p) in faits]
    manquantes = [p for p in phrases if ident(p) not in faits]
    if "--essai" not in sys.argv:
        with open(PHRASES, "w", encoding="utf-8") as f:
            json.dump(phrases, f, ensure_ascii=False)
    print(f"{len(phrases)} phrases, {len(manquantes)} à générer, {sum(len(p['text']) for p in manquantes)} caractères")


if __name__ == "__main__":
    main()
