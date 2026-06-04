# Einkommensteuer-Helper Deutschland

Ein interaktiver, laienverständlicher und quellenbasierter **Einkommensteuer-
Assistent** für Privatpersonen in Deutschland. Das Tool hilft systematisch zu
verstehen, **welche Ausgaben absetzbar sind**, unter welchen Voraussetzungen,
**bis zu welchen Beträgen**, mit welchen **Nachweisen**, ob eine **rückwirkende**
Geltendmachung möglich ist und ob es sich **lohnt**.

> ⚠️ **Keine Steuerberatung.** Siehe [`docs/DISCLAIMER.md`](./docs/DISCLAIMER.md).

## Was das Tool kann

- **Einstiegsassistent** mit Schritt-für-Schritt-Führung und Fortschrittsanzeige
- **Veranlagungsjahr** (2021–2026) mit jahresabhängigen Pauschalen, Höchst­beträgen
  und Fristen
- **Profilanalyse**: Lebenslagen auswählen → relevante Steuerbereiche werden
  automatisch freigeschaltet
- **Regelbasierte Rule-Engine** mit strukturierten Datensätzen je Steuerposition
- **Interaktive Checklisten & Live-Rechner**: Höchstbeträge, Pauschalen,
  anteilige Abzüge, zumutbare Belastung, direkte Steuerermäßigungen
- **Intelligente Warn- und Plausibilitätslogik** (z. B. unbare Zahlung,
  unrealistische Arbeitstage, überschrittene Höchstbeträge)
- **Begriffserklärungen**: durchsuchbares Glossar + Tooltips
- **Fristen- & Rückwirkungsprüfung** (grün/gelb/rot/grau) nach AO/EStG
- **Steuerwirkungs-Schätzung** (Grenzsteuersatz, zu versteuerndes Einkommen)
- **Ergebnisbericht** mit Belegliste, Risiken, nächsten Schritten – exportierbar
  als Markdown/PDF (Druck)
- **Privacy-first**: kein Tracking, lokale Speicherung (LocalStorage)

## Tech-Stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** mit eigener, shadcn-ähnlicher UI-Primitive-Bibliothek
- **Zod** (Validierung), **Zustand** (State + LocalStorage-Persistenz)
- **Vitest** (Unit-Tests), **Playwright** (E2E)

## Schnellstart

```bash
npm install        # Abhängigkeiten installieren
npm run dev        # Dev-Server: http://localhost:3000
```

Weitere Skripte:

```bash
npm run build      # Produktions-Build
npm run start      # Produktionsserver
npm run typecheck  # TypeScript prüfen
npm run lint       # ESLint
npm run test       # Vitest (Unit-Tests der Rule-Engine)
npm run test:e2e   # Playwright (zentrale Nutzer-Flows; lädt Browser beim 1. Lauf)
```

## Projektstruktur

```
app/                      Next.js App Router (Layout, Seite)
components/
  ui/                     UI-Primitive (Card, Button, Badge, Tooltip, …)
  wizard/                 Assistent (Schritte, App-Shell)
  forms/                  PositionCard (Eingabe + Live-Berechnung je Regel)
  report/                 Ergebnisbericht
  glossary/               Glossar
  fristen/                Fristen-/Rückwirkungs-Check
  tax-rules/              Disclaimer
lib/
  tax/
    rules/                Rule-Engine: alle Steuerregeln (nach Kategorie)
    calculators/          Berechnungsfunktionen (inkl. zumutbare Belastung)
    validators/           Plausibilitäts-/Statuslogik
    fristen/              Festsetzungsfrist-/Rückwirkungslogik
    sources/              zentrales Quellenregister
    glossary/             Glossardaten
    constants.ts          jahresabhängige Werte (Single Source of Truth)
    report.ts             Berichtsaufbau + Markdown-Export
    profile.ts            Personentypen/Lebenslagen
  schema.ts               Zod-Schemata
  store.ts                Zustand-Store (LocalStorage)
types/                    zentrale Typdefinitionen (TaxRule, …)
tests/                    Vitest-Unit-Tests + tests/e2e (Playwright)
docs/                     SOURCES.md, TAX_RULES_TODO.md, DISCLAIMER.md
```

## Architektur der Rule-Engine

Jede Steuerposition ist ein strukturierter `TaxRule`-Datensatz
(`types/tax.ts`) mit u. a.: Rechtsgrundlage, Quellen, laienverständlicher
Erklärung, Steuer-Mechanismus, anwendbaren Personentypen, Voraussetzungen,
Ausschlusskriterien, Betragslogik (`amountType`, Höchst-/Frei-/Pauschbeträge,
Anteile), Nachweisen, betroffener Anlage, Rückwirkungs-/Fristenlogik, typischen
Fehlern, Audit-Risiko, Nutzerfragen, optionalem `calculatorKey`, Warnungen sowie
`confidenceLevel`/`updateStatus`/`lastVerifiedDate`.

**Alle Beträge stammen aus der zentralen Datenhaltung** (`lib/tax/constants.ts`
und die Regeln) – nichts ist im UI hartkodiert. So lassen sich Rechtsänderungen
leicht einpflegen.

## Datenstand & Verifizierung

Die hinterlegten Kernwerte sind nach bestem Wissen recherchiert. Werte, die noch
amtlich zu bestätigen sind, sind im Tool markiert und in
[`docs/TAX_RULES_TODO.md`](./docs/TAX_RULES_TODO.md) gelistet. Quellen:
[`docs/SOURCES.md`](./docs/SOURCES.md).

## Lizenz / Haftung

Ohne Gewähr. Maßgeblich sind die amtlichen Werte des jeweiligen
Veranlagungsjahres. Dieses Tool ersetzt keine individuelle Steuerberatung.
