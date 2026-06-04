import type { YearlyValue } from "@/types/tax";

/**
 * Zentrale, jahresabhängige Steuerwerte ("Single Source of Truth").
 *
 * WICHTIG: Diese Werte werden sowohl von den Regeln (/lib/tax/rules) als auch
 * von den Calculators (/lib/tax/calculators) verwendet. Werte, die noch amtlich
 * zu prüfen sind, sind in docs/TAX_RULES_TODO.md aufgeführt. `null` bedeutet:
 * für dieses Jahr ist kein belastbarer Wert hinterlegt.
 *
 * Verifizierungsstand siehe docs/TAX_RULES_TODO.md und docs/SOURCES.md.
 */

// ---------------------------------------------------------------------------
// Werbungskosten (Arbeitnehmer)
// ---------------------------------------------------------------------------

/** Arbeitnehmer-Pauschbetrag, § 9a Satz 1 Nr. 1a EStG. */
export const ARBEITNEHMER_PAUSCHBETRAG: YearlyValue = {
  2021: 1000,
  2022: 1200, // rückwirkend angehoben (Steuerentlastungsgesetz 2022)
  2023: 1230,
  2024: 1230,
  2025: 1230,
  2026: 1230, // zu prüfen
};

/** Entfernungspauschale: erste 20 km, § 9 Abs. 1 Nr. 4 EStG (alle Jahre 0,30 €). */
export const ENTFERNUNG_BIS_20 = 0.3;

/** Entfernungspauschale ab dem 21. Kilometer (erhöhte Pauschale). */
export const ENTFERNUNG_AB_21: YearlyValue = {
  2021: 0.35,
  2022: 0.38,
  2023: 0.38,
  2024: 0.38,
  2025: 0.38,
  2026: 0.38, // erhöhte Pendlerpauschale läuft Ende 2026 aus -> zu prüfen
};

/** Höchstbetrag Entfernungspauschale pro Jahr (Ausnahme: eigener/zur Nutzung überlassener Pkw). */
export const ENTFERNUNG_HOECHSTBETRAG = 4500;

/** Homeoffice-/Tagespauschale je Tag, § 4 Abs. 5 Nr. 6c EStG. */
export const HOMEOFFICE_PRO_TAG: YearlyValue = {
  2021: 5,
  2022: 5,
  2023: 6,
  2024: 6,
  2025: 6,
  2026: 6,
};

/** Höchstbetrag Homeoffice-/Tagespauschale pro Jahr. */
export const HOMEOFFICE_MAX: YearlyValue = {
  2021: 600,
  2022: 600,
  2023: 1260,
  2024: 1260,
  2025: 1260,
  2026: 1260,
};

/** Max. begünstigte Tage (Pauschale / Tagessatz). */
export const HOMEOFFICE_MAX_TAGE: YearlyValue = {
  2021: 120,
  2022: 120,
  2023: 210,
  2024: 210,
  2025: 210,
  2026: 210,
};

/** Jahrespauschale häusliches Arbeitszimmer (Mittelpunkt), ab 2023, § 4 Abs. 5 Nr. 6b EStG. */
export const ARBEITSZIMMER_JAHRESPAUSCHALE: YearlyValue = {
  2021: null, // bis 2022 galt der Höchstbetrag 1.250 € (siehe ARBEITSZIMMER_HOECHST_ALT)
  2022: null,
  2023: 1260,
  2024: 1260,
  2025: 1260,
  2026: 1260,
};

/** Höchstbetrag Arbeitszimmer bis 2022 (kein anderer Arbeitsplatz), § 4 Abs. 5 Nr. 6b EStG a. F. */
export const ARBEITSZIMMER_HOECHST_ALT: YearlyValue = {
  2021: 1250,
  2022: 1250,
};

/** GWG-Grenze (Netto), § 6 Abs. 2 EStG (Sofortabzug). */
export const GWG_GRENZE_NETTO: YearlyValue = {
  2021: 800,
  2022: 800,
  2023: 800,
  2024: 800,
  2025: 800,
  2026: 800, // mögliche Anhebung im Gesetzgebungsverfahren -> zu prüfen
};

/** Verpflegungsmehraufwand: Abwesenheit > 8 Std., § 9 Abs. 4a EStG. */
export const VERPFLEGUNG_8H = 14; // seit 2020
/** Verpflegungsmehraufwand: ganztägige Abwesenheit (24 Std.). */
export const VERPFLEGUNG_24H = 28; // seit 2020

// ---------------------------------------------------------------------------
// Kapitalvermögen
// ---------------------------------------------------------------------------

/** Sparer-Pauschbetrag (Einzelveranlagung), § 20 Abs. 9 EStG. */
export const SPARER_PAUSCHBETRAG: YearlyValue = {
  2021: 801,
  2022: 801,
  2023: 1000,
  2024: 1000,
  2025: 1000,
  2026: 1000,
};

// ---------------------------------------------------------------------------
// Sonderausgaben
// ---------------------------------------------------------------------------

/** Sonderausgaben-Pauschbetrag (Einzelveranlagung), § 10c EStG. */
export const SONDERAUSGABEN_PAUSCHBETRAG = 36;

/** Höchstbetrag Erstausbildungskosten als Sonderausgaben, § 10 Abs. 1 Nr. 7 EStG. */
export const ERSTAUSBILDUNG_SONDERAUSGABEN_MAX = 6000;

/** Kinderbetreuungskosten: abziehbarer Anteil, § 10 Abs. 1 Nr. 5 EStG. */
export const KINDERBETREUUNG_ANTEIL: YearlyValue = {
  2021: 2 / 3,
  2022: 2 / 3,
  2023: 2 / 3,
  2024: 2 / 3,
  2025: 0.8, // ab 2025 angehoben (Jahressteuergesetz 2024)
  2026: 0.8,
};

/** Kinderbetreuungskosten: Höchstbetrag je Kind. */
export const KINDERBETREUUNG_MAX: YearlyValue = {
  2021: 4000,
  2022: 4000,
  2023: 4000,
  2024: 4000,
  2025: 4800, // ab 2025 angehoben
  2026: 4800,
};

/** Schulgeld: abziehbarer Anteil, § 10 Abs. 1 Nr. 9 EStG. */
export const SCHULGELD_ANTEIL = 0.3;
/** Schulgeld: Höchstbetrag je Kind. */
export const SCHULGELD_MAX = 5000;

// ---------------------------------------------------------------------------
// Außergewöhnliche Belastungen / Pauschbeträge
// ---------------------------------------------------------------------------

/** Pflege-Pauschbetrag nach Pflegegrad, § 33b Abs. 6 EStG (seit 2021). */
export const PFLEGE_PAUSCHBETRAG = {
  pg2: 600,
  pg3: 1100,
  pg4_5_hilflos: 1800,
} as const;

/**
 * Behinderten-Pauschbetrag nach Grad der Behinderung (GdB),
 * § 33b Abs. 3 EStG (Werte seit Veranlagungszeitraum 2021 verdoppelt).
 */
export const BEHINDERTEN_PAUSCHBETRAG: Record<number, number> = {
  20: 384,
  30: 620,
  40: 860,
  50: 1140,
  60: 1440,
  70: 1780,
  80: 2120,
  90: 2460,
  100: 2840,
};
/** Erhöhter Pauschbetrag für hilflose und blinde Menschen (Merkzeichen H, Bl, TBl). */
export const BEHINDERTEN_PAUSCHBETRAG_HILFLOS = 7400;

// ---------------------------------------------------------------------------
// Steuerermäßigungen § 35a / § 35c EStG (direkter Abzug von der Steuerschuld)
// ---------------------------------------------------------------------------

/** Haushaltsnahe Dienstleistungen: 20 %, Höchst-Ermäßigung 4.000 €, § 35a Abs. 2 EStG. */
export const HAUSHALTSNAHE_DL = { prozent: 0.2, maxErmaessigung: 4000 } as const;
/** Handwerkerleistungen (nur Lohnanteil): 20 %, Höchst-Ermäßigung 1.200 €, § 35a Abs. 3 EStG. */
export const HANDWERKER = { prozent: 0.2, maxErmaessigung: 1200 } as const;
/** Haushaltsnahe Minijobs: 20 %, Höchst-Ermäßigung 510 €, § 35a Abs. 1 EStG. */
export const HAUSHALTSNAHE_MINIJOB = { prozent: 0.2, maxErmaessigung: 510 } as const;
/** Energetische Sanierung selbstgenutzter Gebäude, § 35c EStG: 20 % über 3 Jahre, max. 40.000 € je Objekt. */
export const ENERGETISCHE_SANIERUNG = {
  prozentGesamt: 0.2,
  maxErmaessigung: 40000,
  verteilung: [0.07, 0.07, 0.06] as const, // Jahr 1, 2, 3
} as const;

// ---------------------------------------------------------------------------
// Familie
// ---------------------------------------------------------------------------

/** Entlastungsbetrag für Alleinerziehende (Grundbetrag), § 24b EStG. */
export const ENTLASTUNGSBETRAG_ALLEINERZIEHEND: YearlyValue = {
  2021: 4008, // Corona-bedingte Anhebung
  2022: 4008,
  2023: 4260, // dauerhaft angehoben (Jahressteuergesetz 2022)
  2024: 4260,
  2025: 4260,
  2026: 4260,
};
/** Erhöhung je weiterem Kind, § 24b Abs. 2 Satz 2 EStG. */
export const ENTLASTUNGSBETRAG_JE_WEITERES_KIND = 240;

/**
 * Höchstbetrag Unterhalt an bedürftige Personen, § 33a Abs. 1 EStG
 * (entspricht dem Grundfreibetrag des jeweiligen Jahres).
 */
export const UNTERHALT_HOECHSTBETRAG: YearlyValue = {
  2021: 9744,
  2022: 10347,
  2023: 10908,
  2024: 11604,
  2025: 12096, // rückwirkend angehoben (Steuerfortentwicklungsgesetz) -> zu prüfen
  2026: 12348, // geplant -> zu prüfen
};

// ---------------------------------------------------------------------------
// Ehrenamt
// ---------------------------------------------------------------------------

/** Übungsleiterpauschale, § 3 Nr. 26 EStG (seit 2021: 3.000 €). */
export const UEBUNGSLEITERPAUSCHALE = 3000;
/** Ehrenamtspauschale, § 3 Nr. 26a EStG (seit 2021: 840 €). */
export const EHRENAMTSPAUSCHALE = 840;

// ---------------------------------------------------------------------------
// Spenden
// ---------------------------------------------------------------------------

/** Spenden: abziehbar bis 20 % des Gesamtbetrags der Einkünfte, § 10b Abs. 1 EStG. */
export const SPENDEN_ANTEIL_HOECHST = 0.2;
