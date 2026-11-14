/* L'Atelier de Boulon — types d'exercices pour les plus jeunes (CP, puis CE1).
   Tout se fait avec des images (moteur/js/pictos.js), la voix et de gros boutons : l'enfant
   n'a pas besoin de savoir lire. Chaque type renvoie le même contrôleur que les autres
   (validate, reset, reveal, lock, solutionText) ; voixPropre = le type lit lui-même la consigne.

   ecoute            : Boulon dit un mot, l'enfant clique sur la bonne image.
                       { type, consigne, mot, choix: ["chat", "lune", "plume"], answer: 1 }
   son-position      : où entend-on le son ? au début, au milieu ou à la fin du mot.
                       { type, consigne, image: "radis", son: "r", answer: 0|1|2 }
   syllabes          : reconstituer le mot de l'image avec des étiquettes.
                       { type, consigne, image: "lapin", unites: ["la", "pin"], intrus: ["lo"] }
   dictee-etiquettes : Boulon dit un son, une syllabe ou un mot ; l'enfant l'écrit avec des étiquettes.
                       { type, consigne, mot: "moto", unites: ["mo", "to"], intrus: ["ma"] }
   compter           : compter des images et choisir le nombre.
                       { type, consigne, image: "pomme", n: 7, choix: [5, 6, 7, 8] }
   tri               : ranger des images dans des paniers.
                       { type, consigne, paniers: ["vivant", "pas vivant"], objets: [["chat", 0], ["robot", 1]] }
   lis-phrase        : une phrase écrite (que Boulon ne lit qu'après la réponse) et des images ; l'enfant clique sur la bonne.
                       { type, consigne, phrase: "Le chat est sur le lit.", choices: [{ svg }…], answer: 1 }
   ecoute-ecrit      : Boulon dit une lettre, une syllabe, un mot ou un nombre ; l'enfant clique sur ce qui
                       l'écrit (rien n'est dit au survol : c'est la lecture qu'on travaille).
                       { type, consigne, dit: "moto", choix: ["moto", "vélo", "robot"], answer: 0 } */
"use strict";

/* dit un texte, puis lance la suite (sauf si une autre phrase a pris la place entre-temps) */
function direPuis(texte, suite, pause = 250) {
  Voice.speak(texte, { onend: () => { const seq = Voice._seq; setTimeout(() => { if (Voice._seq === seq) suite(); }, pause); } });
}

/* gros bouton jaune « écouter » */
function boutonEcoute(dire, titre = "Écouter") {
  const b = h("button", { class: "btn-ecoute", type: "button", title: titre, "aria-label": titre, html: ICONE_REECOUTER });
  b.addEventListener("click", () => { Sound.click(); dire(); });
  return b;
}

/* une carte avec une image ; cliquer dessus (ou la survoler, au CP) dit son nom */
function carteImage(nom, taille = 150, parle = true) {
  const c = h("div", { class: "carte-image", html: picto(nom, taille), role: "img", "aria-label": motDe(nom) });
  if (parle) {
    const dire = () => Voice.speak(motDe(nom));
    c.addEventListener("click", dire);
    if (NIVEAU.toutEnVoix) c.addEventListener("mouseenter", dire);
  }
  return c;
}

/* petits points sous un nombre (comme sur un dé) : rangées de 5 */
function pointsSvg(n, couleur = "#2e86de") {
  const r = 7, pas = 19, lignes = Math.ceil(n / 5);
  const pts = Array.from({ length: n }, (_, i) => `<circle cx="${10 + (i % 5) * pas}" cy="${10 + Math.floor(i / 5) * 20}" r="${r}" fill="${couleur}"/>`).join("");
  return `<svg width="96" height="${lignes * 20}" viewBox="0 0 96 ${lignes * 20}" aria-hidden="true">${pts}</svg>`;
}

Object.assign(Exercise.types, {
  /* ---------- écoute : quelle image correspond au mot entendu ? ---------- */
  ecoute(box, q, ctx) {
    const dire = () => Voice.speak(q.mot, { rate: 0.85 });
    box.appendChild(boutonEcoute(dire, "Écouter le mot"));
    const ctrl = this.choiceButtons(box, q, ctx, q.choix.map((nom, i) => ({ svg: picto(nom, 170), img: true, cls: "carte", aria: "Image " + (i + 1) })), (i) => i === q.answer);
    ctrl.voixPropre = true;
    ctrl.solutionText = () => motDe(q.choix[q.answer]);
    setTimeout(() => direPuis(q.consigne, dire), 150);
    return ctrl;
  },

  /* ---------- position du son dans le mot ---------- */
  "son-position"(box, q, ctx) {
    /* rien n'est dit au survol (déroutant pour l'enfant) : cliquer sur l'image redit le mot */
    const carte = carteImage(q.image, 170, false);
    carte.addEventListener("click", () => Voice.speak(motDe(q.image)));
    box.appendChild(carte);
    const places = ["au début", "au milieu", "à la fin"];
    const wagons = places.map((t, i) => ({
      cls: "wagon wagon-" + i, aria: t,
      html: `<span class="wagon-caisse"><span class="wagon-rond"></span></span><span class="wagon-roues"><i></i><i></i></span><small>${t}</small>`,
    }));
    const ctrl = this.choiceButtons(box, q, ctx, wagons, (i) => i === q.answer);
    const rangee = box.lastChild; rangee.classList.add("train");
    rangee.insertBefore(h("span", { class: "locomotive", "aria-hidden": "true" }), rangee.firstChild);
    ctrl.solutionText = () => places[q.answer];
    /* le son entendu va se poser dans le wagon choisi */
    const poser = () => rangee.querySelectorAll(".wagon").forEach((w) => {
      const rond = w.querySelector(".wagon-rond");
      rond.textContent = w.classList.contains("right") ? q.son : "";
    });
    const validate = ctrl.validate.bind(ctrl), reveal = ctrl.reveal.bind(ctrl);
    ctrl.validate = () => { const r = validate(); poser(); return r; };
    ctrl.reveal = () => { reveal(); poser(); };
    return ctrl;
  },

  /* ---------- assembler des étiquettes (syllabes avec image, dictée sans image) ---------- */
  syllabes(box, q, ctx) { return this.assembler(box, q, ctx, { image: q.image }); },
  "dictee-etiquettes"(box, q, ctx) { return this.assembler(box, q, ctx, { mot: q.mot }); },

  /* ---------- compter des images ---------- */
  compter(box, q, ctx) {
    const tas = h("div", { class: "collection" });
    for (let i = 0; i < q.n; i++) tas.appendChild(h("span", { html: picto(q.image, q.n > 10 ? 58 : 76) }));
    box.appendChild(tas);
    const choix = q.choix.map((n) => ({ cls: "nombre", aria: String(n), dire: String(n), html: `<span class="nb">${n}</span>${pointsSvg(n)}` }));
    const ctrl = this.choiceButtons(box, q, ctx, choix, (i) => q.choix[i] === q.n);
    ctrl.solutionText = () => String(q.n);
    return ctrl;
  },

  /* ---------- ranger des images dans des paniers ---------- */
  tri(box, q, ctx) {
    let choisi = null, locked = false;
    const depart = h("div", { class: "tri-depart" });
    const paniers = q.paniers.map((nom, k) => {
      const zone = h("div", { class: "tri-contenu" });
      const p = h("div", { class: "tri-panier panier-" + k, role: "button", tabindex: "0", "aria-label": "Panier : " + nom },
        h("span", { class: "tri-titre", html: ICONE_HAUT_PARLEUR + " " + escapeHtml(nom) }), zone);
      p.addEventListener("mouseenter", () => { if (NIVEAU.toutEnVoix && !locked) Voice.speak(nom); });
      p.addEventListener("click", () => {
        if (locked) return;
        if (!choisi) { Voice.speak(nom); return; }
        Sound.click(); zone.appendChild(choisi.el); choisi.el.classList.remove("choisi", "wrong"); choisi.dans = k; choisi = null;
      });
      p.addEventListener("keydown", (e) => { if (e.target === p && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); p.click(); } });
      return { el: p, zone };
    });
    const items = shuffle(q.objets.map(([nom, k]) => ({ nom, bon: k, dans: -1 })));
    items.forEach((it) => {
      it.el = h("button", { class: "tri-objet", type: "button", "aria-label": motDe(it.nom), html: picto(it.nom, 84) });
      it.el.addEventListener("mouseenter", () => { if (NIVEAU.toutEnVoix && !locked) Voice.speak(motDe(it.nom)); });
      it.el.addEventListener("click", (e) => {
        e.stopPropagation();
        if (locked) return;
        Sound.pop();
        if (choisi) choisi.el.classList.remove("choisi");
        choisi = choisi === it ? null : it;
        if (choisi) { it.el.classList.add("choisi"); Voice.speak(motDe(it.nom)); }
      });
      depart.appendChild(it.el);
    });
    box.append(depart, h("div", { class: "tri-paniers" }, ...paniers.map((p) => p.el)));
    return {
      needsValidate: true,
      validate() {
        if (items.some((it) => it.dans < 0)) return { empty: true, msg: "Range toutes les images dans les paniers !" };
        let ok = true;
        items.forEach((it) => { const juste = it.dans === it.bon; it.el.classList.toggle("wrong", !juste); it.el.classList.toggle("right", juste); if (!juste) ok = false; });
        return { ok };
      },
      reset() { items.forEach((it) => { if (it.dans !== it.bon) { it.dans = -1; it.el.classList.remove("wrong"); depart.appendChild(it.el); } }); },
      reveal() { items.forEach((it) => { paniers[it.bon].zone.appendChild(it.el); it.dans = it.bon; it.el.classList.remove("wrong"); it.el.classList.add("right"); }); },
      lock() { locked = true; if (choisi) choisi.el.classList.remove("choisi"); },
      solutionText() { return q.paniers.map((p, k) => `${p} : ${items.filter((it) => it.bon === k).map((it) => motDe(it.nom)).join(", ")}`).join(" ; "); },
    };
  },
});

/* assembler : des cases vides, des étiquettes à cliquer pour les remplir (re-cliquer une case la vide) */
Exercise.assembler = function (box, q, ctx, { image = null, mot = null } = {}) {
  let locked = false;
  const dire = () => Voice.speak(mot, { rate: 0.8 });
  if (image) box.appendChild(carteImage(image, 150));
  else box.appendChild(boutonEcoute(dire, "Écouter"));
  const cases = q.unites.map(() => h("button", { class: "case-vide", type: "button", "aria-label": "Case vide" }));
  const ligne = h("div", { class: "cases" }, ...cases);
  const tuiles = shuffle(q.unites.concat(q.intrus || [])).map((t) => h("button", { class: "etiquette-unite", type: "button" }, t));
  const reserve = h("div", { class: "etiquettes-reserve" }, ...tuiles);
  box.append(ligne, reserve);
  const contenu = new Map();          // case → tuile
  const vider = (c) => { const t = contenu.get(c); if (!t) return; t.classList.remove("utilisee"); contenu.delete(c); c.textContent = ""; c.classList.remove("pleine", "right", "wrong"); };
  tuiles.forEach((t) => t.addEventListener("click", () => {
    if (locked || t.classList.contains("utilisee")) return;
    const libre = cases.find((c) => !contenu.has(c));
    if (!libre) return;
    Sound.pop(); t.classList.add("utilisee"); contenu.set(libre, t); libre.textContent = t.textContent; libre.classList.add("pleine");
  }));
  cases.forEach((c) => c.addEventListener("click", () => { if (!locked) { Sound.click(); vider(c); } }));
  const ctrl = {
    needsValidate: true, voixPropre: !image,
    validate() {
      if (cases.some((c) => !contenu.has(c))) return { empty: true, msg: "Remplis toutes les cases !" };
      const ok = cases.map((c) => c.textContent).join("") === q.unites.join("");
      cases.forEach((c, i) => c.classList.add(c.textContent === q.unites[i] ? "right" : "wrong"));
      return { ok };
    },
    reset() { cases.forEach(vider); },
    reveal() { cases.forEach((c, i) => { vider(c); c.textContent = q.unites[i]; c.classList.add("pleine", "right"); }); },
    lock() { locked = true; },
    solutionText() { return q.unites.join(q.sep || ""); },
  };
  if (!image) setTimeout(() => direPuis(q.consigne, dire), 150);
  return ctrl;
};

/* ---------- remettre des images dans l'ordre (la graine, la pousse, la fleur…) ----------
   { type: "suite-images", consigne, images: ["graine", "pousse", "fleur"] }  (images dans le bon ordre) */
Object.assign(Exercise.types, {
  "suite-images"(box, q, ctx) {
    const n = q.images.length;
    let locked = false;
    const places = Array(n).fill(null);
    const cases = q.images.map((_, k) => h("div", { class: "suite-case" }, h("span", { class: "suite-num" }, String(k + 1))));
    const tas = h("div", { class: "suite-tas" });
    const cartes = shuffle(q.images.map((nom, i) => ({ nom, i, k: null })));
    const ranger = () => {
      cartes.forEach((c) => (c.k == null ? tas : cases[c.k]).appendChild(c.el));
    };
    cartes.forEach((c) => {
      c.el = h("button", { class: "suite-carte", type: "button", "aria-label": motDe(c.nom), html: picto(c.nom, 110) });
      c.el.addEventListener("mouseenter", () => { if (NIVEAU.toutEnVoix && !locked) Voice.speak(motDe(c.nom)); });
      c.el.addEventListener("click", () => {
        if (locked) return;
        Sound.pop();
        c.el.classList.remove("wrong", "right");
        if (c.k != null) { places[c.k] = null; c.k = null; }
        else { const k = places.indexOf(null); if (k < 0) return; places[k] = c; c.k = k; Voice.speak(motDe(c.nom)); }
        ranger();
      });
    });
    box.append(h("div", { class: "suite-cases" }, ...cases), tas);
    ranger();
    return {
      needsValidate: true,
      validate() {
        if (places.includes(null)) return { empty: true, msg: "Place toutes les images dans les cases !" };
        const ok = places.every((c, k) => c.i === k);
        if (!ok) places.forEach((c, k) => c.el.classList.toggle("wrong", c.i !== k));
        return { ok };
      },
      reset() { places.fill(null); cartes.forEach((c) => { c.k = null; c.el.classList.remove("wrong", "right"); }); ranger(); },
      reveal() {
        cartes.forEach((c) => { c.k = c.i; places[c.i] = c; c.el.classList.remove("wrong"); c.el.classList.add("right"); });
        ranger(); locked = true;
      },
      lock() { locked = true; },
      solutionText: () => q.images.map(motDe).join(" → "),
    };
  },
});

/* ---------- écouter, puis lire : cliquer sur ce qui écrit ce que Boulon a dit ---------- */
Object.assign(Exercise.types, {
  "ecoute-ecrit"(box, q, ctx) {
    const dire = () => Voice.speak(q.dit, { rate: 0.8 });
    box.appendChild(boutonEcoute(dire, "Écouter encore"));
    const ctrl = this.choiceButtons(box, q, ctx, q.choix.map((t, i) => ({ text: t, cls: "ecrit", aria: "Choix " + (i + 1) })), (i) => i === q.answer);
    ctrl.voixPropre = true;
    ctrl.solutionText = () => q.choix[q.answer];
    setTimeout(() => direPuis(q.consigne, dire), 150);
    return ctrl;
  },
});

/* les points d'un dé (1 à 6) ; au-delà de 6, deux dés */
function desSvg(n, cote = 92) {
  const P = { 1: [[50, 50]], 2: [[28, 28], [72, 72]], 3: [[26, 26], [50, 50], [74, 74]], 4: [[28, 28], [72, 28], [28, 72], [72, 72]],
    5: [[26, 26], [74, 26], [50, 50], [26, 74], [74, 74]], 6: [[28, 24], [72, 24], [28, 50], [72, 50], [28, 76], [72, 76]] };
  const de = (k, x) => `<g transform="translate(${x} 0)"><rect x="4" y="4" width="92" height="92" rx="16" fill="#fff" stroke="#2b2236" stroke-width="5"/>${P[k].map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="9" fill="#2b2236"/>`).join("")}</g>`;
  const des = n <= 6 ? [n] : [6, n - 6];
  return `<svg width="${cote * des.length + (des.length - 1) * 12}" height="${cote}" viewBox="0 0 ${100 * des.length + (des.length - 1) * 12} 100" aria-hidden="true">${des.map((k, i) => de(k, i * 112)).join("")}</svg>`;
}

/* ---------- lis la phrase : c'est l'enfant qui lit ; Boulon ne lit la phrase qu'après la bonne réponse ---------- */
Object.assign(Exercise.types, {
  "lis-phrase"(box, q, ctx) {
    box.appendChild(h("div", { class: "phrase-a-lire" }, q.phrase));
    const ctrl = this.choiceButtons(box, q, ctx, q.choices.map((c) => Object.assign({ img: true }, c)), (i) => i === q.answer);
    const valider = ctrl.validate.bind(ctrl);
    ctrl.validate = () => { const r = valider(); if (r.ok) setTimeout(() => Voice.speak(q.phrase), 1500); return r; };
    ctrl.solutionText = () => q.phrase;
    return ctrl;
  },
});
