import type { TaxRule } from "@/types/tax";
import { makeRule } from "./_helpers";
import { SRC } from "@/lib/tax/sources";
import * as C from "@/lib/tax/constants";

/** Vermietung & Verpachtung sowie Kapitalvermögen. */
export const vermietungKapitalRules: TaxRule[] = [
  makeRule({
    id: "vuv-werbungskosten",
    title: "Werbungskosten bei Vermietung (laufende Kosten)",
    category: "werbungskosten_vuv",
    subcategory: "Laufende Kosten",
    legalBasis: ["§ 9 EStG", "§ 21 EStG"],
    officialSources: [SRC.estg21, SRC.estg9],
    plainLanguageExplanation:
      "Bei Vermietung sind laufende Kosten wie Schuldzinsen, Grundsteuer, Versicherungen, Hausverwaltung, nicht umlegbare Nebenkosten und Erhaltungsaufwand als Werbungskosten abziehbar.",
    taxMechanism: "Werbungskosten bei den Einkünften aus V+V; unbegrenzt, soweit Einkünfteerzielungsabsicht besteht.",
    eligiblePersonTypes: ["vermieter"],
    amountType: "unlimited_if_eligible",
    unlimitedDeduction: true,
    deductibilityStatus: "only_rental",
    requiredConditions: ["Einkünfteerzielungsabsicht", "Zusammenhang mit der Vermietung"],
    requiredEvidence: ["Rechnungen", "Darlehensnachweise", "Nebenkostenabrechnungen"],
    declarationArea: "Anlage V",
    calculatorKey: "vollAbziehbar",
    userQuestions: [{ id: "betrag", label: "Summe der laufenden Werbungskosten", type: "number", unit: "€" }],
    commonMistakes: ["Tilgungsanteil des Darlehens mit angesetzt (nur Zinsen abziehbar)."],
    confidenceLevel: "verified",
  }),

  makeRule({
    id: "vuv-erhaltung-vs-herstellung",
    title: "Erhaltungsaufwand vs. anschaffungsnahe Herstellungskosten",
    category: "werbungskosten_vuv",
    subcategory: "Renovierung",
    legalBasis: ["§ 6 Abs. 1 Nr. 1a EStG", "§ 9 EStG"],
    officialSources: [SRC.estg21],
    plainLanguageExplanation:
      "Renovierungskosten sind sofort abziehbar (Erhaltungsaufwand) – ABER: Übersteigen Instandsetzungs-/Modernisierungskosten innerhalb von 3 Jahren nach Anschaffung 15 % der Gebäude-Anschaffungskosten (netto), gelten sie als anschaffungsnahe Herstellungskosten und sind nur über die AfA abziehbar.",
    taxMechanism: "Sofortabzug als Erhaltungsaufwand; bei Überschreiten der 15-%-Grenze: nur AfA über die Nutzungsdauer.",
    eligiblePersonTypes: ["vermieter"],
    amountType: "case_by_case",
    deductibilityStatus: "special_case",
    thresholdLogic: "15-%-Grenze: Netto-Instandsetzungskosten der ersten 3 Jahre vs. 15 % der Gebäude-Anschaffungskosten.",
    requiredEvidence: ["Rechnungen", "Kaufvertrag (Gebäudeanteil)"],
    declarationArea: "Anlage V",
    auditRiskLevel: "high",
    confidenceLevel: "verified",
    warningMessages: ["Achtung 15-%-Grenze in den ersten 3 Jahren nach Kauf – sonst nur Abschreibung statt Sofortabzug."],
  }),

  makeRule({
    id: "vuv-afa",
    title: "Gebäude-Abschreibung (AfA)",
    category: "werbungskosten_vuv",
    subcategory: "Abschreibung",
    legalBasis: ["§ 7 Abs. 4 EStG", "§ 7 Abs. 5a EStG"],
    officialSources: [SRC.estg7, SRC.estg21],
    plainLanguageExplanation:
      "Die Anschaffungs-/Herstellungskosten des Gebäudes (nicht des Grundstücks) werden über die Nutzungsdauer abgeschrieben. Für Wohngebäude gilt je nach Baujahr/Fertigstellung ein bestimmter AfA-Satz; für Neubauten ab 2023 gibt es zusätzlich eine degressive AfA.",
    taxMechanism: "Lineare AfA (i. d. R. 2 % oder 3 %); für Neubauten (Bauantrag/Fertigstellung ab 2023) optional degressive AfA.",
    eligiblePersonTypes: ["vermieter"],
    amountType: "case_by_case",
    deductibilityStatus: "only_rental",
    requiredEvidence: ["Kaufvertrag", "Aufteilung Grund/Gebäude", "Baujahr/Fertigstellung"],
    declarationArea: "Anlage V",
    confidenceLevel: "needs_verification",
    updateStatus: "annual_update_required",
    warningMessages: ["AfA-Sätze und degressive AfA für Neubauten sind regelmäßig anzupassen – bitte aktuelle Werte prüfen."],
  }),

  makeRule({
    id: "kap-sparer-pauschbetrag",
    title: "Sparer-Pauschbetrag",
    category: "werbungskosten_kapital",
    subcategory: "Kapitalvermögen",
    legalBasis: ["§ 20 Abs. 9 EStG"],
    officialSources: [SRC.estg20],
    plainLanguageExplanation:
      "Kapitalerträge sind bis zum Sparer-Pauschbetrag steuerfrei (ab 2023: 1.000 € / 2.000 € bei Zusammenveranlagung). Tatsächliche Werbungskosten sind bei Kapitalerträgen grundsätzlich nicht abziehbar.",
    taxMechanism: "Pauschbetrag, der die tatsächlichen Werbungskosten ersetzt (Abzugsverbot § 20 Abs. 9 EStG).",
    eligiblePersonTypes: ["kapitalanleger"],
    amountType: "lump_sum",
    deductibilityStatus: "deductible",
    lumpSumAmount: C.SPARER_PAUSCHBETRAG,
    requiredEvidence: ["Steuerbescheinigung der Bank", "Freistellungsauftrag"],
    declarationArea: "Anlage KAP",
    interactionWithOtherRules: ["kap-guenstigerpruefung"],
    confidenceLevel: "verified",
    updateStatus: "annual_update_required",
    worthItHint: "Anlage KAP lohnt sich u. a. bei nicht ausgeschöpftem Freistellungsauftrag, Verlustverrechnung oder niedrigem persönlichen Steuersatz (Günstigerprüfung).",
  }),

  makeRule({
    id: "kap-guenstigerpruefung",
    title: "Günstigerprüfung bei Kapitalerträgen",
    category: "werbungskosten_kapital",
    subcategory: "Kapitalvermögen",
    legalBasis: ["§ 32d Abs. 6 EStG"],
    officialSources: [SRC.estg20],
    plainLanguageExplanation:
      "Liegt Ihr persönlicher Steuersatz unter 25 %, kann die Günstigerprüfung dazu führen, dass Kapitalerträge mit dem niedrigeren persönlichen Satz besteuert werden – zu viel gezahlte Abgeltungsteuer wird erstattet.",
    taxMechanism: "Antrag in der Anlage KAP; Finanzamt prüft automatisch die günstigere Variante.",
    eligiblePersonTypes: ["kapitalanleger", "rentner", "student"],
    amountType: "case_by_case",
    deductibilityStatus: "special_case",
    requiredEvidence: ["Steuerbescheinigung"],
    declarationArea: "Anlage KAP",
    confidenceLevel: "verified",
    worthItHint: "Besonders für Rentner und Studierende mit niedrigem Einkommen oft eine echte Erstattungsquelle.",
  }),
];
