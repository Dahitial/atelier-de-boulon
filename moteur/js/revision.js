/* L'Atelier de Boulon — révision adaptée.
   Chaque leçon a un « niveau de mémoire » de 0 à 5 et une date de révision :
   une réussite fait monter le niveau et repousse la révision (1, 2, 4, 8, 16 puis 32 jours),
   une erreur le fait redescendre et ramène la leçon plus tôt.
   Les questions ratées sont gardées et reposées telles quelles le lendemain. */
"use strict";

const Revision = {
  JOURS: [1, 2, 4, 8, 16, 32],     // délai avant la révision suivante, selon le niveau de mémoire
  MAX_ERREURS: 40,                 // questions ratées gardées par élève
  TAILLE: 10,                      // questions par révision
  MAX_QUESTIONS_RATEES: 4,         // questions ratées reposées par révision
  DANGER: /<\s*(script|iframe|object|embed|link|meta|style)\b|\son\w+\s*=|javascript:/i,

  /* ---------- dates (AAAA-MM-JJ, comparables comme du texte) ---------- */
  jour(decalage = 0) {
    const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + decalage);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  },
  dateFr(iso) {
    if (!iso) return "";
    if (iso <= this.jour(0)) return "aujourd'hui";        // en retard : à revoir dès maintenant
    if (iso === this.jour(1)) return "demain";
    const [y, m, d] = iso.split("-");
    return `le ${d}/${m}/${y}`;
  },

  /* ---------- niveau de mémoire d'une leçon ---------- */
  /* complète les profils créés avant la révision adaptée */
  etat(r) {
    if (!(typeof r.boite === "number" && r.boite >= 0 && r.boite <= 5)) {
      r.boite = r.best >= 16 ? 2 : r.best >= 12 ? 1 : 0;
      r.revoir = null;
    }
    r.boite = Math.round(r.boite);
    if (!/^\d{4}-\d\d-\d\d$/.test(r.revoir)) r.revoir = r.last < 14 ? this.jour(0) : this.jour(this.JOURS[r.boite]);
    return r;
  },
  /* taux de réussite entre 0 et 1 → monte, garde ou redescend */
  planifier(r, taux) {
    this.etat(r);
    if (taux >= 0.75) r.boite = Math.min(5, r.boite + 1);
    else if (taux >= 0.5) r.boite = Math.max(1, r.boite - 1);
    else r.boite = 0;
    r.revoir = this.jour(this.JOURS[r.boite]);
  },
  apresLecon(r, note) { this.planifier(r, note / 20); },

  /* barre de mémoire : 5 cases */
  memoire(boite, titre = true) {
    const b = Math.max(0, Math.min(5, boite || 0));
    const cases = Array.from({ length: 5 }, (_, i) => `<i class="${i < b ? "on" : ""}"></i>`).join("");
    return `<span class="memo memo-${b}"${titre ? ` title="Mémoire : ${b} sur 5"` : ""}>${cases}</span>`;
  },

  /* ---------- questions ratées ---------- */
  liste(u) { if (!Array.isArray(u.erreurs)) u.erreurs = []; return u.erreurs; },
  /* identifie une question par tout son contenu (sans nos marques _l et _err) */
  signature(q) {
    let t;
    try { t = JSON.stringify(q, (k, v) => (k === "_l" || k === "_err" ? undefined : v)); }
    catch (e) { t = String(q.type) + "|" + q.consigne; }
    let a = 0x811c9dc5, b = 0x01000193;                    // deux empreintes FNV : courtes à garder
    for (let i = 0; i < t.length; i++) { a = Math.imul(a ^ t.charCodeAt(i), 16777619); b = Math.imul(b ^ t.charCodeAt(i), 2246822519); }
    return (a >>> 0).toString(36) + (b >>> 0).toString(36) + "-" + t.length;
  },
  aFonction(v) {
    if (typeof v === "function") return true;
    if (v && typeof v === "object") return Object.values(v).some((x) => this.aFonction(x));
    return false;
  },
  /* copie sûre d'une question (sans fonction, pas trop grosse) ; null si impossible */
  copier(q) {
    if (this.aFonction(q)) return null;
    try {
      const texte = JSON.stringify(q);
      if (texte.length > 16000) return null;   // les figures dessinées en SVG prennent de la place
      const c = JSON.parse(texte);
      delete c._l; delete c._err;
      return c;
    } catch (e) { return null; }
  },
  /* une question gardée (ou importée d'une sauvegarde) est-elle utilisable ?
     Le niveau peut ajouter sa règle (questionEncoreValide, dans ses contenus) : une question gardée avant une
     correction du jeu (ex. « et » et « est » proposés ensemble, au CP) n'est alors plus reposée. */
  valide(e) {
    return e && typeof e === "object" && typeof e.l === "string" && LESSONS[e.l] && e.q && typeof e.q === "object"
      && Exercise.types[e.q.type] && typeof e.q.consigne === "string" && !this.DANGER.test(JSON.stringify(e.q))
      && (typeof questionEncoreValide !== "function" || questionEncoreValide(e.q) !== false);
  },
  /* garde les questions ratées (ou réussies au 2e essai) d'une série */
  noterErreurs(questions, results) {
    const u = Store.user; if (!u) return;
    const list = this.liste(u);
    questions.forEach((q, i) => {
      if (!q || !q._l || results[i] === "ok") return;
      const sig = this.signature(q);
      const old = list.find((e) => e.sig === sig);
      if (old) { old.fois++; old.date = this.jour(0); old.revoir = this.jour(1); return; }
      const c = this.copier(q);
      if (!c || this.DANGER.test(JSON.stringify(c))) return;
      list.push({ sig, l: q._l, q: c, fois: 1, date: this.jour(0), revoir: this.jour(1) });
    });
    if (list.length > this.MAX_ERREURS) list.splice(0, list.length - this.MAX_ERREURS);
    Store.save();
  },

  /* ---------- ce qui est à réviser ---------- */
  aFaire(u) {
    const auj = this.jour(0);
    const lecons = Object.entries(u.lessons || {}).filter(([id]) => LESSONS[id])
      .map(([id, r]) => ({ id, r: this.etat(r) }))
      .filter((x) => x.r.revoir <= auj)
      .sort((a, b) => a.r.boite - b.r.boite || a.r.revoir.localeCompare(b.r.revoir) || a.r.best - b.r.best);
    const erreurs = this.liste(u).filter((e) => this.valide(e) && e.revoir <= auj)
      .sort((a, b) => b.fois - a.fois || a.date.localeCompare(b.date));
    return { lecons, erreurs, total: lecons.length + erreurs.length };
  },
  /* leçons déjà travaillées, les plus fragiles d'abord */
  fragiles(u) {
    return Object.entries(u.lessons || {}).filter(([id]) => LESSONS[id])
      .map(([id, r]) => ({ id, r: this.etat(r) }))
      .sort((a, b) => a.r.boite - b.r.boite || a.r.best - b.r.best || a.r.revoir.localeCompare(b.r.revoir))
      .map((x) => x.id);
  },
  prochaine(u) {
    const dates = Object.entries(u.lessons || {}).filter(([id]) => LESSONS[id]).map(([, r]) => this.etat(r).revoir)
      .concat(this.liste(u).filter((e) => this.valide(e)).map((e) => e.revoir)).sort();
    return dates[0] || null;
  },

  /* ---------- une série de révision ---------- */
  construire(u) {
    const { lecons, erreurs } = this.aFaire(u);
    const vues = new Set(), qs = [];
    const ajoute = (q, l, extra) => {
      const s = this.signature(q);
      if (vues.has(s)) return false;
      vues.add(s);
      qs.push(Object.assign({}, q, { _l: l }, extra));
      return true;
    };
    erreurs.slice(0, this.MAX_QUESTIONS_RATEES).forEach((e) => ajoute(JSON.parse(JSON.stringify(e.q)), e.l, { _err: e.sig }));
    /* puis 2 questions neuves par leçon : celles à réviser, puis celles des erreurs, puis les plus fragiles */
    const ids = [...new Set([...lecons.map((x) => x.id), ...erreurs.map((e) => e.l), ...this.fragiles(u)])];
    const banques = new Map();
    for (let tour = 0; tour < 4 && qs.length < this.TAILLE; tour++) {
      for (const id of ids) {
        if (qs.length >= this.TAILLE) break;
        if (!banques.has(id)) banques.set(id, shuffle(LESSONS[id].bank()));
        const banque = banques.get(id);
        let pris = 0;
        while (pris < (tour === 0 ? 2 : 1) && qs.length < this.TAILLE && banque.length) if (ajoute(banque.shift(), id)) pris++;
      }
    }
    return shuffle(qs);
  },
  /* enregistre le résultat d'une révision ; renvoie le bilan */
  appliquer(questions, results) {
    const u = Store.user; if (!u) return { corrigees: 0, progres: [] };
    const list = this.liste(u);
    const parLecon = {}, nouvelles = [];
    let corrigees = 0;
    questions.forEach((q, i) => {
      const pts = results[i] === "ok" ? 1 : results[i] === "half" ? 0.5 : 0;
      (parLecon[q._l] = parLecon[q._l] || []).push(pts);
      if (q._err) {
        const e = list.find((x) => x.sig === q._err);
        if (!e) return;
        if (pts === 1) { list.splice(list.indexOf(e), 1); corrigees++; }
        else if (pts === 0.5) e.revoir = this.jour(2);
        else { e.fois++; e.revoir = this.jour(1); }
      } else if (pts < 1) nouvelles.push(i);
    });
    this.noterErreurs(nouvelles.map((i) => questions[i]), nouvelles.map((i) => results[i]));
    const progres = [];
    for (const [id, pts] of Object.entries(parLecon)) {
      const r = u.lessons[id];
      if (!r) continue;
      const avant = this.etat(r).boite;
      this.planifier(r, pts.reduce((a, b) => a + b, 0) / pts.length);
      r.revisions = (r.revisions || 0) + 1;
      progres.push({ id, avant, apres: r.boite, revoir: r.revoir });
    }
    u.revisions = (u.revisions || 0) + 1;
    Store.save();
    return { corrigees, progres };
  },
};

/* ================================================================== */
/* Écrans                                                              */
/* ================================================================== */
function revisionLigne(id, r, extra = "") {
  const l = LESSONS[id];
  return h("div", { class: "rev-ligne", style: { borderLeftColor: l.chapter.color } },
    h("span", { class: "rev-mat" }, CONTENT[l.subject].name),
    h("span", { class: "rev-titre" }, l.title),
    h("span", { html: Revision.memoire(r.boite) + extra }));
}

App.register("revision", (root, params) => {
  const u = Store.user; if (!u) return App.go("identif");
  App.backdrop(root);
  root.appendChild(h("div", { class: "screen-header" }, h("h2", { class: "title" }, "🔁 Mes révisions")));
  const box = h("div", { class: "panel abs rev-box" });
  root.appendChild(box);
  const { lecons, erreurs, total } = Revision.aFaire(u);
  const travaillees = Revision.fragiles(u).length;
  let dit;
  if (total) {
    box.appendChild(h("p", { class: "rev-intro" }, "Aujourd'hui, je te propose de revoir :"));
    if (erreurs.length) {
      box.appendChild(h("div", { class: "rev-ligne erreurs" },
        h("span", { class: "rev-mat" }, "📝 À corriger"),
        h("span", { class: "rev-titre" }, `${erreurs.length} question${erreurs.length > 1 ? "s" : ""} que tu avais ratée${erreurs.length > 1 ? "s" : ""}`),
        h("span", null, erreurs.length > Revision.MAX_QUESTIONS_RATEES ? `${Revision.MAX_QUESTIONS_RATEES} par révision` : "")));
    }
    lecons.slice(0, 7).forEach(({ id, r }) => box.appendChild(revisionLigne(id, r)));
    if (lecons.length > 7) box.appendChild(h("p", { class: "rev-plus" }, `… et ${lecons.length - 7} autre${lecons.length - 7 > 1 ? "s" : ""} leçon${lecons.length - 7 > 1 ? "s" : ""}, pour les prochaines révisions.`));
    box.appendChild(h("div", { class: "row", style: { justifyContent: "center", marginTop: "12px" } },
      h("button", { class: "btn green", onclick: () => { Sound.click(); App.go("revision-jeu", params); } }, `▶ Commencer la révision (${Revision.TAILLE} questions)`)));
    dit = "C'est l'heure de la révision ! On revoit ce qui était difficile, juste au bon moment.";
  } else if (travaillees) {
    const p = Revision.prochaine(u);
    box.appendChild(h("p", { class: "rev-intro" }, "🎉 Rien à réviser aujourd'hui ! Ta mémoire est en pleine forme."));
    if (p) box.appendChild(h("p", { style: { fontSize: "20px", textAlign: "center" } }, `Prochaine révision : ${Revision.dateFr(p)}.`));
    box.appendChild(h("div", { class: "row", style: { justifyContent: "center", marginTop: "12px" } },
      h("button", { class: "btn sky", onclick: () => { Sound.click(); App.go("revision-jeu", params); } }, "Réviser quand même mes leçons les plus fragiles")));
    dit = "Rien à réviser aujourd'hui ! Ta mémoire est en pleine forme.";
  } else {
    box.appendChild(h("p", { class: "rev-intro" }, "Fais d'abord quelques leçons dans le cahier. Je te proposerai ensuite de les réviser au bon moment."));
    box.appendChild(h("div", { class: "row", style: { justifyContent: "center", marginTop: "12px" } },
      h("button", { class: "btn green", onclick: () => { Sound.click(); App.go("sommaire"); } }, "📒 Ouvrir le cahier")));
    dit = "Fais d'abord quelques leçons dans le cahier. Je te proposerai ensuite de les réviser au bon moment.";
  }
  box.appendChild(h("p", { class: "rev-aide", html:
    `Chaque leçon a un <b>niveau de mémoire</b> ${Revision.memoire(3, false)} de 0 à 5. Quand tu réussis, il monte et la révision suivante arrive plus tard
     (1, 2, 4, 8, 16 puis 32 jours). Quand tu te trompes, il redescend et on revoit la leçon plus tôt. Les questions ratées reviennent le lendemain.` }));
  App.backButton(root, params.from || "atelier");
  /* Boulon parle sans bulle : le panneau dit déjà la même chose */
  const m = App.mascot(root, { x: 900, y: 610 });
  m.el.classList.add("talking");
  setTimeout(() => Voice.speak(dit, { onend: () => m.el.classList.remove("talking") }), 300);
  setTimeout(() => m.el.classList.remove("talking"), 6000);
});

App.register("revision-jeu", (root, params) => {
  const u = Store.user; if (!u) return App.go("identif");
  const questions = Revision.construire(u);
  if (!questions.length) return App.go("revision", params);
  runSession(root, {
    title: "🔁 Révision", color: "#8e6bd8", questions, backTo: "revision", backParams: params,
    onFinish: ({ note, results }) => {
      const bilan = Revision.appliquer(questions, results);
      Journal.noter(Store.user, "revision", null, note);
      App.go("revision-fin", Object.assign({ note }, bilan, { from: params.from }));
      Aventure.apresRevision(note, bilan.corrigees);
    },
  });
});

App.register("revision-fin", (root, params) => {
  const u = Store.user; if (!u) return App.go("identif");
  const st = starsFor(params.note);
  App.backdrop(root);
  const box = h("div", { class: "panel result rev-fin" });
  box.innerHTML = `<h2 class="title dark" style="font-size:30px">🔁 Révision terminée</h2>
    ${NIVEAU.sansNote ? "" : `<div class="note">${params.note}<span style="font-size:44px">/20</span></div>`}
    <div class="big-stars">${starsHtml(st)}</div>`;
  if (params.corrigees) box.appendChild(h("p", { class: "rev-corr" }, `✔ ${params.corrigees} erreur${params.corrigees > 1 ? "s" : ""} corrigée${params.corrigees > 1 ? "s" : ""} : elle${params.corrigees > 1 ? "s" : ""} ne reviendr${params.corrigees > 1 ? "ont" : "a"} plus !`));
  const liste = h("div", { class: "rev-progres" });
  params.progres.forEach((p) => {
    const fleche = p.apres > p.avant ? `<b class="up">⬆</b>` : p.apres < p.avant ? `<b class="down">⬇</b>` : `<b>＝</b>`;
    liste.appendChild(revisionLigne(p.id, { boite: p.apres }, ` ${fleche} <small>${Revision.dateFr(p.revoir)}</small>`));
  });
  box.appendChild(liste);
  const reste = Revision.aFaire(u).total;
  box.appendChild(h("div", { class: "row", style: { justifyContent: "center", marginTop: "14px", gap: "10px" } },
    reste ? h("button", { class: "btn green", onclick: () => App.go("revision-jeu", { from: params.from }) }, "↻ Encore une révision") : null,
    h("button", { class: "btn white", onclick: () => App.go("sommaire") }, "📒 Le cahier"),
    h("button", { class: "btn sky", onclick: () => App.go("atelier") }, "🏠 L'atelier")));
  root.appendChild(box);
  App.backButton(root, "revision", { from: params.from });
  const bravo = Messages.endFor(params.note);
  box.insertBefore(h("p", { class: "rev-bravo" }, "🤖 " + bravo), box.querySelector(".rev-progres"));
  const m = App.mascot(root, { x: 900, y: 610 });
  m.el.classList.add("talking");
  setTimeout(() => Voice.speak(bravo, { onend: () => m.el.classList.remove("talking") }), 300);
  setTimeout(() => m.el.classList.remove("talking"), 6000);
  if (st === 3) { Sound.fanfare(); App.confetti(); } else if (st >= 1) Sound.good();
});
