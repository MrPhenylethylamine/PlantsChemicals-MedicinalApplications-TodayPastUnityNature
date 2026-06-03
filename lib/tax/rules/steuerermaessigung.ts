import type { TaxRule } from "@/types/tax";
import { makeRule } from "./_helpers";
import { SRC } from "@/lib/tax/sources";
import * as C from "@/lib/tax/constants";

/**
 * Steuerermäßigungen nach § 35a / § 35c EStG: Diese mindern direkt die
 * Steuerschuld (nicht das zu versteuernde Einkommen) und wirken daher
 * besonders stark.
 */
export const steuerermaessigungRules: TaxRule[] = [
  makeRule({
    id: "se-handwerker",
    title: "Handwerkerleistungen",
    category: "steuerermaessigung",
    subcategory: "§ 35a Abs. 3",
    legalBasis: ["§ 35a Abs. 3 EStG"],
    officialSources: [SRC.estg35a],
    plainLanguageExplanation:
      "Für Handwerkerleistungen im eigenen Haushalt (Renovierung, Reparatur, Wartung) bekommen Sie 20 % der Arbeitskosten direkt von der Steuer abgezogen – höchstens 1.200 € pro Jahr. Materialkosten zählen nicht.",
    taxMechanism: "Direkte Steuerermäßigung: 20 % der Lohn-/Arbeitskosten, max. 1.200 €/Jahr.",
    eligiblePersonTypes: ["handwerkerleistungen"],
    amountType: "percentage_tax_reduction",
    deductibilityStatus: "only_direct_tax_reduction",
    percentage: C.HANDWERKER.prozent,
    maximumAmount: { 2021: 1200, 2022: 1200, 2023: 1200, 2024: 1200, 2025: 1200, 2026: 1200 },
    requiredConditions: ["Leistung im eigenen Haushalt (Inland/EU)", "Rechnung vorhanden", "unbare Zahlung (Überweisung)"],
    exclusionCriteria: ["Barzahlung", "Neubaumaßnahmen (Handwerkerleistungen im Zusammenhang mit Neubau)"],
    requiredEvidence: ["Rechnung mit getrenntem Ausweis der Arbeitskosten", "Kontoauszug/Überweisungsbeleg"],
    declarationArea: "Hauptvordruck (Steuerermäßigungen) / Anlage Haushaltsnahe Aufwendungen",
    calculatorKey: "handwerkerleistungen",
    userQuestions: [
      { id: "arbeitskosten", label: "Arbeits-/Lohnkosten (laut Rechnung)", type: "number", unit: "€" },
      { id: "materialkosten", label: "Materialkosten (nicht begünstigt)", type: "number", unit: "€" },
    ],
    commonMistakes: ["Materialkosten mitgerechnet.", "Bar bezahlt (keine Anerkennung).", "Rechnung weist Arbeitskosten nicht getrennt aus."],
    auditRiskLevel: "medium",
    confidenceLevel: "verified",
    warningMessages: ["Für Handwerkerleistungen sind eine Rechnung und eine unbare Zahlung zwingend erforderlich."],
  }),

  makeRule({
    id: "se-haushaltsnahe-dl",
    title: "Haushaltsnahe Dienstleistungen",
    category: "steuerermaessigung",
    subcategory: "§ 35a Abs. 2",
    legalBasis: ["§ 35a Abs. 2 EStG"],
    officialSources: [SRC.estg35a],
    plainLanguageExplanation:
      "Für haushaltsnahe Dienstleistungen (Reinigung, Gartenpflege, Winterdienst, Pflege-/Betreuungsleistungen) erhalten Sie 20 % der Kosten als direkte Steuerermäßigung – höchstens 4.000 € pro Jahr.",
    taxMechanism: "Direkte Steuerermäßigung: 20 % der Aufwendungen, max. 4.000 €/Jahr.",
    eligiblePersonTypes: ["haushaltsnahe_dienstleistungen", "pflegende_person"],
    amountType: "percentage_tax_reduction",
    deductibilityStatus: "only_direct_tax_reduction",
    percentage: C.HAUSHALTSNAHE_DL.prozent,
    maximumAmount: { 2021: 4000, 2022: 4000, 2023: 4000, 2024: 4000, 2025: 4000, 2026: 4000 },
    requiredConditions: ["Leistung im eigenen Haushalt", "Rechnung", "unbare Zahlung"],
    requiredEvidence: ["Rechnung", "Überweisungsbeleg"],
    declarationArea: "Hauptvordruck (Steuerermäßigungen)",
    calculatorKey: "haushaltsnaheDienstleistungen",
    userQuestions: [{ id: "kosten", label: "Aufwendungen (Arbeitskosten)", type: "number", unit: "€" }],
    commonMistakes: ["Barzahlung.", "In den Nebenkosten enthaltene haushaltsnahe Leistungen übersehen."],
    confidenceLevel: "verified",
  }),

  makeRule({
    id: "se-haushaltsnahe-minijob",
    title: "Haushaltsnahe Beschäftigung (Minijob im Privathaushalt)",
    category: "steuerermaessigung",
    subcategory: "§ 35a Abs. 1",
    legalBasis: ["§ 35a Abs. 1 EStG"],
    officialSources: [SRC.estg35a],
    plainLanguageExplanation:
      "Für einen im Privathaushalt angemeldeten Minijob (z. B. Haushaltshilfe über das Haushaltsscheckverfahren) erhalten Sie 20 % der Kosten, höchstens 510 € pro Jahr.",
    taxMechanism: "Direkte Steuerermäßigung: 20 %, max. 510 €/Jahr.",
    eligiblePersonTypes: ["haushaltsnahe_dienstleistungen"],
    amountType: "percentage_tax_reduction",
    deductibilityStatus: "only_direct_tax_reduction",
    percentage: C.HAUSHALTSNAHE_MINIJOB.prozent,
    maximumAmount: { 2021: 510, 2022: 510, 2023: 510, 2024: 510, 2025: 510, 2026: 510 },
    requiredConditions: ["Haushaltsscheckverfahren (Minijob-Zentrale)"],
    requiredEvidence: ["Bescheinigung der Minijob-Zentrale"],
    declarationArea: "Hauptvordruck (Steuerermäßigungen)",
    calculatorKey: "haushaltsnaheMinijob",
    userQuestions: [{ id: "kosten", label: "Aufwendungen für den Minijob", type: "number", unit: "€" }],
    confidenceLevel: "verified",
  }),

  makeRule({
    id: "se-energetische-sanierung",
    title: "Energetische Sanierung (selbstgenutzte Immobilie)",
    category: "steuerermaessigung",
    subcategory: "§ 35c",
    legalBasis: ["§ 35c EStG"],
    officialSources: [SRC.estg35c],
    plainLanguageExplanation:
      "Energetische Sanierungsmaßnahmen an der selbstgenutzten, mindestens 10 Jahre alten Immobilie (z. B. Dämmung, Fenster, Heizung) werden mit insgesamt 20 % der Kosten gefördert – verteilt über drei Jahre, höchstens 40.000 € je Objekt.",
    taxMechanism: "Direkte Steuerermäßigung 20 % über 3 Jahre (7 % / 7 % / 6 %), max. 40.000 € je Objekt.",
    eligiblePersonTypes: ["energetische_sanierung"],
    amountType: "percentage_tax_reduction",
    deductibilityStatus: "only_direct_tax_reduction",
    percentage: C.ENERGETISCHE_SANIERUNG.prozentGesamt,
    maximumAmount: { 2021: 40000, 2022: 40000, 2023: 40000, 2024: 40000, 2025: 40000, 2026: 40000 },
    requiredConditions: ["selbstgenutztes Gebäude älter als 10 Jahre", "Fachunternehmen", "Bescheinigung nach amtlichem Muster", "unbare Zahlung"],
    exclusionCriteria: ["gleichzeitige Förderung (KfW/BAFA) für dieselbe Maßnahme", "Vermietungsobjekte (dort: Werbungskosten/AfA)"],
    requiredEvidence: ["Fachunternehmer-Bescheinigung (§ 35c)", "Rechnung", "Überweisungsbeleg"],
    declarationArea: "Anlage Energetische Maßnahmen",
    calculatorKey: "energetischeSanierung",
    userQuestions: [{ id: "kosten", label: "Förderfähige Sanierungskosten", type: "number", unit: "€" }],
    auditRiskLevel: "medium",
    confidenceLevel: "verified",
    warningMessages: ["Keine Doppelförderung: Wer Zuschüsse/Förderkredite nutzt, kann § 35c für dieselbe Maßnahme nicht zusätzlich beanspruchen."],
  }),
];
