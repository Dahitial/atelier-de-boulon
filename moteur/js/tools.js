/* L'Atelier de Boulon — outils : calculatrice, conjugueur, horloge, globe, radio, micro (le chevalet est dans chevalet.js). */
"use strict";

function toolHeader(root, title) {
  App.backdrop(root);
  root.appendChild(h("div", { class: "screen-header" }, h("h2", { class: "title" }, title)));
  App.backButton(root, "atelier");
}

/* ================================================================== */
/* Calculatrice                                                        */
/* ================================================================== */
App.register("calculatrice", (root) => {
  toolHeader(root, "🧮 La calculatrice");
  const wrap = h("div", { class: "tool-wrap" });
  root.appendChild(wrap);
  const hist = h("small", null, "");
  const val = h("span", null, "0");
  const lcd = h("div", { class: "screen-lcd" }, hist, val);
  const keys = h("div", { class: "keys" });
  const calc = h("div", { class: "calc" }, lcd, keys);
  wrap.appendChild(calc);
  let cur = "0", acc = null, op = null, fresh = true;
  const OPS = { "+": (a, b) => a + b, "−": (a, b) => a - b, "×": (a, b) => a * b, "÷": (a, b) => (b === 0 ? NaN : a / b) };
  const fmt = (n) => {
    if (!isFinite(n)) return "Erreur";
    const r = Math.round(n * 1e6) / 1e6;
    const [i, d] = String(r).split(".");
    return fmtNum(i) + (d ? "," + d : "");
  };
  const parse = (s) => Number(s.replace(/\s/g, "").replace(",", "."));
  const show = () => { val.textContent = cur; hist.textContent = acc != null && op ? fmt(acc) + " " + op : ""; };
  const spoken = { "+": "plus", "−": "moins", "×": "fois", "÷": "divisé par" };
  const press = (k) => {
    Sound.click();
    if (/^\d$/.test(k)) { cur = fresh || cur === "0" ? k : (cur.replace(/\s/g, "").length < 12 ? cur + k : cur); fresh = false; if (!cur.includes(",")) cur = fmtNum(cur.replace(/\s/g, "")); }
    else if (k === ",") { if (fresh) { cur = "0,"; fresh = false; } else if (!cur.includes(",")) cur += ","; }
    else if (k === "C") { cur = "0"; acc = null; op = null; fresh = true; }
    else if (k === "⌫") { cur = cur.length > 1 && !fresh ? cur.slice(0, -1).trim() : "0"; if (!cur.includes(",") && cur !== "0") cur = fmtNum(cur.replace(/\s/g, "")); }
    else if (OPS[k]) {
      if (acc != null && op && !fresh) { acc = OPS[op](acc, parse(cur)); cur = fmt(acc); } else acc = parse(cur);
      op = k; fresh = true; Voice.speak(spoken[k]);
    } else if (k === "=") {
      if (acc != null && op) {
        const b = parse(cur), r = OPS[op](acc, b);
        Voice.speak(`${fmt(acc)} ${spoken[op]} ${fmt(b)} égale ${fmt(r)}`.replace(/ |\s(?=\d{3})/g, ""));
        hist.textContent = `${fmt(acc)} ${op} ${fmt(b)} =`;
        cur = fmt(r); acc = null; op = null; fresh = true; val.textContent = cur; return;
      }
    }
    show();
  };
  ["C", "⌫", "÷", "×", "7", "8", "9", "−", "4", "5", "6", "+", "1", "2", "3", "=", "0", ","].forEach((k) => {
    const cls = k === "=" ? "eq" : k === "C" ? "clr" : OPS[k] || k === "⌫" ? "op" : "";
    const b = h("button", { class: cls, onclick: () => press(k) }, k);
    if (k === "=") b.style.gridRow = "span 2";
    if (k === "0") b.style.gridColumn = "span 2";
    keys.appendChild(b);
  });
  const keyH = (e) => {
    const map = { "/": "÷", "*": "×", "-": "−", "+": "+", Enter: "=", "=": "=", Backspace: "⌫", Escape: null, Delete: "C", ".": ",", ",": "," };
    if (/^\d$/.test(e.key)) press(e.key);
    else if (map[e.key]) { e.preventDefault(); press(map[e.key]); }
  };
  document.addEventListener("keydown", keyH);
  App.onLeave(() => document.removeEventListener("keydown", keyH));
  const m = App.mascot(root, { x: 820, y: 560 });
  setTimeout(() => m.say("Tape ton calcul avec la souris ou le clavier. Je te lis le résultat !"), 300);
});

/* ================================================================== */
/* Conjugueur                                                          */
/* ================================================================== */
App.register("conjugueur", (root) => {
  toolHeader(root, "📚 Le livre des verbes");
  const verbs = [...Object.keys(Conj.irregular), ...Conj.group2, ...Conj.group1].filter((v, i, a) => a.indexOf(v) === i).sort((a, b) => a.localeCompare(b, "fr"));
  const selV = h("select", { class: "field", "aria-label": "Verbe" }, verbs.map((v) => h("option", { value: v }, v)));
  selV.value = "être";
  const selT = h("select", { class: "field", "aria-label": "Temps" },
    h("option", { value: "present" }, "Présent"), h("option", { value: "futur" }, "Futur"), h("option", { value: "imparfait" }, "Imparfait"));
  const info = h("div", { style: { fontSize: "20px", fontWeight: "700" } });
  const table = h("table", { class: "conj-table" });
  const panel = h("div", { class: "panel paper-lines", style: { width: "560px", minHeight: "420px" } },
    h("div", { class: "row", style: { marginBottom: "10px" } }, selV, selT), info, table);
  const wrap = h("div", { class: "tool-wrap" }, panel);
  root.appendChild(wrap);
  const draw = () => {
    const v = selV.value, t = selT.value, forms = Conj.tense(v, t);
    const g = Conj.groupOf(v);
    info.textContent = `${v} — ${g === 1 ? "1er groupe" : g === 2 ? "2e groupe" : "3e groupe"}`;
    table.innerHTML = "";
    forms.forEach((f, i) => {
      const pr = Conj.pronoun(i, f, true);
      const stemLen = (() => { const inf = v.replace(/(er|ir|re|oir)$/, ""); let k = 0; while (k < inf.length && f[k] === inf[k]) k++; return k; })();
      const td = h("td", { class: "t" }); td.innerHTML = escapeHtml(f.slice(0, stemLen)) + "<b>" + escapeHtml(f.slice(stemLen)) + "</b>";
      table.appendChild(h("tr", null, h("td", { class: "p" }, pr === "j'" ? "j'" : pr), td));
    });
  };
  selV.addEventListener("change", () => { Sound.click(); draw(); });
  selT.addEventListener("change", () => { Sound.click(); draw(); });
  draw();
  root.appendChild(h("div", { class: "exo-actions" }, h("button", {
    class: "btn sky", onclick: () => {
      const forms = Conj.tense(selV.value, selT.value);
      Voice.speak(forms.map((f, i) => Conj.withPronoun(i, f, false).replace(/^il /, "il ").replace(/^ils /, "ils ")).join(", "), { rate: 0.85 });
    },
  }, "🔊 Écouter")));
  const m = App.mascot(root, { x: 830, y: 560 });
  setTimeout(() => m.say("Choisis un verbe et un temps. La terminaison est en rouge !"), 300);
});

/* ================================================================== */
/* Horloge                                                             */
/* ================================================================== */
function heureEnMots(hh, mm) {
  const H = hh % 24;
  const hs = H === 0 ? "minuit" : H === 12 ? "midi" : `${numToFr(H).replace(/un$/, "une")} heure${H > 1 ? "s" : ""}`;
  return mm === 0 ? hs : `${hs} ${numToFr(mm)}`;
}
App.register("horloge", (root) => {
  toolHeader(root, "🕰 L'horloge");
  let hh = 10, mm = 10, target = null, score = 0, rounds = 0;
  const clockBox = h("div");
  const digital = h("div", { class: "title dark", style: { fontSize: "48px", textAlign: "center" } });
  const words = h("div", { style: { fontSize: "22px", textAlign: "center", minHeight: "30px" } });
  const mission = h("div", { style: { fontSize: "24px", fontWeight: "700", textAlign: "center", minHeight: "34px", color: "#e4572e" } });
  const btn = (label, fn) => h("button", { class: "btn small white", onclick: () => { Sound.click(); fn(); draw(); } }, label);
  const controls = h("div", { class: "col", style: { alignItems: "center" } },
    h("div", { class: "row" }, btn("− 1 h", () => (hh = (hh + 23) % 24)), btn("+ 1 h", () => (hh = (hh + 1) % 24))),
    h("div", { class: "row" }, btn("− 5 min", () => step(-5)), btn("+ 5 min", () => step(5))),
    h("div", { class: "row" }, btn("− 1 min", () => step(-1)), btn("+ 1 min", () => step(1))));
  function step(d) { let t = hh * 60 + mm + d; t = (t + 1440) % 1440; hh = Math.floor(t / 60); mm = t % 60; }
  const left = h("div", { class: "panel col", style: { alignItems: "center" } }, clockBox, digital, words);
  const right = h("div", { class: "panel col", style: { alignItems: "center", width: "380px" } },
    h("h3", { class: "title dark", style: { fontSize: "26px", margin: "0" } }, "Règle l'horloge"), controls, mission,
    h("div", { class: "row" },
      h("button", { class: "btn sky", onclick: () => Voice.speak("Il est " + heureEnMots(hh, mm)) }, "🔊 Dire l'heure"),
      h("button", { class: "btn violet", onclick: newMission }, "🎯 Mission")));
  root.appendChild(h("div", { class: "tool-wrap" }, left, right));
  const checkBtn = h("button", { class: "btn green hidden", onclick: check }, "✔ Vérifier");
  right.appendChild(checkBtn);
  function draw() {
    clockBox.innerHTML = Art.clockSvg(hh, mm, 340);
    digital.textContent = `${hh} h ${String(mm).padStart(2, "0")}`;
    words.textContent = "Il est " + heureEnMots(hh, mm) + (hh < 12 ? " (le matin)" : hh < 18 ? " (l'après-midi)" : " (le soir)");
  }
  function newMission() {
    target = { hh: rand(0, 23), mm: pick([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]) };
    mission.textContent = `Mets l'horloge à ${target.hh} h ${String(target.mm).padStart(2, "0")}`;
    checkBtn.classList.remove("hidden");
    Voice.speak("Mets l'horloge à " + heureEnMots(target.hh, target.mm));
  }
  function check() {
    if (!target) return;
    rounds++;
    if (target.hh === hh && target.mm === mm) { score++; Sound.good(); mission.textContent = `Bravo ! (${score}/${rounds})`; Voice.speak(pick(Messages.good)); target = null; checkBtn.classList.add("hidden"); }
    else { Sound.bad(); Voice.speak("Pas encore, regarde bien les aiguilles."); }
  }
  draw();
});

/* ================================================================== */
/* Radio : musiques et ambiances synthétisées                          */
/* ================================================================== */
const Radio = {
  timer: null, nodes: [], step: 0,
  stop() {
    clearInterval(this.timer); this.timer = null;
    this.nodes.forEach((n) => { try { n.stop ? n.stop() : n.disconnect(); } catch (e) { } });
    this.nodes = [];
  },
  midi(n) { return 440 * Math.pow(2, (n - 69) / 12); },
  note(ctx, freq, t, dur, type, vol) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + dur + 0.05);
  },
  playTrack(tr) {
    this.stop();
    const ctx = Sound.ensure(); if (!ctx) return;
    const stepDur = 60 / tr.bpm / 2;
    let next = ctx.currentTime + 0.1; this.step = 0;
    this.timer = setInterval(() => {
      while (next < ctx.currentTime + 0.3) {
        const i = this.step % tr.melody.length;
        const m = tr.melody[i]; if (m) this.note(ctx, this.midi(m), next, stepDur * 0.95, tr.wave, 0.09);
        const b = tr.bass[Math.floor(this.step / 2) % tr.bass.length]; if (b && this.step % 2 === 0) this.note(ctx, this.midi(b), next, stepDur * 1.8, "triangle", 0.12);
        if (tr.drum && this.step % 4 === 0) this.note(ctx, 60, next, 0.12, "sine", 0.25);
        if (tr.drum && this.step % 4 === 2) this.noise(ctx, next, 0.05, 0.08, 4000);
        next += stepDur; this.step++;
      }
    }, 60);
  },
  noise(ctx, t, dur, vol, freq = 1000, loop = false) {
    const len = Math.floor(ctx.sampleRate * (loop ? 2 : dur));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf; src.loop = loop;
    const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = freq;
    const g = ctx.createGain(); g.gain.value = vol;
    src.connect(f).connect(g).connect(ctx.destination);
    src.start(t); if (!loop) src.stop(t + dur);
    return { src, g, f };
  },
  playAmbiance(kind) {
    this.stop();
    const ctx = Sound.ensure(); if (!ctx) return;
    if (kind === "pluie") { const n = this.noise(ctx, ctx.currentTime, 0, 0.25, 2500, true); this.nodes.push(n.src); }
    if (kind === "vagues") {
      const n = this.noise(ctx, ctx.currentTime, 0, 0.0, 600, true); this.nodes.push(n.src);
      const lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = 0.12; lg.gain.value = 0.18;
      n.g.gain.value = 0.2; lfo.connect(lg).connect(n.g.gain); lfo.start(); this.nodes.push(lfo);
    }
    if (kind === "oiseaux") {
      this.timer = setInterval(() => {
        const t = ctx.currentTime, f = rand(2200, 4200);
        for (let i = 0; i < rand(2, 5); i++) { const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.setValueAtTime(f, t + i * 0.09); o.frequency.exponentialRampToValueAtTime(f * 1.4, t + i * 0.09 + 0.06); g.gain.setValueAtTime(0.0001, t + i * 0.09); g.gain.exponentialRampToValueAtTime(0.06, t + i * 0.09 + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.09 + 0.07); o.connect(g).connect(ctx.destination); o.start(t + i * 0.09); o.stop(t + i * 0.09 + 0.08); }
      }, 900);
    }
    if (kind === "robot") {
      this.timer = setInterval(() => { const t = ctx.currentTime; this.note(ctx, rand(200, 900), t, 0.08, "square", 0.05); this.note(ctx, rand(200, 900), t + 0.1, 0.08, "square", 0.04); }, 600);
    }
  },
};
const TRACKS = [
  { name: "🎹 Promenade au parc", bpm: 110, wave: "triangle", melody: [72, 0, 76, 0, 79, 76, 74, 0, 72, 74, 76, 0, 74, 72, 67, 0], bass: [48, 48, 55, 55, 53, 53, 55, 55], drum: false },
  { name: "🤖 La danse des robots", bpm: 128, wave: "square", melody: [60, 60, 67, 0, 65, 0, 63, 62, 60, 0, 67, 67, 70, 0, 67, 0], bass: [36, 36, 43, 43, 41, 41, 43, 43], drum: true },
  { name: "🌙 Berceuse des étoiles", bpm: 70, wave: "sine", melody: [76, 0, 79, 0, 84, 0, 83, 79, 76, 0, 74, 0, 72, 0, 0, 0], bass: [48, 52, 55, 52], drum: false },
  { name: "🏴‍☠️ Le galop du pirate", bpm: 150, wave: "sawtooth", melody: [69, 0, 69, 72, 74, 0, 74, 76, 77, 0, 76, 74, 72, 0, 69, 0], bass: [45, 45, 50, 50, 52, 52, 45, 45], drum: true },
  { name: "🎪 Le petit cirque", bpm: 140, wave: "square", melody: [67, 66, 67, 0, 72, 0, 67, 0, 69, 68, 69, 0, 74, 0, 69, 0], bass: [43, 50, 43, 50, 45, 52, 45, 52], drum: true },
  { name: "🌧 Jour de pluie", bpm: 90, wave: "triangle", melody: [69, 72, 76, 72, 69, 72, 76, 72, 67, 71, 74, 71, 67, 71, 74, 71], bass: [45, 45, 43, 43], drum: false },
];
const AMBIANCES = [["🌧 La pluie", "pluie"], ["🌊 Les vagues", "vagues"], ["🐦 Les oiseaux", "oiseaux"], ["🤖 Bip-bip robot", "robot"]];
App.register("radio", (root) => {
  toolHeader(root, "📻 La radio de Boulon");
  App.onLeave(() => Radio.stop());
  const list = h("div", { class: "radio-list" });
  const amb = h("div", { class: "radio-list" });
  const all = [];
  const mk = (label, fn) => {
    const t = h("div", { class: "track", role: "button", tabindex: "0" }, label);
    t.addEventListener("click", () => {
      const on = t.classList.contains("on");
      all.forEach((x) => x.classList.remove("on")); Radio.stop();
      if (!on) { t.classList.add("on"); fn(); }
    });
    all.push(t); return t;
  };
  TRACKS.forEach((tr) => list.appendChild(mk(tr.name, () => Radio.playTrack(tr))));
  AMBIANCES.forEach(([label, k]) => amb.appendChild(mk(label, () => Radio.playAmbiance(k))));
  root.appendChild(h("div", { class: "abs col", style: { left: "60px", right: "60px", top: "110px" } },
    h("div", { class: "panel col" }, h("h3", { class: "title dark", style: { margin: "0", fontSize: "26px" } }, "🎵 Musiques"), list),
    h("div", { class: "panel col" }, h("h3", { class: "title dark", style: { margin: "0", fontSize: "26px" } }, "🔊 Ambiances"), amb),
    h("button", { class: "btn red", style: { alignSelf: "center" }, onclick: () => { Radio.stop(); all.forEach((x) => x.classList.remove("on")); } }, "⏹ Arrêter")));
});

/* ================================================================== */
/* Micro : magnétophone                                                */
/* ================================================================== */
const READ_ALOUD = [
  "Le petit robot répare une horloge dans son atelier.",
  "Sous la pluie, les escargots sortent se promener.",
  "Mon chat dort au soleil sur le rebord de la fenêtre.",
  "Demain, nous irons voir les étoiles avec une lunette.",
  "La girafe mange les feuilles en haut de l'arbre.",
  "Le boulanger prépare des croissants chauds le matin.",
];
App.register("magneto", (root) => {
  toolHeader(root, "🎙 Le micro");
  const recs = [];
  let mr = null, stream = null, chunks = [];
  const sentence = h("div", { class: "prompt", style: { fontSize: "30px", fontWeight: "700", textAlign: "center" } }, pick(READ_ALOUD));
  const state = h("div", { style: { fontSize: "22px", minHeight: "32px", textAlign: "center" } }, "Appuie sur « Enregistrer » et lis la phrase à voix haute.");
  const list = h("div", { class: "col", style: { gap: "8px" } });
  const recBtn = h("button", { class: "btn red", onclick: toggle }, "⏺ Enregistrer");
  const panel = h("div", { class: "panel col", style: { width: "820px", alignItems: "center" } },
    h("h3", { class: "title dark", style: { margin: "0", fontSize: "26px" } }, "Lis cette phrase :"), sentence,
    h("div", { class: "row" }, recBtn,
      h("button", { class: "btn sky", onclick: () => Voice.speak(sentence.textContent) }, "🔊 Modèle"),
      h("button", { class: "btn white", onclick: () => { sentence.textContent = pick(READ_ALOUD.filter((s) => s !== sentence.textContent)); } }, "🔀 Autre phrase")),
    state, list);
  root.appendChild(h("div", { class: "tool-wrap" }, panel));
  App.onLeave(() => { try { mr && mr.state !== "inactive" && mr.stop(); } catch (e) { } stream && stream.getTracks().forEach((t) => t.stop()); recs.forEach((u) => URL.revokeObjectURL(u)); });
  async function toggle() {
    if (mr && mr.state === "recording") { mr.stop(); return; }
    if (!navigator.mediaDevices || !window.MediaRecorder) { state.textContent = "Ce navigateur ne permet pas d'enregistrer."; return; }
    try {
      stream = stream || await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) { state.textContent = "Je n'ai pas accès au micro. Autorise-le dans le navigateur."; return; }
    chunks = [];
    mr = new MediaRecorder(stream);
    mr.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    mr.onstop = () => {
      const url = URL.createObjectURL(new Blob(chunks, { type: mr.mimeType || "audio/webm" }));
      recs.push(url);
      const n = recs.length;
      list.prepend(h("div", { class: "row" }, h("b", null, `Enregistrement ${n}`), h("audio", { controls: true, src: url })));
      while (list.children.length > 4) list.lastChild.remove();
      recBtn.textContent = "⏺ Enregistrer"; state.textContent = "Écoute-toi ! Tu peux recommencer autant de fois que tu veux.";
      Sound.good();
    };
    mr.start();
    recBtn.textContent = "⏹ Arrêter";
    state.innerHTML = '<span class="rec-dot"></span> J\'enregistre… lis la phrase !';
  }
});

/* ================================================================== */
/* Peinture                                                            */
/* ================================================================== */
/* le chevalet est dans chevalet.js */
