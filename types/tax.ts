/**
 * Zentrale Typdefinitionen für die Rule-Engine des Einkommensteuer-Helfers.
 *
 * Alle steuerlichen Beträge, Pauschalen und Grenzen werden ausschließlich über
 * die hier definierten Strukturen in /lib/tax/rules hinterlegt. Das UI darf
 * keine Beträge fest verdrahten.
 */

/** Unterstützte Veranlagungsjahre. */
export type TaxYear = 2021 | 2022 | 2023 | 2024 | 2025 | 2026;

export const SUPPORTED_TAX_YEARS: TaxYear[] = [2021, 2022, 2023, 2024, 2025, 2026];

/**
 * Die fünf steuerlichen Grundkategorien, nach denen Aufwendungen unterschieden
 * werden. Dies ist die wichtigste fachliche Unterscheidung des Tools.
 */
export type TaxCategory =
  | "werbungskosten" // bei Überschusseinkünften (z. B. nichtselbständige Arbeit)
  | "betriebsausgaben" // bei Gewinneinkünften (Selbständigkeit, Gewerbe)
  | "werbungskosten_vuv" // Werbungskosten bei Vermietung & Verpachtung
  | "werbungskosten_kapital" // (eingeschränkt) bei Kapitalvermögen
  | "sonderausgaben"
  | "aussergewoehnliche_belastungen"
  | "steuerermaessigung" // direkter Abzug von der Steuerschuld (§ 35a, § 35c EStG)
  | "freibetrag_familie" // Kinderfreibetrag, Entlastungsbetrag etc.
  | "grundlagen"; // erklärende Wissensbausteine ohne eigenen Betrag

/** Art, wie sich ein Betrag steuerlich auswirkt. */
export type AmountType =
  | "lump_sum" // Pauschale/Pauschbetrag (greift oft automatisch)
  | "maximum_amount" // bis zu einem Höchstbetrag abziehbar
  | "percentage_tax_reduction" // direkte Steuerermäßigung in % der Kosten
  | "unlimited_if_eligible" // unbegrenzt abziehbar, wenn Voraussetzungen erfüllt
  | "partial_deduction" // nur anteilig abziehbar (z. B. 2/3, 80 %)
  | "reasonable_burden" // wirkt erst oberhalb der zumutbaren Belastung
  | "not_deductible"
  | "case_by_case";

/** Abzugsfähigkeits-Status für die klare Unterscheidung im UI (Abschnitt M). */
export type DeductibilityStatus =
  | "deductible"
  | "partially_deductible"
  | "only_with_evidence"
  | "only_if_work_related"
  | "only_if_business_related"
  | "only_rental"
  | "only_special_expense"
  | "only_extraordinary_burden"
  | "only_direct_tax_reduction"
  | "usually_not_deductible"
  | "special_case"
  | "uncertain"
  | "professional_check_recommended";

/** Personentypen / Lebenslagen, die Regeln freischalten. */
export type PersonType =
  | "arbeitnehmer"
  | "selbststaendig"
  | "freiberufler"
  | "gewerbetreibend"
  | "minijob"
  | "nebentaetigkeit"
  | "student"
  | "auszubildender"
  | "umschulung"
  | "fortbildung"
  | "rentner"
  | "pensionaer"
  | "vermieter"
  | "kapitalanleger"
  | "elternteil"
  | "alleinerziehend"
  | "verheiratet"
  | "ledig"
  | "zusammenveranlagung"
  | "einzelveranlagung"
  | "pflegende_person"
  | "behinderung"
  | "krankheitskosten"
  | "umzug"
  | "homeoffice"
  | "arbeitszimmer"
  | "pendler"
  | "dienstreisen"
  | "doppelte_haushaltsfuehrung"
  | "spenden"
  | "kirchensteuer"
  | "handwerkerleistungen"
  | "haushaltsnahe_dienstleistungen"
  | "energetische_sanierung"
  | "auslandssachverhalt";

/** Sicherheitsgrad eines hinterlegten Wertes. */
export type ConfidenceLevel = "verified" | "needs_verification" | "estimate";

/** Status der Aktualität / Wartung einer Regel. */
export type UpdateStatus =
  | "current"
  | "annual_update_required"
  | "to_verify"
  | "deprecated";

export type AuditRiskLevel = "low" | "medium" | "high";

/** Eine offizielle Quelle. */
export interface OfficialSource {
  /** Kurzbezeichnung, z. B. "§ 9 Abs. 1 Nr. 4 EStG". */
  label: string;
  /** Art der Quelle. */
  type:
    | "gesetz"
    | "verordnung"
    | "richtlinie"
    | "bmf_schreiben"
    | "bfh_urteil"
    | "behoerde";
  url?: string;
  note?: string;
}

/**
 * Jahresabhängige Beträge. Ein Wert von `null` bedeutet: für dieses Jahr ist
 * noch kein geprüfter Wert hinterlegt (-> Hinweis "zu prüfen" im UI).
 */
export type YearlyValue = Partial<Record<TaxYear, number | null>>;

/** Kontext, in dem eine Berechnung ausgeführt wird. */
export interface CalculationContext {
  year: TaxYear;
  /** Optional: geschätzter Grenzsteuersatz (0..1) für die Wirkungsschätzung. */
  marginalTaxRate?: number;
  /** Optional: zu versteuerndes Einkommen für die zumutbare Belastung etc. */
  taxableIncome?: number;
  /** Anzahl Kinder (für zumutbare Belastung, Entlastungsbetrag). */
  numberOfChildren?: number;
  /** Zusammenveranlagung? */
  jointAssessment?: boolean;
  /** Beliebige weitere Nutzereingaben. */
  inputs: Record<string, number | boolean | string | undefined>;
}

/** Ergebnis einer Regel-Berechnung. */
export interface CalculationResult {
  /** Vom Nutzer eingegebener / relevanter Bruttobetrag. */
  inputAmount: number;
  /** Steuerlich voraussichtlich berücksichtigter Betrag. */
  deductibleAmount: number;
  /** Betrag oberhalb von Grenzen/Höchstbeträgen, der wegfällt. */
  nonDeductibleAmount: number;
  /** Falls eine direkte Steuerermäßigung greift: deren Höhe. */
  directTaxReduction?: number;
  /** Geschätzte Steuerersparnis (abhängig vom Grenzsteuersatz). */
  estimatedTaxSaving?: number;
  /** Erklärende Hinweise zur Berechnung ("Warum wird das so berechnet?"). */
  explanation: string[];
  /** Aktive Warnungen für diese Eingabe. */
  warnings: string[];
  /** Greift bereits eine Pauschale, sodass Belege erst ab X relevant werden? */
  lumpSumNote?: string;
  /** Optionaler "Lohnt sich das?"-Hinweis aus der Berechnung. */
  worthItHint?: string;
}

/** Eine Frage, die das Tool dem Nutzer zu dieser Position stellen kann. */
export interface RuleQuestion {
  id: string;
  label: string;
  type: "number" | "boolean" | "select" | "text";
  unit?: string;
  options?: { value: string; label: string }[];
  helpText?: string;
}

/** Die zentrale Datenstruktur einer steuerlichen Regel. */
export interface TaxRule {
  id: string;
  title: string;
  category: TaxCategory;
  subcategory: string;
  applicableYears: TaxYear[];
  legalBasis: string[];
  officialSources: OfficialSource[];
  plainLanguageExplanation: string;
  taxMechanism: string;
  eligiblePersonTypes: PersonType[];
  requiredConditions: string[];
  exclusionCriteria: string[];
  amountType: AmountType;
  deductibilityStatus: DeductibilityStatus;
  /** Höchstbetrag (jahresabhängig). */
  maximumAmount?: YearlyValue;
  /** Freibetrag (jahresabhängig). */
  allowanceAmount?: YearlyValue;
  /** Pauschbetrag (jahresabhängig). */
  lumpSumAmount?: YearlyValue;
  /** Prozentsatz (z. B. 0.2 für 20 %), jahresabhängig falls nötig. */
  percentage?: number | YearlyValue;
  unlimitedDeduction?: boolean;
  /** Abziehbarer Anteil (0..1), z. B. 2/3. */
  deductibleShare?: number | YearlyValue;
  thresholdLogic?: string;
  interactionWithOtherRules?: string[];
  requiredEvidence: string[];
  /** Ungefähr betroffene Anlage der Steuererklärung. */
  declarationArea: string;
  retroactiveClaimPossible: boolean | "case_by_case";
  retroactiveClaimExplanation: string;
  limitationPeriodLogic: string;
  commonMistakes: string[];
  auditRiskLevel: AuditRiskLevel;
  userQuestions: RuleQuestion[];
  /** Schlüssel des Calculators in /lib/tax/calculators (oder undefined). */
  calculatorKey?: string;
  warningMessages: string[];
  updateStatus: UpdateStatus;
  lastVerifiedDate: string;
  confidenceLevel: ConfidenceLevel;
  /** "Lohnt sich das?"-Hinweis. */
  worthItHint?: string;
}

/** Glossareintrag. */
export interface GlossaryEntry {
  term: string;
  short: string;
  long: string;
  related?: string[];
  sources?: OfficialSource[];
}
