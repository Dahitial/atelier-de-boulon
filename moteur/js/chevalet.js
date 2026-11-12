/* L'Atelier de Boulon — le chevalet de création (pour tous les niveaux).
   Deux couches : la peinture (pinceau, gomme, pot de peinture sur les zones fermées, coloriages)
   et les éléments qu'on peut reprendre (formes et images : déplacer, agrandir, tourner,
   copier, changer de couleur, mettre devant ou derrière).
   L'élève garde ses dessins dans sa galerie (12 au plus) et peut en accrocher un dans l'atelier.
   u.chevalet = { dessins: [{ date, img }], accroche: n | null, photos: [{ date, svg, vb }], missions: { id: date } } */
"use strict";

const Chevalet = {
  MAX_DESSINS: 12, MAX_PHOTOS: 8,
  etat(u) {
    if (!u.chevalet || typeof u.chevalet !== "object" || Array.isArray(u.chevalet)) u.chevalet = {};
    const c = u.chevalet;
    for (const k of ["dessins", "photos"]) if (!Array.isArray(c[k])) c[k] = [];
    if (!c.missions || typeof c.missions !== "object") c.missions = {};
    if (!(Number.isInteger(c.accroche) && c.dessins[c.accroche])) c.accroche = null;
    return c;
  },
  /* enregistre, et annule si le navigateur n'a plus de place (sinon plus rien ne serait sauvegardé) */
  sauverOuAnnuler(annuler) {
    try { localStorage.setItem(Store.KEY, JSON.stringify(Store.data)); return true; }
    catch (e) { annuler(); Store.save(); return false; }
  },
  /* une photo de construction (le dessin SVG du puzzle ou du quadrillage) */
  ajouterPhoto(u, svg, vb) {
    const c = this.etat(u);
    c.photos.push({ date: Revision.jour(0), svg, vb });
    while (c.photos.length > this.MAX_PHOTOS) c.photos.shift();
    return this.sauverOuAnnuler(() => c.photos.pop());
  },
  nettoyer(o) {
    if (!o || typeof o !== "object") return undefined;
    const date = (v) => (typeof v === "string" && /^\d{4}-\d\d-\d\d$/.test(v) ? v : "");
    const dessins = (Array.isArray(o.dessins) ? o.dessins : [])
      .filter((d) => d && typeof d.img === "string" && /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(d.img) && d.img.length < 150000)
      .slice(-this.MAX_DESSINS).map((d) => ({ date: date(d.date), img: d.img }));
    /* les photos sont des dessins SVG simples, faits par le jeu : on ne garde que des formes sans script */
    const sur = (svg) => typeof svg === "string" && svg.length < 40000 && !/<script|on\w+=|href|<foreignObject/i.test(svg);
    const photos = (Array.isArray(o.photos) ? o.photos : []).filter((p) => p && sur(p.svg) && /^[-\d. ]+$/.test(p.vb || ""))
      .slice(-this.MAX_PHOTOS).map((p) => ({ date: date(p.date), svg: p.svg, vb: p.vb }));
    const missions = Object.fromEntries(Object.entries(o.missions || {}).filter(([k, v]) => /^[a-z-]{2,20}$/.test(k) && date(v)));
    const accroche = Number.isInteger(o.accroche) && dessins[o.accroche] ? o.accroche : null;
    return { dessins, photos, missions, accroche };
  },
};

/* les petites missions du chevalet, dans l'ordre (5 écrous la première fois) */
const MISSIONS_CHEVALET = [
  { id: "maison", texte: "Dessine une maison avec un carré et un triangle.",
    ok: (s) => s.objets.some((o) => o.forme === "carre" || o.forme === "rect") && s.objets.some((o) => o.forme === "triangle") },
  { id: "soleil", texte: "Dessine un soleil : un cercle rempli de jaune.",
    ok: (s) => s.objets.some((o) => o.forme === "cercle" && o.plein && ["#f6c445", "#fff1a8", "#f08a3c"].includes(o.fond)) },
  { id: "jardin", texte: "Fais un jardin avec 3 images pareilles : place une image, puis clique sur « Copier ».",
    ok: (s) => { const n = {}; s.objets.filter((o) => o.type === "image").forEach((o) => { n[o.cle] = (n[o.cle] || 0) + 1; }); return Object.values(n).some((x) => x >= 3); } },
  { id: "coloriage", texte: "Colorie un coloriage avec au moins 3 couleurs différentes.", ok: (s) => s.coloriage && s.couleursRemplies.size >= 3 },
];

const CHEV_COULEURS = ["#2b2236", "#e4572e", "#f6c445", "#7bc950", "#2e86de", "#5bc0eb", "#8e6cc9", "#ef7fa8", "#8a5a24", "#ffffff"];
const CHEV_FORMES = {
  ligne: { nom: "la ligne", icone: `<path d="M4 22 L22 4" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>` },
  carre: { nom: "le carré", icone: `<rect x="4" y="4" width="18" height="18" fill="none" stroke="currentColor" stroke-width="3"/>` },
  rect: { nom: "le rectangle", icone: `<rect x="2" y="7" width="22" height="12" fill="none" stroke="currentColor" stroke-width="3"/>` },
  cercle: { nom: "le cercle", icone: `<circle cx="13" cy="13" r="9" fill="none" stroke="currentColor" stroke-width="3"/>` },
  ellipse: { nom: "l'ellipse", icone: `<ellipse cx="13" cy="13" rx="11" ry="7" fill="none" stroke="currentColor" stroke-width="3"/>` },
  triangle: { nom: "le triangle", icone: `<path d="M13 3 L23 22 H3 Z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>` },
  etoile: { nom: "l'étoile", icone: `<path d="M13 2 l3 7 l8 1 l-6 5 l2 8 l-7 -4 l-7 4 l2 -8 l-6 -5 l8 -1 z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>` },
};
const CHEV_OUTILS = {
  pinceau: { nom: "le pinceau", icone: `<path d="M20 4 l4 4 l-10 10 l-4 -4 z" fill="#c98a3c" stroke="#2b2236" stroke-width="2.5" stroke-linejoin="round"/><path d="M10 14 q-6 0 -6 8 q8 0 8 -6" fill="#e4572e" stroke="#2b2236" stroke-width="2.5"/>` },
  gomme: { nom: "la gomme", icone: `<path d="M4 18 l10 -12 l10 8 l-8 10 h-6 z" fill="#ef7fa8" stroke="#2b2236" stroke-width="2.5" stroke-linejoin="round"/>` },
  pot: { nom: "le pot de peinture : il remplit une forme ou une zone fermée", icone: `<path d="M6 12 l8 -8 l8 8 l-8 8 z" fill="#fff" stroke="#2b2236" stroke-width="2.5" stroke-linejoin="round"/><path d="M22 12 q4 6 2 10 q-3 2 -4 -2 z" fill="#2e86de" stroke="#2b2236" stroke-width="2"/>` },
  selection: { nom: "la main : choisir, déplacer, agrandir", icone: `<path d="M7 4 v18 l5 -5 l4 8 l3 -2 l-4 -8 h7 z" fill="#fff" stroke="#2b2236" stroke-width="2.5" stroke-linejoin="round"/>` },
};

/* les images : celles du jeu, les fleurs du jardin, les photos de construction */
function imagesChevalet(u, onglet) {
  if (onglet === "fleurs") {
    const j = u.jardin || {};
    return Object.keys(j.herbier || {}).map((esp) => ({ cle: "fleur-" + esp, vb: "-70 -150 140 160",
      src: dessinPlante(esp, 5, "ok", 140, { fruits: esp === "oranger" }), nom: JARDIN_ESPECES[esp].nom }));
  }
  if (onglet === "photos") return Chevalet.etat(u).photos.map((p, i) => ({ cle: "photo-" + i + "-" + p.date, vb: p.vb, src: p.svg, nom: "une photo de construction" }));
  return Object.keys(PICTOS).map((n) => ({ cle: "picto-" + n, vb: "0 0 100 100", src: PICTOS[n], nom: PICTOS_NOMS[n] || n }));
}

/* remplissage d'une zone (pot de peinture) sur la couche de peinture */
function remplirZone(ctx, x0, y0, hex) {
  const W = ctx.canvas.width, H = ctx.canvas.height;
  const img = ctx.getImageData(0, 0, W, H), d = img.data;
  const n = parseInt(hex.slice(1), 16), R = (n >> 16) & 255, G = (n >> 8) & 255, B = n & 255;
  const p0 = (y0 * W + x0) * 4, r0 = d[p0], g0 = d[p0 + 1], b0 = d[p0 + 2];
  if (Math.abs(r0 - R) + Math.abs(g0 - G) + Math.abs(b0 - B) < 12) return false;
  const proche = (p) => Math.abs(d[p] - r0) + Math.abs(d[p + 1] - g0) + Math.abs(d[p + 2] - b0) < 110;
  const vu = new Uint8Array(W * H), pile = [[x0, y0]];
  while (pile.length) {
    let [x, y] = pile.pop();
    while (x > 0 && !vu[y * W + x - 1] && proche((y * W + x - 1) * 4)) x--;
    let haut = false, bas = false;
    for (; x < W && !vu[y * W + x] && proche((y * W + x) * 4); x++) {
      const p = (y * W + x) * 4;
      vu[y * W + x] = 1; d[p] = R; d[p + 1] = G; d[p + 2] = B; d[p + 3] = 255;
      if (y > 0) { const ok = !vu[(y - 1) * W + x] && proche(((y - 1) * W + x) * 4); if (ok && !haut) pile.push([x, y - 1]); haut = ok; }
      if (y < H - 1) { const ok = !vu[(y + 1) * W + x] && proche(((y + 1) * W + x) * 4); if (ok && !bas) pile.push([x, y + 1]); bas = ok; }
    }
  }
  ctx.putImageData(img, 0, 0);
  return true;
}
/* une image SVG doit être du XML strict : certains dessins répètent un attribut (ex. stroke-width),
   ce que la page tolère. On garde la première valeur, comme le fait la page. */
function svgStrict(svg) {
  return svg.replace(/<([a-zA-Z][\w:-]*)((?:\s+[\w:-]+="[^"]*")*)\s*(\/?)>/g, (m, nom, attrs, fin) => {
    const vus = new Set(), garde = [];
    for (const [, k, v] of attrs.matchAll(/([\w:-]+)="([^"]*)"/g)) if (!vus.has(k)) { vus.add(k); garde.push(`${k}="${v}"`); }
    return `<${nom}${garde.length ? " " + garde.join(" ") : ""}${fin ? "/" : ""}>`;
  });
}
/* dessine une image SVG sur un canvas (pour les coloriages et pour aplatir le dessin) */
function svgSurCanvas(ctx, svg, x, y, w, h) {
  svg = svgStrict(svg);
  return new Promise((ok) => {
    const im = new Image();
    im.onload = () => { ctx.drawImage(im, x, y, w, h); ok(true); };
    im.onerror = () => ok(false);
    im.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  });
}

/* ------------------------------------------------------------------ */
/* L'écran du chevalet                                                  */
/* ------------------------------------------------------------------ */
App.register("peinture", (root, params) => {
  const u = Store.user; if (!u) return App.go("identif");
  const C = Chevalet.etat(u), cp = !!NIVEAU.toutEnVoix;
  const W = 720, H = 520;
  App.backdrop(root);
  root.appendChild(h("div", { class: "screen-header" }, h("h2", { class: "title" }, "🎨 Le chevalet")));

  /* l'état du dessin */
  const s = { objets: [], sel: -1, coloriage: false, couleursRemplies: new Set() };
  let outil = "pinceau", forme = null, plein = false, couleur = CHEV_COULEURS[1], taille = 8;
  let mission = null, missionDite = "";   // la bande de la mission (créée plus bas)

  /* la feuille : la peinture (canvas) et les éléments (svg) par-dessus */
  const feuille = h("div", { class: "chev-feuille" });
  const canvas = h("canvas", { width: W, height: H });
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, W, H);
  const calque = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  calque.setAttribute("viewBox", `0 0 ${W} ${H}`);
  calque.setAttribute("class", "chev-calque");
  feuille.append(canvas, calque);
  root.appendChild(feuille);
  const barreSel = h("div", { class: "chev-barre hidden" });
  feuille.appendChild(barreSel);

  /* ----- annuler / refaire ----- */
  const passe = [], futur = [];
  const instantane = () => ({ img: ctx.getImageData(0, 0, W, H), objets: JSON.stringify(s.objets) });
  const memoriser = () => { passe.push(instantane()); if (passe.length > 15) passe.shift(); futur.length = 0; majBoutons(); };
  const restaurer = (e) => { ctx.putImageData(e.img, 0, 0); s.objets = JSON.parse(e.objets); s.sel = -1; dessiner(); };

  /* ----- dessiner les éléments ----- */
  function formeSvg(o) {
    const w = o.w, hh = o.h;
    const st = `stroke="${o.coul}" stroke-width="${o.trait}" stroke-linejoin="round" stroke-linecap="round" fill="${o.plein ? o.fond : "none"}"`;
    switch (o.forme) {
      case "ligne": return `<line x1="0" y1="0" x2="${w}" y2="${hh}" ${st}/>`;
      case "carre": case "rect": return `<rect x="0" y="0" width="${w}" height="${hh}" ${st}/>`;
      case "cercle": case "ellipse": return `<ellipse cx="${w / 2}" cy="${hh / 2}" rx="${w / 2}" ry="${hh / 2}" ${st}/>`;
      case "triangle": return `<path d="M${w / 2} 0 L${w} ${hh} H0 Z" ${st}/>`;
      case "etoile": {
        const pts = Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 0.4 : 1; return `${(w / 2 + Math.cos(a) * r * w / 2).toFixed(1)},${(hh / 2 + Math.sin(a) * r * hh / 2).toFixed(1)}`; });
        return `<polygon points="${pts.join(" ")}" ${st}/>`;
      }
    }
    return "";
  }
  const boite = (o) => o.forme === "ligne" ? { x: Math.min(0, o.w), y: Math.min(0, o.h), w: Math.abs(o.w), h: Math.abs(o.h) } : { x: 0, y: 0, w: o.w, h: o.h };
  function objetSvg(o, i, poignees) {
    const b = boite(o), cx = b.x + b.w / 2, cy = b.y + b.h / 2;
    const contenu = o.type === "image"
      ? `<svg x="0" y="0" width="${o.w}" height="${o.h}" viewBox="${o.vb}" preserveAspectRatio="xMidYMid meet" overflow="visible">${o.src}</svg>` : formeSvg(o);
    let g = `<g transform="translate(${o.x} ${o.y}) rotate(${o.rot || 0} ${cx} ${cy})"${i != null ? ` data-i="${i}"` : ""}>${contenu}`;
    if (i != null) g += `<rect x="${b.x - 6}" y="${b.y - 6}" width="${b.w + 12}" height="${b.h + 12}" fill="transparent" stroke="none"/>`;
    if (poignees) {
      g += `<rect x="${b.x - 8}" y="${b.y - 8}" width="${b.w + 16}" height="${b.h + 16}" fill="none" stroke="#2e86de" stroke-width="2.5" stroke-dasharray="7 5" pointer-events="none"/>`;
      if (!cp) g += `<rect class="poignee" data-p="taille" x="${b.x + b.w + 1}" y="${b.y + b.h + 1}" width="16" height="16" fill="#fff" stroke="#2e86de" stroke-width="3"/>`
        + `<line x1="${cx}" y1="${b.y - 8}" x2="${cx}" y2="${b.y - 30}" stroke="#2e86de" stroke-width="2.5" pointer-events="none"/><circle class="poignee" data-p="tourne" cx="${cx}" cy="${b.y - 36}" r="9" fill="#fff" stroke="#2e86de" stroke-width="3"/>`;
    }
    return g + `</g>`;
  }
  function dessiner() {
    calque.innerHTML = s.objets.map((o, i) => objetSvg(o, i, i === s.sel)).join("") + (apercu ? objetSvg(apercu, null, false) : "");
    barreSel.classList.toggle("hidden", s.sel < 0);
    majMission();
  }

  /* ----- les gestes sur la feuille ----- */
  const point = (e) => { const r = calque.getBoundingClientRect(); return { x: Math.max(0, Math.min(W - 1, (e.clientX - r.left) * W / r.width)), y: Math.max(0, Math.min(H - 1, (e.clientY - r.top) * H / r.height)) }; };
  let geste = null, apercu = null;
  calque.addEventListener("pointerdown", (e) => {
    const p = point(e), cible = e.target.closest("[data-i]"), poignee = e.target.closest(".poignee");
    calque.setPointerCapture(e.pointerId);
    if (poignee && s.sel >= 0) { geste = { type: poignee.dataset.p, depart: p, o: { ...s.objets[s.sel] } }; return; }
    if (outil === "selection" || (cible && !forme && outil !== "pinceau" && outil !== "gomme" && outil !== "pot")) {
      if (cible) { s.sel = +cible.dataset.i; geste = { type: "deplace", depart: p, o: { ...s.objets[s.sel] } }; Sound.click(); }
      else s.sel = -1;
      dessiner(); return;
    }
    if (outil === "pot") {
      if (cible) {
        const o = s.objets[+cible.dataset.i];
        if (o.type !== "image" && o.forme !== "ligne") { o.plein = true; o.fond = couleur; s.couleursRemplies.add(couleur); Sound.pop(); memoriser(); dessiner(); }
        return;
      }
      if (remplirZone(ctx, Math.floor(p.x), Math.floor(p.y), couleur)) { s.couleursRemplies.add(couleur); Sound.pop(); memoriser(); majMission(); }
      return;
    }
    if (forme) { apercu = nouvelleForme(p, p); geste = { type: "forme", depart: p }; dessiner(); return; }
    /* pinceau ou gomme */
    geste = { type: "peint", dernier: p };
    ctx.fillStyle = outil === "gomme" ? "#fff" : couleur;
    ctx.beginPath(); ctx.arc(p.x, p.y, (outil === "gomme" ? taille * 2 : taille) / 2, 0, Math.PI * 2); ctx.fill();
  });
  calque.addEventListener("pointermove", (e) => {
    if (!geste) return;
    const p = point(e);
    if (geste.type === "peint") {
      ctx.strokeStyle = outil === "gomme" ? "#fff" : couleur; ctx.lineWidth = outil === "gomme" ? taille * 2 : taille; ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.beginPath(); ctx.moveTo(geste.dernier.x, geste.dernier.y); ctx.lineTo(p.x, p.y); ctx.stroke(); geste.dernier = p;
    } else if (geste.type === "forme") { apercu = nouvelleForme(geste.depart, p); dessiner(); }
    else if (geste.type === "deplace") { const o = s.objets[s.sel]; o.x = geste.o.x + p.x - geste.depart.x; o.y = geste.o.y + p.y - geste.depart.y; dessiner(); }
    else if (geste.type === "taille") {
      const o = s.objets[s.sel], k = Math.max(0.15, 1 + ((p.x - geste.depart.x) + (p.y - geste.depart.y)) / Math.max(40, Math.abs(geste.o.w) + Math.abs(geste.o.h)));
      o.w = geste.o.w * k; o.h = geste.o.h * k; dessiner();
    } else if (geste.type === "tourne") {
      const o = s.objets[s.sel], b = boite(o), cx = o.x + b.x + b.w / 2, cy = o.y + b.y + b.h / 2;
      o.rot = Math.round((Math.atan2(p.y - cy, p.x - cx) * 180 / Math.PI + 90) / 15) * 15; dessiner();
    }
  });
  const finGeste = () => {
    if (!geste) return;
    if (geste.type === "forme" && apercu) {
      const b = boite(apercu);
      if (b.w + b.h > 14) { s.objets.push(apercu); s.sel = s.objets.length - 1; Sound.pop(); }
      apercu = null; memoriser(); dessiner();
    } else if (geste.type !== "peint" || true) memoriser();
    geste = null;
    majMission();
  };
  calque.addEventListener("pointerup", finGeste);
  calque.addEventListener("pointercancel", finGeste);
  function nouvelleForme(a, b) {
    let w = b.x - a.x, hh = b.y - a.y;
    const o = { type: "forme", forme, coul: couleur, fond: couleur, plein, trait: Math.max(3, taille), rot: 0 };
    if (forme === "ligne") return { ...o, x: a.x, y: a.y, w, h: hh, plein: false };
    if (forme === "carre" || forme === "cercle" || forme === "etoile") { const m = Math.max(Math.abs(w), Math.abs(hh)); w = Math.sign(w || 1) * m; hh = Math.sign(hh || 1) * m; }
    return { ...o, x: Math.min(a.x, a.x + w), y: Math.min(a.y, a.y + hh), w: Math.abs(w), h: Math.abs(hh) };
  }

  /* ----- la barre de l'élément choisi ----- */
  const actionSel = (txt, fn, cls = "white") => h("button", { class: "btn small " + cls, type: "button", onclick: () => { if (s.sel < 0) return; fn(s.objets[s.sel]); Sound.click(); memoriser(); dessiner(); } }, txt);
  barreSel.append(
    actionSel("Copier", (o) => { const c = JSON.parse(JSON.stringify(o)); c.x += 30; c.y += 20; s.objets.push(c); s.sel = s.objets.length - 1; }, "green"),
    actionSel("Couleur", (o) => { o.coul = couleur; if (o.plein) o.fond = couleur; }),
    actionSel("Remplir", (o) => { if (o.type === "image" || o.forme === "ligne") return; o.plein = !o.plein; o.fond = couleur; if (o.plein) s.couleursRemplies.add(couleur); }),
    actionSel("＋", (o) => { o.w *= 1.2; o.h *= 1.2; }), actionSel("－", (o) => { o.w /= 1.2; o.h /= 1.2; }),
    actionSel("↻", (o) => { o.rot = ((o.rot || 0) + 15) % 360; }),
    actionSel("Devant", () => { const [o] = s.objets.splice(s.sel, 1); s.objets.push(o); s.sel = s.objets.length - 1; }),
    actionSel("Derrière", () => { const [o] = s.objets.splice(s.sel, 1); s.objets.unshift(o); s.sel = 0; }),
    actionSel("Enlever", () => { s.objets.splice(s.sel, 1); s.sel = -1; }, "red"));

  /* ----- les outils (à gauche) ----- */
  const gauche = h("div", { class: "panel abs chev-outils" });
  const btnOutil = (id, def) => {
    const b = h("button", { class: "chev-outil", type: "button", title: def.nom, "aria-label": def.nom, html: `<svg width="28" height="28" viewBox="0 0 26 26" aria-hidden="true">${def.icone}</svg>` });
    b.addEventListener("click", () => { choisir(id); Sound.click(); if (cp) Voice.speak(def.nom); });
    if (cp) b.addEventListener("mouseenter", () => Voice.speak(def.nom));
    b.dataset.id = id;
    return b;
  };
  const grilleOutils = h("div", { class: "chev-grille" }, ...Object.entries(CHEV_OUTILS).map(([id, d]) => btnOutil(id, d)));
  const formesNiveau = cp ? ["carre", "rect", "cercle", "triangle"] : Object.keys(CHEV_FORMES);
  const grilleFormes = h("div", { class: "chev-grille" }, ...formesNiveau.map((id) => btnOutil("forme-" + id, CHEV_FORMES[id])));
  const btnPlein = h("button", { class: "chev-outil chev-plein", type: "button", title: "Formes vides ou pleines" }, "vide");
  btnPlein.addEventListener("click", () => { plein = !plein; btnPlein.textContent = plein ? "pleine" : "vide"; btnPlein.classList.toggle("sel", plein); Sound.click(); if (cp) Voice.speak(plein ? "Formes pleines" : "Formes vides"); });
  grilleFormes.appendChild(btnPlein);
  const tailles = h("div", { class: "chev-tailles" });
  [4, 8, 16, 30].forEach((t) => {
    const b = h("button", { class: "chev-taille" + (t === taille ? " sel" : ""), type: "button", "aria-label": "Taille " + t }, h("span", { style: { width: Math.max(6, t * 0.8) + "px", height: Math.max(6, t * 0.8) + "px" } }));
    b.addEventListener("click", () => { taille = t; Sound.click(); tailles.querySelectorAll(".chev-taille").forEach((x) => x.classList.toggle("sel", x === b)); });
    tailles.appendChild(b);
  });
  const btnAnnuler = h("button", { class: "chev-outil", type: "button", title: "Annuler", "aria-label": "Annuler" }, "↶");
  const btnRefaire = h("button", { class: "chev-outil", type: "button", title: "Refaire", "aria-label": "Refaire" }, "↷");
  btnAnnuler.addEventListener("click", () => { if (passe.length < 2) return; futur.push(passe.pop()); restaurer(passe[passe.length - 1]); Sound.click(); majBoutons(); });
  btnRefaire.addEventListener("click", () => { if (!futur.length) return; const e = futur.pop(); passe.push(e); restaurer(e); Sound.click(); majBoutons(); });
  function majBoutons() { btnAnnuler.disabled = passe.length < 2; btnRefaire.disabled = !futur.length; }
  gauche.append(h("b", null, "Outils"), grilleOutils, h("b", null, "Formes"), grilleFormes, h("b", null, "Taille"), tailles,
    h("div", { class: "chev-grille", style: { marginTop: "auto" } }, btnAnnuler, btnRefaire));
  root.appendChild(gauche);
  function choisir(id) {
    if (id.startsWith("forme-")) { forme = id.slice(6); outil = "forme"; } else { forme = null; outil = id; }
    gauche.querySelectorAll(".chev-outil[data-id]").forEach((b) => b.classList.toggle("sel", b.dataset.id === id));
    calque.dataset.outil = outil;
    if (outil !== "selection") { s.sel = -1; dessiner(); }
  }
  choisir("pinceau");
  memoriser();   // la feuille blanche : le premier état qu'on peut retrouver avec « annuler »

  /* ----- les images et les couleurs (à droite) ----- */
  const droite = h("div", { class: "panel abs chev-droite" });
  const onglets = h("div", { class: "chev-onglets" });
  const grilleImages = h("div", { class: "chev-images" });
  let onglet = "jeu";
  const ONGLETS = [["jeu", "Le jeu"], ["fleurs", "Mes fleurs"], ["photos", "Photos"]];
  function majImages() {
    onglets.innerHTML = "";
    ONGLETS.forEach(([id, nom]) => onglets.appendChild(h("button", { class: "chev-onglet" + (id === onglet ? " sel" : ""), type: "button",
      onclick: () => { onglet = id; Sound.click(); majImages(); } }, nom)));
    grilleImages.innerHTML = "";
    const liste = imagesChevalet(u, onglet);
    if (!liste.length) grilleImages.appendChild(h("p", { class: "chev-vide" }, onglet === "fleurs" ? "Fais pousser une plante dans ton jardin : elle arrivera ici." : "Prends une photo dans l'atelier de construction : elle arrivera ici."));
    liste.forEach((im) => {
      const b = h("button", { class: "chev-image", type: "button", title: im.nom, "aria-label": im.nom, html: `<svg viewBox="${im.vb}" width="46" height="46" aria-hidden="true">${im.src}</svg>` });
      b.addEventListener("click", () => {
        const [, , vw, vh] = im.vb.split(" ").map(Number), k = 130 / Math.max(vw, vh);
        s.objets.push({ type: "image", cle: im.cle, vb: im.vb, src: im.src, x: W / 2 - vw * k / 2 + rand(-40, 40), y: H / 2 - vh * k / 2 + rand(-30, 30), w: vw * k, h: vh * k, rot: 0 });
        s.sel = s.objets.length - 1; choisir("selection"); s.sel = s.objets.length - 1;
        Sound.pop(); memoriser(); dessiner();
      });
      if (cp) b.addEventListener("mouseenter", () => Voice.speak(im.nom));
      grilleImages.appendChild(b);
    });
  }
  const palette = h("div", { class: "chev-palette" });
  CHEV_COULEURS.concat(typeof couleursTrouvees === "function" ? couleursTrouvees(u) : []).forEach((c) => {
    const b = h("button", { class: "swatch" + (c === couleur ? " sel" : ""), type: "button", style: { background: c }, "aria-label": c === "#ffffff" ? "Blanc" : "Couleur" });
    b.addEventListener("click", () => { couleur = c; Sound.pop(); palette.querySelectorAll(".swatch").forEach((x) => x.classList.toggle("sel", x === b)); });
    palette.appendChild(b);
  });
  droite.append(h("b", null, "Images"), onglets, grilleImages, h("b", null, "Couleurs"), palette);
  root.appendChild(droite);
  majImages();

  /* ----- la mission, et les boutons du bas ----- */
  mission = h("div", { class: "chev-mission" });
  root.appendChild(mission);
  function majMission() {
    if (!mission) return;
    const m = MISSIONS_CHEVALET.find((x) => !C.missions[x.id]);
    if (!m) { mission.innerHTML = "<b>Toutes les missions sont réussies !</b> Dessine ce que tu veux."; return; }
    if (m.ok(s)) {
      C.missions[m.id] = Revision.jour(0);
      Aventure.gagner(u, 5, "mission du chevalet"); Aventure.conclure(u);
      Sound.fanfare(); App.confetti(40);
      Voice.speak("Mission réussie ! " + (MISSIONS_CHEVALET.find((x) => !C.missions[x.id]) || { texte: "" }).texte);
      return majMission();
    }
    mission.innerHTML = "";
    mission.append(h("b", null, "Mission : "), m.texte);
    if (missionDite !== m.id) { missionDite = m.id; if (cp) setTimeout(() => Voice.speak("Mission : " + m.texte), 600); }
  }
  /* aplatir le dessin (peinture + éléments) en une image */
  async function aplatir(largeur, hauteur) {
    const c = document.createElement("canvas"); c.width = W; c.height = H;
    const x = c.getContext("2d");
    x.drawImage(canvas, 0, 0);
    await svgSurCanvas(x, `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${s.objets.map((o) => objetSvg(o, null, false)).join("")}</svg>`, 0, 0, W, H);
    const r = document.createElement("canvas"); r.width = largeur; r.height = hauteur;
    r.getContext("2d").drawImage(c, 0, 0, largeur, hauteur);
    return r;
  }
  const bas = h("div", { class: "chev-bas" });
  bas.append(
    h("button", { class: "btn green", onclick: async () => {
      if (C.dessins.length >= Chevalet.MAX_DESSINS) { Sound.bad(); Voice.speak("Ta galerie est pleine : enlève un dessin dans la galerie pour en garder un nouveau."); return; }
      const r = await aplatir(480, 347);
      C.dessins.push({ date: Revision.jour(0), img: r.toDataURL("image/jpeg", 0.72) });
      if (!Chevalet.sauverOuAnnuler(() => C.dessins.pop())) { Sound.bad(); Voice.speak("Il n'y a plus de place pour garder des dessins sur cet ordinateur."); return; }
      Aventure.conclure(u);
      Sound.good(); Voice.speak("Ton dessin est rangé dans ta galerie !");
      majGalerie();
    } }, "💾 Garder mon dessin"),
    h("button", { class: "btn white", onclick: () => { Sound.click(); App.go("galerie-dessins"); } }, "🖼 Ma galerie"),
    h("button", { class: "btn white", onclick: () => choisirColoriage() }, "🖍 Coloriages"),
    h("button", { class: "btn red", onclick: () => App.confirm("Effacer tout le dessin ?", () => { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, W, H); s.objets = []; s.sel = -1; s.coloriage = false; s.couleursRemplies.clear(); memoriser(); dessiner(); }) }, "🗑 Tout effacer"));
  const compteur = h("span", { class: "chev-compteur" });
  bas.appendChild(compteur);
  function majGalerie() { compteur.textContent = `Galerie : ${C.dessins.length} / ${Chevalet.MAX_DESSINS}`; }
  majGalerie();
  root.appendChild(bas);
  App.backButton(root, "atelier");

  /* ----- les coloriages : les images du jeu, en contours ----- */
  function choisirColoriage() {
    Sound.click();
    const grille = h("div", { class: "chev-coloriages" });
    let fermer;
    Object.keys(PICTOS).forEach((n) => {
      const b = h("button", { class: "chev-image", type: "button", "aria-label": PICTOS_NOMS[n] || n, html: `<svg viewBox="0 0 100 100" width="64" height="64">${contours(PICTOS[n])}</svg>` });
      b.addEventListener("click", async () => {
        fermer();
        ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, W, H); s.objets = []; s.sel = -1;
        await svgSurCanvas(ctx, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="460" height="460">${contours(PICTOS[n])}</svg>`, (W - 460) / 2, (H - 460) / 2, 460, 460);
        s.coloriage = true; s.couleursRemplies.clear();
        choisir("pot"); memoriser(); dessiner();
        Voice.speak("Choisis une couleur, puis clique dans une zone pour la colorier.");
      });
      if (cp) b.addEventListener("mouseenter", () => Voice.speak(motDe(n)));
      grille.appendChild(b);
    });
    fermer = App.modal(h("div", { class: "col" }, h("h2", { class: "title dark", style: { fontSize: "30px", margin: 0 } }, "Choisis un coloriage"), grille,
      h("div", { class: "row", style: { justifyContent: "flex-end" } }, h("button", { class: "btn white", onclick: () => fermer() }, "Fermer"))));
  }
  /* les couleurs deviennent blanches, les traits restent (et les petits détails noirs) */
  function contours(svg) { return svg.replace(/fill="(#[0-9a-fA-F]{3,6})"/g, (m, c) => (c.toLowerCase() === "#2b2236" ? m : 'fill="#ffffff"')); }

  dessiner();
  setTimeout(() => Voice.speak(cp ? "Bienvenue au chevalet ! Choisis un outil à gauche, une couleur à droite, et dessine !" : "Bienvenue au chevalet ! Peins, ajoute des formes et des images, puis garde ton dessin dans ta galerie."), 300);
});

/* ------------------------------------------------------------------ */
/* La galerie des dessins                                              */
/* ------------------------------------------------------------------ */
App.register("galerie-dessins", (root) => {
  const u = Store.user; if (!u) return App.go("identif");
  const C = Chevalet.etat(u);
  App.backdrop(root);
  root.appendChild(h("div", { class: "screen-header" }, h("h2", { class: "title" }, `🖼 Ma galerie (${C.dessins.length} / ${Chevalet.MAX_DESSINS})`)));
  const grille = h("div", { class: "abs galerie-grille" });
  if (!C.dessins.length) grille.appendChild(h("p", { class: "panel", style: { padding: "20px", fontSize: "22px" } }, "Ta galerie est vide. Au chevalet, clique sur « Garder mon dessin »."));
  C.dessins.forEach((d, i) => {
    const accroche = C.accroche === i;
    grille.appendChild(h("div", { class: "panel galerie-carte" + (accroche ? " accroche" : "") },
      h("img", { src: d.img, alt: "Dessin du " + Revision.dateFr(d.date) }),
      h("div", { class: "row", style: { gap: "6px", justifyContent: "center" } },
        h("button", { class: "btn small " + (accroche ? "sky" : "yellow"), onclick: () => {
          C.accroche = accroche ? null : i; Store.save(); Sound.good();
          if (!accroche) Voice.speak("Ton dessin est accroché dans l'atelier ! On le voit aussi par la fenêtre de la maison.");
          App.go("galerie-dessins");
        } }, accroche ? "✓ Accroché" : "Accrocher"),
        h("button", { class: "btn small red", onclick: () => App.confirm("Enlever ce dessin de ta galerie ?", () => {
          C.dessins.splice(i, 1);
          if (C.accroche === i) C.accroche = null; else if (C.accroche > i) C.accroche--;
          Store.save(); App.go("galerie-dessins");
        }) }, "Enlever"))));
  });
  root.appendChild(grille);
  App.backButton(root, "peinture");
});

/* ------------------------------------------------------------------ */
/* Le dessin accroché : dans l'atelier et à la fenêtre de la maison     */
/* ------------------------------------------------------------------ */
/* la place du cadre : NIVEAU.cadreAtelier = { x, y, w, h } (par défaut : au-dessus de la porte du CE2) */
objetAtelier({
  id: "cadre", ecran: "galerie-dessins", ordre: 160, label: "Mon dessin accroché",
  desc: "Le dessin que tu as accroché. Clique pour voir ta galerie.",
  svg: () => {
    const u = Store.data && Store.user, c = u && u.chevalet;
    const d = c && Number.isInteger(c.accroche) && c.dessins && c.dessins[c.accroche];
    if (!d) return "";
    const { x, y, w, h: hh } = NIVEAU.cadreAtelier || { x: 926, y: 104, w: 88, h: 70 };
    return `<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="5" fill="#f6c445" ${S} stroke-width="4"/>
      <image href="${d.img}" x="${x + 7}" y="${y + 7}" width="${w - 14}" height="${hh - 14}" preserveAspectRatio="xMidYMid slice"/>
      <path d="M${x + w / 2} ${y} l-12 -14 h24 z" fill="none" ${S} stroke-width="2"/>`;
  },
});
MAISON_AJOUTS.push((u) => {
  const c = u && u.chevalet, d = c && Number.isInteger(c.accroche) && c.dessins && c.dessins[c.accroche];
  return d ? `<image href="${d.img}" x="364" y="364" width="42" height="38" preserveAspectRatio="xMidYMid slice"/>` : "";
});

ajouterMedailles([
  { id: "artiste", icone: "🎨", nom: "Artiste", desc: "Garde 3 dessins dans ta galerie.", ok: (u) => ((u.chevalet && u.chevalet.dessins) || []).length >= 3 },
]);
