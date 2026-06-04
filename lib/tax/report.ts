import type { CalculationContext, CalculationResult, TaxRule, TaxYear } from "@/types/tax";
import type { PositionEntry, Profile } from "@/lib/schema";
import { getRule } from "@/lib/tax/rules";
import { runCalculator } from "@/lib/tax/calculators";
import { validateInput } from "@/lib/tax/validators";
import { round2, formatEuro } from "@/lib/tax/values";
import { personTypeLabel } from "@/lib/tax/profile";

export interface ReportPosition {
  rule: TaxRule;
  entry: PositionEntry;
  result: CalculationResult | null;
  issues: { level: string; message: string }[];
  missingEvidence: boolean;
}

export interface TaxReport {
  year: TaxYear;
  profileSummary: string[];
  positions: ReportPosition[];
  totals: {
    totalInput: number;
    totalDeductible: number; // mindert das z.v.E.
    totalNonDeductible: number;
    totalDirectTaxReduction: number; // § 35a/§ 35c
    estimatedTaxSaving: number;
  };
  warnings: string[];
  highRiskPositions: string[];
  missingEvidencePositions: string[];
  evidenceChecklist: string[];
  nextSteps: string[];
  professionalHelpRecommended: boolean;
}

function buildContext(profile: Profile, entry: PositionEntry): CalculationContext {
  return {
    year: profile.year,
    marginalTaxRate: profile.marginalTaxRate,
    taxableIncome: profile.taxableIncome,
    numberOfChildren: profile.numberOfChildren,
    jointAssessment: profile.jointAssessment ?? profile.personTypes.includes("zusammenveranlagung"),
    inputs: entry.inputs,
  };
}

/** Erzeugt den strukturierten Ergebnisbericht aus Profil und erfassten Positionen. */
export function buildReport(profile: Profile, positions: Record<string, PositionEntry>): TaxReport {
  const reportPositions: ReportPosition[] = [];
  const totals = { totalInput: 0, totalDeductible: 0, totalNonDeductible: 0, totalDirectTaxReduction: 0, estimatedTaxSaving: 0 };
  const warnings: string[] = [];
  const highRiskPositions: string[] = [];
  const missingEvidencePositions: string[] = [];
  const evidenceChecklist = new Set<string>();
  let professionalHelpRecommended = profile.personTypes.includes("auslandssachverhalt");

  for (const entry of Object.values(positions)) {
    const rule = getRule(entry.ruleId);
    if (!rule) continue;
    const ctx = buildContext(profile, entry);
    const result = runCalculator(rule.calculatorKey, ctx);
    const issues = validateInput(rule, ctx);
    const missingEvidence = entry.inputs.belegeVorhanden === false;

    if (result) {
      totals.totalInput = round2(totals.totalInput + result.inputAmount);
      if (result.directTaxReduction !== undefined) {
        totals.totalDirectTaxReduction = round2(totals.totalDirectTaxReduction + result.directTaxReduction);
        totals.estimatedTaxSaving = round2(totals.estimatedTaxSaving + result.directTaxReduction);
      } else {
        totals.totalDeductible = round2(totals.totalDeductible + result.deductibleAmount);
        totals.totalNonDeductible = round2(totals.totalNonDeductible + result.nonDeductibleAmount);
        if (result.estimatedTaxSaving) {
          totals.estimatedTaxSaving = round2(totals.estimatedTaxSaving + result.estimatedTaxSaving);
        }
      }
      for (const w of result.warnings) {
        if (!warnings.includes(w)) warnings.push(w);
      }
    }

    if (rule.auditRiskLevel === "high") highRiskPositions.push(rule.title);
    if (missingEvidence) missingEvidencePositions.push(rule.title);
    rule.requiredEvidence.forEach((e) => evidenceChecklist.add(`${rule.title}: ${e}`));
    if (rule.deductibilityStatus === "professional_check_recommended" || rule.auditRiskLevel === "high") {
      professionalHelpRecommended = true;
    }

    reportPositions.push({ rule, entry, result, issues, missingEvidence });
  }

  const nextSteps: string[] = [];
  if (totals.totalDeductible > 0) {
    nextSteps.push(`Geschätzt mindern ${formatEuro(totals.totalDeductible)} Ihr zu versteuerndes Einkommen.`);
  }
  if (totals.totalDirectTaxReduction > 0) {
    nextSteps.push(`Zusätzlich ${formatEuro(totals.totalDirectTaxReduction)} direkte Steuerermäßigung (§ 35a/§ 35c).`);
  }
  if (missingEvidencePositions.length > 0) {
    nextSteps.push("Fehlende Nachweise/Belege beschaffen, bevor Sie die Erklärung abgeben.");
  }
  nextSteps.push("Positionen je nach betroffener Anlage (N, V, EÜR, Kind, Vorsorgeaufwand) in ELSTER eintragen.");
  if (professionalHelpRecommended) {
    nextSteps.push("Bei den risikoreichen oder komplexen Positionen Steuerberater:in oder Lohnsteuerhilfeverein hinzuziehen.");
  }

  const profileSummary = [
    `Veranlagungsjahr: ${profile.year}`,
    `Lebenslagen: ${profile.personTypes.map(personTypeLabel).join(", ") || "—"}`,
    profile.marginalTaxRate ? `Angenommener Grenzsteuersatz: ${Math.round(profile.marginalTaxRate * 100)} %` : "Grenzsteuersatz: nicht angegeben",
    profile.taxableIncome ? `Zu versteuerndes Einkommen: ${formatEuro(profile.taxableIncome)}` : "Zu versteuerndes Einkommen: nicht angegeben",
  ];

  return {
    year: profile.year,
    profileSummary,
    positions: reportPositions,
    totals,
    warnings,
    highRiskPositions,
    missingEvidencePositions,
    evidenceChecklist: Array.from(evidenceChecklist),
    nextSteps,
    professionalHelpRecommended,
  };
}

/** Exportiert den Bericht als Markdown (Abschnitt J: optionaler Export). */
export function reportToMarkdown(report: TaxReport): string {
  const lines: string[] = [];
  lines.push(`# Einkommensteuer-Helper – Auswertung ${report.year}`);
  lines.push("");
  lines.push("## Profil");
  report.profileSummary.forEach((s) => lines.push(`- ${s}`));
  lines.push("");
  lines.push("## Erfasste Positionen");
  for (const p of report.positions) {
    lines.push(`### ${p.rule.title}`);
    lines.push(`- Kategorie: ${p.rule.category}`);
    if (p.result) {
      lines.push(`- Eingegeben: ${formatEuro(p.result.inputAmount)}`);
      if (p.result.directTaxReduction !== undefined) {
        lines.push(`- Direkte Steuerermäßigung: ${formatEuro(p.result.directTaxReduction)}`);
      } else {
        lines.push(`- Voraussichtlich abziehbar: ${formatEuro(p.result.deductibleAmount)}`);
        if (p.result.nonDeductibleAmount > 0) lines.push(`- Nicht berücksichtigt: ${formatEuro(p.result.nonDeductibleAmount)}`);
      }
      p.result.explanation.forEach((e) => lines.push(`  - ${e}`));
    }
    lines.push("");
  }
  lines.push("## Zusammenfassung");
  lines.push(`- Summe Eingaben: ${formatEuro(report.totals.totalInput)}`);
  lines.push(`- Mindert z. v. E. (Abzug): ${formatEuro(report.totals.totalDeductible)}`);
  lines.push(`- Direkte Steuerermäßigung: ${formatEuro(report.totals.totalDirectTaxReduction)}`);
  lines.push(`- Geschätzte Steuerersparnis: ${formatEuro(report.totals.estimatedTaxSaving)}`);
  lines.push("");
  if (report.warnings.length) {
    lines.push("## Warnhinweise");
    report.warnings.forEach((w) => lines.push(`- ${w}`));
    lines.push("");
  }
  lines.push("## Belegliste");
  report.evidenceChecklist.forEach((e) => lines.push(`- [ ] ${e}`));
  lines.push("");
  lines.push("## Nächste Schritte");
  report.nextSteps.forEach((s) => lines.push(`- ${s}`));
  lines.push("");
  lines.push("---");
  lines.push("_Dieses Tool ersetzt keine individuelle Steuerberatung._");
  return lines.join("\n");
}
