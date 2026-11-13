/* L'Atelier de Boulon — sommaire, leçons, séries d'exercices, défi, test de niveau, carnet. */
"use strict";

function nextLessonFor(u, subjectId) {
  for (const ch of CONTENT[subjectId].chapters) for (const l of ch.lessons) if (!u.lessons[l.id] || u.lessons[l.id].best < 12) return l;
  return null;
}
function lessonAfter(lesson) {
  const subj = CONTENT[lesson.subject];
  const all = subj.chapters.flatMap((c) => c.lessons);
  return all[all.indexOf(lesson) + 1] || null;
}
/* texte lu à voix haute pour une leçon (le même sert à générer le fichier audio) */
function lessonSpeech(l) {
  const strip = (s) => String(s).replace(/<[^>]+>/g, "").replace(/&lt;/g, " plus petit que ").replace(/&gt;/g, " plus grand que ").replace(/&amp;/g, "et");
  return `${l.title}. ${l.lesson.rule.map(strip).join(" ")} Exemple : ${strip(l.lesson.ex)}`;
}
function pillFor(note) {
  if (note == null) return `<span class="pill none">—</span>`;
  if (NIVEAU.sansNote) return `<span class="pill etoiles">${starsHtml(starsFor(note))}</span>`;   // CP : des étoiles, pas de note
  const cls = note >= 14 ? "g" : note >= 10 ? "m" : "b";
  return `<span class="pill ${cls}">${note}/20</span>`;
}

/* ================================================================== */
/* Sommaire                                                            */
/* ================================================================== */
App.register("sommaire", (root, params) => {
  const u = Store.user; if (!u) return App.go("identif");
  let subjId = params.subject || App._lastSubject || Object.keys(CONTENT)[0];
  if (!CONTENT[subjId]) subjId = Object.keys(CONTENT)[0];
  App._lastSubject = subjId;
  const subj = CONTENT[subjId];
  App.backdrop(root);
  root.appendChild(h("div", { class: "screen-header", style: { justifyContent: "space-between", padding: "0 30px 0 100px" } },
    h("h2", { class: "title", style: { fontSize: "28px", whiteSpace: "nowrap" } }, "📒 Le cahier d'exercices"),
    h("div", { class: "tabs", style: { alignSelf: "flex-end" } },
      ...Object.values(CONTENT).map((s) => h("div", {
        class: `tab ${s.id} ${s.id === subjId ? "on" : ""}`, role: "button", tabindex: "0",
        onclick: () => { Sound.click(); App.go("sommaire", { subject: s.id }); },
      }, s.name)))));

  const area = h("div", { class: "panel abs", style: { left: "24px", right: "24px", top: "92px", bottom: "96px", padding: "14px", borderTopRightRadius: "0" } });
  root.appendChild(area);
  const next = nextLessonFor(u, subjId);
  /* les chapitres rangés par période (ch.periode, au CP) : un onglet par période, on ouvre celle de la leçon à faire */
  const periodes = [...new Set(subj.chapters.map((c) => c.periode).filter(Boolean))].sort((a, b) => a - b);
  let periode = null;
  if (periodes.length > 1) {
    App._periodes = App._periodes || {};
    periode = periodes.includes(params.periode) ? params.periode : periodes.includes(App._periodes[subjId]) ? App._periodes[subjId]
      : (next && next.chapter.periode) || periodes[periodes.length - 1];
    App._periodes[subjId] = periode;
    area.appendChild(h("div", { class: "periodes" }, ...periodes.map((p) => {
      const b = h("button", { class: "periode" + (p === periode ? " on" : ""), type: "button", onclick: () => { Sound.click(); App.go("sommaire", { subject: subjId, periode: p }); } }, "Période " + p);
      b.addEventListener("mouseenter", () => { Sound.hover(); if (NIVEAU.toutEnVoix) Voice.speak("Période " + p); });
      return b;
    })));
  }
  const grid = h("div", { class: "chapters" + (periode ? " avec-periodes" : "") });
  area.appendChild(grid);
  const aRevoir = Revision.aFaire(u);
  const dues = new Set(aRevoir.lecons.map((x) => x.id));
  subj.chapters.filter((ch) => !periode || ch.periode === periode).forEach((ch, ci) => {
    const list = h("ul", { class: "lesson-list" });
    ch.lessons.forEach((l) => {
      const r = u.lessons[l.id];
      const btn = h("button", { class: "lesson-btn" + (next === l ? " next" : ""), title: l.title });
      btn.append(l.title);
      const st = h("span", { class: "stars" }); st.innerHTML = starsHtml(starsFor(r ? r.best : 0)) + (r && !NIVEAU.sansNote ? ` <small>${r.best}/20</small>` : "")
        + (dues.has(l.id) ? ` <span class="due-tag" title="À réviser aujourd'hui">🔁</span>` : "");
      btn.appendChild(st);
      btn.addEventListener("click", () => { Sound.click(); App.go("lecon", { id: l.id }); });
      btn.addEventListener("mouseenter", () => Sound.hover());
      list.appendChild(h("li", null, btn));
    });
    grid.appendChild(h("div", { class: "chapter" },
      h("h3", { style: { background: ch.color } }, h("span", null, h("span", { class: "num" }, "Chapitre " + (ci + 1)), ch.title)),
      list));
  });

  App.backButton(root, "atelier");
  root.appendChild(h("button", { class: "btn violet abs rev-btn", style: { left: "110px", bottom: "20px" }, title: "Revoir les leçons au bon moment",
    onclick: () => { Sound.click(); App.go("revision", { from: "sommaire" }); } },
    "🔁 Réviser", aRevoir.total ? h("span", { class: "badge" }, String(aRevoir.total)) : null));
  if (next) {
    root.appendChild(h("button", { class: "btn green abs", style: { right: "30px", bottom: "20px" }, onclick: () => { Sound.click(); App.go("lecon", { id: next.id }); } }, "▶ Continuer : " + (next.title.length > 34 ? next.title.slice(0, 33) + "…" : next.title)));
  }
});

/* ================================================================== */
/* Leçon                                                               */
/* ================================================================== */
App.register("lecon", (root, params) => {
  const l = LESSONS[params.id]; if (!l) return App.go("sommaire");
  App.backdrop(root);
  const subj = CONTENT[l.subject];
  root.appendChild(h("div", { class: "screen-header" },
    h("h2", { class: "title", style: { fontSize: "30px" } }, `${subj.name} • ${l.chapter.title}`)));
  const card = h("div", { class: "panel paper-lines lesson-card" });
  card.innerHTML = `<h2>📖 ${escapeHtml(l.title)}</h2><div class="rule">${l.lesson.rule.map((p) => `<p>${p}</p>`).join("")}</div>
    <div class="ex"><b style="color:#2b2236">Exemple :</b> ${l.lesson.ex}</div>`;
  root.appendChild(card);
  /* schéma animé de la leçon, quand il existe */
  if (typeof ILLUSTRATIONS !== "undefined" && ILLUSTRATIONS[l.id]) {
    card.classList.add("avec-illu");
    const zone = h("div", { class: "illu" });
    card.appendChild(zone);
    const lecteur = monterIllustration(zone, l.id);
    App.onLeave(() => lecteur && lecteur.arreter());
  }
  const read = () => Voice.speak(lessonSpeech(l));
  root.appendChild(h("div", { class: "exo-actions" },
    h("button", { class: "btn sky", onclick: read }, "🔊 Écouter"),
    h("button", { class: "btn green", onclick: () => { Sound.click(); App.go("exo", { id: l.id }); } }, "✏ Faire les exercices")));
  App.backButton(root, "sommaire", { subject: l.subject });
});

/* ================================================================== */
/* Série d'exercices (commune aux leçons, au défi et au test)          */
/* ================================================================== */
/* joker (chapeau de magicien) : les boutons faux qu'on peut enlever pour une question à choix */
function choixFaux(q) {
  const idx = (n, bon) => Array.from({ length: n }, (_, i) => i).filter((i) => i !== bon);
  if (q.type === "qcm") return idx(q.choices.length, q.choices.findIndex((c) => normalize(c) === normalize(q.answer)));
  if (q.type === "img") return idx(q.choices.length, q.answer);
  if (q.type === "ecoute") return idx(q.choix.length, q.answer);
  if (q.type === "compter") return idx(q.choix.length, q.choix.indexOf(q.n));
  return [];
}
function runSession(root, { title, color = "#f6c445", questions, onFinish, backTo, backParams, rival, joker = false }) {
  App.backdrop(root);
  const top = h("div", { class: "exo-top" });
  const prog = h("div", { class: "exo-progress" });
  questions.forEach(() => prog.appendChild(h("span")));
  top.append(h("div", { class: "title", style: { fontSize: "24px", whiteSpace: "nowrap", maxWidth: "380px", overflow: "hidden", textOverflow: "ellipsis" } }, title), prog);
  root.appendChild(top);
  const panel = h("div", { class: "panel exo-box", style: { borderColor: "#2b2236", boxShadow: `0 10px 0 ${color}` } });
  root.appendChild(panel);
  const actions = h("div", { class: "exo-actions" });
  root.appendChild(actions);
  App.backButton(root, backTo, backParams);
  let fb = null;
  const results = [];
  let idx = 0, tries = 0, ctrl = null, done = false, jokerPris = false;

  function feedback(text, kind) {
    if (fb) fb.remove();
    fb = h("div", { class: "feedback " + kind }, "🤖 " + text);
    root.appendChild(fb);
    Voice.speak(text);
  }

  function show() {
    if (fb) { fb.remove(); fb = null; }
    const q = questions[idx];
    [...prog.children].forEach((s, i) => { s.classList.toggle("cur", i === idx); });
    panel.innerHTML = "";
    tries = 0; done = false;
    const speakBtn = h("button", { class: "btn round sky speak", title: "Écouter la consigne", "aria-label": "Écouter la consigne", onclick: () => Voice.speak(q.consigne) }, "🔊");
    panel.appendChild(h("div", { class: "consigne" }, speakBtn, h("span", null, q.consigne)));
    const body = h("div", { class: "exo-body" });
    panel.appendChild(body);
    ctrl = Exercise.mount(body, q, { submit });
    actions.innerHTML = "";
    if (joker && !jokerPris && choixFaux(q).length >= 2) actions.appendChild(h("button", { class: "btn violet", title: "Le chapeau de magicien enlève une mauvaise réponse (une fois par défi)",
      onclick: (e) => {
        const btns = body.querySelectorAll(".choices .choice"), faux = choixFaux(q);
        if (!btns.length) return;
        jokerPris = true; e.currentTarget.remove();
        const b = btns[pick(faux)]; if (b) { b.style.visibility = "hidden"; b.disabled = true; }
        Sound.pop(); Voice.speak("Abracadabra ! Une mauvaise réponse a disparu.");
      } }, "🎩 Joker"));
    if (ctrl && ctrl.needsValidate) actions.appendChild(h("button", { class: "btn green", onclick: submit }, "✔ Valider"));
    if (q.type !== "dictee" && !(ctrl && ctrl.voixPropre)) Voice.speak(q.consigne);   // certains types lisent eux-mêmes
  }

  function submit() {
    if (done || !ctrl) return;
    const res = ctrl.validate();
    if (res.empty) { feedback(res.msg || "Réponds d'abord !", "bad"); return; }
    if (res.ok) {
      Sound.good();
      finishQ(tries === 0 ? "ok" : "half");
      feedback(pick(Messages.good), "good");
    } else if (tries === 0) {
      tries = 1; Sound.bad();
      feedback(pick(Messages.retry), "bad");
      setTimeout(() => ctrl && !done && ctrl.reset(), 400);
    } else {
      Sound.bad();
      ctrl.reveal();
      finishQ("ko");
      feedback(pick(Messages.wrong), "bad");
    }
  }

  function finishQ(state) {
    done = true;
    ctrl.lock();
    results.push(state);
    prog.children[idx].classList.remove("cur");
    prog.children[idx].classList.add(state);
    actions.innerHTML = "";
    const last = idx === questions.length - 1;
    const nextBtn = h("button", { class: "btn", onclick: () => { Sound.click(); if (last) end(); else { idx++; show(); } } }, last ? (NIVEAU.sansNote ? "🏁 Voir mes étoiles" : "🏁 Voir ma note") : "Suivant ➜");
    actions.appendChild(nextBtn);
    setTimeout(() => nextBtn.focus(), 50);
  }

  function end() {
    const pts = results.reduce((s, r) => s + (r === "ok" ? 1 : r === "half" ? 0.5 : 0), 0);
    const note = Math.round((pts / questions.length) * 20);
    onFinish({ note, pts, results });
  }

  const keyH = (e) => {
    if (e.key === "Enter" && done) { const b = actions.querySelector("button"); if (b && document.activeElement !== b) { e.preventDefault(); b.click(); } }
  };
  document.addEventListener("keydown", keyH);
  App.onLeave(() => document.removeEventListener("keydown", keyH));
  show();
}

App.register("exo", (root, params) => {
  const l = LESSONS[params.id]; if (!l) return App.go("sommaire");
  const questions = shuffle(l.bank()).slice(0, NIVEAU.questionsParSeance || 8).map((q) => Object.assign({}, q, { _l: l.id }));
  runSession(root, {
    title: l.title, color: l.chapter.color, questions, backTo: "lecon", backParams: { id: l.id },
    onFinish: ({ note, results }) => { Store.recordLesson(l.id, note); Revision.noterErreurs(questions, results); App.go("resultat", { id: l.id, note }); },
  });
});

App.register("resultat", (root, params) => {
  const l = LESSONS[params.id], note = params.note, st = starsFor(note);
  const u = Store.user;
  App.backdrop(root);
  const box = h("div", { class: "panel result" });
  box.innerHTML = NIVEAU.sansNote
    ? `<h2 class="title dark" style="font-size:30px">${escapeHtml(l.title)}</h2>
    <div class="big-stars seules">${starsHtml(st)}</div>
    <p style="font-size:22px;margin:6px 0 0">Ton meilleur résultat : <span class="petites-etoiles">${starsHtml(starsFor(u.lessons[l.id].best))}</span></p>`
    : `<h2 class="title dark" style="font-size:30px">${escapeHtml(l.title)}</h2>
    <div class="note">${note}<span style="font-size:44px">/20</span></div>
    <div class="big-stars">${starsHtml(st)}</div>
    <p style="font-size:22px;margin:6px 0 0">Meilleure note : <b>${u.lessons[l.id].best}/20</b> • essai n° ${u.lessons[l.id].tries}</p>
    <p class="rev-memo">🧠 Mémoire ${Revision.memoire(u.lessons[l.id].boite)} • révision ${Revision.dateFr(u.lessons[l.id].revoir)}</p>`;
  root.appendChild(box);
  const nxt = lessonAfter(l);
  const row = h("div", { class: "row", style: { justifyContent: "center", marginTop: "18px", flexWrap: "wrap" } },
    h("button", { class: "btn sky", onclick: () => App.go("exo", { id: l.id }) }, "↻ Recommencer"),
    h("button", { class: "btn white", onclick: () => App.go("lecon", { id: l.id }) }, "📖 Revoir la leçon"),
    nxt ? h("button", { class: "btn green", onclick: () => App.go("lecon", { id: nxt.id }) }, "Leçon suivante ➜") : null);
  box.appendChild(row);
  App.backButton(root, "sommaire", { subject: l.subject });
  const m = App.mascot(root, { x: 860, y: 590 });
  setTimeout(() => m.say(Messages.endFor(note)), 300);
  if (st === 3) { Sound.fanfare(); App.confetti(); } else if (st >= 1) Sound.good();
});

/* ================================================================== */
/* Défi contre Zigzag                                                  */
/* ================================================================== */
App.register("defi", (root, params = {}) => {
  const u = Store.user; if (!u) return App.go("identif");
  App.backdrop(root, "board");
  root.appendChild(h("div", { class: "screen-header" }, h("h2", { class: "title" }, "🏆 Le défi de Zigzag")));
  const fox = h("div", { class: "mascot", style: { left: "40px", top: "120px", width: "190px", height: "200px" } });
  fox.appendChild(svgEl(Art.zigzag()));
  root.appendChild(fox);
  const intro = h("div", { class: "bubble tail-left", style: { left: "240px", top: "130px", maxWidth: "700px" } });
  const nq = NIVEAU.questionsDefi || 10;
  intro.innerHTML = `Je suis Zigzag, le renard le plus rusé du quartier ! Choisis un chapitre : ${nq} questions chacun. <b>Bats-moi</b> et tu gagneras une boîte de pièces pour l'atelier de construction !`;
  root.appendChild(intro);
  /* les chapitres rangés par période (ch.periode, au CP) : on montre une période à la fois */
  const toutes = Object.values(CONTENT).flatMap((s) => s.chapters);
  const periodes = [...new Set(toutes.map((c) => c.periode).filter(Boolean))].sort((a, b) => a - b);
  let periode = null;
  if (periodes.length > 1) {
    const faite = toutes.filter((c) => c.lessons.some((l) => u.lessons[l.id])).map((c) => c.periode || 1);
    periode = periodes.includes(params.periode) ? params.periode : periodes.includes(App._periodeDefi) ? App._periodeDefi : Math.max(periodes[0], ...faite);
    App._periodeDefi = periode;
    root.appendChild(h("div", { class: "abs periodes defi", style: { right: "40px", top: "284px" } }, ...periodes.map((p) => {
      const b = h("button", { class: "periode" + (p === periode ? " on" : ""), type: "button", onclick: () => { Sound.click(); App.go("defi", { periode: p }); } }, "Période " + p);
      b.addEventListener("mouseenter", () => { Sound.hover(); if (NIVEAU.toutEnVoix) Voice.speak("Période " + p); });
      return b;
    })));
  }
  const matieres = Object.values(CONTENT).filter((s) => !periode || s.chapters.some((c) => c.periode === periode));
  const area = h("div", { class: "abs", style: { left: "40px", right: "40px", top: "330px", bottom: "100px", display: "grid", gridTemplateColumns: `repeat(${matieres.length}, minmax(0, 1fr))`, gap: "14px" } });
  root.appendChild(area);
  matieres.forEach((s) => {
    const col = h("div", { class: "panel defi-col", style: { padding: "12px 16px" } }, h("h3", { class: "title dark", style: { fontSize: "24px", margin: "0 0 8px", color: s.color } }, s.name));
    s.chapters.filter((ch) => !periode || ch.periode === periode).forEach((ch) => {
      const rec = u.defi[ch.id] || { wins: 0, losses: 0 };
      const b = h("button", { class: "lesson-btn" + (ch.picto ? " avec-picto" : ""), style: { marginBottom: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }, onclick: () => { Sound.click(); App.go("defi-jeu", { chapter: ch.id }); } },
        ch.picto ? h("span", { class: "defi-picto", html: picto(ch.picto, 44) }) : null,
        h("span", null, ch.title), h("span", { style: { whiteSpace: "nowrap", fontSize: "12px", marginLeft: "6px" } }, `🏆 ${rec.wins} • 🦊 ${rec.losses}`));
      /* tout en voix (CP) : le chapitre se dit au survol */
      if (NIVEAU.toutEnVoix) b.addEventListener("mouseenter", () => Voice.speak(ch.title));
      col.appendChild(b);
    });
    area.appendChild(col);
  });
  App.backButton(root, "atelier");
  setTimeout(() => Voice.speak(intro.textContent, { who: "zigzag" }), 300);
});

function findChapter(id) { for (const s of Object.values(CONTENT)) for (const c of s.chapters) if (c.id === id) return c; return null; }

App.register("defi-jeu", (root, params) => {
  const ch = findChapter(params.chapter); if (!ch) return App.go("defi");
  const nq = NIVEAU.questionsDefi || 10;
  const pool = ch.lessons.flatMap((l) => shuffle(l.bank()).slice(0, Math.ceil((nq + 2) / ch.lessons.length)).map((q) => Object.assign({}, q, { _l: l.id })));
  const questions = shuffle(pool).slice(0, nq);
  const u = Store.user;
  runSession(root, {
    title: "Défi : " + ch.title, color: "#f08a3c", questions, backTo: "defi",
    joker: !!(u && (Aventure.etat(u).porte || {}).tete === "magicien"),
    onFinish: ({ pts, results }) => { Revision.noterErreurs(questions, results); App.go("defi-fin", { chapter: ch.id, pts }); },
  });
});

App.register("defi-fin", (root, params) => {
  const u = Store.user, ch = findChapter(params.chapter);
  const rec = u.defi[ch.id] || { wins: 0, losses: 0 };
  const level = Math.min(9, 6 + rec.wins);
  const nq = NIVEAU.questionsDefi || 10;   // le score de Zigzag suit le nombre de questions (sur 10 au CE2)
  const fox = Math.max(Math.round(3 * nq / 10), Math.min(nq, Math.round((level + rand(-1, 1)) * nq / 10)));
  const me = params.pts;
  const win = me > fox, tie = me === fox;
  if (win) rec.wins++; else if (!tie) rec.losses++;
  u.defi[ch.id] = rec;
  /* chaque victoire donne une boîte de pièces ; la première ouvre l'atelier de construction */
  let bonus = false, ouverture = false;
  if (win) { ouverture = !u.unlocked.construction; u.unlocked.construction = true; u.pieces = (u.pieces || 0) + 1; bonus = true; }
  Store.save();
  Journal.noter(u, "defi", ch.id, me * 2, win ? "gagné" : tie ? "égalité" : "perdu");
  Aventure.apresDefi(win);

  App.backdrop(root, "board");
  root.appendChild(h("div", { class: "screen-header" }, h("h2", { class: "title" }, "Résultat du défi")));
  const board = h("div", { class: "panel abs", style: { left: "160px", right: "160px", top: "96px", textAlign: "center", padding: "14px 26px" } });
  board.innerHTML = `<div class="row" style="justify-content:space-around;align-items:flex-end">
      <div><div style="font-size:90px">${u.avatar}</div><div class="title dark" style="font-size:26px">${escapeHtml(u.name)}</div><div class="note" style="font-family:var(--title-font);font-size:72px;font-weight:700">${me}</div></div>
      <div class="title dark" style="font-size:40px">contre</div>
      <div><div style="width:130px;height:140px;margin:auto">${Art.zigzag()}</div><div class="title dark" style="font-size:26px">Zigzag</div><div style="font-family:var(--title-font);font-size:72px;font-weight:700">${fox}</div></div>
    </div>
    <h3 class="title dark" style="font-size:32px;margin:10px 0">${win ? "🎉 Tu as gagné !" : tie ? "Égalité !" : "Zigzag a gagné cette fois…"}</h3>
    <p style="font-size:20px;margin:0">Victoires sur « ${escapeHtml(ch.title)} » : <b>${rec.wins}</b></p>
    ${ouverture ? `<p style="font-size:22px;color:#3fa34d;font-weight:700">🧱 L'atelier de construction est ouvert ! Et tu gagnes une boîte de pièces.</p>`
      : bonus ? `<p style="font-size:22px;color:#3fa34d;font-weight:700">🧱 Tu gagnes une boîte de pièces pour l'atelier de construction !</p>` : ""}`;
  root.appendChild(board);
  board.appendChild(h("div", { class: "row", style: { justifyContent: "center", marginTop: "14px" } },
    h("button", { class: "btn sky", onclick: () => App.go("defi-jeu", { chapter: ch.id }) }, "↻ Revanche"),
    h("button", { class: "btn white", onclick: () => App.go("defi") }, "Autre chapitre"),
    bonus ? h("button", { class: "btn green", onclick: () => App.go("atelier-construction") }, "🧱 Construire") : null));
  /* tout en images (CP) : le score en écrous, sans chiffres à lire */
  if (NIVEAU.toutEnVoix) board.querySelectorAll(".row > div").forEach((col, k) => {
    const n = k === 0 ? me : fox, score = col.lastElementChild;
    if (score && /^\d+(\.\d+)?$/.test(score.textContent.trim())) {   /* un demi-point (réussi au 2e essai) : un petit écrou */
      score.innerHTML = ("🔩".repeat(Math.floor(n)) + (n % 1 ? '<span class="demi">🔩</span>' : "")) || "·";
      score.classList.add("score-ecrous"); score.setAttribute("aria-label", `${n} points`);
    }
  });
  App.backButton(root, "defi");
  if (win) { Sound.fanfare(); App.confetti(); Voice.speak(ouverture ? "Bravo ! Tu as battu Zigzag : l'atelier de construction est ouvert !" : "Bravo ! Tu as battu Zigzag et tu gagnes une boîte de pièces !"); }
  else if (tie) Voice.speak("Égalité ! Essaie encore pour le battre.");
  else { Sound.bad(); Voice.speak("Zigzag a gagné cette fois. Revois les leçons et prends ta revanche !"); }
});

/* ================================================================== */
/* Test de niveau (la boussole)                                        */
/* ================================================================== */
App.register("orient", (root) => {
  const u = Store.user; if (!u) return App.go("identif");
  const items = [];
  [CONTENT.fr, CONTENT.math].forEach((s) => s.chapters.forEach((ch) => {
    const l = pick(ch.lessons);
    const q = Object.assign({}, pick(l.bank()), { _l: l.id });
    items.push({ q, lesson: l });
  }));
  const order = shuffle(items);
  runSession(root, {
    title: "🧭 Le test de la boussole", color: "#f6c445", questions: order.map((i) => i.q), backTo: "atelier",
    onFinish: ({ note, results }) => {
      const reco = order.filter((_, i) => results[i] !== "ok").map((i) => i.lesson.id);
      u.orient = { date: todayStr(), note, reco };
      Store.save();
      Revision.noterErreurs(order.map((i) => i.q), results);
      Journal.noter(u, "boussole", null, note);
      Aventure.evenement();
      App.go("orient-fin");
    },
  });
});

App.register("orient-fin", (root) => {
  const u = Store.user, o = u.orient;
  App.backdrop(root);
  root.appendChild(h("div", { class: "screen-header" }, h("h2", { class: "title" }, "🧭 Ce que te conseille la boussole")));
  const box = h("div", { class: "panel abs", style: { left: "80px", right: "80px", top: "110px", bottom: "110px", overflow: "auto" } });
  box.appendChild(h("p", { style: { fontSize: "26px", margin: "0 0 12px" } }, `Ta note au test : `, h("b", null, o.note + "/20")));
  if (!o.reco.length) box.appendChild(h("p", { style: { fontSize: "24px" } }, "Bravo, tout est juste ! Tu peux choisir n'importe quelle leçon, ou défier Zigzag."));
  else {
    box.appendChild(h("p", { style: { fontSize: "22px", margin: "0 0 10px" } }, "Je te conseille de travailler ces leçons :"));
    o.reco.forEach((id) => {
      const l = LESSONS[id];
      box.appendChild(h("button", { class: "lesson-btn", style: { fontSize: "20px", marginBottom: "8px", borderLeft: `10px solid ${l.chapter.color}` }, onclick: () => App.go("lecon", { id }) },
        `${CONTENT[l.subject].name} • ${l.chapter.title} — ${l.title}`));
    });
  }
  root.appendChild(box);
  App.backButton(root, "atelier");
  Voice.speak(o.reco.length ? `Ta note est de ${o.note} sur 20. Voici les leçons que je te conseille.` : "Bravo, tout est juste !");
});

/* ================================================================== */
/* Carnet de notes                                                     */
/* ================================================================== */
App.register("carnet", (root) => {
  const u = Store.user; if (!u) return App.go("identif");
  App.backdrop(root);
  root.appendChild(h("div", { class: "screen-header" }, h("h2", { class: "title" }, `📕 Le carnet de ${u.name}`)));
  const box = h("div", { class: "panel carnet" });
  const notes = Object.values(u.lessons).map((r) => r.best);
  const avg = notes.length ? (notes.reduce((a, b) => a + b, 0) / notes.length).toFixed(1).replace(".", ",") : "—";
  const wins = Object.values(u.defi).reduce((s, r) => s + r.wins, 0);
  let html = `<div class="row" style="justify-content:space-around;font-size:20px;margin-bottom:10px;flex-wrap:wrap">
    <span>${u.avatar} <b>${escapeHtml(u.name)}</b></span><span>Moyenne : <b>${avg}/20</b></span>
    <span>Leçons travaillées : <b>${notes.length}/${Object.keys(LESSONS).length}</b></span>
    <span class="star-on">★ ${totalStars(u)}</span><span>🏆 ${wins} défi${wins > 1 ? "s" : ""}</span><span>⏱ ${u.minutes || 0} min</span></div>`;
  const rev = Revision.aFaire(u);
  html += `<p style="font-size:18px;margin:0 0 10px;text-align:center">🔁 À réviser aujourd'hui : <b>${rev.lecons.length}</b> leçon${rev.lecons.length > 1 ? "s" : ""}
    et <b>${rev.erreurs.length}</b> question${rev.erreurs.length > 1 ? "s" : ""} ratée${rev.erreurs.length > 1 ? "s" : ""} • révisions faites : <b>${u.revisions || 0}</b></p>`;
  for (const s of Object.values(CONTENT)) {
    html += `<table><tr><th style="color:${s.color};font-size:22px">${s.name}</th><th class="n">Meilleure</th><th class="n">Dernière</th><th class="n">Essais</th><th class="n">Date</th><th class="n">Mémoire</th></tr>`;
    for (const ch of s.chapters) {
      html += `<tr class="chap"><td colspan="6"><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:${ch.color};border:2px solid #2b2236;vertical-align:middle"></span> ${escapeHtml(ch.title)}</td></tr>`;
      for (const l of ch.lessons) {
        const r = u.lessons[l.id];
        html += `<tr><td>${escapeHtml(l.title)} ${r ? starsHtml(starsFor(r.best)) : ""}</td><td class="n">${pillFor(r ? r.best : null)}</td><td class="n">${r ? r.last + "/20" : ""}</td><td class="n">${r ? r.tries : ""}</td><td class="n">${r ? r.date : ""}</td><td class="n mem">${r ? Revision.memoire(Revision.etat(r).boite) + `<small>${Revision.dateFr(r.revoir)}</small>` : ""}</td></tr>`;
      }
    }
    html += `</table><br>`;
  }
  if (typeof GEO_MISSIONS !== "undefined") {
    const g = u.geo || { missions: {}, vus: {} };
    html += `<table><tr><th style="color:#3fa34d;font-size:22px">Géographie</th><th class="n">Étoiles</th><th class="n">Meilleur</th><th class="n">Essais</th><th class="n">Date</th></tr>`;
    for (const m of GEO_MISSIONS) {
      const r = g.missions[m.id];
      html += `<tr><td>${m.icon} ${escapeHtml(m.titre)}</td><td class="n">${r ? starsHtml(r.stars) : `<span class="pill none">—</span>`}</td><td class="n">${r ? r.best + " pts" : ""}</td><td class="n">${r ? r.tries : ""}</td><td class="n">${r ? r.date : ""}</td></tr>`;
    }
    html += `<tr><td colspan="5">🗺️ Pays découverts sur la carte : <b>${Object.keys(g.vus).length}</b></td></tr></table><br>`;
  }
  if (u.orient) html += `<p>🧭 Dernier test de la boussole : ${u.orient.note}/20 (${u.orient.date})</p>`;
  box.innerHTML = html;
  root.appendChild(box);
  root.appendChild(h("div", { class: "exo-actions" }, h("button", { class: "btn white", onclick: () => window.print() }, "🖨 Imprimer")));
  App.backButton(root, "atelier");
});
