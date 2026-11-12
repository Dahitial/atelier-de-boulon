/* L'Atelier de Boulon — module Géographie : carte du monde, capitales, jour et nuit, éclipses, missions.
   Données : geo-formes.js (formes des pays), geo-pays.js (fiches), geo-projection.js (projection). */
"use strict";

/* dossier des drapeaux du module (chemin donné par le chargeur, moteur/charger.js) */
const GEO_DRAPEAUX = (window.CHEMINS ? CHEMINS.module("geo") : "") + "img/drapeaux/";

/* ================================================================== */
/* Textes pédagogiques (aussi utilisés pour la voix enregistrée)       */
/* ================================================================== */
const GEO_TEXTES = {
  jourNuit: "La Terre tourne sur elle-même. La partie tournée vers le Soleil est éclairée : c'est le jour. La partie opposée est dans l'obscurité : c'est la nuit.",
  jourNuit2: "La Terre fait un tour complet sur elle-même en un jour, c'est-à-dire en vingt-quatre heures. C'est pour cela que le jour et la nuit se suivent.",
  solaire: "Une éclipse solaire se produit lorsque la Lune passe entre le Soleil et la Terre. Elle cache alors une partie du Soleil ou sa totalité.",
  lunaire: "Une éclipse lunaire se produit lorsque la Terre se place entre le Soleil et la Lune. Son ombre se projette alors sur la Lune.",
  attention: "Attention : il ne faut jamais regarder le Soleil directement, même pendant une éclipse !",
  echelle: "Sur ce dessin, les tailles et les distances ne sont pas à l'échelle : en vrai, le Soleil est beaucoup plus gros et beaucoup plus loin.",
  hub: "Bienvenue dans le tour du monde ! Choisis une aventure : la carte, les capitales, le jour et la nuit, les éclipses ou les missions.",
};

/* ================================================================== */
/* Outils                                                              */
/* ================================================================== */
const SVGNS = "http://www.w3.org/2000/svg";
function svgNode(tag, attrs = {}) {
  const el = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}
const Geo = {
  byId: {},
  init() {
    if (this.ready) return;
    GEO_PAYS.forEach((p) => { this.byId[p.id] = p; });
    this.ready = true;
  },
  cont(id) { return GEO_CONTINENTS[id]; },
  /* couleur d'un pays : la couleur de son continent, légèrement variée pour bien voir les frontières */
  color(p) {
    const base = GEO_CONTINENTS[p.cont].couleur;
    let hsh = 0; for (const c of p.id) hsh = (hsh * 31 + c.charCodeAt(0)) % 997;
    return this.shade(base, ((hsh % 5) - 2) * 0.07);
  },
  shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    const t = amt < 0 ? 0 : 255, a = Math.abs(amt);
    r = Math.round(r + (t - r) * a); g = Math.round(g + (t - g) * a); b = Math.round(b + (t - b) * a);
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  },
  flag(p, size = 64) {
    if (!p.a2) return `<span style="font-size:${size * 0.7}px">🏳️</span>`;
    // largeur explicite (format 4:3) : certains drapeaux SVG n'ont pas de taille propre
    return `<img class="geo-flag" src="${GEO_DRAPEAUX}${p.a2}.svg" alt="Drapeau : ${escapeHtml(p.nom)}" style="height:${size}px;width:${Math.round(size * 4 / 3)}px" draggable="false">`;
  },
  contName(p) { return GEO_CONTINENTS[p.cont].nom; },
  /* anecdotes (ou phrases simples si le pays n'en a pas encore) */
  facts(p) {
    if (p.faits.length) return p.faits;
    const f = [`Ce pays se trouve en ${this.contName(p)}.`];
    if (p.capitale) f.push(`Sa capitale s'appelle ${p.capitale}.`);
    return f;
  },
  jouables(filter) { return GEO_PAYS.filter((p) => p.jouable && (!filter || filter(p))); },
  area(p) { const s = GEO_FORMES.shapes[p.id]; return s ? s.area : 0; },
  /* position du Soleil (point où il est au zénith) pour une date et une heure UTC */
  declination(date) {
    const start = Date.UTC(date.getUTCFullYear(), 0, 0);
    const n = (date.getTime() - start) / 86400000;
    return -23.44 * Math.cos((2 * Math.PI / 365) * (n + 10));
  },
  sunElevation(lat, lon, sunLat, sunLon) {
    const r = Math.PI / 180;
    const s = Math.sin(lat * r) * Math.sin(sunLat * r) + Math.cos(lat * r) * Math.cos(sunLat * r) * Math.cos((lon - sunLon) * r);
    return Math.asin(Math.max(-1, Math.min(1, s))) / r;
  },
  /* polygone de la nuit (chemin SVG) pour un Soleil au zénith en (sunLat, sunLon) */
  nightPath(sunLat, sunLon) {
    const r = Math.PI / 180;
    let d = sunLat; if (Math.abs(d) < 0.3) d = d < 0 ? -0.3 : 0.3;
    const pts = [];
    for (let lon = -180; lon <= 180; lon += 2) {
      const lat = Math.atan(-Math.cos((lon - sunLon) * r) / Math.tan(d * r)) / r;
      pts.push(GeoProj.project(lon, lat));
    }
    const pole = d > 0 ? -90 : 90;              // la nuit est du côté du pôle non éclairé
    for (let lon = 180; lon >= -180; lon -= 4) pts.push(GeoProj.project(lon, pole));
    return "M" + pts.map((p) => p[0].toFixed(1) + " " + p[1].toFixed(1)).join("L") + "Z";
  },
};

Geo.init();   // index des pays prêt dès le chargement (les missions sans carte en ont besoin)

/* ================================================================== */
/* La carte interactive (zoom, déplacement, sélection, étiquettes)     */
/* ================================================================== */
class GeoMap {
  constructor(parent, opts = {}) {
    Geo.init();
    this.o = Object.assign({ labels: true, seas: true, capitals: false, onCountry: null, onCapital: null, maxZoom: 16 }, opts);
    const F = GEO_FORMES;
    this.W = F.W; this.H = F.H;
    this.wrap = h("div", { class: "geo-map" });
    parent.appendChild(this.wrap);
    const svg = this.svg = svgNode("svg", { viewBox: `0 0 ${F.W} ${F.H}`, preserveAspectRatio: "xMidYMid meet", role: "img", "aria-label": "Carte du monde" });
    svg.innerHTML = `<defs>
        <radialGradient id="geoOcean" cx="50%" cy="45%" r="65%"><stop offset="0" stop-color="#5fb4ee"/><stop offset="1" stop-color="#2e7cc6"/></radialGradient>
        <filter id="geoNightBlur" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="14"/></filter>
        <filter id="geoGlow"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <clipPath id="geoClip"><path d="${F.outline}"/></clipPath>
      </defs>`;
    this.wrap.appendChild(svg);
    const root = this.root = svgNode("g", { "clip-path": "url(#geoClip)" });
    svg.appendChild(root);
    root.appendChild(svgNode("path", { d: F.outline, fill: "url(#geoOcean)" }));
    root.appendChild(svgNode("path", { d: this.graticule(), fill: "none", stroke: "rgba(255,255,255,.18)", "stroke-width": "1", "vector-effect": "non-scaling-stroke" }));
    this.gCountries = svgNode("g"); root.appendChild(this.gCountries);
    this.gSeas = svgNode("g", { class: "geo-seas" }); root.appendChild(this.gSeas);
    this.gOverlay = svgNode("g", { "pointer-events": "none" }); root.appendChild(this.gOverlay);
    this.gLabels = svgNode("g", { class: "geo-labels", "pointer-events": "none" }); root.appendChild(this.gLabels);
    this.gCaps = svgNode("g", { class: "geo-caps" }); root.appendChild(this.gCaps);
    this.gFx = svgNode("g", { "pointer-events": "none" }); root.appendChild(this.gFx);
    svg.appendChild(svgNode("path", { d: F.outline, fill: "none", stroke: "#2b2236", "stroke-width": "3", "vector-effect": "non-scaling-stroke", "pointer-events": "none" }));

    this.paths = {};
    this.labels = {};
    for (const [id, s] of Object.entries(F.shapes)) {
      const p = Geo.byId[id];
      const path = svgNode("path", { d: s.d, class: "cty", fill: p ? Geo.color(p) : "#cfc6b4", "data-id": id, "vector-effect": "non-scaling-stroke" });
      this.gCountries.appendChild(path);
      this.paths[id] = path;
      if (p && !p.special) {
        const t = svgNode("text", { x: s.lab[0], y: s.lab[1], "text-anchor": "middle", "dominant-baseline": "middle" });
        t.textContent = p.nom;
        this.gLabels.appendChild(t);
        this.labels[id] = t;
      }
    }
    for (const m of GEO_MERS) {
      const [x, y] = GeoProj.project(m.lon, m.lat);
      const t = svgNode("text", { x, y, "text-anchor": "middle", class: m.ocean ? "ocean" : "sea" });
      t.textContent = m.nom;
      this.gSeas.appendChild(t);
    }
    if (this.o.capitals) this.buildCapitals();
    this.view = { x: 0, y: 0, w: F.W, h: F.H };
    this.bindEvents();
    this.applyView();
    this.ro = new ResizeObserver(() => this.refresh());
    this.ro.observe(this.wrap);
  }
  destroy() { this.ro && this.ro.disconnect(); cancelAnimationFrame(this.anim); }

  graticule() {
    let d = "";
    for (let lon = -150; lon <= 150; lon += 30) {
      const pts = []; for (let lat = -90; lat <= 90; lat += 5) pts.push(GeoProj.project(lon, lat));
      d += "M" + pts.map((p) => p[0].toFixed(0) + " " + p[1].toFixed(0)).join("L");
    }
    for (let lat = -60; lat <= 60; lat += 30) {
      const pts = []; for (let lon = -180; lon <= 180; lon += 10) pts.push(GeoProj.project(lon, lat));
      d += "M" + pts.map((p) => p[0].toFixed(0) + " " + p[1].toFixed(0)).join("L");
    }
    return d;
  }

  buildCapitals() {
    this.caps = {};
    for (const p of Geo.jouables()) {
      if (!p.cap) continue;
      const [x, y] = GeoProj.project(p.cap[1], p.cap[0]);
      const c = svgNode("circle", { cx: x, cy: y, r: 4, class: "cap", "data-id": p.id });
      const title = svgNode("title"); title.textContent = p.capitale; c.appendChild(title);
      this.gCaps.appendChild(c);
      this.caps[p.id] = c;
    }
  }

  /* ---------- zoom et déplacement ---------- */
  scale() {
    const r = this.svg.getBoundingClientRect();
    return Math.min(r.width / this.view.w, r.height / this.view.h) || 1;
  }
  stageScale() { return App.stage.getBoundingClientRect().width / 1024 || 1; }
  clampView(v) {
    const minW = this.W / this.o.maxZoom;
    v.w = Math.max(minW, Math.min(this.W, v.w));
    v.h = v.w * (this.H / this.W);
    v.x = Math.max(-v.w * 0.25, Math.min(this.W - v.w * 0.75, v.x));
    v.y = Math.max(-v.h * 0.25, Math.min(this.H - v.h * 0.75, v.y));
    if (v.w >= this.W) { v.x = 0; v.y = 0; }
    return v;
  }
  applyView() {
    const v = this.view;
    this.svg.setAttribute("viewBox", `${v.x.toFixed(1)} ${v.y.toFixed(1)} ${v.w.toFixed(1)} ${v.h.toFixed(1)}`);
    if (!this._raf) this._raf = requestAnimationFrame(() => { this._raf = null; this.refresh(); });
  }
  setView(v) { this.view = this.clampView(Object.assign({}, v)); this.applyView(); }
  zoomBy(f, cx, cy) {
    const v = this.view;
    if (cx == null) { cx = v.x + v.w / 2; cy = v.y + v.h / 2; }
    const nw = v.w / f;
    const k = nw / v.w;
    this.setView({ x: cx - (cx - v.x) * k, y: cy - (cy - v.y) * k, w: nw, h: nw * this.H / this.W });
  }
  reset(anim = true) { anim ? this.animateTo([0, 0, this.W, this.H], 0) : this.setView({ x: 0, y: 0, w: this.W, h: this.H }); }
  animateTo(box, pad = 0.15, minW = 260) {
    let [x0, y0, x1, y1] = box;
    let w = Math.max(minW, (x1 - x0) * (1 + pad * 2)), hh = (y1 - y0) * (1 + pad * 2);
    const r = this.svg.getBoundingClientRect();
    const aspect = r.width && r.height ? r.width / r.height : this.W / this.H;
    if (w / hh < aspect) w = hh * aspect;          // la boîte doit tenir en hauteur aussi
    w = Math.min(this.W, w);
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    const target = this.clampView({ x: cx - w / 2, y: cy - (w * this.H / this.W) / 2, w, h: 0 });
    const from = Object.assign({}, this.view), t0 = performance.now(), dur = 650;
    cancelAnimationFrame(this.anim);
    const step = (t) => {
      const k = Math.min(1, (t - t0) / dur), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      this.view = { x: from.x + (target.x - from.x) * e, y: from.y + (target.y - from.y) * e, w: from.w + (target.w - from.w) * e, h: 0 };
      this.view.h = this.view.w * this.H / this.W;
      this.applyView();
      if (k < 1) this.anim = requestAnimationFrame(step);
    };
    this.anim = requestAnimationFrame(step);
  }
  focusCountry(id, minW = 300) {
    const s = GEO_FORMES.shapes[id]; if (!s) return;
    this.animateTo(s.main, 0.35, minW);
  }
  /* cadrage de chaque continent (longitudes / latitudes), pour que la Russie n'étire pas l'Europe, etc. */
  focusContinent(c) {
    const V = { AF: [-20, 55, -36, 38], EU: [-25, 45, 34, 71], AS: [25, 150, -11, 62], NA: [-168, -52, 7, 74],
      SA: [-85, -33, -56, 13], OC: [110, 180, -48, 2], AN: [-180, 180, -90, -60] }[c];
    if (!V) return;
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    const add = (lon, lat) => { const [x, y] = GeoProj.project(lon, lat); x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); };
    for (let k = 0; k <= 10; k++) {
      const lon = V[0] + (V[1] - V[0]) * k / 10, lat = V[2] + (V[3] - V[2]) * k / 10;
      add(lon, V[2]); add(lon, V[3]); add(V[0], lat); add(V[1], lat);
    }
    this.animateTo([x0, y0, x1, y1], 0.02, 300);
  }
  toMap(evt) {
    const pt = this.svg.createSVGPoint(); pt.x = evt.clientX; pt.y = evt.clientY;
    const m = this.svg.getScreenCTM(); if (!m) return { x: 0, y: 0 };
    const p = pt.matrixTransform(m.inverse());
    return { x: p.x, y: p.y };
  }

  bindEvents() {
    const svg = this.svg, pts = new Map();
    let downTarget = null, moved = 0, last = null, pinch = null;
    svg.addEventListener("pointerdown", (e) => {
      svg.setPointerCapture(e.pointerId);
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size === 1) { downTarget = e.target; moved = 0; last = { x: e.clientX, y: e.clientY }; }
      if (pts.size === 2) {
        const [a, b] = [...pts.values()];
        pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), w: this.view.w };
        downTarget = null;
      }
    });
    svg.addEventListener("pointermove", (e) => {
      if (!pts.has(e.pointerId)) { this.hover(e); return; }
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size === 2 && pinch) {
        const [a, b] = [...pts.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        const mid = this.toMap({ clientX: (a.x + b.x) / 2, clientY: (a.y + b.y) / 2 });
        if (pinch.d > 0) this.zoomBy(d / pinch.d, mid.x, mid.y);
        pinch.d = d;
        return;
      }
      if (pts.size === 1 && last) {
        const dx = e.clientX - last.x, dy = e.clientY - last.y;
        moved += Math.abs(dx) + Math.abs(dy);
        if (moved > 6) {
          const k = this.scale();
          this.setView({ x: this.view.x - dx / k, y: this.view.y - dy / k, w: this.view.w, h: this.view.h });
          this.wrap.classList.add("dragging");
        }
        last = { x: e.clientX, y: e.clientY };
      }
    });
    const up = (e) => {
      if (!pts.has(e.pointerId)) return;
      pts.delete(e.pointerId);
      if (pts.size === 0) {
        this.wrap.classList.remove("dragging");
        if (downTarget && moved <= 6) this.click(downTarget, e);
        downTarget = null; last = null; pinch = null;
      }
    };
    svg.addEventListener("pointerup", up);
    svg.addEventListener("pointercancel", up);
    svg.addEventListener("pointerleave", () => this.hoverOff());
    svg.addEventListener("wheel", (e) => {
      e.preventDefault();
      const p = this.toMap(e);
      this.zoomBy(e.deltaY < 0 ? 1.25 : 1 / 1.25, p.x, p.y);
    }, { passive: false });
  }
  click(target, e) {
    const cap = target.closest && target.closest(".cap");
    if (cap && this.o.onCapital) { this.o.onCapital(cap.dataset.id, e); return; }
    const c = target.closest && target.closest(".cty");
    if (c && this.o.onCountry) this.o.onCountry(c.dataset.id, e);
    else if (!c && this.o.onSea) this.o.onSea(e);
  }
  hover(e) {
    const c = e.target.closest && (e.target.closest(".cap") || e.target.closest(".cty"));
    if (this._hover === c) return;
    this.hoverOff();
    this._hover = c;
    if (!c) return;
    const id = c.dataset.id;
    if (this.paths[id]) this.paths[id].classList.add("hov");
    if (this.o.onHover) this.o.onHover(id, c.classList.contains("cap"));
  }
  hoverOff() {
    if (this._hover) { const id = this._hover.dataset.id; this.paths[id] && this.paths[id].classList.remove("hov"); }
    this._hover = null;
    if (this.o.onHover) this.o.onHover(null);
  }

  /* ---------- étiquettes, marqueurs, effets ---------- */
  refresh() {
    const k = this.scale(), ss = this.stageScale();
    const zoom = this.W / this.view.w;
    this.gLabels.style.display = this.o.labels ? "" : "none";
    this.gSeas.style.display = this.o.seas ? "" : "none";
    if (this.o.labels) {
      this.gLabels.setAttribute("font-size", (12.5 * ss / k).toFixed(2));
      this.gLabels.setAttribute("stroke-width", (3 * ss / k).toFixed(2));
      for (const [id, t] of Object.entries(this.labels)) {
        const s = GEO_FORMES.shapes[id];
        const wpx = (s.main[2] - s.main[0]) * k / ss;
        const p = Geo.byId[id];
        const show = (wpx > Math.min(110, p.nom.length * 6.5) || (wpx > 26 && zoom > 5)) && !this.paths[id].classList.contains("dim");
        t.style.display = show ? "" : "none";
      }
    }
    if (this.o.seas) {
      this.gSeas.setAttribute("font-size", (13 * ss / k).toFixed(2));
      this.gSeas.querySelectorAll(".sea").forEach((t) => { t.style.display = zoom >= 1.7 ? "" : "none"; });
    }
    if (this.caps) {
      const r = (Math.min(7, 2.4 + zoom * 0.6) * ss / k).toFixed(2);
      for (const c of Object.values(this.caps)) { c.setAttribute("r", r); c.setAttribute("stroke-width", (2 * ss / k).toFixed(2)); }
    }
    this.gFx.querySelectorAll("[data-px]").forEach((el) => {
      const px = Number(el.dataset.px);
      if (el.tagName === "text") {
        el.setAttribute("font-size", (px * ss / k).toFixed(2));
        el.setAttribute("stroke-width", (4 * ss / k).toFixed(2));
        el.setAttribute("y", (Number(el.dataset.y0) - Number(el.dataset.dy) * ss / k).toFixed(2));
      }
      else el.setAttribute("r", (px * ss / k).toFixed(2));
    });
    if (this.o.onView) this.o.onView(zoom);
  }
  setOption(key, val) { this.o[key] = val; this.refresh(); }
  select(id) {
    this.clearSelect();
    const p = this.paths[id]; if (!p) return;
    p.classList.add("sel");
    this.gCountries.appendChild(p);         // au premier plan pour voir tout le contour
    this._sel = id;
    this.ping(GEO_FORMES.shapes[id].lab);
  }
  clearSelect() { if (this._sel && this.paths[this._sel]) this.paths[this._sel].classList.remove("sel"); this._sel = null; }
  mark(id, cls) { const p = this.paths[id]; if (p) p.classList.add(cls); }
  unmarkAll(cls) { this.gCountries.querySelectorAll("." + cls).forEach((p) => p.classList.remove(cls)); }
  dimExcept(cont) {
    for (const [id, path] of Object.entries(this.paths)) {
      const p = Geo.byId[id];
      path.classList.toggle("dim", !!cont && (!p || p.cont !== cont));
    }
    this.refresh();
  }
  ping([x, y], color = "#fff") {
    const c = svgNode("circle", { cx: x, cy: y, r: 10, class: "geo-ping", stroke: color, "vector-effect": "non-scaling-stroke" });
    this.gFx.appendChild(c);
    setTimeout(() => c.remove(), 1300);
  }
  /* étiquette posée au-dessus d'un point ; l'écart (dy) reste le même à l'écran quel que soit le zoom */
  tag(text, x, y, px = 15, dy = 12) {
    const t = svgNode("text", { x, y, "text-anchor": "middle", class: "geo-tag", "data-px": px, "data-y0": y, "data-dy": dy });
    t.textContent = text;
    this.gFx.appendChild(t);
    this.refresh();
    return t;
  }
  dot(x, y, px = 7, cls = "geo-dot") {
    const c = svgNode("circle", { cx: x, cy: y, class: cls, "data-px": px });
    this.gFx.appendChild(c); this.refresh();
    return c;
  }
  clearFx() { this.gFx.innerHTML = ""; }
  setNight(sunLat, sunLon) {
    if (!this.night) {
      this.night = svgNode("path", { fill: "rgba(8,14,48,.62)", filter: "url(#geoNightBlur)" });
      this.gOverlay.appendChild(this.night);
      this.sun = svgNode("g", { class: "geo-sun" });
      this.sun.innerHTML = `<circle r="30" fill="#ffe27a" opacity=".35"/><circle r="17" fill="#ffd84a" stroke="#f6b100" stroke-width="4"/>`;
      this.gOverlay.appendChild(this.sun);
    }
    this.night.setAttribute("d", Geo.nightPath(sunLat, sunLon));
    const [x, y] = GeoProj.project(sunLon, sunLat);
    this.sun.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
  }
}

/* boutons de zoom posés sur une carte */
function mapControls(map, parent) {
  const box = h("div", { class: "geo-zoom" },
    h("button", { class: "btn round white", title: "Zoomer", "aria-label": "Zoomer", onclick: () => { Sound.click(); map.zoomBy(1.6); } }, "+"),
    h("button", { class: "btn round white", title: "Dézoomer", "aria-label": "Dézoomer", onclick: () => { Sound.click(); map.zoomBy(1 / 1.6); } }, "−"),
    h("button", { class: "btn round white", title: "Voir le monde entier", "aria-label": "Voir le monde entier", onclick: () => { Sound.click(); map.reset(); } }, "🌍"));
  parent.appendChild(box);
  return box;
}
function geoUser() {
  const u = Store.user;
  if (!u.geo) u.geo = { missions: {}, vus: {} };
  return u.geo;
}
function geoHeader(root, title, back = "globe") {
  App.backdrop(root);
  root.appendChild(h("div", { class: "screen-header", style: { height: "74px" } }, h("h2", { class: "title", style: { fontSize: "32px" } }, title)));
  App.backButton(root, back);
}

/* ================================================================== */
/* Écran d'accueil du tour du monde (remplace l'ancien globe)          */
/* ================================================================== */
App.register("globe", (root) => {
  if (!Store.user) return App.go("identif");
  Geo.init();
  const g = geoUser();
  App.backdrop(root);
  root.appendChild(h("div", { class: "screen-header" }, h("h2", { class: "title" }, "🌍 Le tour du monde de Boulon")));
  const stars = Object.values(g.missions).reduce((s, m) => s + (m.stars || 0), 0);
  const nbVus = Object.keys(g.vus).length;
  const card = (icon, title, desc, target, extra) => {
    const c = h("button", { class: "panel geo-card", onclick: () => { Sound.click(); App.go(target); } },
      h("div", { class: "gi" }, icon), h("h3", null, title), h("p", null, desc), extra ? h("p", { class: "geo-card-extra" }, extra) : null);
    c.addEventListener("mouseenter", () => Sound.hover());
    return c;
  };
  root.appendChild(h("div", { class: "geo-hub" },
    card("🗺️", "La carte du monde", "Explore les continents, les pays et les océans.", "geo-carte", nbVus ? `${nbVus} pays découverts` : null),
    card("🏙️", "Les capitales", "Trouve les capitales sur la carte.", "geo-capitales"),
    card("🌗", "Le jour et la nuit", "Pourquoi fait-il nuit de l'autre côté de la Terre ?", "geo-jour-nuit"),
    card("🌑", "Les éclipses", "Quand la Lune et la Terre jouent à cache-cache avec le Soleil.", "geo-eclipses"),
    card("🎯", "Les missions", "Gagne des étoiles en relevant des défis !", "geo-missions", `★ ${stars} / 15`)));
  App.backButton(root, "atelier");
  const m = App.mascot(root, { x: 860, y: 590 });
  setTimeout(() => m.say(GEO_TEXTES.hub), 300);
});

/* ================================================================== */
/* 1. La carte du monde                                                */
/* ================================================================== */
App.register("geo-carte", (root, params) => {
  if (!Store.user) return App.go("identif");
  geoHeader(root, "🗺️ La carte du monde");
  const g = geoUser();
  const mapBox = h("div", { class: "geo-mapbox" });
  root.appendChild(mapBox);
  const side = h("div", { class: "panel geo-side" });
  root.appendChild(side);
  let cont = params.cont || null;

  const map = new GeoMap(mapBox, { onCountry: (id) => openCountry(id), onSea: (e) => openSea(e) });
  App.onLeave(() => map.destroy());
  /* clic dans l'eau : on présente l'océan ou la mer la plus proche */
  function openSea(e) {
    const pt = map.toMap(e);
    let best = null, bd = Infinity;
    for (const m of GEO_MERS) {
      if (!m.ocean && map.W / map.view.w < 1.7) continue;
      const [x, y] = GeoProj.project(m.lon, m.lat);
      const d = Math.hypot(x - pt.x, y - pt.y) * (m.ocean ? 1 : 0.6);
      if (d < bd) { bd = d; best = m; }
    }
    if (!best) return;
    Sound.pop();
    map.clearSelect();
    map.ping([pt.x, pt.y], "#bfe8ff");
    side.innerHTML = "";
    side.appendChild(h("div", { class: "geo-fiche" },
      h("div", { class: "geo-fiche-flag", style: { fontSize: "70px" } }, best.ocean ? "🌊" : "⛵"),
      h("h3", null, best.nom),
      h("div", { class: "geo-facts" }, h("p", null, "💡 " + best.fait))));
    side.appendChild(h("div", { class: "geo-fiche-actions" },
      h("button", { class: "btn small white", onclick: () => { Sound.click(); drawList(); } }, "✖ Fermer")));
    Voice.speak(`${best.nom}. ${best.fait}`);
  }
  mapControls(map, mapBox);
  const tgl = (label, key) => {
    const b = h("button", { class: "btn small " + (map.o[key] ? "green" : "white") }, label);
    b.addEventListener("click", () => { map.setOption(key, !map.o[key]); b.className = "btn small " + (map.o[key] ? "green" : "white"); Sound.click(); });
    return b;
  };
  mapBox.appendChild(h("div", { class: "geo-toggles" }, tgl("🏷 Noms", "labels"), tgl("🌊 Mers", "seas")));

  function chips() {
    const wrap = h("div", { class: "geo-chips" });
    const all = h("button", { class: "geo-chip" + (!cont ? " on" : ""), style: { background: "#fff" }, onclick: () => setCont(null) }, "🌍 Monde");
    wrap.appendChild(all);
    for (const [id, c] of Object.entries(GEO_CONTINENTS)) {
      wrap.appendChild(h("button", { class: "geo-chip" + (cont === id ? " on" : ""), style: { background: c.couleur }, onclick: () => setCont(id) }, c.nom));
    }
    return wrap;
  }
  function setCont(c) {
    Sound.click();
    cont = c;
    map.clearSelect();
    map.dimExcept(c);
    if (c) { map.focusContinent(c); Voice.speak(`${GEO_CONTINENTS[c].nom}. ${GEO_CONTINENTS[c].desc}`); }
    else map.reset();
    drawList();
  }
  function drawList() {
    side.innerHTML = "";
    side.appendChild(chips());
    if (!cont) {
      side.appendChild(h("p", { class: "geo-hint" }, "Choisis un continent, ou clique directement sur un pays de la carte. Fais tourner la molette (ou pince l'écran) pour zoomer, et fais glisser pour te déplacer."));
      return;
    }
    const c = GEO_CONTINENTS[cont];
    side.appendChild(h("div", { class: "geo-cont-title", style: { background: c.couleur } }, c.nom));
    side.appendChild(h("p", { class: "geo-hint" }, c.desc));
    const list = h("div", { class: "geo-list" });
    GEO_PAYS.filter((p) => p.cont === cont && !p.special).sort((a, b) => a.nom.localeCompare(b.nom, "fr")).forEach((p) => {
      const b = h("button", { class: "geo-item" + (g.vus[p.id] ? " vu" : "") });
      b.innerHTML = `${p.a2 ? `<img src="${GEO_DRAPEAUX}${p.a2}.svg" alt="" draggable="false">` : "<span>🏳️</span>"}<span>${escapeHtml(p.nom)}</span>`;
      b.addEventListener("click", () => openCountry(p.id));
      b.addEventListener("mouseenter", () => { map.mark(p.id, "hov"); });
      b.addEventListener("mouseleave", () => { map.unmarkAll("hov"); });
      list.appendChild(b);
    });
    side.appendChild(list);
  }
  function openCountry(id) {
    const p = Geo.byId[id];
    if (!p) return;
    Sound.pop();
    map.select(id);
    if (!p.special) map.focusCountry(id);
    if (!g.vus[id]) { g.vus[id] = 1; Store.save(); }
    side.innerHTML = "";
    const c = GEO_CONTINENTS[p.cont];
    const card = h("div", { class: "geo-fiche" });
    card.innerHTML = `
      <div class="geo-fiche-flag">${Geo.flag(p, 92)}</div>
      <h3>${escapeHtml(p.nom)}</h3>
      ${p.territoire ? `<div class="geo-tagline">Territoire rattaché : ${escapeHtml(p.territoire)}</div>` : ""}
      ${p.discute ? `<div class="geo-tagline">Territoire au statut discuté</div>` : ""}
      ${p.capitale ? `<div class="geo-row"><span>🏙️ Capitale</span><b>${escapeHtml(p.capitale)}</b></div>` : ""}
      <div class="geo-row"><span>🧭 Continent</span><b class="geo-pill" style="background:${c.couleur}">${escapeHtml(c.nom)}</b></div>
      <div class="geo-facts">${Geo.facts(p).map((f) => `<p>💡 ${escapeHtml(f)}</p>`).join("")}</div>`;
    side.appendChild(card);
    const speakText = () => [p.nom + ".", p.capitale ? `Sa capitale est ${p.capitale}.` : "", ...Geo.facts(p)].join(" ");
    side.appendChild(h("div", { class: "geo-fiche-actions" },
      h("button", { class: "btn small sky", onclick: () => Voice.speak(speakText()) }, "🔊 Écouter"),
      h("button", { class: "btn small white", onclick: () => { Sound.click(); map.select(id); map.focusCountry(id); } }, "📍 Voir"),
      h("button", { class: "btn small white", onclick: () => { Sound.click(); map.clearSelect(); drawList(); } }, "✖ Fermer")));
    Voice.speak(speakText());
  }
  drawList();
  if (cont) setTimeout(() => { map.dimExcept(cont); map.focusContinent(cont); }, 50);
});

/* ================================================================== */
/* 2. Les capitales                                                    */
/* ================================================================== */
App.register("geo-capitales", (root) => {
  if (!Store.user) return App.go("identif");
  geoHeader(root, "🏙️ Les capitales du monde");
  const mapBox = h("div", { class: "geo-mapbox" });
  root.appendChild(mapBox);
  const side = h("div", { class: "panel geo-side" });
  root.appendChild(side);
  let game = null;
  const map = new GeoMap(mapBox, {
    capitals: true, labels: false, seas: false,
    onCapital: (id) => (game ? answer(id) : showCapital(id)),
    onCountry: (id) => {
      if (game) { Sound.bad(); status.textContent = "Clique sur un point rouge : c'est lui, la capitale !"; return; }
      const p = Geo.byId[id]; if (p && p.jouable) showCapital(id);
    },
    onHover: (id, isCap) => { hoverInfo.textContent = id && isCap ? `${Geo.byId[id].capitale} (${Geo.byId[id].nom})` : ""; },
  });
  App.onLeave(() => map.destroy());
  mapControls(map, mapBox);
  const hoverInfo = h("div", { class: "geo-hover" });
  mapBox.appendChild(hoverInfo);

  const all = Geo.jouables((p) => p.cap).sort((a, b) => a.capitale.localeCompare(b.capitale, "fr"));
  const input = h("input", { class: "field", placeholder: "Cherche une capitale ou un pays…", list: "geo-cap-list", style: { fontSize: "20px" }, "aria-label": "Rechercher" });
  const dl = h("datalist", { id: "geo-cap-list" });
  all.forEach((p) => { dl.appendChild(h("option", { value: p.capitale }, p.nom)); dl.appendChild(h("option", { value: p.nom }, p.capitale)); });
  const status = h("div", { class: "geo-status" });
  const info = h("div", { class: "geo-capinfo" });
  const playBtn = h("button", { class: "btn violet", onclick: startGame }, "🎯 Jeu : trouve la capitale");
  side.append(
    h("p", { class: "geo-hint" }, "Chaque point rouge est une capitale. Clique dessus, ou cherche-la :"),
    h("div", { class: "row" }, input, dl), info, playBtn, status);
  const search = () => {
    const q = normalize(input.value);
    if (!q) return;
    const p = all.find((x) => normalize(x.capitale) === q || normalize(x.nom) === q) || all.find((x) => normalize(x.capitale).startsWith(q) || normalize(x.nom).startsWith(q));
    if (p) { showCapital(p.id); input.value = ""; } else { Sound.bad(); info.innerHTML = "<p>Je ne trouve pas… vérifie l'orthographe !</p>"; }
  };
  input.addEventListener("change", search);
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") search(); });

  function showCapital(id) {
    const p = Geo.byId[id];
    Sound.pop();
    map.clearFx();
    map.select(id);
    map.unmarkAll("capsel");
    Object.values(map.caps).forEach((c) => c.classList.remove("on"));
    if (map.caps[id]) map.caps[id].classList.add("on");
    const [x, y] = GeoProj.project(p.cap[1], p.cap[0]);
    const [lx, ly] = GEO_FORMES.shapes[id].lab;
    const line = svgNode("line", { x1: x, y1: y, x2: lx, y2: ly, class: "geo-link", "vector-effect": "non-scaling-stroke" });
    map.gFx.appendChild(line);
    map.tag(p.capitale, x, y, 16, 12);
    map.animateTo([Math.min(x, lx) - 10, Math.min(y, ly) - 10, Math.max(x, lx) + 10, Math.max(y, ly) + 10], 0.6, 220);
    info.innerHTML = `<div class="row" style="gap:10px">${Geo.flag(p, 44)}<div><b style="font-size:22px">${escapeHtml(p.capitale)}</b><br>capitale : ${escapeHtml(p.nom)}<br><span class="geo-pill" style="background:${GEO_CONTINENTS[p.cont].couleur}">${GEO_CONTINENTS[p.cont].nom}</span></div></div>`;
    if (!game) Voice.speak(`${p.capitale} est la capitale de ce pays : ${p.nom}.`);
  }

  function startGame() {
    Sound.click();
    const pool = shuffle(Geo.jouables((p) => p.cap && Geo.area(p) > 1500)).slice(0, 6);
    game = { pool, i: 0, score: 0, tries: 0 };
    playBtn.classList.add("hidden");
    ask();
  }
  function ask() {
    const p = game.pool[game.i];
    map.clearFx(); map.clearSelect();
    map.focusContinent(p.cont);
    game.tries = 0;
    status.innerHTML = `<b>Question ${game.i + 1} / ${game.pool.length}</b><br>Où est <b>${escapeHtml(p.capitale)}</b>, capitale du pays : ${escapeHtml(p.nom)} ? ${Geo.flag(p, 28)}`;
    info.innerHTML = "";
    Voice.speak(`Où se trouve ${p.capitale}, la capitale du pays ${p.nom} ? Clique sur le bon point rouge.`);
  }
  function answer(id) {
    const p = game.pool[game.i];
    if (id === p.id) {
      Sound.good();
      game.score += game.tries ? 1 : 2;
      showCapital(id);
      status.innerHTML = `✅ ${pick(Messages.good)}`;
      Voice.speak(status.textContent);
      game.i++;
      setTimeout(() => (game.i < game.pool.length ? ask() : end()), 1700);
    } else {
      game.tries++;
      Sound.bad();
      const q = Geo.byId[id];
      status.innerHTML = `❌ Ça, c'est ${escapeHtml(q.capitale)} (${escapeHtml(q.nom)}). ${game.tries >= 2 ? "Regarde : le bon pays clignote !" : "Essaie encore !"}`;
      if (game.tries >= 2) { map.select(p.id); map.focusCountry(p.id, 500); }
    }
  }
  function end() {
    const max = game.pool.length * 2;
    status.innerHTML = `🏁 Bravo ! Tu as <b>${game.score} / ${max}</b> points.`;
    if (game.score >= max - 2) { Sound.fanfare(); App.confetti(); }
    Voice.speak(`Tu as ${game.score} points sur ${max}.`);
    game = null;
    playBtn.classList.remove("hidden");
    playBtn.textContent = "↻ Rejouer";
  }
});

/* ================================================================== */
/* 3. Le jour et la nuit                                               */
/* ================================================================== */
App.register("geo-jour-nuit", (root) => {
  if (!Store.user) return App.go("identif");
  geoHeader(root, "🌗 Le jour et la nuit");
  const mapBox = h("div", { class: "geo-mapbox", style: { height: "430px" } });
  root.appendChild(mapBox);
  const map = new GeoMap(mapBox, { labels: false, seas: false });
  App.onLeave(() => map.destroy());
  const side = h("div", { class: "panel geo-side", style: { height: "430px" } });
  root.appendChild(side);

  /* petit schéma : le Soleil et la Terre qui tourne */
  side.innerHTML = `<svg viewBox="0 0 260 200" class="geo-schema">
      <defs><radialGradient id="jnSun"><stop offset="0" stop-color="#fff6c2"/><stop offset="1" stop-color="#f6c445"/></radialGradient>
      <clipPath id="jnEarth"><circle cx="175" cy="100" r="58"/></clipPath></defs>
      <circle cx="34" cy="100" r="30" fill="url(#jnSun)" stroke="#f6b100" stroke-width="4"/>
      <g stroke="#f6c445" stroke-width="3" opacity=".7">${[70, 85, 100, 115, 130].map((y) => `<line x1="70" y1="${y}" x2="112" y2="${y}"/>`).join("")}</g>
      <circle cx="175" cy="100" r="58" fill="#5bc0eb" stroke="#2b2236" stroke-width="3"/>
      <g clip-path="url(#jnEarth)"><g id="jnLand"><path d="M150 70 q20 -15 40 0 q10 25 -10 35 q-25 5 -30 -35z M185 120 q20 -5 25 15 q-10 20 -30 10z" fill="#7bc950" stroke="#2b2236" stroke-width="2"/></g>
      <rect x="175" y="40" width="70" height="120" fill="rgba(8,14,48,.6)"/></g>
      <g id="jnHouse"><circle r="9" fill="#e4572e" stroke="#2b2236" stroke-width="2"/><text y="4" text-anchor="middle" font-size="10">🏠</text></g>
      <path d="M175 30 a70 70 0 0 1 60 35 l-2 -12 m2 12 l-11 -4" fill="none" stroke="#2b2236" stroke-width="2.5" stroke-linecap="round"/>
      <text x="34" y="150" text-anchor="middle" font-size="14" font-weight="700" fill="#2b2236">Soleil</text>
      <text x="175" y="182" text-anchor="middle" font-size="14" font-weight="700" fill="#2b2236">Terre</text>
    </svg>`;
  const clock = h("div", { class: "geo-clock" });
  const playBtn = h("button", { class: "btn green", onclick: () => toggle() }, "⏸ Pause");
  const speedSel = h("select", { class: "field", style: { fontSize: "16px" }, "aria-label": "Vitesse" },
    h("option", { value: "1" }, "Lente"), h("option", { value: "2" }, "Normale"), h("option", { value: "4" }, "Rapide"));
  speedSel.value = "2";
  side.append(clock, h("div", { class: "row", style: { justifyContent: "center" } }, playBtn, speedSel),
    h("button", { class: "btn small sky", style: { alignSelf: "center" }, onclick: () => explain() }, "💡 Comprendre"));

  /* cartes des villes */
  const citiesRow = h("div", { class: "geo-cities" });
  root.appendChild(citiesRow);
  const cityEls = GEO_VILLES.map((c) => {
    const el = h("div", { class: "geo-city" }, h("span", { class: "ic" }, "☀️"), h("b", null, c.nom), h("small", null, ""));
    citiesRow.appendChild(el);
    const [x, y] = GeoProj.project(c.lon, c.lat);
    const dot = svgNode("g", { class: "geo-citydot", transform: `translate(${x} ${y})` });
    dot.innerHTML = `<circle r="9" class="halo"/><circle r="5" class="core"/>`;
    map.gFx.appendChild(dot);
    return { c, el, dot };
  });

  const date = new Date();
  const decl = Geo.declination(date);
  let t = date.getUTCHours() + date.getUTCMinutes() / 60;   // heure universelle simulée
  let playing = true, last = performance.now(), raf;
  function frame(now) {
    const dt = (now - last) / 1000; last = now;
    if (playing) t = (t + dt * Number(speedSel.value)) % 24;
    draw();
    raf = requestAnimationFrame(frame);
  }
  function draw() {
    const sunLon = (12 - t) * 15;
    map.setNight(decl, ((sunLon + 540) % 360) - 180);
    const hh = Math.floor(t), mm = Math.floor((t % 1) * 60);
    clock.innerHTML = `🕐 Heure universelle : <b>${hh} h ${String(mm).padStart(2, "0")}</b>`;
    // rotation de la Terre sur le schéma : la maison fait un tour par jour
    const a = ((t / 24) * 2 * Math.PI) + Math.PI;
    const house = side.querySelector("#jnHouse");
    if (house) house.setAttribute("transform", `translate(${(175 + 46 * Math.cos(a)).toFixed(1)} ${(100 + 46 * Math.sin(a)).toFixed(1)})`);
    const land = side.querySelector("#jnLand");
    if (land) land.setAttribute("transform", `translate(${((t / 24) * 140 % 140 - 70).toFixed(1)} 0)`);
    for (const ce of cityEls) {
      const el = Geo.sunElevation(ce.c.lat, ce.c.lon, decl, ((sunLon + 540) % 360) - 180);
      const day = el > -3;
      const local = ((t + ce.c.lon / 15) % 24 + 24) % 24;
      ce.el.classList.toggle("night", !day);
      ce.el.querySelector(".ic").textContent = el > 3 ? "☀️" : el > -3 ? "🌅" : "🌙";
      ce.el.querySelector("small").textContent = `vers ${Math.floor(local)} h`;
      ce.dot.classList.toggle("night", !day);
    }
  }
  function toggle() { playing = !playing; playBtn.textContent = playing ? "⏸ Pause" : "▶ Démarrer"; playBtn.className = "btn " + (playing ? "green" : "sky"); Sound.click(); }
  function explain() {
    let close;
    const node = h("div", { class: "col", style: { alignItems: "center", textAlign: "center" } },
      h("div", { style: { fontSize: "60px" } }, "☀️ 🌍 🌙"),
      h("p", { style: { fontSize: "22px", margin: "0" } }, GEO_TEXTES.jourNuit),
      h("p", { style: { fontSize: "18px", margin: "0" } }, GEO_TEXTES.jourNuit2),
      h("button", { class: "btn", onclick: () => close() }, "J'ai compris !"));
    close = App.modal(node);
    Voice.speak(GEO_TEXTES.jourNuit + " " + GEO_TEXTES.jourNuit2);
  }
  raf = requestAnimationFrame(frame);
  App.onLeave(() => cancelAnimationFrame(raf));
  setTimeout(() => Voice.speak(GEO_TEXTES.jourNuit), 400);
});

/* ================================================================== */
/* 4. Les éclipses                                                     */
/* ================================================================== */
class EclipseScene {
  constructor(parent, kind) {
    this.kind = kind; this.p = 0;
    const svg = this.svg = svgNode("svg", { viewBox: "0 0 900 440", class: "geo-eclipse" });
    svg.innerHTML = `<defs>
        <radialGradient id="ecSun"><stop offset="0" stop-color="#fffbe0"/><stop offset=".6" stop-color="#ffd84a"/><stop offset="1" stop-color="#f6a400"/></radialGradient>
        <radialGradient id="ecGlow"><stop offset="0" stop-color="rgba(255,220,90,.55)"/><stop offset="1" stop-color="rgba(255,220,90,0)"/></radialGradient>
        <radialGradient id="ecSky"><stop offset="0" stop-color="#1d1b3a"/><stop offset="1" stop-color="#0c0b1d"/></radialGradient>
        <clipPath id="ecEarthClip"><circle cx="700" cy="230" r="48"/></clipPath>
        <clipPath id="ecInset"><circle cx="0" cy="0" r="58"/></clipPath>
      </defs>
      <rect width="900" height="440" fill="url(#ecSky)"/>
      <g fill="#fff" opacity=".7">${Array.from({ length: 40 }, (_, i) => `<circle cx="${(i * 223) % 900}" cy="${(i * 137) % 440}" r="${(i % 3) * 0.6 + 0.6}"/>`).join("")}</g>
      <circle cx="120" cy="230" r="170" fill="url(#ecGlow)"/>
      <circle cx="120" cy="230" r="92" fill="url(#ecSun)"/>
      <polygon class="ec-beam" points="212,190 652,212 652,248 212,270" fill="rgba(255,230,120,.12)"/>
      <polygon id="ecUmbraEarth" points="748,182 900,222 900,238 748,278" fill="rgba(0,0,0,.55)"/>
      <ellipse cx="700" cy="230" rx="130" ry="40" fill="none" stroke="rgba(255,255,255,.35)" stroke-dasharray="6 6"/>
      <g id="ecMoonBack"></g>
      <circle cx="700" cy="230" r="48" fill="#3a8fd6" stroke="#bfe8ff" stroke-width="2"/>
      <g clip-path="url(#ecEarthClip)">
        <path d="M672 205 q18 -14 34 -2 q8 18 -8 28 q-20 6 -26 -26z M705 245 q16 -4 20 12 q-8 16 -24 8z" fill="#7bc950"/>
        <rect x="700" y="180" width="60" height="100" fill="rgba(8,14,48,.55)"/>
        <ellipse id="ecSpot" cx="655" cy="230" rx="7" ry="10" fill="rgba(0,0,0,.85)" opacity="0"/>
      </g>
      <polygon id="ecUmbraMoon" points="0,0 0,0 0,0" fill="rgba(0,0,0,.6)" opacity="0"/>
      <g id="ecMoonFront"></g>
      <text x="120" y="352" text-anchor="middle" class="ec-lab">Soleil</text>
      <text x="700" y="300" text-anchor="middle" class="ec-lab">Terre</text>
      <text id="ecMoonLab" x="0" y="0" text-anchor="middle" class="ec-lab">Lune</text>
      <g transform="translate(440 82)">
        <circle r="62" fill="#0c0b1d" stroke="#fff" stroke-width="3"/>
        <g clip-path="url(#ecInset)" id="ecInsetContent"></g>
        <text y="84" text-anchor="middle" class="ec-lab" font-size="14">Vu depuis la Terre</text>
      </g>
      <text x="450" y="425" text-anchor="middle" class="ec-note">Tailles et distances pas à l'échelle</text>`;
    parent.appendChild(svg);
    this.moon = svgNode("circle", { r: 15, fill: "#e8e8e8", stroke: "#fff", "stroke-width": "2" });
    this.set(0);
  }
  set(p) {
    this.p = p;
    const solar = this.kind === "solaire";
    const align = solar ? Math.PI : 0;
    const theta = align + (solar ? -1 : 1) * (p - 0.5) * 1.8 * (solar ? -1 : 1);
    const mx = 700 + 130 * Math.cos(theta), my = 230 + 40 * Math.sin(theta);
    const a = Math.max(0, 1 - Math.abs(theta - align) / 0.42);       // 1 = parfaitement alignés
    const front = Math.sin(theta) > 0 || solar;                       // la Lune passe devant ou derrière la Terre
    const back = this.svg.querySelector("#ecMoonBack"), fr = this.svg.querySelector("#ecMoonFront");
    (front ? fr : back).appendChild(this.moon);
    this.moon.setAttribute("cx", mx.toFixed(1)); this.moon.setAttribute("cy", my.toFixed(1));
    const lab = this.svg.querySelector("#ecMoonLab");
    lab.setAttribute("x", mx.toFixed(1)); lab.setAttribute("y", (my - 24).toFixed(1));
    const inset = this.svg.querySelector("#ecInsetContent");
    const off = (theta - align) / 0.42 * 70 * (solar ? 1 : -1);
    if (solar) {
      // ombre de la Lune sur la Terre
      const um = this.svg.querySelector("#ecUmbraMoon");
      um.setAttribute("points", `${mx},${my - 15} ${mx},${my + 15} 653,${230 + (my - 230) * 0.25 + 4} 653,${230 + (my - 230) * 0.25 - 4}`);
      um.setAttribute("opacity", (a * 0.9).toFixed(2));
      const spot = this.svg.querySelector("#ecSpot");
      spot.setAttribute("cy", (230 + (my - 230) * 0.25).toFixed(1)); spot.setAttribute("opacity", a.toFixed(2));
      this.svg.querySelector("#ecUmbraEarth").setAttribute("opacity", ".25");
      this.moon.setAttribute("fill", "#9a9a9a");
      inset.innerHTML = `<rect x="-62" y="-62" width="124" height="124" fill="rgb(${Math.round(110 - 95 * a)},${Math.round(170 - 150 * a)},${Math.round(235 - 190 * a)})"/>
        ${a > 0.92 ? `<circle r="44" fill="none" stroke="rgba(255,250,220,.75)" stroke-width="8"/>` : ""}
        <circle r="34" fill="#ffd84a"/>
        <circle cx="${off.toFixed(1)}" r="35" fill="#1a1a1a"/>`;
    } else {
      this.svg.querySelector("#ecUmbraMoon").setAttribute("opacity", "0");
      this.svg.querySelector("#ecSpot").setAttribute("opacity", "0");
      this.svg.querySelector("#ecUmbraEarth").setAttribute("opacity", (0.35 + a * 0.5).toFixed(2));
      const r = Math.round(232 - (232 - 181) * a), g = Math.round(232 - (232 - 83) * a), b = Math.round(232 - (232 - 44) * a);
      this.moon.setAttribute("fill", `rgb(${r},${g},${b})`);
      inset.innerHTML = `<rect x="-62" y="-62" width="124" height="124" fill="#0c0b1d"/>
        <circle r="36" fill="rgb(${r},${g},${b})"/>
        <circle cx="${off.toFixed(1)}" r="46" fill="rgba(20,10,10,${(0.35 + 0.2 * (1 - a)).toFixed(2)})"/>`;
    }
    return a;
  }
}

App.register("geo-eclipses", (root, params) => {
  if (!Store.user) return App.go("identif");
  geoHeader(root, "🌑 Les éclipses");
  let kind = params.kind || "solaire";
  const tabs = h("div", { class: "tabs geo-tabs" });
  ["solaire", "lunaire"].forEach((k) => {
    tabs.appendChild(h("div", { class: `tab ${k === "solaire" ? "fr" : "math"} ${k === kind ? "on" : ""}`, role: "button", tabindex: "0",
      onclick: () => { Sound.click(); App.go("geo-eclipses", { kind: k }); } }, k === "solaire" ? "☀️ Éclipse solaire" : "🌕 Éclipse lunaire"));
  });
  root.appendChild(tabs);
  const box = h("div", { class: "geo-eclipse-box" });
  root.appendChild(box);
  const scene = new EclipseScene(box, kind);
  let p = 0, playing = false, last = 0, raf;
  const DUR = 9;
  const step = (now) => {
    const dt = last ? (now - last) / 1000 : 0; last = now;
    if (playing) {
      p = Math.min(1, p + dt / DUR);
      scene.set(p);
      if (p >= 1) { playing = false; btnPlay.textContent = "▶ Voir l'animation"; }
    }
    raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
  App.onLeave(() => cancelAnimationFrame(raf));
  const text = kind === "solaire" ? GEO_TEXTES.solaire : GEO_TEXTES.lunaire;
  const btnPlay = h("button", { class: "btn green", onclick: () => { Sound.click(); if (p >= 1) p = 0; playing = true; last = 0; btnPlay.textContent = "▶ En cours…"; } }, "▶ Voir l'animation");
  root.appendChild(h("div", { class: "geo-eclipse-actions" },
    btnPlay,
    h("button", { class: "btn white", onclick: () => { Sound.click(); playing = false; btnPlay.textContent = "▶ Continuer"; } }, "⏸ Pause"),
    h("button", { class: "btn sky", onclick: () => { Sound.click(); p = 0; scene.set(0); playing = true; last = 0; btnPlay.textContent = "▶ En cours…"; } }, "↻ Recommencer"),
    h("button", { class: "btn violet", onclick: () => explain() }, "💡 Comprendre le phénomène")));
  const caption = h("div", { class: "geo-caption" }, text);
  root.appendChild(caption);
  function explain() {
    let close;
    const node = h("div", { class: "col", style: { alignItems: "center", textAlign: "center" } },
      h("div", { style: { fontSize: "54px" } }, kind === "solaire" ? "☀️ 🌑 🌍" : "☀️ 🌍 🌑"),
      h("p", { style: { fontSize: "22px", margin: "0" } }, text),
      h("p", { style: { fontSize: "17px", margin: "0" } }, kind === "solaire" ? GEO_TEXTES.attention : GEO_TEXTES.echelle),
      h("button", { class: "btn", onclick: () => close() }, "J'ai compris !"));
    close = App.modal(node);
    Voice.speak(text + " " + (kind === "solaire" ? GEO_TEXTES.attention : ""));
  }
  setTimeout(() => Voice.speak(text), 400);
});

/* ================================================================== */
/* 5. Les missions                                                     */
/* ================================================================== */
const GEO_MISSIONS = [
  { id: "continents", icon: "🧭", titre: "Mission continents", desc: "Retrouve les continents sur la carte." },
  { id: "pays", icon: "📍", titre: "Mission pays", desc: "Retrouve des pays sur la carte, comme le Maroc." },
  { id: "capitales", icon: "🏙️", titre: "Mission capitales", desc: "Glisse chaque capitale sur son pays." },
  { id: "jour-nuit", icon: "🌗", titre: "Mission jour et nuit", desc: "Fait-il jour ou nuit dans cette ville ?" },
  { id: "eclipses", icon: "🌑", titre: "Mission Soleil et Lune", desc: "Reconnais les éclipses." },
];
App.register("geo-missions", (root) => {
  if (!Store.user) return App.go("identif");
  const g = geoUser();
  geoHeader(root, "🎯 Les missions");
  const list = h("div", { class: "geo-missions" });
  GEO_MISSIONS.forEach((m) => {
    const r = g.missions[m.id];
    const b = h("button", { class: "panel geo-mission-card", onclick: () => { Sound.click(); App.go("geo-mission", { id: m.id }); } },
      h("div", { class: "gi" }, m.icon), h("h3", null, m.titre), h("p", null, m.desc));
    const st = h("div", { class: "big-stars", style: { fontSize: "30px", letterSpacing: "4px" } }); st.innerHTML = starsHtml(r ? r.stars : 0);
    b.appendChild(st);
    if (r) b.appendChild(h("small", null, `Meilleur score : ${r.best} points`));
    list.appendChild(b);
  });
  root.appendChild(list);
});

App.register("geo-mission", (root, params) => {
  if (!Store.user) return App.go("identif");
  const m = GEO_MISSIONS.find((x) => x.id === params.id);
  const g = geoUser();
  geoHeader(root, `${m.icon} ${m.titre}`, "geo-missions");
  const N = 5;
  let qi = 0, points = 0, correct = 0, tries = 0, locked = false;
  const top = h("div", { class: "geo-mtop" });
  const prog = h("div", { class: "exo-progress", style: { flex: "1" } });
  for (let i = 0; i < N; i++) prog.appendChild(h("span"));
  const pts = h("div", { class: "geo-points" }, "⭐ 0 point");
  top.append(prog, pts);
  root.appendChild(top);
  const prompt = h("div", { class: "geo-prompt" });
  root.appendChild(prompt);
  const area = h("div", { class: "geo-marea" });
  root.appendChild(area);
  const fb = h("div", { class: "geo-fb hidden" });
  root.appendChild(fb);
  let map = null;
  App.onLeave(() => map && map.destroy());

  const say = (html, speak) => { prompt.innerHTML = html; if (speak) Voice.speak(speak); };
  function feedback(ok, text) {
    fb.className = "geo-fb " + (ok ? "good" : "bad");
    fb.textContent = (ok ? "✅ " : "💡 ") + text;
    Voice.speak(text);
  }
  function result(state) {
    locked = true;
    prog.children[qi].classList.remove("cur");
    prog.children[qi].classList.add(state);
    if (state === "ok") { correct++; points += 10; } else if (state === "half") { correct++; points += 5; }
    pts.textContent = `⭐ ${points} point${points > 1 ? "s" : ""}`;
    setTimeout(() => { qi++; qi < N ? ask() : end(); }, state === "ko" ? 2600 : 1500);
  }
  function wrong(explication, solutionFn) {
    tries++;
    Sound.bad();
    if (tries >= 2) { feedback(false, explication); solutionFn && solutionFn(); result("ko"); }
    else feedback(false, explication + " Essaie encore !");
  }
  function good() { Sound.good(); feedback(true, pick(Messages.good)); result(tries ? "half" : "ok"); }
  function ensureMap(opts) {
    if (!map) { area.innerHTML = ""; area.className = "geo-marea map"; map = new GeoMap(area, opts); mapControls(map, area); }
    // la carte est réutilisée d'une question à l'autre : on remplace ses réactions au clic
    // pour qu'elles vérifient la réponse de la question EN COURS (et pas celle de la première)
    else Object.assign(map.o, opts);
    return map;
  }

  /* ---------- questions de chaque mission ---------- */
  const conts = shuffle(["AF", "EU", "AS", "NA", "SA", "OC", "AN"]).slice(0, N);
  const paysPool = [Geo.byId["504"]].concat(shuffle(Geo.jouables((p) => Geo.area(p) > 2500 && p.id !== "504"))).slice(0, N);
  let capRound = 0;
  const date = new Date(), decl = Geo.declination(date);

  const missions = {
    continents() {
      const c = conts[qi];
      const mp = ensureMap({ labels: false, seas: false, onCountry: (id) => {
        if (locked) return;
        const p = Geo.byId[id]; if (!p) return;
        if (p.cont === c) { mp.dimExcept(null); highlight(c, "ok"); good(); }
        else wrong(`Ça, c'est ${GEO_CONTINENTS[p.cont].art}${GEO_CONTINENTS[p.cont].nom}.`, () => highlight(c, "ok"));
      } });
      mp.unmarkAll("ok"); mp.reset();
      say(`Clique sur <b>${GEO_CONTINENTS[c].art}${GEO_CONTINENTS[c].nom}</b> sur la carte.`, `Clique sur ${GEO_CONTINENTS[c].art}${GEO_CONTINENTS[c].nom}.`);
      function highlight(cc, cls) { for (const p of GEO_PAYS) if (p.cont === cc) mp.mark(p.id, cls); }
    },
    pays() {
      const target = paysPool[qi];
      const mp = ensureMap({ labels: false, seas: false, onCountry: (id) => {
        if (locked) return;
        const p = Geo.byId[id]; if (!p) return;
        if (id === target.id) { mp.select(id); good(); }
        else wrong(`Ça, c'est ce pays : ${p.nom}.`, () => { mp.select(target.id); mp.focusCountry(target.id, 500); });
      } });
      mp.clearSelect(); mp.focusContinent(target.cont);
      say(`Retrouve ce pays sur la carte : <b>${escapeHtml(target.nom)}</b> ${Geo.flag(target, 34)}<br><small>Indice : il est en ${GEO_CONTINENTS[target.cont].nom}.</small>`, `Retrouve ce pays sur la carte : ${target.nom}.`);
    },
    capitales() {
      // glisser-déposer : 4 pays, 4 capitales
      area.className = "geo-marea";
      map && map.destroy(); map = null;
      const set = shuffle(Geo.jouables((p) => Geo.area(p) > 1500)).slice(0, 4);
      let placed = 0, errors = 0;
      say("Glisse chaque <b>capitale</b> sur son <b>pays</b>.", "Glisse chaque capitale sur son pays.");
      area.innerHTML = "";
      const zones = h("div", { class: "geo-dz" });
      const tiles = h("div", { class: "geo-tiles" });
      area.append(zones, tiles);
      set.forEach((p) => {
        const z = h("div", { class: "geo-zone", "data-id": p.id });
        z.innerHTML = `${Geo.flag(p, 46)}<b>${escapeHtml(p.nom)}</b><span class="slot">?</span>`;
        zones.appendChild(z);
      });
      shuffle(set).forEach((p) => {
        const t = h("div", { class: "geo-tile", "data-id": p.id }, p.capitale);
        tiles.appendChild(t);
        dragTile(t, (zone) => {
          if (!zone) return false;
          if (zone.dataset.id === p.id) {
            Sound.good();
            zone.classList.add("done"); zone.querySelector(".slot").textContent = p.capitale;
            t.remove(); placed++;
            if (placed === set.length) {
              const state = errors === 0 ? "ok" : errors <= 2 ? "half" : "ko";
              feedback(state !== "ko", state === "ko" ? "Tu y es arrivé ! Relis bien les capitales." : pick(Messages.good));
              result(state);
            } else feedback(true, `Oui ! ${p.capitale} est la capitale de ce pays : ${p.nom}.`);
            return true;
          }
          errors++;
          Sound.bad();
          const q = Geo.byId[zone.dataset.id];
          feedback(false, `Non, ${p.capitale} n'est pas la capitale de ce pays : ${q.nom}.`);
          return false;
        });
      });
      capRound++;
    },
    "jour-nuit"() {
      const mp = ensureMap({ labels: false, seas: false });
      mp.clearFx(); mp.reset(false);
      let city, t, el;
      for (let k = 0; k < 50; k++) {
        city = pick(GEO_VILLES); t = Math.random() * 24;
        const sunLon = ((((12 - t) * 15) + 540) % 360) - 180;
        el = Geo.sunElevation(city.lat, city.lon, decl, sunLon);
        if (Math.abs(el) > 12) { mp.setNight(decl, sunLon); break; }
      }
      const [x, y] = GeoProj.project(city.lon, city.lat);
      mp.dot(x, y, 8, "geo-dot pulse");
      mp.tag(city.nom, x, y, 17, 14);
      const isDay = el > 0;
      say(`Regarde la carte : à <b>${escapeHtml(city.nom)}</b>, fait-il jour ou nuit ?`, `À ${city.nom}, fait-il jour ou nuit ?`);
      const choices = h("div", { class: "choices geo-choices" });
      [["☀️ Jour", true], ["🌙 Nuit", false]].forEach(([label, val]) => {
        const b = h("button", { class: "choice" }, label);
        b.addEventListener("click", () => {
          if (locked) return;
          if (val === isDay) { b.classList.add("right"); good(); }
          else { b.classList.add("wrong"); wrong(isDay ? "La ville est dans la partie éclairée par le Soleil : c'est le jour." : "La ville est dans la partie sombre : le Soleil éclaire l'autre côté de la Terre, c'est la nuit.", () => { [...choices.children].find((x) => x.textContent === (isDay ? "☀️ Jour" : "🌙 Nuit")).classList.add("right"); }); }
        });
        choices.appendChild(b);
      });
      prompt.appendChild(choices);
    },
    eclipses() {
      map && map.destroy(); map = null;
      area.className = "geo-marea"; area.innerHTML = "";
      const kinds = ["solaire", "lunaire", "q1", "solaire", "q2"];
      const k = kinds[qi];
      if (k === "q1" || k === "q2") {
        const q = k === "q1"
          ? { t: "Pendant une éclipse solaire, qui passe entre le Soleil et la Terre ?", c: ["La Lune", "La Terre", "Une étoile"], a: "La Lune", e: GEO_TEXTES.solaire }
          : { t: "Pendant une éclipse lunaire, quelle ombre recouvre la Lune ?", c: ["L'ombre de la Terre", "L'ombre du Soleil", "L'ombre d'un nuage"], a: "L'ombre de la Terre", e: GEO_TEXTES.lunaire };
        say(`<b>${escapeHtml(q.t)}</b>`, q.t);
        area.appendChild(h("div", { style: { fontSize: "90px", textAlign: "center" } }, "☀️ 🌍 🌑"));
        choiceRow(shuffle(q.c), q.a, q.e);
        return;
      }
      const sc = new EclipseScene(area, k);
      sc.set(0.5);
      sc.svg.querySelector("#ecMoonLab").textContent = "?";
      say("<b>Quelle éclipse vois-tu sur ce dessin ?</b>", "Quelle éclipse vois-tu sur ce dessin ?");
      choiceRow(["Éclipse solaire", "Éclipse lunaire"], k === "solaire" ? "Éclipse solaire" : "Éclipse lunaire", k === "solaire" ? GEO_TEXTES.solaire : GEO_TEXTES.lunaire);
    },
  };
  function choiceRow(labels, answer, explication) {
    const row = h("div", { class: "choices geo-choices" });
    labels.forEach((l) => {
      const b = h("button", { class: "choice" }, l);
      b.addEventListener("click", () => {
        if (locked || b.classList.contains("wrong")) return;
        if (l === answer) { b.classList.add("right"); good(); }
        else { b.classList.add("wrong"); wrong(explication, () => [...row.children].find((x) => x.textContent === answer).classList.add("right")); }
      });
      row.appendChild(b);
    });
    prompt.appendChild(row);
  }

  function ask() {
    locked = false; tries = 0;
    fb.className = "geo-fb hidden";
    [...prog.children].forEach((s, i) => s.classList.toggle("cur", i === qi));
    missions[m.id]();
  }
  function end() {
    map && map.destroy(); map = null;
    const stars = correct >= 5 ? 3 : correct >= 4 ? 2 : correct >= 3 ? 1 : 0;
    const r = g.missions[m.id] || { best: 0, stars: 0, tries: 0 };
    const avant = r.stars || 0;
    r.best = Math.max(r.best, points); r.stars = Math.max(r.stars, stars); r.tries = (r.tries || 0) + 1; r.date = todayStr();
    g.missions[m.id] = r; Store.save();
    if (typeof Journal !== "undefined") Journal.noter(Store.user, "mission", m.id, stars, m.titre);
    if (typeof Aventure !== "undefined") Aventure.apresMission(m.id, avant, stars);
    area.className = "geo-marea"; area.innerHTML = "";
    prompt.innerHTML = ""; prompt.classList.add("hidden");
    fb.className = "geo-fb hidden";
    const box = h("div", { class: "panel result", style: { position: "relative", left: "auto", right: "auto", top: "auto", margin: "0 auto", width: "560px" } });
    box.innerHTML = `<h2 class="title dark" style="font-size:30px">Mission terminée !</h2>
      <div class="note">${points}<span style="font-size:40px"> points</span></div>
      <div class="big-stars">${starsHtml(stars)}</div>
      <p style="font-size:20px">${correct} bonne${correct > 1 ? "s" : ""} réponse${correct > 1 ? "s" : ""} sur ${N}</p>`;
    box.appendChild(h("div", { class: "row", style: { justifyContent: "center" } },
      h("button", { class: "btn sky", onclick: () => App.go("geo-mission", { id: m.id }) }, "↻ Rejouer"),
      h("button", { class: "btn white", onclick: () => App.go("geo-missions") }, "Autres missions")));
    area.appendChild(box);
    if (stars === 3) { Sound.fanfare(); App.confetti(); } else if (stars) Sound.good();
    Voice.speak(stars === 3 ? "Mission réussie avec trois étoiles ! Bravo, grand explorateur !" : `Mission terminée : tu gagnes ${stars} étoile${stars > 1 ? "s" : ""}.`);
  }
  ask();
});

/* glisser-déposer compatible souris et tablette */
function dragTile(tile, onDrop) {
  tile.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    tile.setPointerCapture(e.pointerId);
    const r0 = tile.getBoundingClientRect();
    const ox = e.clientX - r0.left, oy = e.clientY - r0.top;
    const ss = App.stage.getBoundingClientRect().width / 1024;
    tile.classList.add("dragging");
    let over = null;
    const move = (ev) => {
      tile.style.transform = `translate(${(ev.clientX - ox - r0.left) / ss}px, ${(ev.clientY - oy - r0.top) / ss}px) rotate(-3deg)`;
      tile.style.visibility = "hidden";
      const el = document.elementFromPoint(ev.clientX, ev.clientY);
      tile.style.visibility = "";
      const z = el && el.closest(".geo-zone:not(.done)");
      if (over !== z) { over && over.classList.remove("over"); over = z; over && over.classList.add("over"); }
    };
    let done = false;
    const up = (ev) => {
      if (done) return;
      done = true;
      if (ev && ev.clientX != null) move(ev);           // dernière position = point de lâcher
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      window.removeEventListener("mouseup", up);
      tile.classList.remove("dragging");
      over && over.classList.remove("over");
      const ok = onDrop(over);
      if (!ok && tile.isConnected) { tile.style.transition = "transform .3s"; tile.style.transform = ""; setTimeout(() => (tile.style.transition = ""), 320); }
    };
    // écoute sur la fenêtre : le lâcher est capté même si le doigt ou la souris sort de l'étiquette
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    window.addEventListener("mouseup", up);
  });
}

/* ---------------- Objet de l'atelier apporté par le module géographie ---------------- */
/* globe */
objetAtelier({
  id: "globe", ecran: "globe", ordre: 60, label: "Le tour du monde",
  desc: "La carte du monde, les capitales, le jour et la nuit, les éclipses et des missions.",
  svg: () => `
        <path d="M660 232 h70 l-10 -10 h-50z" fill="#8a5a24" ${S}/>
        <line x1="695" y1="222" x2="695" y2="206" ${S}/>
        <path d="M650 152 a48 48 0 1 0 90 0" fill="none" stroke="#8a5a24" stroke-width="6"/>
        <circle cx="695" cy="160" r="42" fill="#5bc0eb" ${S}/>
        <path d="M665 140 q14 -16 30 -6 q4 16 -12 22 q-6 14 -20 4z" fill="#7bc950" ${S} stroke-width="2"/>
        <path d="M705 150 q16 -6 24 8 q-2 22 -18 28 q-10 -14 -6 -36z" fill="#7bc950" ${S} stroke-width="2"/>
  `,
});

/* ---------------- Médailles du module géographie ---------------- */
ajouterMedailles([
  { id: "explorateur", icone: "🗺️", nom: "Explorateur", desc: "Découvre 50 pays sur la carte du monde.", ok: (u) => Object.keys(geoOf(u).vus || {}).length >= 50 },
  { id: "mission-parfaite", icone: "🌍", nom: "Mission parfaite", desc: "Réussis une mission de géographie avec 3 étoiles.",
    ok: (u) => Object.values(geoOf(u).missions || {}).some((r) => r.stars >= 3) },
  { id: "globe-trotteur", icone: "🧳", nom: "Globe-trotteur", desc: "Gagne au moins une étoile dans chaque mission de géographie.",
    ok: (u) => typeof GEO_MISSIONS !== "undefined" && GEO_MISSIONS.every((m) => (geoOf(u).missions[m.id] || {}).stars >= 1) },
], { apres: "boussole" });
