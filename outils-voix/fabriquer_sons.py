"""Fabrique les lettres et les sons du CP.

La voix de synthèse dit mal une lettre ou un son tout seul (« mmm » devient « èm, èm, èm », « é » devient
« hé »). Le jeu joue donc de vrais enregistrements :
- niveaux/cp/audio/lettres/<x>.ogg : le NOM des 26 lettres (« pé », « èl »…), voix de Sartus85 ;
- niveaux/cp/audio/sons/<son>.ogg  : le SON (« a », « ou », « mmm », « pe »…).

D'où viennent les sons (sons-sources/, détail dans sons-sources/CREDITS.txt) :
- voix/<son>.wav : un son enregistré avec l'enregistreur (enregistrer_sons.html) : il passe avant tout ;
- voyelles (a, i, o, u, é, è, e, ou, on, an) : Sartus85 (Lingua Libre, CC BY-SA 4.0), silence coupé, en
  gardant la fin du souffle (couper trop tôt donnait l'impression que la personne bloquait sa respiration) ;
- « mmm » et « sss » sans enregistrement : fabriqués par calcul.
Essais abandonnés, pour mémoire : prolonger les consonnes de Sartus85 (sons de robot), les découper dans le
nom des lettres (saccadé), les faire dire par Chatterbox (il invente : on dirait une autre langue).

Usage : .venv-chatterbox\\Scripts\\python.exe fabriquer_sons.py
"""
import os
import numpy as np
import soundfile as sf
from scipy.signal import resample_poly, butter, sosfiltfilt, bilinear, lfilter, stft, istft

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "sons-sources")
VOIX = os.path.join(SRC, "voix")
CP = os.path.normpath(os.path.join(HERE, "..", "niveaux", "cp", "audio"))
SR = 48000
rng = np.random.default_rng(7)

VOYELLES = {"a": "lettres/a", "i": "lettres/i", "o": "lettres/o", "u": "lettres/u", "e": "lettres/e",
            "e-aigu": "e-aigu", "e-grave": "e-grave", "ou": "ou", "on": "on", "an": "an"}
# volume PERÇU des sons enregistrés (dB, pondération A = sensibilité de l'oreille), le même pour tous :
# réglés sur le volume brut, ils étaient ~4 dB plus forts que les lettres de Sartus85 (médiane −23 dB A)
# et inégaux entre eux (mmm, nnn plus faibles que pe, an). −24 paraissait encore fort à l'écoute : −27.
# le nom de certaines lettres est pris dans un mot qui se dit pareil : dans « l (lettre) », le « è » est si
# court qu'on entend surtout « lll » ; le mot « elle » se dit exactement « èl » (choisi à l'écoute).
LETTRES_MOT = {"l": "elle"}
VOLUME_PERCU = -27.0
VOLUME_CALCULE = {"s": -23.0}  # le « sss » fabriqué par calcul garde son réglage validé à l'écoute
DUREE_MAX = 1.5               # un son enregistré trop long est raccourci (avec un fondu)


def lire(path):
    x, sr = sf.read(path, dtype="float64")
    if x.ndim > 1:
        x = x.mean(axis=1)
    if sr != SR:
        x = resample_poly(x, SR, sr)
    return x - np.mean(x)


def enveloppe(n, att, rel):
    e = np.ones(n)
    a, r = min(n, int(att * SR)), min(n, int(rel * SR))
    if a:
        e[:a] = np.sin(np.linspace(0, np.pi / 2, a)) ** 2
    if r:
        e[-r:] *= np.cos(np.linspace(0, np.pi / 2, r)) ** 2
    return e


def trames(x, w=0.01):
    n = int(w * SR)
    return np.array([np.sqrt(np.mean(x[i:i + n] ** 2)) for i in range(0, max(1, len(x) - n), n)]), n


def rms_actif(x):
    tr, _ = trames(x, 0.02)
    return np.sqrt(np.mean(tr[tr > tr.max() * 10 ** (-35 / 20)] ** 2)) + 1e-12


def normaliser(x, rms_db=-17.0, crete_max_db=-1.0):
    x = x * (10 ** (rms_db / 20) / rms_actif(x))
    c = np.max(np.abs(x))
    if c > 10 ** (crete_max_db / 20):
        x *= 10 ** (crete_max_db / 20) / c
    return x


def ponderation_a(x):
    """Filtre de pondération A : l'oreille entend mal les graves et très bien vers 2 à 5 kHz."""
    f1, f2, f3, f4 = 20.598997, 107.65265, 737.86223, 12194.217
    num = [(2 * np.pi * f4) ** 2 * 10 ** (1.9997 / 20), 0, 0, 0, 0]
    den = np.polymul([1, 4 * np.pi * f4, (2 * np.pi * f4) ** 2], [1, 4 * np.pi * f1, (2 * np.pi * f1) ** 2])
    den = np.polymul(np.polymul(den, [1, 2 * np.pi * f3]), [1, 2 * np.pi * f2])
    b, a = bilinear(num, den, SR)
    return lfilter(b, a, x)


def normaliser_percu(x, db_a, crete_max_db=-1.0):
    """Règle le volume tel que l'oreille le perçoit (et pas le volume brut)."""
    x = x * (10 ** (db_a / 20) / rms_actif(ponderation_a(x)))
    c = np.max(np.abs(x))
    if c > 10 ** (crete_max_db / 20):
        x *= 10 ** (crete_max_db / 20) / c
    return x


def rogner(x, seuil=0.06, avant=0.04, apres=0.08, fondu=0.04):
    tr, w = trames(x)
    actif = np.where(tr > tr.max() * seuil)[0]
    a = max(0, actif[0] * w - int(avant * SR))
    b = min(len(x), (actif[-1] + 1) * w + int(apres * SR))
    return x[a:b] * enveloppe(b - a, 0.01, fondu)


def rogner_doux(x):
    """Pour les sons : on garde la fin du souffle (jusqu'à −40 dB, puis 150 ms, fondu de 100 ms)."""
    return rogner(x, seuil=0.01, apres=0.15, fondu=0.10)


def debruiter(x, force=2.5, plancher=0.08):
    """Enlève le bruit CONSTANT de la pièce et de l'ordinateur : le bourdonnement électrique (50 Hz et tous
    ses multiples), le sifflement aigu de l'électronique (vers 8, 10 et 14 kHz), le souffle du micro.
    On mesure ce bruit dans les passages les plus calmes de l'enregistrement (avant et après le son), puis on
    le soustrait, fréquence par fréquence (fenêtres de 85 ms : assez fines pour séparer des notes espacées de
    50 Hz). La voix, qui change sans arrêt, est gardée. Le bruit n'est jamais baissé de plus de 22 dB
    (plancher), pour éviter les « gazouillis » d'une réduction trop forte."""
    n, hop = 4096, 1024
    _, _, X = stft(x, fs=SR, nperseg=n, noverlap=n - hop)
    P = np.abs(X) ** 2
    e = P.sum(axis=0)
    calme = e <= np.percentile(e, 20)
    if calme.sum() < 3:
        return x
    bruit = P[:, calme].mean(axis=1, keepdims=True)
    G = np.maximum(1 - force * bruit / (P + 1e-20), plancher)
    G = np.maximum(G, np.concatenate([G[:, :1], G[:, :-1]], axis=1) * 0.5 + G * 0.5)   # lissage dans le temps
    _, y = istft(X * G, fs=SR, nperseg=n, noverlap=n - hop)
    return y[:len(x)] if len(y) >= len(x) else np.pad(y, (0, len(x) - len(y)))


def traiter_enregistrement(x, son):
    """Un son enregistré au micro : bruit constant enlevé (voir debruiter), grondements très graves coupés
    (< 80 Hz : le 50 Hz du secteur, inaudible dans une voix), silence coupé avant et après (en gardant la fin
    du souffle), au plus 1,5 s, volume perçu égalisé. Rend le son prêt pour le jeu."""
    x = sosfiltfilt(butter(4, 80, "highpass", fs=SR, output="sos"), x - np.mean(x))
    x = debruiter(x)
    tr, w = trames(x)
    fond = np.percentile(tr, 10)                                 # le bruit de la pièce
    seuil = max(fond * 3, tr.max() * 0.03)
    actif = np.where(tr > seuil)[0]
    if not len(actif):
        raise ValueError("on n'entend rien : rapproche-toi du micro")
    a = max(0, actif[0] * w - int(0.03 * SR))
    b = min(len(x), (actif[-1] + 1) * w + int(0.12 * SR))
    x = x[a:b]
    if len(x) > DUREE_MAX * SR:
        x = x[:int(DUREE_MAX * SR)]
    x = x * enveloppe(len(x), 0.01, 0.10)
    return normaliser_percu(x, VOLUME_PERCU)


def ecrire_ogg(dossier, nom, x):
    os.makedirs(dossier, exist_ok=True)
    path = os.path.join(dossier, nom + ".ogg")
    # écriture par petits blocs : libsndfile (Vorbis) déborde sa pile sur les gros blocs
    # haute qualité (compression faible) : avec le réglage par défaut, les souffles aigus s'abîmaient
    with sf.SoundFile(path, "w", SR, 1, format="OGG", subtype="VORBIS", compression_level=0.1) as f:
        for k in range(0, len(x), 4096):
            f.write(x[k:k + 4096].astype(np.float32))
    return len(x) / SR


# ---- « mmm » et « sss » fabriqués par calcul (quand il n'y a pas d'enregistrement)
def consonne_s(duree=0.75):
    n = int(duree * SR)
    F = np.fft.rfftfreq(n, 1 / SR)
    gain_db = -((F - 6500) / 2200) ** 2 * 10                                  # bosse autour de 6,5 kHz
    gain_db += np.where(F < 3800, -60 * (np.clip(3800 - F, 0, None) / 3800) ** 0.6, 0)  # pas de grave
    gain_db += np.where(F > 10500, -(F - 10500) / 250, 0)                     # ni d'extrême aigu
    s = np.fft.irfft(np.fft.rfft(rng.standard_normal(n)) * 10 ** (gain_db / 20), n)
    t = np.arange(n) / SR
    s *= enveloppe(n, 0.07, 0.12) * (1 + 0.05 * np.sin(2 * np.pi * 3.1 * t))  # léger souffle vivant
    return normaliser(s, VOLUME_CALCULE["s"])


def resonance(f, Fr, B):
    return 1 / np.sqrt((1 - (f / Fr) ** 2) ** 2 + (f * B / Fr ** 2) ** 2)


def filtre_nasal(f):
    """Un formant fort vers 250 Hz, deux faibles vers 1100 et 2300 Hz, un creux vers 900 Hz."""
    h = resonance(f, 250, 70) + 0.18 * resonance(f, 1100, 160) + 0.08 * resonance(f, 2300, 220)
    creux = np.sqrt(((1 - (f / 900) ** 2) ** 2 + (f * 140 / 900 ** 2) ** 2))
    return h * np.minimum(creux, 1.0) / (1 + (f / 3500) ** 4)


def consonne_m(duree=0.75):
    n = int(duree * SR)
    t = np.arange(n) / SR
    f0 = 175 * (1 - 0.03 * t / duree) * (1 + 0.008 * np.sin(2 * np.pi * 5.2 * t))  # vibrato léger
    f0 *= 1 + 0.002 * np.convolve(rng.standard_normal(n), np.ones(480) / 480, "same")
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


def fabriquer():
    sons, lettres = os.path.join(CP, "sons"), os.path.join(CP, "lettres")
    faits = {}
    for x in "abcdefghijklmnopqrstuvwxyz":                      # le nom des lettres (Sartus85)
        src = os.path.join(SRC, LETTRES_MOT[x] + ".wav") if x in LETTRES_MOT else os.path.join(SRC, "lettres", x + ".wav")
        faits["lettre " + x] = ecrire_ogg(lettres, x, normaliser(rogner(lire(src))))
    for nom, src in VOYELLES.items():                           # les voyelles (Sartus85)
        faits[nom] = ecrire_ogg(sons, nom, normaliser(rogner_doux(lire(os.path.join(SRC, src + ".wav")))))
    faits["m"] = ecrire_ogg(sons, "m", consonne_m())            # par calcul, remplacés ci-dessous si enregistrés
    faits["s"] = ecrire_ogg(sons, "s", consonne_s())
    if os.path.isdir(VOIX):                                     # les sons enregistrés passent avant tout
        for f in sorted(os.listdir(VOIX)):
            if f.endswith(".wav"):
                nom = f[:-4]
                faits[nom + " (enregistré)"] = ecrire_ogg(sons, nom, traiter_enregistrement(lire(os.path.join(VOIX, f)), nom))
    return faits


if __name__ == "__main__":
    for nom, d in fabriquer().items():
        print(f"{nom} : {d:.2f} s")
