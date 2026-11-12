/* L'Atelier de Boulon — projection « Natural Earth » (forme arrondie et agréable pour les enfants).
   Partagée entre le jeu (navigateur) et l'outil de construction de la carte (Node). */
(function (root) {
  "use strict";
  const W = 2000;                                   // largeur de la carte en unités SVG
  function raw(lambda, phi) {
    const phi2 = phi * phi, phi4 = phi2 * phi2;
    return [
      lambda * (0.8707 - 0.131979 * phi2 + phi4 * (-0.013791 + phi4 * (0.003971 * phi2 - 0.001529 * phi4))),
      phi * (1.007226 + phi2 * (0.015085 + phi4 * (-0.044475 + 0.028874 * phi2 - 0.005916 * phi4))),
    ];
  }
  const XMAX = raw(Math.PI, 0)[0];
  const YMAX = raw(0, Math.PI / 2)[1];
  const S = W / (2 * XMAX);
  const H = Math.round(2 * YMAX * S);
  const RAD = Math.PI / 180;

  /* longitude, latitude (degrés) → x, y dans le repère de la carte (0..W, 0..H) */
  function project(lon, lat) {
    const p = raw(lon * RAD, lat * RAD);
    return [W / 2 + p[0] * S, H / 2 - p[1] * S];
  }

  /* inverse approché (Newton) : x, y → longitude, latitude */
  function invert(x, y) {
    const px = (x - W / 2) / S, py = (H / 2 - y) / S;
    let phi = py;
    for (let i = 0; i < 25; i++) {
      const phi2 = phi * phi, phi4 = phi2 * phi2;
      const f = phi * (1.007226 + phi2 * (0.015085 + phi4 * (-0.044475 + 0.028874 * phi2 - 0.005916 * phi4))) - py;
      const df = 1.007226 + phi2 * (3 * 0.015085 + phi4 * (7 * -0.044475 + 9 * 0.028874 * phi2 - 11 * 0.005916 * phi4));
      phi -= f / df;
      if (Math.abs(f) < 1e-9) break;
    }
    const phi2 = phi * phi, phi4 = phi2 * phi2;
    const lambda = px / (0.8707 - 0.131979 * phi2 + phi4 * (-0.013791 + phi4 * (0.003971 * phi2 - 0.001529 * phi4)));
    return [lambda / RAD, phi / RAD];
  }

  /* contour du « globe » (bord de la carte) sous forme de chemin SVG */
  function outline(step = 2) {
    const pts = [];
    for (let lat = -90; lat <= 90; lat += step) pts.push(project(180, lat));
    for (let lat = 90; lat >= -90; lat -= step) pts.push(project(-180, lat));
    return "M" + pts.map((p) => p[0].toFixed(1) + " " + p[1].toFixed(1)).join("L") + "Z";
  }

  const api = { W, H, project, invert, outline };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.GeoProj = api;
})(typeof window !== "undefined" ? window : this);
