/* Fabrique les aperçus de la boutique : de petites photos des activités que débloque un objet
   (le jardin, l'atelier de Rivet, la machine de Boulon, le défi du jour…). La fiche d'un objet
   (moteur/js/aventure.js, AVENTURE_FICHES) les montre à l'enfant avant l'achat.

   Les photos sont prises dans le vrai jeu, par Edge sans fenêtre (profil temporaire, effacé à la
   fin), avec un élève de test qui est retiré ensuite. Elles vont dans niveaux/<niveau>/apercus/ :
   le CP et le CE2 n'ont pas les mêmes écrans (flèches ou programme pour Rivet, règle du jardin…).

   À relancer quand un de ces écrans change :  node outils-site/apercus_boutique.mjs [cp|ce2] */
import { spawn } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const RACINE = join(dirname(fileURLToPath(import.meta.url)), "..");
const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const attendre = (ms) => new Promise((r) => setTimeout(r, ms));

/* les aperçus : nom du fichier, et ce qu'il faut ouvrir dans le jeu pour le photographier */
const APERCUS = [
  ["jardin", `App.go("jardin")`],
  ["rivet", `App.go("robo-grille", { id: Robotique.missions().find((m) => m.grilles).id })`],
  ["machine", `App.go("machine")`],
  ["couleurs", `App.go("couleurs")`],
  ["defi-du-jour", `(App.go("atelier", { piece: Pieces.de("tableau", "decors") ? Pieces.de("tableau", "decors").id : undefined }), Objets.agir("tableau", __m()))`],
  ["cactus", `(App.go("atelier"), Objets.agir("cactus", __m()))`],
  ["plante", `(App.go("atelier"), Objets.agir("plante", __m()))`],
  ["affiche", `(App.go("atelier"), Objets.agir("affiche", __m()))`],
  ["fete", `App.go("atelier", { piece: Pieces.de("guirlande", "decors") ? Pieces.de("guirlande", "decors").id : undefined })`, true,
    `Objets.agir("guirlande", __m(true))`],   // après l'annonce de la pièce
];

async function lancerEdge(port) {
  const profil = mkdtempSync(join(tmpdir(), "boulon-apercus-"));
  const edge = spawn(EDGE, ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${profil}`, "--window-size=1280,800",
    "--mute-audio", "--no-first-run", "--allow-file-access-from-files", "about:blank"], { stdio: "ignore" });
  let cible;
  for (let i = 0; i < 60 && !cible; i++) {
    await attendre(200);
    try { cible = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === "page"); } catch {}
  }
  const ws = new WebSocket(cible.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener("open", r, { once: true }));
  let n = 0; const attente = new Map();
  ws.addEventListener("message", (e) => { const m = JSON.parse(e.data); if (m.id && attente.has(m.id)) { attente.get(m.id)(m); attente.delete(m.id); } });
  const cdp = (method, params = {}) => new Promise((r) => { const id = ++n; attente.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
  const evalue = async (expression) => {
    const r = await cdp("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    if (r.result?.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails).slice(0, 400));
    return r.result?.result?.value;
  };
  await cdp("Emulation.setDeviceMetricsOverride", { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
  const fermer = async () => { try { ws.close(); } catch {} edge.kill(); await attendre(1500); try { rmSync(profil, { recursive: true, force: true }); } catch {} };
  return { cdp, evalue, fermer };
}

const niveaux = process.argv[2] ? [process.argv[2]] : ["cp", "ce2"];
for (const niveau of niveaux) {
  const sortie = join(RACINE, "niveaux", niveau, "apercus");
  mkdirSync(sortie, { recursive: true });
  const e = await lancerEdge(9460 + niveaux.indexOf(niveau));
  try {
    await e.cdp("Page.navigate", { url: pathToFileURL(join(RACINE, "niveaux", niveau, "index.html")).href });
    for (let i = 0; i < 50; i++) { await attendre(200); if (await e.evalue("typeof App !== 'undefined' && !!App.current")) break; }
    /* un élève de test : tout débloqué, une plante qui pousse */
    await e.evalue(`(() => {
      Voice.speak = () => {}; Voice.survol = () => {}; Sound.fanfare = Sound.good = Sound.click = Sound.pop = () => {};
      const u = Store.addUser("Testapercus", "🦊"); Store.data.currentUserId = u.id;
      const a = Aventure.etat(u); a.demarre = true; a.dernierJour = Revision.jour(0); a.ecrous = 0;
      for (const it of AVENTURE_BOUTIQUE) if (it.type === "decor") { a.achats[it.id] = Revision.jour(0); a.places[it.id] = true; }
      const j = Jardin.etat(u); j.graines.tournesol = 1; Jardin.planter(u, "tournesol"); j.plante.jours = 4;
      /* Boulon pour l'objet qui parle : celui de l'écran est remplacé (sinon il y en aurait deux) ;
         pour une fenêtre (« Le savais-tu ? », le défi du jour), il n'a pas besoin de se montrer */
      window.__m = (visible) => {
        if (!visible) return { say() {}, hide() {} };
        document.querySelectorAll(".screen .mascot, .screen .bubble").forEach((x) => x.remove());
        return App.mascot(document.querySelector(".screen"), { x: 830, y: 540 });
      };
    })()`);
    for (const [nom, ouvrir, garderBulle, puis] of APERCUS) {
      await e.evalue(ouvrir);
      if (puis) { await attendre(2500); await e.evalue(puis); }
      await attendre(1400);
      const r = JSON.parse(await e.evalue(`JSON.stringify((() => {
        document.querySelectorAll("#toasts${garderBulle ? "" : ", .bubble"}").forEach((x) => x.remove());
        const b = App.stage.getBoundingClientRect(); return { x: b.left, y: b.top, width: b.width, height: b.height };
      })())`));
      const i = await e.cdp("Page.captureScreenshot", { format: "jpeg", quality: 72, clip: { ...r, scale: 400 / r.width } });
      writeFileSync(join(sortie, nom + ".jpg"), Buffer.from(i.result.data, "base64"));
      console.log(`${niveau}/apercus/${nom}.jpg (${await e.evalue("App.current")})`);
      await e.evalue(`document.querySelectorAll(".modal-back").forEach((x) => x.remove())`);
    }
  } finally {
    try { await e.evalue(`(() => { Store.data.users = Store.data.users.filter((x) => x.name !== "Testapercus"); Store.data.currentUserId = null; Store.save(); })()`); } catch {}
    await e.fermer();
  }
}
