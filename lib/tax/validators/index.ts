import type { CalculationContext, DeductibilityStatus, TaxRule } from "@/types/tax";

/** Menschlich lesbare Labels und Farbsignale für den Abzugsstatus (Abschnitt M). */
export const DEDUCTIBILITY_LABELS: Record<DeductibilityStatus, { label: string; tone: "green" | "amber" | "red" | "gray" }> = {
  deductible: { label: "abziehbar", tone: "green" },
  partially_deductible: { label: "teilweise abziehbar", tone: "amber" },
  only_with_evidence: { label: "nur mit Nachweis abziehbar", tone: "amber" },
  only_if_work_related: { label: "nur beruflich abziehbar", tone: "amber" },
  only_if_business_related: { label: "nur betrieblich abziehbar", tone: "amber" },
  only_rental: { label: "nur bei Vermietung abziehbar", tone: "amber" },
  only_special_expense: { label: "nur als Sonderausgabe", tone: "green" },
  only_extraordinary_burden: { label: "nur als außergew. Belastung", tone: "amber" },
  only_direct_tax_reduction: { label: "direkte Steuerermäßigung", tone: "green" },
  usually_not_deductible: { label: "i. d. R. nicht abziehbar", tone: "red" },
  special_case: { label: "Spezialfall", tone: "gray" },
  uncertain: { label: "unsicher", tone: "gray" },
  professional_check_recommended: { label: "fachliche Prüfung empfohlen", tone: "gray" },
};

export interface PlausibilityIssue {
  level: "info" | "warning" | "error";
  message: string;
}

/**
 * Intelligente Plausibilitätsprüfung (Abschnitt G). Prüft typische Fehlerquellen
 * anhand der Nutzereingaben für eine konkrete Regel.
 */
export function validateInput(rule: TaxRule, ctx: CalculationContext): PlausibilityIssue[] {
  const issues: PlausibilityIssue[] = [];
  const inputs = ctx.inputs;

  // Entfernungspauschale: realistische Arbeitstage / Entfernung
  if (rule.id === "wk-entfernungspauschale") {
    const tage = Number(inputs.arbeitstage ?? 0);
    const km = Number(inputs.entfernungKm ?? 0);
    if (tage > 230) {
      issues.push({
        level: "warning",
        message: `${tage} Arbeitstage sind sehr hoch. Das Finanzamt erkennt bei einer 5-Tage-Woche meist nur ca. 220–230 Tage an.`,
      });
    }
    if (km > 150) {
      issues.push({
        level: "warning",
        message: `Eine einfache Entfernung von ${km} km ist ungewöhnlich hoch und wird vom Finanzamt häufig hinterfragt.`,
      });
    }
  }

  // Handwerker / haushaltsnah: unbare Zahlung
  if (rule.category === "steuerermaessigung" && rule.id !== "se-energetische-sanierung") {
    if (inputs.barbezahlt === true) {
      issues.push({
        level: "error",
        message: "Barzahlung ist nicht begünstigt. Für § 35a EStG ist eine Überweisung zwingend erforderlich.",
      });
    }
  }

  // Krankheitskosten: Hinweis zumutbare Belastung ohne Einkommen
  if (rule.id === "agb-krankheitskosten" && !ctx.taxableIncome) {
    issues.push({
      level: "info",
      message: "Für eine belastbare Schätzung der zumutbaren Belastung bitte das zu versteuernde Einkommen angeben.",
    });
  }

  // Generische Höchstbetrags-Warnung
  return issues;
}

/** Liefert true, wenn für ein Jahr ein Wert fehlt (-> "zu prüfen"-Hinweis nötig). */
export function hasUnverifiedValueForYear(rule: TaxRule, year: number): boolean {
  const maps = [rule.maximumAmount, rule.allowanceAmount, rule.lumpSumAmount];
  return maps.some((m) => m && year in m && m[year as keyof typeof m] === null);
}
