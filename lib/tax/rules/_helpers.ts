import type { TaxRule, TaxYear } from "@/types/tax";

export const ALL_YEARS: TaxYear[] = [2021, 2022, 2023, 2024, 2025, 2026];
export const YEARS_FROM_2023: TaxYear[] = [2023, 2024, 2025, 2026];

/**
 * Erstellt eine vollständige TaxRule aus einem Teilobjekt und setzt sinnvolle
 * Defaults für selten abweichende Felder. So bleiben die Regeldefinitionen
 * kompakt und lesbar, ohne dass Pflichtfelder verloren gehen.
 */
export function makeRule(partial: Partial<TaxRule> & Pick<TaxRule, "id" | "title" | "category" | "subcategory" | "plainLanguageExplanation" | "amountType" | "deductibilityStatus">): TaxRule {
  return {
    applicableYears: ALL_YEARS,
    legalBasis: [],
    officialSources: [],
    taxMechanism: "",
    eligiblePersonTypes: [],
    requiredConditions: [],
    exclusionCriteria: [],
    requiredEvidence: [],
    declarationArea: "",
    retroactiveClaimPossible: "case_by_case",
    retroactiveClaimExplanation:
      "Eine rückwirkende Geltendmachung hängt davon ab, ob der Steuerbescheid des betreffenden Jahres noch änderbar ist (z. B. innerhalb der Festsetzungsfrist, bei Vorbehalt der Nachprüfung oder offener Einspruchsfrist).",
    limitationPeriodLogic:
      "Reguläre Festsetzungsfrist 4 Jahre (§ 169 AO); Beginn und Ende werden durch Anlauf- und Ablaufhemmungen beeinflusst.",
    commonMistakes: [],
    auditRiskLevel: "low",
    userQuestions: [],
    warningMessages: [],
    updateStatus: "current",
    lastVerifiedDate: "2026-01-31",
    confidenceLevel: "verified",
    ...partial,
  };
}
