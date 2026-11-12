/* L'Atelier de Boulon — moteur d'exercices.
   Types : qcm, img, vf, saisie, trous, mots, ordre, dictee.
   Chaque type renvoie un contrôleur { needsValidate, validate(), reset(), reveal(), lock() }. */
"use strict";

const PUNCT = /^[.,;:!?…«»]+$/;

function cleanAnswer(s) {
  return normalize(String(s).replace(/\s*(€|euros?|dh|dhs|dirhams?|mad|g|kg|cm|mm|m|km|min)\s*$/i, ""));
}
function sameNumber(input, expected) {
  const v = String(input).replace(/\s/g, "").replace(",", ".").replace(/(€|euros?|dhs?|dirhams?|mad|g|kg|cm|mm|km|min|m)$/i, "");
  if (v === "" || isNaN(Number(v))) return false;
  return Math.abs(Number(v) - Number(String(expected).replace(",", "."))) < 1e-9;
}
function sameTime(input, expected) {
  const a = String(input).match(/(\d{1,2})\s*(?:h|:|H)\s*(\d{0,2})/);
  const b = String(expected).match(/(\d{1,2})\s*(?:h|:|H)\s*(\d{0,2})/);
  if (!a || !b) return false;
  return +a[1] === +b[1] && (+(a[2] || 0)) === (+(b[2] || 0));
}
function answerMatches(q, value) {
  const answers = Array.isArray(q.answer) ? q.answer : [q.answer];
  return answers.some((ans) => {
    if (q.numeric) return sameNumber(value, ans);
    if (q.timeAnswer) return sameTime(value, ans);
    if (q.caseSensitive) return String(value).trim().replace(/[.!?]$/, "") === String(ans).trim().replace(/[.!?]$/, "");
    return cleanAnswer(value) === cleanAnswer(ans);
  });
}
const firstAnswer = (q) => (Array.isArray(q.answer) ? q.answer[0] : q.answer);

/* Phrases à remettre en ordre : « Adam et Nora » vaut « Nora et Adam », « le chat et le chien »
   vaut « le chien et le chat ». On produit les ordres acceptés en échangeant les deux groupes
   autour de chaque « et » (prénom seul, ou déterminant + nom). La ponctuation reste à sa place. */
const DETERMINANTS = new Set(["le", "la", "les", "l'", "un", "une", "des", "mon", "ma", "mes", "ton", "ta", "tes", "son", "sa", "ses", "notre", "nos", "votre", "vos", "leur", "leurs", "ce", "cet", "cette", "ces"]);
function ordresAcceptes(words) {
  const ponct = words.map((w) => (w.match(/[.,;:!?…»]+$/) || [""])[0]);
  const nus = words.map((w, i) => w.slice(0, w.length - ponct[i].length));
  const majuscule = (w) => /^[A-ZÀ-ÖØ-Þ]/.test(w);
  const variantes = [words];
  nus.forEach((w, i) => {
    if (w !== "et" || i < 1 || i > nus.length - 2 || ponct[i - 1]) return;
    const gauche = i >= 2 && DETERMINANTS.has(nus[i - 2].toLowerCase()) && !ponct[i - 2] ? [i - 2, i - 1] : majuscule(nus[i - 1]) ? [i - 1] : null;
    const droite = i + 2 < nus.length && DETERMINANTS.has(nus[i + 1].toLowerCase()) && !ponct[i + 1] ? [i + 1, i + 2] : majuscule(nus[i + 1]) ? [i + 1] : null;
    if (!gauche || !droite || gauche.length !== droite.length) return;
    const v = [...nus];
    gauche.forEach((g, k) => { v[g] = nus[droite[k]]; v[droite[k]] = nus[g]; });
    variantes.push(v.map((x, k) => x + ponct[k]));
  });
  return variantes;
}
/* l'ordre construit est-il juste ? (sans tenir compte des majuscules, sauf pour le premier mot) */
function ordreJuste(construit, words) {
  if (/^[A-ZÀ-ÖØ-Þ]/.test(words[0]) && !/^[A-ZÀ-ÖØ-Þ]/.test(construit[0])) return construit.every((w, k) => w === words[k]);
  return ordresAcceptes(words).some((v) => construit.every((w, k) => w.toLowerCase() === v[k].toLowerCase()));
}

const Exercise = {
  mount(box, q, ctx) {
    const fn = this.types[q.type];
    if (!fn) { box.appendChild(h("p", null, "Type d'exercice inconnu : " + q.type)); return null; }
    return fn.call(this, box, q, ctx);
  },

  /* ---------- helpers ---------- */
  promptNode(q) {
    if (!q.prompt) return null;
    const p = h("div", { class: "prompt" });
    p.innerHTML = q.prompt;
    return p;
  },

  choiceButtons(box, q, ctx, labels, isRight) {
    const wrap = h("div", { class: "choices" });
    let locked = false;
    const btns = labels.map((lab, i) => {
      const b = h("button", { class: "choice" + (lab.img ? " img" : "") + (lab.cls ? " " + lab.cls : ""), type: "button" });
      if (lab.aria) b.setAttribute("aria-label", lab.aria);
      /* tout en voix (CP) : le nom de l'image est dit au survol, pour l'enfant qui ne lit pas encore */
      if (lab.dire && NIVEAU.toutEnVoix) b.addEventListener("mouseenter", () => { if (!locked) Voice.speak(lab.dire); });
      if (lab.svg) b.innerHTML = lab.svg;
      else if (lab.e) { b.append(lab.e); if (lab.label) b.append(h("small", null, lab.label)); }
      else b.innerHTML = lab.html != null ? lab.html : escapeHtml(lab.text);
      b.addEventListener("click", () => {
        if (locked || b.classList.contains("wrong")) return;
        Sound.click();
        btns.forEach((x) => x.classList.remove("sel"));
        b.classList.add("sel");
        ctrl.selected = i;
        ctx.submit();
      });
      b.addEventListener("mouseenter", () => !locked && Sound.hover());
      wrap.appendChild(b);
      return b;
    });
    box.appendChild(wrap);
    const ctrl = {
      needsValidate: false, selected: -1,
      validate() {
        if (ctrl.selected < 0) return { empty: true };
        const ok = isRight(ctrl.selected);
        btns[ctrl.selected].classList.remove("sel");
        btns[ctrl.selected].classList.add(ok ? "right" : "wrong");
        return { ok };
      },
      reset() { ctrl.selected = -1; },
      reveal() { btns.forEach((b, i) => { if (isRight(i)) b.classList.add("right"); }); },
      lock() { locked = true; },
      solutionText() { const i = btns.findIndex((_, k) => isRight(k)); return i >= 0 ? btns[i].textContent : ""; },
    };
    return ctrl;
  },

  types: {
    qcm(box, q, ctx) {
      const pn = this.promptNode(q); if (pn) box.appendChild(pn);
      const choices = q.choices.map((c) => ({ text: String(c) }));
      return this.choiceButtons(box, q, ctx, choices, (i) => normalize(q.choices[i]) === normalize(q.answer));
    },

    img(box, q, ctx) {
      const pn = this.promptNode(q); if (pn) box.appendChild(pn);
      const choices = q.choices.map((c) => Object.assign({ img: true }, c));
      return this.choiceButtons(box, q, ctx, choices, (i) => i === q.answer);
    },

    vf(box, q, ctx) {
      const pn = this.promptNode(q); if (pn) box.appendChild(pn);
      return this.choiceButtons(box, q, ctx, [{ text: "✔ Vrai" }, { text: "✘ Faux" }], (i) => (i === 0) === q.answer);
    },

    saisie(box, q, ctx) {
      const pn = this.promptNode(q); if (pn) box.appendChild(pn);
      const input = h("input", { class: "answer", type: "text", autocomplete: "off", spellcheck: "false", "aria-label": "Ta réponse" });
      if (q.width) input.style.width = q.width + "px";
      if (q.numeric) input.setAttribute("inputmode", "decimal");
      input.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); e.stopPropagation(); ctx.submit(); } });
      const row = h("div", { class: "row" }, input, q.unit ? h("span", { style: { fontSize: "30px", fontWeight: "700" } }, q.unit) : null);
      const sol = h("div", { class: "fill-text hidden" });
      box.append(row, sol);
      setTimeout(() => input.focus(), 60);
      return {
        needsValidate: true,
        validate() {
          if (!input.value.trim()) return { empty: true };
          const ok = answerMatches(q, input.value);
          input.classList.remove("right", "wrong"); void input.offsetWidth;
          input.classList.add(ok ? "right" : "wrong");
          return { ok };
        },
        reset() { input.select(); input.focus(); },
        reveal() {
          sol.classList.remove("hidden");
          sol.innerHTML = `La bonne réponse : <span class="sol" style="font-size:30px">${escapeHtml(q.numeric ? fmtNum(firstAnswer(q)) : firstAnswer(q))}${q.unit ? " " + q.unit : ""}</span>`;
        },
        lock() { input.disabled = true; },
        solutionText() { return String(firstAnswer(q)); },
      };
    },

    trous(box, q, ctx) {
      const pn = this.promptNode(q); if (pn) box.appendChild(pn);
      const div = h("div", { class: "fill-text" });
      const blanks = [];
      const parts = q.text.split(/(\[[^\]]+\])/);
      let html = "";
      parts.forEach((p) => {
        if (/^\[.+\]$/.test(p)) {
          const answers = p.slice(1, -1).split("|");
          const idx = blanks.length;
          blanks.push({ answers });
          const w = Math.max(90, Math.max(...answers.map((a) => a.length)) * 18 + 30);
          html += `<input class="answer inline" data-b="${idx}" style="width:${w}px" autocomplete="off" spellcheck="false" aria-label="mot manquant ${idx + 1}"><span class="sol hidden" data-s="${idx}"></span>`;
        } else html += p;
      });
      div.innerHTML = html;
      box.appendChild(div);
      blanks.forEach((b, i) => {
        b.input = div.querySelector(`[data-b="${i}"]`);
        b.sol = div.querySelector(`[data-s="${i}"]`);
        b.input.addEventListener("keydown", (e) => {
          if (e.key === "Enter") { e.preventDefault(); e.stopPropagation(); const nx = blanks[i + 1]; if (nx && !nx.input.value) nx.input.focus(); else ctx.submit(); }
        });
      });
      setTimeout(() => blanks[0] && blanks[0].input.focus(), 60);
      const check = (b) => b.answers.some((a) => cleanAnswer(a) === cleanAnswer(b.input.value));
      return {
        needsValidate: true,
        validate() {
          if (blanks.some((b) => !b.input.value.trim())) return { empty: true };
          let all = true;
          blanks.forEach((b) => {
            const ok = check(b);
            b.input.classList.remove("right", "wrong"); void b.input.offsetWidth;
            b.input.classList.add(ok ? "right" : "wrong");
            if (!ok) all = false;
          });
          return { ok: all };
        },
        reset() { const w = blanks.find((b) => !check(b)); if (w) { w.input.select(); w.input.focus(); } },
        reveal() { blanks.forEach((b) => { if (!check(b)) { b.sol.textContent = "→ " + b.answers[0]; b.sol.classList.remove("hidden"); } }); },
        lock() { blanks.forEach((b) => (b.input.disabled = true)); },
        solutionText() { return blanks.map((b) => b.answers[0]).join(", "); },
      };
    },

    mots(box, q, ctx) {
      const tokens = q.sentence.split(" ");
      const used = new Set();
      const answerIdx = new Set();
      q.answer.forEach((w) => {
        const i = tokens.findIndex((t, k) => t === w && !used.has(k));
        if (i >= 0) { used.add(i); answerIdx.add(i); }
      });
      const wrap = h("div", { class: "words" });
      const spans = tokens.map((t, i) => {
        if (PUNCT.test(t)) { const s = h("span", null, t); wrap.appendChild(s); return null; }
        const s = h("span", { class: "word", role: "button", tabindex: "0" }, t);
        const toggle = () => { if (locked) return; Sound.click(); s.classList.toggle("sel"); s.classList.remove("wrong"); };
        s.addEventListener("click", toggle);
        s.addEventListener("keydown", (e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); toggle(); } });
        wrap.appendChild(s);
        return s;
      });
      box.appendChild(wrap);
      let locked = false;
      const selected = () => spans.map((s, i) => (s && s.classList.contains("sel") ? i : -1)).filter((i) => i >= 0);
      return {
        needsValidate: true,
        validate() {
          const sel = selected();
          if (!sel.length) return { empty: true };
          const ok = sel.length === answerIdx.size && sel.every((i) => answerIdx.has(i));
          sel.forEach((i) => { if (!answerIdx.has(i)) { spans[i].classList.remove("sel"); spans[i].classList.add("wrong"); } });
          if (ok) sel.forEach((i) => { spans[i].classList.remove("sel"); spans[i].classList.add("right"); });
          return { ok };
        },
        reset() { spans.forEach((s) => s && s.classList.remove("wrong")); },
        reveal() {
          spans.forEach((s, i) => {
            if (!s) return;
            s.classList.remove("sel", "wrong");
            if (answerIdx.has(i)) s.classList.add("right");
          });
        },
        lock() { locked = true; },
        solutionText() { return [...answerIdx].map((i) => tokens[i]).join(" "); },
      };
    },

    ordre(box, q, ctx) {
      const joiner = q.joiner || " ";
      const line = h("div", { class: "answer-line" });
      const pool = h("div", { class: "words" });
      box.append(line, pool);
      let built = [];
      let locked = false;
      const order = shuffle(q.words.map((w, i) => i));
      if (order.every((v, i) => v === i) && order.length > 1) [order[0], order[1]] = [order[1], order[0]];
      const poolSpans = order.map((wi) => {
        const s = h("span", { class: "word", role: "button", tabindex: "0" }, q.words[wi]);
        const add = () => { if (locked || s.classList.contains("used")) return; Sound.click(); s.classList.add("used"); built.push({ wi, s }); draw(); };
        s.addEventListener("click", add);
        s.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); add(); } });
        pool.appendChild(s);
        return s;
      });
      function draw() {
        line.innerHTML = "";
        built.forEach((b, k) => {
          if (k && joiner.trim()) line.appendChild(h("span", { style: { opacity: ".6" } }, joiner.trim()));
          const s = h("span", { class: "word sel" }, q.words[b.wi]);
          s.addEventListener("click", () => {
            if (locked) return;
            Sound.click();
            built.splice(k, 1); b.s.classList.remove("used"); draw();
          });
          line.appendChild(s);
        });
      }
      return {
        needsValidate: true,
        validate() {
          if (built.length < q.words.length) return { empty: true, msg: "Utilise tous les mots !" };
          const ok = ordreJuste(built.map((b) => q.words[b.wi]), q.words);
          [...line.querySelectorAll(".word")].forEach((s) => { s.classList.remove("sel"); s.classList.add(ok ? "right" : "wrong"); });
          return { ok };
        },
        reset() { built = []; poolSpans.forEach((s) => s.classList.remove("used")); draw(); },
        reveal() {
          line.innerHTML = "";
          line.appendChild(h("span", { class: "word right" }, q.words.join(joiner)));
          poolSpans.forEach((s) => s.classList.add("used"));
        },
        lock() { locked = true; },
        solutionText() { return q.words.join(joiner); },
      };
    },

    dictee(box, q, ctx) {
      const say = () => Voice.speak(q.word, { rate: 0.8 });
      const ear = h("button", { class: "btn sky", type: "button", onclick: say }, "🔊 Écouter le mot");
      box.appendChild(ear);
      if (q.hint) { const hn = h("div", { class: "prompt" }); hn.innerHTML = q.hint; box.appendChild(hn); }
      const sub = { prompt: "", answer: [q.word] };
      const ctrl = this.types.saisie.call(this, box, sub, ctx);
      setTimeout(say, 700);
      return ctrl;
    },
  },
};
