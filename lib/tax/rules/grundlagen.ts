import type { TaxRule } from "@/types/tax";
import { makeRule } from "./_helpers";
import { SRC } from "@/lib/tax/sources";

/**
 * Grundlagen-/Wissensbausteine ohne eigenen Betrag sowie einzelne Spezialregeln
 * (Mobilität, Fristen-Verlustvortrag), die von anderen Regeln referenziert werden.
 */
export const grundlagenRules: TaxRule[] = [
  makeRule({
    id: "grundlagen-kategorien",
    title: "Die 5 steuerlichen Grundkategorien",
    category: "grundlagen",
    subcategory: "Überblick",
    legalBasis: ["§ 9 EStG", "§ 4 EStG", "§ 10 EStG", "§ 33 EStG", "§ 35a EStG"],
    officialSources: [SRC.estg9, SRC.estg10, SRC.estg33, SRC.estg35a],
    plainLanguageExplanation:
      "Ausgaben werden steuerlich unterschiedlich behandelt, je nachdem, in welche Kategorie sie fallen: Werbungskosten (bei Arbeitnehmern/Vermietung), Betriebsausgaben (bei Selbständigen), Sonderausgaben (z. B. Vorsorge, Spenden, Kirchensteuer), außergewöhnliche Belastungen (z. B. Krankheitskosten) und Steuerermäßigungen (§ 35a/§ 35c, direkter Abzug von der Steuer).",
    taxMechanism:
      "Werbungskosten/Betriebsausgaben und Sonderausgaben/a. g. B. mindern das zu versteuernde Einkommen (Wirkung = Betrag × Grenzsteuersatz). Steuerermäßigungen mindern direkt die Steuerschuld (Wirkung = voller Ermäßigungsbetrag).",
    eligiblePersonTypes: [],
    amountType: "case_by_case",
    deductibilityStatus: "special_case",
    requiredEvidence: [],
    declarationArea: "—",
    confidenceLevel: "verified",
  }),

  makeRule({
    id: "grundlagen-absetzen",
    title: "Was bedeutet „von der Steuer absetzen“?",
    category: "grundlagen",
    subcategory: "Überblick",
    legalBasis: ["§ 2 EStG"],
    officialSources: [SRC.estg9],
    plainLanguageExplanation:
      "„Absetzen“ heißt meist: Eine Ausgabe mindert das zu versteuernde Einkommen. Die echte Ersparnis ist NICHT der ganze Betrag, sondern Betrag × persönlicher Steuersatz. Eine Erstattung gibt es nur, wenn vorher zu viel Steuer gezahlt wurde. Steuerermäßigungen (§ 35a) senken dagegen die Steuer selbst – Euro für Euro.",
    taxMechanism: "Minderung der Bemessungsgrundlage (zu versteuerndes Einkommen) bzw. direkte Steuerermäßigung.",
    eligiblePersonTypes: [],
    amountType: "case_by_case",
    deductibilityStatus: "special_case",
    requiredEvidence: [],
    declarationArea: "—",
    confidenceLevel: "verified",
  }),

  makeRule({
    id: "fristen-verlustvortrag",
    title: "Verlustvortrag und Verlustfeststellung",
    category: "grundlagen",
    subcategory: "Fristen",
    legalBasis: ["§ 10d EStG", "§ 181 Abs. 5 AO"],
    officialSources: [SRC.estg10d, SRC.ao181],
    plainLanguageExplanation:
      "Negative Einkünfte (Verluste), die im Entstehungsjahr nicht genutzt werden, können vorgetragen werden (Verlustvortrag) und mindern Steuern in Folgejahren. Besonders relevant bei Ausbildungs-/Studienkosten ohne Einkommen. Die Verlustfeststellung ist bis zu 7 Jahre rückwirkend möglich.",
    taxMechanism: "Gesonderte Feststellung des verbleibenden Verlustvortrags; Verrechnung in Folgejahren.",
    eligiblePersonTypes: ["student", "umschulung"],
    amountType: "case_by_case",
    deductibilityStatus: "special_case",
    requiredEvidence: ["Belege des Verlustjahres", "Antrag auf Verlustfeststellung"],
    declarationArea: "Erklärung zur Feststellung des verbleibenden Verlustvortrags",
    retroactiveClaimPossible: true,
    retroactiveClaimExplanation:
      "Die erstmalige Verlustfeststellung ist bis zu 7 Jahre rückwirkend möglich (§ 181 Abs. 5 AO), solange noch keine bestandskräftige Feststellung vorliegt.",
    limitationPeriodLogic: "7 Jahre für die erstmalige Verlustfeststellung (§ 181 Abs. 5 AO i. V. m. § 169 AO).",
    confidenceLevel: "verified",
  }),

  makeRule({
    id: "mob-behindertenfahrtkosten",
    title: "Behinderungsbedingte Fahrtkosten (Pauschale)",
    category: "aussergewoehnliche_belastungen",
    subcategory: "Behinderung",
    legalBasis: ["§ 33 Abs. 2a EStG"],
    officialSources: [SRC.estg33],
    plainLanguageExplanation:
      "Menschen mit Behinderung können seit 2021 eine behinderungsbedingte Fahrtkostenpauschale geltend machen: 900 € (ab GdB 80 bzw. GdB 70 mit Merkzeichen G) oder 4.500 € (Merkzeichen aG, Bl, H, TBl). Sie unterliegt der zumutbaren Belastung.",
    taxMechanism: "Pauschale 900 € bzw. 4.500 € (behinderungsbedingte Fahrtkosten), abzüglich zumutbarer Belastung.",
    eligiblePersonTypes: ["behinderung"],
    amountType: "lump_sum",
    deductibilityStatus: "only_extraordinary_burden",
    lumpSumAmount: { 2021: 900, 2022: 900, 2023: 900, 2024: 900, 2025: 900, 2026: 900 },
    requiredConditions: ["GdB-Voraussetzungen bzw. Merkzeichen"],
    requiredEvidence: ["Schwerbehindertenausweis/Bescheid"],
    declarationArea: "Anlage Außergewöhnliche Belastungen",
    confidenceLevel: "verified",
    warningMessages: ["Die höhere Pauschale (4.500 €) gilt nur bei den Merkzeichen aG, Bl, H oder TBl."],
  }),
];
