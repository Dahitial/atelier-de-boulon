"""Échantillons edge-tts : voix naturelles Microsoft, réglage neutre et réglage « joyeux »."""
import asyncio, os, sys
import edge_tts
sys.path.insert(0, os.path.dirname(__file__))
from phrases_test import PHRASES

OUT = os.path.join(os.path.dirname(__file__), "echantillons")
VOICES = {
    "vivienne": "fr-FR-VivienneMultilingualNeural",
    "denise": "fr-FR-DeniseNeural",
    "eloise": "fr-FR-EloiseNeural",
    "remy": "fr-FR-RemyMultilingualNeural",
}
STYLES = {"neutre": ("+0%", "+0Hz"), "joyeux": ("+8%", "+6Hz")}


async def main():
    for vkey, voice in VOICES.items():
        for skey, (rate, pitch) in STYLES.items():
            for pkey, text in PHRASES:
                path = os.path.join(OUT, f"edge_{vkey}_{skey}_{pkey}.mp3")
                if os.path.exists(path):
                    continue
                await edge_tts.Communicate(text, voice, rate=rate, pitch=pitch).save(path)
                print("ok", os.path.basename(path))

asyncio.run(main())
