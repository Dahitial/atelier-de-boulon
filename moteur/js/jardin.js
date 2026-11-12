/* L'Atelier de Boulon — Mon petit jardin (pour tous les niveaux).
   On l'ouvre en achetant le pot de fleurs dans la boutique. L'enfant achète une graine, la
   plante, l'arrose et la regarde pousser au fil des jours où il vient jouer.

   Les règles du temps :
   - une journée de croissance = un jour du calendrier où l'enfant vient, et où sa plante a de
     l'eau. Venir plusieurs fois le même jour ne compte qu'une fois ;
   - l'arrosage remplit la réserve (3 gouttes), une fois par jour ; elle baisse d'une goutte par jour ;
   - sans arrosage depuis 2 jours, la plante a soif ; 4 jours : elle fane (un arrosage la sauve,
     mais elle perd une étape) ; 7 jours : elle meurt et part au compost ;
   - le mode vacances (protégé par le code parent) arrête le temps du jardin.

   Les leçons sur les plantes débloquent des graines : chaque niveau le dit dans
   JARDIN_DEBLOCAGES = { tournesol: "id-de-leçon", … } (sinon la graine est libre). */
"use strict";

const JARDIN_ESPECES = {
  radis: { nom: "le radis", court: "Radis", prix: 5, jours: 5, forme: "rosette", hPx: 70, cm: 25, vert: "#5fb648",
    categorie: "plante potagère", vrai: "Dans la vraie vie, il faut environ 4 semaines.",
    fiche: "Le radis pousse très vite. On mange sa racine rouge, croquante et un peu piquante.",
    etapes: ["la graine", "le germe", "la pousse", "les feuilles", "la racine grossit", "prêt à récolter"] },
  menthe: { nom: "la menthe", court: "Menthe", prix: 5, jours: 6, forme: "tige", hPx: 110, cm: 40, vert: "#4fae4a",
    categorie: "plante aromatique", vrai: "Dans la vraie vie, il faut environ 2 mois.",
    fiche: "La menthe sent très bon quand on frotte ses feuilles. Au Maroc, on la met dans le thé.",
    etapes: ["la graine", "le germe", "la pousse", "elle grandit", "elle est touffue", "en fleur"] },
  tournesol: { nom: "le tournesol", court: "Tournesol", prix: 10, jours: 7, forme: "tige", hPx: 220, cm: 150, vert: "#5fb648",
    categorie: "fleur", vrai: "Dans la vraie vie, il faut environ 3 mois.",
    fiche: "Le jeune tournesol tourne sa fleur vers le soleil. Avec ses graines, on fait de l'huile.",
    etapes: ["la graine", "le germe", "la pousse", "elle grandit", "le bouton", "la fleur"] },
  tomate: { nom: "la tomate", court: "Tomate", prix: 10, jours: 8, forme: "tige", hPx: 170, cm: 100, vert: "#4c9a3c",
    categorie: "plante potagère qui donne un fruit", vrai: "Dans la vraie vie, il faut environ 3 mois.",
    fiche: "La petite fleur jaune de la tomate devient un fruit : la tomate ! Ses graines sont dedans.",
    etapes: ["la graine", "le germe", "la pousse", "elle grandit", "les fleurs", "les tomates"] },
  rosier: { nom: "le rosier", court: "Rosier", prix: 15, jours: 10, forme: "buisson", hPx: 160, cm: 120, vert: "#3f8a2e",
    categorie: "arbuste", vrai: "Dans la vraie vie, un rosier fleurit chaque printemps, pendant des années.",
    fiche: "Le rosier est un arbuste : plusieurs tiges en bois. À Kelaat M'Gouna, au Maroc, on cueille les roses pour faire de l'eau de rose.",
    etapes: ["la graine", "le germe", "la pousse", "les tiges", "les boutons", "les roses"] },
  oranger: { nom: "l'oranger", court: "Oranger", prix: 20, jours: 7, forme: "arbre", hPx: 150, cm: 60, vert: "#3f8a2e", dehors: 21,
    categorie: "arbre fruitier", vrai: "Dans la vraie vie, un oranger donne ses premières oranges au bout de plusieurs années.",
    fiche: "L'oranger est un arbre : un seul tronc en bois. Il peut vivre plus de 50 ans. Au Maroc, on cultive beaucoup d'oranges, par exemple dans le Souss.",
    etapes: ["la graine", "le germe", "la pousse", "il grandit", "son tronc durcit", "un jeune arbre"] },
};
const JARDIN_ORDRE = ["radis", "menthe", "tournesol", "tomate", "rosier", "oranger"];
/* le niveau dit quelle leçon débloque quelle graine (voir en tête du fichier) */
const JARDIN_DEBLOCAGES = {};

/* ------------------------------------------------------------------ */
/* Les dates                                                            */
/* ------------------------------------------------------------------ */
const jourNum = (d) => Math.round(Date.parse(d + "T12:00:00") / 864e5);
const joursEntre = (a, b) => (a && b ? jourNum(b) - jourNum(a) : 0);
const jourPlus = (d, n) => new Date(Date.parse(d + "T12:00:00") + n * 864e5).toISOString().slice(0, 10);

/* ------------------------------------------------------------------ */
/* L'état du jardin de l'élève                                         */
/* ------------------------------------------------------------------ */
const Jardin = {
  SOIF: 2, FANEE: 4, MORTE: 7,
  etat(u) {
    if (!u.jardin || typeof u.jardin !== "object") u.jardin = {};
    const j = u.jardin;
    for (const k of ["graines", "herbier"]) if (!j[k] || typeof j[k] !== "object" || Array.isArray(j[k])) j[k] = {};
    if (!Array.isArray(j.jardiniere)) j.jardiniere = [];
    if (!Array.isArray(j.arrosages)) j.arrosages = [];
    for (const k of ["compost", "joursArroses"]) if (typeof j[k] !== "number" || !(j[k] >= 0)) j[k] = 0;
    return j;
  },
  aLePot(u) { const a = Aventure.etat(u); return !!(a.achats.pot); },
  /* jours depuis le dernier arrosage (le temps des vacances ne compte pas) */
  sec(p, auj = Revision.jour(0)) { return Math.max(0, joursEntre(p.arroseLe, auj)); },
  /* ok, soif, fanee ou morte */
  sante(p) {
    if (!p) return null;
    if (p.morte) return "morte";
    const s = this.sec(p);
    return s >= this.MORTE ? "morte" : s >= this.FANEE ? "fanee" : s >= this.SOIF ? "soif" : "ok";
  },
  gouttes(p) { return p ? Math.max(0, 3 - this.sec(p)) : 0; },
  etape(p) {
    const E = JARDIN_ESPECES[p.espece];
    return p.jours >= E.jours ? 5 : Math.min(4, Math.floor((p.jours / E.jours) * 5));
  },
  fini(p) { return p && !p.morte && this.etape(p) === 5; },
  /* la graine est-elle débloquée par sa leçon ? */
  ouverte(u, esp) {
    const lecon = JARDIN_DEBLOCAGES[esp];
    return !lecon || !LESSONS[lecon] || !!(u.lessons && u.lessons[lecon]);
  },
  /* à chaque visite (atelier ou jardin) : la mort, la pousse du jour, l'arbre dehors */
  maj(u) {
    const j = this.etat(u), auj = Revision.jour(0), p = j.plante;
    if (j.vacances) return;
    if (p && !p.morte && this.sec(p) >= this.MORTE) p.morte = true;
    /* la plante pousse une fois par jour de visite, si elle a de l'eau (pas encore assoiffée au point d'être sèche) */
    if (p && !p.morte && p.dernierePousse !== auj && this.sec(p) < 3 && !this.fini(p)) {
      p.dernierePousse = auj;
      p.demi = p.place === "ombre" ? !p.demi : false;   // à l'ombre, elle pousse un jour sur deux
      if (!p.demi) p.jours += 1;
      if (p.place === "ombre" && p.demi) { /* jour sans pousse : la plante attend la lumière */ }
    }
    /* l'arbre planté dehors : la pluie l'arrose, il pousse à chaque jour de visite */
    if (j.arbre && j.arbre.dernierePousse !== auj) {
      j.arbre.dernierePousse = auj; j.arbre.jours += 1;
      if (j.arbre.jours >= JARDIN_ESPECES.oranger.dehors && !j.herbier.oranger) {
        j.herbier.oranger = auj;
        j.graines.oranger = (j.graines.oranger || 0) + 2;
        Aventure.gagner(u, 20, "les premières oranges !");
        Aventure._file.push({ txt: "🍊 Ton oranger a donné ses premières oranges !", grand: true });
      }
    }
    Store.save();
  },
  acheterGraine(u, esp) {
    const a = Aventure.etat(u), E = JARDIN_ESPECES[esp];
    if (a.ecrous < E.prix) return false;
    a.ecrous -= E.prix;
    const j = this.etat(u);
    j.graines[esp] = (j.graines[esp] || 0) + 1;
    Store.save();
    return true;
  },
  planter(u, esp) {
    const j = this.etat(u), auj = Revision.jour(0);
    if (j.plante || !(j.graines[esp] > 0)) return false;
    j.graines[esp]--;
    const terreau = j.compost > 0;
    if (terreau) j.compost--;
    j.plante = { espece: esp, plantee: auj, jours: terreau ? 1 : 0, arroseLe: auj, dernierePousse: auj, place: "fenetre", engrais: false, terreau };
    this.noterArrosage(j, auj);
    Store.save();
    return true;
  },
  noterArrosage(j, auj) {
    if (j.arrosages[j.arrosages.length - 1] !== auj) { j.arrosages.push(auj); j.joursArroses++; }
    j.arrosages = j.arrosages.slice(-14);
  },
  /* renvoie "deja", "sauvee" (elle était fanée) ou "ok" */
  arroser(u) {
    const j = this.etat(u), p = j.plante, auj = Revision.jour(0);
    if (!p || p.morte) return null;
    if (p.arroseLe === auj) return "deja";
    const fanee = this.sante(p) === "fanee";
    if (fanee) {
      const E = JARDIN_ESPECES[p.espece];
      p.jours = Math.max(0, p.jours - E.jours / 5);   // elle perd une étape…
      p.dernierePousse = auj;                         // … et ne pousse pas aujourd'hui
    }
    p.arroseLe = auj;
    this.noterArrosage(j, auj);
    this.maj(u);
    return fanee ? "sauvee" : "ok";
  },
  /* la plante a fini : dans la jardinière (ou dehors, pour l'arbre), dans l'herbier, et des graines */
  recolter(u) {
    const j = this.etat(u), p = j.plante, auj = Revision.jour(0);
    if (!this.fini(p)) return null;
    const esp = p.espece;
    j.plante = null;
    if (esp === "oranger") {
      j.arbre = { jours: 0, plante: auj, dernierePousse: auj };
      Store.save();
      return "arbre";
    }
    const nouvelle = !j.herbier[esp];
    if (nouvelle) j.herbier[esp] = auj;
    j.jardiniere = [...j.jardiniere.filter((x) => x !== esp), esp].slice(-3);
    j.graines[esp] = (j.graines[esp] || 0) + 2;
    Aventure.gagner(u, 20, nouvelle ? "nouvelle plante dans l'herbier" : "belle récolte");
    Aventure.conclure(u);
    return esp;
  },
  composter(u) {
    const j = this.etat(u);
    if (!j.plante || this.sante(j.plante) !== "morte") return false;
    j.plante = null; j.compost++;
    Store.save();
    return true;
  },
  /* vacances : on arrête le temps ; au retour, les dates sont décalées d'autant */
  vacances(u, oui) {
    const j = this.etat(u), auj = Revision.jour(0);
    if (oui) j.vacances = auj;
    else if (j.vacances) {
      const n = Math.max(0, joursEntre(j.vacances, auj));
      if (j.plante) for (const k of ["arroseLe", "dernierePousse"]) if (j.plante[k]) j.plante[k] = jourPlus(j.plante[k], n);
      delete j.vacances;
    }
    Store.save();
  },
  nettoyer(o) {
    if (!o || typeof o !== "object") return undefined;
    const date = (v) => (typeof v === "string" && /^\d{4}-\d\d-\d\d$/.test(v) ? v : null);
    const esp = (k) => !!JARDIN_ESPECES[k];
    const n = (v) => Math.max(0, Math.min(1e4, Number(v) || 0));
    const p = o.plante && esp(o.plante.espece) ? {
      espece: o.plante.espece, plantee: date(o.plante.plantee) || Revision.jour(0), jours: n(o.plante.jours),
      arroseLe: date(o.plante.arroseLe) || Revision.jour(0), dernierePousse: date(o.plante.dernierePousse), place: o.plante.place === "ombre" ? "ombre" : "fenetre",
      engrais: !!o.plante.engrais, terreau: !!o.plante.terreau, demi: !!o.plante.demi, morte: !!o.plante.morte,
      observeLe: date(o.plante.observeLe), soinLe: date(o.plante.soinLe) } : null;
    return {
      plante: p,
      graines: Object.fromEntries(Object.entries(o.graines || {}).filter(([k]) => esp(k)).map(([k, v]) => [k, n(v)])),
      herbier: Object.fromEntries(Object.entries(o.herbier || {}).filter(([k, v]) => esp(k) && date(v))),
      jardiniere: (Array.isArray(o.jardiniere) ? o.jardiniere : []).filter(esp).slice(-3),
      arrosages: (Array.isArray(o.arrosages) ? o.arrosages : []).filter(date).slice(-14),
      arbre: o.arbre && typeof o.arbre === "object" ? { jours: n(o.arbre.jours), plante: date(o.arbre.plante), dernierePousse: date(o.arbre.dernierePousse) } : null,
      compost: n(o.compost), joursArroses: n(o.joursArroses),
      vacances: date(o.vacances) || undefined,
    };
  },
};

/* ------------------------------------------------------------------ */
/* Les dessins                                                          */
/* ------------------------------------------------------------------ */
/* une feuille de longueur l, à la position (x, y), tournée de a degrés */
const feuilleSvg = (x, y, a, l, c) =>
  `<path d="M0 0 q${l / 2} ${-l / 3} ${l} 0 q${-l / 2} ${l / 3} ${-l} 0 z" transform="translate(${x} ${y}) rotate(${a})" fill="${c}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
const fleurSvg = (x, y, r, petale, coeur) => {
  const n = 10;
  const p = Array.from({ length: n }, (_, i) => `<ellipse cx="${x}" cy="${y - r * 0.9}" rx="${r * 0.32}" ry="${r * 0.55}" transform="rotate(${(360 / n) * i} ${x} ${y})" fill="${petale}" stroke="${INK}" stroke-width="1.5"/>`).join("");
  return p + `<circle cx="${x}" cy="${y}" r="${r * 0.5}" fill="${coeur}" stroke="${INK}" stroke-width="2"/>`;
};
const roseSvg = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#e4577a" stroke="${INK}" stroke-width="2"/><path d="M${x - r * 0.5} ${y} q${r * 0.5} ${-r * 0.7} ${r} 0 q${-r * 0.4} ${r * 0.5} ${-r * 0.8} ${r * 0.2}" fill="none" stroke="#a8324f" stroke-width="2"/>`;

/* la plante, le pied au point (0, 0), vers le haut. H = hauteur finale en px (sinon celle de l'espèce).
   opt.fruits : l'arbre dehors donne des oranges ; opt.fleurs : il fleurit */
function dessinPlante(esp, etape, sante = "ok", H = null, opt = {}) {
  const E = JARDIN_ESPECES[esp], Ht = H || E.hPx;
  const k = [0, 0.14, 0.38, 0.62, 0.85, 1][etape];
  const h = Ht * k;
  const v = sante === "morte" ? "#a07f4c" : sante === "fanee" ? "#c8b24c" : sante === "soif" ? "#93c46a" : E.vert;
  const tige = sante === "morte" ? "#8a6a3a" : sante === "fanee" ? "#9a9a3a" : "#3f8a2e";
  const penche = sante === "morte" ? 38 : sante === "fanee" ? 20 : sante === "soif" ? 8 : 0;
  const tombe = sante === "soif" ? 18 : sante === "fanee" ? 34 : sante === "morte" ? 50 : 0;   // les feuilles tombent
  let s = "";
  if (etape === 0) {
    s = `<ellipse cx="0" cy="-3" rx="16" ry="5" fill="#7a4a24"/><ellipse cx="0" cy="7" rx="6" ry="4" fill="#d9a86b" stroke="${INK}" stroke-width="1.5"/>`;
    return `<g class="plante">${s}</g>`;
  }
  if (etape === 1) {
    s = `<path d="M0 0 q-3 ${-h / 2} 2 ${-h}" fill="none" stroke="${tige}" stroke-width="4" stroke-linecap="round"/>`
      + feuilleSvg(2, -h, 200 + tombe, 14, v) + feuilleSvg(2, -h, -20 - tombe + 0, 14, v);
    return `<g class="plante" transform="rotate(${penche})">${s}</g>`;
  }
  const nbF = [0, 2, 2, 4, 6, 6][etape];
  if (E.forme === "rosette") {
    const l = Math.max(18, h * 0.9);
    for (let i = 0; i < nbF; i++) {
      const a = -90 + (i - (nbF - 1) / 2) * (110 / Math.max(1, nbF - 1)) + (i < nbF / 2 ? tombe : -tombe);
      s += `<path d="M0 0 L${Math.cos(a * Math.PI / 180) * l * 0.35} ${Math.sin(a * Math.PI / 180) * l * 0.35}" stroke="${tige}" stroke-width="3"/>`
        + feuilleSvg(Math.cos(a * Math.PI / 180) * l * 0.3, Math.sin(a * Math.PI / 180) * l * 0.3, a, l * 0.7, v);
    }
    /* la racine rouge sort de terre : devant les feuilles, pour qu'on la voie */
    if (etape >= 4 && sante !== "morte") s += `<ellipse cx="0" cy="${etape === 5 ? -6 : -3}" rx="${etape === 5 ? 13 : 8}" ry="${etape === 5 ? 11 : 7}" fill="#e4572e" stroke="${INK}" stroke-width="2"/>`
      + `<path d="M-4 ${etape === 5 ? -12 : -7} q3 -3 6 0" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`;
  } else if (E.forme === "buisson") {
    const tiges = [[-0.45, 0.9], [0, 1], [0.45, 0.85]];
    tiges.forEach(([dx, kk], t) => {
      const x2 = dx * h * 0.6, y2 = -h * kk;
      s += `<path d="M0 0 Q${x2 * 0.3} ${y2 * 0.5} ${x2} ${y2}" fill="none" stroke="${etape >= 3 ? "#7a5a2a" : tige}" stroke-width="4" stroke-linecap="round"/>`;
      for (let i = 1; i <= Math.ceil(nbF / 3); i++) {
        const f = i / (Math.ceil(nbF / 3) + 0.5), x = x2 * f, y = y2 * f;
        s += feuilleSvg(x, y, (t === 0 ? 200 : t === 2 ? -20 : i % 2 ? 200 : -20) + (t === 0 ? -tombe : tombe), 16, v);
      }
      if (etape === 4 && sante !== "morte") s += `<ellipse cx="${x2}" cy="${y2 - 4}" rx="5" ry="8" fill="#ef7fa8" stroke="${INK}" stroke-width="2"/>`;
      if (etape === 5 && sante !== "morte") s += roseSvg(x2, y2 - 6, 11);
    });
  } else if (E.forme === "arbre") {
    const tronc = etape >= 4 ? 6 : 4;
    const r = Math.max(10, Math.min(80, h * 0.32));   // le haut de la couronne est à la hauteur h
    s += `<path d="M0 0 L0 ${-h + r}" stroke="${etape >= 4 ? "#8a5a24" : tige}" stroke-width="${tronc}" stroke-linecap="round"/>`;
    if (etape >= 3) s += `<ellipse cx="0" cy="${-h + r}" rx="${r * 1.1}" ry="${r}" fill="${v}" stroke="${INK}" stroke-width="2.5"/>`;
    else for (let i = 0; i < nbF; i++) s += feuilleSvg(0, -h * (0.5 + 0.2 * Math.floor(i / 2)), (i % 2 ? -25 : 205) + (i % 2 ? tombe : -tombe), 18, v);
    if (opt.fleurs) for (const [dx, dy] of [[-0.5, -0.1], [0.4, -0.4], [0.1, 0.3], [-0.2, -0.6]]) s += `<circle cx="${dx * r}" cy="${-h + r + dy * r}" r="${r * 0.12}" fill="#fff" stroke="${INK}" stroke-width="1.5"/>`;
    if (opt.fruits) for (const [dx, dy] of [[-0.55, 0], [0.45, -0.35], [0.15, 0.35], [-0.15, -0.55], [0.6, 0.2]]) s += `<circle cx="${dx * r}" cy="${-h + r + dy * r}" r="${r * 0.16}" fill="#f08a3c" stroke="${INK}" stroke-width="1.5"/>`;
  } else {
    /* une tige avec des feuilles par paires (menthe, tournesol, tomate) */
    s += `<path d="M0 0 q${-h * 0.06} ${-h / 2} 0 ${-h}" fill="none" stroke="${tige}" stroke-width="${esp === "tournesol" ? 6 : 4}" stroke-linecap="round"/>`;
    const lf = esp === "tournesol" ? 30 : esp === "tomate" ? 24 : 18;
    for (let i = 0; i < nbF; i++) {
      const y = -h * (0.25 + 0.6 * (Math.floor(i / 2) / Math.max(1, nbF / 2)));
      s += feuilleSvg(0, y, (i % 2 ? -25 + tombe : 205 - tombe), lf, v);
    }
    if (sante !== "morte") {
      if (esp === "tournesol") {
        if (etape === 4) s += `<circle cx="0" cy="${-h}" r="10" fill="#7bc950" stroke="${INK}" stroke-width="2"/>`;
        if (etape === 5) s += fleurSvg(0, -h, 26, "#f6c445", "#8a5a24");
      } else if (esp === "menthe") {
        if (etape >= 4) s += feuilleSvg(0, -h, 240, 14, v) + feuilleSvg(0, -h, -60, 14, v);
        if (etape === 5) s += `<ellipse cx="0" cy="${-h - 10}" rx="5" ry="11" fill="#b58be0" stroke="${INK}" stroke-width="1.5"/>`;
      } else if (esp === "tomate") {
        if (etape === 4) for (const dx of [-14, 12]) s += fleurSvg(dx, -h * 0.7, 7, "#f6c445", "#f6c445");
        if (etape === 5) for (const [dx, dy] of [[-16, 0.65], [14, 0.55], [-4, 0.82]]) s += `<circle cx="${dx}" cy="${-h * dy}" r="9" fill="#e4572e" stroke="${INK}" stroke-width="2"/>`;
      }
    }
  }
  return `<g class="plante" transform="rotate(${penche})">${s}</g>`;
}

/* le pot (de face), le haut de la terre au point (0, 0) */
const potSvg = (larg = 60) => `<path d="M${-larg / 2 + 4} 4 h${larg - 8} l-6 ${larg * 0.55} h${-larg + 20} z" fill="#d86b3c" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
  <rect x="${-larg / 2}" y="-6" width="${larg}" height="12" rx="4" fill="#e9875a" stroke="${INK}" stroke-width="3"/>
  <path d="M${-larg / 2 + 5} -1 h${larg - 10}" stroke="#7a4a24" stroke-width="4"/>`;

/* le pot avec la plante de l'élève (atelier, maison, vignette de la boutique) */
function potAvecPlante(u, larg = 56, H = null) {
  const j = u ? Jardin.etat(u) : null, p = j && j.plante;
  const plante = p ? dessinPlante(p.espece, Jardin.etape(p), Jardin.sante(p), H) : "";
  return plante + potSvg(larg);
}

/* une icône d'étape (pour la frise des étapes) */
const iconeEtape = (esp, e, taille = 46) =>
  `<svg width="${taille}" height="${taille}" viewBox="-40 -64 80 80" aria-hidden="true"><rect x="-40" y="0" width="80" height="16" fill="#a86a2c"/>${dessinPlante(esp, e, "ok", 58)}</svg>`;

/* ------------------------------------------------------------------ */
/* L'écran du jardin                                                    */
/* ------------------------------------------------------------------ */
App.register("jardin", (root, params) => {
  const u = Store.user; if (!u) return App.go("identif");
  if (!Jardin.aLePot(u)) return App.go("aventure");
  Aventure.demarrer(u); Aventure.journee(u);
  Jardin.maj(u);
  const j = Jardin.etat(u), auj = Revision.jour(0);
  const p = j.plante, E = p ? JARDIN_ESPECES[p.espece] : null;
  const sante = Jardin.sante(p), etape = p ? Jardin.etape(p) : 0;
  const porte = Aventure.etat(u).porte || {};
  const cp = !!NIVEAU.toutEnVoix;

  /* soin du jour : la plante bien arrosée rapporte des écrous, une fois par jour */
  if (p && !p.morte && Jardin.sec(p) <= 1 && p.soinLe !== auj && !j.vacances) {
    p.soinLe = auj;
    Aventure.gagner(u, 3, "ta plante est en forme");
  }
  Aventure.conclure(u);

  App.backdrop(root);
  root.appendChild(h("div", { class: "screen-header" }, h("h2", { class: "title" }, "🌱 Mon petit jardin")));
  const m = App.mascot(root, { x: 862, y: 566, side: "left", bulle: { x: 100, y: 630 } });
  const dire = (t) => m.say(t);

  /* ----- la scène : la fenêtre, le pot, la plante, la règle ----- */
  const scene = h("div", { class: "panel abs jd-scene" });
  const lumiere = !p || p.place !== "ombre";
  const coupe = porte.yeux === "lunettes" && p && !p.morte;   // les lunettes rondes : on voit les racines
  const racines = coupe ? `<g opacity=".9"><path d="M0 8 q-6 18 -2 34 M0 14 q-14 10 -20 22 M0 16 q14 8 20 20 M-2 30 q-10 6 -14 14" fill="none" stroke="#f3e2c7" stroke-width="${2 + etape}" stroke-linecap="round"/></g>` : "";
  /* la règle (CE2, à partir de la pousse) : graduée en cm, à l'échelle de la plante */
  const Hscene = E ? Math.min(220, E.hPx * 1.6) : 0;
  let regle = "";
  if (p && !cp && etape >= 2) {
    const pxParCm = Hscene / E.cm, pas = E.cm > 60 ? 10 : 5, haut = E.cm * 1.1;
    regle = `<g transform="translate(-86 0)"><rect x="-12" y="${-haut * pxParCm}" width="24" height="${haut * pxParCm}" fill="#f6c445" stroke="${INK}" stroke-width="2"/>`;
    for (let c = 0; c <= haut; c += pas) {
      const y = -c * pxParCm;
      regle += `<path d="M-12 ${y} h${c % (pas * 2) === 0 ? 14 : 8}" stroke="${INK}" stroke-width="1.5"/>`;
      if (c % (pas * 2) === 0 && c) regle += `<text x="16" y="${y + 4}" font-size="12" font-weight="700" fill="${INK}">${c}</text>`;
    }
    regle += `<text x="16" y="14" font-size="12" font-weight="700" fill="${INK}">cm</text></g>`;
  }
  const plante = p ? dessinPlante(p.espece, etape, sante, Hscene) : "";
  scene.innerHTML = `<svg viewBox="0 0 540 400" class="jd-svg" aria-hidden="true">
    <rect width="540" height="400" fill="#2f6f73"/>
    <rect x="${lumiere ? 70 : 330}" y="20" width="${lumiere ? 400 : 190}" height="250" rx="10" fill="${lumiere ? "#bfe8ff" : "#24575a"}" stroke="${INK}" stroke-width="5"/>
    ${lumiere ? `<circle cx="400" cy="80" r="34" fill="#ffd84a" stroke="${INK}" stroke-width="3"/><path d="M70 210 q90 -44 180 -8 q100 36 220 -18 v86 h-400 z" fill="#8fd16a"/><path d="M270 20 v250 M70 140 h400" stroke="${INK}" stroke-width="5"/>`
      : `<text x="425" y="150" text-anchor="middle" font-size="16" font-weight="700" fill="#cfe">le coin sombre</text>`}
    <rect x="20" y="270" width="500" height="18" rx="6" fill="#8a5a24" stroke="${INK}" stroke-width="3"/>
    ${p && lumiere && etape >= 1 && !p.morte ? `<path d="M380 110 L300 200 M398 120 L326 214" stroke="#f6c445" stroke-width="4" stroke-dasharray="4 10"/>` : ""}
    <g transform="translate(270 262)">
      ${coupe ? `<path d="M-26 4 h52 l-5 34 h-42 z" fill="#7a4a24" stroke="${INK}" stroke-width="2"/>${racines}` : ""}
      ${regle}${plante}${coupe ? "" : potSvg(66)}
    </g>
  </svg>`;
  /* la réserve d'eau et le jour */
  const gouttes = Jardin.gouttes(p);
  const jauge = h("div", { class: "jd-badge jd-eau", title: `${gouttes} goutte${gouttes > 1 ? "s" : ""} sur 3` }, h("b", null, "Eau"),
    ...[0, 1, 2].map((i) => h("span", { class: "jd-goutte" + (i < gouttes ? " pleine" : "") })));
  scene.appendChild(jauge);
  if (p) scene.appendChild(h("div", { class: "jd-badge jd-jour" },
    Jardin.fini(p) ? "Elle a fini de pousser !" : `${E.court} : jour ${Math.min(E.jours, Math.floor(p.jours) + 1)} sur ${E.jours}` + (p.place === "ombre" ? " · à l'ombre" : "")));
  if (j.vacances) scene.appendChild(h("div", { class: "jd-vacances" }, "🏖 Le jardin est en vacances : le temps est arrêté."));

  /* les boutons */
  const actions = h("div", { class: "jd-actions" });
  const btn = (cls, txt, fn, ok = true) => h("button", { class: "btn " + cls, disabled: !ok, onclick: fn }, txt);
  if (p && !p.morte && !Jardin.fini(p)) {
    actions.append(
      btn("sky", "💧 Arroser", () => {
        const r = Jardin.arroser(u);
        if (r === "deja") { Sound.bad(); dire("La terre est déjà mouillée ! Trop d'eau fait pourrir les racines. Reviens demain."); return; }
        Sound.good(); Aventure.conclure(u);
        if (r === "sauvee") { App.go("jardin"); setTimeout(() => dire("Ouf ! Tu l'as sauvée, mais elle a perdu une étape. Arrose-la tous les jours !"), 400); }
        else App.go("jardin", { arrose: true });
      }, !j.vacances),
      btn("white", "🔍 Observer", () => observer(), p.observeLe !== auj && !j.vacances),
      btn("white", lumiere ? "🌑 Mettre à l'ombre" : "☀️ Près de la fenêtre", () => {
        p.place = lumiere ? "ombre" : "fenetre"; Store.save(); Sound.click(); App.go("jardin", { place: p.place });
      }, !j.vacances));
    if (!cp) actions.appendChild(btn("yellow", "🧪 Engrais (10)", () => {
      const a = Aventure.etat(u);
      if (a.ecrous < 10) { Sound.bad(); dire("Il te manque des écrous pour l'engrais."); return; }
      a.ecrous -= 10; p.engrais = true; p.jours = Math.min(E.jours, p.jours + 1); Store.save(); Sound.good();
      App.go("jardin", { engrais: true });
    }, !p.engrais && !j.vacances));
  } else if (p && Jardin.fini(p)) {
    actions.appendChild(btn("green", p.espece === "oranger" ? "🌳 Le planter dehors" : "🧺 Récolter", () => {
      const r = Jardin.recolter(u);
      Sound.fanfare(); App.confetti();
      App.go("jardin", { recolte: r });
    }));
  } else if (p && p.morte) {
    actions.appendChild(btn("white", "♻️ La mettre au compost", () => { Jardin.composter(u); Sound.click(); App.go("jardin", { compost: true }); }));
  }
  scene.appendChild(actions);
  root.appendChild(scene);

  /* ----- à droite : la plante, ses étapes, la semaine, la question ----- */
  const cote = h("div", { class: "panel abs jd-cote" });
  if (p) {
    const etats = { ok: "Elle est en pleine forme.", soif: "Elle a soif : ses feuilles tombent.", fanee: "Elle est fanée ! Arrose-la vite.", morte: "Elle est morte, elle n'a pas eu d'eau." };
    cote.append(h("h3", { class: "jd-nom" }, E.court), h("p", { class: "jd-etat " + sante }, Jardin.fini(p) ? "Elle a fini de pousser : bravo !" : etats[sante]));
    const frise = h("div", { class: "jd-etapes" });
    E.etapes.forEach((nom, i) => {
      const el = h("div", { class: "jd-etape" + (i === etape ? " ici" : i < etape ? " passee" : "") },
        h("span", { html: iconeEtape(p.espece, i) }), h("small", null, nom));
      if (cp) el.addEventListener("mouseenter", () => Voice.speak(nom + (i === etape ? " : ta plante en est là !" : "")));
      frise.appendChild(el);
    });
    cote.appendChild(frise);
  } else {
    cote.append(h("h3", { class: "jd-nom" }, "Le pot est vide"), h("p", { class: "jd-etat" }, "Achète une graine en bas, puis plante-la."));
  }
  /* les 7 derniers jours */
  const semaine = h("div", { class: "jd-semaine" });
  const NOMS_J = ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"];
  for (let i = 6; i >= 0; i--) {
    const d = jourPlus(auj, -i), arrose = j.arrosages.includes(d);
    semaine.appendChild(h("div", { class: "jd-jour" + (arrose ? " arrose" : "") + (i === 0 ? " auj" : ""), title: arrose ? "arrosée" : "pas arrosée" },
      NOMS_J[new Date(d + "T12:00:00").getDay()], h("b", null, arrose ? "💧" : i === 0 ? "auj." : "·")));
  }
  cote.append(h("p", { class: "jd-titre" }, "Cette semaine"), semaine);
  const question = h("div", { class: "jd-question" });
  cote.appendChild(question);
  if (p) cote.appendChild(h("p", { class: "jd-vrai" }, E.vrai));
  root.appendChild(cote);

  /* ----- en bas : les graines ----- */
  const bas = h("div", { class: "panel abs jd-graines" });
  bas.appendChild(h("b", { class: "jd-titre" }, "Mes graines"));
  const a = Aventure.etat(u);
  JARDIN_ORDRE.forEach((esp) => {
    const G = JARDIN_ESPECES[esp], n = j.graines[esp] || 0, ouverte = Jardin.ouverte(u, esp);
    const bloquee = !ouverte || (esp === "oranger" && j.arbre);
    const carte = h("div", { class: "jd-graine" + (bloquee ? " fermee" : "") + (p && p.espece === esp ? " plantee" : "") },
      h("span", { html: iconeEtape(esp, 5, 40) }), h("b", null, G.court),
      h("small", null, esp === "oranger" && j.arbre ? "déjà dehors" : !ouverte ? "leçon à faire" : n ? `${n} graine${n > 1 ? "s" : ""}` : `🔩 ${G.prix}`));
    if (!bloquee) {
      if (!p && n > 0) carte.appendChild(btn("green small", "Planter", () => { Jardin.planter(u, esp); Sound.good(); App.go("jardin", { plante: esp }); }));
      else if (n === 0) carte.appendChild(btn("white small", "Acheter", () => {
        if (!Jardin.acheterGraine(u, esp)) { Sound.bad(); dire(`Il te manque ${G.prix - a.ecrous} écrous pour cette graine.`); return; }
        Sound.good(); App.go("jardin", { achat: esp });
      }, a.ecrous >= G.prix));
    }
    if (cp) carte.addEventListener("mouseenter", () => Voice.speak(G.nom.charAt(0).toUpperCase() + G.nom.slice(1) + (bloquee ? "." : n ? "." : `, ${G.prix} écrous.`)));
    bas.appendChild(carte);
  });
  bas.appendChild(h("div", { class: "jd-liens" },
    btn("white small", `📗 Herbier ${Object.keys(j.herbier).length}/${JARDIN_ORDRE.length}`, () => { Sound.click(); App.go("herbier"); }),
    btn("white small", j.vacances ? "🏖 Fin des vacances" : "🏖 Vacances", () => {
      const faire = () => { Jardin.vacances(u, !j.vacances); App.go("jardin"); };
      if (Parents.aUnCode()) Parents.verifier(faire, "🔒 Vacances du jardin"); else faire();
    })));
  root.appendChild(bas);
  App.backButton(root, "atelier");

  /* ----- la question d'observation (une par jour, +2 écrous) ----- */
  function observer() {
    const pair = Objets.numeroDuJour() % 2 === 0;
    let q, bonne, choix;
    if (!cp && pair && etape >= 2) {
      /* la hauteur, lue sur la règle */
      const pas = E.cm > 60 ? 10 : 5;
      const vraie = E.cm * [0, 0.14, 0.38, 0.62, 0.85, 1][etape];
      bonne = Math.max(pas, Math.round(vraie / pas) * pas);
      const autres = [bonne - 2 * pas, bonne - pas, bonne + pas, bonne + 2 * pas].filter((x) => x > 0);
      choix = shuffle([bonne, ...sample(autres, 2)]).map((x) => x + " cm");
      bonne = bonne + " cm";
      q = "Regarde la règle : combien mesure ta plante, à peu près ?";
    } else {
      bonne = E.etapes[etape];
      choix = shuffle([bonne, ...sample(E.etapes.filter((x) => x !== bonne), 2)]);
      q = "Regarde bien ta plante. À quelle étape est-elle ?";
    }
    question.innerHTML = "";
    question.appendChild(h("p", { class: "jd-q" }, q));
    const zone = h("div", { class: "savais-reponses" });
    choix.forEach((c) => {
      const b = h("button", { class: "choice", type: "button" }, c);
      if (cp) b.addEventListener("mouseenter", () => Voice.speak(c));
      b.addEventListener("click", () => {
        [...zone.children].forEach((x) => { x.disabled = true; if (x.textContent === bonne) x.classList.add("right"); });
        p.observeLe = auj; Store.save();
        if (c === bonne) { Sound.good(); Aventure.gagner(u, 2, "bonne observation"); Aventure.conclure(u); dire("Bien observé ! Tu es un vrai jardinier."); }
        else { Sound.bad(); b.classList.add("wrong"); dire(`Pas tout à fait : c'était « ${bonne} ». Observe-la encore demain !`); }
      });
      zone.appendChild(b);
    });
    question.appendChild(zone);
    Voice.speak(q);
  }

  /* ----- ce que dit Boulon ----- */
  let msg;
  if (j.vacances) msg = "Le jardin est en vacances : ta plante t'attend sans souci.";
  else if (!p) msg = Object.values(j.graines).some((n) => n > 0) ? "Clique sur « Planter » sous une graine pour la mettre dans le pot !"
    : "Ton pot est prêt ! Achète une graine en bas : le radis et la menthe poussent vite.";
  else if (p.morte) msg = `Oh non… ${E.nom} n'a pas eu d'eau pendant trop longtemps. Mets-la au compost : la prochaine plante poussera mieux grâce au terreau.`;
  else if (Jardin.fini(p)) msg = p.espece === "oranger" ? "Ton oranger est un jeune arbre : il est trop grand pour le pot ! Plante-le dehors, devant la maison."
    : `${E.nom.charAt(0).toUpperCase() + E.nom.slice(1)} a fini de pousser ! Récolte-la : tu gagneras des graines pour en replanter.`;
  else if (sante === "fanee") msg = "Vite, ta plante est fanée ! Arrose-la pour la sauver.";
  else if (sante === "soif") msg = "Ta plante a soif : ses feuilles tombent. Arrose-la !";
  else if (p.arroseLe !== auj) msg = "Ta plante va bien. Pense à l'arroser aujourd'hui !";
  else if (p.place === "ombre") msg = "Ta plante est dans le coin sombre : sans lumière, elle pousse lentement et pâlit. Remets-la près de la fenêtre !";
  else msg = `Ta plante est arrosée. Reviens demain : elle passera peut-être à l'étape suivante. ${E.vrai}`;
  setTimeout(() => dire(msg), 300);
});

/* ------------------------------------------------------------------ */
/* L'herbier : les plantes que l'élève a fait pousser                   */
/* ------------------------------------------------------------------ */
App.register("herbier", (root) => {
  const u = Store.user; if (!u) return App.go("identif");
  const j = Jardin.etat(u);
  App.backdrop(root);
  root.appendChild(h("div", { class: "screen-header" }, h("h2", { class: "title" }, "📗 Mon herbier")));
  const grille = h("div", { class: "abs herbier-grille" });
  JARDIN_ORDRE.forEach((esp) => {
    const E = JARDIN_ESPECES[esp], date = j.herbier[esp];
    const dessin = `<svg viewBox="-80 -${E.forme === "arbre" ? 150 : 120} 160 ${E.forme === "arbre" ? 170 : 140}" aria-hidden="true"><rect x="-80" y="0" width="160" height="20" fill="#a86a2c"/>${dessinPlante(esp, 5, "ok", E.forme === "arbre" ? 140 : 110, { fruits: esp === "oranger" })}</svg>`;
    const c = h("div", { class: "herbier-carte" + (date ? "" : " vide") },
      h("div", { class: "herbier-dessin", html: date ? dessin : `<span>?</span>` }),
      h("b", null, date ? E.court : "???"),
      h("small", { class: "herbier-cat" }, date ? E.categorie : "à faire pousser"),
      date ? h("p", null, E.fiche) : null,
      date ? h("em", null, "Récoltée " + Revision.dateFr(date).replace(/^le /, "le ")) : null);
    if (NIVEAU.toutEnVoix && date) c.addEventListener("mouseenter", () => Voice.speak(`${E.nom}, ${E.categorie}. ${E.fiche}`));
    grille.appendChild(c);
  });
  root.appendChild(grille);
  App.backButton(root, "jardin");
  setTimeout(() => Voice.speak(Object.keys(j.herbier).length ? "Voici ton herbier : chaque plante que tu as fait pousser y a sa fiche." : "Ton herbier est encore vide. Fais pousser une plante jusqu'au bout pour remplir sa fiche !"), 300);
});

/* ------------------------------------------------------------------ */
/* La serre en accéléré : grand arbre ou petite plante ? (leçon sur les plantes) */
/* ------------------------------------------------------------------ */
App.register("serre", (root, params) => {
  /* une expérience du laboratoire, quand le niveau en a un (médaille « Petit chercheur » au CE2) */
  if (typeof Labo !== "undefined" && typeof LABO_EXPERIENCES !== "undefined" && LABO_EXPERIENCES.some((x) => x.id === "serre")) Labo.vu("serre");
  App.backdrop(root);
  root.appendChild(h("div", { class: "screen-header" }, h("h2", { class: "title" }, "🌿 La serre en accéléré")));
  const ETAPES = ["1 semaine", "1 mois", "1 an", "3 ans", "10 ans"];
  /* hauteur en mètres et étape du dessin, pour chaque durée */
  const SUIVI = {
    radis: [[0.05, 2], [0.25, 5], [0, -1], [0, -1], [0, -1]],
    rosier: [[0.04, 1], [0.12, 2], [0.6, 4], [1.2, 5], [1.4, 5]],
    oranger: [[0.03, 1], [0.08, 2], [0.4, 3], [1.5, 5], [3.5, 5]],
  };
  const TEXTES = [
    "Une semaine : les trois graines ont germé. On ne voit pas encore de différence.",
    "Un mois : le radis est déjà prêt à manger ! Le rosier et l'oranger sont encore tout petits.",
    "Un an : le radis a donné ses graines, puis il a séché. Il ne vit qu'une saison. Le rosier a ses premiers boutons.",
    "Trois ans : le rosier est un arbuste, avec plusieurs tiges en bois. L'oranger a un tronc et donne ses premières oranges.",
    "Dix ans : l'oranger est un arbre de plus de 3 mètres. Il peut vivre plus de 50 ans. Le rosier reste un arbuste.",
  ];
  const scene = h("div", { class: "panel abs serre-scene" });
  const cote = h("div", { class: "panel abs serre-cote" });
  const boutons = h("div", { class: "serre-temps" });
  const texte = h("p", { class: "serre-texte" });
  const pari = h("div", { class: "serre-pari" });
  let pas = -1, choix = null;
  const PX_M = 110;   // pixels par mètre
  function dessiner() {
    let s = `<path d="M60 420 V110 Q330 -10 600 110 V420" fill="#f3fbff" stroke="#9cc9de" stroke-width="4"/>
      <rect x="10" y="${420 - 4 * PX_M}" width="36" height="${4 * PX_M}" fill="#f6c445" stroke="${INK}" stroke-width="2"/>`;
    for (let mt = 0; mt <= 4; mt++) s += `<path d="M10 ${420 - mt * PX_M} h16" stroke="${INK}" stroke-width="2"/>${mt ? `<text x="28" y="${424 - mt * PX_M}" font-size="13" font-weight="700" fill="${INK}">${mt} m</text>` : ""}`;
    s += `<rect x="46" y="420" width="600" height="60" fill="#a86a2c"/><path d="M46 420 H646" stroke="${INK}" stroke-width="4"/>`;
    [["radis", 150], ["rosier", 330], ["oranger", 510]].forEach(([esp, x]) => {
      if (pas < 0) { s += `<g transform="translate(${x} 420)">${dessinPlante(esp, 0)}</g>`; return; }
      const [m, e] = SUIVI[esp][pas];
      if (e < 0) s += `<g transform="translate(${x} 412)"><rect x="-22" y="-6" width="44" height="22" rx="4" fill="#fff3c4" stroke="${INK}" stroke-width="2"/><g fill="#a86a2c"><circle cx="-10" cy="5" r="3"/><circle cx="0" cy="2" r="3"/><circle cx="10" cy="6" r="3"/></g></g>`;
      else {
        const kk = [0, 0.14, 0.38, 0.62, 0.85, 1][e];
        s += `<g transform="translate(${x} 420)">${dessinPlante(esp, e, "ok", Math.max(14, m * PX_M) / kk, { fruits: esp === "oranger" && pas >= 3 })}</g>`;
      }
    });
    const noms = [["Radis", "plante potagère"], ["Rosier", "arbuste"], ["Oranger", "arbre fruitier"]];
    s += noms.map(([n, c], i) => `<text x="${150 + i * 180}" y="452" text-anchor="middle" font-size="17" font-weight="700" fill="#fff8ea">${n}</text><text x="${150 + i * 180}" y="472" text-anchor="middle" font-size="13" fill="#fff8ea">${c}</text>`).join("");
    scene.innerHTML = `<svg viewBox="0 0 660 480" aria-hidden="true">${s}</svg>`;
    [...boutons.children].forEach((b, i) => b.classList.toggle("on", i === pas));
    if (pas >= 0) { texte.textContent = TEXTES[pas]; Voice.speak(TEXTES[pas]); }
    if (pas === 4 && choix) {
      const bon = choix === "oranger";
      texte.textContent += bon ? " Tu avais bien deviné : c'est l'oranger !" : " Tu pensais à une autre plante : c'est l'oranger qui devient le plus grand.";
      if (bon) Sound.good();
    }
  }
  ETAPES.forEach((t, i) => boutons.appendChild(h("button", { class: "btn white small", onclick: () => {
    if (!choix) { Sound.bad(); Voice.speak("Fais d'abord ton pari : laquelle deviendra la plus grande ?"); return; }
    pas = i; Sound.click(); dessiner();
  } }, t)));
  pari.append(h("p", null, h("b", null, "Ton pari : "), "laquelle deviendra la plus grande ?"));
  const ligne = h("div", { class: "row", style: { gap: "8px", flexWrap: "wrap" } });
  [["radis", "le radis"], ["rosier", "le rosier"], ["oranger", "l'oranger"]].forEach(([id, nom]) => ligne.appendChild(h("button", { class: "btn small sky", onclick: (e) => {
    choix = id; Sound.pop(); [...ligne.children].forEach((b) => b.classList.toggle("yellow", b === e.currentTarget));
    Voice.speak(`Tu paries sur ${nom}. Fais maintenant passer le temps !`);
  } }, nom)));
  pari.appendChild(ligne);
  cote.append(h("h3", null, "Fais passer le temps"), pari, boutons, texte);
  root.append(scene, cote);
  dessiner();
  App.backButton(root, params.retour || "labo");
  setTimeout(() => Voice.speak("Trois graines, trois plantes différentes. Avant de faire passer le temps, fais ton pari : laquelle deviendra la plus grande ?"), 300);
});

/* ------------------------------------------------------------------ */
/* Le pot dans l'atelier, et sur la maison                              */
/* ------------------------------------------------------------------ */
/* à la place du rebord de la fenêtre de l'atelier du CE2 (un niveau peut le déplacer : PLACE_DECORS.pot) */
ATELIER_DECORS.pot = {
  box: "100 120 76 142",
  svg: () => {
    const u = Store.data && Store.user, p = u && Jardin.etat(u).plante;
    const soif = p && !p.morte && p.arroseLe !== Revision.jour(0) && !Jardin.etat(u).vacances;
    return `<g transform="translate(138 222)">${potAvecPlante(u, 52, 90)}</g>`
      + (soif ? `<path d="M168 150 q-11 15 -11 22 a11 11 0 0 0 22 0 q0 -7 -11 -22 z" fill="#5bc0eb" stroke="${INK}" stroke-width="2.5"/>` : "");
  },
};
DECORS_ACTIFS.pot = {
  label: "Mon petit jardin", desc: "Ta plante : arrose-la et regarde-la pousser.", effet: "Clique dessus : ton petit jardin. Il se voit à la fenêtre.",
  agir() { Sound.click(); App.go("jardin"); },
};
/* sur une petite planche, sous la fenêtre de droite de la maison */
MAISON_DEHORS.pot = (u) => `<rect x="576" y="450" width="108" height="10" rx="3" fill="#8a5a24" stroke="${INK}" stroke-width="3"/>
  <g transform="translate(626 446) scale(.42)">${potAvecPlante(u, 52, 90)}</g>`;
/* la jardinière (les plantes réussies) et l'oranger planté dehors */
MAISON_AJOUTS.push((u) => {
  const j = u && u.jardin;
  if (!j) return "";
  let s = "";
  (j.jardiniere || []).forEach((esp, i) => { s += `<g transform="translate(${372 + i * 37} 452) scale(.32)">${dessinPlante(esp, 5, "ok", 110)}</g>`; });
  if (j.arbre) {
    const E = JARDIN_ESPECES.oranger, f = Math.min(1, 0.35 + j.arbre.jours / E.dehors * 0.65);
    s += `<g transform="translate(272 626)">${dessinPlante("oranger", 5, "ok", 190 * f, { fleurs: j.arbre.jours >= 10 && j.arbre.jours < E.dehors, fruits: j.arbre.jours >= E.dehors })}</g>`;
  }
  return s;
});

/* ------------------------------------------------------------------ */
/* Les médailles du jardin                                              */
/* ------------------------------------------------------------------ */
ajouterMedailles([
  { id: "main-verte", icone: "🌻", nom: "Main verte", desc: "Fais pousser une plante jusqu'au bout.", ok: (u) => Object.keys((u.jardin && u.jardin.herbier) || {}).length >= 1 },
  { id: "botaniste", icone: "📗", nom: "Botaniste", desc: "Remplis 5 fiches de l'herbier.", ok: (u) => Object.keys((u.jardin && u.jardin.herbier) || {}).length >= 5 },
  { id: "jardinier-fidele", icone: "💧", nom: "Jardinier fidèle", desc: "Arrose ta plante 10 jours différents.", ok: (u) => ((u.jardin && u.jardin.joursArroses) || 0) >= 10 },
]);
