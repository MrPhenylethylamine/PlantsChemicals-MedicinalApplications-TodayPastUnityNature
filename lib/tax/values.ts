import type { TaxYear, YearlyValue } from "@/types/tax";

/**
 * Liest einen jahresabhängigen Wert. Gibt `null` zurück, wenn für das Jahr
 * kein geprüfter Wert hinterlegt ist (dann muss das UI "zu prüfen" anzeigen).
 */
export function valueForYear(
  value: YearlyValue | undefined,
  year: TaxYear,
): number | null {
  if (!value) return null;
  if (!(year in value)) return null;
  const v = value[year];
  return v === undefined ? null : v;
}

/** Liest einen Prozentsatz, der konstant oder jahresabhängig sein kann. */
export function percentageForYear(
  value: number | YearlyValue | undefined,
  year: TaxYear,
): number | null {
  if (value === undefined) return null;
  if (typeof value === "number") return value;
  return valueForYear(value, year);
}

/** Formatiert einen Betrag als Euro-String in deutscher Schreibweise. */
export function formatEuro(amount: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Formatiert einen Prozentwert (0..1) als "20 %". */
export function formatPercent(value: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(value);
}

/** Rundet auf 2 Nachkommastellen (kaufmännisch). */
export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}
