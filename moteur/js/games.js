/* L'Atelier de Boulon — la borne de jeux : course aux tables, mémos, course aux nombres (la construction est dans construction.js). */
"use strict";

/* Les jeux de la borne. Un niveau choisit les siens avec NIVEAU.jeuxBorne
   (par défaut : la course aux tables, le mémo et la construction). */
const JEUX_BORNE = {
  course: { icone: "🚀", titre: "La course aux tables", desc: "Combien de multiplications en 60 secondes ?", ecran: "course",
    extra: (u) => (u.bestCourse ? `Record : ${u.bestCourse}` : null) },
  memo: { icone: "🃏", titre: "Le mémo", desc: "Retrouve les paires de cartes qui vont ensemble.", ecran: "memo",
    extra: (u) => (u.bestMemo ? `Record : ${u.bestMemo} coups` : null) },
  "memo-images": { icone: "🃏", titre: "Le mémo en images", desc: "Retrouve les paires d'images pareilles.", ecran: "memo-images",
    extra: (u) => (u.bestMemoImages ? `Record : ${u.bestMemoImages} coups` : null) },
  "course-nombres": { icone: "🚀", titre: "La course aux nombres", desc: "Compte vite et clique sur le bon nombre !", ecran: "course-nombres",
    extra: (u) => (u.bestNombres ? `Record : ${u.bestNombres}` : null) },
  construction: { icone: "🧱", titre: "L'atelier de construction", desc: "Des jeux pour construire et relever des défis !", ecran: "atelier-construction",
    ferme: (u) => !u.unlocked.construction,
    condition: () => (NIVEAU.constructionEtoiles ? `Gagne ${NIVEAU.constructionEtoiles} étoiles` : "Bats Zigzag au défi"),
    fermeVoix: () => (NIVEAU.constructionEtoiles ? `Ce jeu est fermé. Gagne ${NIVEAU.constructionEtoiles} étoiles pour l'ouvrir !`
      : "L'atelier de construction est fermé. Bats Zigzag au défi pour l'ouvrir !"),
    extra: (u) => (u.unlocked.construction ? `Boîtes de pièces : ${u.pieces || 1}` : null) },
};

App.register("jeux", (root) => {
  const u = Store.user; if (!u) return App.go("identif");
  /* au CP (pas encore de défi) : la construction s'ouvre avec les étoiles */
  if (NIVEAU.constructionEtoiles && !u.unlocked.construction && totalStars(u) >= NIVEAU.constructionEtoiles) {
    u.unlocked.construction = true; u.pieces = Math.max(1, u.pieces || 0); Store.save();
  }
  App.backdrop(root);
  root.appendChild(h("div", { class: "screen-header" }, h("h2", { class: "title" }, "🕹 La borne de jeux")));
  const cards = h("div", { class: "game-cards abs", style: { left: "60px", right: "60px", top: "140px" } });
  const ids = NIVEAU.jeuxBorne || ["course", "memo", "construction"];
  ids.map((id) => JEUX_BORNE[id]).filter(Boolean).forEach((j) => {
    const locked = j.ferme ? j.ferme(u) : false;
    const extra = locked ? j.condition() : j.extra(u);
    const c = h("div", { class: "panel game-card" + (locked ? " locked" : ""), role: "button", tabindex: "0" },
      h("div", { class: "gi" }, locked ? "🔒" : j.icone), h("h3", null, j.titre), h("p", { style: { fontSize: "18px", margin: "0" } }, j.desc),
      extra ? h("p", { style: { fontSize: "16px", fontWeight: "700", margin: "8px 0 0" } }, extra) : null);
    const ouvrir = () => {
      if (locked) { Sound.bad(); Voice.speak(j.fermeVoix ? j.fermeVoix() : `Ce jeu est fermé. ${j.condition()} pour l'ouvrir !`); return; }
      Sound.click(); App.go(j.ecran);
    };
    c.addEventListener("click", ouvrir);
    c.addEventListener("keydown", (e) => { if (e.key === "Enter") ouvrir(); });
    /* tout en voix (CP) : le jeu se présente au survol */
    if (NIVEAU.toutEnVoix) c.addEventListener("mouseenter", () => Voice.speak(`${j.titre}. ${j.desc}` + (locked ? ` ${j.condition()} pour l'ouvrir.` : "")));
    cards.appendChild(c);
  });
  root.appendChild(cards);
  App.backButton(root, "atelier");
  const m = App.mascot(root, { x: 850, y: 580 });
  const cons = !ids.includes("construction") ? ""
    : !NIVEAU.constructionEtoiles ? (u.unlocked.construction ? "" : " L'atelier de construction s'ouvre quand tu bats Zigzag.")
    : !u.unlocked.construction ? ` Le jeu de construction s'ouvre quand tu as ${NIVEAU.constructionEtoiles} étoiles.` : "";
  setTimeout(() => m.say("Choisis un jeu !" + cons), 300);
});

/* ---------------- Course aux tables ---------------- */
App.register("course", (root) => {
  const u = Store.user;
  App.backdrop(root);
  root.appendChild(h("div", { class: "screen-header" }, h("h2", { class: "title" }, "🚀 La course aux tables")));
  const timeEl = h("div", { class: "title", style: { fontSize: "40px" } }, "60");
  const scoreEl = h("div", { class: "title", style: { fontSize: "40px", color: "#f6c445" } }, "0");
  const qEl = h("div", { class: "prompt big", style: { fontSize: "64px", fontWeight: "700" } }, "Prêt ?");
  const input = h("input", { class: "answer", inputmode: "numeric", autocomplete: "off", "aria-label": "Résultat", disabled: true });
  const track = h("div", { style: { position: "relative", width: "120px", height: "520px", background: "linear-gradient(#1b1724,#2e86de)", border: "4px solid #2b2236", borderRadius: "20px", overflow: "hidden" } });
  const rocket = h("div", { style: { position: "absolute", left: "30px", bottom: "8px", fontSize: "56px", transition: "bottom .3s" } }, "🚀");
  track.appendChild(rocket);
  const startBtn = h("button", { class: "btn green", onclick: start }, "▶ Partir !");
  const panel = h("div", { class: "panel col", style: { alignItems: "center", width: "560px" } },
    h("div", { class: "row", style: { justifyContent: "space-between", width: "100%" } },
      h("div", { class: "col", style: { gap: "0", alignItems: "center" } }, h("small", null, "Temps"), h("div", { class: "row" }, "⏱", timeEl)),
      h("div", { class: "col", style: { gap: "0", alignItems: "center" } }, h("small", null, "Points"), h("div", { class: "row" }, "★", scoreEl))),
    qEl, input, startBtn);
  root.appendChild(h("div", { class: "tool-wrap" }, track, panel));
  App.backButton(root, "jeux");
  let a, b, score = 0, t = 60, timer = null;
  function next() { a = rand(2, 9); b = rand(2, 9); qEl.textContent = `${a} × ${b}`; input.value = ""; input.focus(); }
  function start() {
    score = 0; t = 60; scoreEl.textContent = "0"; timeEl.textContent = "60"; rocket.style.bottom = "8px";
    input.disabled = false; startBtn.classList.add("hidden"); next();
    timer = setInterval(() => { t--; timeEl.textContent = t; if (t <= 10) Sound.tone(880, 0.05, "sine", 0.05); if (t <= 0) stop(); }, 1000);
  }
  function stop() {
    clearInterval(timer); timer = null; input.disabled = true;
    const rec = score > (u.bestCourse || 0);
    if (rec) { u.bestCourse = score; Store.save(); Sound.fanfare(); App.confetti(); }
    qEl.textContent = rec ? `Record : ${score} !` : `${score} points`;
    Voice.speak(rec ? `Nouveau record : ${score} points !` : `Tu as ${score} points.`);
    startBtn.textContent = "↻ Rejouer"; startBtn.classList.remove("hidden");
  }
  input.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" || !timer) return;
    if (Number(input.value) === a * b) {
      score++; scoreEl.textContent = score; Sound.good();
      rocket.style.bottom = Math.min(440, 8 + score * 18) + "px";
      next();
    } else { Sound.bad(); input.classList.add("wrong"); setTimeout(() => input.classList.remove("wrong"), 350); input.select(); }
  });
  App.onLeave(() => clearInterval(timer));
});

/* ---------------- Mémo ---------------- */
const MEMO_THEMES = [
  { name: "Les contraires", pairs: [["grand", "petit"], ["jour", "nuit"], ["chaud", "froid"], ["vide", "plein"], ["ouvrir", "fermer"], ["rapide", "lent"], ["propre", "sale"], ["gagner", "perdre"], ["haut", "bas"], ["entrer", "sortir"]] },
  { name: "Les multiplications", gen: () => { const set = new Map(); while (set.size < 9) { const a = rand(2, 9), b = rand(2, 9); if (![...set.values()].includes(a * b)) set.set(`${a} × ${b}`, a * b); } return [...set.entries()].map(([k, v]) => [k, String(v)]); } },
  { name: "Singulier et pluriel", pairs: [["un cheval", "des chevaux"], ["un bateau", "des bateaux"], ["un jeu", "des jeux"], ["un journal", "des journaux"], ["une souris", "des souris"], ["un œil", "des yeux"], ["un clou", "des clous"], ["un bijou", "des bijoux"], ["un hibou", "des hiboux"]] },
];
App.register("memo", (root) => {
  const u = Store.user;
  App.backdrop(root);
  const theme = pick(MEMO_THEMES);
  const pairs = sample(theme.gen ? theme.gen() : theme.pairs, 9);
  root.appendChild(h("div", { class: "screen-header" }, h("h2", { class: "title" }, "🃏 Le mémo : " + theme.name)));
  const cards = shuffle(pairs.flatMap((p, i) => [{ t: p[0], k: i }, { t: p[1], k: i }]));
  const grid = h("div", { class: "memo-grid" });
  const info = h("div", { class: "title", style: { fontSize: "26px", textAlign: "center" } }, "Coups : 0");
  root.appendChild(h("div", { class: "abs col", style: { left: "0", right: "0", top: "110px", alignItems: "center" } }, grid, info));
  App.backButton(root, "jeux");
  let open = [], moves = 0, found = 0, busy = false;
  cards.forEach((c) => {
    const el = h("div", { class: "memo-card", role: "button", tabindex: "0" }, c.t);
    c.el = el;
    el.addEventListener("click", () => {
      if (busy || el.classList.contains("open") || el.classList.contains("done")) return;
      Sound.pop(); el.classList.add("open"); open.push(c);
      if (open.length === 2) {
        moves++; info.textContent = "Coups : " + moves;
        const [x, y] = open;
        if (x.k === y.k) {
          x.el.classList.add("done"); y.el.classList.add("done"); open = []; found++; Sound.good();
          if (found === pairs.length) {
            const rec = !u.bestMemo || moves < u.bestMemo;
            if (rec) { u.bestMemo = moves; Store.save(); }
            info.textContent = `Bravo ! Terminé en ${moves} coups${rec ? " — nouveau record !" : ""}`;
            Sound.fanfare(); App.confetti(); Voice.speak(`Bravo ! Tu as trouvé toutes les paires en ${moves} coups.`);
          }
        } else {
          busy = true;
          setTimeout(() => { x.el.classList.remove("open"); y.el.classList.remove("open"); open = []; busy = false; }, 900);
        }
      }
    });
    grid.appendChild(el);
  });
  grid.style.gridTemplateColumns = "repeat(6, 130px)";
});

/* ---------------- Construction : l'ancien écran mène à l'atelier de construction (construction.js) ---------------- */
App.register("construction", () => App.go("atelier-construction"));

/* ---------------- Mémo en images (CP : sans lecture) ---------------- */
App.register("memo-images", (root) => {
  const u = Store.user;
  App.backdrop(root);
  root.appendChild(h("div", { class: "screen-header" }, h("h2", { class: "title" }, "🃏 Le mémo en images")));
  const noms = sample(Object.keys(PICTOS).filter((n) => PICTOS_NOMS[n]), 6);
  const cartes = shuffle(noms.flatMap((n, i) => [{ n, k: i }, { n, k: i }]));
  const grid = h("div", { class: "memo-grid images" });
  const info = h("div", { class: "title", style: { fontSize: "26px", textAlign: "center" } }, "Coups : 0");
  root.appendChild(h("div", { class: "abs col", style: { left: "0", right: "0", top: "100px", alignItems: "center" } }, grid, info));
  App.backButton(root, "jeux");
  let ouvertes = [], coups = 0, trouvees = 0, occupe = false;
  cartes.forEach((c) => {
    const el = h("div", { class: "memo-card image", role: "button", tabindex: "0", "aria-label": "Carte retournée", html: picto(c.n, 104) });
    c.el = el;
    const retourner = () => {
      if (occupe || el.classList.contains("open") || el.classList.contains("done")) return;
      Sound.pop(); el.classList.add("open"); el.setAttribute("aria-label", motDe(c.n)); ouvertes.push(c);
      Voice.speak(motDe(c.n));
      if (ouvertes.length < 2) return;
      coups++; info.textContent = "Coups : " + coups;
      const [x, y] = ouvertes;
      if (x.k === y.k) {
        x.el.classList.add("done"); y.el.classList.add("done"); ouvertes = []; trouvees++; Sound.good();
        if (trouvees === noms.length) {
          const rec = !u.bestMemoImages || coups < u.bestMemoImages;
          if (rec) { u.bestMemoImages = coups; Store.save(); }
          info.textContent = `Bravo ! Terminé en ${coups} coups${rec ? " — nouveau record !" : ""}`;
          Sound.fanfare(); App.confetti(); Voice.speak(`Bravo ! Tu as trouvé toutes les paires en ${coups} coups.`);
        }
      } else {
        occupe = true;
        setTimeout(() => { [x, y].forEach((z) => { z.el.classList.remove("open"); z.el.setAttribute("aria-label", "Carte retournée"); }); ouvertes = []; occupe = false; }, 1100);
      }
    };
    el.addEventListener("click", retourner);
    el.addEventListener("keydown", (e) => { if (e.key === "Enter") retourner(); });
    grid.appendChild(el);
  });
  setTimeout(() => Voice.speak("Retourne deux cartes. Si ce sont les mêmes images, tu gagnes la paire !"), 300);
});

/* ---------------- Course aux nombres (CP : compter jusqu'à 10, en cliquant) ---------------- */
App.register("course-nombres", (root) => {
  const u = Store.user;
  App.backdrop(root);
  root.appendChild(h("div", { class: "screen-header" }, h("h2", { class: "title" }, "🚀 La course aux nombres")));
  const timeEl = h("div", { class: "title", style: { fontSize: "40px" } }, "60");
  const scoreEl = h("div", { class: "title", style: { fontSize: "40px", color: "#f6c445" } }, "0");
  const scene = h("div", { class: "cn-scene" }, h("p", { class: "cn-pret" }, "Prêt ?"));
  const choix = h("div", { class: "choices" });
  const track = h("div", { style: { position: "relative", width: "120px", height: "520px", background: "linear-gradient(#1b1724,#2e86de)", border: "4px solid #2b2236", borderRadius: "20px", overflow: "hidden" } });
  const rocket = h("div", { style: { position: "absolute", left: "30px", bottom: "8px", fontSize: "56px", transition: "bottom .3s" } }, "🚀");
  track.appendChild(rocket);
  const startBtn = h("button", { class: "btn green", onclick: start }, "▶ Partir !");
  const panel = h("div", { class: "panel col", style: { alignItems: "center", width: "640px" } },
    h("div", { class: "row", style: { justifyContent: "space-between", width: "100%" } },
      h("div", { class: "col", style: { gap: "0", alignItems: "center" } }, h("small", null, "Temps"), h("div", { class: "row" }, "⏱", timeEl)),
      h("div", { class: "col", style: { gap: "0", alignItems: "center" } }, h("small", null, "Points"), h("div", { class: "row" }, "★", scoreEl))),
    scene, choix, startBtn);
  root.appendChild(h("div", { class: "tool-wrap" }, track, panel));
  App.backButton(root, "jeux");
  let bonne, score = 0, t = 60, timer = null;
  const groupe = (nom, n) => h("div", { class: "cn-groupe", html: Array.from({ length: n }, () => picto(nom, 52)).join("") });
  function next() {
    const nom = pick(Object.keys(PICTOS));
    scene.innerHTML = "";
    if (score >= 4 && Math.random() < 0.5) {
      /* deux groupes à ajouter (total jusqu'à 10) */
      const a = rand(1, 5), b = rand(1, Math.min(5, 10 - a));
      bonne = a + b;
      scene.append(groupe(nom, a), h("span", { class: "cn-plus" }, "+"), groupe(nom, b));
    } else {
      bonne = rand(1, 10);
      scene.appendChild(groupe(nom, bonne));
    }
    const autres = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((n) => n !== bonne && Math.abs(n - bonne) <= 3)).slice(0, 2);
    choix.innerHTML = "";
    shuffle([bonne, ...autres]).forEach((n) => {
      const b = h("button", { class: "choice nombre", type: "button" }, h("span", { class: "nb" }, String(n)));
      b.addEventListener("mouseenter", () => { if (NIVEAU.toutEnVoix) Voice.speak(String(n)); });
      b.addEventListener("click", () => repondre(n, b));
      choix.appendChild(b);
    });
  }
  function repondre(n, b) {
    if (!timer) return;
    if (n === bonne) {
      score++; scoreEl.textContent = score; Sound.good();
      rocket.style.bottom = Math.min(440, 8 + score * 24) + "px";
      next();
    } else { Sound.bad(); b.classList.add("wrong"); setTimeout(() => b.classList.remove("wrong"), 350); }
  }
  function start() {
    score = 0; t = 60; scoreEl.textContent = "0"; timeEl.textContent = "60"; rocket.style.bottom = "8px";
    startBtn.classList.add("hidden"); next();
    timer = setInterval(() => { t--; timeEl.textContent = t; if (t <= 10) Sound.tone(880, 0.05, "sine", 0.05); if (t <= 0) stop(); }, 1000);
  }
  function stop() {
    clearInterval(timer); timer = null; choix.innerHTML = "";
    const rec = score > (u.bestNombres || 0);
    if (rec) { u.bestNombres = score; Store.save(); Sound.fanfare(); App.confetti(); }
    scene.innerHTML = "";
    scene.appendChild(h("p", { class: "cn-pret" }, rec ? `Record : ${score} !` : `${score} points`));
    Voice.speak(rec ? `Nouveau record : ${score} points !` : `Tu as ${score} points.`);
    startBtn.textContent = "↻ Rejouer"; startBtn.classList.remove("hidden");
  }
  App.onLeave(() => clearInterval(timer));
  setTimeout(() => Voice.speak("Compte les images et clique vite sur le bon nombre. Appuie sur Partir pour commencer !"), 300);
});
