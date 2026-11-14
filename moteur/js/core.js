/* L'Atelier de Boulon — noyau : état, sauvegarde, navigation, sons, voix, bulles. */
"use strict";

/* ------------------------------------------------------------------ */
/* Petits utilitaires                                                  */
/* ------------------------------------------------------------------ */
function h(tag, attrs, ...children) {
  const el = document.createElement(tag);
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === "class") el.className = v;
      else if (k === "style" && typeof v === "object") Object.assign(el.style, v);
      else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2), v);
      else if (k === "html") el.innerHTML = v;
      else el.setAttribute(k, v === true ? "" : v);
    }
  }
  for (const c of children.flat(Infinity)) {
    if (c == null || c === false) continue;
    el.appendChild(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return el;
}
/* une icône : un emoji (texte) ou un petit dessin SVG (ex. Art.sablier()) */
function icone(ic) {
  return /^\s*<svg/i.test(ic) ? h("span", { class: "icone-svg", html: ic }) : document.createTextNode(ic);
}
function svgEl(markup) {
  const m = markup.trim();
  const t = document.createElement("template");
  if (/^<svg/i.test(m)) { t.innerHTML = m; return t.content.firstElementChild; }
  // fragment SVG (<g>, <path>…) : il doit être analysé dans un <svg> pour avoir le bon espace de noms
  t.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg">${m}</svg>`;
  return t.content.firstElementChild.firstElementChild;
}
const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
const sample = (arr, n) => shuffle(arr).slice(0, n);
const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
function fmtNum(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }
function normalize(s) {
  return String(s).trim().toLowerCase()
    .replace(/[’`]/g, "'").replace(/\s+/g, " ")
    .replace(/\s*([,.;:!?])\s*$/, "");
}
function todayStr() {
  return new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

/* ------------------------------------------------------------------ */
/* Matières et leçons du niveau (remplies par les fichiers de contenu)  */
/* ------------------------------------------------------------------ */
/* haut-parleur dessiné du bouton « réécouter » */
const ICONE_REECOUTER = `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"></path><path d="M16.5 8.5a5 5 0 0 1 0 7"></path><path d="M19 6a8.5 8.5 0 0 1 0 12"></path></svg>`;

const CONTENT = {};    // id de matière → { id, name, chapters: [{ id, title, lessons: [...] }] }
const LESSONS = {};    // id de leçon → leçon

/* ------------------------------------------------------------------ */
/* Sauvegarde (localStorage, protégé : le jeu marche même sans)        */
/* ------------------------------------------------------------------ */
const Store = {
  KEY: NIVEAU.cle,                // une clé par niveau (fiche niveaux/<id>/niveau.js)
  data: null,
  blank() {
    return { users: [], currentUserId: null, settings: { voice: true, sound: true, music: true, recorded: true, voiceRate: 1, monnaie: "MAD" } };
  },
  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      const saved = raw ? JSON.parse(raw) : {};
      const base = this.blank();
      this.data = Object.assign(base, saved, { settings: Object.assign(base.settings, saved.settings || {}) });
    } catch (e) { this.data = this.blank(); }
    return this.data;
  },
  save() {
    try { localStorage.setItem(this.KEY, JSON.stringify(this.data)); } catch (e) { /* stockage indisponible */ }
  },
  get user() { return this.data.users.find((u) => u.id === this.data.currentUserId) || null; },
  addUser(name, avatar) {
    const u = {
      id: "u" + Date.now().toString(36) + rand(100, 999),
      name, avatar, created: todayStr(),
      lessons: {},        // id -> { best, last, tries, date, history: [notes] }
      defi: {},           // chapterId -> { wins, losses }
      unlocked: {},       // nom du jeu -> true
      orient: null,       // dernier test de niveau
      lastLesson: null,
      minutes: 0,
      aventure: { demarre: true },   // nouvel élève : rien à rattraper dans l'aventure
    };
    this.data.users.push(u);
    this.save();
    return u;
  },
  removeUser(id) {
    this.data.users = this.data.users.filter((u) => u.id !== id);
    if (this.data.currentUserId === id) this.data.currentUserId = null;
    this.save();
  },
  recordLesson(lessonId, note) {
    const u = this.user; if (!u) return;
    const r = u.lessons[lessonId] || { best: 0, last: 0, tries: 0, date: "", history: [], boite: 0 };
    const avant = r.best;
    r.tries += 1; r.last = note; r.best = Math.max(r.best, note); r.date = todayStr();
    r.history = (r.history || []).concat(note).slice(-10);
    if (typeof Revision !== "undefined") Revision.apresLecon(r, note);   // niveau de mémoire et date de révision
    u.lessons[lessonId] = r;
    u.lastLesson = lessonId;
    this.save();
    if (typeof Journal !== "undefined") Journal.noter(u, "lecon", lessonId, note);
    if (typeof Aventure !== "undefined") Aventure.apresLecon(lessonId, avant, note);   // écrous et médailles
  },
};

/* ------------------------------------------------------------------ */
/* Monnaie des exercices : dirham marocain (par défaut) ou euro         */
/* ------------------------------------------------------------------ */
const Money = {
  get code() { return (Store.data && Store.data.settings.monnaie) || "MAD"; },
  get isMAD() { return this.code === "MAD"; },
  sym() { return this.isMAD ? "DH" : "€"; },
  nom(n = 2) { return this.isMAD ? (n > 1 ? "dirhams" : "dirham") : (n > 1 ? "euros" : "euro"); },
  /* facteur de réalisme des prix : un livre coûte ~8 € mais ~80 DH */
  scale() { return this.isMAD ? 10 : 1; },
  /* montant entier : « 35 DH » */
  amount(n) { return `${fmtNum(n)} ${this.sym()}`; },
  /* montant en centimes : « 12,50 DH » */
  fmt(cents) {
    const u = Math.floor(cents / 100), c = cents % 100;
    return (c ? `${fmtNum(u)},${String(c).padStart(2, "0")}` : fmtNum(u)) + " " + this.sym();
  },
  billets() { return this.isMAD ? [200, 100, 50, 20] : [50, 20, 10, 5]; },
  pieces() { return this.isMAD ? [10, 5, 2, 1] : [2, 1]; },
};

/* ------------------------------------------------------------------ */
/* Sauvegarde des élèves dans un fichier (export / import)             */
/* ------------------------------------------------------------------ */
const Backup = {
  APP: "atelier-boulon-" + NIVEAU.id,   // une sauvegarde CE2 ne s'importe que dans le CE2
  /* télécharge un fichier .json avec tous les élèves (ou un seul) */
  exporter(userId = null) {
    const users = Store.data.users.filter((u) => !userId || u.id === userId);
    const data = { app: this.APP, format: 1, date: new Date().toISOString(), users, settings: Store.data.settings };
    const blob = new Blob([JSON.stringify(data, null, 1)], { type: "application/json" });
    const day = new Date().toISOString().slice(0, 10);
    const who = userId && users[0] ? "-" + users[0].name.normalize("NFD").replace(/[^\w-]+/g, "") : "";
    const a = h("a", { href: URL.createObjectURL(blob), download: `atelier-boulon-${NIVEAU.id}-sauvegarde${who}-${day}.json` });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    Store.data.lastBackup = todayStr(); Store.save();
    return users.length;
  },
  /* lit un fichier de sauvegarde ; renvoie { users, settings } ou lève une erreur lisible */
  async lire(file) {
    if (!file) throw new Error("Aucun fichier choisi.");
    if (file.size > 5 * 1024 * 1024) throw new Error("Ce fichier est trop gros pour être une sauvegarde du jeu.");
    let data;
    try { data = JSON.parse(await file.text()); } catch (e) { throw new Error("Ce fichier n'est pas une sauvegarde du jeu."); }
    if (!data || data.app !== this.APP || !Array.isArray(data.users)) throw new Error("Ce fichier n'est pas une sauvegarde de L'Atelier de Boulon.");
    const users = data.users.filter((u) => u && typeof u.name === "string" && u.name.trim()).map((u) => this.nettoyer(u));
    if (!users.length) throw new Error("Cette sauvegarde ne contient aucun élève.");
    return { users, settings: data.settings && typeof data.settings === "object" ? data.settings : null };
  },
  /* garde seulement des champs attendus, avec les bons types */
  nettoyer(u) {
    const obj = (v) => (v && typeof v === "object" && !Array.isArray(v) ? v : {});
    return {
      id: typeof u.id === "string" && u.id ? u.id : "u" + Date.now().toString(36) + rand(100, 999),
      name: String(u.name).trim().slice(0, 14),
      avatar: typeof u.avatar === "string" ? u.avatar.slice(0, 8) : "🦊",
      created: typeof u.created === "string" ? u.created : todayStr(),
      lessons: obj(u.lessons), defi: obj(u.defi), unlocked: obj(u.unlocked),
      orient: u.orient && typeof u.orient === "object" ? u.orient : null,
      lastLesson: typeof u.lastLesson === "string" ? u.lastLesson : null,
      minutes: Number(u.minutes) || 0,
      pieces: Number(u.pieces) || 0,
      bestCourse: Number(u.bestCourse) || 0, bestMemo: Number(u.bestMemo) || 0, bestConstruction: Number(u.bestConstruction) || 0,
      bestMemoImages: Number(u.bestMemoImages) || 0, bestNombres: Number(u.bestNombres) || 0,
      geo: u.geo && typeof u.geo === "object" ? { missions: obj(u.geo.missions), vus: obj(u.geo.vus) } : undefined,
      revisions: Number(u.revisions) || 0,
      aventure: typeof Aventure !== "undefined" ? Aventure.nettoyer(u.aventure) : undefined,
      objets: typeof Objets !== "undefined" ? Objets.nettoyer(u.objets) : undefined,
      jardin: typeof Jardin !== "undefined" ? Jardin.nettoyer(u.jardin) : undefined,
      construction: typeof Construction !== "undefined" ? Construction.nettoyer(u.construction) : undefined,
      chevalet: typeof Chevalet !== "undefined" ? Chevalet.nettoyer(u.chevalet) : undefined,
      inventions: typeof Inventions !== "undefined" ? Inventions.nettoyer(u.inventions) : undefined,
      robotique: typeof Robotique !== "undefined" ? Robotique.nettoyer(u.robotique) : undefined,
      journal: typeof Journal !== "undefined" ? Journal.nettoyer(u.journal) : undefined,
      sciences: u.sciences && typeof u.sciences === "object" && u.sciences.vus && typeof u.sciences.vus === "object"
        ? { vus: Object.fromEntries(Object.entries(u.sciences.vus).filter(([k]) => /^[a-z]{2,12}$/.test(k)).map(([k, v]) => [k, String(v).slice(0, 10)])) } : undefined,
      histoire: u.histoire && typeof u.histoire === "object" ? {
        vues: Object.fromEntries(Object.entries(u.histoire.vues || {}).filter(([k]) => /^[a-z0-9-]{2,24}$/.test(k)).map(([k, v]) => [k, String(v).slice(0, 10)])),
        mission: u.histoire.mission && typeof u.histoire.mission === "object"
          ? { best: Number(u.histoire.mission.best) || 0, stars: Math.min(3, Number(u.histoire.mission.stars) || 0), tries: Number(u.histoire.mission.tries) || 0, date: String(u.histoire.mission.date || "").slice(0, 10) } : undefined,
      } : undefined,
      /* questions ratées : seulement celles qui sont sûres à réafficher */
      erreurs: Array.isArray(u.erreurs) && typeof Revision !== "undefined"
        ? u.erreurs.filter((e) => Revision.valide(e) && typeof e.sig === "string").slice(-Revision.MAX_ERREURS)
          .map((e) => ({ sig: e.sig, l: e.l, q: e.q, fois: Number(e.fois) || 1, date: String(e.date || Revision.jour(0)), revoir: String(e.revoir || Revision.jour(0)) }))
        : [],
    };
  },
  /* ajoute les élèves ; un élève du même prénom (ou même identifiant) est remplacé */
  fusionner(users) {
    let ajoutes = 0, remplaces = 0;
    for (const u of users) {
      const i = Store.data.users.findIndex((x) => x.id === u.id || x.name.toLowerCase() === u.name.toLowerCase());
      if (i >= 0) { u.id = Store.data.users[i].id; Store.data.users[i] = u; remplaces++; }
      else { Store.data.users.push(u); ajoutes++; }
    }
    Store.save();
    return { ajoutes, remplaces };
  },
};

/* ------------------------------------------------------------------ */
/* Sons synthétisés (aucun fichier audio)                              */
/* ------------------------------------------------------------------ */
const Sound = {
  ctx: null,
  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  },
  tone(freq, dur = 0.12, type = "sine", vol = 0.18, when = 0, slide = 0) {
    if (!Store.data.settings.sound) return;
    const ctx = this.ensure(); if (!ctx) return;
    const t = ctx.currentTime + when;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(ctx.destination);
    o.start(t); o.stop(t + dur + 0.02);
  },
  click() { this.tone(660, 0.06, "triangle", 0.12); },
  hover() { this.tone(980, 0.04, "sine", 0.05); },
  good() { [523, 659, 784].forEach((f, i) => this.tone(f, 0.16, "triangle", 0.16, i * 0.08)); },
  bad() { this.tone(220, 0.22, "sawtooth", 0.08, 0, -80); this.tone(185, 0.28, "sawtooth", 0.06, 0.12, -60); },
  fanfare() { [523, 659, 784, 1046, 784, 1046].forEach((f, i) => this.tone(f, 0.2, "square", 0.08, i * 0.12)); },
  door() { this.tone(140, 0.3, "triangle", 0.2, 0, 60); this.tone(90, 0.4, "sine", 0.15, 0.15); },
  pop() { this.tone(400, 0.08, "sine", 0.15, 0, 500); },
};

/* ------------------------------------------------------------------ */
/* Voix (synthèse vocale Windows : Denise, Hortense…)                  */
/* ------------------------------------------------------------------ */
/* Les voix « naturelles » (neuronales) de Microsoft Edge sont de loin les plus humaines :
   Denise, Vivienne, Eloise (voix d'enfant), Henri, Rémy… Elles demandent Edge + Internet.
   Sans elles, on se rabat sur les voix installées dans Windows (Hortense, Julie, Paul). */
const Voice = {
  voices: [],
  voice: null,      // voix de Boulon
  voice2: null,     // voix de Zigzag (masculine si possible)
  _seq: 0,
  score(v) {
    const n = v.name;
    let s = 0;
    if (/fr-FR/i.test(v.lang)) s += 20; else if (/^fr/i.test(v.lang)) s += 5;
    if (/natural/i.test(n)) s += 100;
    if (/online/i.test(n)) s += 30;
    if (/Vivienne/i.test(n)) s += 17;
    if (/Denise/i.test(n)) s += 16;
    if (/Eloise/i.test(n)) s += 12;
    if (/Remy|Rémy/i.test(n)) s += 9;
    if (/Henri/i.test(n)) s += 8;
    if (/Google/i.test(n)) s += 25;
    if (/Julie/i.test(n)) s += 3;
    return s;
  },
  isNatural(v) { return !!v && /natural|google/i.test(v.name); },
  isMale(v) { return /Henri|Remy|Rémy|Paul|Antoine|Jean|Thierry|Gerard|Fabrice|Claude/i.test(v.name); },
  init() {
    // les sons et les lettres sont courts : on les charge d'avance, sinon le premier arrive avec du retard
    // et on rejoue ces mêmes lecteurs : un nouveau lecteur recharge le fichier, d'où un blanc avant la lettre
    if (typeof NIVEAU !== "undefined" && (NIVEAU.sons || NIVEAU.lettres || NIVEAU.mots))
      this._prets = new Map([NIVEAU.sons, NIVEAU.lettres, NIVEAU.mots].flatMap((o) => Object.values(o || {})).map((f) => { const a = new Audio(); a.preload = "auto"; a.src = f; return [f, a]; }));
    if (!("speechSynthesis" in window)) return;
    this.refresh();
    speechSynthesis.addEventListener?.("voiceschanged", () => this.refresh());
  },
  refresh() {
    this.voices = speechSynthesis.getVoices().filter((v) => /^fr/i.test(v.lang)).sort((a, b) => this.score(b) - this.score(a));
    const wanted = Store.data && Store.data.settings.voiceName;
    this.voice = this.voices.find((v) => v.name === wanted) || this.voices[0] || null;
    const males = this.voices.filter((v) => this.isMale(v) && v !== this.voice);
    this.voice2 = males[0] || this.voice;
  },
  /* rend le texte agréable à l'oreille */
  clean(text) {
    /* CP : « m + a → ma » se lit « m plus a, ça donne ma » (une vraie phrase, que l'enfant peut redire).
       Pas au CE2 : ses phrases enregistrées (audio/voix.js) sont rangées sous l'ancienne lecture. */
    if (typeof NIVEAU !== "undefined" && NIVEAU.toutEnVoix) {
      text = String(text).replace(/\s*\+\s*/g, " plus ").replace(/\s*→\s*/g, ", ça nous donne ").replace(/\s*=\s*/g, " égale ")
        .replace(/(\p{L})-(le|la|les)(?![\p{L}'’])/gu, "$1 $2");      // « écris-le » était lu « écrile »
      /* syllabes que la voix lit de travers (« fu » devient « fou ») : on lui fait dire un mot qui se prononce pareil */
      const seul = text.trim().replace(/[.!?…]+$/, "").toLowerCase();
      if (NIVEAU.prononcerSeul && Object.hasOwn(NIVEAU.prononcerSeul, seul)) text = NIVEAU.prononcerSeul[seul];
      for (const [ecrit, dit] of Object.entries(NIVEAU.prononcer || {}))
        text = text.replace(new RegExp(`(?<![\\p{L}'’-])${ecrit}(?![\\p{L}'’-])`, "giu"), dit);
    }
    return String(text)
      .replace(/<[^>]+>/g, " ")
      .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}️]/gu, "")
      .replace(/(\d)[\s  ](?=\d{3}\b)/g, "$1")
      .replace(/(\d)\s?DH\b/g, "$1 dirhams")
      .replace(/…+|\.\.\./g, ", ")
      .replace(/→/g, ", donne, ").replace(/≠/g, ", le contraire de, ")
      .replace(/×/g, " fois ").replace(/−/g, " moins ").replace(/÷/g, " divisé par ")
      .replace(/[«»"“”]/g, "").replace(/\s*\/\s*/g, ", ")
      .replace(/\s{2,}/g, " ").trim();
  },
  /* clé commune au jeu et au générateur de fichiers audio (outils-voix/generer_voix.py) */
  key(text) {
    return this.clean(text).normalize("NFC").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
  },
  /* fichier audio pré-enregistré (voix Chatterbox de Boulon) correspondant au texte, s'il existe */
  recorded(text, who) {
    if (who !== "boulon" || Store.data.settings.recorded === false) return null;
    const files = window.VOICE_FILES || {};
    return files[this.key(text)] || null;
  },
  /* La voix de synthèse dit mal une lettre ou un son tout seul (« mmm » devient « èm, èm, èm », « é » devient
     « hé »). Le niveau peut donc fournir de vrais enregistrements :
       NIVEAU.sons    : le SON (« a », « ou », « mmm », « pe »…), joué pour [p], « mmm », « le son « i » »,
                        ou un son dit tout seul (la dictée « Écoute le son » : « u ») ;
       NIVEAU.lettres : le NOM de la lettre (« pé », « èl »…), joué pour une lettre seule dans la phrase :
                        « La lettre p fait… », « l et a font la », « m + a → ma ».
       NIVEAU.mots    : un mot ou un nombre dit TOUT SEUL (« un », que la voix dit « hein ») ; dans une phrase,
                        la voix le garde.
     La phrase est coupée en morceaux : la voix dit le texte, le jeu joue l'enregistrement entre deux.
     Restent à la voix : « a » quand c'est le verbe (« Zigzag a gagné », « il y a »), « y », « à », et une lettre
     après un nombre (« 8 h », « 3 m »).
     Rend [{ texte }] ou [{ texte }, { son: fichier }, …] ; sans rien de reconnu, le texte d'origine tel quel. */
  morceaux(text) {
    const N = typeof NIVEAU !== "undefined" ? NIVEAU : {};
    if (!N.sons && !N.lettres && !N.mots) return [{ texte: text }];
    const sons = N.sons || {}, lettres = N.lettres || {}, mots = N.mots || {};
    const unSon = (x) => {
      x = x.trim().toLowerCase();
      if (/^(.)\1+$/u.test(x)) x = x[0];                  // « mmm » → m
      else if (/^chh+$/.test(x)) x = "ch";                // « chhh » → ch
      return sons[x] || null;
    };
    const brut = String(text).replace(/<[^>]+>/g, "");
    const seul = brut.trim().replace(/[.!?…]+$/, "");
    if (Object.hasOwn(mots, seul.toLowerCase())) return [{ son: mots[seul.toLowerCase()] }];   // « un » dit tout seul
    if (seul.length <= 4 && unSon(seul)) return [{ son: unSon(seul) }];
    /* une lettre seule : son nom (é, è : le son, c'est pareil) ; « a » seulement si c'est bien la lettre */
    const uneLettre = (l, i) => {
      l = l.toLowerCase();
      if (l === "y") return null;                         // « il y a », « tu y es »
      if (l === "a") {
        const avant = brut.slice(0, i).trimEnd(), apres = brut.slice(i + 1).trimStart();
        const lettre = /(?:\blettres?|\bet|[+,:«(])$/iu.test(avant) || /^(?:[,+→);.]|$|et\b|font\b)/u.test(apres);
        if (!lettre) return null;
      }
      return lettres[l] || sons[l] || null;
    };
    const parts = [];
    let debut = 0;
    const motif = /\[([^\]\s]{1,4})\]|«\s*([^»\s]{1,4})\s*»|(?<![\p{L}\p{N}'’-])(?<!\d[\s ])(\p{L})(?![\p{L}\p{N}'’-])/gu;
    for (const m of brut.matchAll(motif)) {
      const f = m[3] ? uneLettre(m[3], m.index) : unSon(m[1] || m[2]);
      if (!f) continue;
      parts.push({ texte: brut.slice(debut, m.index) }, { son: f });
      debut = m.index + m[0].length;
    }
    if (!parts.length) return [{ texte: text }];
    parts.push({ texte: brut.slice(debut) });
    // un morceau sans lettre est sauté, sauf « + » et « → » entre deux lettres (« m + a → ma » : « plus », « ça donne »)
    return parts.filter((p) => p.son || /[\p{L}\p{N}+→]/u.test(p.texte));
  },
  audio: null,
  speak(text, opts = {}) {
    if (!Store.data.settings.voice) { opts.onend && opts.onend(); return; }
    const seq = ++this._seq;
    if (this.audio) { this.audio.pause(); this.audio = null; }
    const parts = this.morceaux(text);
    if (parts.length === 1 && parts[0].texte != null) { this._dire(text, opts, seq); return; }
    // texte et sons à la suite ; interrompu par une autre phrase, on prévient une seule fois (comme la synthèse)
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    let k = 0, fini = false;
    const fin = () => { if (!fini) { fini = true; opts.onend && opts.onend(); } };
    const suite = () => {
      if (seq !== this._seq || k >= parts.length) { fin(); return; }
      const p = parts[k++];
      if (p.texte != null) { this._dire(p.texte, { ...opts, onend: suite }, seq); return; }
      setTimeout(() => this._son(p.son, seq, () => setTimeout(suite, 60)), 20);
    };
    suite();
  },
  /* joue un son tenu ; s'il manque, on passe simplement à la suite */
  _son(file, seq, next) {
    if (seq !== this._seq) return;
    const a = (this._prets && this._prets.get(file)) || new Audio(file);
    let fait = false;
    const apres = () => { if (fait) return; fait = true; if (a.onended === apres) a.onended = a.onerror = null; if (this.audio === a) this.audio = null; if (seq === this._seq) next(); };
    a.onended = apres;
    a.onerror = apres;
    a.currentTime = 0;
    this.audio = a;
    a.play().catch(apres);
  },
  /* une phrase (sans son tenu) : la voix enregistrée de Boulon si elle existe, sinon la synthèse */
  _dire(text, opts, seq) {
    const { rate, onend, who = "boulon" } = opts;
    if (seq !== this._seq) return;
    const file = this.recorded(text, who);
    if (file) {
      if ("speechSynthesis" in window) speechSynthesis.cancel();
      const a = new Audio(file);
      a.preservesPitch = true;
      a.playbackRate = Math.min(1.5, Math.max(0.6, (rate ? Math.min(1, rate + 0.1) : 1) * (Store.data.settings.voiceRate || 1)));
      let fell = false;
      const fallback = () => { if (fell || seq !== this._seq) return; fell = true; this.audio = null; this._synth(text, opts, seq); };
      a.onended = () => { if (this.audio === a) this.audio = null; onend && onend(); };
      a.onerror = fallback;
      this.audio = a;
      a.play().catch(fallback);
      return;
    }
    this._synth(text, opts, seq);
  },
  _synth(text, { rate, pitch, onend, who = "boulon" } = {}, seq) {
    if (!("speechSynthesis" in window)) { onend && onend(); return; }
    if (!this.voices.length) this.refresh();
    const busy = speechSynthesis.speaking || speechSynthesis.pending;
    if (busy) speechSynthesis.cancel();
    const say = () => {
      if (seq !== this._seq) return;      // une phrase plus récente a pris la place
      const v = who === "zigzag" ? this.voice2 : this.voice;
      const natural = this.isNatural(v);
      // le niveau peut ralentir la voix (CP : l'enfant apprend à lire, il faut le temps d'entendre chaque mot)
      const speed = (Store.data.settings.voiceRate || 1) * ((typeof NIVEAU !== "undefined" && NIVEAU.vitesseVoix) || 1);
      const u = new SpeechSynthesisUtterance(this.clean(text));
      u.lang = (v && v.lang) || "fr-FR";
      if (v) u.voice = v;
      // les voix naturelles sonnent mieux sans retouche de hauteur ; les voix classiques un peu plus vives
      u.rate = (rate || (natural ? 1.05 : 1.0)) * speed;
      u.pitch = pitch || (natural ? 1 : 1.12);
      if (who === "zigzag" && v === this.voice) u.pitch = natural ? 0.9 : 0.85;
      if (onend) { u.onend = onend; u.onerror = onend; }
      speechSynthesis.speak(u);
    };
    // annuler puis parler aussitôt fait bégayer Chrome/Edge : on laisse un court instant
    if (busy) setTimeout(say, 120); else say();
  },
  stop() {
    this._seq++;
    if (this.audio) { this.audio.pause(); this.audio = null; }
    if ("speechSynthesis" in window) speechSynthesis.cancel();
  },
};

/* ------------------------------------------------------------------ */
/* Messages d'encouragement (originaux)                                */
/* ------------------------------------------------------------------ */
const Messages = {
  good: [
    "Super boulot !", "Bien vissé !", "Exactement !", "Bravo, champion !",
    "Tu as tout compris !", "Ça tourne rond !", "Parfait, on continue !",
    "Quelle belle réponse !", "Mes voyants sont au vert !", "Génial !",
  ],
  retry: [
    "Presque ! Essaie encore une fois.", "Hum… regarde bien et recommence.",
    "Pas tout à fait. Tu as encore un essai !", "Mes engrenages hésitent… réessaie !",
    "Prends ton temps et relis la consigne.",
  ],
  wrong: [
    "Ce n'est pas grave, voici la bonne réponse.", "On apprend en se trompant ! Regarde la solution.",
    "Oups ! La réponse est affichée en vert.", "Ce n'était pas facile. Retiens bien la solution !",
    "Allez, la prochaine sera la bonne !",
  ],
  end: [
    [16, ["Formidable ! Tu es un vrai inventeur !", "Excellent travail, je suis fier de toi !"]],
    [12, ["C'est du bon travail ! Encore un petit effort pour les trois étoiles.", "Bien joué ! Tu progresses."]],
    [8, ["Pas mal ! Relis la leçon et réessaie.", "Tu y es presque, continue !"]],
    [0, ["Courage ! Relis la leçon avec moi, puis recommence.", "On va y arriver ensemble. Revois la leçon !"]],
  ],
  endFor(note) { return pick(this.end.find(([min]) => note >= min)[1]); },
};

/* ------------------------------------------------------------------ */
/* Application : écrans, mise à l'échelle, mascotte, bulles             */
/* ------------------------------------------------------------------ */
const App = {
  screens: {},
  current: null,
  params: null,
  stage: null,
  helpMode: false,
  _cleanup: [],

  register(name, fn) { this.screens[name] = fn; },

  start() {
    document.body.classList.add("niveau-" + NIVEAU.id);   // pour les styles propres à un niveau
    Store.load();
    Voice.init();
    this.stage = document.getElementById("stage");
    const fit = () => {
      const s = Math.min(window.innerWidth / 1024, window.innerHeight / 768) * 0.98;
      this.stage.style.transform = `scale(${s})`;
    };
    window.addEventListener("resize", fit); fit();
    document.addEventListener("pointerdown", () => Sound.ensure(), { once: true });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { const back = this.stage.querySelector(".icon-btn.back"); if (back) back.click(); }
    });
    this.go("exterieur");
  },

  onLeave(fn) { this._cleanup.push(fn); },

  go(name, params = {}) {
    Voice.stop();
    this._cleanup.splice(0).forEach((fn) => { try { fn(); } catch (e) { console.error(e); } });
    this.helpMode = false;
    this.stage.innerHTML = "";
    this.stage.classList.remove("help-mode");
    this.current = name; this.params = params;
    const screen = h("div", { class: "screen" });
    this.stage.appendChild(screen);
    const fn = this.screens[name];
    if (!fn) { screen.appendChild(h("p", null, "Écran inconnu : " + name)); return; }
    fn(screen, params);
  },

  /* bouton retour rond en bas à gauche */
  backButton(root, target, params) {
    root.appendChild(h("button", {
      class: "icon-btn back", title: "Retour (Échap)", "aria-label": "Retour",
      onclick: () => { Sound.click(); this.go(target, params); },
    }, "↩"));
  },

  /* mascotte Boulon + bulle */
  /* bulle : { x, y } place la bulle à un endroit fixe (sinon à côté de Boulon) */
  mascot(root, { x = 860, y = 580, text = null, speak = true, side = "left", bulle = null } = {}) {
    const wrap = h("div", { class: "mascot", style: { left: x + "px", top: y + "px" }, title: "Boulon" });
    wrap.appendChild(svgEl(Art.boulon()));
    root.appendChild(wrap);
    const api = {
      el: wrap, bubble: null,
      say: (t, opts = {}) => {
        if (api.bubble) api.bubble.remove();
        if (!t) return;
        api.dernier = t;
        const b = h("div", { class: "bubble " + (side === "left" ? "tail-right" : "tail-left") });
        b.innerHTML = t;
        /* tout en voix (CP) : un bouton pour réentendre la bulle */
        if (NIVEAU.toutEnVoix) {
          const texte = b.textContent;
          b.innerHTML = "";
          b.appendChild(h("span", { class: "texte", html: t }));
          b.classList.add("avec-reecoute");
          b.appendChild(h("button", { class: "reecouter", type: "button", title: "Réécouter", "aria-label": "Réécouter Boulon",
            onclick: (e) => { e.stopPropagation(); Sound.pop(); Voice.speak(texte); }, html: ICONE_REECOUTER }));
        }
        root.appendChild(b);
        const bw = Math.max(180, b.offsetWidth);
        /* bulle fixe : bulle.y (le haut) ou bulle.bas (le bas, elle grandit vers le haut) ; bulle.largeur : largeur maximale */
        if (bulle) {
          b.style.left = bulle.x + "px"; b.classList.add("fixe");
          if (bulle.largeur) b.style.maxWidth = bulle.largeur + "px";
          if (bulle.bas != null) b.style.bottom = bulle.bas + "px"; else b.style.top = bulle.y + "px";
        }
        else {
          if (side === "left") { b.style.left = Math.max(10, x - bw - 6) + "px"; }
          else { b.style.left = (x + 150) + "px"; }
          b.style.top = Math.max(10, y + 10 + (opts.dy || 0)) + "px";
        }
        api.bubble = b;
        if (speak && opts.speak !== false) {
          wrap.classList.add("talking");
          Voice.speak(b.textContent, { onend: () => wrap.classList.remove("talking") });
          setTimeout(() => wrap.classList.remove("talking"), Math.min(9000, 300 + b.textContent.length * 70));
        }
      },
      hide: () => { if (api.bubble) { api.bubble.remove(); api.bubble = null; } },
    };
    wrap.addEventListener("click", () => { Sound.pop(); if (api.bubble) api.say(api.dernier); });
    if (text) setTimeout(() => api.say(text), 250);
    return api;
  },

  /* info-bulle qui suit un élément de scène */
  tooltip(root) {
    const tip = h("div", { class: "tooltip hidden" });
    root.appendChild(tip);
    return {
      show: (html, x, y) => { tip.innerHTML = html; tip.style.left = x + "px"; tip.style.top = y + "px"; tip.classList.remove("hidden"); },
      hide: () => tip.classList.add("hidden"),
    };
  },

  /* coordonnées dans la scène (tient compte de la mise à l'échelle) */
  stagePoint(evt) {
    const r = this.stage.getBoundingClientRect();
    return { x: (evt.clientX - r.left) * (1024 / r.width), y: (evt.clientY - r.top) * (768 / r.height) };
  },

  modal(contentNode, { onClose } = {}) {
    const back = h("div", { class: "modal-back" });
    const box = h("div", { class: "panel modal" }, contentNode);
    back.appendChild(box);
    this.stage.appendChild(back);
    const close = () => { back.remove(); onClose && onClose(); };
    back.addEventListener("pointerdown", (e) => { if (e.target === back) close(); });
    return close;
  },

  confirm(question, onYes) {
    let close;
    const node = h("div", { class: "col", style: { alignItems: "center", textAlign: "center" } },
      h("p", { style: { fontSize: "24px", margin: "0" } }, question),
      h("div", { class: "row" },
        h("button", { class: "btn red", onclick: () => { close(); onYes(); } }, "Oui"),
        h("button", { class: "btn white", onclick: () => close() }, "Non")));
    close = this.modal(node);
  },

  confetti(n = 80) {
    const colors = ["#e4572e", "#f6c445", "#5bc0eb", "#7bc950", "#8e6cc9", "#ef7fa8"];
    for (let i = 0; i < n; i++) {
      const c = h("div", { class: "confetti" });
      c.style.left = rand(0, 1010) + "px";
      c.style.background = pick(colors);
      c.style.animationDuration = (1.6 + Math.random() * 1.8) + "s";
      c.style.animationDelay = (Math.random() * 0.6) + "s";
      this.stage.appendChild(c);
      setTimeout(() => c.remove(), 4200);
    }
  },

  /* fond décoratif commun aux écrans « dans l'atelier » */
  backdrop(root, kind = "wall") {
    root.appendChild(svgEl(Art.backdrop(kind)));
  },
};

/* minutes passées dans le jeu (pour le carnet) */
setInterval(() => {
  if (typeof Store !== "undefined" && Store.data && Store.user && document.visibilityState === "visible") {
    Store.user.minutes = (Store.user.minutes || 0) + 1;
    if (typeof Journal !== "undefined") Journal.minute(Store.user);   // temps du jour, pour l'espace parents
    Store.save();
    if (typeof Parents !== "undefined") Parents.surveiller(Store.user);
  }
}, 60000);
