/* Construit les données de la carte du jeu à partir de world-atlas (Natural Earth, domaine public).
   Usage : node outils-geo/construire_carte.js <dossier world-atlas> <dossier flag-icons>
   Sorties : modules/geo/js/geo-formes.js  +  modules/geo/img/drapeaux/<code>.svg */
"use strict";
const fs = require("fs");
const path = require("path");
const P = require("../modules/geo/js/geo-projection.js");

const [waDir, fiDir] = process.argv.slice(2);
if (!waDir) { console.error("usage: node construire_carte.js <world-atlas> <flag-icons>"); process.exit(1); }
const GAME = path.join(__dirname, "..", "modules", "geo");   // dossier du module géographie
const topo = JSON.parse(fs.readFileSync(path.join(waDir, "countries-50m.json"), "utf8"));

/* Regroupements : formes rattachées à un autre identifiant */
const MERGE_BY_ID = { "732": "504" };                      // Sahara occidental → Maroc (choix de l'utilisateur)
const MERGE_BY_NAME = { "Somaliland": "706", "N. Cyprus": "196", "Siachen Glacier": "356" };
const ID_BY_NAME = { "Kosovo": "XKX", "Indian Ocean Ter.": "IOT" };

/* ---------- décodage TopoJSON (arcs quantifiés, codés en différences) ---------- */
const [sx, sy] = topo.transform.scale, [tx, ty] = topo.transform.translate;
const arcs = topo.arcs.map((arc) => {
  let x = 0, y = 0;
  return arc.map(([dx, dy]) => { x += dx; y += dy; return [x * sx + tx, y * sy + ty]; });
});
function ring(indices) {
  const pts = [];
  for (const i of indices) {
    const a = i < 0 ? arcs[~i].slice().reverse() : arcs[i];
    for (let k = pts.length ? 1 : 0; k < a.length; k++) pts.push(a[k]);
  }
  return pts;
}
function polygons(geom) {
  if (geom.type === "Polygon") return [geom.arcs.map(ring)];
  if (geom.type === "MultiPolygon") return geom.arcs.map((p) => p.map(ring));
  return [];
}

/* ---------- simplification (Douglas-Peucker) ---------- */
function simplify(pts, tol) {
  if (pts.length < 4) return pts;
  const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1;
  // anneau fermé (premier point = dernier) : on ancre aussi le point le plus éloigné du départ
  let far = 0, fd = -1;
  for (let i = 1; i < pts.length - 1; i++) { const d = Math.hypot(pts[i][0] - pts[0][0], pts[i][1] - pts[0][1]); if (d > fd) { fd = d; far = i; } }
  keep[far] = 1;
  const stack = far ? [[0, far], [far, pts.length - 1]] : [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    let max = 0, idx = -1;
    const [ax, ay] = pts[a], [bx, by] = pts[b];
    const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1e-9;
    for (let i = a + 1; i < b; i++) {
      const d = Math.abs(dy * pts[i][0] - dx * pts[i][1] + bx * ay - by * ax) / len;
      if (d > max) { max = d; idx = i; }
    }
    if (max > tol && idx > 0) { keep[idx] = 1; stack.push([a, idx], [idx, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}
const areaOf = (pts) => { let s = 0; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) s += (pts[j][0] + pts[i][0]) * (pts[j][1] - pts[i][1]); return s / 2; };
function centroid(pts) {
  let cx = 0, cy = 0, a = 0;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const f = pts[j][0] * pts[i][1] - pts[i][0] * pts[j][1];
    cx += (pts[j][0] + pts[i][0]) * f; cy += (pts[j][1] + pts[i][1]) * f; a += f;
  }
  if (Math.abs(a) < 1e-9) return pts[0];
  return [cx / (3 * a), cy / (3 * a)];
}

/* ---------- projection + regroupement par pays ---------- */
const shapes = {};
const names = {};
const groups = {};
for (const g of topo.objects.countries.geometries) {
  const name = g.properties.name;
  let id = g.id || ID_BY_NAME[name] || MERGE_BY_NAME[name];
  if (!id) { console.warn("sans identifiant, ignoré :", name); continue; }
  const own = !(MERGE_BY_ID[id] || MERGE_BY_NAME[name]);
  id = MERGE_BY_ID[id] || MERGE_BY_NAME[name] || id;
  if (own || !names[id]) names[id] = name;
  (groups[id] || (groups[id] = [])).push(g);
}

/* fusion de plusieurs formes en une seule, sans frontière intérieure :
   on garde seulement les arcs qui ne sont pas partagés entre deux formes, puis on les recoud en anneaux */
function arcPolys(g) { return g.type === "Polygon" ? [g.arcs] : g.type === "MultiPolygon" ? g.arcs : []; }
function dissolve(geoms) {
  const refs = [];
  for (const g of geoms) for (const poly of arcPolys(g)) for (const r of poly) refs.push(...r);
  const idx = (r) => (r < 0 ? ~r : r);
  const count = new Map();
  for (const r of refs) count.set(idx(r), (count.get(idx(r)) || 0) + 1);
  const ext = refs.filter((r) => count.get(idx(r)) === 1);
  const key = (p) => p[0].toFixed(6) + "," + p[1].toFixed(6);
  const first = (r) => (r < 0 ? arcs[~r][arcs[~r].length - 1] : arcs[r][0]);
  const last = (r) => (r < 0 ? arcs[~r][0] : arcs[r][arcs[r].length - 1]);
  const byStart = new Map();
  for (const r of ext) { const k = key(first(r)); if (!byStart.has(k)) byStart.set(k, []); byStart.get(k).push(r); }
  const used = new Set(), rings = [];
  for (const r0 of ext) {
    if (used.has(r0)) continue;
    const seq = [r0]; used.add(r0);
    let cur = r0;
    for (let guard = 0; guard < 100000; guard++) {
      const k = key(last(cur));
      if (k === key(first(r0))) break;
      const next = (byStart.get(k) || []).find((x) => !used.has(x));
      if (next === undefined) break;
      seq.push(next); used.add(next); cur = next;
    }
    rings.push(ring(seq));
  }
  return rings.map((r) => [r]);                       // chaque anneau devient un polygone
}

for (const [id, geoms] of Object.entries(groups)) {
  const s = shapes[id] = { rings: [], biggest: null, bigArea: 0 };
  const polys = geoms.length > 1 ? dissolve(geoms) : polygons(geoms[0]);
  for (const poly of polys) {
    poly.forEach((r, ri) => {
      // coupe les anneaux qui traversent l'antiméridien (saut de longitude > 180°)
      const parts = [[]];
      r.forEach((p, k) => {
        if (k && Math.abs(p[0] - r[k - 1][0]) > 180) parts.push([]);
        parts[parts.length - 1].push(P.project(p[0], p[1]));
      });
      for (const part of parts) {
        const simp = simplify(part, 0.45);
        if (simp.length < 3) continue;
        s.rings.push(simp);
        const a = Math.abs(areaOf(simp));
        if (ri === 0 && a > s.bigArea) { s.bigArea = a; s.biggest = simp; }
      }
    });
  }
}

const out = {};
for (const [id, s] of Object.entries(shapes)) {
  if (!s.rings.length) continue;
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity, total = 0;
  const d = s.rings.map((r) => {
    for (const [x, y] of r) { if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y; }
    total += Math.abs(areaOf(r));
    return "M" + r.map(([x, y]) => x.toFixed(1) + " " + y.toFixed(1)).join("L") + "Z";
  }).join("");
  const big = s.biggest || s.rings[0];
  let bx0 = Infinity, by0 = Infinity, bx1 = -Infinity, by1 = -Infinity;
  for (const [x, y] of big) { if (x < bx0) bx0 = x; if (y < by0) by0 = y; if (x > bx1) bx1 = x; if (y > by1) by1 = y; }
  const c = centroid(big);
  out[id] = {
    d, en: names[id],
    box: [x0, y0, x1, y1].map((v) => +v.toFixed(1)),          // toutes les parties
    main: [bx0, by0, bx1, by1].map((v) => +v.toFixed(1)),     // partie principale (pour zoomer)
    lab: [+c[0].toFixed(1), +c[1].toFixed(1)],
    area: Math.round(total),
  };
}

const header = "/* Généré par outils-geo/construire_carte.js à partir de world-atlas 2.0.2 (Natural Earth, domaine public).\n   Ne pas modifier à la main. */\n";
const js = header + "window.GEO_FORMES = " + JSON.stringify({ W: P.W, H: P.H, outline: P.outline(), shapes: out }) + ";\n";
fs.writeFileSync(path.join(GAME, "js", "geo-formes.js"), js);
console.log(`geo-formes.js : ${Object.keys(out).length} formes, ${(js.length / 1024).toFixed(0)} Ko`);
fs.writeFileSync(path.join(__dirname, "formes_ids.json"), JSON.stringify(Object.fromEntries(Object.entries(out).map(([k, v]) => [k, v.en])), null, 1));

/* drapeaux : copiés seulement pour les codes listés dans geo-pays.js */
if (fiDir) {
  global.window = {};
  require("../modules/geo/js/geo-pays.js");
  const codes = new Set(window.GEO_PAYS.map((p) => p.a2).filter(Boolean));
  const dest = path.join(GAME, "img", "drapeaux");
  fs.mkdirSync(dest, { recursive: true });
  let n = 0, bytes = 0;
  for (const c of codes) {
    const src = path.join(fiDir, "flags", "4x3", c + ".svg");
    if (!fs.existsSync(src)) { console.warn("drapeau absent :", c); continue; }
    fs.copyFileSync(src, path.join(dest, c + ".svg")); n++; bytes += fs.statSync(src).size;
  }
  console.log(`drapeaux copiés : ${n} (${(bytes / 1024).toFixed(0)} Ko)`);
}
