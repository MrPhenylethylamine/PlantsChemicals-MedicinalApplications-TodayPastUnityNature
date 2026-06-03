import { describe, it, expect } from "vitest";
import { ALL_RULES, RULE_BY_ID, rulesForPersonTypes, searchRules } from "@/lib/tax/rules";
import { CALCULATORS } from "@/lib/tax/calculators";
import { valueForYear } from "@/lib/tax/values";
import { ARBEITNEHMER_PAUSCHBETRAG, SPARER_PAUSCHBETRAG } from "@/lib/tax/constants";
import { buildReport } from "@/lib/tax/report";
import { validateInput } from "@/lib/tax/validators";

describe("Regelwerk-Integrität", () => {
  it("hat eindeutige IDs", () => {
    const ids = ALL_RULES.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("verweist nur auf existierende Calculators", () => {
    for (const rule of ALL_RULES) {
      if (rule.calculatorKey) {
        expect(CALCULATORS[rule.calculatorKey], `Calculator fehlt: ${rule.calculatorKey} (${rule.id})`).toBeTypeOf("function");
      }
    }
  });

  it("jede Regel hat Rechtsgrundlage und Quellen", () => {
    for (const rule of ALL_RULES) {
      expect(rule.legalBasis.length, rule.id).toBeGreaterThan(0);
      expect(rule.officialSources.length, rule.id).toBeGreaterThan(0);
    }
  });

  it("interactionWithOtherRules referenziert existierende IDs", () => {
    for (const rule of ALL_RULES) {
      for (const ref of rule.interactionWithOtherRules ?? []) {
        expect(RULE_BY_ID.has(ref), `${rule.id} -> ${ref}`).toBe(true);
      }
    }
  });
});

describe("Konstanten / Jahresabhängigkeit", () => {
  it("Arbeitnehmer-Pauschbetrag steigt 2021->2023", () => {
    expect(valueForYear(ARBEITNEHMER_PAUSCHBETRAG, 2021)).toBe(1000);
    expect(valueForYear(ARBEITNEHMER_PAUSCHBETRAG, 2022)).toBe(1200);
    expect(valueForYear(ARBEITNEHMER_PAUSCHBETRAG, 2023)).toBe(1230);
  });
  it("Sparer-Pauschbetrag steigt ab 2023 auf 1.000 €", () => {
    expect(valueForYear(SPARER_PAUSCHBETRAG, 2022)).toBe(801);
    expect(valueForYear(SPARER_PAUSCHBETRAG, 2023)).toBe(1000);
  });
});

describe("Profil-basierte Freischaltung", () => {
  it("schaltet für Arbeitnehmer Werbungskosten frei", () => {
    const rules = rulesForPersonTypes(["arbeitnehmer"], 2024);
    expect(rules.some((r) => r.id === "wk-entfernungspauschale")).toBe(true);
  });
  it("blendet irrelevante Vermietungsregeln für reine Arbeitnehmer aus", () => {
    const rules = rulesForPersonTypes(["arbeitnehmer"], 2024);
    expect(rules.some((r) => r.category === "werbungskosten_vuv")).toBe(false);
  });
  it("Volltextsuche findet die Entfernungspauschale", () => {
    expect(searchRules("Pendler").some((r) => r.id === "wk-entfernungspauschale")).toBe(true);
  });
});

describe("Plausibilitätsprüfung", () => {
  it("warnt bei unrealistisch vielen Arbeitstagen", () => {
    const rule = RULE_BY_ID.get("wk-entfernungspauschale")!;
    const issues = validateInput(rule, { year: 2024, inputs: { arbeitstage: 300, entfernungKm: 20 } });
    expect(issues.some((i) => i.level === "warning")).toBe(true);
  });
});

describe("Report-Erstellung", () => {
  it("aggregiert Abzüge und direkte Steuerermäßigungen getrennt", () => {
    const report = buildReport(
      { year: 2024, personTypes: ["arbeitnehmer", "handwerkerleistungen"], marginalTaxRate: 0.3 },
      {
        "wk-entfernungspauschale": { ruleId: "wk-entfernungspauschale", inputs: { entfernungKm: 20, arbeitstage: 200 } },
        "se-handwerker": { ruleId: "se-handwerker", inputs: { arbeitskosten: 1000, materialkosten: 0 } },
      },
    );
    // Entfernung: 20*0,30*200 = 1200 abziehbar
    expect(report.totals.totalDeductible).toBeCloseTo(1200, 0);
    // Handwerker: 20% von 1000 = 200 direkte Ermäßigung
    expect(report.totals.totalDirectTaxReduction).toBe(200);
    expect(report.totals.estimatedTaxSaving).toBeGreaterThan(0);
  });
});
