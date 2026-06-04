import type { CalculationContext } from "@/types/tax";

/**
 * Berechnet die zumutbare Belastung nach § 33 Abs. 3 EStG.
 *
 * Seit dem BFH-Urteil vom 19.01.2017 (VI R 75/14) wird die zumutbare Belastung
 * stufenweise (nicht "auf einen Schlag") berechnet: Auf jeden Einkommensteil
 * innerhalb einer Stufe wird der jeweilige Prozentsatz angewandt.
 *
 * Stufen (Gesamtbetrag der Einkünfte):
 *   Stufe 1: bis 15.340 €
 *   Stufe 2: über 15.340 € bis 51.130 €
 *   Stufe 3: über 51.130 €
 *
 * Quelle: § 33 Abs. 3 EStG.
 */

const STUFE_1 = 15340;
const STUFE_2 = 51130;

/** Prozentsätze [Stufe1, Stufe2, Stufe3] je nach Familiensituation. */
function rates(numberOfChildren: number, jointAssessment: boolean): [number, number, number] {
  if (numberOfChildren >= 3) return [0.01, 0.01, 0.02];
  if (numberOfChildren >= 1) return [0.02, 0.03, 0.04];
  if (jointAssessment) return [0.04, 0.05, 0.06];
  return [0.05, 0.06, 0.07];
}

export function zumutbareBelastung(ctx: CalculationContext): number {
  const income = ctx.taxableIncome ?? 0;
  if (income <= 0) return 0;
  const [r1, r2, r3] = rates(ctx.numberOfChildren ?? 0, ctx.jointAssessment ?? false);

  const part1 = Math.min(income, STUFE_1);
  const part2 = Math.max(0, Math.min(income, STUFE_2) - STUFE_1);
  const part3 = Math.max(0, income - STUFE_2);

  return part1 * r1 + part2 * r2 + part3 * r3;
}
