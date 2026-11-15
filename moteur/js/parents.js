/* L'Atelier de Boulon — espace parents.
   - Journal : temps et séries de chaque jour, activités récentes (par élève).
   - Code parent à 4 chiffres (protection contre les clics d'enfant, pas un vrai secret).
   - Bilan par enfant : temps sur 14 jours, points forts, à travailler, conseil, activité récente.
   - Limite de temps par jour : rappel, ou pause jusqu'au lendemain (déblocage par le code).
     Par défaut : 30 minutes, puis pause (l'enlever passe par le code : c'est le choix du parent).
   - Rythme des visites (série, médailles « Régulier » et « Assidu ») : une visite par semaine par défaut.
   - Jours où l'atelier est ouvert, heure du coucher de Boulon (écran de nuit jusqu'à 7 h).
   Ces réglages valent pour tous les enfants (Store.data.parents) ; un enfant peut avoir les siens
   (u.reglages, mêmes clés). Le code parent et la sauvegarde restent communs à la famille. */
"use strict";

/* ================================================================== */
/* Journal d'activité                                                  */
/* ================================================================== */
const Journal = {
  JOURS_GARDES: 90,
  RECENTS: 40,
  etat(u) {
    if (!u.journal || typeof u.journal !== "object") u.journal = {};
    const j = u.journal;
    if (!j.jours || typeof j.jours !== "object" || Array.isArray(j.jours)) j.jours = {};
    if (!Array.isArray(j.recents)) j.recents = [];
    return j;
  },
  jour(u, d = Revision.jour(0)) {
    const j = this.etat(u);
    if (!j.jours[d]) {
      j.jours[d] = { min: 0, series: 0 };
      const limite = Revision.jour(-this.JOURS_GARDES);
      for (const k of Object.keys(j.jours)) if (k < limite) delete j.jours[k];
    }
    return j.jours[d];
  },
  minute(u) { this.jour(u).min += 1; },
  /* date lisible pour un parent : aujourd'hui, hier, ou jj/mm */
  dateFr(iso) {
    if (!iso) return "";
    if (iso === Revision.jour(0)) return "aujourd'hui";
    if (iso === Revision.jour(-1)) return "hier";
    const [, m, d] = iso.split("-");
    return `le ${d}/${m}`;
  },
  /* type : lecon, revision, defi, boussole, mission */
  noter(u, type, id, note, extra) {
    if (!u) return;
    const j = this.etat(u);
    this.jour(u).series += 1;
    const t = new Date();
    j.recents.push({ d: Revision.jour(0), h: `${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`, t: type, id: id || null, note, x: extra || null });
    if (j.recents.length > this.RECENTS) j.recents.splice(0, j.recents.length - this.RECENTS);
    Store.save();
  },
  nettoyer(j) {
    if (!j || typeof j !== "object") return undefined;
    const jours = {};
    for (const [k, v] of Object.entries(j.jours || {})) {
      if (/^\d{4}-\d\d-\d\d$/.test(k) && v && typeof v === "object") jours[k] = { min: Math.max(0, Math.floor(Number(v.min) || 0)), series: Math.max(0, Math.floor(Number(v.series) || 0)), bonus: Math.max(0, Math.floor(Number(v.bonus) || 0)), ...(v.ouvert ? { ouvert: true } : {}) };
    }
    const types = new Set(["lecon", "revision", "defi", "boussole", "mission"]);
    const recents = (Array.isArray(j.recents) ? j.recents : []).filter((r) => r && types.has(r.t)).slice(-this.RECENTS).map((r) => ({
      d: /^\d{4}-\d\d-\d\d$/.test(r.d) ? r.d : "", h: /^\d\d:\d\d$/.test(r.h) ? r.h : "", t: r.t,
      id: typeof r.id === "string" && /^[\w-]{1,40}$/.test(r.id) ? r.id : null, note: Number(r.note) || 0, x: typeof r.x === "string" ? r.x.slice(0, 40) : null,
    }));
    return { jours, recents };
  },
};

/* ================================================================== */
/* Code parent et limite de temps                                      */
/* ================================================================== */
/* les jours : 0 = dimanche … 6 = samedi (Date.getDay) ; affichés du lundi au dimanche */
const PA_ORDRE = [1, 2, 3, 4, 5, 6, 0];
const PA_JOURS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
const PA_REVEIL = 7 * 60;   // le matin, l'atelier rouvre à 7 h
const paHeure = (m) => `${Math.floor(m / 60)} h${m % 60 ? " " + String(m % 60).padStart(2, "0") : ""}`;
const paJoursValides = (v) => (Array.isArray(v) ? [...new Set(v.filter((x) => Number.isInteger(x) && x >= 0 && x <= 6))] : null);

const Parents = {
  CLES: ["rythme", "joursSemaine", "ouverts", "limite", "mode", "coucher"],
  /* une valeur de réglage est-elle correcte ? */
  valide(k, v) {
    if (k === "rythme") return ["jour", "jours", "semaine"].includes(v);
    if (k === "joursSemaine") return !!paJoursValides(v) && paJoursValides(v).length > 0;
    if (k === "ouverts") return !!paJoursValides(v);
    if (k === "limite") return Number.isInteger(v) && v >= 0 && v <= 600;
    if (k === "mode") return v === "pause" || v === "rappel";
    if (k === "coucher") return v === null || (Number.isInteger(v) && v >= 0 && v < 1440);
    return false;
  },
  copier(r) { return Object.fromEntries(this.CLES.map((k) => [k, Array.isArray(r[k]) ? [...r[k]] : r[k]])); },
  /* les réglages d'un enfant (sauvegarde) : seulement des valeurs correctes, sinon rien */
  nettoyerReglages(r) {
    if (!r || typeof r !== "object" || Array.isArray(r)) return undefined;
    const g = this.reglages(), o = {};
    for (const k of this.CLES) o[k] = this.valide(k, r[k]) ? (Array.isArray(r[k]) ? paJoursValides(r[k]) : r[k]) : (Array.isArray(g[k]) ? [...g[k]] : g[k]);
    return o;
  },
  /* l'enfant a-t-il ses propres réglages ? */
  propres(u) { return !!(u && u.reglages && typeof u.reglages === "object" && !Array.isArray(u.reglages)); },
  /* les réglages qui s'appliquent à l'enfant : les siens, sinon ceux de tous */
  pour(u) {
    const g = this.reglages();
    if (!this.propres(u)) return g;
    const r = u.reglages;
    for (const k of this.CLES) if (!this.valide(k, r[k])) r[k] = Array.isArray(g[k]) ? [...g[k]] : g[k];
    return r;
  },
  reglages() {
    if (!Store.data.parents || typeof Store.data.parents !== "object") Store.data.parents = {};
    const p = Store.data.parents;
    /* 15/11/2026 : une séance de 30 minutes puis pause, par défaut (avant : pas de limite). Une limite
       déjà choisie par le parent est gardée. */
    if (!(p.version >= 2)) { if (!p.limite) { p.limite = 30; p.mode = "pause"; } p.version = 2; }
    if (typeof p.limite !== "number") p.limite = 30;         // minutes par jour (une séance), 0 = pas de limite
    if (p.mode !== "rappel") p.mode = "pause";               // rappel | pause
    if (!["jour", "jours", "semaine"].includes(p.rythme)) p.rythme = "semaine";   // rythme des visites (Aventure)
    if (!(paJoursValides(p.joursSemaine) || []).length) p.joursSemaine = [3, 6];  // « certains jours » : mercredi, samedi
    if (!paJoursValides(p.ouverts)) p.ouverts = [0, 1, 2, 3, 4, 5, 6];           // jours où l'atelier est ouvert
    if (!this.valide("coucher", p.coucher)) p.coucher = null;                     // heure du coucher (minutes), null = pas d'heure
    return p;
  },
  empreinte(code) {
    let a = 0x811c9dc5;
    for (const c of "atelier-boulon:" + code) a = Math.imul(a ^ c.charCodeAt(0), 16777619);
    return (a >>> 0).toString(36);
  },
  aUnCode() { return !!this.reglages().code; },

  /* clavier à chiffres ; titre, puis rappel(code) quand 4 chiffres sont tapés */
  clavier(titre, sousTitre, rappel, extra) {
    let code = "", close;
    const points = h("div", { class: "pin-points" });
    const msg = h("div", { class: "pin-msg" }, sousTitre || "");
    const dessiner = () => { points.innerHTML = [0, 1, 2, 3].map((i) => `<i class="${i < code.length ? "on" : ""}"></i>`).join(""); };
    const api = {
      erreur(t) { msg.textContent = t; msg.classList.add("err"); code = ""; dessiner(); Sound.bad(); box.classList.add("secoue"); setTimeout(() => box.classList.remove("secoue"), 400); },
      fermer() { close(); },
    };
    const taper = (c) => {
      if (c === "⌫") code = code.slice(0, -1);
      else if (code.length < 4) code += c;
      Sound.click(); dessiner();
      if (code.length === 4) { const v = code; setTimeout(() => rappel(v, api), 150); }
    };
    const touches = h("div", { class: "pin-touches" },
      ...["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"].map((c) => (c ? h("button", { class: "pin-touche", type: "button", onclick: () => taper(c) }, c) : h("span"))));
    const box = h("div", { class: "col pin" }, h("h2", { class: "title dark" }, titre), msg, points, touches,
      h("div", { class: "row", style: { justifyContent: "center", gap: "10px" } }, extra || null, h("button", { class: "btn white small", onclick: () => close() }, "Annuler")));
    const clavierPhysique = (e) => {
      if (/^\d$/.test(e.key)) taper(e.key); else if (e.key === "Backspace") taper("⌫"); else return;
      e.preventDefault(); e.stopPropagation();
    };
    document.addEventListener("keydown", clavierPhysique, true);
    close = App.modal(box, { onClose: () => document.removeEventListener("keydown", clavierPhysique, true) });
    const fermer = close;
    close = () => { document.removeEventListener("keydown", clavierPhysique, true); fermer(); };
    dessiner();
    return api;
  },
  /* choisir un nouveau code (deux fois) */
  nouveauCode(ensuite) {
    this.clavier("👪 Choisis un code parent", "4 chiffres, que les enfants ne connaissent pas.", (c1, k1) => {
      k1.fermer();
      this.clavier("👪 Confirme le code", "Tape le même code une deuxième fois.", (c2, k2) => {
        if (c2 !== c1) { k2.erreur("Les deux codes sont différents. Recommence."); return; }
        this.reglages().code = this.empreinte(c1); Store.save();
        k2.fermer(); Sound.good(); ensuite && ensuite();
      });
    });
  },
  /* code oublié : une multiplication d'adulte, puis un nouveau code */
  oublie(ensuite) {
    const a = rand(23, 89), b = rand(13, 47);
    const champ = h("input", { class: "field", inputmode: "numeric", autocomplete: "off", style: { width: "180px", textAlign: "center" } });
    const err = h("div", { class: "pin-msg err" });
    let close;
    const valider = () => {
      if (Number(champ.value.replace(/\s/g, "")) === a * b) { close(); this.nouveauCode(ensuite); }
      else { err.textContent = "Ce n'est pas le bon résultat."; Sound.bad(); }
    };
    champ.addEventListener("keydown", (e) => { if (e.key === "Enter") valider(); });
    close = App.modal(h("div", { class: "col", style: { alignItems: "center", textAlign: "center" } },
      h("h2", { class: "title dark", style: { fontSize: "28px" } }, "Code oublié"),
      h("p", { style: { fontSize: "20px", margin: 0 } }, "Pour vérifier que tu es un adulte, calcule :"),
      h("p", { style: { fontSize: "34px", fontWeight: "700", margin: 0 } }, `${a} × ${b} = ?`), champ, err,
      h("div", { class: "row" }, h("button", { class: "btn white", onclick: () => close() }, "Annuler"), h("button", { class: "btn green", onclick: valider }, "Valider"))));
    setTimeout(() => champ.focus(), 50);
  },
  /* demande le code (ou le fait créer la première fois), puis ensuite() */
  verifier(ensuite, titre = "👪 Espace parents") {
    if (!this.aUnCode()) { this.nouveauCode(ensuite); return; }
    const k = this.clavier(titre, "Tape le code parent.", (c, api) => {
      if (this.empreinte(c) !== this.reglages().code) { api.erreur("Ce n'est pas le bon code."); return; }
      api.fermer(); Sound.good(); ensuite();
    }, h("button", { class: "btn white small", onclick: () => { k.fermer(); this.oublie(ensuite); } }, "Code oublié ?"));
  },

  /* ---------- jours d'ouverture et coucher ---------- */
  maintenant() { return new Date(); },          // (les tests le remplacent)
  jourSemaine(d = Revision.jour(0)) { return new Date(d + "T12:00:00").getDay(); },
  /* les jours où l'atelier est ouvert pour l'enfant (les jours du rendez-vous le sont toujours) */
  ouvertsDe(u) {
    const R = this.pour(u), o = new Set(R.ouverts);
    if (R.rythme === "jours") R.joursSemaine.forEach((j) => o.add(j));
    return o;
  },
  ouvertAujourdhui(u) { return this.ouvertsDe(u).has(this.jourSemaine()) || !!Journal.jour(u).ouvert; },
  /* le prochain jour d'ouverture (de rendez-vous, s'il y en a) : « demain », « mercredi », ou null */
  prochainJour(u) {
    const R = this.pour(u), cibles = R.rythme === "jours" ? new Set(R.joursSemaine) : this.ouvertsDe(u), auj = this.jourSemaine();
    for (let k = 1; k <= 7; k++) if (cibles.has((auj + k) % 7)) return k === 1 ? "demain" : PA_JOURS[(auj + k) % 7];
    return null;
  },
  /* Boulon dort-il ? (après l'heure du coucher, jusqu'à 7 h ; le code du parent le réveille 30 minutes) */
  nuit(u) {
    const c = this.pour(u).coucher;
    if (c === null || (u.reveil && u.reveil > Date.now())) return false;
    const t = this.maintenant(), m = t.getHours() * 60 + t.getMinutes();
    return c > PA_REVEIL ? m >= c || m < PA_REVEIL : m >= c && m < PA_REVEIL;
  },
  /* ce qui empêche de jouer maintenant : "nuit", "ferme", "pause" ou null */
  bloque(u) {
    if (!u) return null;
    if (this.nuit(u)) return "nuit";
    if (!this.ouvertAujourdhui(u)) return "ferme";
    if (this.pour(u).mode === "pause" && this.depasse(u)) return "pause";
    return null;
  },

  /* ---------- limite de temps ---------- */
  minutesAujourdhui(u) { return Journal.jour(u).min; },
  limiteDe(u) { const p = this.pour(u); return p.limite ? p.limite + (Journal.jour(u).bonus || 0) : 0; },
  depasse(u) { const l = this.limiteDe(u); return !!l && this.minutesAujourdhui(u) >= l; },
  /* appelé chaque minute de jeu */
  surveiller(u) {
    if (["pause", "parents", "nuit", "ferme"].includes(App.current)) return;
    const b = this.bloque(u);
    if (b === "nuit" || b === "ferme") { App.go(b); return; }
    const p = this.pour(u);
    if (!p.limite || !this.depasse(u)) return;
    if (p.mode === "pause") { App.go("pause"); return; }
    const j = Journal.jour(u);
    const m = this.minutesAujourdhui(u);
    if (j.rappel && m - j.rappel < 15) return;     // un rappel toutes les 15 minutes au plus
    j.rappel = m; Store.save();
    const node = h("div", { class: "col", style: { alignItems: "center", textAlign: "center", maxWidth: "520px" } },
      h("div", { style: { width: "120px", height: "136px" }, html: Art.boulon() }),
      h("h2", { class: "title dark", style: { fontSize: "30px", margin: 0 } }, "C'est l'heure d'une pause !"),
      h("p", { style: { fontSize: "21px", margin: 0 } }, `Tu as bien travaillé : ${m} minutes aujourd'hui. Va te dégourdir les jambes, et reviens demain !`),
      h("button", { class: "btn green", onclick: () => close() }, "D'accord !"));
    const close = App.modal(node);
    Voice.speak("C'est l'heure d'une pause ! Tu as bien travaillé aujourd'hui. Va te dégourdir les jambes, et reviens demain !");
  },
};

/* ================================================================== */
/* Écran de pause (limite de temps atteinte, mode « pause »)           */
/* ================================================================== */
App.register("pause", (root) => {
  const u = Store.user; if (!u) return App.go("identif");
  App.backdrop(root);
  const box = h("div", { class: "panel abs", style: { left: "170px", right: "170px", top: "130px", textAlign: "center", padding: "24px 30px" } },
    h("div", { style: { width: "150px", height: "170px", margin: "0 auto" }, html: Art.boulon() }),
    h("h2", { class: "title dark", style: { fontSize: "36px", margin: "6px 0" } }, `Bravo ${u.name}, c'est l'heure de la pause !`),
    h("p", { style: { fontSize: "22px" } }, `Tu as travaillé ${Parents.minutesAujourdhui(u)} minutes aujourd'hui. L'atelier se repose jusqu'à demain. À bientôt !`),
    h("div", { class: "row", style: { justifyContent: "center", gap: "12px", marginTop: "10px" } },
      h("button", { class: "btn sky", onclick: () => { Store.data.currentUserId = null; Store.save(); App.go("identif"); } }, "🚪 Changer d'élève"),
      h("button", { class: "btn white", onclick: () => Parents.verifier(() => { Journal.jour(u).bonus = (Journal.jour(u).bonus || 0) + 30; Store.save(); App.go("atelier"); }, "👪 Encore 30 minutes ?") }, "👪 Débloquer (parent)")));
  root.appendChild(box);
  setTimeout(() => Voice.speak("Bravo, c'est l'heure de la pause ! L'atelier se repose jusqu'à demain. À bientôt !"), 300);
});

/* ================================================================== */
/* Écrans de nuit (Boulon dort) et de jour fermé                       */
/* ================================================================== */
function ecranAtelierFerme(root, nuit) {
  const u = Store.user; if (!u) return App.go("identif");
  if (Parents.bloque(u) !== (nuit ? "nuit" : "ferme")) return App.go("atelier");
  App.backdrop(root);
  if (nuit) {
    const etoiles = Array.from({ length: 14 }, (_, i) => `<circle cx="${40 + (i * 137) % 860}" cy="${20 + (i * 53) % 120}" r="${2 + i % 3}" fill="#fff6c8"/>`).join("");
    root.append(h("div", { class: "abs pa-ciel" }),
      h("div", { class: "abs pa-etoiles", html: `<svg viewBox="0 0 900 170" width="100%" height="170" aria-hidden="true">${etoiles}<circle cx="780" cy="80" r="46" fill="#fff1b0"/><circle cx="802" cy="66" r="44" fill="#262f5c"/></svg>` }));
  }
  const c = Parents.pour(u).coucher, t = Parents.maintenant(), m = t.getHours() * 60 + t.getMinutes();
  const prochain = Parents.prochainJour(u);
  const texte = nuit
    ? `${c !== null && m >= c ? `Il est plus de ${paHeure(c)}` : "Il est tard"} : Boulon est allé se coucher, et toi aussi bientôt ! L'atelier rouvre demain matin. Bonne nuit, ${u.name} !`
    : `Boulon range ses outils. ${prochain ? `Ton prochain rendez-vous : ${prochain}.` : "Demande à tes parents quand l'atelier ouvrira."} Ton jardin et ta série t'attendent.`;
  const ouvrir = () => Parents.verifier(() => {
    if (nuit) u.reveil = Date.now() + 30 * 60000; else Journal.jour(u).ouvert = true;
    Store.save(); App.go("atelier");
  }, nuit ? "👪 Réveiller Boulon 30 minutes ?" : "👪 Ouvrir l'atelier aujourd'hui ?");
  root.appendChild(h("div", { class: "panel abs pa-ferme" + (nuit ? " nuit" : "") },
    h("div", { class: "pa-ferme-boulon" }, h("div", { html: Art.boulon(null, { dort: nuit }) }), nuit ? h("span", { class: "pa-zzz" }, "Z z z") : null),
    h("h2", { class: "title dark" }, nuit ? "Chut… Boulon dort !" : "Aujourd'hui, l'atelier est fermé"),
    h("p", null, texte),
    h("div", { class: "row", style: { justifyContent: "center", gap: "12px", marginTop: "10px" } },
      h("button", { class: "btn sky", onclick: () => { Store.data.currentUserId = null; Store.save(); App.go("identif"); } }, "🚪 Changer d'élève"),
      h("button", { class: "btn white", onclick: ouvrir }, nuit ? "👪 Réveiller Boulon (parent)" : "👪 Ouvrir quand même (parent)"))));
  setTimeout(() => Voice.speak(nuit ? "Chut… Boulon dort ! L'atelier rouvre demain matin. Bonne nuit !"
    : `Aujourd'hui, l'atelier est fermé. ${prochain ? `Ton prochain rendez-vous : ${prochain}.` : ""} Ton jardin et ta série t'attendent.`), 300);
}
App.register("nuit", (root) => ecranAtelierFerme(root, true));
App.register("ferme", (root) => ecranAtelierFerme(root, false));

/* ================================================================== */
/* Le résumé des réglages, en une phrase pour le parent                 */
/* ================================================================== */
/* « le mercredi et le samedi », « le mercredi, le samedi ou le dimanche » (du lundi au dimanche) */
function paListeJours(jours, mot = "et") {
  const l = PA_ORDRE.filter((j) => jours.includes(j)).map((j) => `le <b>${PA_JOURS[j]}</b>`);
  return l.length <= 1 ? l.join("") : l.slice(0, -1).join(", ") + ` ${mot} ` + l[l.length - 1];
}
function paResume(R) {
  const o = Parents.copier(R), tous = [0, 1, 2, 3, 4, 5, 6];
  const ouverts = new Set(o.ouverts);
  if (o.rythme === "jours") o.joursSemaine.forEach((j) => ouverts.add(j));
  const fermes = tous.filter((j) => !ouverts.has(j));
  let t;
  if (o.rythme === "semaine") t = "rendez-vous <b>une fois par semaine</b>" + (fermes.length ? `, ${paListeJours([...ouverts], "ou")} (fermé les autres jours)` : "");
  else if (o.rythme === "jour") t = fermes.length ? `rendez-vous <b>chaque jour d'ouverture</b> : ${paListeJours([...ouverts])}` : "rendez-vous <b>tous les jours</b>";
  else {
    const libres = [...ouverts].filter((j) => !o.joursSemaine.includes(j));
    t = `rendez-vous ${paListeJours(o.joursSemaine)}`;
    if (libres.length) t += ` (jeu libre ${paListeJours(libres)})`;
    if (fermes.length) t += ", fermé les autres jours";
  }
  t += o.limite ? `, <b>${o.limite} minutes</b> par séance, puis ${o.mode === "pause" ? "l'atelier se repose jusqu'au lendemain" : "Boulon propose une pause"}.` : ", <b>sans limite de temps</b>.";
  if (o.coucher !== null) t += ` Boulon se couche à <b>${paHeure(o.coucher)}</b>.`;
  return t;
}

/* ================================================================== */
/* Bilan d'un enfant                                                   */
/* ================================================================== */
const virgule = (x) => String(Math.round(x * 10) / 10).replace(".", ",");
const TYPES_ACTIVITE = { lecon: "📒 Leçon", revision: "🔁 Révision", defi: "🦊 Défi", boussole: "🧭 Boussole", mission: "🌍 Mission" };

function bilanEnfant(u) {
  const j = Journal.etat(u);
  const jours = [...Array(14)].map((_, i) => { const d = Revision.jour(i - 13); const v = j.jours[d] || {}; return { d, min: v.min || 0, series: v.series || 0 }; });
  const semaine = jours.slice(7);
  const lecons = Object.entries(u.lessons || {}).filter(([id]) => LESSONS[id]);
  const moyenne = lecons.length ? lecons.reduce((s, [, r]) => s + r.best, 0) / lecons.length : null;
  /* chapitres : moyenne des meilleures notes des leçons travaillées */
  const chapitres = [];
  for (const s of Object.values(CONTENT)) for (const c of s.chapters) {
    const faites = c.lessons.filter((l) => u.lessons[l.id]);
    chapitres.push({ s, c, faites: faites.length, total: c.lessons.length, moy: faites.length ? faites.reduce((a, l) => a + u.lessons[l.id].best, 0) / faites.length : null });
  }
  const forts = chapitres.filter((x) => x.moy != null && x.moy >= 14 && x.faites >= Math.min(2, x.total)).sort((a, b) => b.moy - a.moy).slice(0, 4);
  /* leçons à retravailler : note faible, mémoire basse ou beaucoup d'erreurs gardées */
  const erreursPar = {};
  for (const e of (u.erreurs || [])) erreursPar[e.l] = (erreursPar[e.l] || 0) + 1;
  const faibles = lecons.map(([id, r]) => ({ id, r, err: erreursPar[id] || 0, score: r.best - 2 * (erreursPar[id] || 0) }))
    .filter((x) => x.r.best < 12 || x.err >= 3).sort((a, b) => a.score - b.score).slice(0, 5);
  const pasCommences = chapitres.filter((x) => x.faites === 0);
  const derniere = j.recents.length ? j.recents[j.recents.length - 1].d : null;
  return { jours, semaine, lecons, moyenne, chapitres, forts, faibles, pasCommences, derniere,
    minSemaine: semaine.reduce((s, x) => s + x.min, 0), seriesSemaine: semaine.reduce((s, x) => s + x.series, 0),
    joursActifs: semaine.filter((x) => x.min > 0 || x.series > 0).length };
}

/* conseils simples, écrits pour un parent */
function conseilsPour(u, b) {
  const out = [];
  const total = Object.keys(LESSONS).length;
  if (!b.lecons.length) return [`${u.name} n'a pas encore fait de leçon. Le test de la boussole (dans l'atelier) est un bon point de départ : il propose des leçons adaptées.`];
  if (!b.joursActifs) out.push(`Sur les 7 derniers jours, ${u.name} n'a pas joué : c'est le moment de reprendre le rendez-vous.`);
  else if (b.joursActifs <= 1 && Parents.pour(u).rythme === "jour") out.push(`Sur les 7 derniers jours, ${u.name} a joué un seul jour. Quelques minutes chaque jour valent mieux qu'une longue séance par semaine.`);
  else if (b.joursActifs >= 4) out.push(`Belle régularité : ${b.joursActifs} jours d'activité sur les 7 derniers.`);
  if (b.faibles.length) out.push(`À revoir ensemble : « ${LESSONS[b.faibles[0].id].title} »${b.faibles[1] ? ` et « ${LESSONS[b.faibles[1].id].title} »` : ""}. Le bouton « Réviser » du cahier les repropose automatiquement.`);
  const rev = Revision.aFaire(u);
  if (rev.total >= 5) out.push(`${rev.total} révisions attendent ${u.name} : une révision de 10 questions prend environ 5 minutes.`);
  const fr = b.chapitres.filter((x) => x.s.id === "fr"), ma = b.chapitres.filter((x) => x.s.id === "math");
  const nfr = fr.reduce((s, x) => s + x.faites, 0), nma = ma.reduce((s, x) => s + x.faites, 0);
  if (nfr + nma >= 4 && (nfr === 0 || nma === 0 || nfr / (nfr + nma) < 0.25 || nma / (nfr + nma) < 0.25)) {
    out.push(`${u.name} travaille surtout ${nfr > nma ? "le français" : "les maths"} : pensez à proposer aussi ${nfr > nma ? "les maths" : "le français"}.`);
  }
  if (b.forts.length) out.push(`Point fort : « ${b.forts[0].c.title} » (${CONTENT[b.forts[0].s.id].name}), avec ${virgule(b.forts[0].moy)}/20 de moyenne.`);
  if (b.lecons.length >= total) out.push("Toutes les leçons ont été travaillées : bravo ! Les défis contre Zigzag et les révisions entretiennent les acquis.");
  return out.slice(0, 4);
}

/* graphique : minutes par jour sur 14 jours (une seule série, barres fines, survol) */
function graphiqueMinutes(jours) {
  const W = 620, H = 170, G = 34, B = 26, top = 16;
  const max = Math.max(10, ...jours.map((x) => x.min));
  const pas = max <= 20 ? 5 : max <= 60 ? 15 : max <= 120 ? 30 : 60;
  const haut = Math.ceil(max / pas) * pas;
  const y = (v) => top + (H - top - B) * (1 - v / haut);
  const slot = (W - G) / jours.length, larg = Math.min(24, slot - 8);
  const nomJour = (d) => ["di", "lu", "ma", "me", "je", "ve", "sa"][new Date(d + "T12:00:00").getDay()];
  let svg = `<svg class="graph-min" viewBox="0 0 ${W} ${H}" role="img" aria-label="Minutes de jeu par jour sur les 14 derniers jours">`;
  for (let v = 0; v <= haut; v += pas) svg += `<line x1="${G}" x2="${W}" y1="${y(v)}" y2="${y(v)}" class="grille"/><text x="${G - 6}" y="${y(v) + 4}" class="axe" text-anchor="end">${v}</text>`;
  const maxJour = jours.reduce((m, x) => (x.min > m.min ? x : m), jours[0]);
  jours.forEach((x, i) => {
    const cx = G + slot * i + slot / 2, x0 = cx - larg / 2, h = (H - top - B) * (x.min / haut), y0 = H - B - h;
    const r = Math.min(4, h);
    const path = h > 0 ? `M${x0} ${H - B} V${y0 + r} Q${x0} ${y0} ${x0 + r} ${y0} H${x0 + larg - r} Q${x0 + larg} ${y0} ${x0 + larg} ${y0 + r} V${H - B} Z` : "";
    const info = `${Journal.dateFr(x.d).replace(/^le /, "")} : ${x.min} min, ${x.series} série${x.series > 1 ? "s" : ""}`;
    svg += `<g class="barre" data-info="${escapeHtml(info)}"><rect x="${cx - slot / 2}" y="${top}" width="${slot}" height="${H - top - B}" fill="transparent"/>${path ? `<path d="${path}"/>` : ""}`;
    if (x === maxJour && x.min > 0) svg += `<text x="${cx}" y="${y0 - 5}" class="val" text-anchor="middle">${x.min}</text>`;
    svg += `<text x="${cx}" y="${H - 8}" class="axe${i === 13 ? " auj" : ""}" text-anchor="middle">${i === 13 ? "auj." : nomJour(x.d)}</text></g>`;
  });
  return svg + `<line x1="${G}" x2="${W}" y1="${H - B}" y2="${H - B}" class="base"/></svg>`;
}

/* ================================================================== */
/* Écran : espace parents                                              */
/* ================================================================== */
App.register("parents", (root, params) => {
  App.backdrop(root);
  root.appendChild(h("div", { class: "screen-header" }, h("h2", { class: "title" }, "👪 Espace parents")));
  const users = Store.data.users;
  const choisi = users.find((u) => u.id === params.id) || users[0];
  const vue = params.vue || (choisi ? "bilan" : "reglages");

  /* colonne de gauche : enfants + réglages */
  const gauche = h("div", { class: "panel abs pa-gauche" });
  users.forEach((u) => gauche.appendChild(h("button", { class: "pa-enfant" + (vue === "bilan" && u === choisi ? " on" : ""), onclick: () => App.go("parents", { id: u.id }) },
    h("span", { class: "ava" }, u.avatar), h("span", null, u.name,
      Parents.propres(u) ? h("span", { class: "pa-propre", title: "réglages propres à cet enfant" }, " ⚙") : null))));
  if (!users.length) gauche.appendChild(h("p", { style: { fontSize: "16px" } }, "Aucun élève pour l'instant."));
  gauche.appendChild(h("button", { class: "pa-enfant reg" + (vue === "reglages" ? " on" : ""), onclick: () => App.go("parents", { id: choisi && choisi.id, vue: "reglages" }) },
    h("span", { class: "ava" }, "⚙"), h("span", null, "Réglages")));
  root.appendChild(gauche);

  const droite = h("div", { class: "panel abs pa-droite" });
  root.appendChild(droite);

  if (vue === "reglages") {
    /* pour qui : tous les enfants, ou un enfant (ses propres réglages, ou ceux de tous) */
    const pour = users.find((u) => u.id === params.pour) || null;
    const g = Parents.reglages(), propre = !!pour && Parents.propres(pour);
    const R = pour ? Parents.pour(pour) : g;
    const modifiable = !pour || propre;
    const recharger = () => App.go("parents", { id: choisi && choisi.id, vue: "reglages", pour: pour ? pour.id : undefined });
    /* plusLibre : allonger la séance, enlever la limite, retarder le coucher → le code est redemandé */
    const changer = (fn, plusLibre, titre) => {
      if (!modifiable) return;
      const faire = () => { fn(R); Store.save(); Sound.click(); recharger(); };
      if (plusLibre) Parents.verifier(faire, titre); else faire();
    };
    const bouton = (txt, on, onclick, cls = "") => h("button", { class: `btn small ${on ? "violet" : "white"} ${cls}`, disabled: !modifiable, onclick }, txt);
    const ligne = (...b) => h("div", { class: "pa-choix" }, ...b);
    const aide = (t) => h("p", { class: "pa-aide" }, t);
    const nom = (u) => `<b>${escapeHtml(u.name)}</b>`;
    const autres = users.filter((u) => Parents.propres(u));

    droite.appendChild(h("div", { class: "pa-pour" }, h("b", null, "Pour qui ?"),
      h("button", { class: "btn small " + (pour ? "white" : "violet"), onclick: () => App.go("parents", { id: choisi && choisi.id, vue: "reglages" }) }, "👨‍👩‍👧 Tous les enfants"),
      ...users.map((u) => h("button", { class: "btn small " + (u === pour ? "violet" : "white"), onclick: () => App.go("parents", { id: choisi && choisi.id, vue: "reglages", pour: u.id }) },
        `${u.avatar} ${u.name}${Parents.propres(u) ? " ⚙" : ""}`))));
    const resume = !pour ? `Pour tous les enfants : ${paResume(R)}` + (autres.length ? `<br>Sauf ${autres.map(nom).join(", ").replace(/, ([^,]*)$/, " et $1")}, qui ${autres.length > 1 ? "ont leurs" : "a ses"} propres réglages.` : "")
      : propre ? `${nom(pour)} a ses propres réglages : ${paResume(R)}` : `${nom(pour)} suit les réglages de tous les enfants : ${paResume(R)}`;
    droite.appendChild(h("div", { class: "pa-bloc conseil pa-resume" }, h("h4", null, "🤖 En résumé"), h("p", { html: resume })));
    if (pour) droite.appendChild(h("div", { class: "pa-bandeau" }, propre
      ? [h("span", null, `Ces réglages ne valent que pour ${pour.name}.`),
        h("button", { class: "btn small white", onclick: () => { delete pour.reglages; Store.save(); Sound.click(); recharger(); } }, "↩ Revenir aux réglages de tous")]
      : [h("span", null, `${pour.name} suit les réglages de tous les enfants.`),
        h("button", { class: "btn small violet", onclick: () => { pour.reglages = Parents.copier(g); Store.save(); Sound.click(); recharger(); } }, `✏️ Des réglages propres à ${pour.name}`)]));

    const corps = h("div", { class: modifiable ? "" : "pa-gris" });
    /* le rythme */
    corps.append(h("h3", { class: "pa-titre" }, "🗓 Le rythme des visites"),
      aide("Le jardin, la série et les médailles « Régulier » et « Assidu » avancent à chaque visite (un jour où l'enfant joue). Rien ne se perd entre deux visites."),
      ligne(...[["semaine", "📅 Une fois par semaine"], ["jour", "☀️ Tous les jours"], ["jours", "✔️ Certains jours"]].map(([v, t]) =>
        bouton(t, R.rythme === v, () => changer((r) => { r.rythme = v; })))));
    if (R.rythme === "jours") corps.append(aide("Les jours du rendez-vous (ils comptent pour la série) :"),
      ligne(...PA_ORDRE.map((j) => { const on = R.joursSemaine.includes(j);
        return bouton((on ? "✔ " : "") + PA_JOURS[j].slice(0, 3), on, () => changer((r) => { if (on && r.joursSemaine.length > 1) r.joursSemaine = r.joursSemaine.filter((x) => x !== j); else if (!on) r.joursSemaine.push(j); })); })));
    /* les jours d'ouverture */
    const rdv = R.rythme === "jours" ? R.joursSemaine : [];
    corps.append(h("h3", { class: "pa-titre" }, "🚪 Les jours où l'atelier est ouvert"),
      aide(R.rythme === "jours" ? "Les jours du rendez-vous sont toujours ouverts. Un autre jour ouvert, c'est du jeu libre : il ne compte pas pour la série et ne la casse pas."
        : "Un jour fermé, Boulon dit à l'enfant quand revenir. Les jours fermés ne cassent jamais la série."),
      ligne(...PA_ORDRE.map((j) => {
        const court = PA_JOURS[j].slice(0, 3);
        if (rdv.includes(j)) return h("button", { class: "btn small violet pa-rdv", disabled: true, title: "jour du rendez-vous : toujours ouvert" }, "🔒✔ " + court);
        const on = R.ouverts.includes(j);
        return bouton((on ? "✔ " : "✖ ") + court, on, () => changer((r) => { r.ouverts = on ? r.ouverts.filter((x) => x !== j) : [...r.ouverts, j]; }));
      })));
    /* la durée d'une séance */
    const plusLong = (v) => !v || (R.limite && v > R.limite);
    corps.append(h("h3", { class: "pa-titre" }, "⏱ Durée d'une séance"),
      aide("Le temps est compté pour chaque enfant, seulement quand la fenêtre du jeu est affichée."),
      ligne(...[20, 30, 45, 60, 90, 0].map((v) => bouton(v ? v + " min" : "Pas de limite", R.limite === v, () => {
        if (R.limite === v) return;
        const faire = () => changer((r) => { r.limite = v; }, plusLong(v), v ? `🔒 Allonger la séance à ${v} minutes ?` : "🔒 Enlever la limite ?");
        if (v) { faire(); return; }
        /* enlever la limite : on explique d'abord, puis le code */
        const close = App.modal(h("div", { class: "col", style: { alignItems: "center", textAlign: "center", maxWidth: "560px" } },
          h("h2", { class: "title dark", style: { fontSize: "30px", margin: 0 } }, "👪 Enlever la limite ?"),
          h("p", { style: { fontSize: "20px", margin: 0 } }, "Sans limite, l'enfant peut jouer aussi longtemps qu'il le veut. À cet âge, des séances courtes et régulières aident mieux à apprendre."),
          h("p", { style: { fontSize: "20px", margin: 0 } }, "C'est votre choix : confirmez avec votre code parent."),
          h("div", { class: "row" }, h("button", { class: "btn white", onclick: () => close() }, `Garder ${R.limite ? R.limite + " minutes" : "la limite"}`),
            h("button", { class: "btn violet", onclick: () => { close(); faire(); } }, "🔒 Taper mon code"))));
      }))),
      aide("Quand la séance est finie :"),
      ligne(...[["pause", "🛑 L'atelier se repose jusqu'au lendemain"], ["rappel", "🔔 Boulon propose une pause"]].map(([v, t]) =>
        bouton(t, R.mode === v, () => changer((r) => { r.mode = v; }, v === "rappel" && R.mode !== "rappel", "🔒 Seulement un rappel ?")))));
    /* l'heure du coucher */
    const plusTard = (v) => v === null ? R.coucher !== null : R.coucher !== null && v > R.coucher;
    corps.append(h("h3", { class: "pa-titre" }, "🌙 L'heure du coucher de Boulon"),
      aide("À cette heure-là, Boulon va se coucher : l'atelier passe en mode nuit jusqu'au lendemain, 7 h. Votre code permet de le réveiller pour 30 minutes."),
      ligne(...[19 * 60, 19 * 60 + 30, 20 * 60, 20 * 60 + 30, 21 * 60, null].map((v) => bouton(v === null ? "Pas d'heure" : paHeure(v), R.coucher === v,
        () => { if (R.coucher !== v) changer((r) => { r.coucher = v; }, plusTard(v), v === null ? "🔒 Pas d'heure de coucher ?" : `🔒 Coucher à ${paHeure(v)} ?`); }))),
      aide("Allonger la séance, enlever la limite ou retarder le coucher redemande votre code."));
    droite.appendChild(corps);
    /* commun à toute la famille */
    if (!pour) droite.append(
      h("h3", { class: "pa-titre" }, "🔒 Code parent"),
      h("p", { class: "pa-aide" }, "Un seul code pour toute la famille. Il protège cet espace et la suppression d'un élève. C'est une protection contre les clics d'enfant, pas un mot de passe : ne réutilisez pas un code important."),
      h("div", { class: "pa-choix" }, h("button", { class: "btn small white", onclick: () => Parents.nouveauCode(recharger) }, "Changer le code")),
      h("h3", { class: "pa-titre" }, "💾 Sauvegarde"),
      h("p", { class: "pa-aide" }, Store.data.lastBackup ? `Dernière sauvegarde : ${Store.data.lastBackup}.` : "Aucune sauvegarde pour l'instant. Pensez à exporter les élèves de temps en temps."),
      h("div", { class: "pa-choix" }, h("button", { class: "btn small sky", onclick: () => openBackup() }, "💾 Sauvegarder / Restaurer")));
  } else if (choisi) {
    const u = choisi, b = bilanEnfant(u);
    const a = typeof Aventure !== "undefined" ? Aventure.etat(u) : null;
    const rang = a ? Aventure.rang(a.total) : null;
    droite.appendChild(h("div", { class: "pa-entete" },
      h("span", { class: "pa-ava" }, u.avatar),
      h("div", null, h("h3", null, u.name), h("small", null,
        (b.derniere ? `Dernière activité : ${Journal.dateFr(b.derniere)}` : "Pas encore d'activité enregistrée") + (rang ? ` • ${rang.icone} ${rang.nom}` : ""))),
      h("div", { class: "pa-actions" },
        h("button", { class: "btn small white", onclick: () => window.print() }, "🖨 Imprimer"),
        h("button", { class: "btn small sky", onclick: () => Backup.exporter(u.id) }, "💾 Sauvegarder"),
        ...PARENTS_ACTIONS.map((f) => f(u)))));
    const tuile = (val, lib) => h("div", { class: "pa-tuile" }, h("b", null, val), h("small", null, lib));
    droite.appendChild(h("div", { class: "pa-tuiles" },
      tuile(`${b.minSemaine} min`, "de jeu sur 7 jours"),
      tuile(String(b.seriesSemaine), `série${b.seriesSemaine > 1 ? "s" : ""} sur 7 jours`),
      tuile(`${b.joursActifs}/7`, "jours actifs"),
      tuile(b.moyenne == null ? "—" : `${virgule(b.moyenne)}/20`, "moyenne des leçons"),
      tuile(`${b.lecons.length}/${Object.keys(LESSONS).length}`, "leçons travaillées"),
      tuile(`★ ${totalStars(u)}`, "étoiles")));

    const cadreGraph = h("div", { class: "pa-graph" }, h("h4", null, "Minutes de jeu par jour (14 derniers jours)"));
    const zone = h("div", { class: "pa-graph-zone", html: graphiqueMinutes(b.jours) });
    const bulle = h("div", { class: "pa-bulle hidden" });
    zone.appendChild(bulle);
    zone.querySelectorAll(".barre").forEach((g) => {
      g.addEventListener("pointerenter", () => {
        bulle.textContent = g.dataset.info; bulle.classList.remove("hidden");
        const r = g.getBoundingClientRect(), z = zone.getBoundingClientRect(), k = zone.offsetWidth / z.width;
        bulle.style.left = ((r.left + r.width / 2 - z.left) * k) + "px";
        g.classList.add("survol");
      });
      g.addEventListener("pointerleave", () => { bulle.classList.add("hidden"); g.classList.remove("survol"); });
    });
    cadreGraph.appendChild(zone);
    droite.appendChild(cadreGraph);

    const conseils = conseilsPour(u, b);
    droite.appendChild(h("div", { class: "pa-bloc conseil" }, h("h4", null, "🤖 Le conseil de Boulon"), ...conseils.map((c) => h("p", null, c))));

    const colonnes = h("div", { class: "pa-colonnes" });
    const forts = h("div", { class: "pa-bloc" }, h("h4", null, "💪 Points forts"));
    if (b.forts.length) b.forts.forEach((x) => forts.appendChild(h("p", null, h("span", { class: "pa-pastille", style: { background: x.c.color } }), `${x.c.title} — ${virgule(x.moy)}/20`)));
    else forts.appendChild(h("p", { class: "pa-vide" }, "Pas encore assez de leçons pour le dire."));
    const faibles = h("div", { class: "pa-bloc" }, h("h4", null, "🎯 À retravailler"));
    if (b.faibles.length) b.faibles.forEach((x) => faibles.appendChild(h("p", null, h("span", { class: "pa-pastille", style: { background: LESSONS[x.id].chapter.color } }),
      `${LESSONS[x.id].title} — ${x.r.best}/20${x.err ? ` • ${x.err} erreur${x.err > 1 ? "s" : ""} à corriger` : ""}`)));
    else faibles.appendChild(h("p", { class: "pa-vide" }, b.lecons.length ? "Rien de particulier : tout va bien !" : "Pas encore de leçon travaillée."));
    colonnes.append(forts, faibles);
    droite.appendChild(colonnes);

    if (b.pasCommences.length) droite.appendChild(h("div", { class: "pa-bloc" }, h("h4", null, "🌱 Pas encore commencé"),
      h("p", null, b.pasCommences.map((x) => `${x.c.title} (${CONTENT[x.s.id].name})`).join(" • "))));

    const recents = Journal.etat(u).recents.slice(-10).reverse();
    const tab = h("div", { class: "pa-bloc" }, h("h4", null, "🕘 Activité récente"));
    if (recents.length) {
      const t = h("table", { class: "pa-table" });
      t.innerHTML = `<tr><th>Quand</th><th>Activité</th><th>Détail</th><th class="n">Résultat</th></tr>` + recents.map((r) => {
        const quoi = r.t === "lecon" && LESSONS[r.id] ? LESSONS[r.id].title : r.t === "defi" ? (findChapter(r.id) || {}).title || "" : r.t === "mission" ? (r.x || "") : r.t === "revision" ? "10 questions" : "Test de niveau";
        const res = r.t === "mission" ? `${"★".repeat(r.note)}${"☆".repeat(3 - r.note)}` : r.t === "defi" ? `${r.note}/20${r.x ? " • " + r.x : ""}` : `${r.note}/20`;
        return `<tr><td>${escapeHtml(Journal.dateFr(r.d).replace(/^le /, ""))} ${escapeHtml(r.h)}</td><td>${TYPES_ACTIVITE[r.t] || ""}</td><td>${escapeHtml(quoi)}</td><td class="n">${escapeHtml(res)}</td></tr>`;
      }).join("");
      tab.appendChild(t);
    } else tab.appendChild(h("p", { class: "pa-vide" }, "L'activité est enregistrée à partir de cette version du jeu."));
    droite.appendChild(tab);
  }
  App.backButton(root, params.retour || "identif");
});

/* entrée de l'espace parents (bouton de l'écran des élèves et des réglages) */
/* boutons ajoutés par les modules dans la fiche d'un enfant : (u) => bouton ou null
   (ex. « Offrir Rivet », modules/robotique) */
const PARENTS_ACTIONS = [];

function ouvrirEspaceParents() { Sound.click(); Parents.verifier(() => App.go("parents", {})); }
