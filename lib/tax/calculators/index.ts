import type { CalculationContext, CalculationResult } from "@/types/tax";
import { valueForYear, round2 } from "@/lib/tax/values";
import { zumutbareBelastung } from "./zumutbareBelastung";
import * as C from "@/lib/tax/constants";

/**
 * Calculator-Registry. Jede Regel kann über `calculatorKey` auf eine dieser
 * Funktionen verweisen. Eine Calculator-Funktion nimmt den Kontext (Jahr,
 * Eingaben, optional Grenzsteuersatz/Einkommen) und liefert ein einheitliches
 * Ergebnis inkl. Erklärungen und Warnungen.
 */
export type CalculatorFn = (ctx: CalculationContext) => CalculationResult;

function num(ctx: CalculationContext, key: string, fallback = 0): number {
  const v = ctx.inputs[key];
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) return Number(v);
  return fallback;
}

function bool(ctx: CalculationContext, key: string): boolean {
  return ctx.inputs[key] === true || ctx.inputs[key] === "true";
}

/** Hängt die geschätzte Steuerersparnis an ein Ergebnis (für Abzugsbeträge). */
function withSaving(ctx: CalculationContext, result: CalculationResult): CalculationResult {
  if (ctx.marginalTaxRate && result.directTaxReduction === undefined) {
    result.estimatedTaxSaving = round2(result.deductibleAmount * ctx.marginalTaxRate);
  }
  return result;
}

const empty = (): CalculationResult => ({
  inputAmount: 0,
  deductibleAmount: 0,
  nonDeductibleAmount: 0,
  explanation: [],
  warnings: [],
});

// ---------------------------------------------------------------------------
// Werbungskosten Arbeitnehmer
// ---------------------------------------------------------------------------

/** Entfernungspauschale: 0,30 €/km (1.–20. km) + erhöhter Satz ab 21. km. */
export const entfernungspauschale: CalculatorFn = (ctx) => {
  const km = num(ctx, "entfernungKm");
  const tage = num(ctx, "arbeitstage");
  const eigenerPkw = bool(ctx, "eigenerPkw");
  const r = empty();
  const ab21 = valueForYear(C.ENTFERNUNG_AB_21, ctx.year) ?? C.ENTFERNUNG_BIS_20;

  const km1 = Math.min(km, 20);
  const km2 = Math.max(0, km - 20);
  const proTag = km1 * C.ENTFERNUNG_BIS_20 + km2 * ab21;
  const roh = round2(proTag * tage);

  r.inputAmount = roh;
  let deductible = roh;
  if (!eigenerPkw && roh > C.ENTFERNUNG_HOECHSTBETRAG) {
    deductible = C.ENTFERNUNG_HOECHSTBETRAG;
    r.warnings.push(
      `Der Höchstbetrag der Entfernungspauschale von ${C.ENTFERNUNG_HOECHSTBETRAG} € pro Jahr ist überschritten. Ohne eigenen oder zur Nutzung überlassenen Pkw werden nur ${C.ENTFERNUNG_HOECHSTBETRAG} € berücksichtigt.`,
    );
  }
  r.deductibleAmount = round2(deductible);
  r.nonDeductibleAmount = round2(roh - deductible);
  r.explanation.push(
    `${tage} Arbeitstage × (${Math.min(km, 20)} km × ${C.ENTFERNUNG_BIS_20.toLocaleString("de-DE")} € + ${km2} km × ${ab21.toLocaleString("de-DE")} €) = ${roh.toLocaleString("de-DE")} €.`,
  );
  const pausch = valueForYear(C.ARBEITNEHMER_PAUSCHBETRAG, ctx.year);
  if (pausch) {
    r.lumpSumNote = `Achtung: Der Arbeitnehmer-Pauschbetrag von ${pausch} € wird automatisch berücksichtigt. Nur wenn Ihre gesamten Werbungskosten (inkl. Fahrtkosten) diesen Betrag übersteigen, wirkt sich der Mehrbetrag aus.`;
  }
  return withSaving(ctx, r);
};

/** Homeoffice-/Tagespauschale: pro Tag, gedeckelt auf Jahresbetrag & Tage. */
export const homeofficePauschale: CalculatorFn = (ctx) => {
  const tage = num(ctx, "homeofficeTage");
  const r = empty();
  const proTag = valueForYear(C.HOMEOFFICE_PRO_TAG, ctx.year) ?? 0;
  const maxTage = valueForYear(C.HOMEOFFICE_MAX_TAGE, ctx.year) ?? 0;
  const maxBetrag = valueForYear(C.HOMEOFFICE_MAX, ctx.year) ?? 0;

  const anerkannteTage = Math.min(tage, maxTage);
  const roh = round2(tage * proTag);
  const deductible = round2(Math.min(anerkannteTage * proTag, maxBetrag));
  r.inputAmount = roh;
  r.deductibleAmount = deductible;
  r.nonDeductibleAmount = round2(roh - deductible);
  r.explanation.push(
    `${tage} Tage × ${proTag} €/Tag, gedeckelt auf max. ${maxTage} Tage bzw. ${maxBetrag} € pro Jahr ⇒ ${deductible.toLocaleString("de-DE")} €.`,
  );
  if (tage > maxTage) {
    r.warnings.push(
      `Es sind höchstens ${maxTage} Tage (= ${maxBetrag} €) pro Jahr begünstigt. Mehr Tage erhöhen den Abzug nicht.`,
    );
  }
  r.warnings.push(
    "Für Tage mit Tagespauschale kann i. d. R. keine Entfernungspauschale für denselben Tag angesetzt werden (Ausnahme: kein anderer Arbeitsplatz).",
  );
  return withSaving(ctx, r);
};

/** Arbeitsmittel inkl. GWG-Sofortabzug vs. AfA-Hinweis. */
export const arbeitsmittel: CalculatorFn = (ctx) => {
  const kosten = num(ctx, "kosten");
  const beruflicherAnteil = Math.min(Math.max(num(ctx, "beruflicherAnteilProzent", 100), 0), 100) / 100;
  const r = empty();
  const gwgNetto = valueForYear(C.GWG_GRENZE_NETTO, ctx.year) ?? 800;
  const gwgBrutto = round2(gwgNetto * 1.19);

  const anteilig = round2(kosten * beruflicherAnteil);
  r.inputAmount = kosten;
  r.deductibleAmount = anteilig;
  r.nonDeductibleAmount = round2(kosten - anteilig);
  if (beruflicherAnteil < 1) {
    r.explanation.push(
      `Beruflicher Anteil ${Math.round(beruflicherAnteil * 100)} % von ${kosten.toLocaleString("de-DE")} € = ${anteilig.toLocaleString("de-DE")} €.`,
    );
  }
  if (kosten > gwgBrutto) {
    r.warnings.push(
      `Über der GWG-Grenze (${gwgNetto} € netto / ca. ${gwgBrutto.toLocaleString("de-DE")} € brutto): Das Wirtschaftsgut ist grundsätzlich über die Nutzungsdauer abzuschreiben (AfA), nicht sofort voll absetzbar. Hinweis: Für Computerhardware/Software lässt die Finanzverwaltung seit 2021 eine Nutzungsdauer von 1 Jahr zu (Sofortabzug möglich).`,
    );
  } else {
    r.explanation.push(
      `Bis zur GWG-Grenze (${gwgNetto} € netto) ist ein Sofortabzug im Anschaffungsjahr möglich.`,
    );
  }
  return withSaving(ctx, r);
};

/** Verpflegungsmehraufwand bei Auswärtstätigkeit (Inland). */
export const verpflegungsmehraufwand: CalculatorFn = (ctx) => {
  const tage8 = num(ctx, "tageUeber8h");
  const tage24 = num(ctx, "tageGanztags");
  const r = empty();
  const betrag = round2(tage8 * C.VERPFLEGUNG_8H + tage24 * C.VERPFLEGUNG_24H);
  r.inputAmount = betrag;
  r.deductibleAmount = betrag;
  r.explanation.push(
    `${tage8} Tage × ${C.VERPFLEGUNG_8H} € (> 8 Std.) + ${tage24} Tage × ${C.VERPFLEGUNG_24H} € (ganztägig) = ${betrag.toLocaleString("de-DE")} €.`,
  );
  r.warnings.push(
    "Erhaltene steuerfreie Arbeitgebererstattungen sowie Mahlzeitenkürzungen (Frühstück 20 %, Mittag-/Abendessen je 40 % der Tagespauschale) sind gegenzurechnen.",
  );
  return withSaving(ctx, r);
};

// ---------------------------------------------------------------------------
// Steuerermäßigungen § 35a / § 35c (direkter Abzug von der Steuer)
// ---------------------------------------------------------------------------

function directReduction(
  ctx: CalculationContext,
  betrag: number,
  prozent: number,
  maxErmaessigung: number,
  basisLabel: string,
): CalculationResult {
  const r = empty();
  const roh = round2(betrag * prozent);
  const ermaessigung = round2(Math.min(roh, maxErmaessigung));
  r.inputAmount = betrag;
  r.deductibleAmount = betrag; // hier i. S. v. "begünstigte Basis"
  r.directTaxReduction = ermaessigung;
  r.estimatedTaxSaving = ermaessigung;
  r.explanation.push(
    `${Math.round(prozent * 100)} % von ${basisLabel} (${betrag.toLocaleString("de-DE")} €) = ${roh.toLocaleString("de-DE")} €, höchstens ${maxErmaessigung.toLocaleString("de-DE")} € Steuerermäßigung ⇒ ${ermaessigung.toLocaleString("de-DE")} €.`,
  );
  if (roh > maxErmaessigung) {
    r.warnings.push(
      `Der Höchstbetrag der Steuerermäßigung (${maxErmaessigung.toLocaleString("de-DE")} €) ist erreicht. Höhere Kosten wirken sich nicht weiter aus.`,
    );
  }
  r.warnings.push(
    "Voraussetzung: Rechnung vorhanden und unbare Zahlung (Überweisung). Barzahlungen werden nicht anerkannt.",
  );
  return r;
}

/** Handwerkerleistungen, § 35a Abs. 3 EStG (nur Lohn-/Arbeitskosten). */
export const handwerkerleistungen: CalculatorFn = (ctx) => {
  const lohnkosten = num(ctx, "arbeitskosten");
  const materialkosten = num(ctx, "materialkosten");
  const r = directReduction(ctx, lohnkosten, C.HANDWERKER.prozent, C.HANDWERKER.maxErmaessigung, "den Arbeitskosten");
  if (materialkosten > 0) {
    r.warnings.push(
      `Materialkosten (${materialkosten.toLocaleString("de-DE")} €) sind nicht begünstigt – nur der Lohn-/Arbeitskostenanteil zählt.`,
    );
  }
  return r;
};

/** Haushaltsnahe Dienstleistungen, § 35a Abs. 2 EStG. */
export const haushaltsnaheDienstleistungen: CalculatorFn = (ctx) => {
  const betrag = num(ctx, "kosten");
  return directReduction(ctx, betrag, C.HAUSHALTSNAHE_DL.prozent, C.HAUSHALTSNAHE_DL.maxErmaessigung, "den Aufwendungen");
};

/** Haushaltsnahe Minijobs, § 35a Abs. 1 EStG. */
export const haushaltsnaheMinijob: CalculatorFn = (ctx) => {
  const betrag = num(ctx, "kosten");
  return directReduction(ctx, betrag, C.HAUSHALTSNAHE_MINIJOB.prozent, C.HAUSHALTSNAHE_MINIJOB.maxErmaessigung, "den Aufwendungen");
};

/** Energetische Sanierung, § 35c EStG (20 % über 3 Jahre, max. 40.000 €). */
export const energetischeSanierung: CalculatorFn = (ctx) => {
  const betrag = num(ctx, "kosten");
  const r = empty();
  const gesamt = round2(Math.min(betrag * C.ENERGETISCHE_SANIERUNG.prozentGesamt, C.ENERGETISCHE_SANIERUNG.maxErmaessigung));
  r.inputAmount = betrag;
  r.deductibleAmount = betrag;
  r.directTaxReduction = gesamt;
  r.estimatedTaxSaving = gesamt;
  const [j1, j2, j3] = C.ENERGETISCHE_SANIERUNG.verteilung;
  r.explanation.push(
    `Insgesamt 20 % von ${betrag.toLocaleString("de-DE")} € = ${gesamt.toLocaleString("de-DE")} € Steuerermäßigung, verteilt über 3 Jahre: Jahr 1 ${Math.round(j1 * 100)} %, Jahr 2 ${Math.round(j2 * 100)} %, Jahr 3 ${Math.round(j3 * 100)} % der Kosten.`,
  );
  if (betrag * C.ENERGETISCHE_SANIERUNG.prozentGesamt > C.ENERGETISCHE_SANIERUNG.maxErmaessigung) {
    r.warnings.push(`Der Höchstbetrag von ${C.ENERGETISCHE_SANIERUNG.maxErmaessigung.toLocaleString("de-DE")} € je Objekt ist erreicht.`);
  }
  r.warnings.push(
    "Voraussetzungen u. a.: selbstgenutztes Gebäude älter als 10 Jahre, Fachunternehmen, Bescheinigung nach amtlichem Muster, unbare Zahlung. Keine Doppelförderung (z. B. mit KfW/BAFA-Zuschuss) zulässig.",
  );
  return r;
};

// ---------------------------------------------------------------------------
// Sonderausgaben
// ---------------------------------------------------------------------------

/** Kinderbetreuungskosten, § 10 Abs. 1 Nr. 5 EStG. */
export const kinderbetreuung: CalculatorFn = (ctx) => {
  const kosten = num(ctx, "kosten");
  const r = empty();
  const anteil = valueForYear(C.KINDERBETREUUNG_ANTEIL, ctx.year) ?? 2 / 3;
  const max = valueForYear(C.KINDERBETREUUNG_MAX, ctx.year) ?? 4000;
  const anteilig = round2(kosten * anteil);
  const deductible = round2(Math.min(anteilig, max));
  r.inputAmount = kosten;
  r.deductibleAmount = deductible;
  r.nonDeductibleAmount = round2(kosten - deductible);
  r.explanation.push(
    `${Math.round(anteil * 100)} % von ${kosten.toLocaleString("de-DE")} € = ${anteilig.toLocaleString("de-DE")} €, höchstens ${max.toLocaleString("de-DE")} € je Kind ⇒ ${deductible.toLocaleString("de-DE")} €.`,
  );
  if (anteilig > max) {
    r.warnings.push(`Der Höchstbetrag von ${max.toLocaleString("de-DE")} € je Kind ist erreicht.`);
  }
  r.warnings.push("Voraussetzung: Rechnung und unbare Zahlung. Kind unter 14 Jahren (bzw. Behinderung).");
  return withSaving(ctx, r);
};

/** Schulgeld, § 10 Abs. 1 Nr. 9 EStG (30 %, max. 5.000 € je Kind). */
export const schulgeld: CalculatorFn = (ctx) => {
  const kosten = num(ctx, "kosten");
  const r = empty();
  const anteilig = round2(kosten * C.SCHULGELD_ANTEIL);
  const deductible = round2(Math.min(anteilig, C.SCHULGELD_MAX));
  r.inputAmount = kosten;
  r.deductibleAmount = deductible;
  r.nonDeductibleAmount = round2(kosten - deductible);
  r.explanation.push(
    `30 % von ${kosten.toLocaleString("de-DE")} € = ${anteilig.toLocaleString("de-DE")} €, höchstens ${C.SCHULGELD_MAX.toLocaleString("de-DE")} € je Kind ⇒ ${deductible.toLocaleString("de-DE")} €.`,
  );
  if (anteilig > C.SCHULGELD_MAX) {
    r.warnings.push(`Der Höchstbetrag von ${C.SCHULGELD_MAX.toLocaleString("de-DE")} € je Kind ist erreicht.`);
  }
  r.warnings.push("Reine Kosten für Unterkunft, Betreuung und Verpflegung zählen nicht zum begünstigten Schulgeld.");
  return withSaving(ctx, r);
};

/** Spenden, § 10b EStG (bis 20 % des Gesamtbetrags der Einkünfte). */
export const spenden: CalculatorFn = (ctx) => {
  const betrag = num(ctx, "betrag");
  const r = empty();
  r.inputAmount = betrag;
  const hoechst = ctx.taxableIncome ? round2(ctx.taxableIncome * C.SPENDEN_ANTEIL_HOECHST) : undefined;
  let deductible = betrag;
  if (hoechst !== undefined && betrag > hoechst) {
    deductible = hoechst;
    r.warnings.push(
      `Spenden sind nur bis 20 % des Gesamtbetrags der Einkünfte abziehbar (hier ca. ${hoechst.toLocaleString("de-DE")} €). Der übersteigende Betrag kann als Spendenvortrag in Folgejahre übertragen werden.`,
    );
  }
  r.deductibleAmount = round2(deductible);
  r.nonDeductibleAmount = round2(betrag - deductible);
  r.explanation.push("Spenden an steuerbegünstigte Organisationen mindern als Sonderausgaben das zu versteuernde Einkommen.");
  r.lumpSumNote =
    "Hinweis: Bis 300 € (Vereinfachungsregel) genügt häufig ein vereinfachter Nachweis (z. B. Kontoauszug). Der Sonderausgaben-Pauschbetrag (36 € / 72 €) ist gering und meist schon überschritten.";
  return withSaving(ctx, r);
};

// ---------------------------------------------------------------------------
// Außergewöhnliche Belastungen
// ---------------------------------------------------------------------------

/** Krankheits-/Pflegekosten als a. g. B. mit zumutbarer Belastung, § 33 EStG. */
export const aussergewoehnlicheBelastung: CalculatorFn = (ctx) => {
  const kosten = num(ctx, "kosten");
  const r = empty();
  const zb = round2(zumutbareBelastung(ctx));
  const wirksam = round2(Math.max(0, kosten - zb));
  r.inputAmount = kosten;
  r.deductibleAmount = wirksam;
  r.nonDeductibleAmount = round2(kosten - wirksam);
  if (ctx.taxableIncome) {
    r.explanation.push(
      `Zumutbare Belastung (§ 33 Abs. 3 EStG, stufenweise) ≈ ${zb.toLocaleString("de-DE")} €. Erst der darüber hinausgehende Teil wirkt sich aus: ${kosten.toLocaleString("de-DE")} € − ${zb.toLocaleString("de-DE")} € = ${wirksam.toLocaleString("de-DE")} €.`,
    );
  } else {
    r.explanation.push(
      "Diese Kosten wirken sich erst aus, soweit sie die individuelle zumutbare Belastung übersteigen. Bitte geben Sie für eine Schätzung Ihr zu versteuerndes Einkommen an.",
    );
  }
  if (kosten > 0 && wirksam === 0 && ctx.taxableIncome) {
    r.warnings.push("Die Kosten liegen unterhalb Ihrer zumutbaren Belastung und wirken sich daher voraussichtlich steuerlich nicht aus.");
  }
  return withSaving(ctx, r);
};

// ---------------------------------------------------------------------------
// Studium / Ausbildung
// ---------------------------------------------------------------------------

/** Studienkosten: Erststudium (Sonderausgaben, begrenzt) vs. Zweitstudium (Werbungskosten, unbegrenzt + Verlustvortrag). */
export const studienkosten: CalculatorFn = (ctx) => {
  const kosten = num(ctx, "kosten");
  const istErststudium = bool(ctx, "istErststudium");
  const hatEinkuenfte = bool(ctx, "hatEinkuenfte");
  const r = empty();
  r.inputAmount = kosten;

  if (istErststudium) {
    const deductible = round2(Math.min(kosten, C.ERSTAUSBILDUNG_SONDERAUSGABEN_MAX));
    r.deductibleAmount = deductible;
    r.nonDeductibleAmount = round2(kosten - deductible);
    r.explanation.push(
      `Erstausbildung/Erststudium (ohne vorherige abgeschlossene Berufsausbildung): nur Sonderausgaben bis ${C.ERSTAUSBILDUNG_SONDERAUSGABEN_MAX.toLocaleString("de-DE")} € (§ 10 Abs. 1 Nr. 7 EStG).`,
    );
    r.warnings.push(
      "Sonderausgaben sind NICHT vortragsfähig. Ohne Einkünfte im selben Jahr verpufft der Abzug – ein Verlustvortrag ist hier in der Regel nicht möglich.",
    );
  } else {
    r.deductibleAmount = round2(kosten);
    r.explanation.push(
      "Zweitstudium / Studium nach abgeschlossener Erstausbildung / Masterstudium: Werbungskosten oder Betriebsausgaben – unbegrenzt abziehbar.",
    );
    if (!hatEinkuenfte) {
      r.explanation.push(
        "Ohne (ausreichende) Einkünfte entsteht ein vortragsfähiger Verlust (Verlustvortrag, § 10d EStG), der in späteren Jahren mit Einkünften verrechnet werden kann.",
      );
      r.worthItHint =
        "Auch ohne aktuelles Einkommen lohnt sich die Steuererklärung: Der Verlustvortrag kann später echte Steuerersparnis bringen.";
    }
  }
  return withSaving(ctx, r);
};

// ---------------------------------------------------------------------------
// Familie
// ---------------------------------------------------------------------------

/** Entlastungsbetrag für Alleinerziehende, § 24b EStG. */
export const entlastungsbetragAlleinerziehend: CalculatorFn = (ctx) => {
  const kinder = Math.max(1, num(ctx, "anzahlKinder", 1));
  const r = empty();
  const grund = valueForYear(C.ENTLASTUNGSBETRAG_ALLEINERZIEHEND, ctx.year) ?? 0;
  const betrag = round2(grund + Math.max(0, kinder - 1) * C.ENTLASTUNGSBETRAG_JE_WEITERES_KIND);
  r.inputAmount = betrag;
  r.deductibleAmount = betrag;
  r.explanation.push(
    `Grundbetrag ${grund.toLocaleString("de-DE")} € + ${Math.max(0, kinder - 1)} weitere(s) Kind(er) × ${C.ENTLASTUNGSBETRAG_JE_WEITERES_KIND} € = ${betrag.toLocaleString("de-DE")} €.`,
  );
  r.warnings.push("Voraussetzung: echte Alleinerziehung (keine weitere volljährige Person im Haushalt, außer eigene Kinder mit Kindergeldanspruch).");
  return withSaving(ctx, r);
};

/** Unterhalt an bedürftige Personen, § 33a Abs. 1 EStG. */
export const unterhalt: CalculatorFn = (ctx) => {
  const gezahlt = num(ctx, "gezahlt");
  const eigeneEinkuenfteEmpfaenger = num(ctx, "eigeneEinkuenfteEmpfaenger");
  const r = empty();
  const hoechst = valueForYear(C.UNTERHALT_HOECHSTBETRAG, ctx.year) ?? 0;
  // Anrechnung eigener Einkünfte über 624 € Freibetrag
  const anrechnung = Math.max(0, eigeneEinkuenfteEmpfaenger - 624);
  const grenze = round2(Math.max(0, hoechst - anrechnung));
  const deductible = round2(Math.min(gezahlt, grenze));
  r.inputAmount = gezahlt;
  r.deductibleAmount = deductible;
  r.nonDeductibleAmount = round2(gezahlt - deductible);
  r.explanation.push(
    `Höchstbetrag ${hoechst.toLocaleString("de-DE")} € (Grundfreibetrag) − anrechenbare eigene Einkünfte/Bezüge des Empfängers (${anrechnung.toLocaleString("de-DE")} €) = ${grenze.toLocaleString("de-DE")} € ⇒ abziehbar ${deductible.toLocaleString("de-DE")} €.`,
  );
  r.warnings.push("Eigene Einkünfte und Bezüge der unterstützten Person über 624 € pro Jahr mindern den Höchstbetrag.");
  return withSaving(ctx, r);
};

// ---------------------------------------------------------------------------
// Generische Calculators
// ---------------------------------------------------------------------------

/** Voll abziehbarer Betrag (unbegrenzt, wenn Voraussetzungen erfüllt). */
export const vollAbziehbar: CalculatorFn = (ctx) => {
  const betrag = num(ctx, "betrag");
  const r = empty();
  r.inputAmount = betrag;
  r.deductibleAmount = round2(betrag);
  r.explanation.push("Der Betrag ist – bei beruflicher/betrieblicher Veranlassung – grundsätzlich in voller Höhe abziehbar.");
  return withSaving(ctx, r);
};

export const CALCULATORS: Record<string, CalculatorFn> = {
  entfernungspauschale,
  homeofficePauschale,
  arbeitsmittel,
  verpflegungsmehraufwand,
  handwerkerleistungen,
  haushaltsnaheDienstleistungen,
  haushaltsnaheMinijob,
  energetischeSanierung,
  kinderbetreuung,
  schulgeld,
  spenden,
  aussergewoehnlicheBelastung,
  studienkosten,
  entlastungsbetragAlleinerziehend,
  unterhalt,
  vollAbziehbar,
};

export function runCalculator(key: string | undefined, ctx: CalculationContext): CalculationResult | null {
  if (!key) return null;
  const fn = CALCULATORS[key];
  if (!fn) return null;
  return fn(ctx);
}

export { zumutbareBelastung };
