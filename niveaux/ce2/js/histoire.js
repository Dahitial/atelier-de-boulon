/* L'Atelier de Boulon — Histoire : schémas des leçons, frise du temps et sa mission. */
"use strict";

/* ================================================================== */
/* Schémas animés des leçons d'histoire                                */
/* ================================================================== */
function illuSiecles() {
  const x = (a) => 30 + (a - 1801) * 1.12;
  let s = Il.L(20, 140, 380, 140);
  [1801, 1901, 2001, 2101].forEach((a) => { s += Il.L(x(a), 128, x(a), 152) + Il.T(x(a), 178, a === 2101 ? "2100" : String(a), { s: 14 }); });
  s += Il.E(1, Il.R(x(1801), 92, 112, 32, { f: "#c3aee8", rx: 6 }) + Il.T(x(1851), 114, "XIXe siècle", { s: 15 }));
  s += Il.E(2, Il.R(x(1901), 92, 112, 32, { f: "#9ccbf5", rx: 6 }) + Il.T(x(1951), 114, "XXe siècle", { s: 15 }) + Il.C(x(1956), 140, 6, { f: IC.rouge }) + Il.T(x(1956), 210, "1956 → XXe", { s: 15, c: IC.rouge }));
  s += Il.E(3, Il.R(x(2001), 92, 112, 32, { f: "#a6dc8f", rx: 6 }) + Il.T(x(2051), 114, "XXIe siècle", { s: 15 }) + Il.C(x(2026), 140, 6, { f: IC.vert }) + Il.T(x(2026) + 10, 240, "aujourd'hui", { s: 15, c: IC.vert }));
  s += Il.E(0, Il.T(200, 40, "1 siècle = 100 ans", { s: 22 }) + Il.T(200, 66, "I = 1   V = 5   X = 10", { s: 16, b: false }));
  return { svg: s, legendes: ["Un siècle dure 100 ans. Les siècles s'écrivent en chiffres romains.", "De 1801 à 1900 : le XIXe siècle (19e).", "De 1901 à 2000 : le XXe siècle. 1956 est au XXe siècle.", "De 2001 à 2100 : le XXIe siècle, celui où nous vivons."] };
}

function illuPeriodes() {
  const per = HIST_PERIODES.slice(1);
  const w = 74, noms = { prehistoire: "Préhistoire", antiquite: "Antiquité", moyenage: "Moyen Âge", modernes: "T. modernes", contemporain: "Contemp." };
  let s = "";
  per.forEach((p, i) => {
    s += Il.E(i, `<rect x="${20 + i * w}" y="110" width="${w - 2}" height="50" fill="${p.couleur}" stroke="${IC.ink}" stroke-width="2"/>` + Il.T(20 + i * w + w / 2, 141, noms[p.id], { s: 11, c: "#fff" }));
  });
  const reperes = [["l'écriture", "≈ −3300", 1], ["476", "Rome tombe", 2], ["1492", "Colomb", 3], ["1789", "Révolution", 4]];
  reperes.forEach(([a, b, i]) => { s += Il.E(i, Il.L(20 + i * w - 1, 100, 20 + i * w - 1, 170, { w: 2 }) + Il.T(20 + i * w, 90, a, { s: 13 }) + Il.T(20 + i * w, 190, b, { s: 12, b: false })); });
  s += Il.E(4, Il.fleche(20, 230, 380, 230, IC.ink) + Il.T(200, 258, "le temps avance vers la droite", { s: 15, b: false }));
  return { svg: s, legendes: ["La Préhistoire : avant l'écriture.", "L'Antiquité commence avec l'invention de l'écriture, vers 3300 av. J.-C.", "Le Moyen Âge : de 476 à 1492.", "Les Temps modernes : de 1492 à 1789.", "L'époque contemporaine : depuis 1789. C'est la nôtre !"] };
}

function illuDynasties() {
  const d = [["Idrissides", 788, "#3fa34d"], ["Almoravides", 1056, "#e0a800"], ["Almohades", 1147, "#e4572e"], ["Mérinides", 1248, "#2e86de"], ["Saadiens", 1549, "#8e6cc9"], ["Alaouites", 1666, "#9c6b3c"]];
  const x = (i) => 45 + i * 62;
  let s = Il.L(15, 150, 390, 150);
  d.forEach(([n, a, c], i) => {
    const y = i % 2 ? 190 : 110;
    s += Il.E(i, Il.C(x(i), 150, 7, { f: c }) + Il.L(x(i), 150, x(i), i % 2 ? 172 : 128, { c, w: 2 }) + Il.T(x(i), y, n, { s: 14, c }) + Il.T(x(i), y + (i % 2 ? 18 : -18), String(a), { s: 12, b: false }));
  });
  s += Il.E(5, Il.T(200, 255, "1956 : indépendance du Maroc", { s: 15, c: IC.rouge }));
  return { svg: s, legendes: ["788 : Idriss Ier fonde la dynastie des Idrissides et la ville de Fès.", "Les Almoravides fondent Marrakech.", "Les Almohades construisent la Koutoubia et la Tour Hassan.", "Les Mérinides construisent de belles médersas à Fès.", "Les Saadiens : le palais El Badi à Marrakech.", "Les Alaouites règnent depuis 1666. En 1956, le Maroc retrouve son indépendance."] };
}

function illuHauteurs() {
  const b = [["Tour Hassan", 44, "#9c6b3c"], ["Koutoubia", 77, "#e4572e"], ["Khéops", 146, "#e0a800"], ["Hassan II", 210, "#3fa34d"], ["Tour Eiffel", 330, "#2e86de"]];
  const y0 = 240, k = 0.62;
  let s = Il.L(20, y0, 385, y0, { w: 2 });
  b.forEach(([n, m, c], i) => {
    const x = 50 + i * 72, h = m * k;
    s += Il.E(i, `<path d="M${x - 12},${y0} V${y0 - h + 4} Q${x - 12},${y0 - h} ${x - 8},${y0 - h} H${x + 8} Q${x + 12},${y0 - h} ${x + 12},${y0 - h + 4} V${y0} Z" fill="${c}"/>` + Il.T(x, y0 - h - 6, `${m} m`, { s: 14 }) + Il.T(x, y0 + 18, n, { s: 12 }));
  });
  return { svg: s, legendes: ["La Tour Hassan, à Rabat : 44 mètres.", "Le minaret de la Koutoubia, à Marrakech : environ 77 mètres.", "La pyramide de Khéops, en Égypte : environ 146 mètres à l'origine.", "Le minaret de la mosquée Hassan II, à Casablanca : 210 mètres !", "La tour Eiffel, à Paris : 330 mètres."] };
}

function illuFouille() {
  const couches = [["#c98a3c", "aujourd'hui", "🥤"], ["#b07436", "Moyen Âge", "🏺"], ["#94602d", "Antiquité", "🪙"], ["#784c24", "Préhistoire", "🦴"]];
  let s = "";
  couches.forEach(([c, n, e], i) => {
    const y = 60 + i * 50;
    s += `<rect x="20" y="${y}" width="250" height="50" fill="${c}" stroke="${IC.ink}" stroke-width="1"/>` + Il.E(i, EMO(100 + i * 40, y + 25, e, 28)) + Il.E(i, Il.T(278, y + 30, n, { s: 15, a: "start" }));
  });
  s += Il.E(4, Il.fleche(388, 70, 388, 250, IC.rouge) + Il.T(200, 40, "plus on creuse, plus c'est ancien", { s: 16, c: IC.rouge }));
  return { svg: s, legendes: ["En surface, les objets d'aujourd'hui.", "Plus bas, une poterie du Moyen Âge.", "Encore plus bas, une pièce de l'Antiquité.", "Tout au fond, un os de la Préhistoire.", "Les couches de terre se sont empilées : les plus profondes sont les plus anciennes."] };
}

Object.assign(ILLUSTRATIONS, { "hi1-1": illuSiecles, "hi1-2": illuPeriodes, "hi2-3": illuDynasties, "hi4-1": illuHauteurs, "hi5-1": illuFouille });

/* ================================================================== */
/* La frise du temps                                                   */
/* ================================================================== */
const FRISE = {
  LARGEURS: { avant: 150, prehistoire: 400, antiquite: 430, moyenage: 560, modernes: 300, contemporain: 400 },
  LIGNES: ["repere", "savant", "construction", "decouverte"],
  /* position horizontale d'une année sur la frise (échelle différente dans chaque période) */
  x(annee) {
    let x0 = 0;
    for (const p of HIST_PERIODES) {
      const w = this.LARGEURS[p.id];
      if (annee < p.fin || p.fin === Infinity) {
        const debut = { avant: null, prehistoire: -300000, antiquite: -3300, moyenage: 476, modernes: 1492, contemporain: 1789 }[p.id];
        let t;
        if (p.id === "avant") t = 0.5;
        else if (p.id === "prehistoire") {   // échelle logarithmique « en années avant nous » : 300 000 ans tiennent dans la période
          const a = Math.log10(2026 - annee), lo = Math.log10(2026 + 3300), hi = Math.log10(2026 + 300000);
          t = 1 - (a - lo) / (hi - lo);
        } else t = (annee - debut) / ((p.fin === Infinity ? 2030 : p.fin) - debut);
        return x0 + 18 + Math.max(0, Math.min(1, t)) * (w - 36);
      }
      x0 += w;
    }
    return x0;
  },
  largeur() { return Object.values(this.LARGEURS).reduce((a, b) => a + b, 0); },
};
const histoireEtat = (u) => {
  if (!u.histoire || typeof u.histoire !== "object") u.histoire = {};
  if (!u.histoire.vues || typeof u.histoire.vues !== "object") u.histoire.vues = {};
  return u.histoire;
};

App.register("frise", (root, params) => {
  const u = Store.user; if (!u) return App.go("identif");
  const etat = histoireEtat(u);
  const filtre = params.filtre || "tout", maroc = !!params.maroc;
  App.backdrop(root);
  root.appendChild(h("div", { class: "screen-header" }, h("h2", { class: "title" }, icone(Art.sablier()), " La frise du temps")));

  /* filtres */
  const filtres = h("div", { class: "abs fr-filtres" });
  const fb = (id, txt) => h("button", { class: "btn small " + (filtre === id ? "violet" : "white"), onclick: () => App.go("frise", { filtre: id, maroc, choix: params.choix }) }, txt);
  filtres.append(fb("tout", "Tout"), ...Object.entries(HIST_CATS).map(([id, [ic, nom]]) => fb(id, `${ic} ${nom}`)),
    h("button", { class: "btn small " + (maroc ? "green" : "white"), onclick: () => App.go("frise", { filtre, maroc: !maroc, choix: params.choix }) }, h("span", { class: "mini-drapeau" }, "★"), maroc ? " Maroc ✓" : " Maroc"));
  root.appendChild(filtres);

  /* la frise, dans une zone qu'on fait défiler */
  const cadre = h("div", { class: "panel abs fr-cadre" });
  const W = FRISE.largeur(), H = 300, lig = 56, top = 14;
  const fiches = HIST_FICHES.filter((f) => (filtre === "tout" || f.cat === filtre) && (!maroc || f.maroc));
  let svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
  let x0 = 0;
  HIST_PERIODES.forEach((p) => {
    const w = FRISE.LARGEURS[p.id];
    svg += `<rect x="${x0}" y="0" width="${w}" height="${H - 46}" fill="${p.couleur}" opacity=".10"/>`
      + `<rect x="${x0}" y="${H - 46}" width="${w}" height="34" fill="${p.couleur}" stroke="${IC.ink}" stroke-width="2"/>`
      + `<text x="${x0 + w / 2}" y="${H - 23}" font-size="15" font-weight="700" fill="#fff" text-anchor="middle">${p.court}</text>`;
    x0 += w;
  });
  const bornes = [[FRISE.LARGEURS.avant, "−300 000"], [FRISE.x(-3300) - 18, "−3300"], [FRISE.x(476) - 18, "476"], [FRISE.x(1492) - 18, "1492"], [FRISE.x(1789) - 18, "1789"], [W - 4, "aujourd'hui"]];
  bornes.forEach(([x, t], i) => { svg += `<text x="${Math.max(4, x)}" y="${H - 2}" font-size="12" fill="${IC.ink}" text-anchor="${i === bornes.length - 1 ? "end" : "middle"}">${t}</text>`; });
  FRISE.LIGNES.forEach((c, i) => { svg += `<text x="6" y="${top + i * lig + 32}" font-size="20" opacity=".55">${HIST_CATS[c][0]}</text>`; });
  svg += "</svg>";
  const zone = h("div", { class: "fr-zone", html: svg });
  /* marqueurs : une ligne par catégorie, sans chevauchement */
  FRISE.LIGNES.forEach((c, li) => {
    let dernier = -100;
    fiches.filter((f) => f.cat === c).sort((a, b) => a.annee - b.annee).forEach((f) => {
      const x = Math.max(FRISE.x(f.annee), dernier + 44);
      dernier = x;
      const b = h("button", { class: "fr-point" + (etat.vues[f.id] ? " vu" : "") + (f.maroc ? " maroc" : "") + (params.choix === f.id ? " choisi" : ""), title: `${f.titre} (${f.date})`,
        style: { left: x - 20 + "px", top: top + li * lig + "px" }, onclick: () => montrer(f, b) }, f.e);
      zone.appendChild(b);
    });
  });
  cadre.appendChild(zone);
  root.appendChild(cadre);

  /* fiche */
  const fiche = h("div", { class: "panel abs fr-fiche" });
  root.appendChild(fiche);
  function montrer(f, b) {
    zone.querySelectorAll(".fr-point.choisi").forEach((x) => x.classList.remove("choisi"));
    if (b) b.classList.add("choisi", "vu");
    const p = periodeDe(f.annee);
    fiche.innerHTML = "";
    fiche.append(h("div", { class: "fr-fiche-ic" }, f.e),
      h("div", null,
        h("h3", null, f.titre, f.maroc ? h("span", { class: "fr-badge" }, h("span", { class: "mini-drapeau" }, "★"), " Maroc") : null),
        h("p", { class: "fr-meta" }, h("b", null, f.date), ` • ${f.lieu} • `, h("span", { class: "fr-per", style: { background: p.couleur } }, p.court), ` • ${HIST_CATS[f.cat][0]} ${HIST_CATS[f.cat][1]}`),
        h("p", { class: "fr-texte" }, f.texte)));
    if (!etat.vues[f.id]) { etat.vues[f.id] = Revision.jour(0); Store.save(); if (typeof Aventure !== "undefined") Aventure.evenement(); }
    Voice.speak(`${f.titre}. ${f.texte}`);
  }
  if (params.choix && HF[params.choix]) montrer(HF[params.choix], zone.querySelector(".fr-point.choisi"));
  else fiche.append(h("p", { class: "fr-texte", style: { margin: "auto" } }, `Clique sur une image de la frise pour lire sa fiche. Fais glisser la frise pour voyager dans le temps ! (${Object.keys(etat.vues).length} fiches lues sur ${HIST_FICHES.length})`));

  /* défilement : on commence au Moyen Âge, riche en repères marocains */
  setTimeout(() => { cadre.scrollLeft = params.choix && HF[params.choix] ? FRISE.x(HF[params.choix].annee) - 450 : FRISE.x(600) - 120; }, 30);
  let glisse = null;
  cadre.addEventListener("pointerdown", (e) => { if (e.target.closest(".fr-point")) return; glisse = { x: e.clientX, s: cadre.scrollLeft, k: 1024 / App.stage.getBoundingClientRect().width }; });
  window.addEventListener("pointermove", (e) => { if (glisse) cadre.scrollLeft = glisse.s - (e.clientX - glisse.x) * glisse.k; });
  const fin = () => { glisse = null; };
  window.addEventListener("pointerup", fin);
  App.onLeave(() => window.removeEventListener("pointerup", fin));

  const r = etat.mission;
  root.appendChild(h("button", { class: "btn green abs", style: { right: "24px", bottom: "20px" }, onclick: () => { Sound.click(); App.go("frise-mission"); } },
    "🎯 Mission : la bonne époque", r ? h("span", { style: { marginLeft: "8px" }, html: starsHtml(r.stars) }) : null));
  root.appendChild(h("button", { class: "btn white abs", style: { left: "100px", bottom: "20px" }, onclick: () => { Sound.click(); App.go("sommaire", { subject: "hist" }); } }, "📒 Leçons d'histoire"));
  App.backButton(root, "atelier");
  if (!params.filtre && !params.choix) setTimeout(() => Voice.speak("Bienvenue sur la frise du temps ! Clique sur une image pour découvrir un savant, une construction ou une découverte."), 300);
});

/* ---------- mission : placer 8 fiches dans la bonne période ---------- */
App.register("frise-mission", (root) => {
  const u = Store.user; if (!u) return App.go("identif");
  const etat = histoireEtat(u);
  const N = 8;
  const serie = sample(HIST_FICHES.filter((f) => f.cat !== "repere" || f.maroc), N);
  let i = 0, essais = 0, points = 0, bonnes = 0, verrou = false;
  App.backdrop(root);
  root.appendChild(h("div", { class: "screen-header" }, h("h2", { class: "title" }, "🎯 La bonne époque")));
  const prog = h("div", { class: "exo-progress abs", style: { left: "200px", right: "200px", top: "86px" } });
  serie.forEach(() => prog.appendChild(h("span")));
  root.appendChild(prog);
  const carte = h("div", { class: "panel abs fm-carte" });
  const bandes = h("div", { class: "abs fm-bandes" });
  const fb = h("div", { class: "abs fm-fb" });
  root.append(carte, bandes, fb);
  const periodes = HIST_PERIODES;
  periodes.forEach((p) => bandes.appendChild(h("button", { class: "fm-bande", style: { background: p.couleur, flex: p.id === "avant" ? "0.7" : "1" }, onclick: (e) => choisir(p, e.currentTarget) }, p.court)));
  App.backButton(root, "frise");
  function afficher() {
    const f = serie[i];
    verrou = false; essais = 0; fb.textContent = "";
    [...prog.children].forEach((s, k) => s.classList.toggle("cur", k === i));
    [...bandes.children].forEach((b) => b.classList.remove("bon", "faux"));
    carte.innerHTML = "";
    carte.append(h("div", { class: "fm-ic" }, f.e), h("h3", null, f.titre), h("p", null, h("b", null, f.date), " • ", f.lieu));
    Voice.speak(`À quelle époque ? ${f.titre}, ${f.date}.`);
  }
  function choisir(p, bouton) {
    if (verrou) return;
    const f = serie[i], bon = periodeDe(f.annee);
    if (p === bon) {
      Sound.good(); bouton.classList.add("bon"); verrou = true;
      const gain = essais === 0 ? 1 : 0.5; points += gain; bonnes += essais === 0 ? 1 : 0;
      prog.children[i].classList.add(essais === 0 ? "ok" : "half");
      fb.textContent = `✔ Oui : ${bon.nom} !`;
      setTimeout(suivant, 1300);
    } else if (essais === 0) {
      essais = 1; Sound.bad(); bouton.classList.add("faux");
      fb.textContent = "Pas tout à fait… regarde bien la date et réessaie !";
    } else {
      Sound.bad(); bouton.classList.add("faux"); verrou = true;
      [...bandes.children][periodes.indexOf(bon)].classList.add("bon");
      prog.children[i].classList.add("ko");
      fb.textContent = `C'était ${bon.nom}.`;
      setTimeout(suivant, 2000);
    }
  }
  function suivant() { i++; if (i < N) afficher(); else terminer(); }
  function terminer() {
    const note = Math.round((points / N) * 20), etoiles = starsFor(note);
    const r = etat.mission || { best: 0, stars: 0, tries: 0 };
    const avant = r.stars || 0;
    r.best = Math.max(r.best, note); r.stars = Math.max(r.stars, etoiles); r.tries += 1; r.date = todayStr();
    etat.mission = r; Store.save();
    if (typeof Journal !== "undefined") Journal.noter(u, "mission", "frise", etoiles, "La frise du temps");
    if (typeof Aventure !== "undefined") Aventure.apresMission("frise", avant, etoiles);
    bandes.remove(); fb.remove(); prog.remove();
    carte.className = "panel result";
    carte.innerHTML = `<h2 class="title dark" style="font-size:30px">Mission terminée !</h2><div class="note">${note}<span style="font-size:44px">/20</span></div><div class="big-stars">${starsHtml(etoiles)}</div>`;
    carte.appendChild(h("div", { class: "row", style: { justifyContent: "center", marginTop: "12px" } },
      h("button", { class: "btn sky", onclick: () => App.go("frise-mission") }, "↻ Rejouer"),
      h("button", { class: "btn white", onclick: () => App.go("frise") }, icone(Art.sablier()), " La frise")));
    if (etoiles === 3) { Sound.fanfare(); App.confetti(); } else if (etoiles) Sound.good();
    Voice.speak(Messages.endFor(note));
  }
  afficher();
});

/* ---------------- Objet de l'atelier apporté par l'histoire du CE2 ---------------- */
/* sablier : la frise du temps (histoire) */
objetAtelier({
  id: "frise", ecran: "frise", ordre: 150, label: "Le sablier du temps",
  desc: "L'histoire : la frise du temps, les savants, les grandes constructions et les découvertes, avec le Maroc à l'honneur.",
  svg: () => `
        <rect x="52" y="208" width="40" height="8" rx="3" fill="${SABLIER_BOIS}" ${S}/>
        <rect x="52" y="250" width="40" height="8" rx="3" fill="${SABLIER_BOIS}" ${S}/>
        <path d="M58,216 h28 q0,14 -14,17 q14,3 14,17 h-28 q0,-14 14,-17 q-14,-3 -14,-17 z" fill="#e8f6ff" ${S}/>
        <path d="M63,222 h18 q-2,7 -9,10 q-7,-3 -9,-10 z M62,249 q2,-9 10,-11 q8,2 10,11 z" fill="${SABLIER_SABLE}"/>
        <line x1="72" y1="233" x2="72" y2="246" stroke="${SABLIER_SABLE}" stroke-width="2"/>
  `,
});

/* ---------------- Médaille de l'histoire du CE2 ---------------- */
ajouterMedailles([
  { id: "historien", icone: Art.sablier(), nom: "Historien", desc: "Lis 20 fiches de la frise du temps.",
    ok: (u) => Object.keys((u.histoire && u.histoire.vues) || {}).length >= 20 },
], { avant: "regulier" });
