import type { TaxRule } from "@/types/tax";
import { makeRule } from "./_helpers";
import { SRC } from "@/lib/tax/sources";
import * as C from "@/lib/tax/constants";

/** Studium, Ausbildung, Fortbildung, Umschulung. */
export const studiumRules: TaxRule[] = [
  makeRule({
    id: "stud-erststudium",
    title: "Erststudium / Erstausbildung (Sonderausgaben)",
    category: "sonderausgaben",
    subcategory: "Ausbildung",
    legalBasis: ["§ 10 Abs. 1 Nr. 7 EStG", "§ 9 Abs. 6 EStG"],
    officialSources: [SRC.estg10, SRC.estg9],
    plainLanguageExplanation:
      "Kosten für eine ERSTE Berufsausbildung oder ein Erststudium (ohne vorherige abgeschlossene Ausbildung) sind nur als Sonderausgaben bis 6.000 € pro Jahr abziehbar. Nachteil: Sonderausgaben sind nicht vortragsfähig – ohne eigenes Einkommen verpuffen sie.",
    taxMechanism: "Sonderausgaben bis 6.000 €/Jahr; KEIN Verlustvortrag möglich.",
    eligiblePersonTypes: ["student", "auszubildender"],
    amountType: "maximum_amount",
    deductibilityStatus: "only_special_expense",
    maximumAmount: { 2021: C.ERSTAUSBILDUNG_SONDERAUSGABEN_MAX, 2022: C.ERSTAUSBILDUNG_SONDERAUSGABEN_MAX, 2023: C.ERSTAUSBILDUNG_SONDERAUSGABEN_MAX, 2024: C.ERSTAUSBILDUNG_SONDERAUSGABEN_MAX, 2025: C.ERSTAUSBILDUNG_SONDERAUSGABEN_MAX, 2026: C.ERSTAUSBILDUNG_SONDERAUSGABEN_MAX },
    requiredConditions: ["erste Berufsausbildung/Erststudium ohne vorherige abgeschlossene Ausbildung"],
    requiredEvidence: ["Belege zu Studiengebühren, Semesterbeiträgen, Fahrten, Fachliteratur, Arbeitsmitteln"],
    declarationArea: "Anlage Sonderausgaben",
    calculatorKey: "studienkosten",
    userQuestions: [
      { id: "kosten", label: "Ausbildungs-/Studienkosten im Jahr", type: "number", unit: "€" },
      { id: "istErststudium", label: "Handelt es sich um die ERSTE Ausbildung/das Erststudium?", type: "boolean", helpText: "Erststudium = ohne vorher abgeschlossene Berufsausbildung." },
    ],
    interactionWithOtherRules: ["stud-zweitstudium"],
    commonMistakes: ["Erststudiumskosten als Werbungskosten vortragen wollen (geht nicht)."],
    confidenceLevel: "verified",
    warningMessages: ["Diese Studienkosten können je nach Erststudium oder Zweitstudium völlig unterschiedlich behandelt werden."],
  }),

  makeRule({
    id: "stud-zweitstudium",
    title: "Zweitstudium / Master / Umschulung (Werbungskosten)",
    category: "werbungskosten",
    subcategory: "Ausbildung",
    legalBasis: ["§ 9 Abs. 1 EStG", "§ 10d EStG"],
    officialSources: [SRC.estg9, SRC.estg10d],
    plainLanguageExplanation:
      "Kosten für ein Zweitstudium, ein Masterstudium nach dem Bachelor, eine Umschulung oder ein Studium nach abgeschlossener Erstausbildung sind unbegrenzt als Werbungskosten/Betriebsausgaben abziehbar – und vortragsfähig (Verlustvortrag).",
    taxMechanism: "Werbungskosten unbegrenzt; bei fehlendem Einkommen Verlustvortrag nach § 10d EStG.",
    eligiblePersonTypes: ["student", "umschulung", "fortbildung"],
    amountType: "unlimited_if_eligible",
    unlimitedDeduction: true,
    deductibilityStatus: "deductible",
    requiredConditions: ["abgeschlossene Erstausbildung bzw. Zweitausbildung/Masterstudium"],
    requiredEvidence: ["Belege", "Nachweis abgeschlossener Erstausbildung"],
    declarationArea: "Anlage N (ggf. Antrag auf Verlustfeststellung)",
    calculatorKey: "studienkosten",
    userQuestions: [
      { id: "kosten", label: "Studien-/Umschulungskosten im Jahr", type: "number", unit: "€" },
      { id: "hatEinkuenfte", label: "Hatten Sie in dem Jahr (nennenswerte) Einkünfte?", type: "boolean" },
    ],
    retroactiveClaimPossible: true,
    retroactiveClaimExplanation:
      "Für die Verlustfeststellung gilt eine Frist von 7 Jahren (§ 10d EStG i. V. m. § 181 Abs. 5 AO). Studienjahre bis zu 7 Jahre rückwirkend können oft noch über die Verlustfeststellung geltend gemacht werden – auch ohne damalige Steuererklärung.",
    limitationPeriodLogic:
      "Verlustfeststellung: bis zu 7 Jahre rückwirkend möglich (§ 181 Abs. 5 AO), solange für das Verlustjahr noch keine bestandskräftige Feststellung erfolgt ist.",
    interactionWithOtherRules: ["stud-erststudium", "fristen-verlustvortrag"],
    worthItHint: "Selbst ohne Einkommen lohnt sich die Erklärung: Der Verlustvortrag spart später Steuern, sobald Sie verdienen.",
    confidenceLevel: "verified",
  }),
];
