"""Échantillons Piper (100 % hors ligne), voix fr_FR-siwis-medium."""
import os, sys, wave
from piper import PiperVoice, SynthesisConfig
sys.path.insert(0, os.path.dirname(__file__))
from phrases_test import PHRASES

HERE = os.path.dirname(__file__)
voice = PiperVoice.load(os.path.join(HERE, "modeles", "fr_FR-siwis-medium.onnx"))
STYLES = {
    "neutre": SynthesisConfig(length_scale=1.0, noise_scale=0.667, noise_w_scale=0.8),
    "joyeux": SynthesisConfig(length_scale=0.9, noise_scale=0.8, noise_w_scale=1.0),
}
for skey, cfg in STYLES.items():
    for pkey, text in PHRASES:
        path = os.path.join(HERE, "echantillons", f"piper_siwis_{skey}_{pkey}.wav")
        with wave.open(path, "wb") as wf:
            voice.synthesize_wav(text, wf, syn_config=cfg)
        print("ok", os.path.basename(path))
