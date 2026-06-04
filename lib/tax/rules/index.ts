import type { PersonType, TaxCategory, TaxRule, TaxYear } from "@/types/tax";
import { werbungskostenRules } from "./werbungskosten";
import { betriebsausgabenRules } from "./betriebsausgaben";
import { vermietungKapitalRules } from "./vermietungKapital";
import { sonderausgabenRules } from "./sonderausgaben";
import { aussergewoehnlicheRules } from "./aussergewoehnliche";
import { steuerermaessigungRules } from "./steuerermaessigung";
import { familieRules } from "./familie";
import { studiumRules } from "./studium";
import { grundlagenRules } from "./grundlagen";

/** Alle Regeln des Regelwerks. */
export const ALL_RULES: TaxRule[] = [
  ...grundlagenRules,
  ...werbungskostenRules,
  ...betriebsausgabenRules,
  ...vermietungKapitalRules,
  ...sonderausgabenRules,
  ...aussergewoehnlicheRules,
  ...steuerermaessigungRules,
  ...familieRules,
  ...studiumRules,
];

/** Schneller Zugriff über die Regel-ID. */
export const RULE_BY_ID: Map<string, TaxRule> = new Map(ALL_RULES.map((r) => [r.id, r]));

export function getRule(id: string): TaxRule | undefined {
  return RULE_BY_ID.get(id);
}

/** Gilt die Regel für das angegebene Jahr? */
export function ruleAppliesToYear(rule: TaxRule, year: TaxYear): boolean {
  return rule.applicableYears.includes(year);
}

/** Liefert alle Regeln, die für mindestens einen der Personentypen relevant sind. */
export function rulesForPersonTypes(personTypes: PersonType[], year?: TaxYear): TaxRule[] {
  const set = new Set(personTypes);
  return ALL_RULES.filter((rule) => {
    if (year && !ruleAppliesToYear(rule, year)) return false;
    if (rule.eligiblePersonTypes.length === 0) return false; // reine Grundlagen separat
    return rule.eligiblePersonTypes.some((p) => set.has(p));
  });
}

/** Gruppiert Regeln nach Kategorie. */
export function groupByCategory(rules: TaxRule[]): Record<string, TaxRule[]> {
  return rules.reduce<Record<string, TaxRule[]>>((acc, rule) => {
    (acc[rule.category] ??= []).push(rule);
    return acc;
  }, {});
}

export function rulesByCategory(category: TaxCategory, year?: TaxYear): TaxRule[] {
  return ALL_RULES.filter((r) => r.category === category && (!year || ruleAppliesToYear(r, year)));
}

/** Volltextsuche über Titel, Erklärung und Unterkategorie. */
export function searchRules(query: string): TaxRule[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return ALL_RULES.filter(
    (r) =>
      r.title.toLowerCase().includes(q) ||
      r.subcategory.toLowerCase().includes(q) ||
      r.plainLanguageExplanation.toLowerCase().includes(q) ||
      r.legalBasis.some((l) => l.toLowerCase().includes(q)),
  );
}

export const CATEGORY_LABELS: Record<TaxCategory, string> = {
  werbungskosten: "Werbungskosten (Arbeitnehmer)",
  betriebsausgaben: "Betriebsausgaben (Selbständige)",
  werbungskosten_vuv: "Vermietung & Verpachtung",
  werbungskosten_kapital: "Kapitalvermögen",
  sonderausgaben: "Sonderausgaben",
  aussergewoehnliche_belastungen: "Außergewöhnliche Belastungen",
  steuerermaessigung: "Steuerermäßigungen (§ 35a/§ 35c)",
  freibetrag_familie: "Familie & Kinder",
  grundlagen: "Grundlagen",
};
