# Deployment-Anleitung

Der Einkommensteuer-Helper ist eine reine Frontend-App (Next.js, alles läuft
clientseitig, keine Datenbank, keine Umgebungsvariablen, kein Server-State).
Dadurch lässt er sich überall in wenigen Minuten kostenlos veröffentlichen.

---

## Option A — Vercel (empfohlen, 1-Klick)

Vercel ist vom Next.js-Hersteller und erkennt das Projekt automatisch.

**Schnellweg (Button):**

1. Im README auf **„Deploy with Vercel"** klicken (oder diese URL öffnen):
   <https://vercel.com/new/clone?repository-url=https://github.com/MrPhenylethylamine/PlantsChemicals-MedicinalApplications-TodayPastUnityNature/tree/claude/epic-hypatia-1oSxh>
2. Mit GitHub anmelden und den Import bestätigen.
3. **Deploy** klicken – keine Einstellungen nötig.
4. Nach ~1 Minute erhältst du eine öffentliche URL wie
   `einkommensteuer-helper-xxxx.vercel.app`.

**Manueller Weg:**

1. [vercel.com](https://vercel.com) → „Add New… → Project".
2. Repo importieren, Branch `claude/epic-hypatia-1oSxh` wählen.
3. Framework wird als **Next.js** erkannt → **Deploy**.

> Build-Command: `npm run build` · Output: automatisch (Next.js) ·
> Install: `npm install`. Nichts davon musst du eintragen – es ist Default.

---

## Option B — Netlify

1. [app.netlify.com](https://app.netlify.com) → „Add new site → Import an existing project".
2. Repo + Branch `claude/epic-hypatia-1oSxh` wählen.
3. Build-Command: `npm run build` · Publish-Verzeichnis: `.next`
   (das offizielle `@netlify/plugin-nextjs` wird automatisch verwendet).
4. **Deploy site**.

---

## Option C — Cloudflare Pages

1. Cloudflare Dashboard → „Workers & Pages → Create → Pages → Connect to Git".
2. Repo + Branch wählen, Preset **Next.js**.
3. Deploy.

---

## Option D — Lokal (zum schnellen Ausprobieren)

Voraussetzung: Node.js ≥ 18.

```bash
git clone https://github.com/MrPhenylethylamine/PlantsChemicals-MedicinalApplications-TodayPastUnityNature.git
cd PlantsChemicals-MedicinalApplications-TodayPastUnityNature
git checkout claude/epic-hypatia-1oSxh
npm install
npm run dev      # http://localhost:3000
```

Für einen produktionsnahen lokalen Lauf:

```bash
npm run build && npm run start   # http://localhost:3000
```

---

## Hinweise

- **Datenschutz:** Es werden keine Daten an einen Server gesendet. Eingaben
  bleiben im LocalStorage des Browsers. Ein Deploy verändert daran nichts.
- **Kosten:** Für dieses kleine Projekt reichen die kostenlosen Tarife von
  Vercel/Netlify/Cloudflare vollständig aus.
- **Custom Domain:** Lässt sich bei allen Anbietern nachträglich in den
  Projekteinstellungen verbinden.
