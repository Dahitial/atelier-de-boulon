/* L'Atelier de Boulon — l'atelier de construction (pour tous les niveaux).
   Il s'ouvre la première fois qu'on bat Zigzag ; chaque victoire donne une boîte de pièces.
   Chaque jeu a un mode libre et des défis de difficulté croissante (3 niveaux) :
     la tour          : précision et équilibre ;
     le puzzle        : géométrie, remplir une silhouette avec des formes qu'on tourne ;
     le quadrillage   : repérage, reproduire un dessin case par case ; au CE2, la symétrie ;
     les cubes        : l'espace, construire ce qu'on voit, compter les cubes cachés, la vue de dessus ;
     la machine       : la logique, les tuyaux, les engrenages et le sens des roues.
   u.construction = { tour: n, puzzle: n, quadrillage: n, cubes: n, machine: n } : nombre de défis réussis (dans l'ordre). */
"use strict";

const Construction = {
  JEUX: ["tour", "puzzle", "quadrillage", "cubes", "machine"],
  etat(u) {
    if (!u.construction || typeof u.construction !== "object" || Array.isArray(u.construction)) u.construction = {};
    const c = u.construction;
    for (const k of this.JEUX) if (typeof c[k] !== "number" || !(c[k] >= 0)) c[k] = 0;
    return c;
  },
  total(u) { const c = this.etat(u); return this.JEUX.reduce((s, k) => s + c[k], 0); },
  /* un défi réussi : la première fois, 5 écrous */
  reussir(u, jeu, i) {
    const c = this.etat(u);
    const nouveau = i >= c[jeu];
    if (nouveau) { c[jeu] = i + 1; Aventure.gagner(u, 5, "défi de construction"); }
    Store.save();
    Aventure.conclure(u);
    return nouveau;
  },
  nettoyer(c) {
    if (!c || typeof c !== "object") return undefined;
    return Object.fromEntries(this.JEUX.map((k) => [k, Math.max(0, Math.min(99, Math.floor(Number(c[k]) || 0)))]));
  },
  /* un tirage au hasard qui donne toujours le même résultat pour le même défi */
  hasard(graine) {
    let a = graine >>> 0;
    return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  },
  casque(u) { return (Aventure.etat(u).porte || {}).tete === "chantier"; },
};

/* ------------------------------------------------------------------ */
/* Les jeux de l'atelier                                               */
/* ------------------------------------------------------------------ */
const JEUX_CONSTRUCTION = [
  { id: "tour", titre: "La tour", desc: "Précision et équilibre : empile les blocs bien droit.", nb: 15,
    ouvert: (u) => !!u.unlocked.construction, condition: "Bats Zigzag une fois",
    dessin: `<g stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"><rect x="95" y="94" width="110" height="16" fill="#8a5a24"/><rect x="104" y="78" width="96" height="16" fill="#e4572e"/><rect x="110" y="62" width="88" height="16" fill="#f6c445"/><rect x="114" y="46" width="80" height="16" fill="#7bc950"/><rect x="120" y="30" width="70" height="16" fill="#2e86de"/><rect x="40" y="8" width="70" height="16" fill="#8e6cc9"/></g>`, fond: "#bfe8ff" },
  { id: "puzzle", titre: "Le puzzle des formes", desc: "Géométrie : remplis la silhouette avec des carrés et des triangles.", nb: 9,
    ouvert: (u) => nbVictoires(u) >= 3, condition: "Bats Zigzag 3 fois",
    dessin: `<g stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"><path d="M60 100 V50 L100 14 L140 50 V100 Z" fill="#d9cdb6" stroke-dasharray="6 5"/><path d="M60 50 L100 14 L140 50 Z" fill="#e4572e"/><rect x="60" y="50" width="40" height="50" fill="#5bc0eb"/><rect x="200" y="56" width="40" height="40" fill="#7bc950" transform="rotate(12 220 76)"/><path d="M176 92 l30 -40 l20 40 z" fill="#f6c445"/></g>`, fond: "#f3e9d6" },
  { id: "quadrillage", titre: "Le quadrillage", desc: "Repérage : reproduis le dessin case par case.", nb: 15,
    ouvert: (u) => nbVictoires(u) >= 2, condition: "Bats Zigzag 2 fois",
    dessin: `<g stroke="#b9c7d4" stroke-width="1"><path d="M70 10 H230 M70 30 H230 M70 50 H230 M70 70 H230 M70 90 H230 M70 10 V90 M90 10 V90 M110 10 V90 M130 10 V90 M150 10 V90 M170 10 V90 M190 10 V90 M210 10 V90 M230 10 V90"/></g><g fill="#2e86de" stroke="${INK}" stroke-width="1.5"><rect x="110" y="30" width="20" height="20"/><rect x="130" y="30" width="20" height="20"/><rect x="90" y="50" width="20" height="20"/><rect x="130" y="50" width="20" height="20"/><rect x="110" y="70" width="20" height="20"/></g><path d="M150 4 V96" stroke="#e4572e" stroke-width="3" stroke-dasharray="6 4"/>`, fond: "#ffffff" },
  { id: "cubes", titre: "Les cubes", desc: "L'espace : construis ce que tu vois, compte les cubes cachés, trouve la vue de dessus.", nb: 15,
    ouvert: (u) => nbVictoires(u) >= 5, condition: "Bats Zigzag 5 fois",
    dessin: `<g stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"><path d="M120 40 l30 -16 l30 16 l-30 16 z" fill="#f6c445"/><path d="M120 40 v30 l30 16 v-30 z" fill="#e0a800"/><path d="M180 40 v30 l-30 16 v-30 z" fill="#c98a3c"/></g>`, fond: "#ece8e0" },
  { id: "machine", titre: "La machine de Boulon", desc: "Logique : des tuyaux pour remplir le seau, des engrenages pour allumer la lampe.", nb: 15,
    /* s'ouvre en battant Zigzag sur un chapitre de sciences, ou en adoptant Rivet, le chat robot */
    ouvert: (u) => (typeof Aventure !== "undefined" && !!Aventure.etat(u).achats.chat)
      || Object.entries(u.defi || {}).some(([ch, r]) => r.wins && CONTENT.sciences && CONTENT.sciences.chapters.some((c) => c.id === ch)),
    condition: "Bats Zigzag en sciences, ou adopte Rivet",
    dessin: `<g stroke="${INK}" stroke-width="2.5"><circle cx="110" cy="52" r="26" fill="#8e6cc9"/><circle cx="110" cy="52" r="8" fill="#ece8e0"/><circle cx="156" cy="40" r="18" fill="#f6c445"/><circle cx="156" cy="40" r="6" fill="#ece8e0"/></g>`, fond: "#ece8e0" },
];
const jeuConstruction = (id) => JEUX_CONSTRUCTION.find((j) => j.id === id);

/* l'accueil de l'atelier */
App.register("atelier-construction", (root) => {
  const u = Store.user; if (!u) return App.go("identif");
  const c = Construction.etat(u), cp = !!NIVEAU.toutEnVoix;
  App.backdrop(root);
  root.appendChild(h("div", { class: "screen-header" }, h("h2", { class: "title" }, "🧱 L'atelier de construction")));
  const v = nbVictoires(u);
  const bandeau = h("div", { class: "panel abs ac-bandeau" },
    h("div", { class: "ac-zigzag", html: Art.zigzag() }),
    h("p", null, u.unlocked.construction
      ? (v ? `Tu as battu Zigzag ${v} fois ! Chaque victoire t'apporte une boîte de pièces, et certaines ouvrent un nouveau jeu.` : "L'atelier est ouvert ! Bats Zigzag pour gagner des boîtes de pièces.")
      : "L'atelier de construction est fermé. Bats Zigzag au défi pour l'ouvrir !"),
    u.unlocked.construction ? h("span", { class: "ac-boites" }, `🧱 ${u.pieces || 1} boîte${(u.pieces || 1) > 1 ? "s" : ""} de pièces`)
      : h("button", { class: "btn green", onclick: () => { Sound.click(); App.go("defi"); } }, "🏆 Défier Zigzag"));
  root.appendChild(bandeau);
  const grille = h("div", { class: "abs ac-grille" });
  JEUX_CONSTRUCTION.forEach((j) => {
    const ouvert = !j.bientot && j.ouvert(u);
    const carte = h("div", { class: "panel ac-carte" + (ouvert ? "" : " fermee") },
      h("div", { class: "ac-dessin", style: { background: j.fond }, html: `<svg viewBox="0 0 300 110" aria-hidden="true">${j.dessin}</svg>` }),
      h("h3", null, (ouvert ? "" : "🔒 ") + j.titre), h("p", null, j.desc));
    if (ouvert) {
      carte.appendChild(h("div", { class: "ac-bas" },
        h("span", { class: "ac-prog" }, `Défis ${c[j.id]} / ${j.nb}`),
        h("button", { class: "btn small green", onclick: () => { Sound.click(); App.go(j.id, { defi: Math.min(c[j.id], j.nb - 1) }); } }, "Défis"),
        h("button", { class: "btn small white", onclick: () => { Sound.click(); App.go(j.id, { libre: true }); } }, "Libre")));
    } else carte.appendChild(h("p", { class: "ac-condition" }, j.bientot ? "Bientôt dans l'atelier !" : `Pour l'ouvrir : ${j.condition}`));
    if (cp) carte.addEventListener("mouseenter", () => Voice.speak(`${j.titre}. ${j.desc}` + (ouvert ? "" : j.bientot ? " Bientôt !" : ` Pour l'ouvrir : ${j.condition}.`)));
    grille.appendChild(carte);
  });
  root.appendChild(grille);
  App.backButton(root, "atelier");
  setTimeout(() => Voice.speak(u.unlocked.construction ? "Bienvenue dans l'atelier de construction ! Choisis un jeu : des défis, ou construis librement." : "L'atelier de construction est fermé. Bats Zigzag pour l'ouvrir !"), 300);
});

/* le cadre commun d'un jeu : titre, consigne, navigation entre les défis */
function cadreConstruction(root, jeu, params, consigne) {
  const u = Store.user, J = jeuConstruction(jeu), c = Construction.etat(u);
  const libre = !!params.libre, i = libre ? -1 : Math.max(0, Math.min(params.defi || 0, J.nb - 1));
  App.backdrop(root);
  const niveau = libre ? "" : ` · niveau ${Math.floor(i / (J.nb / 3)) + 1}`;
  const titre = `${J.titre} — ${libre ? "construction libre" : `défi ${i + 1} / ${J.nb}`}${niveau}`;
  root.appendChild(h("div", { class: "screen-header" }, h("h2", { class: "title", style: titre.length > 38 ? { fontSize: "30px", whiteSpace: "nowrap" } : null }, titre)));
  const info = h("div", { class: "panel abs ac-info" });
  const texte = h("p", { class: "ac-consigne" }, consigne);
  const message = h("p", { class: "ac-message" });
  const boutons = h("div", { class: "ac-boutons" });
  info.append(h("button", { class: "btn round sky speak", title: "Écouter", "aria-label": "Écouter la consigne", onclick: () => Voice.speak(texte.textContent) }, "🔊"), texte, message, boutons);
  root.appendChild(info);
  App.backButton(root, "atelier-construction");
  /* les défis déjà ouverts : précédent / suivant */
  if (!libre) {
    const nav = h("div", { class: "ac-nav" },
      h("button", { class: "btn small white", disabled: i === 0, onclick: () => App.go(jeu, { defi: i - 1 }) }, "◀ Défi précédent"),
      h("button", { class: "btn small white", disabled: i + 1 >= J.nb || i + 1 > c[jeu], onclick: () => App.go(jeu, { defi: i + 1 }) }, "Défi suivant ▶"));
    root.appendChild(nav);
  }
  setTimeout(() => Voice.speak(consigne), 350);
  return {
    u, i, libre, texte, message, boutons,
    gagne(txt) {
      const nouveau = Construction.reussir(u, jeu, i);
      Sound.fanfare(); App.confetti(60);
      message.className = "ac-message bon";
      message.textContent = txt + (nouveau ? " +5 écrous !" : "");
      Voice.speak(message.textContent);
      boutons.innerHTML = "";
      boutons.append(h("button", { class: "btn small sky", onclick: () => App.go(jeu, { defi: i }) }, "↻ Rejouer"));
      if (i + 1 < J.nb) boutons.append(h("button", { class: "btn small green", onclick: () => App.go(jeu, { defi: i + 1 }) }, "Défi suivant ➜"));
      else boutons.append(h("button", { class: "btn small green", onclick: () => App.go("atelier-construction") }, "🏆 Tous les défis réussis !"));
    },
    rate(txt) {
      Sound.bad();
      message.className = "ac-message mauvais";
      message.textContent = txt;
      Voice.speak(txt);
      boutons.innerHTML = "";
      boutons.append(h("button", { class: "btn small sky", onclick: () => App.go(jeu, libre ? { libre: true } : { defi: i }) }, "↻ Recommencer"));
    },
  };
}

/* « 📷 Photo » : la construction part dans les images du chevalet (chevalet.js) */
function boutonPhoto(prendre) {
  return h("button", { class: "btn small yellow", onclick: () => {
    const p = prendre();
    if (!p) { Sound.bad(); Voice.speak("Construis d'abord quelque chose, puis prends la photo !"); return; }
    if (typeof Chevalet === "undefined" || !Chevalet.ajouterPhoto(Store.user, p.svg, p.vb)) { Sound.bad(); Voice.speak("Impossible de garder la photo."); return; }
    Sound.good(); App.confetti(20); Voice.speak("Clic ! La photo est rangée dans les images du chevalet.");
  } }, "📷 Photo");
}

/* ------------------------------------------------------------------ */
/* 1. La tour                                                           */
/* ------------------------------------------------------------------ */
/* défis 1 à 5 : hauteur ; 6 à 10 : hauteur avec peu de blocs ; 11 à 15 : blocs parfaits de suite */
const TOUR_DEFIS = Array.from({ length: 15 }, (_, i) => (i < 5 ? { but: "hauteur", n: 4 + i, blocs: 12 }
  : i < 10 ? { but: "hauteur", n: 6 + (i - 5), blocs: 8 + (i - 5) } : { but: "parfaits", n: 2 + (i - 10), blocs: 16 }));

App.register("tour", (root, params) => {
  const u = Store.user; if (!u) return App.go("identif");
  if (!jeuConstruction("tour").ouvert(u)) return App.go("atelier-construction");
  const libre = !!params.libre, D = libre ? null : TOUR_DEFIS[Math.max(0, Math.min(params.defi || 0, 14))];
  const maxBlocs = libre ? 10 + 5 * ((u.pieces || 1) - 1) + (Construction.casque(u) ? 5 : 0) : D.blocs;
  const consigne = libre ? `Construis la tour la plus haute possible avec tes ${maxBlocs} blocs${Construction.casque(u) ? " (ton casque de chantier t'en donne 5 de plus)" : ""}.`
    : D.but === "hauteur" ? `Construis une tour de ${D.n} étages, avec ${D.blocs} blocs au plus.` : `Pose ${D.n} blocs parfaits de suite : bien alignés sur celui du dessous.`;
  const C = cadreConstruction(root, "tour", params, consigne);
  const W = 520, H = 520;
  const canvas = h("canvas", { class: "ac-canvas", width: W, height: H });
  const ctx = canvas.getContext("2d");
  root.appendChild(canvas);
  const etat = h("p", { class: "ac-etat" });
  C.boutons.before(etat);
  const COLORS = ["#e4572e", "#f6c445", "#7bc950", "#2e86de", "#8e6cc9", "#ef7fa8", "#5bc0eb", "#f08a3c"];
  const BH = 32;
  let stack, moving, dir, speed, used, over, raf, cam, suite;
  function reset() {
    stack = [{ x: W / 2 - 110, w: 220, c: "#8a5a24" }];
    used = 0; over = false; speed = libre ? 3 : 3 + Math.floor((params.defi || 0) / 5) * 0.6; cam = 0; suite = 0;
    spawn(); majEtat(); if (!raf) boucle();
  }
  function spawn() { const top = stack[stack.length - 1]; moving = { x: 0, w: top.w, c: COLORS[used % COLORS.length] }; dir = 1; }
  function majEtat() {
    const hauteur = stack.length - 1;
    etat.textContent = `Étages : ${hauteur}` + (D && D.but === "parfaits" ? ` • parfaits de suite : ${suite}/${D.n}` : D ? ` / ${D.n}` : ` • record : ${u.bestConstruction || 0}`) + ` • blocs restants : ${Math.max(0, maxBlocs - used)}`;
  }
  function lacher() {
    if (over) return;
    const top = stack[stack.length - 1];
    const l = Math.max(moving.x, top.x), r = Math.min(moving.x + moving.w, top.x + top.w);
    used++;
    if (r - l <= 2) { over = true; fin(false, "Le bloc est tombé !"); return; }
    const parfait = Math.abs(moving.x - top.x) < 7;
    suite = parfait ? suite + 1 : 0;
    stack.push(parfait ? { x: top.x, w: top.w, c: moving.c } : { x: l, w: r - l, c: moving.c });
    parfait ? Sound.good() : Sound.pop();
    speed = Math.min(9, speed + 0.25);
    majEtat();
    if (D && D.but === "hauteur" && stack.length - 1 >= D.n) { over = true; C.gagne(`Bravo, ta tour a ${D.n} étages !`); return; }
    if (D && D.but === "parfaits" && suite >= D.n) { over = true; C.gagne(`Bravo, ${D.n} blocs parfaits de suite !`); return; }
    if (used >= maxBlocs) { over = true; fin(!D, "Tu n'as plus de blocs."); return; }
    spawn();
  }
  function fin(libreFini, raison) {
    const hauteur = stack.length - 1;
    if (!D) {
      const rec = hauteur > (u.bestConstruction || 0);
      if (rec) { u.bestConstruction = hauteur; Store.save(); Sound.fanfare(); App.confetti(); }
      C.message.className = "ac-message bon";
      C.message.textContent = `Ta tour mesure ${hauteur} étages.` + (rec ? " C'est un nouveau record !" : "");
      Voice.speak(C.message.textContent);
      C.boutons.innerHTML = "";
      C.boutons.append(h("button", { class: "btn small sky", onclick: () => { C.message.textContent = ""; reset(); } }, "↻ Recommencer"));
      majEtat();
      return;
    }
    C.rate(`${raison} Ta tour a ${hauteur} étage${hauteur > 1 ? "s" : ""}. Recommence !`);
  }
  function boucle() {
    raf = requestAnimationFrame(boucle);
    if (!over) { moving.x += dir * speed; if (moving.x + moving.w > W) { moving.x = W - moving.w; dir = -1; } if (moving.x < 0) { moving.x = 0; dir = 1; } }
    const cible = Math.max(0, (stack.length + 2) * BH - (H - 140));
    cam += (cible - cam) * 0.1;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#bfe8ff"; ctx.fillRect(0, 0, W, H);
    if (D && D.but === "hauteur") {   /* la ligne d'arrivée */
      const y = H - 30 - (D.n + 1) * BH + cam;   // le haut du n-ième étage
      ctx.strokeStyle = "#e4572e"; ctx.setLineDash([10, 8]); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = "#e4572e"; ctx.font = "bold 18px Trebuchet MS"; ctx.fillText(`${D.n} étages`, 10, y - 6);
    }
    ctx.fillStyle = "#6fbf4a"; ctx.fillRect(0, H - 30 + cam, W, 30);
    stack.forEach((b, i) => bloc(b, H - 30 - (i + 1) * BH + cam));
    if (!over) {
      const y = H - 30 - (stack.length + 1) * BH + cam;
      ctx.strokeStyle = "#2b2236"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(moving.x + moving.w / 2, 0); ctx.lineTo(moving.x + moving.w / 2, y); ctx.stroke();
      bloc(moving, y);
    }
  }
  function bloc(b, y) {
    ctx.fillStyle = b.c; ctx.strokeStyle = "#2b2236"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.roundRect ? ctx.roundRect(b.x, y, b.w, BH - 2, 6) : ctx.rect(b.x, y, b.w, BH - 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.fillRect(b.x + 6, y + 5, Math.max(0, b.w - 12), 5);
  }
  canvas.addEventListener("pointerdown", lacher);
  const touche = (e) => { if (e.code === "Space") { e.preventDefault(); lacher(); } };
  document.addEventListener("keydown", touche);
  App.onLeave(() => { document.removeEventListener("keydown", touche); cancelAnimationFrame(raf); raf = null; });
  C.boutons.before(h("p", { class: "ac-aide" }, "Clique sur la tour (ou appuie sur Espace) pour lâcher le bloc."));
  reset();
});

/* ------------------------------------------------------------------ */
/* 2. Le puzzle des formes                                              */
/* ------------------------------------------------------------------ */
/* Chaque case est coupée en 4 triangles : N (haut), E (droite), S (bas), W (gauche).
   Une pièce = une liste [dx, dy, "triangles"] ; on la tourne à l'intérieur de sa famille. */
const PZ_FORMES = {
  carre: [[0, 0, "NESW"]],
  "tri-NE": [[0, 0, "NE"]], "tri-ES": [[0, 0, "ES"]], "tri-SW": [[0, 0, "SW"]], "tri-WN": [[0, 0, "WN"]],
  "rect-H": [[0, 0, "NESW"], [1, 0, "NESW"]], "rect-V": [[0, 0, "NESW"], [0, 1, "NESW"]],
  "grand-TL": [[0, 0, "NESW"], [1, 0, "NW"], [0, 1, "NW"]], "grand-TR": [[1, 0, "NESW"], [0, 0, "NE"], [1, 1, "NE"]],
  "grand-BR": [[1, 1, "NESW"], [1, 0, "ES"], [0, 1, "ES"]], "grand-BL": [[0, 1, "NESW"], [0, 0, "SW"], [1, 1, "SW"]],
};
const PZ_FAMILLES = {
  carre: { nom: "le carré", formes: ["carre"], couleurs: ["#f6c445", "#e9b52c"] },
  tri: { nom: "le triangle", formes: ["tri-NE", "tri-ES", "tri-SW", "tri-WN"], couleurs: ["#e4572e", "#c9431f"] },
  rect: { nom: "le rectangle", formes: ["rect-H", "rect-V"], couleurs: ["#5bc0eb", "#2e9fd0"] },
  grand: { nom: "le grand triangle", formes: ["grand-TL", "grand-TR", "grand-BR", "grand-BL"], couleurs: ["#7bc950", "#5aa83d"] },
};
const famDe = (forme) => Object.keys(PZ_FAMILLES).find((f) => PZ_FAMILLES[f].formes.includes(forme));
/* les silhouettes : 3 niveaux de 3 défis */
const PZ_DEFIS = [
  { nom: "la maison", pieces: [["rect-H", 3, 3], ["tri-ES", 3, 2], ["tri-SW", 4, 2]] },
  { nom: "la montagne et le soleil", pieces: [["grand-BR", 1, 3], ["grand-BL", 3, 3], ["carre", 6, 1]] },
  { nom: "l'escalier", pieces: [["carre", 2, 4], ["rect-V", 3, 3], ["rect-V", 4, 2], ["carre", 4, 4]] },
  { nom: "le bateau", pieces: [["tri-NE", 1, 4], ["rect-H", 2, 4], ["rect-H", 4, 4], ["tri-WN", 6, 4], ["grand-BL", 3, 2]] },
  { nom: "la fusée", pieces: [["rect-V", 3, 2], ["rect-V", 4, 2], ["tri-ES", 3, 1], ["tri-SW", 4, 1], ["tri-ES", 2, 3], ["tri-SW", 5, 3]] },
  { nom: "la maison et son garage", pieces: [["rect-H", 3, 4], ["rect-H", 3, 3], ["tri-ES", 3, 2], ["tri-SW", 4, 2], ["carre", 5, 4]] },
  { nom: "le sapin", pieces: [["tri-ES", 3, 2], ["tri-SW", 4, 2], ["tri-ES", 2, 3], ["carre", 3, 3], ["carre", 4, 3], ["tri-SW", 5, 3], ["rect-H", 3, 4]] },
  { nom: "le château", pieces: [["rect-H", 2, 5], ["rect-H", 4, 5], ["rect-V", 2, 3], ["rect-V", 5, 3], ["carre", 3, 4], ["carre", 4, 4], ["tri-ES", 2, 2], ["tri-SW", 5, 2]] },
  { nom: "Boulon le robot", pieces: [["rect-H", 3, 1], ["rect-V", 3, 2], ["rect-V", 4, 2], ["carre", 3, 4], ["carre", 4, 4], ["tri-ES", 2, 2], ["tri-SW", 5, 2]] },
];
const pzCases = (forme, x, y) => PZ_FORMES[forme].flatMap(([dx, dy, qs]) => qs.split("").map((q) => `${x + dx},${y + dy},${q}`));

App.register("puzzle", (root, params) => {
  const u = Store.user; if (!u) return App.go("identif");
  if (!jeuConstruction("puzzle").ouvert(u)) return App.go("atelier-construction");
  const libre = !!params.libre, idx = Math.max(0, Math.min(params.defi || 0, PZ_DEFIS.length - 1)), D = libre ? null : PZ_DEFIS[idx];
  const niveau = libre ? 0 : Math.floor(idx / 3) + 1;
  const consigne = libre ? "Construis ce que tu veux avec les formes : choisis une forme, tourne-la, puis clique sur la grille."
    : `Remplis la silhouette : ${D.nom}. Choisis une forme, tourne-la si besoin, puis clique sur la grille.` + (niveau === 1 ? " Regarde le modèle pour t'aider !" : "");
  const C = cadreConstruction(root, "puzzle", params, consigne);
  const COLS = 8, ROWS = 7, T = 56;
  const cible = new Set(D ? D.pieces.flatMap(([f, x, y]) => pzCases(f, x, y)) : []);
  /* le stock de pièces : celles du modèle (illimité en mode libre) */
  const stock = {};
  if (D) D.pieces.forEach(([f]) => { const fam = famDe(f); stock[fam] = (stock[fam] || 0) + 1; });
  else Object.keys(PZ_FAMILLES).forEach((f) => { stock[f] = Infinity; });
  const posees = [];   // { forme, x, y, cases, coul }
  let famille = Object.keys(stock)[0], rot = 0, survol = null, fini = false;

  const zone = h("div", { class: "pz-zone" });
  root.appendChild(zone);
  const tri = (k) => {
    const [x, y, q] = k.split(","), X = +x * T, Y = +y * T, cx = X + T / 2, cy = Y + T / 2;
    const p = { N: [[X, Y], [X + T, Y]], E: [[X + T, Y], [X + T, Y + T]], S: [[X + T, Y + T], [X, Y + T]], W: [[X, Y + T], [X, Y]] }[q];
    return `${p[0][0]},${p[0][1]} ${p[1][0]},${p[1][1]} ${cx},${cy}`;
  };
  const occupe = () => new Set(posees.flatMap((p) => p.cases));
  const formeCourante = () => PZ_FAMILLES[famille].formes[rot % PZ_FAMILLES[famille].formes.length];
  const peutPoser = (forme, x, y) => {
    const cs = pzCases(forme, x, y), occ = occupe();
    return cs.every((k) => { const [cx, cy] = k.split(",").map(Number); return cx >= 0 && cy >= 0 && cx < COLS && cy < ROWS && !occ.has(k); });
  };
  function dessiner() {
    let s = `<rect width="${COLS * T}" height="${ROWS * T}" fill="#fffdf6"/>`;
    for (let x = 0; x <= COLS; x++) s += `<line x1="${x * T}" y1="0" x2="${x * T}" y2="${ROWS * T}" stroke="#e6dcc6" stroke-width="1"/>`;
    for (let y = 0; y <= ROWS; y++) s += `<line x1="0" y1="${y * T}" x2="${COLS * T}" y2="${y * T}" stroke="#e6dcc6" stroke-width="1"/>`;
    cible.forEach((k) => { s += `<polygon points="${tri(k)}" fill="#cbbd9f" stroke="#cbbd9f" stroke-width="1"/>`; });
    posees.forEach((p, n) => p.cases.forEach((k) => { s += `<polygon points="${tri(k)}" fill="${p.coul}" stroke="${p.coul}" stroke-width="1" data-piece="${n}"/>`; }));
    if (survol && !fini && stock[famille] > 0) {
      const f = formeCourante(), ok = peutPoser(f, survol[0], survol[1]);
      pzCases(f, survol[0], survol[1]).forEach((k) => { s += `<polygon points="${tri(k)}" fill="${ok ? PZ_FAMILLES[famille].couleurs[0] : "#d64545"}" opacity=".45" pointer-events="none"/>`; });
    }
    for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) s += `<rect x="${x * T}" y="${y * T}" width="${T}" height="${T}" fill="transparent" data-x="${x}" data-y="${y}"/>`;
    plateau.innerHTML = `<svg viewBox="0 0 ${COLS * T} ${ROWS * T}" width="${COLS * T}" height="${ROWS * T}">${s}</svg>`;
  }
  const plateau = h("div", { class: "pz-plateau" });
  plateau.addEventListener("mousemove", (e) => {
    const r = e.target.closest("rect[data-x]");
    const n = r ? [+r.dataset.x, +r.dataset.y] : null;
    if (String(n) !== String(survol)) { survol = n; dessiner(); }
  });
  plateau.addEventListener("mouseleave", () => { survol = null; dessiner(); });
  plateau.addEventListener("click", (e) => {
    if (fini) return;
    const r = e.target.closest("rect[data-x]");
    if (!r) return;
    const x = +r.dataset.x, y = +r.dataset.y;
    /* un clic sur une pièce posée la reprend (elle revient dans le stock) */
    const occ = posees.findIndex((p) => p.cases.some((k) => k.startsWith(`${x},${y},`)));
    if (occ >= 0 && !(stock[famille] > 0 && peutPoser(formeCourante(), x, y))) {
      const [p] = posees.splice(occ, 1);
      stock[famDe(p.forme)]++; Sound.pop(); majPalette(); dessiner(); return;
    }
    if (!(stock[famille] > 0)) { Sound.bad(); Voice.speak("Tu n'as plus de cette forme. Choisis-en une autre !"); return; }
    const f = formeCourante();
    if (!peutPoser(f, x, y)) { Sound.bad(); return; }
    const fam = famDe(f), coul = PZ_FAMILLES[fam].couleurs[posees.filter((p) => famDe(p.forme) === fam).length % 2];
    posees.push({ forme: f, x, y, cases: pzCases(f, x, y), coul });
    stock[fam]--; Sound.click();
    majPalette(); dessiner(); verifier();
  });
  function verifier() {
    if (!D) return;
    const occ = occupe();
    if (occ.size === cible.size && [...cible].every((k) => occ.has(k))) { fini = true; dessiner(); C.gagne(`Bravo, tu as construit ${D.nom} !`); }
    else if (Object.values(stock).every((n) => n === 0)) C.message.textContent = "Toutes les formes sont posées, mais ce n'est pas tout à fait ça. Clique sur une forme pour la reprendre.";
  }
  /* la palette : les familles de formes, la rotation */
  const palette = h("div", { class: "pz-palette" });
  function majPalette() {
    palette.innerHTML = "";
    Object.keys(stock).forEach((fam) => {
      const F = PZ_FAMILLES[fam], forme = fam === famille ? formeCourante() : F.formes[0];
      const mini = pzCases(forme, 0, 0).map((k) => {
        const [x, y, q] = k.split(","), t = 26, X = +x * t, Y = +y * t, cx = X + t / 2, cy = Y + t / 2;
        const p = { N: [[X, Y], [X + t, Y]], E: [[X + t, Y], [X + t, Y + t]], S: [[X + t, Y + t], [X, Y + t]], W: [[X, Y + t], [X, Y]] }[q];
        return `<polygon points="${p[0][0]},${p[0][1]} ${p[1][0]},${p[1][1]} ${cx},${cy}" fill="${F.couleurs[0]}" stroke="${F.couleurs[0]}"/>`;
      }).join("");
      const b = h("button", { class: "pz-forme" + (fam === famille ? " sel" : "") + (stock[fam] > 0 ? "" : " vide"), type: "button", "aria-label": F.nom },
        h("span", { html: `<svg viewBox="-2 -2 56 56" width="56" height="56">${mini}</svg>` }),
        h("small", null, stock[fam] === Infinity ? "∞" : `× ${stock[fam]}`));
      b.addEventListener("click", () => { famille = fam; rot = 0; Sound.click(); Voice.speak(F.nom); majPalette(); dessiner(); });
      if (NIVEAU.toutEnVoix) b.addEventListener("mouseenter", () => Voice.speak(F.nom));
      palette.appendChild(b);
    });
    palette.appendChild(h("button", { class: "btn small sky", onclick: () => { rot++; Sound.pop(); majPalette(); dessiner(); } }, "↻ Tourner"));
  }
  zone.append(plateau, palette);
  /* le modèle (niveau 1) */
  if (D && niveau === 1) {
    let m = "";
    D.pieces.forEach(([f, x, y], n) => pzCases(f, x, y).forEach((k) => {
      const [cx, cy, q] = k.split(","), t = 18, X = +cx * t, Y = +cy * t, mx = X + t / 2, my = Y + t / 2;
      const p = { N: [[X, Y], [X + t, Y]], E: [[X + t, Y], [X + t, Y + t]], S: [[X + t, Y + t], [X, Y + t]], W: [[X, Y + t], [X, Y]] }[q];
      m += `<polygon points="${p[0][0]},${p[0][1]} ${p[1][0]},${p[1][1]} ${mx},${my}" fill="${PZ_FAMILLES[famDe(f)].couleurs[n % 2]}" stroke="${PZ_FAMILLES[famDe(f)].couleurs[n % 2]}"/>`;
    }));
    C.boutons.before(h("div", { class: "pz-modele" }, h("small", null, "Le modèle"), h("span", { html: `<svg viewBox="0 0 ${COLS * 18} ${ROWS * 18}" width="${COLS * 18}" height="${ROWS * 18}"><rect width="100%" height="100%" fill="#fffdf6"/>${m}</svg>` })));
  }
  C.boutons.append(h("button", { class: "btn small white", onclick: () => App.go("puzzle", params) }, "🗑 Tout enlever"),
    boutonPhoto(() => posees.length ? { svg: posees.map((p) => p.cases.map((k) => `<polygon points="${tri(k)}" fill="${p.coul}" stroke="${p.coul}"/>`).join("")).join(""), vb: `0 0 ${COLS * T} ${ROWS * T}` } : null));
  majPalette(); dessiner();
});

/* ------------------------------------------------------------------ */
/* 3. Le quadrillage                                                    */
/* ------------------------------------------------------------------ */
const QD_COULEURS = ["#2e86de", "#e4572e", "#7bc950", "#f6c445", "#8e6cc9", "#ef7fa8", "#2b2236", "#f08a3c"];
/* niveau 1 : 6 × 6, une couleur ; niveau 2 : 8 × 8, deux couleurs ; niveau 3 : la symétrie (au CP : trois couleurs) */
function qdDefi(i) {
  const n = i % 5, niveau = Math.floor(i / 5) + 1;
  const sym = niveau === 3 && !NIVEAU.toutEnVoix;
  const taille = niveau === 1 ? 6 : 8, couleurs = niveau === 1 ? 1 : niveau === 2 ? 2 : sym ? 2 : 3;
  const nb = niveau === 1 ? 4 + n : niveau === 2 ? 8 + n * 2 : sym ? 5 + n * 2 : 10 + n * 2;
  const r = Construction.hasard(1000 + i * 7919 + (sym ? 0 : 17));
  const largeur = sym ? taille / 2 : taille;
  const cases = new Map();
  /* une tache qui grandit de proche en proche, pour que le dessin se tienne */
  let x = Math.floor(r() * largeur), y = Math.floor(r() * taille);
  cases.set(`${x},${y}`, 0);
  let essais = 0;
  while (cases.size < nb && essais++ < 500) {
    const [bx, by] = [...cases.keys()][Math.floor(r() * cases.size)].split(",").map(Number);
    const [dx, dy] = [[1, 0], [-1, 0], [0, 1], [0, -1]][Math.floor(r() * 4)];
    const nx = bx + dx, ny = by + dy;
    if (nx < 0 || ny < 0 || nx >= largeur || ny >= taille || cases.has(`${nx},${ny}`)) continue;
    cases.set(`${nx},${ny}`, Math.floor(r() * couleurs));
  }
  return { niveau, taille, couleurs, sym, cases };
}

App.register("quadrillage", (root, params) => {
  const u = Store.user; if (!u) return App.go("identif");
  if (!jeuConstruction("quadrillage").ouvert(u)) return App.go("atelier-construction");
  const libre = !!params.libre, i = Math.max(0, Math.min(params.defi || 0, 14));
  const D = libre ? { taille: 10, couleurs: 8, sym: false, cases: new Map() } : qdDefi(i);
  const consigne = libre ? "Dessine ce que tu veux, case par case : choisis une couleur, puis clique sur les cases."
    : D.sym ? "Complète le dessin pour qu'il soit symétrique : de l'autre côté de la ligne rouge, comme dans un miroir."
      : "Reproduis le modèle sur ta grille, case par case, avec les bonnes couleurs.";
  const C = cadreConstruction(root, "quadrillage", params, consigne);
  const N = D.taille, T = Math.floor((libre || D.sym ? 400 : 330) / N);
  const grille = new Map();   // ce que l'enfant a colorié
  /* symétrie : la moitié gauche est déjà dessinée ; le but est son reflet à droite */
  const but = new Map();
  if (D.sym) D.cases.forEach((c, k) => { const [x, y] = k.split(",").map(Number); but.set(`${N - 1 - x},${y}`, c); });
  else D.cases.forEach((c, k) => but.set(k, c));
  let couleur = 0, fini = false;
  const svgGrille = (cases, fixe, axe) => {
    let s = `<rect width="${N * T}" height="${N * T}" fill="#fff"/>`;
    if (fixe) fixe.forEach((c, k) => { const [x, y] = k.split(","); s += `<rect x="${x * T}" y="${y * T}" width="${T}" height="${T}" fill="${QD_COULEURS[c]}" opacity=".9"/>`; });
    cases.forEach((c, k) => { const [x, y] = k.split(","); s += `<rect x="${x * T}" y="${y * T}" width="${T}" height="${T}" fill="${QD_COULEURS[c]}"/>`; });
    for (let a = 0; a <= N; a++) s += `<line x1="${a * T}" y1="0" x2="${a * T}" y2="${N * T}" stroke="#b9c7d4"/><line x1="0" y1="${a * T}" x2="${N * T}" y2="${a * T}" stroke="#b9c7d4"/>`;
    if (axe) s += `<line x1="${N * T / 2}" y1="-4" x2="${N * T / 2}" y2="${N * T + 4}" stroke="#e4572e" stroke-width="4" stroke-dasharray="8 6"/>`;
    return `<svg viewBox="-3 -3 ${N * T + 6} ${N * T + 6}" width="${N * T + 6}" height="${N * T + 6}">${s}</svg>`;
  };
  const zone = h("div", { class: "qd-zone" });
  const modele = h("div", { class: "qd-modele" });
  const eleve = h("div", { class: "qd-eleve" });
  if (!libre && !D.sym) { modele.innerHTML = `<small>Le modèle</small>` + svgGrille(but); zone.appendChild(modele); }
  zone.appendChild(eleve);
  root.appendChild(zone);
  function dessiner() { eleve.innerHTML = (libre || D.sym ? "" : "<small>Ta grille</small>") + svgGrille(grille, D.sym ? D.cases : null, D.sym); }
  eleve.addEventListener("click", (e) => {
    if (fini) return;
    const svg = eleve.querySelector("svg"), r = svg.getBoundingClientRect();
    const k = (N * T + 6) / r.width;
    const x = Math.floor(((e.clientX - r.left) * k - 3) / T), y = Math.floor(((e.clientY - r.top) * k - 3) / T);
    if (x < 0 || y < 0 || x >= N || y >= N) return;
    if (D.sym && x < N / 2) { Sound.bad(); Voice.speak("Ce côté est déjà dessiné : colorie de l'autre côté de la ligne rouge."); return; }
    const cle = `${x},${y}`;
    if (grille.get(cle) === couleur) grille.delete(cle); else grille.set(cle, couleur);
    Sound.pop(); dessiner();
    if (!libre && grille.size === but.size && [...but].every(([kk, c]) => grille.get(kk) === c)) { fini = true; C.gagne(D.sym ? "Bravo, ton dessin est bien symétrique !" : "Bravo, c'est exactement le modèle !"); }
  });
  const palette = h("div", { class: "qd-palette" });
  const nbCouleurs = libre ? QD_COULEURS.length : D.couleurs;
  QD_COULEURS.slice(0, nbCouleurs).forEach((c, n) => {
    const b = h("button", { class: "swatch" + (n === couleur ? " sel" : ""), style: { background: c }, "aria-label": "Couleur " + (n + 1) });
    b.addEventListener("click", () => { couleur = n; Sound.pop(); palette.querySelectorAll(".swatch").forEach((x) => x.classList.toggle("sel", x === b)); });
    palette.appendChild(b);
  });
  zone.appendChild(palette);
  C.boutons.append(h("button", { class: "btn small white", onclick: () => { grille.clear(); fini = false; dessiner(); } }, "🗑 Effacer"),
    boutonPhoto(() => {
      const toutes = new Map([...(D.sym ? D.cases : []), ...grille]);
      if (!toutes.size) return null;
      return { svg: [...toutes].map(([k, c]) => { const [x, y] = k.split(","); return `<rect x="${x * 10}" y="${y * 10}" width="10" height="10" fill="${QD_COULEURS[c]}"/>`; }).join(""), vb: `0 0 ${N * 10} ${N * 10}` };
    }));
  dessiner();
});

/* ------------------------------------------------------------------ */
/* 4. Les cubes                                                         */
/* ------------------------------------------------------------------ */
/* une construction = des piles de cubes posées sur un plancher n × n : h[y][x] = hauteur de la pile.
   Vue en perspective (« isométrique ») : x part vers la droite et vers l'avant, y vers la gauche et vers l'avant.
   niveau 1 (défis 1 à 5) : construis ce que tu vois ; niveau 2 : compte les cubes, même ceux qu'on ne voit pas ;
   niveau 3 : trouve la vue de dessus. */
const CUBES_COUL = ["#5bc0eb", "#f6c445", "#e4572e", "#7bc950", "#8e6cc9"];   // une couleur par étage
const cubesFonce = (hex, k) => { const n = parseInt(hex.slice(1), 16); const f = (v) => Math.max(0, Math.round(v * k)); return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`; };
/* le dessin en perspective : a = demi-largeur d'une case, b = demi-hauteur, c = hauteur d'un cube */
function cubesIso(H, a = 34) {
  const n = H.length, b = a * 0.58, c = a * 1.05;
  const max = Math.max(1, ...H.flat());
  const w = 2 * n * a, ht = 2 * n * b + max * c;
  const ox = n * a, oy = max * c;
  const P = (x, y, z) => [ox + (x - y) * a, oy + (x + y) * b - z * c];
  const poly = (pts, fill) => `<path d="M${pts.map((p) => p.map((v) => v.toFixed(1)).join(" ")).join(" L")} Z" fill="${fill}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
  let s = "";
  /* le plancher */
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) s += poly([P(x, y, 0), P(x + 1, y, 0), P(x + 1, y + 1, 0), P(x, y + 1, 0)], "#e9e2cf");
  /* les piles, du fond vers l'avant (le peintre) */
  const ordre = [];
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) ordre.push([x, y]);
  ordre.sort((p, q) => (p[0] + p[1]) - (q[0] + q[1]));
  for (const [x, y] of ordre) for (let z = 0; z < H[y][x]; z++) {
    const coul = CUBES_COUL[z % CUBES_COUL.length];
    s += poly([P(x, y + 1, z), P(x + 1, y + 1, z), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)], cubesFonce(coul, 0.78));   // face avant gauche
    s += poly([P(x + 1, y, z), P(x + 1, y + 1, z), P(x + 1, y + 1, z + 1), P(x + 1, y, z + 1)], cubesFonce(coul, 0.62));   // face avant droite
    s += poly([P(x, y, z + 1), P(x + 1, y, z + 1), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)], coul);                     // dessus
  }
  return `<svg viewBox="-4 -4 ${w + 8} ${ht + 8}" width="${w + 8}" height="${ht + 8}" aria-hidden="true">${s}</svg>`;
}
/* la vue de dessus, dessinée comme le plancher (même sens que la perspective) : les cases occupées sont colorées */
function cubesDessus(H, a = 30, onclick) {
  const n = H.length, b = a * 0.58, w = 2 * n * a, ht = 2 * n * b;
  const P = (x, y) => [n * a + (x - y) * a, (x + y) * b];
  let s = "";
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const pts = [P(x, y), P(x + 1, y), P(x + 1, y + 1), P(x, y + 1)].map((p) => p.map((v) => v.toFixed(1)).join(" ")).join(" L");
    const k = H[y][x];
    s += `<path data-x="${x}" data-y="${y}" d="M${pts} Z" fill="${k ? CUBES_COUL[Math.min(k, CUBES_COUL.length) - 1] : "#fff8ea"}" stroke="${INK}" stroke-width="2"/>`;
    if (onclick) { const [cx, cy] = P(x + 0.5, y + 0.5); s += `<text x="${cx}" y="${cy + 7}" text-anchor="middle" font-size="20" font-weight="700" fill="${INK}" pointer-events="none">${k || ""}</text>`; }
  }
  return `<svg viewBox="-4 -4 ${w + 8} ${ht + 8}" width="${w + 8}" height="${ht + 8}" aria-hidden="true">${s}</svg>`;
}
const cubesVide = (n) => Array.from({ length: n }, () => Array(n).fill(0));
const cubesTotal = (H) => H.flat().reduce((s, v) => s + v, 0);
const cubesCle = (H) => H.map((l) => l.join("")).join("/");
const cubesDessusCle = (H) => H.map((l) => l.map((v) => (v ? 1 : 0)).join("")).join("/");
function cubesDefi(i) {
  const niveau = Math.floor(i / 5) + 1, k = i % 5, cp = !!NIVEAU.toutEnVoix;
  const r = Construction.hasard(5000 + i * 104729);
  const n = 3, maxH = niveau === 1 ? (k < 2 ? 1 : 2) : cp ? 2 : 3;
  const nbPiles = niveau === 1 ? 3 + Math.min(k, 3) : 4 + Math.min(k, 4);
  const H = cubesVide(n);
  /* des piles posées au hasard, qui se touchent */
  let x = Math.floor(r() * n), y = Math.floor(r() * n), essais = 0;
  H[y][x] = 1 + Math.floor(r() * maxH);
  while (H.flat().filter((v) => v).length < nbPiles && essais++ < 300) {
    const pleines = []; for (let yy = 0; yy < n; yy++) for (let xx = 0; xx < n; xx++) if (H[yy][xx]) pleines.push([xx, yy]);
    const [bx, by] = pleines[Math.floor(r() * pleines.length)];
    const [dx, dy] = [[1, 0], [-1, 0], [0, 1], [0, -1]][Math.floor(r() * 4)];
    const nx = bx + dx, ny = by + dy;
    if (nx < 0 || ny < 0 || nx >= n || ny >= n || H[ny][nx]) continue;
    H[ny][nx] = 1 + Math.floor(r() * maxH);
  }
  /* au niveau 2, au moins une pile haute à l'avant, pour qu'il y ait des cubes cachés */
  if (niveau === 2 && !H.flat().some((v) => v >= 2)) H[n - 1][n - 1] = 2;
  return { niveau, H };
}
/* trois vues de dessus : la bonne, et deux fausses (en miroir, tournée, ou une case déplacée) */
function cubesFaussesVues(H, r) {
  const n = H.length, bonne = cubesDessusCle(H), vues = new Map([[bonne, H]]);
  const essais = [
    H.map((l) => l.slice().reverse()),                                   // miroir gauche-droite
    H.slice().reverse(),                                                 // miroir avant-arrière
    H.map((l, y) => l.map((_, x) => H[n - 1 - x][y])),                   // un quart de tour
    H.map((l, y) => l.map((_, x) => H[x][y])),                           // en diagonale
  ];
  for (let t = 0; t < 30; t++) {   // une case déplacée
    const G = H.map((l) => l.slice()), pleines = [], vides = [];
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) (G[y][x] ? pleines : vides).push([x, y]);
    if (!vides.length) break;
    const [px, py] = pleines[Math.floor(r() * pleines.length)], [vx, vy] = vides[Math.floor(r() * vides.length)];
    G[vy][vx] = G[py][px]; G[py][px] = 0; essais.push(G);
  }
  for (const G of essais) { const k = cubesDessusCle(G); if (!vues.has(k) && vues.size < 3) vues.set(k, G); }
  return [...vues.entries()].map(([k, G]) => ({ G, bon: k === bonne }));
}

App.register("cubes", (root, params) => {
  const u = Store.user; if (!u) return App.go("identif");
  if (!jeuConstruction("cubes").ouvert(u)) return App.go("atelier-construction");
  const libre = !!params.libre, i = Math.max(0, Math.min(params.defi || 0, 14));
  const D = libre ? { niveau: 0, H: cubesVide(4) } : cubesDefi(i);
  const consigne = libre ? "Construis ce que tu veux : clique sur une case du plancher pour ajouter un cube. Choisis « enlever » pour en retirer."
    : D.niveau === 1 ? "Construis la même chose que le modèle : clique sur une case du plancher pour poser un cube de plus."
      : D.niveau === 2 ? "Combien de cubes faut-il pour cette construction ? Attention : certains sont cachés derrière ou dessous !"
        : "Regarde bien la construction. Si tu étais un oiseau juste au-dessus, que verrais-tu ? Choisis la bonne vue de dessus.";
  const C = cadreConstruction(root, "cubes", params, consigne);
  const zone = h("div", { class: "cb-zone" });
  root.appendChild(zone);
  let fini = false;
  if (libre || D.niveau === 1) {
    const n = D.H.length, maxH = libre ? 4 : 3, E = cubesVide(n);
    let enlever = false;
    const modele = h("div", { class: "cb-boite" }, h("small", null, "Le modèle"), h("div", { html: cubesIso(D.H, 30) }));
    const vue = h("div", { class: "cb-boite" }, h("small", null, libre ? "Ta construction" : "Ta construction"));
    const vueDessin = h("div");
    vue.appendChild(vueDessin);
    const sol = h("div", { class: "cb-boite cb-sol" }, h("small", null, "Le plancher : clique pour poser un cube"));
    const solDessin = h("div");
    sol.appendChild(solDessin);
    const dessiner = () => {
      vueDessin.innerHTML = cubesIso(E, libre ? 26 : 30);
      solDessin.innerHTML = cubesDessus(E, libre ? 34 : 40, true);
      solDessin.querySelectorAll("path[data-x]").forEach((p) => p.addEventListener("click", () => {
        if (fini) return;
        const x = Number(p.dataset.x), y = Number(p.dataset.y);
        if (enlever) { if (E[y][x]) E[y][x]--; else { Sound.bad(); return; } }
        else if (E[y][x] < maxH) E[y][x]++;
        else { Sound.bad(); Voice.speak("Cette pile est déjà assez haute !"); return; }
        Sound.pop(); dessiner();
        if (!libre && cubesCle(E) === cubesCle(D.H)) { fini = true; C.gagne("Bravo, c'est exactement le modèle !"); }
      }));
    };
    zone.append(...(libre ? [] : [modele]), vue, sol);
    const outil = h("button", { class: "btn small white", onclick: () => { enlever = !enlever; outil.textContent = enlever ? "➖ Enlever (actif)" : "➖ Enlever"; outil.classList.toggle("violet", enlever); Sound.click(); } }, "➖ Enlever");
    C.boutons.append(outil, h("button", { class: "btn small white", onclick: () => { for (const l of E) l.fill(0); fini = false; dessiner(); } }, "🗑 Tout enlever"));
    if (libre) C.boutons.append(boutonPhoto(() => (cubesTotal(E) ? { svg: cubesIso(E, 26).replace(/^<svg[^>]*>|<\/svg>$/g, ""), vb: cubesIso(E, 26).match(/viewBox="([^"]+)"/)[1] } : null)));
    dessiner();
  } else if (D.niveau === 2) {
    const total = cubesTotal(D.H), choix = [...new Set([total, total - 1, total + 1, total - 2, total + 2].filter((v) => v > 0))].slice(0, 4).sort((a, b) => a - b);
    zone.appendChild(h("div", { class: "cb-boite grand", html: cubesIso(D.H, 40) }));
    const rangee = h("div", { class: "cb-choix" });
    let essai = 0;
    choix.forEach((v) => {
      const b = h("button", { class: "btn white cb-nombre", onclick: () => {
        if (fini) return;
        if (v === total) { fini = true; b.classList.add("green"); C.gagne(`Oui, il y a ${total} cubes !`); }
        else { essai++; b.disabled = true; C.rate(essai === 1 ? "Pas tout à fait. Pense aux cubes cachés sous les piles et derrière !" : "Compte pile par pile : chaque pile a autant de cubes que d'étages."); }
      } }, String(v));
      if (NIVEAU.toutEnVoix) b.addEventListener("mouseenter", () => Voice.speak(String(v)));
      rangee.appendChild(b);
    });
    zone.appendChild(rangee);
  } else {
    zone.appendChild(h("div", { class: "cb-boite grand", html: cubesIso(D.H, 36) }));
    const rangee = h("div", { class: "cb-choix" });
    const vues = shuffle(cubesFaussesVues(D.H, Construction.hasard(9000 + i)));
    vues.forEach((v) => {
      const b = h("button", { class: "cb-vue", type: "button", html: cubesDessus(v.G, 24), "aria-label": "Une vue de dessus" });
      b.addEventListener("click", () => {
        if (fini) return;
        if (v.bon) { fini = true; b.classList.add("bon"); C.gagne("Oui, c'est bien la vue de dessus !"); }
        else { b.classList.add("faux"); b.disabled = true; C.rate("Non : compare chaque case du plancher. Une case colorée = une pile de cubes."); }
      });
      rangee.appendChild(b);
    });
    zone.appendChild(rangee);
  }
});

/* ------------------------------------------------------------------ */
/* 5. La machine de Boulon                                              */
/* ------------------------------------------------------------------ */
/* niveau 1 (défis 1 à 5) : les tuyaux — tourner les tuyaux pour amener l'eau du robinet au seau ;
   niveau 2 : les engrenages — poser des roues dans les trous pour relier le moteur à la lampe ;
   niveau 3 : le sens des roues — chaque roue tourne dans l'autre sens que sa voisine : dans quel sens tourne la dernière ? */
const MQ_DIRS = [[0, -1, 1, 4], [1, 0, 2, 8], [0, 1, 4, 1], [-1, 0, 8, 2]];   // [dx, dy, ce côté, le côté d'en face] : haut 1, droite 2, bas 4, gauche 8
const mqTourner = (m) => ((m << 1) | (m >> 3)) & 15;   // un quart de tour dans le sens des aiguilles d'une montre
function mqTuyaux(i) {
  const k = i % 5, r = Construction.hasard(7000 + i * 31337);
  const W = 4 + (k >= 2 ? 1 : 0), H = 3 + (k >= 3 ? 1 : 0);
  const ys = Math.floor(r() * H), yt = Math.floor(r() * H);
  /* un chemin du bord gauche (ys) au bord droit (yt), en allant vers la droite, avec des détours */
  const chemin = [[0, ys]];
  let x = 0, y = ys;
  while (x < W - 1 || y !== yt) {
    const options = [];
    if (x < W - 1) options.push([1, 0], [1, 0]);
    if (y < H - 1 && !chemin.some(([a, b]) => a === x && b === y + 1)) options.push([0, 1]);
    if (y > 0 && !chemin.some(([a, b]) => a === x && b === y - 1)) options.push([0, -1]);
    if (x === W - 1) { options.length = 0; options.push([0, yt > y ? 1 : -1]); }
    const [dx, dy] = options[Math.floor(r() * options.length)];
    x += dx; y += dy; chemin.push([x, y]);
  }
  /* les ouvertures de chaque tuyau du chemin */
  const T = Array.from({ length: H }, () => Array(W).fill(0));
  chemin.forEach(([cx, cy], n) => {
    const avant = n === 0 ? [cx - 1, cy] : chemin[n - 1], apres = n === chemin.length - 1 ? [cx + 1, cy] : chemin[n + 1];
    for (const [px, py] of [avant, apres]) MQ_DIRS.forEach(([dx, dy, bit]) => { if (px === cx + dx && py === cy + dy) T[cy][cx] |= bit; });
  });
  /* les autres cases : des tuyaux au hasard, pour faire chercher */
  for (let yy = 0; yy < H; yy++) for (let xx = 0; xx < W; xx++) if (!T[yy][xx]) T[yy][xx] = r() < 0.5 ? 5 : 3;
  /* on mélange en tournant chaque tuyau */
  const tours = T.map((l) => l.map(() => Math.floor(r() * 4)));
  const M = T.map((l, yy) => l.map((m, xx) => { let v = m; for (let t = 0; t < tours[yy][xx]; t++) v = mqTourner(v); return v; }));
  const D = { W, H, ys, yt, M };
  /* jamais déjà résolu au départ */
  while (mqEau(D).arrive) M[ys][0] = mqTourner(M[ys][0]);
  return D;
}
/* l'eau coule depuis le robinet : les cases remplies, et si elle arrive au seau */
function mqEau(D) {
  const pleines = new Set(), file = [];
  if (D.M[D.ys][0] & 8) { pleines.add(`0,${D.ys}`); file.push([0, D.ys]); }
  while (file.length) {
    const [x, y] = file.shift();
    for (const [dx, dy, bit, face] of MQ_DIRS) {
      if (!(D.M[y][x] & bit)) continue;
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= D.W || ny >= D.H || !(D.M[ny][nx] & face) || pleines.has(`${nx},${ny}`)) continue;
      pleines.add(`${nx},${ny}`); file.push([nx, ny]);
    }
  }
  return { pleines, arrive: pleines.has(`${D.W - 1},${D.yt}`) && !!(D.M[D.yt][D.W - 1] & 2) };
}
function mqTuile(m, plein, T) {
  const c = T / 2, e = 14, col = plein ? "#2e86de" : "#9aa4b5";
  let s = `<rect width="${T}" height="${T}" rx="8" fill="#fff8ea" stroke="#c9b993" stroke-width="2"/>`;
  MQ_DIRS.forEach(([dx, dy, bit]) => { if (m & bit) s += `<path d="M${c} ${c} L${c + dx * c} ${c + dy * c}" stroke="${INK}" stroke-width="${e + 6}" stroke-linecap="${dx || dy ? "butt" : "round"}"/><path d="M${c} ${c} L${c + dx * c} ${c + dy * c}" stroke="${col}" stroke-width="${e}"/>`; });
  s += `<circle cx="${c}" cy="${c}" r="${e / 2 + 3}" fill="${col}" stroke="${INK}" stroke-width="3"/>`;
  return s;
}
/* une roue dentée */
function mqRoue(r, couleur) {
  const dents = 10, pts = [];
  for (let k = 0; k < dents * 2; k++) { const a = (Math.PI * k) / dents, rr = k % 2 ? r * 0.8 : r; pts.push(`${(Math.cos(a) * rr).toFixed(1)} ${(Math.sin(a) * rr).toFixed(1)}`); }
  return `<path d="M${pts.join(" L")} Z" fill="${couleur}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><circle r="${r * 0.28}" fill="#fff8ea" stroke="${INK}" stroke-width="3"/>`;
}
function mqEngrenages(i) {
  const k = i % 5, r = Construction.hasard(8000 + i * 7919);
  const W = 5 + (k >= 3 ? 1 : 0), H = 3 + (k >= 1 ? 1 : 0);
  for (let t = 0; t < 50; t++) {
    const m = [0, Math.floor(r() * H)], l = [W - 1, Math.floor(r() * H)];
    const bloques = new Set();
    const nb = 1 + Math.floor(r() * (2 + k));
    for (let b = 0; b < nb; b++) { const bx = 1 + Math.floor(r() * (W - 2)), by = Math.floor(r() * H); bloques.add(`${bx},${by}`); }
    /* le plus court chemin de trous entre le moteur et la lampe */
    const dist = new Map([[`${m[0]},${m[1]}`, 0]]), file = [m];
    while (file.length) {
      const [x, y] = file.shift();
      for (const [dx, dy] of MQ_DIRS) { const nx = x + dx, ny = y + dy, cle = `${nx},${ny}`;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H || bloques.has(cle) || dist.has(cle)) continue;
        dist.set(cle, dist.get(`${x},${y}`) + 1); file.push([nx, ny]); }
    }
    const d = dist.get(`${l[0]},${l[1]}`);
    if (d && d >= 3) return { W, H, moteur: m, lampe: l, bloques, stock: d - 1 };
  }
  return { W: 5, H: 3, moteur: [0, 1], lampe: [4, 1], bloques: new Set(), stock: 3 };
}
/* les roues reliées au moteur, et le sens de chacune (1 = sens des aiguilles d'une montre, -1 = l'autre sens) */
function mqTransmission(D, roues) {
  const sens = new Map([[`${D.moteur[0]},${D.moteur[1]}`, 1]]), file = [D.moteur];
  const roue = (x, y) => roues.has(`${x},${y}`) || (x === D.lampe[0] && y === D.lampe[1]);
  while (file.length) {
    const [x, y] = file.shift(), s = sens.get(`${x},${y}`);
    for (const [dx, dy] of MQ_DIRS) { const nx = x + dx, ny = y + dy, cle = `${nx},${ny}`;
      if (!roue(nx, ny) || sens.has(cle)) continue; sens.set(cle, -s); file.push([nx, ny]); }
  }
  return sens;
}
function mqChaine(i) {
  const k = i % 5, r = Construction.hasard(9100 + i * 6151);
  const n = 3 + k + Math.floor(r() * 2);           // de 3 à 8 roues, moteur compris
  const pts = [[0, 1]];
  /* une roue nouvelle ne touche que la précédente : la chaîne ne se replie pas sur elle-même */
  const touche = (x, y, sauf) => pts.some(([a, b], k) => k !== sauf && Math.abs(a - x) + Math.abs(b - y) <= 1);
  for (let t = 1; t < n; t++) {
    const [x, y] = pts[t - 1];
    const options = [[x + 1, y], [x, y - 1], [x, y + 1]].filter(([a, b], k) => b >= 0 && b <= 2 && (k === 0 || r() < 0.4) && !touche(a, b, t - 1));
    pts.push(options[Math.floor(r() * options.length)] || [x + 1, y]);
  }
  return { pts, sensFin: (n - 1) % 2 === 0 ? 1 : -1 };
}

App.register("machine", (root, params) => {
  const u = Store.user; if (!u) return App.go("identif");
  if (!jeuConstruction("machine").ouvert(u)) return App.go("atelier-construction");
  const libre = !!params.libre, i = Math.max(0, Math.min(params.defi || 0, 14)), niveau = libre ? 2 : Math.floor(i / 5) + 1;
  const consigne = libre ? "Pose des roues dans les trous : quand elles relient le moteur à la lampe, elle s'allume ! Clique sur une roue pour l'enlever."
    : niveau === 1 ? "Clique sur les tuyaux pour les tourner. Amène l'eau du robinet jusqu'au seau !"
      : niveau === 2 ? "Pose des roues dentées dans les trous pour relier le moteur à la lampe. Une roue fait tourner sa voisine."
        : "Le moteur tourne dans le sens de la flèche. Chaque roue fait tourner sa voisine dans l'autre sens. Dans quel sens tourne la roue de la lampe ?";
  const C = cadreConstruction(root, "machine", params, consigne);
  const zone = h("div", { class: "mq-zone" });
  root.appendChild(zone);
  let fini = false;

  if (niveau === 1) {
    const D = mqTuyaux(i), T = Math.floor(Math.min(590 / (D.W + 2), 420 / D.H));
    const svgNS = (x) => `<svg viewBox="0 0 ${(D.W + 2) * T} ${D.H * T}" width="${(D.W + 2) * T}" height="${D.H * T}">${x}</svg>`;
    const plateau = h("div", { class: "mq-plateau" });
    zone.appendChild(plateau);
    const dessiner = () => {
      const eau = mqEau(D);
      let s = "";
      /* le robinet à gauche, le seau à droite */
      s += `<g transform="translate(0 ${D.ys * T})"><rect x="${T * 0.15}" y="${T * 0.3}" width="${T * 0.85}" height="${T * 0.4}" fill="#9aa4b5" stroke="${INK}" stroke-width="3"/><rect x="${T * 0.1}" y="${T * 0.1}" width="${T * 0.3}" height="${T * 0.25}" rx="4" fill="#e4572e" stroke="${INK}" stroke-width="3"/></g>`;
      s += `<g transform="translate(${(D.W + 1) * T} ${D.yt * T})"><rect x="0" y="${T * 0.35}" width="${T * 0.3}" height="${T * 0.3}" fill="${eau.arrive ? "#2e86de" : "#9aa4b5"}" stroke="${INK}" stroke-width="3"/>
        <path d="M${T * 0.25} ${T * 0.45} h${T * 0.65} l-${T * 0.1} ${T * 0.45} h-${T * 0.45} z" fill="#c98a3c" stroke="${INK}" stroke-width="3"/>${eau.arrive ? `<path d="M${T * 0.3} ${T * 0.55} h${T * 0.55} l-${T * 0.07} ${T * 0.3} h-${T * 0.41} z" fill="#5bc0eb"/>` : ""}</g>`;
      for (let y = 0; y < D.H; y++) for (let x = 0; x < D.W; x++) s += `<g class="mq-tuile" data-x="${x}" data-y="${y}" transform="translate(${(x + 1) * T} ${y * T})">${mqTuile(D.M[y][x], eau.pleines.has(`${x},${y}`), T)}</g>`;
      plateau.innerHTML = svgNS(s);
      plateau.querySelectorAll(".mq-tuile").forEach((g) => g.addEventListener("click", () => {
        if (fini) return;
        const x = Number(g.dataset.x), y = Number(g.dataset.y);
        D.M[y][x] = mqTourner(D.M[y][x]); Sound.pop(); dessiner();
        if (mqEau(D).arrive) { fini = true; C.gagne("L'eau arrive dans le seau. Bravo, plombier !"); }
      }));
    };
    dessiner();
  } else if (niveau === 2) {
    const D = libre ? { W: 7, H: 5, moteur: [0, 2], lampe: [6, 2], bloques: new Set(), stock: 99 } : mqEngrenages(i);
    const roues = new Set(), T = Math.floor(Math.min(600 / D.W, 440 / D.H));
    const plateau = h("div", { class: "mq-plateau" }), compteur = h("p", { class: "ac-etat" });
    zone.appendChild(plateau);
    C.texte.after(compteur);
    let tour = 0, anim = null;
    const dessiner = () => {
      const sens = mqTransmission(D, roues), allumee = sens.has(`${D.lampe[0]},${D.lampe[1]}`);
      let s = "";
      for (let y = 0; y < D.H; y++) for (let x = 0; x < D.W; x++) {
        const cle = `${x},${y}`, cx = (x + 0.5) * T, cy = (y + 0.5) * T;
        if (D.bloques.has(cle)) { s += `<rect x="${x * T + 6}" y="${y * T + 6}" width="${T - 12}" height="${T - 12}" rx="10" fill="#8a7a6a" stroke="${INK}" stroke-width="3"/>`; continue; }
        s += `<circle class="mq-trou" data-x="${x}" data-y="${y}" cx="${cx}" cy="${cy}" r="${T * 0.18}" fill="#d9cdb6" stroke="${INK}" stroke-width="2"/>`;
        const estMoteur = x === D.moteur[0] && y === D.moteur[1], estLampe = x === D.lampe[0] && y === D.lampe[1];
        if (estMoteur || estLampe || roues.has(cle)) {
          const sn = sens.get(cle) || 0;
          s += `<g class="mq-roue" data-x="${x}" data-y="${y}" transform="translate(${cx} ${cy}) rotate(${(tour * sn).toFixed(1)})">${mqRoue(T * 0.5, estMoteur ? "#e4572e" : estLampe ? "#f6c445" : "#8e6cc9")}</g>`;
        }
        if (estMoteur) s += `<text x="${cx}" y="${cy + T * 0.62}" text-anchor="middle" font-size="14" font-weight="700" fill="${INK}" pointer-events="none">moteur</text>`;
        if (estLampe) s += `<g transform="translate(${cx + T * 0.32} ${cy - T * 0.42})" pointer-events="none"><circle r="${T * 0.16}" fill="${allumee ? "#fff27a" : "#e8e3d0"}" stroke="${INK}" stroke-width="3"/>${allumee ? `<circle r="${T * 0.28}" fill="#fff27a" opacity=".45"/>` : ""}</g>`;
      }
      plateau.innerHTML = `<svg viewBox="0 0 ${D.W * T} ${D.H * T}" width="${D.W * T}" height="${D.H * T}">${s}</svg>`;
      plateau.querySelectorAll(".mq-trou, .mq-roue").forEach((el) => el.addEventListener("click", () => {
        if (fini) return;
        const x = Number(el.dataset.x), y = Number(el.dataset.y), cle = `${x},${y}`;
        if ((x === D.moteur[0] && y === D.moteur[1]) || (x === D.lampe[0] && y === D.lampe[1])) return;
        if (roues.has(cle)) roues.delete(cle);
        else if (roues.size >= D.stock) { Sound.bad(); Voice.speak("Tu n'as plus de roues ! Enlève une roue mal placée."); return; }
        else roues.add(cle);
        Sound.pop(); dessiner();
        if (!libre && mqTransmission(D, roues).has(`${D.lampe[0]},${D.lampe[1]}`)) { fini = true; C.gagne("La lampe s'allume ! Toutes les roues tournent ensemble."); }
      }));
      compteur.textContent = libre ? "" : `Roues à poser : ${D.stock - roues.size} sur ${D.stock}`;
    };
    /* les roues tournent doucement */
    const pas = () => { tour = (tour + 2) % 360; plateau.querySelectorAll(".mq-roue").forEach((g) => { const m = g.getAttribute("transform").match(/translate\(([^)]+)\)/); const x = g.dataset.x + "," + g.dataset.y; const sn = mqTransmission(D, roues).get(x) || 0; g.setAttribute("transform", `translate(${m[1]}) rotate(${(tour * sn).toFixed(1)})`); }); anim = requestAnimationFrame(pas); };
    if (!window.matchMedia || !window.matchMedia("(prefers-reduced-motion: reduce)").matches) anim = requestAnimationFrame(pas);
    App.onLeave(() => anim && cancelAnimationFrame(anim));
    C.boutons.append(h("button", { class: "btn small white", onclick: () => { roues.clear(); fini = false; dessiner(); } }, "🗑 Tout enlever"));
    dessiner();
  } else {
    const D = mqChaine(i), T = 76;
    const maxX = Math.max(...D.pts.map((p) => p[0])) + 1;
    const plateau = h("div", { class: "mq-plateau" });
    zone.appendChild(plateau);
    let tour = 0, anim = null, montre = false;
    const dessiner = () => {
      let s = "";
      D.pts.forEach(([x, y], n) => {
        const cx = (x + 0.5) * T + 60, cy = (y + 0.5) * T + 20, sn = n % 2 ? -1 : 1;
        const coul = n === 0 ? "#e4572e" : n === D.pts.length - 1 ? "#f6c445" : "#8e6cc9";
        s += `<g transform="translate(${cx} ${cy}) rotate(${montre || n === 0 ? (tour * sn).toFixed(1) : 0})">${mqRoue(T * 0.5, coul)}</g>`;
      });
      const [mx, my] = D.pts[0];
      const fy = (my + 0.5) * T + 20;
      s += `<path d="M24 ${fy + 22} a24 24 0 1 1 22 -8" fill="none" stroke="#e4572e" stroke-width="5" stroke-linecap="round"/><path d="M50 ${fy + 8} l-14 2 l8 12 z" fill="#e4572e"/>`;
      const [lx, ly] = D.pts[D.pts.length - 1];
      s += `<g transform="translate(${(lx + 0.5) * T + 90} ${(ly + 0.5) * T - 18})"><circle r="13" fill="${fini ? "#fff27a" : "#e8e3d0"}" stroke="${INK}" stroke-width="3"/></g>`;
      plateau.innerHTML = `<svg viewBox="0 0 ${maxX * T + 110} ${3 * T + 40}" width="${Math.min(600, maxX * T + 110)}">${s}</svg>`;
    };
    const pas = () => { tour = (tour + 2) % 360; dessiner(); anim = requestAnimationFrame(pas); };
    anim = requestAnimationFrame(pas);
    App.onLeave(() => anim && cancelAnimationFrame(anim));
    const rangee = h("div", { class: "cb-choix" });
    [[1, "↻ Comme les aiguilles d'une montre"], [-1, "↺ Dans l'autre sens"]].forEach(([v, txt]) => {
      const b = h("button", { class: "btn white mq-sens", onclick: () => {
        if (fini) return;
        if (v === D.sensFin) { fini = true; montre = true; b.classList.add("green"); C.gagne("Oui ! Une roue sur deux tourne dans le même sens."); }
        else { b.disabled = true; C.rate("Non : suis les roues une par une, en changeant de sens à chaque fois."); }
      } }, txt);
      if (NIVEAU.toutEnVoix) b.addEventListener("mouseenter", () => Voice.speak(txt.slice(2)));
      rangee.appendChild(b);
    });
    zone.appendChild(rangee);
    dessiner();
  }
});

/* ------------------------------------------------------------------ */
/* L'objet de l'atelier (le panneau à outils) et les médailles          */
/* ------------------------------------------------------------------ */
objetAtelier({
  id: "construction", ecran: "atelier-construction", ordre: 60, label: "L'atelier de construction",
  desc: "Des jeux pour construire : la tour, le puzzle des formes, le quadrillage, les cubes, la machine de Boulon. Il s'ouvre quand tu bats Zigzag.",
  svg: () => {
    const u = Store.data && Store.user, ouvert = u && u.unlocked && u.unlocked.construction;
    return `<rect x="210" y="270" width="196" height="78" rx="8" fill="#c98a3c" ${S}/>
      <g fill="#8a5a24">${[226, 250, 274, 298, 322, 346, 370, 394].map((x) => `<circle cx="${x}" cy="284" r="3"/>`).join("")}</g>
      <path d="M236 292 v46" ${S} stroke-width="7"/><path d="M236 292 v46" stroke="#a86a2c" stroke-width="3"/><rect x="222" y="288" width="30" height="12" rx="3" fill="#9aa4b5" ${S}/>
      <path d="M270 298 v40" ${S} stroke-width="7"/><path d="M270 298 v40" stroke="#9aa4b5" stroke-width="3"/><path d="M262 288 a10 10 0 1 0 16 0 l-4 8 h-8 z" fill="#9aa4b5" ${S}/>
      <path d="M296 296 v42 h36 z" fill="#f6c445" ${S}/>
      <rect x="344" y="292" width="14" height="48" rx="2" fill="#5bc0eb" ${S}/><path d="M344 302 h6 M344 312 h6 M344 322 h6 M344 332 h6" ${S} stroke-width="2"/>
      <circle cx="386" cy="318" r="14" fill="#8e6cc9" ${S}/><circle cx="386" cy="318" r="5" fill="#2f6f73" ${S}/>
      ${ouvert ? "" : `<g ${S}><rect x="292" y="300" width="34" height="28" rx="5" fill="#f6c445"/><path d="M299 300 v-9 a10 10 0 0 1 20 0 v9" fill="none" stroke-width="4"/></g>`}`;
  },
});

ajouterMedailles([
  { id: "batisseur", icone: "🧱", nom: "Bâtisseur", desc: "Réussis 10 défis de construction.", ok: (u) => Construction.total(u) >= 10 },
  { id: "architecte", icone: "📐", nom: "Architecte", desc: "Réussis tous les défis d'un jeu de construction.",
    ok: (u) => JEUX_CONSTRUCTION.some((j) => !j.bientot && Construction.etat(u)[j.id] >= j.nb) },
], { apres: "champion" });
