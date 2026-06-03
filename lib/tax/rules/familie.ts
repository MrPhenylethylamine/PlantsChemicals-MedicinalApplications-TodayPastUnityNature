import type { TaxRule } from "@/types/tax";
import { makeRule } from "./_helpers";
import { SRC } from "@/lib/tax/sources";
import * as C from "@/lib/tax/constants";

/** Familie, Kinder, Alleinerziehende. */
export const familieRules: TaxRule[] = [
  makeRule({
    id: "fam-entlastung-alleinerziehend",
    title: "Entlastungsbetrag für Alleinerziehende",
    category: "freibetrag_familie",
    subcategory: "Alleinerziehende",
    legalBasis: ["§ 24b EStG"],
    officialSources: [SRC.estg24b],
    plainLanguageExplanation:
      "Echte Alleinerziehende mit mindestens einem Kind (Kindergeldanspruch) erhalten einen Entlastungsbetrag, der das zu versteuernde Einkommen mindert. Voraussetzung: keine weitere erwachsene Person im Haushalt.",
    taxMechanism: "Freibetrag: Grundbetrag (4.260 € ab 2023) + 240 € je weiterem Kind.",
    eligiblePersonTypes: ["alleinerziehend", "elternteil"],
    amountType: "lump_sum",
    deductibilityStatus: "deductible",
    lumpSumAmount: C.ENTLASTUNGSBETRAG_ALLEINERZIEHEND,
    requiredConditions: ["alleinstehend i. S. d. § 24b EStG", "mind. ein Kind mit Kindergeldanspruch im Haushalt"],
    exclusionCriteria: ["Haushaltsgemeinschaft mit anderer volljähriger Person (außer eigene Kinder mit Kindergeldanspruch)"],
    requiredEvidence: ["Meldedaten Kind", "Versicherung der Alleinerziehung"],
    declarationArea: "Anlage Kind / Hauptvordruck",
    calculatorKey: "entlastungsbetragAlleinerziehend",
    userQuestions: [{ id: "anzahlKinder", label: "Anzahl der Kinder im Haushalt", type: "number" }],
    updateStatus: "annual_update_required",
    confidenceLevel: "verified",
  }),

  makeRule({
    id: "fam-kinderfreibetrag",
    title: "Kinderfreibetrag / Kindergeld (Günstigerprüfung)",
    category: "freibetrag_familie",
    subcategory: "Kinder",
    legalBasis: ["§ 32 Abs. 6 EStG", "§ 31 EStG"],
    officialSources: [SRC.estg32],
    plainLanguageExplanation:
      "Das Finanzamt prüft automatisch, ob das gezahlte Kindergeld oder der Kinderfreibetrag günstiger ist (Günstigerprüfung). Sie müssen sich nicht entscheiden – wichtig ist nur, dass das Kind in der Anlage Kind eingetragen wird.",
    taxMechanism: "Automatische Günstigerprüfung zwischen Kindergeld und Kinderfreibetrag.",
    eligiblePersonTypes: ["elternteil", "alleinerziehend"],
    amountType: "lump_sum",
    deductibilityStatus: "deductible",
    requiredEvidence: ["Anlage Kind", "Steuer-ID des Kindes"],
    declarationArea: "Anlage Kind",
    confidenceLevel: "needs_verification",
    updateStatus: "annual_update_required",
    warningMessages: ["Die genauen Kinderfreibeträge je Jahr sind amtlich zu prüfen (jährliche Anpassung)."],
  }),

  makeRule({
    id: "fam-kv-pv-kind",
    title: "Kranken-/Pflegeversicherung für Kinder",
    category: "sonderausgaben",
    subcategory: "Kinder",
    legalBasis: ["§ 10 Abs. 1 Nr. 3 EStG"],
    officialSources: [SRC.estg10],
    plainLanguageExplanation:
      "Übernehmen Eltern die Basis-Kranken- und Pflegeversicherungsbeiträge ihres unterhaltsberechtigten Kindes (z. B. in der Ausbildung), können sie diese als eigene Sonderausgaben absetzen.",
    taxMechanism: "Sonderausgabenabzug der Basis-KV/PV-Beiträge des Kindes.",
    eligiblePersonTypes: ["elternteil"],
    amountType: "unlimited_if_eligible",
    unlimitedDeduction: true,
    deductibilityStatus: "only_special_expense",
    requiredEvidence: ["Beitragsnachweise"],
    declarationArea: "Anlage Kind / Anlage Vorsorgeaufwand",
    confidenceLevel: "verified",
  }),
];
