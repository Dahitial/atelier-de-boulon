/* L'Atelier de Boulon — les défis des parents.
   Le parent crée un défi dans l'espace parents (bouton « ✉️ Défis ») : finir des leçons, ou venir plusieurs
   jours, et il écrit lui-même la récompense (une glace, une sortie, n'importe quoi).
   L'enfant reçoit une enveloppe dans l'atelier. Boulon annonce le défi mais ne lit jamais la récompense :
   « Tes parents vont t'offrir quelque chose. Ouvre l'enveloppe pour le savoir ! » (elle y est écrite, visible).
   Défi réussi : une fête, et un bon rangé dans le coffre aux trésors (onglet « Mes bons ») ; le parent touche
   « Promesse tenue » dans l'espace parents.
   - Un défi en cours à la fois par enfant. « Tous les enfants » envoie le même défi à chacun (même groupe) :
     chacun a son enveloppe et avance à son rythme.
   - Une leçon compte quand elle est finie après l'envoi du défi, quelle que soit la note : c'est l'effort qui
     est récompensé. Un jour compte quand l'enfant y finit au moins une série (leçon, révision… : Journal).
   - Pas de date limite, rien ne se perd. Le parent peut retirer un défi en cours.
   - Le jeu n'offre jamais rien lui-même : la récompense est dans la vraie vie (Rivet se mérite, il ne s'offre pas).
   Données : u.defisParents (liste), gardées dans la sauvegarde par DefisParents.nettoyer. */
"use strict";

const DefisParents = {
  MAX_LECONS: 5,
  JOURS: [2, 3, 4, 5, 7],
  MAX_TEXTE: 80,
  GARDES: 30,          // défis terminés gardés par enfant
  _brouillon: null,    // le défi en train d'être écrit par le parent
  _attente: null,

  /* ---------- données ---------- */
  liste(u) { if (!Array.isArray(u.defisParents)) u.defisParents = []; return u.defisParents; },
  enCours(u) { return this.liste(u).find((d) => !d.reussi && !d.retire) || null; },
  aTenir(u) { return this.liste(u).filter((d) => d.reussi && !d.tenu && !d.retire); },
  bons(u) { return this.liste(u).filter((d) => d.reussi && !d.retire).reverse(); },
  lecons(d) { return (d.lecons || []).filter((id) => LESSONS[id]); },

  creer(u, def, groupe) {
    const d = {
      id: "d" + Date.now().toString(36) + rand(100, 999), groupe, cree: Revision.jour(0),
      type: def.type, lecons: def.type === "lecons" ? def.lecons.slice(0, this.MAX_LECONS) : [],
      jours: def.type === "jours" ? def.jours : 0, fait: [], recompense: String(def.recompense).trim().slice(0, this.MAX_TEXTE),
      ouvert: false, reussi: "", fete: false, tenu: "", retire: "",
    };
    const l = this.liste(u);
    l.push(d);
    /* on garde les défis en cours et les derniers terminés */
    const finis = l.filter((x) => x.reussi || x.retire);
    if (finis.length > this.GARDES) { const trop = new Set(finis.slice(0, finis.length - this.GARDES)); u.defisParents = l.filter((x) => !trop.has(x)); }
    return d;
  },
  /* où en est le défi : { fait, total } */
  progres(u, d) {
    if (d.type === "jours") {
      const jours = typeof Journal !== "undefined" ? Object.entries(Journal.etat(u).jours).filter(([k, v]) => k >= d.cree && v.series > 0).length : 0;
      return { fait: Math.min(jours, d.jours), total: d.jours };
    }
    const ls = this.lecons(d);
    return { fait: ls.filter((id) => d.fait.includes(id)).length, total: ls.length };
  },
  /* une leçon finie (Store.recordLesson), quelle que soit la note */
  apresLecon(u, id) {
    const d = u && this.enCours(u);
    if (d && d.type === "lecons" && d.lecons.includes(id) && !d.fait.includes(id)) d.fait.push(id);
  },
  /* le défi en cours est-il réussi ? (Aventure.conclure, après chaque événement) */
  verifier(u) {
    const d = u && this.enCours(u);
    if (!d) return;
    const p = this.progres(u, d);
    if (p.total && p.fait >= p.total) d.reussi = Revision.jour(0);
  },
  /* phrase du défi, pour l'enfant (sans la récompense) */
  phrase(u, d) {
    if (d.type === "jours") return `viens travailler ${d.jours} jours. Chaque jour où tu finis une leçon ou une révision compte`;
    const ls = this.lecons(d).map((id) => `« ${LESSONS[id].title} »`);
    const liste = ls.length > 1 ? ls.slice(0, -1).join(", ") + " et " + ls[ls.length - 1] : ls[0] || "";
    return ls.length > 1 ? `finis ces ${ls.length} leçons : ${liste}` : `finis la leçon ${liste}`;
  },
  description(d) {
    if (d.type === "jours") return `Venir ${d.jours} jours`;
    const ls = this.lecons(d).map((id) => `« ${LESSONS[id].title} »`);
    return `Finir ${ls.join(", ")}`;
  },

  /* ---------- l'enfant : l'enveloppe dans l'atelier ---------- */
  ENVELOPPE(ouverte) {
    return `<svg viewBox="${ouverte ? "0 -34 160 142" : "0 4 160 106"}" aria-hidden="true">
      <rect x="6" y="10" width="148" height="96" rx="10" fill="#fff3d6" stroke="#2b2236" stroke-width="5"/>
      ${ouverte ? `<path d="M10 14 L80 -30 L150 14" fill="#ffe7b0" stroke="#2b2236" stroke-width="5" stroke-linejoin="round"/>
        <rect x="22" y="-6" width="116" height="60" rx="6" fill="#fff" stroke="#2b2236" stroke-width="4"/>
        <line x1="34" y1="12" x2="120" y2="12" stroke="#b9aec6" stroke-width="4" stroke-linecap="round"/><line x1="34" y1="26" x2="104" y2="26" stroke="#b9aec6" stroke-width="4" stroke-linecap="round"/>`
        : `<path d="M10 16 L80 66 L150 16" fill="#ffe7b0" stroke="#2b2236" stroke-width="5" stroke-linejoin="round"/>`}
      <path d="M10 102 L64 58 M150 102 L96 58" stroke="#2b2236" stroke-width="4" stroke-linecap="round" fill="none"/>
      ${ouverte ? "" : `<circle cx="80" cy="64" r="17" fill="#e4572e" stroke="#2b2236" stroke-width="4"/><path d="M80 72 l-8 -8 a5 5 0 0 1 8 -6 a5 5 0 0 1 8 6 Z" fill="#fff3d6"/>`}
    </svg>`;
  },
  /* le bouton de l'enveloppe, en haut de l'atelier (à côté du prénom), dans toutes les pièces */
  boutonAtelier(root, u) {
    const d = this.enCours(u);
    if (!d) return;
    const b = h("button", { class: "dp-env" + (d.ouvert ? "" : " nouveau"), type: "button", "aria-label": "Le défi de tes parents",
      title: "Le défi de tes parents", onclick: () => { Sound.click(); this.ouvrir(u); } });
    b.innerHTML = this.ENVELOPPE(false);
    b.append(h("span", { class: "dp-env-etiq" }, "Le défi"));
    b.addEventListener("mouseenter", () => { Sound.hover(); Voice.survol("Le défi de tes parents. Clique pour ouvrir l'enveloppe."); });
    root.appendChild(b);
    /* juste à droite de l'étiquette de l'élève (sa largeur dépend du prénom) */
    const placer = () => { const p = root.querySelector(":scope > .abs.panel"); if (p && p.offsetWidth) b.style.left = (p.offsetLeft + p.offsetWidth + 14) + "px"; };
    placer(); requestAnimationFrame(placer);
  },
  /* ce que Boulon dit en arrivant, tant que l'enveloppe n'a pas été ouverte */
  bonjour(u, hello) {
    const d = this.enCours(u);
    if (!d || d.ouvert) return hello;
    return `Une enveloppe pour toi ! Tes parents ont un défi : si tu le réussis, ils vont t'offrir quelque chose. Ouvre l'enveloppe, en haut, pour le savoir !`;
  },
  /* l'enveloppe ouverte : le défi, ce qui est fait, et la récompense écrite par le parent */
  ouvrir(u) {
    const d = this.enCours(u);
    if (!d) return;
    d.ouvert = true; Store.save();
    document.querySelectorAll(".dp-env").forEach((x) => x.classList.remove("nouveau"));
    const p = this.progres(u, d);
    const texte = `Le défi de tes parents : ${this.phrase(u, d)}.` + (p.fait ? ` Tu en as déjà fait ${p.fait} sur ${p.total} !` : "")
      + " Si tu réussis, tes parents vont t'offrir quelque chose : c'est écrit dans l'enveloppe.";
    let close;
    const taches = h("div", { class: "dp-taches" });
    if (d.type === "jours") {
      taches.appendChild(h("div", { class: "dp-tache" }, h("span", { class: "dp-mat" }, "🗓"), h("span", { class: "dp-t" }, `Viens travailler ${d.jours} jours`)));
      taches.appendChild(h("div", { class: "dp-ronds", "aria-label": `${p.fait} jours sur ${p.total}` },
        ...[...Array(d.jours)].map((_, i) => h("span", { class: "dp-rond" + (i < p.fait ? " fait" : "") }, i < p.fait ? "✓" : String(i + 1)))));
    } else {
      this.lecons(d).forEach((id) => {
        const l = LESSONS[id], fait = d.fait.includes(id);
        taches.appendChild(h("div", { class: "dp-tache" + (fait ? " fait" : "") },
          h("span", { class: "dp-coche" }, fait ? "✓" : ""),
          h("span", { class: "pa-pastille", style: { background: CONTENT[l.subject].color } }),
          h("span", { class: "dp-t" }, l.title),
          h("button", { class: "btn sky small", title: "Écouter", "aria-label": "Écouter le nom de la leçon", onclick: () => Voice.speak(`${CONTENT[l.subject].name} : ${l.title}.` + (fait ? " C'est fait !" : "")) }, "🔊"),
          fait ? null : h("button", { class: "btn green small", onclick: () => { close(); Sound.click(); App.go("lecon", { id }); } }, "J'y vais")));
      });
    }
    close = App.modal(h("div", { class: "dp-lettre" },
      h("div", { class: "dp-lettre-env", html: this.ENVELOPPE(true) }),
      h("h2", { class: "title dark" }, "Le défi de tes parents"),
      taches,
      h("div", { class: "dp-cadeau" }, h("span", { class: "dp-cadeau-ic" }, "🎁"),
        h("div", null, h("small", null, "Si tu réussis, tes parents t'offrent :"), h("b", null, d.recompense))),
      h("div", { class: "row", style: { justifyContent: "center" } },
        h("button", { class: "btn sky", onclick: () => Voice.speak(texte) }, "🔊 Réécouter le défi"),
        h("button", { class: "btn white", onclick: () => close() }, "Fermer"))));
    if (NIVEAU.toutEnVoix) setTimeout(() => Voice.speak(texte), 300);
  },

  /* ---------- l'enfant : le défi réussi ---------- */
  /* la fête, quand plus rien ne parle et qu'aucune fenêtre n'est ouverte (après les médailles) */
  feter(u, essai = 0) {
    clearTimeout(this._attente);
    const d = u && this.liste(u).find((x) => x.reussi && !x.fete && !x.retire);
    if (!d || Store.user !== u) return;
    /* la leçon s'enregistre juste avant l'écran de résultat : on attend d'y être, et que Boulon ait fini de parler
       (au-delà de 2 minutes, on laisse faire le prochain retour dans l'atelier) */
    const ecrans = ["atelier", "resultat", "revision-fin", "defi-fin", "orient-fin", "aventure"];
    if (!ecrans.includes(App.current) || Voice.protegee() || document.querySelector(".modal-back")
        || (typeof Aventure !== "undefined" && (Aventure._enCeremonie || Aventure._medailles.length))) {
      if (essai < 170) this._attente = setTimeout(() => this.feter(u, essai + 1), 700);
      return;
    }
    d.fete = true; Store.save();
    document.querySelectorAll(".dp-env").forEach((x) => x.remove());
    const texte = "Bravo, tu as réussi le défi de tes parents ! Voici ton bon. Montre-le à tes parents : il est rangé dans ton coffre aux trésors.";
    let close;
    close = App.modal(h("div", { class: "dp-reussi" },
      h("div", { class: "title dark dp-reussi-titre" }, "🎉 Défi réussi !"),
      h("p", null, d.type === "jours" ? `Tu es venu travailler ${d.jours} jours. Voici ton bon :` : "Tu as fini les leçons du défi. Voici ton bon :"),
      this.carteBon(d),
      h("p", { class: "dp-aide" }, "Montre-le à tes parents ! Il est rangé dans ton coffre aux trésors."),
      h("div", { class: "row" },
        h("button", { class: "btn sky", onclick: () => Voice.speak(texte) }, "🔊 Réécouter"),
        h("button", { class: "btn green", onclick: () => close() }, "Super !"))));
    Sound.fanfare(); App.confetti(60);
    if (NIVEAU.toutEnVoix) setTimeout(() => Voice.speak(texte), 400);
  },
  carteBon(d, petit) {
    return h("div", { class: "dp-bon" + (petit ? " petit" : "") },
      h("small", null, "BON POUR"),
      h("b", null, d.recompense),
      h("small", null, `Offert par tes parents · défi réussi ${Revision.dateFr(d.reussi)}`),
      d.tenu ? h("span", { class: "dp-tenu" }, "✅ Promesse tenue") : null);
  },

  /* ---------- le parent : l'onglet « Défis » de l'espace parents ---------- */
  ecranParents(droite, params) {
    const users = Store.data.users;
    const recharger = (p = {}) => App.go("parents", { vue: "defis", ...p });
    if (params.nouveau) return this.formulaire(droite, users, recharger);
    this._brouillon = null;
    const nom = (u) => `${u.avatar} ${u.name}`;
    const barre = (p) => h("span", { class: "dp-barre", title: `${p.fait} sur ${p.total}` }, h("span", { style: { width: Math.round(100 * p.fait / (p.total || 1)) + "%" } }));

    /* les promesses à tenir */
    users.forEach((u) => this.aTenir(u).forEach((d) => droite.appendChild(h("div", { class: "dp-bandeau" },
      h("span", { class: "dp-bandeau-ic" }, "🎉"),
      h("div", { class: "dp-txt" }, h("b", null, `${u.name} a réussi son défi !`), h("br"), `Promesse : « ${d.recompense} »`),
      h("button", { class: "btn green", onclick: () => { d.tenu = Revision.jour(0); Store.save(); Sound.good(); recharger(); } }, "✅ Promesse tenue")))));

    /* les défis en cours, regroupés (un défi pour tous les enfants = un groupe) */
    droite.appendChild(h("div", { class: "dp-entete" }, h("h3", { class: "pa-titre" }, "✉️ Les défis en cours"),
      h("button", { class: "btn small violet", onclick: () => { Sound.click(); recharger({ nouveau: true }); } }, "＋ Un nouveau défi")));
    const groupes = new Map();
    users.forEach((u) => { const d = this.enCours(u); if (d) { if (!groupes.has(d.groupe)) groupes.set(d.groupe, []); groupes.get(d.groupe).push({ u, d }); } });
    if (!groupes.size) droite.appendChild(h("p", { class: "pa-aide" }, "Aucun défi en cours. Un défi, c'est une petite promesse : « Si tu finis ces leçons, je t'offre… »"));
    for (const membres of groupes.values()) {
      const d0 = membres[0].d, tous = membres.length > 1 || d0.tous;
      droite.appendChild(h("div", { class: "dp-ligne" },
        h("span", { class: "dp-ava" }, tous ? "👨‍👩‍👧" : membres[0].u.avatar),
        h("div", { class: "dp-txt" },
          h("b", null, tous ? "Tous les enfants" : membres[0].u.name), ` · ${this.description(d0)}`, h("br"),
          ...membres.flatMap(({ u, d }) => { const p = this.progres(u, d); return [tous ? `${nom(u)} ` : "", barre(p), ` ${p.fait} sur ${p.total} `]; }),
          ` · 🎁 « ${d0.recompense} »`, h("br"),
          h("small", null, `Envoyé ${Revision.dateFr(d0.cree)}` + (membres.every(({ d }) => d.ouvert) ? " · enveloppe ouverte" : ""))),
        h("button", { class: "btn small white", onclick: () => App.confirm("Retirer ce défi ?", () => { membres.forEach(({ d }) => { d.retire = Revision.jour(0); }); Store.save(); recharger(); }) }, "Retirer")));
    }

    /* les défis terminés */
    const finis = users.flatMap((u) => this.liste(u).filter((d) => d.reussi && !d.retire).map((d) => ({ u, d })))
      .sort((a, b) => (b.d.reussi > a.d.reussi ? 1 : -1)).slice(0, 10);
    if (finis.length) {
      droite.appendChild(h("h3", { class: "pa-titre" }, "🗂 Les défis réussis"));
      finis.forEach(({ u, d }) => droite.appendChild(h("div", { class: "dp-ligne fini" },
        h("span", { class: "dp-ava" }, u.avatar),
        h("div", { class: "dp-txt" }, h("b", null, u.name), ` · ${this.description(d)} · 🎁 « ${d.recompense} »`, h("br"),
          h("small", null, `Réussi ${Revision.dateFr(d.reussi)}` + (d.tenu ? ` · ✅ promesse tenue ${Revision.dateFr(d.tenu)}` : " · promesse à tenir"))))));
    }
    droite.appendChild(h("h3", { class: "pa-titre" }, "Comment ça marche"));
    droite.appendChild(h("p", { class: "pa-aide" }, "L'enfant reçoit une enveloppe dans l'atelier. Boulon lui annonce le défi, mais ne lit pas la récompense : elle est écrite dans l'enveloppe. Une leçon compte quand elle est finie, même avec des erreurs. Quand le défi est réussi, l'enfant reçoit un bon dans son coffre aux trésors : à vous de tenir la promesse !"));
  },

  formulaire(droite, users, recharger) {
    const B = this._brouillon || (this._brouillon = { pour: users.length > 1 ? "tous" : (users[0] && users[0].id), type: "lecons", lecons: [], jours: 3, recompense: "", erreur: "" });
    const libres = users.filter((u) => !this.enCours(u));
    const cibles = B.pour === "tous" ? libres : libres.filter((u) => u.id === B.pour);
    const choix = (txt, on, faire, attrs = {}) => h("button", { class: "btn small " + (on ? "violet" : "white"), onclick: () => { Sound.click(); faire(); }, ...attrs }, txt);
    const maj = () => recharger({ nouveau: true });

    droite.appendChild(h("h3", { class: "pa-titre" }, "✉️ Un nouveau défi"));
    if (!users.length) { droite.appendChild(h("p", { class: "pa-aide" }, "Ajoutez d'abord un élève.")); return; }
    droite.appendChild(h("div", { class: "pa-pour" }, h("b", null, "Pour qui ?"),
      users.length > 1 ? choix("👨‍👩‍👧 Tous les enfants", B.pour === "tous", () => { B.pour = "tous"; maj(); }) : null,
      ...users.map((u) => { const occupe = !!this.enCours(u);
        return choix(`${u.avatar} ${u.name}` + (occupe ? " · défi en cours" : ""), B.pour === u.id, () => { B.pour = u.id; maj(); },
          { disabled: occupe ? true : null, title: occupe ? `${u.name} a déjà un défi en cours` : null }); })));
    if (B.pour === "tous" && libres.length < users.length)
      droite.appendChild(h("p", { class: "pa-aide" }, libres.length ? `Le défi ira à ${libres.map((u) => u.name).join(", ")} : les autres ont déjà un défi en cours.` : "Tous les enfants ont déjà un défi en cours."));

    droite.appendChild(h("h3", { class: "pa-titre" }, "🎯 Ce qu'il faut faire"));
    droite.appendChild(h("div", { class: "pa-pour" },
      choix("📒 Finir des leçons", B.type === "lecons", () => { B.type = "lecons"; maj(); }),
      choix("🗓 Venir plusieurs jours", B.type === "jours", () => { B.type = "jours"; maj(); })));
    if (B.type === "lecons") {
      const zone = h("div", { class: "dp-puces" });
      B.lecons.filter((id) => LESSONS[id]).forEach((id) => { const l = LESSONS[id];
        zone.appendChild(h("span", { class: "dp-puce" }, h("span", { class: "pa-pastille", style: { background: CONTENT[l.subject].color } }), l.title,
          h("button", { class: "dp-puce-x", title: "Enlever", "aria-label": `Enlever ${l.title}`, onclick: () => { B.lecons = B.lecons.filter((x) => x !== id); maj(); } }, "✕"))); });
      if (B.lecons.length < this.MAX_LECONS) zone.appendChild(h("button", { class: "btn small sky", onclick: () => this.choisirLecons(B, maj) }, "＋ Ajouter une leçon"));
      droite.appendChild(zone);
      droite.appendChild(h("p", { class: "pa-aide" }, `Jusqu'à ${this.MAX_LECONS} leçons. Une leçon compte quand elle est finie, même avec des erreurs : c'est l'effort qui est récompensé.`));
    } else {
      droite.appendChild(h("div", { class: "pa-pour" }, ...this.JOURS.map((n) => choix(`${n} jours`, B.jours === n, () => { B.jours = n; maj(); }))));
      droite.appendChild(h("p", { class: "pa-aide" }, "Un jour compte quand l'enfant y finit au moins une leçon ou une révision. Pas de date limite."));
    }

    droite.appendChild(h("h3", { class: "pa-titre" }, "🎁 La récompense"));
    const zone = h("textarea", { class: "dp-recompense", maxlength: String(this.MAX_TEXTE), rows: "2",
      placeholder: "Par exemple : une glace, une sortie au parc, une histoire de plus ce soir…", "aria-label": "La récompense" });
    zone.value = B.recompense;
    zone.addEventListener("input", () => { B.recompense = zone.value; });
    droite.appendChild(zone);
    droite.appendChild(h("p", { class: "pa-aide" }, "Écrivez ce que vous voulez. Boulon ne la lit pas : il dit à l'enfant que vous allez lui offrir quelque chose, et qu'il peut regarder dans l'enveloppe pour le savoir."));

    if (B.erreur) droite.appendChild(h("p", { class: "dp-erreur", role: "alert" }, B.erreur));
    const qui = cibles.length === 1 ? cibles[0].name : cibles.length ? "tous les enfants" : "";
    droite.appendChild(h("div", { class: "pa-pour", style: { marginTop: "10px" } },
      h("button", { class: "btn green", disabled: cibles.length ? null : true, onclick: () => {
        const lecons = B.lecons.filter((id) => LESSONS[id]);
        B.recompense = zone.value;
        if (B.type === "lecons" && !lecons.length) { B.erreur = "Choisissez au moins une leçon."; return maj(); }
        if (!B.recompense.trim()) { B.erreur = "Écrivez la récompense."; return maj(); }
        const groupe = "g" + Date.now().toString(36);
        cibles.forEach((u) => { const d = this.creer(u, { type: B.type, lecons, jours: B.jours, recompense: B.recompense }, groupe); if (B.pour === "tous") d.tous = true; });
        Store.save(); Sound.good(); this._brouillon = null; recharger();
      } }, qui ? `✉️ Envoyer le défi à ${qui}` : "✉️ Envoyer le défi"),
      h("button", { class: "btn white", onclick: () => { this._brouillon = null; recharger(); } }, "Annuler")));
  },

  /* choisir les leçons du défi : matière, puis leçons (jusqu'à MAX_LECONS) */
  choisirLecons(B, apres, matiere) {
    const ids = Object.keys(CONTENT);
    const s = CONTENT[matiere] || CONTENT[ids[0]];
    let close;
    const titre = h("div", { class: "title dark", style: { fontSize: "26px" } });
    const liste = h("div", { class: "dp-choix-lecons" });
    const boutons = [];
    /* on coche sur place (la liste garde sa position) */
    const montrer = () => {
      titre.textContent = `Choisir les leçons (${B.lecons.length} sur ${this.MAX_LECONS})`;
      boutons.forEach(([b, l]) => {
        const pris = B.lecons.includes(l.id);
        b.className = "btn small " + (pris ? "violet" : "white");
        b.textContent = (pris ? "✓ " : "") + l.title;
        b.disabled = !pris && B.lecons.length >= this.MAX_LECONS;
      });
    };
    s.chapters.forEach((c) => {
      liste.appendChild(h("h4", null, c.title));
      liste.appendChild(h("div", { class: "dp-choix-ligne" }, ...c.lessons.map((l) => {
        const b = h("button", { onclick: () => {
          Sound.click();
          B.lecons = B.lecons.includes(l.id) ? B.lecons.filter((x) => x !== l.id) : B.lecons.concat(l.id);
          B.erreur = ""; montrer();
        } });
        boutons.push([b, l]);
        return b;
      })));
    });
    montrer();
    close = App.modal(h("div", { class: "dp-choix" },
      titre,
      h("div", { class: "pa-pour" }, ...ids.map((id) => h("button", { class: "btn small " + (id === s.id ? "violet" : "white"), onclick: () => { close(); this.choisirLecons(B, apres, id); } }, CONTENT[id].name))),
      liste,
      h("div", { class: "row", style: { justifyContent: "center" } }, h("button", { class: "btn green", onclick: () => close() }, "OK"))),
      { onClose: () => apres() });
  },

  /* ---------- sauvegarde ---------- */
  nettoyer(l) {
    if (!Array.isArray(l)) return undefined;
    const date = (v) => (typeof v === "string" && /^\d{4}-\d\d-\d\d$/.test(v) ? v : "");
    const out = l.filter((d) => d && typeof d === "object" && (d.type === "lecons" || d.type === "jours") && typeof d.recompense === "string").slice(-60).map((d) => ({
      id: typeof d.id === "string" ? d.id.slice(0, 24) : "d" + rand(1000, 9999), groupe: typeof d.groupe === "string" ? d.groupe.slice(0, 24) : "",
      cree: date(d.cree) || Revision.jour(0), type: d.type,
      lecons: Array.isArray(d.lecons) ? d.lecons.filter((x) => typeof x === "string").slice(0, this.MAX_LECONS) : [],
      jours: d.type === "jours" ? Math.min(30, Math.max(1, Math.floor(Number(d.jours) || 3))) : 0,
      fait: Array.isArray(d.fait) ? d.fait.filter((x) => typeof x === "string").slice(0, this.MAX_LECONS) : [],
      recompense: d.recompense.slice(0, this.MAX_TEXTE), ouvert: !!d.ouvert, reussi: date(d.reussi), fete: !!d.fete,
      tenu: date(d.tenu), retire: date(d.retire), ...(d.tous ? { tous: true } : {}),
    }));
    return out.length ? out : undefined;
  },
};
