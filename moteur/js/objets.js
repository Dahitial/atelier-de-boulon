/* L'Atelier de Boulon — les objets achetés servent à quelque chose.
   Chaque décor de la boutique fait quelque chose quand on clique dessus dans l'atelier,
   et certains se voient aussi sur la maison, dehors (MAISON_DEHORS).

   - guirlande : c'est la fête (une fête du Maroc)
   - cactus, plante, affiche, chat : « Le savais-tu ? », avec une question par jour (+2 écrous)
   - tableau : le défi du jour, une question tirée des leçons (+3 écrous, une fois par jour)
   - tapis : l'atelier des couleurs ; chaque nouveau mélange ajoute une couleur au chevalet

   Un niveau ou un module peut ajouter ou remplacer une action :
     Object.assign(DECORS_ACTIFS, { chat: { label, desc, effet, agir(u, m) { … } } }) */
"use strict";

/* ------------------------------------------------------------------ */
/* État de l'élève : u.objets = { jour: { cle: "AAAA-MM-JJ" }, couleurs: { id: "AAAA-MM-JJ" } } */
/* ------------------------------------------------------------------ */
const Objets = {
  etat(u) {
    if (!u.objets || typeof u.objets !== "object" || Array.isArray(u.objets)) u.objets = {};
    const o = u.objets;
    for (const k of ["jour", "couleurs"]) if (!o[k] || typeof o[k] !== "object" || Array.isArray(o[k])) o[k] = {};
    return o;
  },
  faitAujourdhui(u, cle) { return this.etat(u).jour[cle] === Revision.jour(0); },
  marquer(u, cle) { this.etat(u).jour[cle] = Revision.jour(0); Store.save(); },
  /* numéro du jour : la même question toute la journée, une autre le lendemain */
  numeroDuJour() { return Math.floor(Date.parse(Revision.jour(0) + "T12:00:00") / 864e5); },
  /* clic sur un décor de l'atelier */
  agir(id, m) {
    const u = Store.user, d = DECORS_ACTIFS[id];
    if (!u || !d) return;
    if (d.agir) d.agir(u, m);
    else if (d.savais) Objets.savais(u, id, d);
  },
  nettoyer(o) {
    if (!o || typeof o !== "object") return undefined;
    const date = (v) => (/^\d{4}-\d\d-\d\d$/.test(v) ? v : null);
    const map = (x, ok) => Object.fromEntries(Object.entries(x && typeof x === "object" ? x : {}).filter(([k, v]) => ok(k) && date(v)));
    return { jour: map(o.jour, (k) => /^[a-z0-9-]{1,24}$/.test(k)), couleurs: map(o.couleurs, (k) => !!COULEURS_MELANGES.find((c) => c.id === k)) };
  },

  /* ---------- « Le savais-tu ? » ---------- */
  savais(u, id, d) {
    const n = this.numeroDuJour(), f = d.savais[n % d.savais.length];
    const deja = this.faitAujourdhui(u, id);
    const item = AVENTURE_BOUTIQUE.find((it) => it.id === id);
    const zone = h("div", { class: "savais-reponses" });
    const fin = h("p", { class: "savais-fin" });
    const node = h("div", { class: "col savais" },
      h("div", { class: "savais-tete" },
        item ? h("div", { class: "savais-vignette", html: Aventure.vignette(item) }) : null,
        h("h2", { class: "title dark" }, "Le savais-tu ?")),
      d.anim ? h("div", { class: "savais-anim", html: d.anim() }) : null,
      h("p", { class: "savais-texte" }, f.texte),
      deja ? null : h("p", { class: "savais-question" }, f.question),
      deja ? null : zone, fin,
      h("div", { class: "row", style: { justifyContent: "flex-end" } }, h("button", { class: "btn white", onclick: () => close() }, "Fermer")));
    let close = App.modal(node, { onClose: () => Voice.stop && Voice.stop() });
    if (deja) {
      fin.textContent = "Tu as déjà répondu à la question d'aujourd'hui. Reviens demain pour en découvrir une autre !";
      Voice.speak(f.texte + " " + fin.textContent);
      return;
    }
    const choix = shuffle([f.bonne, ...f.mauvaises]);
    const btns = choix.map((c) => {
      const b = h("button", { class: "choice", type: "button" }, c);
      if (NIVEAU.toutEnVoix) b.addEventListener("mouseenter", () => Voice.speak(c));
      b.addEventListener("click", () => repondre(c, b));
      return b;
    });
    zone.append(...btns);
    Voice.speak(f.texte + " " + f.question);
    const repondre = (c, b) => {
      btns.forEach((x) => { x.disabled = true; if (x.textContent === f.bonne) x.classList.add("right"); });
      this.marquer(u, id);
      if (c === f.bonne) {
        Sound.good();
        fin.textContent = "Bravo, c'est juste ! Reviens demain pour une nouvelle question.";
        Aventure.gagner(u, 2, "le savais-tu ?");
        Aventure.conclure(u);
      } else {
        Sound.bad(); b.classList.add("wrong");
        fin.textContent = `Non, c'était : ${f.bonne}. Reviens demain pour une nouvelle question !`;
      }
      Voice.speak(fin.textContent);
    };
  },

  /* ---------- le défi du jour (tableau noir) ---------- */
  defiDuJour(u, m) {
    if (this.faitAujourdhui(u, "tableau")) {
      Sound.pop();
      m.say("Tu as déjà relevé le défi du jour sur le tableau noir. Reviens demain pour un nouveau défi !");
      return;
    }
    /* une question d'une leçon déjà travaillée (sinon de la toute première leçon) */
    const faites = Object.keys(u.lessons || {}).filter((id) => LESSONS[id]);
    const premiere = Object.values(CONTENT)[0].chapters[0].lessons[0].id;
    const l = LESSONS[faites.length ? pick(faites) : premiere];
    let q;
    try { q = pick(l.bank()); } catch (e) { q = null; }
    if (!q) return;
    const corps = h("div", { class: "exo-body" });
    const fin = h("p", { class: "savais-fin" });
    const actions = h("div", { class: "row", style: { justifyContent: "flex-end" } });
    const parler = h("button", { class: "btn round sky speak", title: "Écouter la consigne", "aria-label": "Écouter la consigne", onclick: () => Voice.speak(q.consigne) }, "🔊");
    const node = h("div", { class: "col defi-jour" },
      h("h2", { class: "title dark" }, "Le défi du jour"),
      h("p", { class: "muted", style: { margin: 0 } }, `Une question de « ${l.title} ». Tu as un seul essai !`),
      h("div", { class: "consigne" }, parler, h("span", null, q.consigne)),
      corps, fin, actions);
    const close = App.modal(node);
    let fini = false;
    const valider = () => {
      if (fini || !ctrl) return;
      const res = ctrl.validate();
      if (res.empty) { fin.textContent = res.msg || "Réponds d'abord !"; return; }
      fini = true;
      ctrl.lock && ctrl.lock();
      this.marquer(u, "tableau");
      if (res.ok) {
        Sound.good(); App.confetti(40);
        fin.textContent = "Défi réussi ! Reviens demain pour un nouveau défi.";
        Aventure.gagner(u, 3, "défi du jour");
        Aventure.conclure(u);
      } else {
        Sound.bad(); ctrl.reveal();
        fin.textContent = "Raté pour aujourd'hui… Regarde la bonne réponse, et retente ta chance demain !";
      }
      Voice.speak(fin.textContent);
      actions.innerHTML = "";
      actions.appendChild(h("button", { class: "btn green", onclick: () => close() }, "Fermer"));
    };
    const ctrl = Exercise.mount(corps, q, { submit: valider });
    if (ctrl && ctrl.needsValidate) actions.appendChild(h("button", { class: "btn green", onclick: valider }, "✔ Valider"));
    actions.appendChild(h("button", { class: "btn white", onclick: () => close() }, "Plus tard"));
    if (q.type !== "dictee" && !(ctrl && ctrl.voixPropre)) Voice.speak(q.consigne);
  },
};

/* ------------------------------------------------------------------ */
/* Les fêtes du Maroc (guirlande)                                      */
/* ------------------------------------------------------------------ */
const FETES_MAROC = [
  "Le 14 janvier, c'est Yennayer, le Nouvel An amazigh.",
  "Le 11 janvier, on fête le Manifeste de l'Indépendance du Maroc.",
  "Le 30 juillet, c'est la Fête du Trône : tout le Maroc fait la fête !",
  "Le 6 novembre, on se souvient de la Marche verte.",
  "Le 18 novembre, c'est la Fête de l'Indépendance du Maroc.",
  "À l'Aïd el-Fitr, on fête la fin du Ramadan, avec des gâteaux et des habits neufs.",
  "À l'Aïd el-Adha, les familles se réunissent pour un grand repas.",
  "À Achoura, les enfants reçoivent des jouets et jouent du tambourin.",
  "Le 1er mai, c'est la fête du Travail.",
];

/* ------------------------------------------------------------------ */
/* L'atelier des couleurs (tapis) : les mélanges                        */
/* ------------------------------------------------------------------ */
const COULEURS_BASE = [
  { id: "rouge", nom: "rouge", hex: "#e4572e" }, { id: "jaune", nom: "jaune", hex: "#f6c445" },
  { id: "bleu", nom: "bleu", hex: "#2e86de" }, { id: "blanc", nom: "blanc", hex: "#ffffff" }, { id: "noir", nom: "noir", hex: "#2b2236" },
];
/* nouveau : la couleur n'est pas encore dans le chevalet, on l'y ajoute quand on la trouve */
const COULEURS_MELANGES = [
  { id: "orange", a: "rouge", b: "jaune", nom: "orange", hex: "#f08a3c", nouveau: true },
  { id: "vert", a: "jaune", b: "bleu", nom: "vert", hex: "#7bc950" },
  { id: "violet", a: "rouge", b: "bleu", nom: "violet", hex: "#8e6cc9" },
  { id: "rose", a: "rouge", b: "blanc", nom: "rose", hex: "#ef7fa8" },
  { id: "ciel", a: "bleu", b: "blanc", nom: "bleu ciel", hex: "#5bc0eb" },
  { id: "gris", a: "noir", b: "blanc", nom: "gris", hex: "#9aa4b5", nouveau: true },
  { id: "creme", a: "jaune", b: "blanc", nom: "jaune pâle", hex: "#fff1a8", nouveau: true },
  { id: "bordeaux", a: "rouge", b: "noir", nom: "bordeaux", hex: "#8c2d3a", nouveau: true },
  { id: "nuit", a: "bleu", b: "noir", nom: "bleu nuit", hex: "#1f3a6b", nouveau: true },
  { id: "kaki", a: "jaune", b: "noir", nom: "kaki", hex: "#8a8a2e", nouveau: true },
];
/* couleurs gagnées par l'élève, à ajouter à la palette du chevalet */
function couleursTrouvees(u) {
  const o = u ? Objets.etat(u).couleurs : {};
  return COULEURS_MELANGES.filter((c) => c.nouveau && o[c.id]).map((c) => c.hex);
}

App.register("couleurs", (root) => {
  const u = Store.user; if (!u) return App.go("identif");
  const o = Objets.etat(u);
  App.backdrop(root);
  root.appendChild(h("div", { class: "screen-header" }, h("h2", { class: "title" }, "🎨 L'atelier des couleurs")));
  let choix = [];
  const pots = h("div", { class: "coul-pots" });
  const bol = h("div", { class: "coul-bol", "aria-live": "polite" });
  const message = h("p", { class: "coul-message" }, "Choisis deux pots de peinture pour les mélanger.");
  const trouvees = h("div", { class: "coul-trouvees" });
  const dessinePot = (c) => `<svg viewBox="0 0 80 90" aria-hidden="true"><g stroke="${INK}" stroke-width="3" stroke-linejoin="round">
      <path d="M10 26 h60 l-6 58 h-48 z" fill="#d8dde6"/><ellipse cx="40" cy="26" rx="30" ry="9" fill="${c.hex}"/>
      <path d="M22 28 q-2 16 6 20" fill="none" stroke="${c.hex}" stroke-width="7" stroke-linecap="round"/></g></svg>`;
  const nomBol = (hex) => `<svg viewBox="0 0 160 110" aria-hidden="true"><g stroke="${INK}" stroke-width="3" stroke-linejoin="round">
      <path d="M10 40 h140 q-8 62 -70 62 q-62 0 -70 -62 z" fill="#fff8ea"/><ellipse cx="80" cy="40" rx="70" ry="14" fill="${hex || "#fff8ea"}"/></g></svg>`;
  const majTrouvees = () => {
    trouvees.innerHTML = "";
    trouvees.appendChild(h("b", null, "Mes mélanges : "));
    COULEURS_MELANGES.forEach((c) => trouvees.appendChild(h("span", { class: "coul-pastille" + (o.couleurs[c.id] ? "" : " vide"), title: o.couleurs[c.id] ? c.nom : "à trouver",
      style: { background: o.couleurs[c.id] ? c.hex : "transparent" } })));
  };
  const melanger = () => {
    const [a, b] = choix;
    let res;
    if (a === b) res = { nom: COULEURS_BASE.find((c) => c.id === a).nom, hex: COULEURS_BASE.find((c) => c.id === a).hex, meme: true };
    else res = COULEURS_MELANGES.find((c) => (c.a === a && c.b === b) || (c.a === b && c.b === a));
    bol.innerHTML = nomBol(res.hex);
    const na = COULEURS_BASE.find((c) => c.id === a).nom, nb = COULEURS_BASE.find((c) => c.id === b).nom;
    const du = (nom) => (/^[aeiouyàâéèêô]/i.test(nom) ? "de l'" : "du ") + nom;   // du vert, de l'orange
    let txt;
    if (res.meme) txt = `Du ${na} avec du ${nb}… ça reste du ${na} !`;
    else {
      const nouveau = !o.couleurs[res.id];
      txt = `${na.charAt(0).toUpperCase() + na.slice(1)} et ${nb}, ça donne ${du(res.nom)} !`;
      if (nouveau) {
        o.couleurs[res.id] = Revision.jour(0);
        Sound.good();
        if (res.nouveau) { txt += " C'est une nouvelle couleur pour ton chevalet !"; App.confetti(30); }
        else txt += " Cette couleur est déjà dans ton chevalet.";
        Aventure.gagner(u, 2, "nouveau mélange");
        Aventure.conclure(u);
        majTrouvees();
      } else Sound.pop();
    }
    message.textContent = txt;
    Voice.speak(txt);
    choix = [];
    pots.querySelectorAll(".coul-pot").forEach((p) => p.classList.remove("sel"));
  };
  COULEURS_BASE.forEach((c) => {
    const p = h("button", { class: "coul-pot", type: "button", "aria-label": "Peinture " + c.nom, html: dessinePot(c) });
    p.appendChild(h("span", null, c.nom));
    p.addEventListener("mouseenter", () => { if (NIVEAU.toutEnVoix) Voice.speak(c.nom); });
    p.addEventListener("click", () => {
      if (choix.length >= 2) return;
      Sound.pop(); choix.push(c.id); p.classList.add("sel");
      bol.innerHTML = nomBol(choix.length === 1 ? c.hex : null);
      if (choix.length === 2) setTimeout(melanger, 350);
    });
    pots.appendChild(p);
  });
  bol.innerHTML = nomBol(null);
  majTrouvees();
  root.appendChild(h("div", { class: "panel abs coul-panel" }, pots, h("div", { class: "coul-centre" }, bol, message), trouvees));
  App.backButton(root, "atelier");
  setTimeout(() => Voice.speak("Bienvenue dans l'atelier des couleurs ! Mélange deux peintures pour découvrir de nouvelles couleurs. Les nouvelles iront dans ton chevalet."), 300);
});

/* ------------------------------------------------------------------ */
/* Ce que fait chaque décor                                            */
/* ------------------------------------------------------------------ */
const DECORS_ACTIFS = {
  guirlande: {
    label: "La guirlande", desc: "C'est la fête ! Boulon te présente une fête du Maroc.", effet: "Clique dessus : c'est la fête ! Elle se voit aussi sur la maison.",
    agir(u, m) {
      Sound.fanfare(); App.confetti(90);
      m.say("C'est la fête ! " + FETES_MAROC[(Objets.numeroDuJour() + rand(0, 99)) % FETES_MAROC.length]);
    },
  },
  cactus: {
    label: "Le cactus", desc: "Le savais-tu ? Les plantes du désert.", effet: "Clique dessus : « Le savais-tu ? » sur le désert. Il se voit à la fenêtre.",
    savais: [
      { texte: "Le cactus garde l'eau dans sa tige, comme une gourde. Il peut rester des mois sans pluie.", question: "Où le cactus garde-t-il son eau ?", bonne: "dans sa tige", mauvaises: ["dans ses épines", "dans ses fleurs"] },
      { texte: "Les épines du cactus sont des feuilles très fines : elles perdent peu d'eau et protègent la plante des animaux.", question: "Les épines du cactus sont…", bonne: "des feuilles très fines", mauvaises: ["des racines", "des fruits"] },
      { texte: "Le palmier dattier pousse dans les oasis du sud du Maroc. Ses fruits sont les dattes.", question: "Quel fruit donne le palmier dattier ?", bonne: "la datte", mauvaises: ["l'orange", "la pomme"] },
      { texte: "Les racines de certaines plantes du désert vont très loin sous le sable pour trouver de l'eau.", question: "Pourquoi ces racines vont-elles si loin ?", bonne: "pour trouver de l'eau", mauvaises: ["pour se cacher", "pour avoir chaud"] },
      { texte: "Dans le désert, il fait très chaud le jour, mais il peut faire froid la nuit.", question: "La nuit, dans le désert, il peut faire…", bonne: "froid", mauvaises: ["encore plus chaud", "toujours jour"] },
      { texte: "Le dromadaire a une seule bosse. Il peut marcher plusieurs jours dans le désert sans boire.", question: "Combien de bosses a le dromadaire ?", bonne: "une", mauvaises: ["deux", "trois"] },
    ],
  },
  plante: {
    label: "La grande plante", desc: "Le savais-tu ? Comment vit une plante.", effet: "Clique dessus : la plante t'explique comment elle vit. Elle se voit à la fenêtre.",
    anim: () => `<svg viewBox="0 0 300 150" aria-hidden="true"><g stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
      <circle cx="40" cy="36" r="22" fill="#ffd84a"/><path class="rayon" d="M66 48 L130 78" stroke="#f6b100" stroke-width="5" stroke-dasharray="8 8"/>
      <path d="M150 140 v-70" stroke="#3f8a2e" stroke-width="6"/>
      <path d="M150 90 q-40 -10 -50 14 q30 10 50 -14 z M150 74 q40 -14 52 8 q-30 14 -52 -8 z" fill="#7bc950"/>
      <circle class="bulle" cx="200" cy="60" r="7" fill="#e8f6ff"/><circle class="bulle b2" cx="214" cy="42" r="5" fill="#e8f6ff"/>
      <path class="goutte" d="M150 132 q-5 6 -5 9 a5 4 0 0 0 10 0 q0 -3 -5 -9 z" fill="#5bc0eb"/>
      <rect x="110" y="138" width="80" height="12" rx="4" fill="#a86a2c"/></g>
      <g font-family="Trebuchet MS, sans-serif" font-size="13" font-weight="700" fill="${INK}"><text x="10" y="80">lumière</text><text x="226" y="54">oxygène</text><text x="164" y="132">eau</text></g></svg>`,
    savais: [
      { texte: "Les feuilles fabriquent la nourriture de la plante avec la lumière du soleil, l'eau et l'air.", question: "De quoi la plante a-t-elle besoin pour fabriquer sa nourriture ?", bonne: "de lumière, d'eau et d'air", mauvaises: ["de sucre et de lait", "de musique"] },
      { texte: "Les plantes rejettent de l'oxygène : c'est une partie de l'air que nous respirons.", question: "Que rejettent les plantes ?", bonne: "de l'oxygène", mauvaises: ["de la fumée", "du sable"] },
      { texte: "Une plante se tourne vers la lumière. Près d'une fenêtre, ses feuilles se tournent vers le soleil.", question: "Vers quoi la plante se tourne-t-elle ?", bonne: "vers la lumière", mauvaises: ["vers le mur", "vers le sol"] },
      { texte: "Les racines tiennent la plante dans la terre et boivent l'eau du sol.", question: "À quoi servent les racines ?", bonne: "à boire l'eau et tenir la plante", mauvaises: ["à faire des fleurs", "à voir"] },
      { texte: "Sans lumière, une plante devient pâle et jaune, puis elle meurt.", question: "Une plante gardée dans le noir devient…", bonne: "pâle et jaune", mauvaises: ["plus verte", "bleue"] },
      { texte: "Trop d'eau fait pourrir les racines : il faut arroser juste ce qu'il faut.", question: "Que se passe-t-il avec trop d'eau ?", bonne: "les racines pourrissent", mauvaises: ["la plante s'envole", "rien du tout"] },
    ],
  },
  affiche: {
    label: "L'affiche de fusée", desc: "Le savais-tu ? L'espace et les fusées.", effet: "Clique dessus : « Le savais-tu ? » sur l'espace.",
    savais: [
      { texte: "La Terre fait le tour du Soleil en un an.", question: "Combien de temps met la Terre pour faire le tour du Soleil ?", bonne: "un an", mauvaises: ["un jour", "une heure"] },
      { texte: "La Lune tourne autour de la Terre. Sa forme semble changer pendant le mois.", question: "Autour de quoi tourne la Lune ?", bonne: "autour de la Terre", mauvaises: ["autour de Mars", "elle ne bouge pas"] },
      { texte: "En 1969, des astronautes ont marché sur la Lune pour la première fois.", question: "Qui a marché sur la Lune en 1969 ?", bonne: "des astronautes", mauvaises: ["des chats", "personne"] },
      { texte: "Pour tourner autour de la Terre, une fusée doit aller très vite : environ 28 000 kilomètres par heure !", question: "Pour quitter le sol et tourner autour de la Terre, une fusée va…", bonne: "très, très vite", mauvaises: ["au pas", "en reculant"] },
      { texte: "Le Soleil est une étoile. Il est si grand qu'on pourrait y ranger plus d'un million de Terres.", question: "Le Soleil est…", bonne: "une étoile", mauvaises: ["une planète", "un nuage"] },
      { texte: "Il y a huit planètes autour du Soleil. Mars est appelée la planète rouge.", question: "Quelle planète est appelée la planète rouge ?", bonne: "Mars", mauvaises: ["la Terre", "Jupiter"] },
    ],
  },
  tableau: {
    label: "Le tableau noir", desc: "Le défi du jour : une question, un seul essai.", effet: "Clique dessus : le défi du jour, une question par jour.",
    agir(u, m) { Objets.defiDuJour(u, m); },
  },
  tapis: {
    label: "Le tapis arc-en-ciel", desc: "L'atelier des couleurs : mélange les peintures.", effet: "Clique dessus : l'atelier des couleurs. Les mélanges vont dans le chevalet.",
    agir() { Sound.click(); App.go("couleurs"); },
  },
  chat: {
    label: "Rivet, le chat robot", desc: "Miaou-bip ! Rivet te parle des robots.", effet: "Clique dessus : Rivet te parle des robots. Il se voit à la fenêtre.",
    savais: [
      { texte: "Miaou-bip ! Un robot est une machine qui suit un programme : une liste d'ordres écrits par des humains.", question: "Qui écrit le programme d'un robot ?", bonne: "des humains", mauvaises: ["le robot tout seul", "un chat"] },
      { texte: "Miaou-bip ! Un robot a des capteurs pour sentir ce qui l'entoure, comme nos yeux et nos oreilles.", question: "À quoi servent les capteurs d'un robot ?", bonne: "à sentir ce qui l'entoure", mauvaises: ["à dormir", "à manger"] },
      { texte: "Miaou-bip ! Des robots roulent sur la planète Mars pour l'explorer.", question: "Où des robots se promènent-ils, loin de la Terre ?", bonne: "sur Mars", mauvaises: ["sur le Soleil", "dans un nuage"] },
      { texte: "Miaou-bip ! Un aspirateur robot nettoie la maison tout seul, en suivant son programme.", question: "Que fait un aspirateur robot ?", bonne: "il nettoie la maison", mauvaises: ["il fait la cuisine", "il chante"] },
      { texte: "Miaou-bip ! Un robot fait exactement ce qu'on lui demande, même une erreur.", question: "Si on donne un mauvais ordre à un robot…", bonne: "il fait l'erreur", mauvaises: ["il la corrige tout seul", "il se fâche"] },
      { texte: "Miaou-bip ! Ce sont des moteurs qui font bouger un robot : ce sont ses muscles.", question: "Qu'est-ce qui fait bouger un robot ?", bonne: "des moteurs", mauvaises: ["des plumes", "du jus d'orange"] },
    ],
  },
};

/* ------------------------------------------------------------------ */
/* La maison vue de dehors : ce qui s'y voit quand on l'a acheté        */
/* MAISON_DEHORS[id](u) pour un objet de la boutique placé ;            */
/* MAISON_AJOUTS : d'autres dessins (u) => svg (la jardinière, l'arbre…) */
/* ------------------------------------------------------------------ */
const MAISON_AJOUTS = [];
const MAISON_DEHORS = {
  guirlande: () => `<g ${S}>
    <path d="M336 318 Q520 346 704 318" fill="none" stroke-width="2"/>
    <path d="M352 321 l20 3 l-12 20 z" fill="#e4572e"/><path d="M398 327 l20 2 l-11 21 z" fill="#f6c445"/>
    <path d="M446 331 l20 1 l-10 21 z" fill="#7bc950"/><path d="M494 333 l20 0 l-10 21 z" fill="#5bc0eb"/>
    <path d="M542 332 l20 -1 l-9 21 z" fill="#ef7fa8"/><path d="M590 329 l20 -2 l-8 21 z" fill="#8e6cc9"/>
    <path d="M638 325 l20 -3 l-8 20 z" fill="#f6c445"/></g>`,
  /* derrière la vitre de gauche */
  cactus: () => `<g ${S} stroke-width="2">
    <rect x="378" y="414" width="10" height="24" rx="5" fill="#5fb648"/><path d="M373 434 h20 l-3 12 h-14 z" fill="#e07a4a"/></g>`,
  /* derrière la vitre de droite */
  plante: () => `<g ${S} stroke-width="2">
    <path d="M600 430 q-14 -12 -10 -26 q8 10 10 26 z M600 430 q2 -18 10 -24 q2 14 -10 24 z" fill="#5fb648"/>
    <path d="M590 430 h22 l-3 16 h-16 z" fill="#2e86de"/></g>`,
  chat: () => `<g ${S} stroke-width="2.5">
    <path d="M640 446 v-26 l8 -12 l6 12 h12 l6 -12 l8 12 v26 z" fill="#9aa4b5"/>
    <circle cx="654" cy="430" r="5" fill="#7bc950" stroke-width="2"/><circle cx="672" cy="430" r="5" fill="#7bc950" stroke-width="2"/>
    <path d="M660 440 q3 3 6 0" fill="none" stroke-width="2"/></g>`,
};
