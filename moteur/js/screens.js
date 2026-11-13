/* L'Atelier de Boulon — écrans : extérieur, identification, atelier, réglages. */
"use strict";

const AVATARS = ["🦊", "🐼", "🐸", "🦁", "🐯", "🐨", "🐵", "🐰", "🦄", "🐙", "🐢", "🦉", "🐧", "🐶", "🐱", "🐲"];

function starsFor(note) { return note >= 16 ? 3 : note >= 12 ? 2 : note >= 8 ? 1 : 0; }
function starsHtml(n, max = 3) { return Array.from({ length: max }, (_, i) => `<span class="${i < n ? "star-on" : "star-off"}">★</span>`).join(""); }
function totalStars(u) { return Object.values(u.lessons || {}).reduce((s, r) => s + starsFor(r.best), 0); }

/* ---------------- Réglages ---------------- */
function openSettings() {
  const st = Store.data.settings;
  const mk = (key, label) => {
    const b = h("button", { class: "btn " + (st[key] ? "green" : "white"), style: { minWidth: "130px" } }, st[key] ? "Activé" : "Coupé");
    b.addEventListener("click", () => {
      st[key] = !st[key]; Store.save();
      b.className = "btn " + (st[key] ? "green" : "white"); b.textContent = st[key] ? "Activé" : "Coupé";
      if (key === "voice" && st.voice) Voice.speak("Ma voix est activée !");
      if (key === "sound" && st.sound) Sound.good();
    });
    return h("div", { class: "row", style: { justifyContent: "space-between" } }, h("span", { style: { fontSize: "24px", fontWeight: "700" } }, label), b);
  };
  /* choix de la voix */
  const sel = h("select", { class: "field", style: { flex: "1", minWidth: "0" }, "aria-label": "Voix de Boulon" });
  const hint = h("p", { style: { fontSize: "16px", margin: "0" } });
  const fill = () => {
    Voice.refresh();
    sel.innerHTML = "";
    Voice.voices.forEach((v) => {
      const label = (Voice.isNatural(v) ? "⭐ " : "") + v.name.replace(/^Microsoft /, "").replace(/ - .*$/, "").replace(/ \(Natural\)/, " (naturelle)").replace(/ Online/, "");
      sel.appendChild(h("option", { value: v.name }, label));
    });
    if (!Voice.voices.length) sel.appendChild(h("option", { value: "" }, "Aucune voix française trouvée"));
    if (Voice.voice) sel.value = Voice.voice.name;
    const hasNatural = Voice.voices.some((v) => Voice.isNatural(v));
    hint.innerHTML = hasNatural
      ? "Les voix marquées ⭐ sont les plus humaines (elles ont besoin d'Internet)."
      : "<b>Pour une voix vraiment humaine</b>, ouvre le jeu avec <b>Microsoft Edge</b> (double-clic sur <i>Lancer.bat</i>) et une connexion Internet : les voix ⭐ Denise, Vivienne, Eloise ou Henri apparaîtront ici.";
  };
  fill();
  const onVoices = () => fill();
  window.speechSynthesis?.addEventListener?.("voiceschanged", onVoices);
  sel.addEventListener("change", () => {
    st.voiceName = sel.value; Store.save(); Voice.refresh();
    Voice.speak("Coucou ! Voici ma nouvelle voix. On apprend en s'amusant ?");
  });
  const rate = h("select", { class: "field", "aria-label": "Vitesse de la voix" },
    h("option", { value: "0.9" }, "Lente"), h("option", { value: "1" }, "Normale"), h("option", { value: "1.12" }, "Rapide"));
  rate.value = String(st.voiceRate || 1);
  rate.addEventListener("change", () => { st.voiceRate = Number(rate.value); Store.save(); Voice.speak("Est-ce que cette vitesse te convient ?"); });

  let close;
  const node = h("div", { class: "col" },
    h("h2", { class: "title dark", style: { fontSize: "34px" } }, "⚙ Réglages"),
    mk("voice", "🗣 Voix de Boulon"),
    Object.keys(window.VOICE_FILES || {}).length ? mk("recorded", `🎙 Voix enregistrée (${Object.keys(window.VOICE_FILES).length} phrases)`) : null,
    h("div", { class: "row" }, sel, rate,
      h("button", { class: "btn sky small", onclick: () => Voice.speak("Super ! Je suis Boulon, et j'adore apprendre avec toi. Prêt pour une nouvelle aventure ?") }, "▶ Tester")),
    hint,
    mk("sound", "🔔 Bruitages"),
    monnaieRow(),
    h("div", { class: "row", style: { justifyContent: "space-between", flexWrap: "wrap" } },
      h("button", { class: "btn sky", onclick: () => { close(); openBackup(); } }, "💾 Sauvegarder les élèves"),
      h("button", { class: "btn white", onclick: () => { close(); ouvrirEspaceParents(); } }, "👪 Espace parents"),
      h("button", { class: "btn", onclick: () => close() }, "Fermer")));
  close = App.modal(node, { onClose: () => window.speechSynthesis?.removeEventListener?.("voiceschanged", onVoices) });
}

/* choix de la monnaie des exercices (dirham ou euro) */
function monnaieRow() {
  const sel = h("select", { class: "field", "aria-label": "Monnaie des exercices" },
    h("option", { value: "MAD" }, "Dirham (DH)"), h("option", { value: "EUR" }, "Euro (€)"));
  sel.value = Money.code;
  sel.addEventListener("change", () => {
    Store.data.settings.monnaie = sel.value; Store.save(); Sound.click();
    Voice.speak(sel.value === "MAD" ? "Les exercices de monnaie seront en dirhams." : "Les exercices de monnaie seront en euros.");
  });
  return h("div", { class: "row", style: { justifyContent: "space-between" } },
    h("span", { style: { fontSize: "24px", fontWeight: "700" } }, "💰 Monnaie"), sel);
}

/* ---------------- Sauvegarde : exporter / importer les élèves ---------------- */
function openBackup() {
  let close;
  const msg = h("div", { style: { fontSize: "18px", minHeight: "26px", fontWeight: "700" } });
  const say = (t, ok = true) => { msg.textContent = t; msg.style.color = ok ? "#3fa34d" : "#d64545"; };
  const file = h("input", { type: "file", accept: ".json,application/json", class: "hidden" });
  const nb = Store.data.users.length;
  file.addEventListener("change", async () => {
    try {
      const { users, settings } = await Backup.lire(file.files[0]);
      const noms = users.map((u) => u.name).join(", ");
      const existants = users.filter((u) => Store.data.users.some((x) => x.id === u.id || x.name.toLowerCase() === u.name.toLowerCase())).map((u) => u.name);
      close();
      App.confirm(`Importer ${users.length} élève${users.length > 1 ? "s" : ""} : ${noms} ?` + (existants.length ? ` Attention : ${existants.join(", ")} existe${existants.length > 1 ? "nt" : ""} déjà et ser${existants.length > 1 ? "ont" : "a"} remplacé${existants.length > 1 ? "s" : ""} par la sauvegarde.` : ""), () => {
        const r = Backup.fusionner(users);
        void settings;   // les réglages de cet ordinateur (voix, monnaie…) sont conservés
        Sound.good();
        Voice.speak("La sauvegarde est restaurée !");
        App.go(App.current, App.params);
        setTimeout(() => {
          let c2;
          const n = h("div", { class: "col", style: { alignItems: "center", textAlign: "center" } },
            h("div", { style: { fontSize: "54px" } }, "✅"),
            h("p", { style: { fontSize: "22px", margin: "0" } }, `${r.ajoutes} élève${r.ajoutes > 1 ? "s" : ""} ajouté${r.ajoutes > 1 ? "s" : ""}, ${r.remplaces} remplacé${r.remplaces > 1 ? "s" : ""}.`),
            h("button", { class: "btn", onclick: () => c2() }, "Super !"));
          c2 = App.modal(n);
        }, 200);
      });
    } catch (e) { Sound.bad(); say(e.message, false); }
    file.value = "";
  });
  const node = h("div", { class: "col" },
    h("h2", { class: "title dark", style: { fontSize: "32px" } }, "💾 Sauvegarde des élèves"),
    h("p", { style: { fontSize: "18px", margin: "0" } },
      "Les progrès sont gardés dans le navigateur de cet ordinateur. Fais une sauvegarde de temps en temps : elle sert aussi à retrouver les élèves sur un autre ordinateur."),
    h("div", { class: "row", style: { flexWrap: "wrap" } },
      h("button", { class: "btn green", disabled: nb ? null : true, onclick: () => { const n = Backup.exporter(); Sound.good(); say(`Fichier enregistré dans tes Téléchargements (${n} élève${n > 1 ? "s" : ""}).`); } }, "⬇ Exporter les élèves"),
      h("button", { class: "btn sky", onclick: () => file.click() }, "⬆ Importer une sauvegarde"), file),
    h("p", { class: "muted", style: { fontSize: "16px", margin: "0" } },
      Store.data.lastBackup ? `Dernière sauvegarde : ${Store.data.lastBackup}` : "Aucune sauvegarde faite pour l'instant."),
    msg,
    h("div", { class: "row", style: { justifyContent: "flex-end" } }, h("button", { class: "btn white", onclick: () => close() }, "Fermer")));
  close = App.modal(node);
}

/* ---------------- Extérieur ---------------- */
App.register("exterieur", (root) => {
  const scene = svgEl(Art.exterior());
  root.appendChild(scene);
  /* la maison du dernier élève : ce qu'il a acheté se voit dehors (objets.js) */
  const u = Store.user;
  const dehors = Aventure.dehorsSvg(u);
  if (dehors) scene.appendChild(svgEl(`<g class="dehors">${dehors}</g>`));
  root.appendChild(h("div", { class: "abs", style: { left: "0", right: "0", top: "26px", textAlign: "center" } },
    h("h1", { class: "title", style: { fontSize: "58px" } }, "L'Atelier de Boulon"),
    h("div", { class: "title", style: { fontSize: "30px", color: "#f6c445" } }, NIVEAU.sousTitre)));
  /* « d' » devant une voyelle (Amine, Inès, Yves), « de » devant une consonne, un h (Hamza) ou un y suivi d'une voyelle (Yasmine, Youssef) */
  if (u) root.appendChild(h("div", { class: "maison-de abs" }, (/^([aeiouàâäéèêëîïôöûü]|y[^aeiouyàâäéèêëîïôöûü])/i.test(u.name) ? "La maison d'" : "La maison de ") + u.name));
  const tip = App.tooltip(root);
  const door = root.querySelector('[data-id="entrer"]');
  door.addEventListener("mouseenter", (e) => { Sound.hover(); tip.show("Entrer dans l'atelier", 520, 420); });
  door.addEventListener("mouseleave", () => tip.hide());
  door.addEventListener("click", () => { Sound.door(); App.go("identif"); });
  root.appendChild(h("button", { class: "icon-btn help", title: "Réglages", "aria-label": "Réglages", onclick: openSettings }, "⚙"));
  root.appendChild(h("button", { class: "btn green abs", style: { left: "50%", bottom: "28px", transform: "translateX(-50%)", fontSize: "28px" }, onclick: () => { Sound.door(); App.go("identif"); } }, "▶ Entrer"));
  const m = App.mascot(root, { x: 830, y: 540 });
  setTimeout(() => m.say("Bonjour ! Je suis Boulon, le petit robot inventeur. Clique sur la porte pour entrer dans mon atelier !", { speak: false, dy: -280 }), 600);
});

/* ---------------- Identification ---------------- */
App.register("identif", (root) => {
  App.backdrop(root);
  root.appendChild(h("div", { class: "screen-header" }, h("h2", { class: "title" }, "Qui vient travailler aujourd'hui ?")));
  const panel = h("div", { class: "panel abs", style: { left: "70px", right: "70px", top: "110px", bottom: "150px", overflow: "auto" } });
  root.appendChild(panel);
  const grid = h("div", { class: "user-grid" });
  panel.appendChild(grid);

  const draw = () => {
    grid.innerHTML = "";
    Store.data.users.forEach((u) => {
      const card = h("div", { class: "user-card", role: "button", tabindex: "0", title: "Choisir " + u.name },
        h("div", { class: "ava" }, u.avatar),
        h("div", { class: "name" }, u.name),
        h("div", { class: "meta" }, `★ ${totalStars(u)} étoile${totalStars(u) > 1 ? "s" : ""}`));
      const del = h("button", { class: "del", title: "Supprimer " + u.name, "aria-label": "Supprimer" }, "✕");
      del.addEventListener("click", (e) => {
        e.stopPropagation();
        const supprimer = () => App.confirm(`Supprimer ${u.name} et tous ses résultats ?`, () => { Store.removeUser(u.id); draw(); });
        if (Parents.aUnCode()) Parents.verifier(supprimer, "🔒 Supprimer " + u.name); else supprimer();
      });
      card.appendChild(del);
      const choose = () => { Sound.good(); Store.data.currentUserId = u.id; Store.save(); App.go("atelier", { welcome: true }); };
      card.addEventListener("click", choose);
      card.addEventListener("keydown", (e) => { if (e.key === "Enter") choose(); });
      grid.appendChild(card);
    });
    if (Store.data.users.length < 16) {
      grid.appendChild(h("div", { class: "user-card add", role: "button", tabindex: "0", onclick: newUser },
        h("div", { class: "ava" }, "➕"), h("div", { class: "name" }, "Nouvel élève")));
    }
  };

  function newUser() {
    Sound.click();
    let avatar = pick(AVATARS);
    const input = h("input", { class: "field", maxlength: "14", placeholder: "Ton prénom", autocomplete: "off" });
    const pickWrap = h("div", { class: "avatar-pick" });
    AVATARS.forEach((a) => {
      const b = h("button", { class: a === avatar ? "sel" : "", type: "button", "aria-label": "Avatar " + a }, a);
      b.addEventListener("click", () => { avatar = a; [...pickWrap.children].forEach((x) => x.classList.remove("sel")); b.classList.add("sel"); Sound.pop(); });
      pickWrap.appendChild(b);
    });
    const err = h("div", { style: { color: "#d64545", fontWeight: "700", minHeight: "22px" } });
    let close;
    const ok = () => {
      const name = input.value.trim().replace(/\s+/g, " ");
      if (!name) { err.textContent = "Écris ton prénom."; input.focus(); return; }
      if (Store.data.users.some((u) => u.name.toLowerCase() === name.toLowerCase())) { err.textContent = "Ce prénom existe déjà."; return; }
      const u = Store.addUser(name.charAt(0).toUpperCase() + name.slice(1), avatar);
      Store.data.currentUserId = u.id; Store.save();
      close(); Sound.fanfare();
      App.go("atelier", { welcome: true, first: true });
    };
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") ok(); });
    const node = h("div", { class: "col" },
      h("h2", { class: "title dark", style: { fontSize: "32px" } }, "Bienvenue !"),
      h("label", { style: { fontSize: "20px", fontWeight: "700" } }, "Comment t'appelles-tu ?"), input,
      h("label", { style: { fontSize: "20px", fontWeight: "700" } }, "Choisis ton personnage :"), pickWrap, err,
      h("div", { class: "row", style: { justifyContent: "flex-end" } },
        h("button", { class: "btn white", onclick: () => close() }, "Annuler"),
        h("button", { class: "btn green", onclick: ok }, "C'est moi !")));
    close = App.modal(node);
    setTimeout(() => input.focus(), 50);
  }

  draw();
  App.backButton(root, "exterieur");
  root.appendChild(h("button", { class: "btn sky abs", style: { left: "50%", bottom: "40px", transform: "translateX(-50%)" },
    onclick: () => { Sound.click(); openBackup(); } }, "💾 Sauvegarder / Restaurer"));
  root.appendChild(h("button", { class: "btn white abs", style: { left: "100px", bottom: "40px", fontSize: "18px", padding: "8px 14px" }, title: "Bilan des enfants, temps de jeu, code parent",
    onclick: ouvrirEspaceParents }, "👪 Espace parents"));
  const m = App.mascot(root, { x: 850, y: 590 });
  setTimeout(() => m.say(Store.data.users.length ? "Clique sur ton personnage, ou crée un nouvel élève." : "Crée ton personnage pour commencer !"), 300);
});

/* ---------------- L'atelier (hub) ---------------- */
/* petit haut-parleur dessiné (étiquettes, bulles) ; couleur : currentColor ou --teinte */
const ICONE_HAUT_PARLEUR = `<svg class="hp" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"></path><path d="M16.5 8.5a5 5 0 0 1 0 7"></path></svg>`;

App.register("atelier", (root, params) => {
  const u = Store.user;
  if (!u) { App.go("identif"); return; }
  if (Parents.reglages().mode === "pause" && Parents.depasse(u)) { App.go("pause"); return; }
  Aventure.demarrer(u); Aventure.journee(u);
  if (typeof Jardin !== "undefined") Jardin.maj(u);   // la plante pousse aux jours de visite
  Aventure.conclure(u);   // bonus du jour, médailles
  /* atelier en plusieurs pièces (Pieces, art.js) : on arrive dans la pièce de départ, puis on reste
     dans la dernière pièce visitée en revenant d'un écran */
  let piece = null, sensEntree = "";
  if (Pieces.liste()) {
    const avant = Pieces.courante;
    piece = (params.piece && Pieces.get(params.piece)) || (!params.welcome && !params.first && Pieces.get(avant)) || Pieces.depart();
    const ordre = Pieces.liste().map((p) => p.id);
    if (params.piece && avant && avant !== piece.id) sensEntree = ordre.indexOf(piece.id) > ordre.indexOf(avant) ? "entree-droite" : "entree-gauche";
    Pieces.courante = piece.id;
  }
  const decors = Aventure.decorsSvg(u, piece);
  const scene = svgEl(Art.atelier(piece, decors));
  if (!piece && decors) {
    const g = svgEl(`<g class="decors">${decors}</g>`);
    scene.appendChild(g);   // par-dessus le décor d'origine ; les clics passent au travers (CSS)
  }
  if (sensEntree) scene.classList.add(sensEntree);
  root.appendChild(scene);
  const tip = App.tooltip(root);
  const m = App.mascot(root, NIVEAU.mascotteAtelier || { x: 560, y: 560 });
  /* le petit plan des pièces, en haut au milieu : on clique pour changer de pièce */
  if (piece) {
    const plan = h("nav", { class: "plan-pieces", "aria-label": "Les pièces de l'atelier", style: NIVEAU.lampeBouton ? { right: "150px" } : null });
    Pieces.liste().forEach((p) => {
      const ici = p === piece;
      const b = h("button", { class: "plan-piece" + (ici ? " ici" : ""), type: "button", "aria-current": ici ? "true" : null, title: p.nom,
        onclick: () => { if (ici) { Voice.speak(`Tu es ${p.dans}.`); return; } Sound.door(); App.go("atelier", { piece: p.id }); } },
        h("span", { class: "plan-mur", style: { background: p.mur } }), p.court);
      b.addEventListener("mouseenter", () => Sound.hover());
      plan.appendChild(b);
    });
    root.appendChild(plan);
  }
  /* étiquette élève */
  root.appendChild(h("div", { class: "abs panel", style: { left: "14px", top: "14px", padding: "6px 14px", borderRadius: "16px", display: "flex", gap: "10px", alignItems: "center" } },
    h("span", { style: { fontSize: "34px" } }, u.avatar),
    h("span", { style: { fontFamily: "var(--title-font)", fontSize: "22px", fontWeight: "700" } }, u.name),
    h("span", { class: "star-on", style: { fontSize: "20px" } }, "★ " + totalStars(u)),
    h("button", { class: "av-tag", title: "Le coffre aux trésors : rang, médailles et boutique", onclick: () => { Sound.click(); App.go("aventure"); } },
      Aventure.rang(Aventure.etat(u).total).icone + " 🔩 " + Aventure.etat(u).ecrous)));
  const rev = Revision.aFaire(u);
  if (rev.total) root.appendChild(h("button", { class: "btn violet abs rev-btn", style: { left: "14px", top: "78px" }, title: "Revoir les leçons au bon moment",
    onclick: () => { Sound.click(); App.go("revision"); } }, "🔁 À réviser", h("span", { class: "badge" }, String(rev.total))));
  root.appendChild(h("button", { class: "icon-btn", style: { right: "18px", top: "18px" }, title: "Réglages", "aria-label": "Réglages", onclick: openSettings }, "⚙"));

  /* la lampe : allumée, Boulon explique à quoi sert chaque objet survolé (au CE2, c'est un objet de l'atelier ;
     avec NIVEAU.lampeBouton, c'est un petit bouton en haut à droite, qui reste allumé d'une pièce à l'autre) */
  let lampeBtn = null;
  const allumerLampe = (oui, parler) => {
    App.helpMode = oui;
    App.stage.classList.toggle("help-mode", oui);
    if (NIVEAU.lampeBouton) App.lampeGardee = oui;
    if (lampeBtn) { lampeBtn.classList.toggle("allumee", oui); lampeBtn.setAttribute("aria-pressed", String(oui)); lampeBtn.title = oui ? "Éteindre la lampe" : "Allumer la lampe : Boulon explique les objets"; }
    if (parler) {
      Sound.pop();
      m.say(oui ? "La lampe est allumée ! Passe ta souris sur les objets : je t'explique à quoi ils servent. Reclique sur la lampe pour l'éteindre." : "J'ai éteint la lampe. Clique sur un objet pour l'utiliser !");
    }
  };
  if (NIVEAU.lampeBouton) {
    lampeBtn = h("button", { class: "icon-btn lampe-btn", style: { right: "86px", top: "18px" }, type: "button", "aria-label": "La lampe", "aria-pressed": "false",
      html: `<svg viewBox="0 0 40 40" width="30" height="30" aria-hidden="true"><path d="M20 4 a12 12 0 0 1 7 21.6 v4.4 h-14 v-4.4 a12 12 0 0 1 7 -21.6 z" class="ampoule" stroke="#2b2236" stroke-width="2.6" stroke-linejoin="round"/><path d="M14 33 h12 M15.5 37 h9" stroke="#2b2236" stroke-width="2.6" stroke-linecap="round"/><path d="M17 19 l3 3 l3 -3" fill="none" stroke="#2b2236" stroke-width="2" stroke-linecap="round"/></svg>`,
      onclick: () => allumerLampe(!App.helpMode, true) });
    lampeBtn.addEventListener("mouseenter", () => Sound.hover());
    root.appendChild(lampeBtn);
    /* on change de pièce : la lampe reste comme elle était ; on revient d'un autre écran : elle est éteinte */
    if (params.piece && App.lampeGardee) allumerLampe(true, false); else App.lampeGardee = false;
  }

  root.querySelectorAll(".hot").forEach((g) => {
    const id = g.dataset.id;
    g.setAttribute("tabindex", "0");
    g.setAttribute("role", "button");
    g.setAttribute("aria-label", g.dataset.label);
    const showTip = () => {
      const r = g.getBoundingClientRect(), sr = App.stage.getBoundingClientRect(), k = 1024 / sr.width;
      const x = (r.left + r.width / 2 - sr.left) * k, y = Math.max(40, (r.top - sr.top) * k - 6);
      tip.show(App.helpMode ? `${g.dataset.label}<small>${g.dataset.desc}</small>` : g.dataset.label, x, y);
    };
    /* au survol, Boulon ne parle que lampe allumée (il explique l'objet) : dire le nom à chaque passage de la souris gênait */
    g.addEventListener("mouseenter", () => { Sound.hover(); showTip(); if (App.helpMode) m.say(g.dataset.desc); });
    g.addEventListener("focus", showTip);
    g.addEventListener("mouseleave", () => tip.hide());
    g.addEventListener("blur", () => tip.hide());
    const act = () => {
      tip.hide();
      if (id === "aide") { allumerLampe(!App.helpMode, true); return; }
      /* la porte : on sort voir sa maison (on change d'élève en rentrant) */
      if (id === "sortie") { Sound.door(); App.go("exterieur"); return; }
      /* un passage vers une autre pièce de l'atelier */
      if (id.startsWith("piece-")) { Sound.door(); App.go("atelier", { piece: id.slice(6) }); return; }
      /* un décor de la boutique (objets.js) */
      if (id.startsWith("decor-")) { Objets.agir(id.slice(6), m); return; }
      Sound.click();
      const objet = ATELIER_OBJETS.find((o) => o.id === id);
      if (objet && objet.ecran) App.go(objet.ecran, objet.params || {});
    };
    g.addEventListener("click", act);
    g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); act(); } });
    /* étiquette visible sous l'objet (CP) : un gros bouton avec un haut-parleur */
    const objet = ATELIER_OBJETS.find((o) => o.id === id);
    const e = objet ? objet.etiquette : id.startsWith("decor-") ? ETIQUETTES_DECORS[id.slice(6)] : null;
    if (NIVEAU.etiquettes && e) {
      const b = h("button", { class: "etiquette-objet", style: { left: e.x + "px", top: e.y + "px", minWidth: (e.w || 150) + "px", "--teinte": e.couleur || "#2b2236" } });
      b.innerHTML = ICONE_HAUT_PARLEUR;
      b.append(e.texte);
      b.addEventListener("mouseenter", () => { Sound.hover(); if (App.helpMode) m.say(g.dataset.desc); });
      b.addEventListener("click", act);
      root.appendChild(b);
    }
  });

  let hello;
  const T = NIVEAU.textesAtelier;
  if (piece && params.piece && piece.entree) hello = typeof piece.entree === "function" ? piece.entree(u) : piece.entree;
  else if (T) hello = params.first ? T.premier(u) : params.welcome ? (rev.total ? T.reviser(u) : T.retour(u)) : pick(T.hasard);
  else if (params.first) hello = `Bienvenue dans mon atelier, ${u.name} ! Commence par le <b>cahier</b> sur le bureau, ou fais le <b>test de la boussole</b> pour savoir par où commencer. La <b>lampe</b> t'aide si tu es perdu.`;
  else if (params.welcome) {
    const last = u.lastLesson && LESSONS[u.lastLesson];
    hello = rev.total ? `Re-bonjour ${u.name} ! Tu as des leçons à réviser aujourd'hui : clique sur le bouton <b>🔁 À réviser</b>, c'est le meilleur moyen de ne pas oublier !`
      : last ? `Re-bonjour ${u.name} ! La dernière fois, tu as travaillé « ${last.title} ». On continue avec le cahier ?` : `Re-bonjour ${u.name} ! Que veux-tu faire aujourd'hui ?`;
  } else hello = pick(["Que veux-tu faire maintenant ?", "Clique sur un objet de l'atelier !", "Besoin d'aide ? Allume la lampe."]);
  setTimeout(() => m.say(hello), 300);
});
