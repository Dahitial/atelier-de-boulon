"""Fabrique les « sons tenus » du CP : ce que la voix de synthèse ne sait pas dire seul.

- Voyelles a, i, o, u, é, è : enregistrements de Sartus85 (Lingua Libre, CC BY-SA 4.0), dans sons-sources/
  (é vient du mot « et », è du mot « haie »). On coupe le silence autour et on les met au même volume.
- Consonnes m (« mmm », bouche fermée) et s (« sss », le serpent) : fabriquées par calcul.
  [s] = souffle aigu (bruit gardé entre 4 et 10 kHz, pic vers 6,5 kHz) ;
  [m] = voix douce filtrée comme un son qui sort par le nez (tout dans le grave, vers 250 Hz).

Sortie : niveaux/cp/audio/sons/<son>.ogg. Le jeu les joue à la place de la voix quand Boulon dit
« [a] », « mmm », « le son « i » »… (voir Voice.morceaux dans moteur/js/core.js et NIVEAU.sons).
Usage : .venv-chatterbox\\Scripts\\python.exe fabriquer_sons.py
"""
import os
import numpy as np
import soundfile as sf
from scipy.signal import resample_poly

HERE = os.path.dirname(os.path.abspath(__file__))
SOURCES = os.path.join(HERE, "sons-sources")
OUT = os.path.normpath(os.path.join(HERE, "..", "niveaux", "cp", "audio", "sons"))
SR = 48000
DUREE_CONSONNE = 0.75          # durée du son tenu (1,3 s paraissait trop long à l'écoute)
rng = np.random.default_rng(7)


def enveloppe(n, att, rel):
    e = np.ones(n)
    a, r = int(att * SR), int(rel * SR)
    e[:a] = np.sin(np.linspace(0, np.pi / 2, a)) ** 2
    e[-r:] = np.cos(np.linspace(0, np.pi / 2, r)) ** 2
    return e


def rms_voix(x):
    """RMS des passages vraiment sonores (trames de 20 ms au-dessus de −35 dB du maximum)."""
    w = int(0.02 * SR)
    tr = np.array([np.sqrt(np.mean(x[i:i + w] ** 2)) for i in range(0, len(x) - w, w)])
    return np.sqrt(np.mean(tr[tr > tr.max() * 10 ** (-35 / 20)] ** 2))


def normaliser(x, rms_db, crete_max_db=-1.0):
    x = x * (10 ** (rms_db / 20) / rms_voix(x))
    c = np.max(np.abs(x))
    if c > 10 ** (crete_max_db / 20):
        x *= 10 ** (crete_max_db / 20) / c
    return x


def ecrire(nom, x):
    path = os.path.join(OUT, nom + ".ogg")
    # écriture par petits blocs : libsndfile (Vorbis) déborde sa pile sur les gros blocs
    with sf.SoundFile(path, "w", SR, 1, format="OGG", subtype="VORBIS") as f:
        for k in range(0, len(x), 4096):
            f.write(x[k:k + 4096].astype(np.float32))
    print(f"{nom}.ogg : {len(x) / SR:.2f} s, crête {np.max(np.abs(x)):.2f}")


def voyelle(nom):
    x, sr = sf.read(os.path.join(SOURCES, nom + ".wav"), dtype="float64")
    if sr != SR:
        x = resample_poly(x, SR, sr)
    x = x - np.mean(x)
    w = int(0.01 * SR)
    tr = np.array([np.sqrt(np.mean(x[i:i + w] ** 2)) for i in range(0, len(x) - w, w)])
    actif = np.where(tr > tr.max() * 0.06)[0]
    a = max(0, actif[0] * w - int(0.04 * SR))
    b = min(len(x), (actif[-1] + 1) * w + int(0.08 * SR))
    x = x[a:b] * enveloppe(b - a, 0.01, 0.04)
    return normaliser(x, -17.0)


def consonne_s():
    n = int(DUREE_CONSONNE * SR)
    F = np.fft.rfftfreq(n, 1 / SR)
    gain_db = -((F - 6500) / 2200) ** 2 * 10                                  # bosse autour de 6,5 kHz
    gain_db += np.where(F < 3800, -60 * (np.clip(3800 - F, 0, None) / 3800) ** 0.6, 0)  # pas de grave
    gain_db += np.where(F > 10500, -(F - 10500) / 250, 0)                     # ni d'extrême aigu
    s = np.fft.irfft(np.fft.rfft(rng.standard_normal(n)) * 10 ** (gain_db / 20), n)
    t = np.arange(n) / SR
    s *= enveloppe(n, 0.07, 0.12) * (1 + 0.05 * np.sin(2 * np.pi * 3.1 * t))  # léger souffle vivant
    return normaliser(s, -23.0)          # un souffle aigu paraît plus fort : un peu plus bas que la voix


def resonance(f, Fr, B):
    return 1 / np.sqrt((1 - (f / Fr) ** 2) ** 2 + (f * B / Fr ** 2) ** 2)


def filtre_nasal(f):
    """Un formant fort vers 250 Hz, deux faibles vers 1100 et 2300 Hz, un creux vers 900 Hz."""
    h = resonance(f, 250, 70) + 0.18 * resonance(f, 1100, 160) + 0.08 * resonance(f, 2300, 220)
    creux = np.sqrt(((1 - (f / 900) ** 2) ** 2 + (f * 140 / 900 ** 2) ** 2))
    return h * np.minimum(creux, 1.0) / (1 + (f / 3500) ** 4)


def consonne_m():
    n = int(DUREE_CONSONNE * SR)
    t = np.arange(n) / SR
    f0 = 175 * (1 - 0.03 * t / DUREE_CONSONNE) * (1 + 0.008 * np.sin(2 * np.pi * 5.2 * t))  # vibrato léger
    f0 *= 1 + 0.002 * np.convolve(rng.standard_normal(n), np.ones(480) / 480, "same")    # petite irrégularité
    phase = 2 * np.pi * np.cumsum(f0) / SR
    m = np.zeros(n)
    for k in range(1, 40):              # synthèse additive : chaque harmonique passe par le « filtre nasal »
        if (k * f0).min() > 6000:
            break
        m += filtre_nasal(k * f0) / k ** 0.9 * np.sin(k * phase)
    souffle = np.fft.irfft(np.fft.rfft(rng.standard_normal(n)) * (np.fft.rfftfreq(n, 1 / SR) < 600), n)
    m += 0.02 * np.std(m) / np.std(souffle) * souffle
    m *= enveloppe(n, 0.05, 0.10)
    return normaliser(m, -17.0)


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for v in ("a", "i", "o", "u", "e-aigu", "e-grave"):
        ecrire(v, voyelle(v))
    ecrire("m", consonne_m())
    ecrire("s", consonne_s())
