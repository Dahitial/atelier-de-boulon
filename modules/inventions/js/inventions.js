/* L'Atelier de Boulon — module « Les inventions » (CE2 et CP).
   Quatre thèmes : les transports, l'écriture, la communication, le calcul et les ordinateurs.
   Pour chacun : une frise d'étapes (7 au CE2, 4 au CP sans dates : « il y a très longtemps… »),
   la fiche de l'étape, un « avant / maintenant » avec un rideau, et un mini-défi (remettre la frise
   dans l'ordre). Les transports ont en plus la course Tanger → Marrakech.
   On y entre par le sablier de l'atelier : il propose la frise du temps (CE2) ou les leçons du
   temps (CP), et les inventions (écran « sablier »).
   État de l'élève : u.inventions = { vues: { idEtape: "AAAA-MM-JJ" }, defis: { theme: étoiles } } */
"use strict";

/* une étape : { id (image), nom, quand, texte, cp: { quand, texte } (présente au CP), ce2: false (seulement au CP) } */
const INVENTIONS = {
  transports: {
    nom: "Les transports", court: "Transports", couleur: "#2e86de",
    avant: "inv-charrette", maintenant: "inv-electrique",
    legende: "La charrette avançait au pas, en bois, tirée par un animal. La voiture électrique roule vite, avec une batterie, sans fumée.",
    etapes: [
      { id: "inv-pied", nom: "À pied", quand: "il y a très longtemps",
        texte: "Pendant très longtemps, on voyageait à pied : environ 30 km par jour, en portant tout sur son dos.",
        cp: { quand: "il y a très, très longtemps", texte: "Autrefois, on allait partout à pied." } },
      { id: "cheval", nom: "À cheval", quand: "il y a environ 5 000 ans",
        texte: "Les hommes apprennent à monter à cheval. Le cheval va plus vite qu'un marcheur et porte de lourdes charges." },
      { id: "inv-charrette", nom: "La roue et la charrette", quand: "il y a plus de 5 000 ans",
        texte: "La roue est inventée. Tirée par un âne, un bœuf ou un cheval, la charrette transporte beaucoup de choses.",
        cp: { quand: "il y a très longtemps", texte: "La charrette roule sur des roues en bois. Un animal la tire." } },
      { id: "inv-train", nom: "Le train à vapeur", quand: "vers 1825",
        texte: "Le feu fait bouillir l'eau, et la vapeur fait tourner les roues. Au Maroc, Al Boraq, le premier train à grande vitesse d'Afrique, roule depuis 2018.",
        cp: { quand: "il y a longtemps", texte: "Le train à vapeur fait de la fumée : tchou, tchou !" } },
      { id: "inv-auto", nom: "La voiture", quand: "1886",
        texte: "La première voiture à moteur roulait à 16 km/h : à peu près la vitesse d'un vélo !" },
      { id: "inv-biplan", nom: "L'avion", quand: "1903",
        texte: "Le premier avion à moteur vole pendant 12 secondes. Aujourd'hui, un avion fait le tour de la Terre en deux jours." },
      { id: "inv-electrique", nom: "La voiture électrique", quand: "aujourd'hui",
        texte: "Elle roule avec une batterie qu'on recharge à une borne, sans fumée.",
        cp: { quand: "aujourd'hui", texte: "La voiture électrique se recharge, comme un téléphone." } },
    ],
  },
  ecriture: {
    nom: "L'écriture", court: "Écriture", couleur: "#8e6cc9",
    avant: "inv-tablette", maintenant: "inv-ordi",
    legende: "On gravait des signes dans l'argile avec un roseau. Aujourd'hui, on tape sur un clavier, et on peut tout corriger.",
    etapes: [
      { id: "inv-grotte", nom: "Les dessins des grottes", quand: "il y a plus de 30 000 ans",
        texte: "Avant l'écriture, les hommes dessinaient des animaux sur les murs des grottes.",
        cp: { quand: "il y a très, très longtemps", texte: "Autrefois, on dessinait sur les murs des grottes." } },
      { id: "inv-tablette", nom: "Les premières écritures", quand: "vers −3300",
        texte: "En Mésopotamie, on écrit des signes en forme de clous sur des tablettes d'argile. En Égypte, on invente les hiéroglyphes.",
        cp: { quand: "il y a très longtemps", texte: "On écrivait des signes sur des tablettes d'argile." } },
      { id: "inv-alphabet", nom: "L'alphabet", quand: "vers −1000",
        texte: "Les Phéniciens inventent un alphabet : une lettre pour chaque son. Au Maroc, l'alphabet amazigh, le tifinagh, est lui aussi très ancien." },
      { id: "inv-papier", nom: "Le papier", quand: "vers l'an 105",
        texte: "Le papier est inventé en Chine. Il remplace peu à peu le papyrus et les peaux d'animaux." },
      { id: "plume", nom: "La plume et l'encre", quand: "il y a longtemps", ce2: false,
        cp: { quand: "il y a longtemps", texte: "Plus tard, on écrivait avec une plume trempée dans l'encre." } },
      { id: "inv-imprimerie", nom: "L'imprimerie", quand: "vers 1450",
        texte: "Gutenberg invente l'imprimerie : on fabrique des livres bien plus vite qu'en les recopiant à la main." },
      { id: "inv-machine", nom: "La machine à écrire", quand: "vers 1870",
        texte: "On tape sur des touches, et chaque lettre s'imprime sur la feuille." },
      { id: "inv-ordi", nom: "L'ordinateur", quand: "aujourd'hui",
        texte: "On écrit sur un clavier ou un écran : on peut corriger, copier et envoyer son texte.",
        cp: { quand: "aujourd'hui", texte: "Aujourd'hui, on écrit aussi sur un clavier." } },
    ],
  },
  communication: {
    nom: "La communication", court: "Communication", couleur: "#e4572e",
    avant: "inv-pigeon", maintenant: "inv-smartphone",
    legende: "Le pigeon voyageur mettait des heures à porter un petit message. Le téléphone portable l'envoie en une seconde, partout dans le monde.",
    etapes: [
      { id: "tambour", nom: "Les signaux", quand: "il y a très longtemps",
        texte: "Pour parler de loin, on frappait sur des tambours, on allumait des feux, on faisait de la fumée.",
        cp: { quand: "il y a très, très longtemps", texte: "Pour appeler de loin, on frappait sur un tambour." } },
      { id: "inv-pigeon", nom: "Le messager et le pigeon", quand: "il y a des milliers d'années",
        texte: "Un messager à pied ou à cheval portait les lettres. Le pigeon voyageur, lui, retrouve toujours sa maison.",
        cp: { quand: "il y a très longtemps", texte: "Le pigeon voyageur portait les messages." } },
      { id: "inv-telegraphe", nom: "Le télégraphe", quand: "vers 1840",
        texte: "Le message passe dans un fil électrique, avec le code Morse : des points et des traits." },
      { id: "inv-telephone", nom: "Le téléphone", quand: "1876",
        texte: "Graham Bell invente le téléphone : on entend la voix de quelqu'un qui est loin.",
        cp: { quand: "il y a longtemps", texte: "Le téléphone avait un fil et un cadran pour faire le numéro." } },
      { id: "inv-radio", nom: "La radio", quand: "vers 1900",
        texte: "Les ondes radio portent la voix et la musique très loin, sans fil." },
      { id: "inv-tele", nom: "La télévision", quand: "vers 1930",
        texte: "On voit chez soi des images qui bougent, envoyées de loin." },
      { id: "inv-smartphone", nom: "Le téléphone portable", quand: "aujourd'hui",
        texte: "Il tient dans la poche : on appelle, on envoie des messages et des photos dans le monde entier.",
        cp: { quand: "aujourd'hui", texte: "Le téléphone portable tient dans la poche." } },
    ],
  },
  ordinateurs: {
    nom: "Le calcul et les ordinateurs", court: "Ordinateurs", couleur: "#3fa34d",
    avant: "inv-boulier", maintenant: "inv-tactile",
    legende: "Sur le boulier, on fait glisser les boules une à une. La tablette fait des milliards de calculs à chaque seconde.",
    etapes: [
      { id: "cailloux", nom: "Les cailloux", quand: "il y a très longtemps",
        texte: "Pour compter ses moutons, le berger mettait un caillou par mouton. En latin, « calculus » veut dire petit caillou !",
        cp: { quand: "il y a très, très longtemps", texte: "On comptait avec des cailloux." } },
      { id: "inv-boulier", nom: "Le boulier", quand: "il y a plus de 2 000 ans",
        texte: "On compte en faisant glisser des boules. Certains s'en servent encore aujourd'hui !",
        cp: { quand: "il y a très longtemps", texte: "On comptait avec un boulier." } },
      { id: "inv-pascaline", nom: "La machine à calculer", quand: "1642",
        texte: "Le jeune Blaise Pascal invente une machine qui fait des additions avec des roues dentées." },
      { id: "inv-eniac", nom: "Le premier grand ordinateur", quand: "1946",
        texte: "L'ENIAC pèse environ 30 tonnes et remplit une grande salle. Pour l'époque, il calcule très vite.",
        cp: { quand: "il y a longtemps", texte: "Le premier ordinateur était grand comme une salle." } },
      { id: "inv-pc", nom: "L'ordinateur à la maison", quand: "vers 1980",
        texte: "Les ordinateurs deviennent petits : on peut en avoir un chez soi." },
      { id: "inv-web", nom: "Internet et le Web", quand: "vers 1990",
        texte: "Les ordinateurs du monde entier se relient : on partage des pages, des images et des messages." },
      { id: "inv-tactile", nom: "La tablette", quand: "aujourd'hui",
        texte: "Un ordinateur qu'on touche du doigt. Le téléphone portable aussi est un petit ordinateur.",
        cp: { quand: "aujourd'hui", texte: "Aujourd'hui, on touche l'écran avec le doigt." } },
    ],
  },
};
const INV_THEMES = Object.keys(INVENTIONS);

const Inventions = {
  cp() { return !!NIVEAU.toutEnVoix; },
  /* les étapes du thème pour ce niveau (le CP n'en garde que 4, avec ses textes à lui) */
  etapes(theme) {
    const t = INVENTIONS[theme];
    if (!this.cp()) return t.etapes.filter((e) => e.ce2 !== false);
    return t.etapes.filter((e) => e.cp).map((e) => ({ ...e, quand: e.cp.quand, texte: e.cp.texte }));
  },
  etat(u) {
    if (!u.inventions || typeof u.inventions !== "object") u.inventions = {};
    const e = u.inventions;
    if (!e.vues || typeof e.vues !== "object") e.vues = {};
    if (!e.defis || typeof e.defis !== "object") e.defis = {};
    return e;
  },
  nettoyer(o) {
    if (!o || typeof o !== "object") return undefined;
    const vues = Object.fromEntries(Object.entries(o.vues || {}).filter(([k]) => /^[a-z-]{2,20}$/.test(k)).map(([k, v]) => [k, String(v).slice(0, 10)]));
    const defis = Object.fromEntries(Object.entries(o.defis || {}).filter(([k]) => INV_THEMES.includes(k)).map(([k, v]) => [k, Math.max(0, Math.min(3, Number(v) || 0))]));
    return { vues, defis };
  },
};

/* un « tableau » 100 × 100 : l'image de l'étape sur un fond d'autrefois ou d'aujourd'hui */
/* « avant » à gauche, « maintenant » à droite : avec le rideau au milieu, on voit les deux */
function invScene(id, ancien, l, hh) {
  const ciel = ancien ? "#f6e3b5" : "#d9f1ff", sol = ancien ? "#d9a65e" : "#7d8796";
  const route = ancien ? "" : `<path d="M0 ${hh - 22} H${l}" stroke="#fff" stroke-width="4" stroke-dasharray="24 18"/>`;
  const t = hh * 0.8, cx = l * (ancien ? 0.26 : 0.74);
  return `<svg width="${l}" height="${hh}" viewBox="0 0 ${l} ${hh}" aria-hidden="true">
    <rect width="${l}" height="${hh}" fill="${ciel}"/><rect y="${hh - 44}" width="${l}" height="44" fill="${sol}"/>${route}
    <g transform="translate(${cx - t / 2} ${hh - 30 - t}) scale(${t / 100})">${PICTOS[id] || ""}</g></svg>`;
}

/* ------------------------------------------------------------------ */
/* L'écran des inventions                                              */
/* ------------------------------------------------------------------ */
App.register("inventions", (root, params) => {
  const u = Store.user; if (!u) return App.go("identif");
  const cp = Inventions.cp(), etat = Inventions.etat(u);
  const theme = INVENTIONS[params.theme] ? params.theme : "transports";
  const T = INVENTIONS[theme], etapes = Inventions.etapes(theme);
  root.classList.add("inv-ecran");
  root.style.setProperty("--inv", T.couleur);

  /* en-tête : le titre et les quatre thèmes (avec les étoiles du mini-défi) */
  const tete = h("div", { class: "abs inv-tete" },
    h("span", { class: "inv-sablier", html: Art.sablier() }), h("h2", { class: "title" }, "Les inventions"));
  const onglets = h("div", { class: "inv-onglets" });
  INV_THEMES.forEach((id) => {
    const et = etat.defis[id] || 0;
    const b = h("button", { class: "inv-onglet" + (id === theme ? " sel" : ""), type: "button", style: { "--c": INVENTIONS[id].couleur },
      onclick: () => { if (id !== theme) { Sound.click(); App.go("inventions", { theme: id }); } } },
      INVENTIONS[id].court, et ? h("span", { class: "inv-et", html: "★".repeat(et) }) : null);
    if (cp) b.addEventListener("mouseenter", () => Voice.speak(INVENTIONS[id].nom));
    onglets.appendChild(b);
  });
  tete.appendChild(onglets);
  root.appendChild(tete);

  /* la frise des étapes */
  const frise = h("div", { class: "panel abs inv-frise" + (cp ? " cp" : "") });
  const ligne = h("div", { class: "inv-ligne" });
  const boutons = etapes.map((e, i) => {
    const b = h("button", { class: "inv-etape" + (etat.vues[e.id] ? " vue" : ""), type: "button", "aria-label": e.nom },
      h("span", { class: "inv-rond", html: picto(e.id, cp ? 92 : 62) }), h("b", null, e.nom), h("small", null, e.quand));
    b.addEventListener("click", () => montrer(i, true));
    if (cp) b.addEventListener("mouseenter", () => Voice.speak(e.nom));
    ligne.appendChild(b);
    return b;
  });
  frise.append(h("div", { class: "inv-fleche" }, h("span", null, cp ? "il y a très longtemps" : "autrefois"), h("span", null, "aujourd'hui ➜")), ligne);
  root.appendChild(frise);

  /* la fiche de l'étape choisie */
  const fiche = h("div", { class: "panel abs inv-fiche" });
  root.appendChild(fiche);
  function montrer(i, dire) {
    const e = etapes[i];
    boutons.forEach((b, k) => b.classList.toggle("sel", k === i));
    boutons[i].classList.add("vue");
    fiche.innerHTML = "";
    fiche.append(h("div", { class: "inv-fiche-tete" }, h("span", { html: picto(e.id, 64) }), h("div", null, h("h3", null, e.nom), h("p", { class: "inv-quand" }, e.quand))),
      h("p", { class: "inv-texte" }, e.texte));
    if (!etat.vues[e.id]) { etat.vues[e.id] = Revision.jour(0); Store.save(); if (typeof Aventure !== "undefined") Aventure.evenement(); }
    if (dire) { Sound.click(); Voice.speak(`${e.nom}, ${e.quand}. ${e.texte}`); }
  }
  montrer(Math.max(0, etapes.findIndex((e) => !etat.vues[e.id])), false);

  /* avant / maintenant : un rideau qu'on fait glisser */
  const L = 522, H = 176;
  const boite = h("div", { class: "panel abs inv-avant" });
  const vue = h("div", { class: "inv-vue" });
  vue.innerHTML = invScene(T.maintenant, false, L, H);
  const rideau = h("div", { class: "inv-rideau", html: invScene(T.avant, true, L, H) });
  const trait = h("div", { class: "inv-trait" });
  vue.append(rideau, trait);
  const curseur = h("input", { type: "range", min: "0", max: "100", value: "50", id: "inv-curseur", "aria-label": "Faire glisser le rideau" });
  const placer = (c) => { rideau.style.width = Math.round(L * c / 100) + "px"; trait.style.left = Math.round(L * c / 100) - 3 + "px"; };
  curseur.addEventListener("input", () => placer(Number(curseur.value)));
  /* on peut aussi tirer le rideau directement sur l'image */
  let tire = false;
  const tirer = (ev) => { const r = vue.getBoundingClientRect(); const c = Math.max(0, Math.min(100, ((ev.clientX - r.left) / r.width) * 100)); curseur.value = String(Math.round(c)); placer(c); };
  vue.addEventListener("pointerdown", (ev) => { tire = true; vue.setPointerCapture(ev.pointerId); tirer(ev); });
  vue.addEventListener("pointermove", (ev) => { if (tire) tirer(ev); });
  vue.addEventListener("pointerup", () => { tire = false; });
  placer(50);
  boite.append(h("div", { class: "inv-avant-tete" }, h("span", null, "Avant"), h("span", null, "Maintenant")), vue,
    h("label", { class: "inv-glisse", for: "inv-curseur" }, "Fais glisser le rideau", curseur), h("p", { class: "inv-legende" }, T.legende));
  if (cp) boite.addEventListener("mouseenter", () => Voice.speak("Avant, maintenant. Fais glisser le rideau."), { once: true });
  root.appendChild(boite);

  /* les activités du thème */
  const acts = h("div", { class: "abs inv-acts" });
  const act = (cls, titre, sous, go, voix) => {
    const b = h("button", { class: "inv-act " + cls, type: "button", onclick: () => { Sound.click(); go(); } }, h("b", null, titre), h("small", null, sous));
    if (cp) b.addEventListener("mouseenter", () => Voice.speak(voix || titre));
    acts.appendChild(b);
  };
  if (theme === "transports") act("vert", "La course Tanger → Marrakech", cp ? "Qui arrive le premier ?" : "À pied : 20 jours. En avion : 1 heure.", () => App.go("inv-course"), "La course de Tanger à Marrakech");
  const et = etat.defis[theme] || 0;
  act("jaune", "Mini-défi " + (et ? "★".repeat(et) : ""), cp ? "Remets les images dans l'ordre." : "Remets la frise dans l'ordre : des écrous à gagner.", () => App.go("inv-defi", { theme }), "Le mini-défi : remets les images dans l'ordre");
  const premier = SABLIER_CHOIX.premier();
  act("blanc", premier.titre, premier.sous, () => App.go(premier.ecran, premier.params || {}), premier.titre);
  root.appendChild(acts);

  App.backButton(root, "sablier");
  setTimeout(() => Voice.speak(cp ? `${T.nom}. Clique sur une image pour l'écouter.` : `${T.nom} : clique sur une étape de la frise pour lire sa fiche.`), 300);
});

/* ------------------------------------------------------------------ */
/* Le mini-défi : cliquer les étapes de la plus ancienne à aujourd'hui  */
/* ------------------------------------------------------------------ */
App.register("inv-defi", (root, params) => {
  const u = Store.user; if (!u) return App.go("identif");
  const cp = Inventions.cp(), etat = Inventions.etat(u);
  const theme = INVENTIONS[params.theme] ? params.theme : "transports", T = INVENTIONS[theme];
  const toutes = Inventions.etapes(theme);
  /* au CE2, 5 étapes au hasard (dans l'ordre de la frise) ; au CP, les 4 */
  const choisies = cp ? toutes : shuffle(toutes.map((e, i) => i)).slice(0, 5).sort((a, b) => a - b).map((i) => toutes[i]);
  let suivante = 0, erreurs = 0, fini = false;
  root.classList.add("inv-ecran");
  root.style.setProperty("--inv", T.couleur);
  root.appendChild(h("div", { class: "abs inv-tete" }, h("span", { class: "inv-sablier", html: Art.sablier() }), h("h2", { class: "title" }, "Mini-défi : " + T.nom)));
  const consigne = cp ? "Clique dans l'ordre : la plus ancienne d'abord !"
    : "Clique sur les inventions dans l'ordre, de la plus ancienne à la plus récente.";
  root.appendChild(h("p", { class: "abs inv-consigne" }, consigne));
  /* les cases de la frise, à remplir */
  const cases = h("div", { class: "panel abs inv-cases" });
  const places = choisies.map((_, k) => { const c = h("div", { class: "inv-case" }, h("span", { class: "inv-num" }, String(k + 1))); cases.appendChild(c); return c; });
  cases.appendChild(h("div", { class: "inv-fleche bas" }, h("span", null, "le plus ancien"), h("span", null, "aujourd'hui ➜")));
  root.appendChild(cases);
  /* les cartes mélangées */
  const tas = h("div", { class: "abs inv-tas" });
  shuffle(choisies.map((e, i) => ({ e, i }))).forEach(({ e, i }) => {
    const b = h("button", { class: "inv-carte", type: "button", "aria-label": e.nom }, h("span", { html: picto(e.id, cp ? 120 : 96) }), h("b", null, e.nom));
    if (cp) b.addEventListener("mouseenter", () => { if (!fini) Voice.speak(e.nom); });
    b.addEventListener("click", () => {
      if (fini || b.disabled) return;
      if (i === suivante) {
        Sound.good(); b.disabled = true; b.classList.add("posee");
        places[i].appendChild(h("div", { class: "inv-posee" }, h("span", { html: picto(e.id, cp ? 92 : 70) }), h("small", null, e.quand)));
        Voice.speak(`${e.nom} : ${e.quand}.`);
        suivante++;
        if (suivante === choisies.length) terminer();
      } else {
        Sound.bad(); erreurs++; b.classList.remove("secoue"); void b.offsetWidth; b.classList.add("secoue");
        Voice.speak(cp ? "Pas encore ! Cherche une image plus ancienne." : "Pas encore : cherche une invention plus ancienne.");
      }
    });
    tas.appendChild(b);
  });
  root.appendChild(tas);
  function terminer() {
    fini = true;
    const etoiles = erreurs === 0 ? 3 : erreurs <= 2 ? 2 : 1;
    const avant = etat.defis[theme] || 0;
    etat.defis[theme] = Math.max(avant, etoiles); Store.save();
    if (typeof Journal !== "undefined") Journal.noter(u, "mission", "inv-" + theme, etoiles, "Les inventions : " + T.nom);
    if (typeof Aventure !== "undefined") Aventure.apresMission("inv-" + theme, avant, etoiles);
    tas.remove();
    const res = h("div", { class: "panel abs inv-resultat" },
      h("h2", { class: "title dark" }, etoiles === 3 ? "Bravo, sans erreur !" : "Frise terminée !"),
      h("div", { class: "big-stars", html: starsHtml(etoiles) }),
      h("div", { class: "row", style: { justifyContent: "center" } },
        h("button", { class: "btn sky", onclick: () => App.go("inv-defi", { theme }) }, "↻ Rejouer"),
        h("button", { class: "btn white", onclick: () => App.go("inventions", { theme }) }, "La frise")));
    root.appendChild(res);
    if (etoiles === 3) { Sound.fanfare(); App.confetti(); } else Sound.good();
    Voice.speak(etoiles === 3 ? "Bravo ! Toute la frise est dans l'ordre, sans erreur." : `Frise terminée, avec ${erreurs} erreur${erreurs > 1 ? "s" : ""}.`);
  }
  App.backButton(root, "inventions", { theme });
  setTimeout(() => Voice.speak(consigne), 300);
});

/* ------------------------------------------------------------------ */
/* La course Tanger → Marrakech (environ 580 km par la route)          */
/* ------------------------------------------------------------------ */
const INV_COURSE = [
  { id: "inv-pied", nom: "À pied", heures: 480, duree: "environ 20 jours" },
  { id: "cheval", nom: "À cheval", heures: 240, duree: "environ 10 jours" },
  { id: "voiture", nom: "En voiture", heures: 6, duree: "environ 6 heures" },
  { id: "inv-tgv", nom: "En train", heures: 5, duree: "environ 5 heures (Al Boraq, puis un autre train)" },
  { id: "avion", nom: "En avion", heures: 1, duree: "environ 1 heure de vol" },
];
App.register("inv-course", (root) => {
  const u = Store.user; if (!u) return App.go("identif");
  const cp = Inventions.cp();
  root.classList.add("inv-ecran");
  root.style.setProperty("--inv", INVENTIONS.transports.couleur);
  root.appendChild(h("div", { class: "abs inv-tete" }, h("span", { class: "inv-sablier", html: Art.sablier() }), h("h2", { class: "title" }, "La course Tanger → Marrakech")));
  root.appendChild(h("p", { class: "abs inv-consigne" }, cp ? "Qui va arriver le premier à Marrakech ? Clique sur « Partez ! »."
    : "De Tanger à Marrakech, il y a environ 580 km par la route. Qui arrive le premier ?"));
  const piste = h("div", { class: "panel abs inv-piste" });
  piste.append(h("div", { class: "inv-ville g" }, "Tanger"), h("div", { class: "inv-ville d" }, "Marrakech"));
  const LONG = 700;
  const lignes = INV_COURSE.map((v) => {
    const vehicule = h("span", { class: "inv-vehicule", html: picto(v.id, 58) });
    const temps = h("small", { class: "inv-arrivee" });
    const l = h("div", { class: "inv-couloir" }, h("b", null, v.nom), h("div", { class: "inv-route" }, vehicule), temps);
    if (cp) l.addEventListener("mouseenter", () => Voice.speak(v.nom));
    piste.appendChild(l);
    return { v, vehicule, temps, arrive: false };
  });
  const horloge = h("div", { class: "abs inv-horloge" }, "Temps : 0 heure");
  root.append(piste, horloge);
  const dire = (hh) => {
    const j = Math.floor(hh / 24), r = Math.round(hh - j * 24);
    return j ? `${j} jour${j > 1 ? "s" : ""}${r ? ` et ${r} h` : ""}` : `${Math.round(hh)} heure${Math.round(hh) > 1 ? "s" : ""}`;
  };
  let anim = null;
  const partir = h("button", { class: "btn green abs inv-partez", onclick: () => {
    if (anim) return;
    Sound.click(); partir.disabled = true;
    const t0 = performance.now();
    const arrives = [];
    const pas = (now) => {
      const t = (now - t0) / 1000, heures = Math.min(480, 2 * t * t * t);   // le temps accélère : quelques secondes pour 20 jours
      horloge.textContent = "Temps : " + dire(heures);
      lignes.forEach((l) => {
        const p = Math.min(1, heures / l.v.heures);
        l.vehicule.style.transform = `translateX(${Math.round(p * LONG)}px)`;
        if (p >= 1 && !l.arrive) {
          l.arrive = true; arrives.push(l);
          l.temps.textContent = (arrives.length === 1 ? "🏁 1er · " : `${arrives.length}e · `) + l.v.duree;
          Sound.pop();
          if (arrives.length === 1) Voice.speak(cp ? "L'avion est arrivé le premier !" : `Arrivé ! ${l.v.nom}, ${l.v.duree}.`);
        }
      });
      if (heures < 480) anim = requestAnimationFrame(pas);
      else {
        anim = null; partir.disabled = false; partir.textContent = "↻ Recommencer";
        Voice.speak(cp ? "À pied, il faut vingt jours ! En avion, une heure seulement." : "À pied, il faut environ vingt jours ; en avion, une heure seulement. 20 jours, c'est 480 heures !");
      }
    };
    lignes.forEach((l) => { l.arrive = false; l.temps.textContent = ""; l.vehicule.style.transform = "translateX(0)"; });
    anim = requestAnimationFrame(pas);
  } }, "Partez !");
  root.appendChild(partir);
  App.onLeave(() => { if (anim) cancelAnimationFrame(anim); });
  App.backButton(root, "inventions", { theme: "transports" });
});

/* ------------------------------------------------------------------ */
/* Le sablier de l'atelier : la frise du temps (ou les leçons du temps), ou les inventions */
/* ------------------------------------------------------------------ */
const SABLIER_CHOIX = {
  /* ce que le sablier ouvrait avant le module (ou ce que le niveau demande) */
  premier() {
    const o = ATELIER_OBJETS.find((x) => x.sablierAvant);
    const a = (o && o.sablierAvant) || { ecran: "atelier" };
    if (a.ecran === "frise") return { ...a, titre: "La frise du temps", sous: "Les savants, les constructions, le Maroc." };
    return { ...a, titre: "Le temps qui passe", sous: "Les jours, les saisons, autrefois." };
  },
};
/* le sablier du CE2 (histoire.js, id « frise ») et celui du CP (atelier-cp.js, id « temps ») ouvrent ce choix */
ATELIER_OBJETS.filter((o) => o.id === "frise" || o.id === "temps").forEach((o) => {
  o.sablierAvant = { ecran: o.ecran, params: o.params };
  o.ecran = "sablier"; o.params = {};
  if (o.id === "frise") o.desc = "Le temps : la frise de l'histoire, ou les grandes inventions (transports, écriture, communication, ordinateurs).";
});

App.register("sablier", (root) => {
  const u = Store.user; if (!u) return App.go("identif");
  const cp = Inventions.cp();
  App.backdrop(root);
  root.appendChild(h("div", { class: "screen-header" }, h("h2", { class: "title" }, icone(Art.sablier()), cp ? " Le temps" : " Le sablier du temps")));
  const premier = SABLIER_CHOIX.premier();
  const etat = Inventions.etat(u), vues = Object.keys(etat.vues).length;
  const carteChoix = (cls, dessin, titre, sous, go, voix) => {
    const b = h("button", { class: "panel inv-choix " + cls, type: "button", onclick: () => { Sound.click(); go(); } },
      h("span", { class: "inv-choix-img", html: dessin }), h("b", null, titre), h("small", null, sous));
    b.addEventListener("mouseenter", () => { Sound.hover(); if (cp) Voice.speak(voix); });
    return b;
  };
  const frise = cp ? ["matin", "printemps"].map((n) => picto(n, 120)).join("") : Art.sablier().replace("<svg", '<svg width="150" height="150"');
  const inv = ["inv-charrette", "inv-tablette", "inv-smartphone"].map((n) => picto(n, 96)).join("");
  root.appendChild(h("div", { class: "abs inv-choix-zone" },
    carteChoix("a", frise, premier.titre, premier.sous, () => App.go(premier.ecran, premier.params || {}), premier.titre),
    carteChoix("b", inv, "Les inventions", cp ? "Autrefois et aujourd'hui." : `Transports, écriture, communication, ordinateurs (${vues} étapes vues).`,
      () => App.go("inventions", { theme: "transports" }), "Les inventions")));
  const m = App.mascot(root, { x: 830, y: 560 });
  setTimeout(() => m.say(cp ? "On écoute le temps qui passe, ou on découvre les inventions ?" : "La frise du temps, ou les grandes inventions ? À toi de choisir !"), 300);
  App.backButton(root, "atelier");
});

/* ------------------------------------------------------------------ */
/* Médaille                                                             */
/* ------------------------------------------------------------------ */
ajouterMedailles([
  { id: "inventeur", icone: "💡", nom: "Petit inventeur", desc: "Réussis le mini-défi des quatre thèmes des inventions.",
    ok: (u) => INV_THEMES.every((t) => ((u.inventions && u.inventions.defis) || {})[t] >= 1) },
], { avant: "regulier" });
