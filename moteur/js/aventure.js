/* L'Atelier de Boulon — l'aventure : écrous à gagner, rangs, médailles et boutique.
   On gagne des écrous 🔩 en travaillant (nouvelles étoiles, révisions, défis, missions, régularité),
   puis on les dépense pour décorer l'atelier et habiller Boulon. */
"use strict";

const AVENTURE_RANGS = [
  { min: 0, nom: "Apprenti", icone: "🔧" },
  { min: 50, nom: "Bricoleur", icone: "🪛" },
  { min: 150, nom: "Mécanicien", icone: "⚙️" },
  { min: 350, nom: "Inventeur", icone: "💡" },
  { min: 700, nom: "Ingénieur", icone: "🚀" },
  { min: 1200, nom: "Génie de l'atelier", icone: "🌟" },
];

/* boutique : type = decor (placé dans l'atelier), tete / yeux / cou (porté par Boulon), couleur */
const AVENTURE_BOUTIQUE = [
  { id: "guirlande", type: "decor", nom: "Guirlande de fanions", prix: 25 },
  { id: "cactus", type: "decor", nom: "Petit cactus", prix: 15 },
  { id: "plante", type: "decor", nom: "Grande plante", prix: 35 },
  { id: "pot", type: "decor", nom: "Pot de fleurs", prix: 40 },        // ouvre « Mon petit jardin » (jardin.js)
  { id: "affiche", type: "decor", nom: "Affiche de fusée", prix: 50 },
  { id: "tableau", type: "decor", nom: "Tableau noir", prix: 60 },
  { id: "tapis", type: "decor", nom: "Tapis arc-en-ciel", prix: 80 },
  { id: "chat", type: "decor", nom: "Rivet, le chat robot", prix: 150 },
  { id: "noeud", type: "cou", nom: "Nœud papillon", prix: 20 },
  { id: "echarpe", type: "cou", nom: "Écharpe", prix: 35 },
  { id: "lunettes", type: "yeux", nom: "Lunettes rondes", prix: 25 },
  { id: "soleil", type: "yeux", nom: "Lunettes de soleil", prix: 40 },
  { id: "casquette", type: "tete", nom: "Casquette", prix: 30 },
  { id: "chantier", type: "tete", nom: "Casque de chantier", prix: 45 },
  { id: "magicien", type: "tete", nom: "Chapeau de magicien", prix: 90 },
  { id: "couronne", type: "tete", nom: "Couronne", prix: 250 },
  { id: "bleu", type: "couleur", nom: "Boulon bleu", prix: 40 },
  { id: "vert", type: "couleur", nom: "Boulon vert", prix: 40 },
  { id: "violet", type: "couleur", nom: "Boulon violet", prix: 40 },
  { id: "rose", type: "couleur", nom: "Boulon rose", prix: 40 },
];

/* La fiche d'un objet de la boutique : ce que l'enfant y gagne, avec des aperçus, avant de l'acheter
   (au CP, Boulon la lit). lignes : [icône, texte], {ici} = la pièce où va l'objet ; apercus : [photo,
   légende], photos des activités dans niveaux/<niveau>/apercus/ (faites par outils-site/apercus_boutique.mjs).
   Un habit ou une couleur montre aussi Boulon qui le porte. */
const AVENTURE_FICHES = {
  guirlande: { lignes: [["🎊", "Elle va {ici}, et on la voit aussi sur la maison."], ["🎉", "Clique dessus : c'est la fête ! Boulon te présente une fête du Maroc."]], apercus: [["fete", "Une fête du Maroc"]] },
  cactus: { lignes: [["🌵", "Il va {ici}. On le voit aussi à la fenêtre de la maison."], ["❓", "Clique dessus : « Le savais-tu ? » sur le désert, avec une question."]], apercus: [["cactus", "Le savais-tu ?"]] },
  plante: { lignes: [["🪴", "Elle va {ici}. On la voit aussi à la fenêtre de la maison."], ["🌿", "Clique dessus : la plante t'explique comment elle vit, avec une question."]], apercus: [["plante", "Le savais-tu ?"]] },
  pot: { lignes: [["🌱", "Il ouvre ton petit jardin : tu achètes des graines, tu les plantes et tu les arroses."], ["💧", "Ta plante pousse un peu à chaque visite, si elle a de l'eau."], ["🪟", "Il va {ici}, sur le rebord de la grande fenêtre."]], apercus: [["jardin", "Ton petit jardin"]] },
  affiche: { lignes: [["🚀", "Elle va {ici}."], ["❓", "Clique dessus : « Le savais-tu ? » sur l'espace et les fusées, avec une question."]], apercus: [["affiche", "Le savais-tu ?"]] },
  tableau: { lignes: [["🧑‍🏫", "Il va {ici}."], ["❓", "Clique dessus : le défi du jour. Une question par jour, un seul essai."], ["🔩", "Défi réussi : 3 écrous de plus !"]], apercus: [["defi-du-jour", "Le défi du jour"]] },
  tapis: { lignes: [["🌈", "Il va {ici}."], ["🎨", "Clique dessus : l'atelier des couleurs. Tu mélanges deux peintures pour en inventer une nouvelle."], ["🖌️", "Tes mélanges vont dans le chevalet, pour dessiner avec."]], apercus: [["couleurs", "L'atelier des couleurs"]] },
  chat: { lignes: [["🐱", "Rivet vient vivre {ici}. On le voit aussi à la fenêtre de la maison."], ["🤖", "Clique sur lui : il ouvre son atelier. Tu apprends à donner des ordres à un robot pour l'aider à trouver l'écrou."], ["⚙️", "Il ouvre aussi un nouveau jeu : la machine de Boulon, avec des tuyaux et des engrenages."]], apercus: [["rivet", "L'atelier de Rivet"], ["machine", "La machine de Boulon"]] },
  noeud: { lignes: [["🎀", "Boulon le porte autour du cou, partout dans le jeu."]] },
  echarpe: { lignes: [["🧣", "Boulon la porte autour du cou, partout dans le jeu."]] },
  lunettes: { lignes: [["👓", "Boulon les porte sur les yeux, partout dans le jeu."], ["🌱", "Avec elles, tu vois les racines de ta plante, dans le jardin."]] },
  soleil: { lignes: [["🕶️", "Boulon les porte sur les yeux, partout dans le jeu."]] },
  casquette: { lignes: [["🧢", "Boulon la porte sur la tête, partout dans le jeu."]] },
  chantier: { lignes: [["⛑️", "Boulon le porte sur la tête, partout dans le jeu."], ["🧱", "Pour la tour, dans les jeux de construction : 5 blocs de plus !"]] },
  magicien: { lignes: [["🎩", "Boulon le porte sur la tête, partout dans le jeu."], ["🦊", "Au défi contre Zigzag, il te donne un joker : il enlève une mauvaise réponse, une fois par défi."]] },
  couronne: { lignes: [["👑", "Boulon la porte sur la tête, partout dans le jeu. C'est le plus bel objet de la boutique !"]] },
  orange: { lignes: [["🟠", "Boulon reprend sa couleur orange, partout dans le jeu."]] },
  bleu: { lignes: [["🔵", "Boulon devient bleu, partout dans le jeu."]] },
  vert: { lignes: [["🟢", "Boulon devient vert, partout dans le jeu."]] },
  violet: { lignes: [["🟣", "Boulon devient violet, partout dans le jeu."]] },
  rose: { lignes: [["🌸", "Boulon devient rose, partout dans le jeu."]] },
};

/* médailles : chacune rapporte 10 écrous */
const nbLecons = (u) => Object.keys(u.lessons || {}).filter((id) => LESSONS[id]).length;
const nbParfaites = (u) => Object.entries(u.lessons || {}).filter(([id, r]) => LESSONS[id] && r.best >= 16).length;
const nbVictoires = (u) => Object.values(u.defi || {}).reduce((s, r) => s + (r.wins || 0), 0);
const geoOf = (u) => u.geo || { missions: {}, vus: {} };   // progrès du module géographie (vide s'il est absent)
const AVENTURE_MEDAILLES = [
  { id: "premier-pas", icone: "👣", nom: "Premier pas", desc: "Termine ta première leçon.", ok: (u) => nbLecons(u) >= 1 },
  { id: "studieux", icone: "📚", nom: "Studieux", desc: "Travaille 10 leçons différentes.", ok: (u) => nbLecons(u) >= 10 },
  { id: "tout-le-cahier", icone: "🎓", nom: "Tout le cahier", desc: "Travaille toutes les leçons du cahier.", ok: (u) => nbLecons(u) >= Object.keys(LESSONS).length },
  { id: "etoile-or", icone: "⭐", nom: "Étoile d'or", desc: "Obtiens 3 étoiles à une leçon.", ok: (u) => nbParfaites(u) >= 1 },
  { id: "constellation", icone: "✨", nom: "Constellation", desc: "Obtiens 3 étoiles à 10 leçons.", ok: (u) => nbParfaites(u) >= 10 },
  { id: "chapitre-parfait", icone: "🏆", nom: "Chapitre parfait", desc: "Obtiens 3 étoiles à toutes les leçons d'un chapitre.",
    ok: (u) => Object.values(CONTENT).some((s) => s.chapters.some((c) => c.lessons.every((l) => u.lessons[l.id] && u.lessons[l.id].best >= 16))) },
  { id: "bonne-memoire", icone: "🔁", nom: "Bonne mémoire", desc: "Fais ta première révision.", ok: (u) => (u.revisions || 0) >= 1 },
  { id: "elephant", icone: "🐘", nom: "Mémoire d'éléphant", desc: "Fais 10 révisions.", ok: (u) => (u.revisions || 0) >= 10 },
  { id: "plus-jamais", icone: "✏️", nom: "Plus jamais !", desc: "Corrige 10 questions ratées en révision.", ok: (u) => (Aventure.etat(u).corrigees || 0) >= 10 },
  { id: "ruse", icone: "🦊", nom: "Plus rusé que Zigzag", desc: "Bats Zigzag au défi.", ok: (u) => nbVictoires(u) >= 1 },
  { id: "champion", icone: "🥇", nom: "Champion", desc: "Bats Zigzag 10 fois.", ok: (u) => nbVictoires(u) >= 10 },
  { id: "boussole", icone: "🧭", nom: "Bien orienté", desc: "Fais le test de la boussole.", ok: (u) => !!u.orient },
  /* la série compte les rendez-vous choisis par le parent (jours, semaines…) : le texte suit son réglage */
  { id: "regulier", icone: "📅", nom: "Régulier", get desc() { return `Viens travailler ${Aventure.serieTexte(3)} de suite.`; }, ok: (u) => (Aventure.etat(u).serieMax || 0) >= 3 },
  { id: "assidu", icone: "🔥", nom: "Assidu", get desc() { return `Viens travailler ${Aventure.serieTexte(7)} de suite.`; }, ok: (u) => (Aventure.etat(u).serieMax || 0) >= 7 },
  { id: "premier-achat", icone: "🛍️", nom: "Premier achat", desc: "Achète un objet dans la boutique.", ok: (u) => Object.keys(Aventure.etat(u).achats).length >= 1 },
  { id: "decorateur", icone: "🏠", nom: "Décorateur", desc: "Achète 5 objets dans la boutique.", ok: (u) => Object.keys(Aventure.etat(u).achats).length >= 5 },
];

/* un niveau ou un module ajoute ses médailles à sa place dans la liste :
   ajouterMedailles([...], { apres: "boussole" }) ou { avant: "regulier" } (sans précision : à la fin) */
function ajouterMedailles(liste, ou = {}) {
  const k = AVENTURE_MEDAILLES.findIndex((m) => m.id === (ou.apres || ou.avant));
  const i = k < 0 ? AVENTURE_MEDAILLES.length : ou.apres ? k + 1 : k;
  AVENTURE_MEDAILLES.splice(i, 0, ...liste);
}
/* un niveau retire les médailles impossibles chez lui (ex. le CP n'a pas de boussole) */
function retirerMedailles(ids) {
  for (let i = AVENTURE_MEDAILLES.length - 1; i >= 0; i--) if (ids.includes(AVENTURE_MEDAILLES[i].id)) AVENTURE_MEDAILLES.splice(i, 1);
}

/* les dates des visites : numéro du jour, lundi de la semaine (AAAA-MM-JJ) */
/* (en temps universel, sans arrondi : le résultat ne dépend pas du fuseau horaire de l'ordinateur) */
const avNumJour = (d) => { const [y, m, j] = d.split("-").map(Number); return Date.UTC(y, m - 1, j) / 864e5; };
const avJourSemaine = (n) => (n + 4) % 7;   // 0 = dimanche (le 1er janvier 1970 était un jeudi)
const avLundi = (d) => { const n = avNumJour(d); return new Date((n - (avJourSemaine(n) + 6) % 7) * 864e5).toISOString().slice(0, 10); };

/* Une VISITE = un jour où l'enfant vient jouer (plusieurs fois le même jour ne comptent qu'une fois).
   Le temps du jeu avance aux visites, pas au calendrier : un enfant qui vient une fois par semaine ne
   perd rien pendant son absence. La série compte les rendez-vous tenus selon le rythme choisi par le
   parent pour cet enfant (Parents.pour(u).rythme) : "semaine" (par défaut : une visite par semaine),
   "jour" (chaque jour d'ouverture) ou "jours" (certains jours, joursSemaine : 0 = dimanche … 6 = samedi).
   Un jour fermé ne casse jamais la série ; une visite hors rendez-vous (jeu libre) ne la casse pas et ne
   l'allonge pas. */
const Aventure = {
  PLAFOND_SEMAINE: 120,  // écrous « répétables » (séries, révisions, défis) gagnés au plus par semaine
  BONUS_MEDAILLE: 10,
  _file: [],           // messages à afficher
  _medailles: [],      // médailles gagnées, remises une par une (Aventure.ceremonie)
  _bonusVisite: 0,     // bonus de la première visite du jour, que l'atelier dit (CP)
  dernierGain: null,   // écrous gagnés par la dernière leçon : { lecon, n, raisons } (écran de résultat)

  /* ---------- état de l'élève ---------- */
  etat(u) {
    if (!u.aventure || typeof u.aventure !== "object") u.aventure = {};
    const a = u.aventure;
    for (const k of ["ecrous", "total", "corrigees", "serie", "serieMax", "gainsSemaine", "visites"]) if (typeof a[k] !== "number" || !(a[k] >= 0)) a[k] = 0;
    for (const k of ["achats", "places", "medailles", "porte"]) if (!a[k] || typeof a[k] !== "object" || Array.isArray(a[k])) a[k] = {};
    if (typeof a.dernierJour !== "string") a.dernierJour = "";
    for (const k of ["semaineGains", "serieRythme"]) if (typeof a[k] !== "string") a[k] = "";
    return a;
  },
  /* style de Boulon pour l'élève connecté (lu par Art.boulon) */
  style() {
    const u = Store.data && Store.user;
    if (!u || !u.aventure) return {};
    const p = u.aventure.porte || {};
    return { couleur: p.couleur, tete: p.tete, yeux: p.yeux, cou: p.cou };
  },
  rang(total) {
    let i = 0;
    while (i + 1 < AVENTURE_RANGS.length && total >= AVENTURE_RANGS[i + 1].min) i++;
    return { i, ...AVENTURE_RANGS[i], suivant: AVENTURE_RANGS[i + 1] || null };
  },

  /* ---------- gains ---------- */
  /* repetable : soumis au plafond de la semaine (la durée de séance du parent évite la séance sans fin) */
  gagner(u, n, raison, repetable = false) {
    const a = this.etat(u);
    if (repetable) {
      const lundi = avLundi(Revision.jour(0));
      if (a.semaineGains !== lundi) { a.semaineGains = lundi; a.gainsSemaine = 0; }
      n = Math.max(0, Math.min(n, this.PLAFOND_SEMAINE - a.gainsSemaine));
      a.gainsSemaine += n;
    }
    if (n <= 0) return 0;
    const avant = this.rang(a.total).i;
    a.ecrous += n; a.total += n;
    this._file.push({ n, raison });
    const r = this.rang(a.total);
    if (r.i > avant) this._file.push({ txt: `${r.icone} Nouveau rang : ${r.nom} !`, grand: true });
    return n;
  },
  /* ---------- visites et série ---------- */
  /* le rythme de l'enfant ; jours = les jours de rendez-vous ("jour" : chaque jour d'ouverture) */
  rythme(u = Store.user) {
    if (typeof Parents === "undefined") return { rythme: "jour", jours: [0, 1, 2, 3, 4, 5, 6] };
    const p = Parents.pour(u);
    return { rythme: p.rythme, jours: p.rythme === "jours" ? [...p.joursSemaine] : p.rythme === "jour" ? [...p.ouverts] : [] };
  },
  cleRythme(R) { return R.rythme + (R.rythme === "semaine" ? "" : ":" + [...R.jours].sort().join("")); },
  /* « 3 semaines », « 3 jours », « 3 rendez-vous » */
  serieTexte(n, u = Store.user) {
    const r = this.rythme(u).rythme;
    return r === "jour" ? `${n} jour${n > 1 ? "s" : ""}` : r === "semaine" ? `${n} semaine${n > 1 ? "s" : ""}` : `${n} rendez-vous`;
  },
  /* « demain », « la semaine prochaine », « au prochain rendez-vous » */
  prochainRdv(u = Store.user) { const r = this.rythme(u).rythme; return r === "jour" ? "demain" : r === "semaine" ? "la semaine prochaine" : "au prochain rendez-vous"; },
  /* la série après une visite le jour d, la visite précédente étant le jour « avant » (ou "") */
  serieApres(serie, avant, d, R) {
    if (R.rythme === "semaine") {
      if (!avant) return 1;
      const k = Math.round((avNumJour(avLundi(d)) - avNumJour(avLundi(avant))) / 7);
      return k === 0 ? Math.max(1, serie) : k === 1 ? serie + 1 : 1;
    }
    /* jours de rendez-vous : un rendez-vous manqué casse la série ; venir un autre jour ne la casse pas, ne l'allonge pas */
    const prevu = (n) => R.jours.includes(avJourSemaine(n));
    if (!avant) return prevu(avNumJour(d)) ? 1 : 0;
    let manque = false;
    for (let n = avNumJour(avant) + 1; n < avNumJour(d) && !manque; n++) manque = prevu(n);
    const base = manque ? 0 : serie;
    return prevu(avNumJour(d)) ? base + 1 : base;
  },
  /* au changement de rythme (et la première fois) : la série est recalculée sur le journal des visites */
  recalculerSerie(u, R) {
    const a = this.etat(u), auj = Revision.jour(0);
    const jours = new Set(a.dernierJour && a.dernierJour < auj ? [a.dernierJour] : []);
    if (typeof Journal !== "undefined") for (const [d, v] of Object.entries(Journal.etat(u).jours)) if (d < auj && (v.min > 0 || v.series > 0)) jours.add(d);
    let serie = 0, avant = "";
    for (const d of [...jours].sort()) { serie = this.serieApres(serie, avant, d, R); avant = d; }
    a.serie = serie;
    if (avant) a.dernierJour = avant;
    a.serieRythme = this.cleRythme(R);
  },
  /* bonus de la première visite du jour et série de rendez-vous */
  journee(u) {
    const a = this.etat(u), auj = Revision.jour(0);
    if (a.dernierJour === auj) return;
    const R = this.rythme(u);
    if (a.serieRythme !== this.cleRythme(R)) this.recalculerSerie(u, R);
    a.serie = this.serieApres(a.serie, a.dernierJour, auj, R);
    a.serieMax = Math.max(a.serieMax, a.serie);
    a.dernierJour = auj;
    a.visites += 1;
    this._bonusVisite = this.gagner(u, 3 + Math.min(a.serie, 7), a.serie > 1 ? `${this.serieTexte(a.serie, u)} de suite !` : "bonus de la visite");
    if (this._bonusVisite) this._file[this._file.length - 1].bonusVisite = true;
  },
  /* l'atelier montre le bonus dans sa fenêtre : le petit message en haut de l'écran n'est plus utile */
  prendreBonusVisite() {
    const n = this._bonusVisite; this._bonusVisite = 0;
    if (n) this._file = this._file.filter((m) => !m.bonusVisite);
    return n;
  },
  /* la fenêtre du bonus de la visite, à l'arrivée dans l'atelier ; ensuite() quand l'enfant la ferme
     (Boulon dit bonjour après, pas avant : test avec un enfant). Elle ne parle pas d'elle-même. */
  fenetreBonusVisite(u, n, ensuite) {
    const a = this.etat(u);
    const texte = `Bonus de la visite : ${n} écrou${n > 1 ? "s" : ""} !` + (a.serie > 1 ? ` ${this.serieTexte(a.serie, u)} de suite !` : "");
    let close;
    close = App.modal(h("div", { class: "av-bonus" },
      h("div", { class: "title dark av-bonus-titre" }, "🎁 Bonus de la visite !"),
      h("div", { class: "av-bonus-n" }, `🔩 +${n}`),
      a.serie > 1 ? h("p", null, `🔥 ${this.serieTexte(a.serie, u)} de suite !`) : h("p", null, "Content de te revoir !"),
      h("div", { class: "row" },
        h("button", { class: "btn sky", title: "Écouter", onclick: () => Voice.speak(texte) }, "🔊"),
        h("button", { class: "btn green", onclick: () => close() }, "Super !"))),
      { onClose: () => ensuite && ensuite() });
    Sound.pop();
  },
  /* médailles nouvellement gagnées */
  verifier(u) {
    const a = this.etat(u);
    for (const m of AVENTURE_MEDAILLES) {
      if (a.medailles[m.id]) continue;
      let ok = false;
      try { ok = m.ok(u); } catch (e) { ok = false; }
      if (!ok) continue;
      a.medailles[m.id] = Revision.jour(0);
      this._medailles.push(m);   // remise en grand (test avec un enfant : le petit message passait inaperçu)
      this.gagner(u, this.BONUS_MEDAILLE, "médaille");
    }
  },
  /* premier passage dans l'aventure : récompense le travail déjà fait */
  /* exclu = { lecon, mission, avant } : ce qui vient d'être enregistré compte avec sa valeur d'avant */
  demarrer(u, exclu = {}) {
    const a = this.etat(u);
    if (a.demarre) return;
    a.demarre = true;
    const etoiles = Object.entries(u.lessons || {}).filter(([id]) => LESSONS[id])
        .reduce((s, [id, r]) => s + starsFor(id === exclu.lecon ? exclu.avant : r.best), 0)
      + Object.entries(geoOf(u).missions || {}).reduce((s, [id, r]) => s + (id === exclu.mission ? exclu.avant : r.stars || 0), 0);
    if (etoiles) this.gagner(u, etoiles * 5, `pour tes ${etoiles} étoile${etoiles > 1 ? "s" : ""} déjà gagnée${etoiles > 1 ? "s" : ""}`);
  },
  /* à appeler après chaque événement : médailles, sauvegarde, affichage */
  conclure(u) {
    this.verifier(u);
    Store.save();
    this.afficher();
  },
  evenement() {
    const u = Store.user; if (!u) return;
    this.demarrer(u); this.journee(u); this.conclure(u);
  },

  /* ---------- branchements sur le jeu ---------- */
  apresLecon(id, avant, note) {
    const u = Store.user; if (!u) return;
    const debut = this._file.length;
    this.demarrer(u, { lecon: id, avant }); this.journee(u);
    const nouvelles = Math.max(0, starsFor(note) - starsFor(avant));
    if (nouvelles) this.gagner(u, nouvelles * 5, `${nouvelles} nouvelle${nouvelles > 1 ? "s" : ""} étoile${nouvelles > 1 ? "s" : ""}`);
    if (note >= 12) this.gagner(u, 2, "série terminée", true);
    this.verifier(u);
    /* les écrous de cette leçon, que l'écran de résultat montre en grand */
    const gains = this._file.slice(debut).filter((m) => m.n);
    this.dernierGain = { lecon: id, n: gains.reduce((s, m) => s + m.n, 0), raisons: [...new Set(gains.map((m) => m.raison))] };
    this.conclure(u);
  },
  apresRevision(note, corrigees) {
    const u = Store.user; if (!u) return;
    this.demarrer(u); this.journee(u);
    const a = this.etat(u);
    a.corrigees += corrigees || 0;
    if (note >= 10) this.gagner(u, 4 + 2 * (corrigees || 0), "révision", true);
    this.conclure(u);
  },
  apresDefi(gagne) {
    const u = Store.user; if (!u) return;
    this.demarrer(u); this.journee(u);
    if (gagne) this.gagner(u, 8, "victoire contre Zigzag", true);
    this.conclure(u);
  },
  apresMission(id, avant, etoiles) {
    const u = Store.user; if (!u) return;
    this.demarrer(u, { mission: id, avant }); this.journee(u);
    const nouvelles = Math.max(0, etoiles - avant);
    if (nouvelles) this.gagner(u, nouvelles * 5, `${nouvelles} nouvelle${nouvelles > 1 ? "s" : ""} étoile${nouvelles > 1 ? "s" : ""}`);
    if (etoiles >= 1) this.gagner(u, 2, "mission terminée", true);
    this.conclure(u);
  },

  /* ---------- boutique ---------- */
  acheter(u, item) {
    const a = this.etat(u);
    if (a.achats[item.id] || a.ecrous < item.prix) return false;
    a.ecrous -= item.prix;
    a.achats[item.id] = Revision.jour(0);
    this.utiliser(u, item, true);
    /* atelier en plusieurs pièces : on dit où l'objet est rangé */
    const piece = item.type === "decor" && Pieces.de(item.id, "decors");
    this._file.push({ txt: `🛍️ ${item.nom} : c'est à toi !` + (piece ? ` Va voir ${piece.dans}.` : "") });
    this.conclure(u);
    return true;
  },
  possede(u, item) { return item.id === "orange" || !!this.etat(u).achats[item.id]; },
  /* la fiche de l'objet : ce que l'enfant y gagne, des aperçus, les écrous qui manquent ; apres() : après l'achat */
  fiche(u, it, apres) {
    const a = this.etat(u), F = AVENTURE_FICHES[it.id] || { lignes: [] };
    const piece = it.type === "decor" && typeof Pieces !== "undefined" && Pieces.de(it.id, "decors");
    const lignes = F.lignes.map(([ic, t]) => [ic, t.replace("{ici}", piece ? piece.dans : "dans l'atelier")]);
    const habit = ["tete", "yeux", "cou"].includes(it.type), couleur = it.type === "couleur";
    if (habit) lignes.push(["🔄", "Tu peux l'enlever ou la remettre quand tu veux, dans le coffre."]);
    if (couleur) lignes.push(["🔄", "Tu peux changer de couleur quand tu veux, dans le coffre."]);
    const possede = this.possede(u, it), manque = Math.max(0, it.prix - a.ecrous);
    const refus = `Tu ne peux pas encore l'acheter : il te manque ${manque} écrou${manque > 1 ? "s" : ""}.`;
    /* les aperçus : les activités débloquées, ou Boulon qui porte l'objet */
    const apercus = (F.apercus || []).map(([f, leg]) => h("figure", null, h("img", { src: CHEMINS.niveau + "apercus/" + f + ".jpg", alt: leg }), leg));
    if (habit || couleur) apercus.push(h("figure", null, h("div", { class: "av-fiche-boulon", html: Art.boulon({ ...(a.porte || {}), [couleur ? "couleur" : it.type]: it.id }) }), "Sur Boulon"));
    const etat = possede ? h("div", { class: "av-fiche-etat ok" }, h("b", null, "C'est déjà à toi !"))
      : manque ? h("div", { class: "av-fiche-etat" }, h("b", null, `Tu as ${a.ecrous} écrou${a.ecrous > 1 ? "s" : ""} : il t'en manque ${manque}.`),
          h("div", null, "Fais des leçons et des révisions pour en gagner !"), h("div", { class: "av-fiche-barre" }, h("i", { style: { width: Math.round((a.ecrous / it.prix) * 100) + "%" } })))
      : h("div", { class: "av-fiche-etat ok" }, h("b", null, "Tu as assez d'écrous !"), h("div", null, `Après l'achat, il t'en restera ${a.ecrous - it.prix}.`));
    const texte = `${it.nom}. ${lignes.map((l) => l[1]).join(" ")} `
      + (possede ? "C'est déjà à toi !" : manque ? refus + " Fais des leçons et des révisions pour en gagner !" : "Tu as assez d'écrous pour l'acheter.");
    let close;
    const acheter = h("button", { class: "btn " + (manque ? "white av-fiche-pasassez" : "green"), onclick: () => {
      /* pas assez d'écrous : le bouton reste cliquable, pour que Boulon explique pourquoi */
      if (manque) { Sound.bad(); acheter.classList.remove("secoue"); void acheter.offsetWidth; acheter.classList.add("secoue"); Voice.speak(refus); return; }
      if (!this.acheter(u, it)) return;
      Sound.good(); close();
      if (NIVEAU.toutEnVoix) Voice.speak(`${it.nom} : c'est à toi !` + (piece ? ` Va voir ${piece.dans}.` : ""));
      apres && apres();
    } }, `🛒 Acheter : 🔩 ${it.prix}`);
    close = App.modal(h("div", { class: "av-fiche" },
      h("div", { class: "av-fiche-gauche" },
        h("div", { class: "av-fiche-vignette", html: this.vignette(it) }),
        h("div", { style: { textAlign: "center" } }, h("span", { class: "av-fiche-prix" }, it.prix ? `🔩 ${it.prix}` : "gratuit")),
        apercus.length ? h("div", { class: "av-fiche-apercus" }, h("h4", null, "Aperçu :"), ...apercus) : null),
      h("div", null, h("h2", { class: "title dark" }, it.nom), h("h4", null, "Ce que tu y gagnes :"),
        h("ul", { class: "av-fiche-liste" }, ...lignes.map(([ic, t]) => h("li", null, h("span", null, ic), h("div", null, t)))), etat),
      h("div", { class: "av-fiche-boutons" },
        h("button", { class: "btn sky", onclick: () => Voice.speak(texte) }, "🔊 Réécouter"),
        possede ? null : acheter,
        h("button", { class: "btn white", onclick: () => close() }, "Fermer"))), { onClose: () => Voice.stop() });
    if (NIVEAU.toutEnVoix) Voice.speak(texte); else if (!possede && manque) Voice.speak(refus);
  },
  utilise(u, item) {
    const a = this.etat(u);
    if (item.type === "decor") return !!a.places[item.id];
    if (item.type === "couleur") return (a.porte.couleur || "orange") === item.id;
    return a.porte[item.type] === item.id;
  },
  utiliser(u, item, oui) {
    const a = this.etat(u);
    if (item.type === "decor") { if (oui) a.places[item.id] = true; else delete a.places[item.id]; }
    else if (item.type === "couleur") a.porte.couleur = oui ? item.id : "orange";
    else if (oui) a.porte[item.type] = item.id; else delete a.porte[item.type];
    Store.save();
  },
  /* décorations placées, à ajouter au dessin de l'atelier. Chacune est cliquable (objets.js) ;
     un niveau peut les déplacer avec PLACE_DECORS (ex. le CP, dont l'atelier est différent) */
  /* piece (facultatif) : seulement les décors rangés dans cette pièce de l'atelier (Pieces, art.js) */
  decorsSvg(u, piece) {
    const a = this.etat(u);
    const attr = (t) => String(t).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
    return AVENTURE_BOUTIQUE.filter((it) => it.type === "decor" && a.places[it.id] && a.achats[it.id] && ATELIER_DECORS[it.id]
      && (!piece || Pieces.de(it.id, "decors") === piece))
      .map((it) => {
        const act = typeof DECORS_ACTIFS !== "undefined" && DECORS_ACTIFS[it.id];
        const place = PLACE_DECORS[it.id] ? ` transform="${PLACE_DECORS[it.id]}"` : "";
        const dessin = ATELIER_DECORS[it.id].svg();
        /* le déplacement est sur un groupe à part : l'animation de la lampe (CSS) ne doit pas l'effacer */
        return `<g${place}>` + (act ? `<g class="hot decor" data-id="decor-${it.id}" data-label="${attr(act.label)}" data-desc="${attr(act.desc)}">${dessin}</g>` : dessin) + `</g>`;
      }).join("");
  },
  /* ce qui se voit sur la maison, dehors (objets.js : MAISON_DEHORS) */
  dehorsSvg(u) {
    if (!u || typeof MAISON_DEHORS === "undefined") return "";
    const a = this.etat(u);
    return AVENTURE_BOUTIQUE.filter((it) => a.places[it.id] && a.achats[it.id] && MAISON_DEHORS[it.id]).map((it) => MAISON_DEHORS[it.id](u)).join("")
      + MAISON_AJOUTS.map((f) => f(u)).join("");
  },
  vignette(item) {
    if (item.type === "decor") { const d = ATELIER_DECORS[item.id]; return `<svg viewBox="${d.box}" xmlns="http://www.w3.org/2000/svg">${d.svg()}</svg>`; }
    const st = item.type === "couleur" ? { couleur: item.id } : { [item.type]: item.id };
    /* cadrage sur la partie de Boulon qui change */
    const cadre = { tete: "16 -22 118 104", yeux: "26 36 98 66", cou: "18 78 114 84", couleur: "-4 -4 158 176" }[item.type];
    return Art.boulon(st).replace('viewBox="0 0 150 170"', `viewBox="${cadre}"`);
  },

  /* ---------- sauvegarde des élèves ---------- */
  nettoyer(a) {
    if (!a || typeof a !== "object") return undefined;
    const ids = new Set(AVENTURE_BOUTIQUE.map((i) => i.id).concat("orange"));
    const medIds = new Set(AVENTURE_MEDAILLES.map((m) => m.id));
    const map = (o, ok, val) => Object.fromEntries(Object.entries(o && typeof o === "object" ? o : {}).filter(([k]) => ok(k)).map(([k, v]) => [k, val(v)]));
    const n = (v) => Math.max(0, Math.min(1e6, Math.floor(Number(v) || 0)));
    const porte = {};
    for (const t of ["tete", "yeux", "cou", "couleur"]) if (a.porte && ids.has(a.porte[t])) porte[t] = a.porte[t];
    return {
      ecrous: n(a.ecrous), total: n(a.total), corrigees: n(a.corrigees), serie: n(a.serie), serieMax: n(a.serieMax), gainsSemaine: n(a.gainsSemaine), visites: n(a.visites),
      dernierJour: /^\d{4}-\d\d-\d\d$/.test(a.dernierJour) ? a.dernierJour : "", semaineGains: /^\d{4}-\d\d-\d\d$/.test(a.semaineGains) ? a.semaineGains : "",
      serieRythme: typeof a.serieRythme === "string" ? a.serieRythme.slice(0, 20) : "",
      demarre: !!a.demarre,
      achats: map(a.achats, (k) => ids.has(k), (v) => String(v).slice(0, 10)),
      places: map(a.places, (k) => ids.has(k), () => true),
      medailles: map(a.medailles, (k) => medIds.has(k), (v) => String(v).slice(0, 10)),
      porte,
    };
  },

  /* ---------- la remise de médaille : en grand, une par une, dite par Boulon au CP ---------- */
  ceremonie() {
    if (this._enCeremonie || !this._medailles.length || !document.body) return;
    /* Boulon finit d'abord sa phrase (« Tu as gagné 37 écrous ! ») : rien ne le coupe ; une autre fenêtre
       (le bonus de la visite, la fiche d'un objet…) se ferme d'abord */
    if (Voice.protegee() || document.querySelector(".modal-back")) { clearTimeout(this._attenteCeremonie); this._attenteCeremonie = setTimeout(() => this.ceremonie(), 400); return; }
    const m = this._medailles.shift();
    this._enCeremonie = true;
    const texte = `Nouvelle médaille : ${m.nom} ! Tu as réussi le défi : ${m.desc} Tu gagnes ${this.BONUS_MEDAILLE} écrous.`;
    let close;
    close = App.modal(h("div", { class: "av-ceremonie" },
      h("div", { class: "title dark av-ceremonie-titre" }, "🎉 Nouvelle médaille !"),
      h("div", { class: "av-ceremonie-medaille" }, icone(m.icone)),
      h("h2", { class: "title dark" }, m.nom),
      h("p", null, "✔ " + m.desc),
      h("span", { class: "av-ceremonie-plus" }, `🔩 +${this.BONUS_MEDAILLE} écrous`),
      h("p", { class: "av-ceremonie-aide" }, "Toutes tes médailles sont dans le coffre aux trésors."),
      h("div", { class: "row" },
        h("button", { class: "btn sky", onclick: () => Voice.speak(texte) }, "🔊 Réécouter"),
        h("button", { class: "btn green", onclick: () => close() }, "Super !"))),
      { onClose: () => { this._enCeremonie = false; if (this._medailles.length) setTimeout(() => this.ceremonie(), 350); } });
    Sound.fanfare(); App.confetti(60);
    if (NIVEAU.toutEnVoix) setTimeout(() => Voice.speak(texte), 400);
  },

  /* ---------- petits messages en haut de l'écran ---------- */
  afficher() {
    if (!this._file.length) { if (this._medailles.length) this.ceremonie(); return; }
    let zone = document.getElementById("toasts");
    if (!zone) { zone = h("div", { id: "toasts", "aria-live": "polite" }); document.body.appendChild(zone); }
    /* les gains d'écrous d'un même moment forment un seul message */
    const file = this._file.splice(0), gains = file.filter((m) => m.n);
    const msgs = file.filter((m) => !m.n);
    if (gains.length) {
      const n = gains.reduce((s, m) => s + m.n, 0);
      const raisons = [...new Set(gains.map((m) => m.raison))];
      msgs.unshift({ txt: `🔩 +${n} écrou${n > 1 ? "s" : ""} — ${raisons.slice(0, 2).join(", ")}${raisons.length > 2 ? "…" : ""}` });
    }
    if (this._medailles.length) setTimeout(() => this.ceremonie(), 600);
    msgs.slice(0, 5).forEach((m, i) => setTimeout(() => {
      const t = h("div", { class: "toast" + (m.grand ? " grand" : "") }, m.ic ? icone(m.ic) : null, m.txt);
      zone.appendChild(t);
      if (m.grand) Sound.fanfare(); else Sound.pop();
      setTimeout(() => t.classList.add("out"), 3600);
      setTimeout(() => t.remove(), 4200);
    }, 700 + i * 650));
  },
};

/* ================================================================== */
/* Écran : le coffre aux trésors                                       */
/* ================================================================== */
App.register("aventure", (root, params) => {
  const u = Store.user; if (!u) return App.go("identif");
  Aventure.demarrer(u); Aventure.journee(u); Aventure.conclure(u);
  const a = Aventure.etat(u);
  const onglet = params.onglet || "boutique";
  App.backdrop(root);
  root.appendChild(h("div", { class: "screen-header" }, h("h2", { class: "title" }, "🧰 Le coffre aux trésors")));

  /* colonne de gauche : Boulon, rang, écrous */
  const r = Aventure.rang(a.total);
  const gauche = h("div", { class: "panel abs av-gauche" });
  const boulon = h("div", { class: "av-boulon", html: Art.boulon() });
  const prog = r.suivant ? Math.round(((a.total - r.min) / (r.suivant.min - r.min)) * 100) : 100;
  gauche.append(boulon,
    h("div", { class: "av-rang" }, h("span", { class: "av-rang-ic" }, r.icone), h("div", null, h("small", null, "Rang"), h("b", null, r.nom))),
    h("div", { class: "av-barre", title: `${a.total} écrous gagnés en tout` }, h("i", { style: { width: prog + "%" } })),
    h("p", { class: "av-suivant" }, r.suivant ? `Encore ${r.suivant.min - a.total} 🔩 pour devenir ${r.suivant.nom}` : "Tu as atteint le plus haut rang !"),
    h("div", { class: "av-ecrous" }, h("span", null, "🔩"), h("b", null, String(a.ecrous)), h("small", null, "écrou" + (a.ecrous > 1 ? "s" : "") + " à dépenser")),
    h("p", { class: "av-serie" }, a.serie > 1 ? `🔥 ${Aventure.serieTexte(a.serie)} de suite` : `📅 Reviens ${Aventure.prochainRdv()} pour une série !`));
  root.appendChild(gauche);

  /* panneau de droite : boutique ou médailles */
  const droite = h("div", { class: "panel abs av-droite" });
  const nbMed = Object.keys(a.medailles).length;
  droite.appendChild(h("div", { class: "tabs av-tabs" },
    h("div", { class: "tab math" + (onglet === "boutique" ? " on" : ""), role: "button", tabindex: "0", onclick: () => { Sound.click(); recharger(); } }, "🛍️ La boutique"),
    h("div", { class: "tab fr" + (onglet === "medailles" ? " on" : ""), role: "button", tabindex: "0", onclick: () => { Sound.click(); App.go("aventure", { onglet: "medailles" }); } }, `🏅 Médailles ${nbMed}/${AVENTURE_MEDAILLES.length}`)));
  root.appendChild(droite);
  const contenu = h("div", { class: "av-contenu" });
  droite.appendChild(contenu);
  /* réaffiche l'écran après un achat, sans perdre la position dans la liste */
  const recharger = () => App.go("aventure", { onglet: "boutique", scroll: contenu.scrollTop });

  if (onglet === "medailles") {
    const grille = h("div", { class: "av-grille med" });
    AVENTURE_MEDAILLES.forEach((m) => {
      const date = a.medailles[m.id];
      const carte = h("div", { class: "av-carte medaille" + (date ? " gagnee" : "") },
        h("div", { class: "av-med-ic" }, date ? icone(m.icone) : "🔒"), h("b", null, m.nom), h("small", null, m.desc),
        date ? h("em", null, "Gagnée " + Revision.dateFr(date).replace(/^le /, "le ")) : null);
      if (NIVEAU.toutEnVoix) carte.addEventListener("mouseenter", () => Voice.survol(`${m.nom}. ${m.desc}` + (date ? " Tu l'as gagnée !" : "")));
      grille.appendChild(carte);
    });
    contenu.appendChild(grille);
  } else {
    const sections = [["decor", "🏠 Décorer l'atelier"], ["habits", "🎩 Habiller Boulon"], ["couleur", "🎨 Repeindre Boulon"]];
    const grilles = {};
    sections.forEach(([k, titre]) => { contenu.appendChild(h("h3", { class: "av-titre" }, titre)); grilles[k] = h("div", { class: "av-grille" }); contenu.appendChild(grilles[k]); });
    const orange = { id: "orange", type: "couleur", nom: "Boulon orange", prix: 0 };
    [orange, ...AVENTURE_BOUTIQUE].forEach((it) => {
      const k = it.type === "decor" ? "decor" : it.type === "couleur" ? "couleur" : "habits";
      const possede = Aventure.possede(u, it), utilise = Aventure.utilise(u, it);
      const carte = h("div", { class: "av-carte" + (possede ? " possede" : "") + (utilise ? " utilise" : ""), title: "Voir ce que fait cet objet" },
        h("div", { class: "av-vignette", html: Aventure.vignette(it) }), h("b", null, it.nom),
        it.type === "decor" && typeof DECORS_ACTIFS !== "undefined" && DECORS_ACTIFS[it.id] ? h("small", { class: "av-effet" }, DECORS_ACTIFS[it.id].effet) : null);
      /* tout en voix (CP) : le nom, le prix ou ce que fait l'objet, au survol */
      if (NIVEAU.toutEnVoix) carte.addEventListener("mouseenter", () => {
        const act = it.type === "decor" && typeof DECORS_ACTIFS !== "undefined" && DECORS_ACTIFS[it.id];
        const piece = it.type === "decor" && Pieces.de(it.id, "decors");
        Voice.survol(it.nom + (possede ? "." : `, ${it.prix} écrous.`) + (act ? " " + act.effet : "") + (piece ? ` Il va ${piece.dans}.` : ""));
      });
      let btn;
      if (!possede) {
        const manque = it.prix - a.ecrous;
        btn = h("button", { class: "btn small " + (manque > 0 ? "white" : "green"), title: manque > 0 ? `Il te manque ${manque} écrous` : "Acheter",
          onclick: (e) => { e.stopPropagation(); Sound.click(); Aventure.fiche(u, it, recharger); } }, `🔩 ${it.prix}`);
        if (manque > 0) carte.appendChild(h("small", { class: "av-manque" }, `il manque ${manque}`));
      } else if (it.type === "decor") {
        btn = h("button", { class: "btn small " + (utilise ? "sky" : "white"), onclick: () => { Sound.click(); Aventure.utiliser(u, it, !utilise); recharger(); } },
          utilise ? "✓ Placé" : "Placer");
      } else if (it.type === "couleur") {
        btn = h("button", { class: "btn small " + (utilise ? "sky" : "white"), disabled: utilise, onclick: () => { Sound.click(); Aventure.utiliser(u, it, true); recharger(); } },
          utilise ? "✓ Choisie" : "Choisir");
      } else {
        btn = h("button", { class: "btn small " + (utilise ? "sky" : "white"), onclick: () => { Sound.click(); Aventure.utiliser(u, it, !utilise); recharger(); } },
          utilise ? "✓ Porté" : "Porter");
      }
      carte.appendChild(btn);
      /* un clic sur l'objet (pas sur son bouton) ouvre sa fiche */
      carte.addEventListener("click", (e) => { if (e.target.closest("button")) return; Sound.click(); Aventure.fiche(u, it, recharger); });
      grilles[k].appendChild(carte);
    });
  }

  if (params.scroll) contenu.scrollTop = params.scroll;
  /* tout en voix (CP) : les onglets, le rang et les écrous se disent au survol */
  if (NIVEAU.toutEnVoix) {
    const dire = (el, txt) => el && el.addEventListener("mouseenter", () => Voice.survol(txt));
    const [tBoutique, tMedailles] = droite.querySelectorAll(".av-tabs .tab");
    dire(tBoutique, "La boutique : achète des objets avec tes écrous.");
    dire(tMedailles, `Tes médailles : tu en as ${nbMed} sur ${AVENTURE_MEDAILLES.length}.`);
    dire(gauche.querySelector(".av-rang"), `Ton rang : ${r.nom}.`);
    dire(gauche.querySelector(".av-ecrous"), `Tu as ${a.ecrous} écrou${a.ecrous > 1 ? "s" : ""} à dépenser.`);
  }
  App.backButton(root, "atelier");
  if (!params.onglet) setTimeout(() => Voice.speak("Bienvenue dans mon coffre aux trésors ! Gagne des écrous en travaillant, puis décore l'atelier et habille-moi !"), 300);
});
