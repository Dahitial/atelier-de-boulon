"""Échantillons Chatterbox Multilingual (Resemble AI, licence MIT), sur processeur.
La voix de référence est française (Piper siwis) pour éviter l'accent anglais par défaut.
Le paramètre « exaggeration » règle l'expressivité (0,5 = normal, plus haut = plus enjoué)."""
import os, sys, time, wave
import numpy as np
import torch, torchaudio
sys.path.insert(0, os.path.dirname(__file__))
from phrases_test import PHRASES
from chatterbox.mtl_tts import ChatterboxMultilingualTTS

HERE = os.path.dirname(__file__)
OUT = os.path.join(HERE, "echantillons")

# voix de référence : deux phrases Piper collées (~8 s)
ref = os.path.join(OUT, "_reference_fr.wav")
if not os.path.exists(ref):
    frames, params = b"", None
    for name in ("piper_siwis_neutre_accueil.wav", "piper_siwis_neutre_erreur.wav"):
        with wave.open(os.path.join(OUT, name), "rb") as w:
            params = w.getparams(); frames += w.readframes(w.getnframes())
    with wave.open(ref, "wb") as w:
        w.setparams(params); w.writeframes(frames)

torch.set_num_threads(max(1, os.cpu_count() - 1))
t0 = time.time()
model = ChatterboxMultilingualTTS.from_pretrained(device="cpu")
print(f"modèle chargé en {time.time() - t0:.0f} s", flush=True)

STYLES = {"normal": (0.5, 0.5), "joyeux": (0.85, 0.3)}
for skey, (exag, cfg) in STYLES.items():
    for pkey, text in PHRASES:
        path = os.path.join(OUT, f"chatterbox_{skey}_{pkey}.wav")
        if os.path.exists(path):
            continue
        t = time.time()
        wav = model.generate(text, language_id="fr", audio_prompt_path=ref, exaggeration=exag, cfg_weight=cfg)
        torchaudio.save(path, wav, model.sr)
        print(f"ok {os.path.basename(path)} ({time.time() - t:.0f} s)", flush=True)
