/* L'Atelier de Boulon — module « L'atelier de Rivet » : l'informatique et la robotique (CP et CE2).
   On l'ouvre en achetant Rivet, le chat robot, au coffre (150 écrous) : un clic sur Rivet ouvre
   son atelier. Le parent peut aussi l'offrir depuis l'espace parents.
   Palier CP (NIVEAU.toutEnVoix) : des flèches, tout en voix. Palier CE2 : avance / tourne, les
   boucles, le code d'une image. Les missions et les grilles sont dans robotique-niveaux.js,
   le calcul des déplacements dans robotique-moteur.js.
   État de l'élève : u.robotique = { missions: { id: étoiles (0 à 3) } } */
"use strict";

const Robotique = {
  palier() { return NIVEAU.toutEnVoix ? "cp" : "ce2"; },
  missions() { return ROBO_MISSIONS[this.palier()]; },
  mission(id) { return this.missions().find((m) => m.id === id); },
  ouvert(u) { return typeof Aventure !== "undefined" && !!Aventure.etat(u).achats.chat; },
  etat(u) {
    if (!u.robotique || typeof u.robotique !== "object") u.robotique = {};
    if (!u.robotique.missions || typeof u.robotique.missions !== "object") u.robotique.missions = {};
    return u.robotique;
  },
  etoiles(u, id) { return this.etat(u).missions[id] || 0; },
  /* une mission s'ouvre quand la précédente a au moins une étoile */
  ouverte(u, i) { return i === 0 || this.etoiles(u, this.missions()[i - 1].id) >= 1; },
  reussies(u) { return this.missions().filter((m) => this.etoiles(u, m.id) >= 1).length; },
  /* fin d'une mission : on garde le meilleur résultat, et les étoiles rapportent des écrous */
  finir(id, etoiles) {
    const u = Store.user; if (!u) return;
    const e = this.etat(u), avant = e.missions[id] || 0;
    e.missions[id] = Math.max(avant, etoiles); Store.save();
    const m = this.mission(id);
    if (typeof Journal !== "undefined") Journal.noter(u, "mission", "robo-" + id, etoiles, "L'atelier de Rivet : " + m.nom);
    if (typeof Aventure !== "undefined") Aventure.apresMission(`robo-${this.palier()}-${id}`, avant, etoiles);
    App.go("robo-fin", { id, etoiles });
  },
  nettoyer(o) {
    if (!o || typeof o !== "object") return undefined;
    const missions = Object.fromEntries(Object.entries(o.missions || {}).filter(([k]) => /^[a-z]{2,12}$/.test(k)).map(([k, v]) => [k, Math.max(0, Math.min(3, Number(v) || 0))]));
    return { missions };
  },
  /* la moyenne des étoiles des grilles, au moins 1 */
  moyenne(scores) { return Math.max(1, Math.min(3, Math.round(scores.reduce((a, b) => a + b, 0) / Math.max(1, scores.length)))); },
};

/* les commandes : leur dessin, leur nom dit à voix haute */
const ROBO_CMD = {
  h: { t: "↑", nom: "en haut" }, d: { t: "→", nom: "à droite" }, b: { t: "↓", nom: "en bas" }, g: { t: "←", nom: "à gauche" },
  av: { t: "⬆", nom: "avance" }, tg: { t: "↶", nom: "tourne à gauche" }, td: { t: "↷", nom: "tourne à droite" },
  r2: { t: "🔁", nom: "répète 2 fois" }, r3: { t: "🔁", nom: "répète 3 fois" }, r4: { t: "🔁", nom: "répète 4 fois" },
};
/* au CE2, « g » et « d » veulent dire « tourne » : on les affiche avec les cartes tg et td */
const roboCarte = (cmd, relatif) => (relatif && (cmd === "g" || cmd === "d") ? ROBO_CMD["t" + cmd] : ROBO_CMD[cmd]);
const roboAttendre = (ms) => new Promise((ok) => setTimeout(ok, ms));

/* l'en-tête des écrans de Rivet */
function roboTete(root, titre, badge) {
  root.classList.add("robo-ecran");
  root.append(h("div", { class: "robo-mur" }), h("div", { class: "robo-sol" }));
  root.appendChild(h("div", { class: "abs robo-tete" }, h("span", { class: "robo-tete-rivet", html: RIVET_FACE(52) }), h("h2", { class: "title" }, titre),
    badge ? h("span", { class: "robo-badge" }, badge) : null));
}

/* ------------------------------------------------------------------ */
/* Le hub : l'atelier de Rivet                                          */
/* ------------------------------------------------------------------ */
App.register("robotique", (root) => {
  const u = Store.user; if (!u) return App.go("identif");
  if (!Robotique.ouvert(u)) { App.go("atelier"); return; }
  const cp = Robotique.palier() === "cp", missions = Robotique.missions();
  roboTete(root, "L'atelier de Rivet", `Programmeur : ${Robotique.reussies(u)} / ${missions.length}`);
  root.appendChild(h("div", { class: "abs robo-rivet-grand", html: RIVET_FACE(250) }));
  const grille = h("div", { class: "panel abs robo-missions" });
  missions.forEach((m, i) => {
    const ouverte = Robotique.ouverte(u, i), et = Robotique.etoiles(u, m.id);
    const b = h("button", { class: "robo-mission" + (ouverte ? "" : " ferme"), type: "button", "aria-label": m.nom + (ouverte ? "" : ", fermée") },
      h("span", { class: "robo-mission-ic" }, m.icone), h("b", null, m.nom),
      h("span", { class: "robo-et", html: [0, 1, 2].map((k) => `<span class="${k < et ? "on" : ""}">★</span>`).join("") }),
      ouverte ? null : h("span", { class: "robo-cadenas" }, "🔒"));
    b.addEventListener("mouseenter", () => { Sound.hover(); if (cp) Voice.speak(m.nom); });
    b.addEventListener("click", () => {
      if (!ouverte) { Sound.bad(); Voice.speak("Celle-ci s'ouvre quand tu as réussi la mission d'avant."); return; }
      Sound.click();
      if (m.mode === "quiz") App.go("robo-quiz", { id: m.id });
      else if (m.mode === "pixels") App.go("robo-pixels", { id: m.id, k: 0, scores: [] });
      else App.go("robo-grille", { id: m.id, k: 0, scores: [] });
    });
    grille.appendChild(b);
  });
  grille.appendChild(h("div", { class: "robo-mission info" }, h("small", null, "Chaque mission ouvre la suivante. Les étoiles rapportent des écrous.")));
  root.appendChild(grille);
  /* ici, c'est Rivet qui parle */
  const bulle = h("div", { class: "abs robo-bulle" }, cp ? "Miaou-bip ! Guide-moi jusqu'à l'écrou !" : "Miaou-bip ! Écris mes programmes : je fais exactement ce que tu me dis.");
  root.appendChild(bulle);
  setTimeout(() => Voice.speak(bulle.textContent), 300);
  App.backButton(root, "atelier");
});

/* ------------------------------------------------------------------ */
/* Les grilles : les flèches, le programme, répéter, le bug             */
/* ------------------------------------------------------------------ */
App.register("robo-grille", (root, params) => {
  const u = Store.user; if (!u) return App.go("identif");
  const m = Robotique.mission(params.id); if (!m || !m.grilles) return App.go("robotique");
  const k = Math.max(0, Math.min(m.grilles.length - 1, params.k || 0)), g = m.grilles[k], scores = params.scores || [];
  const cp = Robotique.palier() === "cp", relatif = !!m.relatif;
  roboTete(root, m.nom, `Grille ${k + 1} / ${m.grilles.length}`);

  /* le plateau */
  const cote = Math.floor((470 - (g.n - 1) * 4) / g.n);
  const plateau = h("div", { class: "abs robo-grille", style: { gridTemplateColumns: `repeat(${g.n}, ${cote}px)`, gridAutoRows: cote + "px" } });
  for (let r = 0; r < g.n; r++) for (let c = 0; c < g.n; c++) {
    const caillou = (g.cailloux || []).some(([x, y]) => x === c && y === r);
    const d = h("div", { class: "robo-case" + (caillou ? " caillou" : "") });
    (g.murs || []).forEach(([x, y, s]) => { if (x === c && y === r) d.classList.add(s === "d" ? "mur-d" : "mur-b"); });
    if (caillou) d.innerHTML = ROBO_CAILLOU(cote * 0.8);
    if (g.but[0] === c && g.but[1] === r) { d.classList.add("but"); d.innerHTML = ROBO_ECROU(cote * 0.62); }
    plateau.appendChild(d);
  }
  const rivet = h("div", { class: "robo-rivet", html: relatif ? RIVET_DESSUS(cote) : RIVET_FACE(cote) });
  plateau.appendChild(rivet);
  root.appendChild(plateau);
  const pos = { c: g.depart[0], r: g.depart[1], dir: g.depart[2] || "droite" };
  const placer = () => {
    rivet.style.left = 10 + pos.c * (cote + 4) + "px"; rivet.style.top = 10 + pos.r * (cote + 4) + "px";
    if (relatif) rivet.style.transform = `rotate(${RoboMoteur.ORDRE.indexOf(pos.dir) * 90}deg)`;
  };
  const auDepart = () => { pos.c = g.depart[0]; pos.r = g.depart[1]; pos.dir = g.depart[2] || "droite"; rivet.classList.remove("bip"); placer(); };
  placer();

  /* le panneau de droite */
  const panneau = h("div", { class: "panel abs robo-panneau" });
  const consigne = h("p", { class: "robo-consigne" }, h("button", { class: "robo-ecoute", type: "button", "aria-label": "Écouter la consigne", html: ICONE_HAUT_PARLEUR,
    onclick: () => Voice.speak(m.consigne) }), m.consigne);
  panneau.appendChild(consigne);
  root.appendChild(panneau);
  const plusCourt = RoboMoteur.plusCourt(g, relatif);
  let echecs = 0, fini = false;

  function reussi(etoiles) {
    fini = true;
    Sound.good(); App.confetti(30);
    const tous = scores.concat([etoiles]), dernier = k === m.grilles.length - 1;
    const bandeau = h("div", { class: "panel abs robo-bravo" },
      h("b", null, cp ? "Bravo ! Rivet a trouvé l'écrou !" : "Écrou trouvé !"),
      h("span", { class: "robo-et grand", html: [0, 1, 2].map((i) => `<span class="${i < etoiles ? "on" : ""}">★</span>`).join("") }),
      h("button", { class: "btn green", onclick: () => {
        if (dernier) Robotique.finir(m.id, Robotique.moyenne(tous));
        else App.go("robo-grille", { id: m.id, k: k + 1, scores: tous });
      } }, dernier ? "Terminer ▶" : "Grille suivante ▶"));
    root.appendChild(bandeau);
    Voice.speak(cp ? "Bravo ! Rivet a trouvé l'écrou !" : "Écrou trouvé !");
  }

  if (m.mode === "direct") {
    /* les flèches : Rivet bouge tout de suite */
    let pas = 0;
    const compteur = h("p", { class: "robo-compteur" }, "Pas : 0");
    const pave = h("div", { class: "robo-pave" });
    [["h", "haut"], ["g", "gauche"], ["d", "droite"], ["b", "bas"]].forEach(([cmd, cl]) => {
      const b = h("button", { class: "robo-cmd fleche " + cl, type: "button", "aria-label": ROBO_CMD[cmd].nom }, ROBO_CMD[cmd].t);
      b.addEventListener("mouseenter", () => { if (cp) Voice.speak(ROBO_CMD[cmd].nom); });
      b.addEventListener("click", () => {
        if (fini) return;
        const [dc, dr] = RoboMoteur.DIRS[RoboMoteur.FLECHES[cmd]];
        if (RoboMoteur.bloque(g, pos.c, pos.r, pos.c + dc, pos.r + dr)) {
          Sound.bad(); rivet.classList.remove("bip"); void rivet.offsetWidth; rivet.classList.add("bip"); Voice.speak("Bip ! Je ne peux pas aller là.");
          return;
        }
        Sound.pop(); pos.c += dc; pos.r += dr; pas++; placer(); compteur.textContent = "Pas : " + pas;
        if (pos.c === g.but[0] && pos.r === g.but[1]) setTimeout(() => reussi(pas <= plusCourt + 2 ? 3 : pas <= plusCourt + 6 ? 2 : 1), 350);
      });
      pave.appendChild(b);
    });
    panneau.append(pave, compteur);
  } else {
    /* le programme (ou le bug) : on prépare les cartes, puis « Go ! » */
    const bug = m.mode === "bug";
    const N = m.repete ? g.sol.length : bug ? g.sol.length : Math.min(14, plusCourt + 2);
    const depart = bug ? g.sol.map((x, i) => (i === g.bug.i ? g.bug.faux : x)) : [];
    const prog = depart.slice();
    const fente = h("div", { class: "robo-fente" });
    const choix = relatif ? ["av", "g", "d"] : ["h", "d", "b", "g"];
    const rep = cp ? ["r2", "r3", "r4"] : ["r2", "r3", "r4"];
    const dessiner = () => {
      fente.innerHTML = "";
      for (let i = 0; i < N; i++) {
        const p = prog[i], carte = p ? roboCarte(p, relatif) : null;
        const s = h("button", { class: "robo-slot" + (p ? " plein" : "") + (p && p[0] === "r" ? " boucle" : ""), type: "button", "aria-label": carte ? carte.nom : "case vide" },
          carte ? h("span", null, p[0] === "r" ? `${p[1]}×` : carte.t) : null, carte && (relatif || p[0] === "r") ? h("small", null, carte.nom) : null);
        s.addEventListener("mouseenter", () => { if (cp && carte) Voice.speak(carte.nom); });
        s.addEventListener("click", () => {
          if (fini || enCours || !p) return;
          Sound.pop();
          if (bug) {   // le bug : on fait tourner la carte entre les commandes possibles
            const liste = p[0] === "r" ? rep : choix;
            prog[i] = liste[(liste.indexOf(p) + 1) % liste.length];
            Voice.speak(roboCarte(prog[i], relatif).nom);
          } else prog.splice(i, 1);
          auDepart(); dessiner();
        });
        fente.appendChild(s);
      }
    };
    panneau.appendChild(h("h3", { class: "robo-sous" }, bug ? "Le programme (clique sur une carte pour la changer)" : `Mon programme (${N} cases)`));
    panneau.appendChild(fente);
    if (!bug) {
      const pal = h("div", { class: "robo-palette" });
      const ajouter = (cmd) => {
        const b = h("button", { class: "robo-cmd" + (cmd[0] === "r" ? " rep" : relatif ? " mot" : ""), type: "button", "aria-label": roboCarte(cmd, relatif).nom },
          cmd[0] === "r" ? `🔁 ${cmd[1]}×` : relatif ? `${roboCarte(cmd, relatif).t} ${cmd === "av" ? "avance" : cmd === "g" ? "à gauche" : "à droite"}` : ROBO_CMD[cmd].t);
        b.addEventListener("mouseenter", () => { if (cp) Voice.speak(roboCarte(cmd, relatif).nom); });
        b.addEventListener("click", () => {
          if (fini || enCours) return;
          if (prog.length >= N) { Sound.bad(); Voice.speak("Il n'y a plus de place. " + (m.repete ? "Utilise la carte « fois » !" : "")); return; }
          Sound.click(); prog.push(cmd); auDepart(); dessiner();
        });
        pal.appendChild(b);
      };
      choix.forEach(ajouter);
      if (m.repete) rep.forEach(ajouter);
      panneau.append(h("h3", { class: "robo-sous" }, relatif ? "Les commandes" : "Les flèches"), pal);
      if (m.repete) panneau.appendChild(h("p", { class: "robo-aide" }, "« fois » répète la carte qui la suit."));
    }
    let enCours = false;
    const go = h("button", { class: "robo-go", type: "button" }, "Go !");
    const effacer = h("button", { class: "robo-efface", type: "button" }, bug ? "Recommencer" : "Tout effacer");
    effacer.addEventListener("click", () => { if (enCours || fini) return; Sound.click(); prog.length = 0; prog.push(...depart); auDepart(); dessiner(); });
    go.addEventListener("click", async () => {
      if (enCours || fini) return;
      if (!prog.length) { Sound.bad(); Voice.speak(cp ? "Mets d'abord des flèches dans le programme !" : "Le programme est vide."); return; }
      enCours = true; Sound.click(); auDepart(); await roboAttendre(250);
      const res = RoboMoteur.executer(g, prog, relatif), slots = [...fente.children];
      for (const e of res.etapes) {
        slots.forEach((s, i) => s.classList.toggle("actif", i === e.i || i === e.boucle));
        pos.c = e.c; pos.r = e.r; pos.dir = e.dir; placer(); Sound.pop();
        await roboAttendre(380);
      }
      slots.forEach((s) => s.classList.remove("actif"));
      if (res.choc) {
        echecs++; Sound.bad(); slots[res.i] && slots[res.i].classList.add("faux");
        rivet.classList.remove("bip"); void rivet.offsetWidth; rivet.classList.add("bip");
        Voice.speak(relatif ? "Bip ! Un obstacle. Regarde dans quelle direction je suis tourné." : "Bip ! Il y a un obstacle. Change la flèche en rouge.");
      } else if (res.arrive) {
        reussi(echecs === 0 ? 3 : echecs === 1 ? 2 : 1);
      } else {
        echecs++; Sound.bad();
        Voice.speak(cp ? "Presque ! Rivet s'est arrêté avant l'écrou." : "Rivet s'est arrêté, mais pas sur l'écrou.");
      }
      enCours = false;
    });
    panneau.appendChild(h("div", { class: "robo-actions" }, effacer, go));
    dessiner();
  }
  setTimeout(() => Voice.speak(m.consigne), 300);
  App.backButton(root, "robotique");
});

/* ------------------------------------------------------------------ */
/* Code une image (CE2) : noircir les cases d'après le code des lignes  */
/* ------------------------------------------------------------------ */
App.register("robo-pixels", (root, params) => {
  const u = Store.user; if (!u) return App.go("identif");
  const m = Robotique.mission(params.id); if (!m || !m.images) return App.go("robotique");
  const k = Math.max(0, Math.min(m.images.length - 1, params.k || 0)), im = m.images[k], scores = params.scores || [];
  roboTete(root, m.nom, `Image ${k + 1} / ${m.images.length}`);
  const code = (l) => { const out = []; let i = 0; while (i < l.length) { const v = l[i]; let n = 0; while (l[i] === v) { n++; i++; } out.push([v, n]); } return out; };
  const etat = im.lignes.map(() => Array(8).fill("0"));
  const noirs = im.lignes.join("").split("").filter((x) => x === "1").length;
  let clics = 0, fini = false;
  const grille = h("div", { class: "abs robo-pix" });
  const lignes = h("div", { class: "panel abs robo-codes" });
  const verifier = () => {
    let tout = true;
    im.lignes.forEach((l, r) => { const ok = etat[r].join("") === l; tout = tout && ok; lignes.children[r].classList.toggle("ok", ok); });
    if (tout && !fini) {
      fini = true; Sound.good(); App.confetti(30);
      const etoiles = clics <= noirs + 4 ? 3 : clics <= noirs + 14 ? 2 : 1, tous = scores.concat([etoiles]), dernier = k === m.images.length - 1;
      root.appendChild(h("div", { class: "panel abs robo-bravo" }, h("b", null, `C'est ${im.nom} !`),
        h("span", { class: "robo-et grand", html: [0, 1, 2].map((i) => `<span class="${i < etoiles ? "on" : ""}">★</span>`).join("") }),
        h("button", { class: "btn green", onclick: () => { if (dernier) Robotique.finir(m.id, Robotique.moyenne(tous)); else App.go("robo-pixels", { id: m.id, k: k + 1, scores: tous }); } },
          dernier ? "Terminer ▶" : "Image suivante ▶")));
      Voice.speak(`Bravo, c'est ${im.nom} ! Un ordinateur garde ses images de la même façon : des cases, et un code pour chaque ligne.`);
    }
  };
  im.lignes.forEach((l, r) => {
    for (let c = 0; c < 8; c++) {
      const b = h("button", { type: "button", "aria-label": `ligne ${r + 1}, case ${c + 1}` });
      b.addEventListener("click", () => { if (fini) return; clics++; etat[r][c] = etat[r][c] === "1" ? "0" : "1"; b.classList.toggle("on", etat[r][c] === "1"); Sound.pop(); verifier(); });
      grille.appendChild(b);
    }
    lignes.appendChild(h("div", { class: "robo-ligne" }, h("b", null, String(r + 1)),
      ...code(l).map(([v, n]) => h("span", { class: v === "1" ? "n" : "b" }, `${n} ${v === "1" ? (n > 1 ? "noirs" : "noir") : (n > 1 ? "blancs" : "blanc")}`))));
  });
  root.append(grille, lignes, h("p", { class: "abs robo-pix-aide" }, m.consigne));
  setTimeout(() => Voice.speak(m.consigne), 300);
  App.backButton(root, "robotique");
});

/* ------------------------------------------------------------------ */
/* Les quiz : « C'est quoi un robot ? » (CP) et « Les capteurs » (CE2)  */
/* ------------------------------------------------------------------ */
const ROBO_ROBOTS = ["robot", "aspirateur", "bras", "rover"], ROBO_PAS = ["ballon", "velo", "chat", "livre", "lapin", "tambour"];
const ROBO_ORDI = [["ecran", "Où voit-on les images de l'ordinateur ? Clique sur l'écran."], ["clavier", "Avec quoi écrit-on des lettres ? Clique sur le clavier."],
  ["souris-ordi", "Avec quoi déplace-t-on la flèche sur l'écran ? Clique sur la souris de l'ordinateur."]];
const roboCarteImg = (n) => ({ svg: picto(n, 160), img: true, cls: "carte", dire: motDe(n), aria: motDe(n) });
const ROBO_CAPTEURS = [
  ["Quel capteur aide un aspirateur robot à ne pas foncer dans un mur ?", "un capteur d'obstacle", ["un micro", "un thermomètre"]],
  ["Un capteur de lumière permet au robot de savoir…", "s'il fait jour ou nuit", ["s'il a faim", "l'heure qu'il est"]],
  ["Le micro d'un robot est un capteur de…", "son", ["chaleur", "couleur"]],
  ["Qui écrit le programme d'un robot ?", "des humains", ["le robot tout seul", "un chat"]],
  ["Ce qui fait bouger un robot, ce sont…", "des moteurs", ["des capteurs", "des écrans"]],
  ["Si on donne un mauvais ordre à un robot…", "il fait l'erreur", ["il la corrige tout seul", "il refuse"]],
  ["Où des robots explorent-ils une autre planète ?", "sur Mars", ["sur le Soleil", "dans les nuages"]],
  ["Les capteurs d'un robot ressemblent à nos…", "sens : les yeux, les oreilles…", ["dents", "cheveux"]],
  ["Le clavier et la souris servent à…", "donner des ordres à l'ordinateur", ["montrer les images", "garder la musique"]],
  ["Une boucle dans un programme sert à…", "répéter des ordres", ["effacer le programme", "arrêter le robot"]],
];
App.register("robo-quiz", (root, params) => {
  const u = Store.user; if (!u) return App.go("identif");
  const m = Robotique.mission(params.id); if (!m) return App.go("robotique");
  let questions;
  if (Robotique.palier() === "cp") {
    const tri = () => ({ type: "tri", consigne: "Range chaque image : c'est un robot, ou ce n'est pas un robot ?", paniers: ["un robot", "pas un robot"],
      objets: [...sample(ROBO_ROBOTS, 3).map((n) => [n, 0]), ...sample(ROBO_PAS, 3).map((n) => [n, 1])] });
    const trouve = () => { const bon = pick(ROBO_ROBOTS), choix = shuffle([bon, ...sample(ROBO_PAS, 2)]);
      return { type: "img", consigne: "Clique sur le robot.", prompt: "", choices: choix.map(roboCarteImg), answer: choix.indexOf(bon) }; };
    const ordi = ([bon, consigne]) => { const choix = shuffle(ROBO_ORDI.map((x) => x[0]));
      return { type: "img", consigne, prompt: "", choices: choix.map(roboCarteImg), answer: choix.indexOf(bon) }; };
    questions = [tri(), trouve(), ...ROBO_ORDI.map(ordi), tri(), trouve(), ordi(pick(ROBO_ORDI))];
  } else {
    questions = sample(ROBO_CAPTEURS, 8).map(([q, bon, faux]) => ({ type: "qcm", consigne: q, prompt: "", choices: shuffle([bon, ...faux]), answer: bon }));
  }
  runSession(root, { title: m.nom, color: "#8fa3bf", questions, backTo: "robotique",
    onFinish: ({ note }) => Robotique.finir(m.id, Math.max(1, starsFor(note))) });
});

/* ------------------------------------------------------------------ */
/* La fin d'une mission                                                 */
/* ------------------------------------------------------------------ */
App.register("robo-fin", (root, params) => {
  const u = Store.user; if (!u) return App.go("identif");
  const m = Robotique.mission(params.id); if (!m) return App.go("robotique");
  const etoiles = Math.max(0, Math.min(3, params.etoiles || 0)), cp = Robotique.palier() === "cp";
  roboTete(root, m.nom);
  const i = Robotique.missions().indexOf(m), suivante = Robotique.missions()[i + 1];
  root.appendChild(h("div", { class: "panel abs robo-fin" },
    h("span", { class: "robo-fin-rivet", html: RIVET_FACE(150) }),
    h("h2", { class: "title dark" }, etoiles === 3 ? "Mission parfaite !" : "Mission réussie !"),
    h("span", { class: "robo-et grand", html: [0, 1, 2].map((k) => `<span class="${k < etoiles ? "on" : ""}">★</span>`).join("") }),
    suivante ? h("p", null, `Nouvelle mission ouverte : ${suivante.nom}.`) : h("p", null, "Tu as fini toutes les missions de Rivet !"),
    h("div", { class: "row", style: { justifyContent: "center" } },
      h("button", { class: "btn sky", onclick: () => App.go(m.mode === "quiz" ? "robo-quiz" : m.mode === "pixels" ? "robo-pixels" : "robo-grille", { id: m.id, k: 0, scores: [] }) }, "↻ Rejouer"),
      h("button", { class: "btn green", onclick: () => App.go("robotique") }, "L'atelier de Rivet"))));
  if (etoiles === 3) { Sound.fanfare(); App.confetti(); } else Sound.good();
  Voice.speak((etoiles === 3 ? "Mission parfaite ! " : "Mission réussie ! ") + (suivante ? `Une nouvelle mission est ouverte : ${suivante.nom}.` : (cp ? "Tu es un vrai programmeur !" : "Tu as fini toutes les missions de Rivet !")));
});

/* ------------------------------------------------------------------ */
/* Rivet ouvre son atelier ; l'espace parents peut l'offrir ; la médaille */
/* ------------------------------------------------------------------ */
if (typeof DECORS_ACTIFS !== "undefined" && DECORS_ACTIFS.chat) Object.assign(DECORS_ACTIFS.chat, {
  desc: NIVEAU.toutEnVoix ? "Rivet, le chat robot : apprends à lui donner des ordres pour trouver l'écrou." : "L'atelier de Rivet : programmer un robot.",
  effet: "Clique dessus : l'atelier de Rivet, pour apprendre à programmer un robot. Il se voit à la fenêtre.",
  agir() { Sound.click(); App.go("robotique"); },
});
if (typeof PARENTS_ACTIONS !== "undefined") PARENTS_ACTIONS.push((u) => {
  if (Robotique.ouvert(u)) return null;
  return h("button", { class: "btn small white", title: "Ouvre l'atelier de Rivet (informatique et robotique) sans l'acheter avec les écrous",
    onclick: () => {
      const a = Aventure.etat(u);
      a.achats.chat = Revision.jour(0); a.places.chat = true; Store.save(); Sound.good();
      App.go("parents", { id: u.id });
    } }, "🐱 Offrir Rivet");
});
ajouterMedailles([
  { id: "programmeur", icone: "🤖", nom: "Programmeur", desc: "Réussis les 5 missions de l'atelier de Rivet.",
    ok: (u) => ROBO_MISSIONS[NIVEAU.toutEnVoix ? "cp" : "ce2"].every((m) => (((u.robotique && u.robotique.missions) || {})[m.id] || 0) >= 1) },
], { avant: "regulier" });
