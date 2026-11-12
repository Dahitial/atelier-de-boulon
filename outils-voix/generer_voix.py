"""Génère la voix enregistrée de Boulon (Chatterbox Multilingual, réglage « joyeux »).

Niveau : variable d'environnement ATELIER_NIVEAU (ce2 par défaut).
Entrée : niveaux/<niveau>/audio/phrases.json (produit par extraire_phrases.html : clé, texte, priorité).
Sortie : niveaux/<niveau>/audio/boulon/<id>.ogg + niveaux/<niveau>/audio/voix.js (table clé → fichier).
Le script reprend où il s'est arrêté : les fichiers déjà présents ne sont pas refaits.
Usage : .venv-chatterbox\\Scripts\\python.exe generer_voix.py [--limite N] [--refaire CLE...]
"""
import argparse, hashlib, json, os, re, sys, time
import numpy as np
import soundfile as sf
import torch

HERE = os.path.dirname(os.path.abspath(__file__))
NIVEAU = os.environ.get("ATELIER_NIVEAU", "ce2")
GAME = os.path.normpath(os.path.join(HERE, "..", "niveaux", NIVEAU))
PHRASES = os.path.join(GAME, "audio", "phrases.json")
OUT_DIR = os.path.join(GAME, "audio", "boulon")
MANIFEST = os.path.join(GAME, "audio", "voix.js")
REFERENCE = os.path.join(HERE, "reference_boulon.wav")
EXAGGERATION, CFG_WEIGHT = 0.85, 0.3          # réglage « Chatterbox joyeux » choisi à l'écoute
SEED = 1234


def file_id(key: str) -> str:
    return hashlib.sha1(key.encode("utf-8")).hexdigest()[:12]


def write_manifest(phrases):
    entries = {}
    for p in phrases:
        fid = file_id(p["key"])
        if os.path.exists(os.path.join(OUT_DIR, fid + ".ogg")):
            entries[p["key"]] = f"audio/boulon/{fid}.ogg"
    tmp = MANIFEST + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        f.write("/* Généré par outils-voix/generer_voix.py — ne pas modifier à la main. */\n")
        f.write("window.VOICE_FILES = " + json.dumps(entries, ensure_ascii=False, indent=0) + ";\n")
    os.replace(tmp, MANIFEST)
    return len(entries)


def chunks(text, limit=180):
    """Découpe en morceaux de phrases complètes (Chatterbox est plus fiable sur des textes courts)."""
    parts = [s.strip() for s in re.split(r"(?<=[.!?:;])\s+", text) if s.strip()]
    out, cur = [], ""
    for s in parts:
        if cur and len(cur) + 1 + len(s) > limit:
            out.append(cur); cur = s
        else:
            cur = (cur + " " + s).strip()
    if cur:
        out.append(cur)
    return out


def trim(wav, sr, thresh=0.01, pad=0.08):
    idx = np.where(np.abs(wav) > thresh)[0]
    if not len(idx):
        return wav
    a = max(0, idx[0] - int(pad * sr)); b = min(len(wav), idx[-1] + int(pad * sr))
    return wav[a:b]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--limite", type=int, default=0, help="nombre maximum de phrases à générer cette fois")
    ap.add_argument("--refaire", nargs="*", default=[], help="identifiants de fichiers à régénérer")
    args = ap.parse_args()

    with open(PHRASES, encoding="utf-8") as f:
        phrases = json.load(f)
    os.makedirs(OUT_DIR, exist_ok=True)
    for fid in args.refaire:
        path = os.path.join(OUT_DIR, fid + ".ogg")
        if os.path.exists(path):
            os.remove(path)
    print(f"{write_manifest(phrases)} / {len(phrases)} phrases déjà enregistrées", flush=True)

    todo = [p for p in phrases if not os.path.exists(os.path.join(OUT_DIR, file_id(p["key"]) + ".ogg"))]
    if args.limite:
        todo = todo[: args.limite]
    if not todo:
        print("Rien à faire : toutes les phrases sont enregistrées.")
        return

    from chatterbox.mtl_tts import ChatterboxMultilingualTTS
    torch.set_num_threads(max(1, (os.cpu_count() or 2) - 1))
    t0 = time.time()
    model = ChatterboxMultilingualTTS.from_pretrained(device="cpu")
    sr = model.sr
    print(f"modèle chargé en {time.time() - t0:.0f} s — {len(todo)} phrases à générer", flush=True)

    total_chars = sum(len(p["text"]) for p in todo)
    done_chars, start = 0, time.time()
    for i, p in enumerate(todo, 1):
        t = time.time()
        pieces = []
        for c in chunks(p["text"]):
            torch.manual_seed(SEED)
            w = model.generate(c, language_id="fr", audio_prompt_path=REFERENCE,
                               exaggeration=EXAGGERATION, cfg_weight=CFG_WEIGHT)
            pieces.append(trim(w.squeeze(0).cpu().numpy(), sr))
            pieces.append(np.zeros(int(0.25 * sr), dtype=np.float32))
        wav = np.concatenate(pieces[:-1]) if pieces else np.zeros(1, dtype=np.float32)
        peak = float(np.max(np.abs(wav))) or 1.0
        wav = (wav / peak * 0.9).astype(np.float32)
        fid = file_id(p["key"])
        tmp = os.path.join(OUT_DIR, fid + ".tmp.ogg")
        # écriture par petits blocs : en une seule fois, libsndfile (Vorbis) déborde sa pile
        # sur les sons longs et fait planter Python sans aucun message (code 0xc00000fd)
        with sf.SoundFile(tmp, "w", sr, 1, format="OGG", subtype="VORBIS") as f:
            for k in range(0, len(wav), 4096):
                f.write(wav[k:k + 4096])
        os.replace(tmp, os.path.join(OUT_DIR, fid + ".ogg"))
        n = write_manifest(phrases)
        done_chars += len(p["text"])
        rate = (time.time() - start) / max(1, done_chars)
        eta = rate * (total_chars - done_chars) / 60
        print(f"[{i}/{len(todo)}] {fid} ({time.time() - t:.0f} s) — {n} prêtes — reste ~{eta:.0f} min — {p['text'][:60]}", flush=True)
    print("TERMINÉ", flush=True)


if __name__ == "__main__":
    main()
