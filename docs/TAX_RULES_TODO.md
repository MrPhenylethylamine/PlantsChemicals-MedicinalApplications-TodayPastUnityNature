# TAX_RULES_TODO.md – noch amtlich zu prüfende Werte

Dieses Dokument listet alle steuerlichen Werte auf, die **vor produktivem
Einsatz anhand amtlicher Quellen des jeweiligen Veranlagungsjahres verifiziert**
werden müssen. Im Tool sind diese Positionen mit dem Badge „Wert zu prüfen“ bzw.
einem Warnhinweis gekennzeichnet (`confidenceLevel: "needs_verification"` oder
`updateStatus: "annual_update_required"`).

> Keine erfundenen Beträge: Wo kein belastbarer Jahreswert vorliegt, ist der Wert
> im Code `null` (führt im UI zum Hinweis „zu prüfen“).

## Stand der hinterlegten, als „verifiziert“ markierten Kernwerte

Die folgenden Werte gelten als gut belegt (Quelle: EStG / langjährige Praxis),
sollten aber bei Rechtsänderungen nachgezogen werden:

- Arbeitnehmer-Pauschbetrag: 2021 = 1.000 €, 2022 = 1.200 €, ab 2023 = 1.230 €
- Entfernungspauschale: 0,30 €/km (1–20 km); ab 21. km 2021 = 0,35 €,
  2022–2026 = 0,38 €; Höchstbetrag 4.500 €
- Homeoffice-/Tagespauschale: bis 2022 = 5 €/Tag (max. 600 €), ab 2023 =
  6 €/Tag (max. 1.260 €, 210 Tage)
- Arbeitszimmer-Jahrespauschale (Mittelpunkt) ab 2023 = 1.260 €
- GWG-Grenze 800 € netto
- Sparer-Pauschbetrag: bis 2022 = 801 €, ab 2023 = 1.000 € (Verdoppelung
  bei Zusammenveranlagung)
- Kinderbetreuung: bis 2024 = 2/3, max. 4.000 €; ab 2025 = 80 %, max. 4.800 €
- Schulgeld: 30 %, max. 5.000 €
- § 35a: haushaltsnahe DL 20 %/max. 4.000 €; Handwerker 20 %/max. 1.200 €;
  Minijob 20 %/max. 510 €
- § 35c: 20 % über 3 Jahre (7/7/6), max. 40.000 €
- Übungsleiterpauschale 3.000 €; Ehrenamtspauschale 840 € (seit 2021)
- Pflege-Pauschbetrag: PG2 = 600 €, PG3 = 1.100 €, PG4/5/hilflos = 1.800 €
- Behinderten-Pauschbeträge (Tabelle seit 2021), hilflos/blind 7.400 €

## ⚠️ Ausdrücklich zu verifizieren

### 1. Vorsorgeaufwendungen – Höchstbeträge (`so-vorsorge`)
- `confidenceLevel: needs_verification`
- Höchstbetrag für Altersvorsorgeaufwendungen ist jährlich anzupassen
  (orientiert am Höchstbeitrag zur knappschaftlichen Rentenversicherung).
- **Zu prüfen je Jahr 2021–2026** und im Code (`lib/tax/rules/sonderausgaben.ts`)
  als `maximumAmount` zu ergänzen.
- Quelle: § 10 Abs. 3 EStG, jährliche BMF-Bekanntgaben.

### 2. Unterhalt-Höchstbetrag = Grundfreibetrag (`agb-unterhalt`)
- `UNTERHALT_HOECHSTBETRAG` in `lib/tax/constants.ts`
- Verifiziert: 2021 = 9.744 €, 2022 = 10.347 €, 2023 = 10.908 €, 2024 = 11.604 €
- **Zu prüfen:** 2025 (hinterlegt 12.096 €, rückwirkende Anhebung) und
  2026 (hinterlegt 12.348 €, geplant). Quelle: § 32a EStG / Steuerfort­entwicklungs­gesetz.

### 3. Entfernungspauschale ab 2027 (`ENTFERNUNG_AB_21`)
- Die erhöhte Pauschale (0,38 € ab 21. km) ist befristet bis Ende 2026.
- **Zu prüfen:** Wert ab 2027 (im Tool aktuell nur bis 2026 hinterlegt).

### 4. GWG-Grenze (`GWG_GRENZE_NETTO`)
- Aktuell 800 € netto für alle Jahre.
- **Zu prüfen:** etwaige Anhebung durch laufende Gesetzgebungsverfahren.

### 5. Kinderfreibeträge (`fam-kinderfreibetrag`)
- `confidenceLevel: needs_verification`
- Konkrete Kinderfreibeträge/BEA-Freibeträge je Jahr noch nicht als Beträge
  hinterlegt (nur Günstigerprüfungs-Logik beschrieben).
- **Zu prüfen / zu ergänzen:** Beträge 2021–2026. Quelle: § 32 Abs. 6 EStG.

### 6. Gebäude-AfA / degressive AfA Neubau (`vuv-afa`)
- `confidenceLevel: needs_verification`
- AfA-Sätze (2 %, 3 %) und degressive AfA für Neubauten (ab 2023) sind je nach
  Bauantrag/Fertigstellung differenziert; im Tool nur qualitativ beschrieben.
- **Zu prüfen / zu ergänzen:** konkrete Sätze und Zeiträume. Quelle: § 7 Abs. 4,
  Abs. 5a EStG.

### 7. Entlastungsbetrag Alleinerziehende ab 2023 (`ENTLASTUNGSBETRAG_ALLEINERZIEHEND`)
- Hinterlegt: 2021/2022 = 4.008 €, ab 2023 = 4.260 €, +240 € je weiterem Kind.
- **Zu prüfen:** unveränderte Fortgeltung 2025/2026. Quelle: § 24b EStG.

### 8. Jahr 2026 generell
- 2026 ist im UI als „noch nicht vollständig geprüft“ markiert.
- Alle 2026-Werte sind vorläufig und vor Nutzung amtlich zu bestätigen.

## Pflegeprozess

1. Wert in `lib/tax/constants.ts` bzw. in der jeweiligen Regel aktualisieren.
2. `lastVerifiedDate` und ggf. `confidenceLevel` der Regel anpassen.
3. Quelle in `docs/SOURCES.md` ergänzen.
4. Unit-Test in `tests/` ergänzen/anpassen.
