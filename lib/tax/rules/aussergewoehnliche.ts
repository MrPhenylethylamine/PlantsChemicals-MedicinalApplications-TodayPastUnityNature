import type { TaxRule } from "@/types/tax";
import { makeRule } from "./_helpers";
import { SRC } from "@/lib/tax/sources";
import * as C from "@/lib/tax/constants";

/** Außergewöhnliche Belastungen (§§ 33, 33a, 33b EStG). */
export const aussergewoehnlicheRules: TaxRule[] = [
  makeRule({
    id: "agb-krankheitskosten",
    title: "Krankheitskosten",
    category: "aussergewoehnliche_belastungen",
    subcategory: "Gesundheit",
    legalBasis: ["§ 33 EStG"],
    officialSources: [SRC.estg33],
    plainLanguageExplanation:
      "Selbst getragene Krankheitskosten (Zuzahlungen, Medikamente, Zahnersatz, Brille, Heilbehandlung) sind außergewöhnliche Belastungen. Sie wirken sich aber erst aus, soweit sie Ihre individuelle 'zumutbare Belastung' übersteigen.",
    taxMechanism: "Abzug nach Abzug der zumutbaren Belastung (§ 33 Abs. 3 EStG, einkommens- und familienabhängig).",
    eligiblePersonTypes: ["krankheitskosten", "behinderung", "rentner"],
    amountType: "reasonable_burden",
    deductibilityStatus: "only_extraordinary_burden",
    requiredConditions: ["zwangsläufig, notwendig, angemessen", "selbst getragen (nicht erstattet)"],
    exclusionCriteria: ["von Versicherung/Beihilfe erstattete Kosten", "Vorsorge-/Wellnessmaßnahmen ohne medizinische Notwendigkeit"],
    thresholdLogic: "Nur der Teil oberhalb der zumutbaren Belastung wirkt sich aus.",
    requiredEvidence: ["Rechnungen", "Rezepte", "ärztliche Verordnung (z. B. bei Heilpraktiker, Kur, Hilfsmitteln)"],
    declarationArea: "Hauptvordruck (außergewöhnliche Belastungen)",
    calculatorKey: "aussergewoehnlicheBelastung",
    userQuestions: [{ id: "kosten", label: "Selbst getragene Krankheitskosten", type: "number", unit: "€" }],
    commonMistakes: [
      "Erstattete Beträge nicht abgezogen.",
      "Zumutbare Belastung übersehen – kleine Beträge wirken sich oft gar nicht aus.",
      "Fehlende ärztliche Verordnung vor Behandlungsbeginn (z. B. Kur).",
    ],
    auditRiskLevel: "medium",
    confidenceLevel: "verified",
    worthItHint: "Krankheitskosten möglichst in einem Jahr bündeln, um die zumutbare Belastung leichter zu überschreiten.",
    warningMessages: ["Bei Krankheitskosten wirkt sich der Betrag häufig erst aus, wenn die zumutbare Belastung überschritten wird."],
  }),

  makeRule({
    id: "agb-behinderten-pauschbetrag",
    title: "Behinderten-Pauschbetrag",
    category: "aussergewoehnliche_belastungen",
    subcategory: "Behinderung",
    legalBasis: ["§ 33b Abs. 1–3 EStG"],
    officialSources: [SRC.estg33b],
    plainLanguageExplanation:
      "Menschen mit Behinderung können statt Einzelnachweisen einen jährlichen Pauschbetrag ansetzen – gestaffelt nach Grad der Behinderung (GdB). Für hilflose und blinde Menschen gilt ein erhöhter Pauschbetrag.",
    taxMechanism: "Jahres-Pauschbetrag nach GdB (ohne zumutbare Belastung); seit 2021 verdoppelte Beträge.",
    eligiblePersonTypes: ["behinderung"],
    amountType: "lump_sum",
    deductibilityStatus: "only_extraordinary_burden",
    requiredConditions: ["Nachweis des GdB (Schwerbehindertenausweis/Bescheid)"],
    requiredEvidence: ["Feststellungsbescheid / Schwerbehindertenausweis"],
    declarationArea: "Anlage Außergewöhnliche Belastungen",
    userQuestions: [
      { id: "gdb", label: "Grad der Behinderung (GdB)", type: "number", helpText: "20, 30, …, 100" },
      { id: "hilflos", label: "Merkzeichen H, Bl oder TBl (hilflos/blind)?", type: "boolean" },
    ],
    interactionWithOtherRules: ["mob-behindertenfahrtkosten"],
    confidenceLevel: "verified",
    worthItHint: "Der Pauschbetrag wirkt OHNE Abzug der zumutbaren Belastung – schon ab GdB 20 nutzbar.",
  }),

  makeRule({
    id: "agb-pflege-pauschbetrag",
    title: "Pflege-Pauschbetrag",
    category: "aussergewoehnliche_belastungen",
    subcategory: "Pflege",
    legalBasis: ["§ 33b Abs. 6 EStG"],
    officialSources: [SRC.estg33b],
    plainLanguageExplanation:
      "Wer eine pflegebedürftige Person unentgeltlich (ohne Pflegevergütung) zu Hause pflegt, kann einen Pflege-Pauschbetrag ansetzen – gestaffelt nach Pflegegrad (seit 2021 ab Pflegegrad 2).",
    taxMechanism: "Pauschbetrag: PG 2: 600 €, PG 3: 1.100 €, PG 4/5 oder hilflos: 1.800 € (ohne zumutbare Belastung).",
    eligiblePersonTypes: ["pflegende_person"],
    amountType: "lump_sum",
    deductibilityStatus: "only_extraordinary_burden",
    requiredConditions: ["persönliche, unentgeltliche Pflege", "Pflegegrad 2 oder höher", "enge Bindung / häusliche Pflege"],
    exclusionCriteria: ["Erhalt von Pflegevergütung (Ausnahme: weitergeleitetes Pflegegeld bei eigenen Kindern)"],
    requiredEvidence: ["Nachweis Pflegegrad", "Angaben zur gepflegten Person"],
    declarationArea: "Anlage Außergewöhnliche Belastungen",
    userQuestions: [
      { id: "pflegegrad", label: "Pflegegrad der gepflegten Person", type: "select", options: [
        { value: "2", label: "Pflegegrad 2" },
        { value: "3", label: "Pflegegrad 3" },
        { value: "4", label: "Pflegegrad 4 / 5 / hilflos" },
      ] },
    ],
    confidenceLevel: "verified",
  }),

  makeRule({
    id: "agb-unterhalt",
    title: "Unterhalt an bedürftige Personen",
    category: "aussergewoehnliche_belastungen",
    subcategory: "Unterhalt",
    legalBasis: ["§ 33a Abs. 1 EStG"],
    officialSources: [SRC.estg33a],
    plainLanguageExplanation:
      "Unterhalt an gesetzlich unterhaltsberechtigte, bedürftige Personen (z. B. Eltern, Kinder ohne Kindergeldanspruch) ist bis zum Höchstbetrag (= Grundfreibetrag) abziehbar. Eigene Einkünfte und Bezüge des Empfängers über 624 € mindern den Höchstbetrag.",
    taxMechanism: "Abzug bis Höchstbetrag (Grundfreibetrag des Jahres), gekürzt um anrechenbare Einkünfte/Bezüge; ohne zumutbare Belastung.",
    eligiblePersonTypes: ["elternteil", "pflegende_person"],
    amountType: "maximum_amount",
    deductibilityStatus: "only_extraordinary_burden",
    maximumAmount: C.UNTERHALT_HOECHSTBETRAG,
    requiredConditions: ["gesetzliche Unterhaltspflicht oder gleichgestellt", "Bedürftigkeit", "geringes eigenes Vermögen des Empfängers"],
    requiredEvidence: ["Zahlungsnachweise (unbar)", "Nachweis Bedürftigkeit/Einkünfte des Empfängers"],
    declarationArea: "Anlage Unterhalt",
    calculatorKey: "unterhalt",
    userQuestions: [
      { id: "gezahlt", label: "Gezahlter Unterhalt im Jahr", type: "number", unit: "€" },
      { id: "eigeneEinkuenfteEmpfaenger", label: "Eigene Einkünfte/Bezüge des Empfängers", type: "number", unit: "€" },
    ],
    updateStatus: "annual_update_required",
    confidenceLevel: "needs_verification",
    warningMessages: ["Der Höchstbetrag (Grundfreibetrag) für 2025/2026 ist amtlich zu prüfen."],
  }),

  makeRule({
    id: "agb-bestattungskosten",
    title: "Bestattungskosten",
    category: "aussergewoehnliche_belastungen",
    subcategory: "Sonstiges",
    legalBasis: ["§ 33 EStG"],
    officialSources: [SRC.estg33],
    plainLanguageExplanation:
      "Bestattungskosten sind nur ausnahmsweise abziehbar – nämlich soweit sie den Nachlass übersteigen und Sie als Erbe zwangsläufig belastet sind. Auch hier gilt die zumutbare Belastung.",
    taxMechanism: "Außergewöhnliche Belastung, soweit Kosten den Wert des Nachlasses übersteigen; abzüglich zumutbarer Belastung.",
    eligiblePersonTypes: [],
    amountType: "case_by_case",
    deductibilityStatus: "special_case",
    requiredEvidence: ["Rechnungen", "Nachweis Nachlasswert"],
    declarationArea: "Hauptvordruck (außergewöhnliche Belastungen)",
    auditRiskLevel: "medium",
    confidenceLevel: "verified",
  }),
];
