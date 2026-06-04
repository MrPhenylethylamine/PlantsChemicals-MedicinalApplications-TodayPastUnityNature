import { describe, it, expect } from "vitest";
import type { CalculationContext, TaxYear } from "@/types/tax";
import {
  entfernungspauschale,
  homeofficePauschale,
  arbeitsmittel,
  handwerkerleistungen,
  haushaltsnaheDienstleistungen,
  kinderbetreuung,
  schulgeld,
  energetischeSanierung,
  studienkosten,
  aussergewoehnlicheBelastung,
  unterhalt,
  zumutbareBelastung,
} from "@/lib/tax/calculators";

function ctx(year: TaxYear, inputs: CalculationContext["inputs"], extra: Partial<CalculationContext> = {}): CalculationContext {
  return { year, inputs, ...extra };
}

describe("Entfernungspauschale", () => {
  it("rechnet erste 20 km mit 0,30 € und ab 21. km mit erhöhtem Satz (2024: 0,38 €)", () => {
    // 30 km, 200 Tage: (20*0,30 + 10*0,38) * 200 = (6 + 3,8)*200 = 1960
    const r = entfernungspauschale(ctx(2024, { entfernungKm: 30, arbeitstage: 200 }));
    expect(r.inputAmount).toBeCloseTo(1960, 2);
    expect(r.deductibleAmount).toBeCloseTo(1960, 2);
  });

  it("nutzt 2021 den niedrigeren erhöhten Satz von 0,35 €", () => {
    // 30 km, 100 Tage: (20*0,30 + 10*0,35)*100 = (6+3,5)*100 = 950
    const r = entfernungspauschale(ctx(2021, { entfernungKm: 30, arbeitstage: 100 }));
    expect(r.inputAmount).toBeCloseTo(950, 2);
  });

  it("deckelt ohne eigenen Pkw auf den Höchstbetrag von 4.500 €", () => {
    const r = entfernungspauschale(ctx(2024, { entfernungKm: 60, arbeitstage: 230, eigenerPkw: false }));
    expect(r.deductibleAmount).toBe(4500);
    expect(r.nonDeductibleAmount).toBeGreaterThan(0);
    expect(r.warnings.join(" ")).toMatch(/Höchstbetrag/);
  });

  it("hebt den Höchstbetrag bei eigenem Pkw auf", () => {
    const r = entfernungspauschale(ctx(2024, { entfernungKm: 60, arbeitstage: 230, eigenerPkw: true }));
    expect(r.deductibleAmount).toBeGreaterThan(4500);
    expect(r.nonDeductibleAmount).toBe(0);
  });
});

describe("Homeoffice-/Tagespauschale", () => {
  it("2022: 5 €/Tag, gedeckelt auf 600 € (120 Tage)", () => {
    const r = homeofficePauschale(ctx(2022, { homeofficeTage: 200 }));
    expect(r.deductibleAmount).toBe(600);
    expect(r.warnings.length).toBeGreaterThan(0);
  });

  it("2023: 6 €/Tag bis 1.260 € (210 Tage)", () => {
    expect(homeofficePauschale(ctx(2023, { homeofficeTage: 100 })).deductibleAmount).toBe(600);
    expect(homeofficePauschale(ctx(2023, { homeofficeTage: 300 })).deductibleAmount).toBe(1260);
  });
});

describe("Arbeitsmittel / GWG", () => {
  it("warnt bei Überschreiten der GWG-Brutto-Grenze (AfA-Hinweis)", () => {
    const r = arbeitsmittel(ctx(2024, { kosten: 1500, beruflicherAnteilProzent: 100 }));
    expect(r.warnings.join(" ")).toMatch(/GWG-Grenze/);
  });

  it("kürzt anteilig bei gemischter Nutzung", () => {
    const r = arbeitsmittel(ctx(2024, { kosten: 1000, beruflicherAnteilProzent: 60 }));
    expect(r.deductibleAmount).toBe(600);
    expect(r.nonDeductibleAmount).toBe(400);
  });
});

describe("Handwerkerleistungen (§ 35a Abs. 3)", () => {
  it("20 % der Arbeitskosten, max. 1.200 € Steuerermäßigung", () => {
    const r = handwerkerleistungen(ctx(2024, { arbeitskosten: 5000, materialkosten: 2000 }));
    expect(r.directTaxReduction).toBe(1000); // 20% von 5000
  });
  it("deckelt die Ermäßigung bei hohen Arbeitskosten auf 1.200 €", () => {
    const r = handwerkerleistungen(ctx(2024, { arbeitskosten: 10000, materialkosten: 0 }));
    expect(r.directTaxReduction).toBe(1200);
  });
  it("weist auf unbare Zahlung hin", () => {
    const r = handwerkerleistungen(ctx(2024, { arbeitskosten: 100 }));
    expect(r.warnings.join(" ")).toMatch(/unbare Zahlung|Überweisung/);
  });
});

describe("Haushaltsnahe Dienstleistungen", () => {
  it("20 %, max. 4.000 €", () => {
    expect(haushaltsnaheDienstleistungen(ctx(2024, { kosten: 30000 })).directTaxReduction).toBe(4000);
  });
});

describe("Energetische Sanierung (§ 35c)", () => {
  it("20 % gesamt, max. 40.000 €", () => {
    expect(energetischeSanierung(ctx(2024, { kosten: 100000 })).directTaxReduction).toBe(20000);
    expect(energetischeSanierung(ctx(2024, { kosten: 300000 })).directTaxReduction).toBe(40000);
  });
});

describe("Kinderbetreuung", () => {
  it("2024: zwei Drittel, max. 4.000 €", () => {
    const r = kinderbetreuung(ctx(2024, { kosten: 9000 }));
    expect(r.deductibleAmount).toBe(4000); // 2/3 von 9000 = 6000 -> gedeckelt 4000
  });
  it("2025: 80 %, max. 4.800 €", () => {
    const r = kinderbetreuung(ctx(2025, { kosten: 5000 }));
    expect(r.deductibleAmount).toBe(4000); // 80% von 5000
    expect(kinderbetreuung(ctx(2025, { kosten: 10000 })).deductibleAmount).toBe(4800);
  });
});

describe("Schulgeld", () => {
  it("30 %, max. 5.000 €", () => {
    expect(schulgeld(ctx(2024, { kosten: 10000 })).deductibleAmount).toBe(3000);
    expect(schulgeld(ctx(2024, { kosten: 30000 })).deductibleAmount).toBe(5000);
  });
});

describe("Studienkosten Erst- vs. Zweitstudium", () => {
  it("Erststudium: Sonderausgaben, max. 6.000 €, kein Vortrag", () => {
    const r = studienkosten(ctx(2024, { kosten: 8000, istErststudium: true }));
    expect(r.deductibleAmount).toBe(6000);
    expect(r.warnings.join(" ")).toMatch(/NICHT vortragsfähig/i);
  });
  it("Zweitstudium ohne Einkünfte: unbegrenzt + Verlustvortrag-Hinweis", () => {
    const r = studienkosten(ctx(2024, { kosten: 8000, istErststudium: false, hatEinkuenfte: false }));
    expect(r.deductibleAmount).toBe(8000);
    expect((r.explanation.join(" ") + r.worthItHint).toLowerCase()).toMatch(/verlustvortrag/);
  });
});

describe("zumutbare Belastung (§ 33 Abs. 3, stufenweise)", () => {
  it("ledig ohne Kinder, 40.000 € z.v.E.", () => {
    // 15340*5% + (40000-15340)*6% = 767 + 1479,6 = 2246,6
    const zb = zumutbareBelastung(ctx(2024, {}, { taxableIncome: 40000, numberOfChildren: 0, jointAssessment: false }));
    expect(zb).toBeCloseTo(2246.6, 1);
  });
  it("mit 3 Kindern niedrigere Sätze", () => {
    const zb = zumutbareBelastung(ctx(2024, {}, { taxableIncome: 40000, numberOfChildren: 3 }));
    // 15340*1% + (40000-15340)*1% = 153,4 + 246,6 = 400
    expect(zb).toBeCloseTo(400, 1);
  });
});

describe("Außergewöhnliche Belastung", () => {
  it("zieht zumutbare Belastung ab", () => {
    const r = aussergewoehnlicheBelastung(ctx(2024, { kosten: 5000 }, { taxableIncome: 40000, numberOfChildren: 0 }));
    expect(r.deductibleAmount).toBeCloseTo(5000 - 2246.6, 1);
  });
  it("wirkt nicht, wenn Kosten unter der zumutbaren Belastung liegen", () => {
    const r = aussergewoehnlicheBelastung(ctx(2024, { kosten: 1000 }, { taxableIncome: 40000 }));
    expect(r.deductibleAmount).toBe(0);
    expect(r.warnings.join(" ")).toMatch(/zumutbare[rn]? Belastung/);
  });
});

describe("Unterhalt (§ 33a)", () => {
  it("rechnet eigene Einkünfte über 624 € an", () => {
    // 2024 Höchstbetrag 11604; Empfänger 2000 -> Anrechnung 1376 -> Grenze 10228
    const r = unterhalt(ctx(2024, { gezahlt: 12000, eigeneEinkuenfteEmpfaenger: 2000 }));
    expect(r.deductibleAmount).toBeCloseTo(10228, 0);
  });
});

describe("Steuerersparnis-Schätzung", () => {
  it("nutzt den Grenzsteuersatz für Abzugsbeträge", () => {
    const r = entfernungspauschale(ctx(2024, { entfernungKm: 20, arbeitstage: 100 }, { marginalTaxRate: 0.3 }));
    // 20*0,30*100 = 600 -> 30% = 180
    expect(r.estimatedTaxSaving).toBeCloseTo(180, 2);
  });
});
