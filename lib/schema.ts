import { z } from "zod";
import { SUPPORTED_TAX_YEARS, type TaxYear } from "@/types/tax";

/** Zod-Validierung für Nutzerprofil und Eingaben (Abschnitt B / F). */

export const taxYearSchema = z
  .number()
  .refine((y) => (SUPPORTED_TAX_YEARS as number[]).includes(y), {
    message: "Nicht unterstütztes Veranlagungsjahr",
  })
  .transform((y) => y as TaxYear);

export const personTypeSchema = z.enum([
  "arbeitnehmer",
  "selbststaendig",
  "freiberufler",
  "gewerbetreibend",
  "minijob",
  "nebentaetigkeit",
  "student",
  "auszubildender",
  "umschulung",
  "fortbildung",
  "rentner",
  "pensionaer",
  "vermieter",
  "kapitalanleger",
  "elternteil",
  "alleinerziehend",
  "verheiratet",
  "ledig",
  "zusammenveranlagung",
  "einzelveranlagung",
  "pflegende_person",
  "behinderung",
  "krankheitskosten",
  "umzug",
  "homeoffice",
  "arbeitszimmer",
  "pendler",
  "dienstreisen",
  "doppelte_haushaltsfuehrung",
  "spenden",
  "kirchensteuer",
  "handwerkerleistungen",
  "haushaltsnahe_dienstleistungen",
  "energetische_sanierung",
  "auslandssachverhalt",
]);

export const profileSchema = z.object({
  year: taxYearSchema,
  personTypes: z.array(personTypeSchema).default([]),
  marginalTaxRate: z.number().min(0).max(0.45).optional(),
  taxableIncome: z.number().min(0).optional(),
  numberOfChildren: z.number().int().min(0).max(20).optional(),
  jointAssessment: z.boolean().optional(),
});

export type Profile = z.infer<typeof profileSchema>;

/** Eine einzelne, vom Nutzer erfasste Position. */
export const positionEntrySchema = z.object({
  ruleId: z.string(),
  inputs: z.record(z.union([z.number(), z.boolean(), z.string()])),
  note: z.string().optional(),
});

export type PositionEntry = z.infer<typeof positionEntrySchema>;

/** Hilfsfunktion: parst eine Euro-/Zahleingabe robust (deutsche Schreibweise). */
export function parseGermanNumber(input: string): number | undefined {
  const cleaned = input.replace(/\./g, "").replace(",", ".").replace(/[^\d.-]/g, "");
  if (cleaned === "") return undefined;
  const n = Number(cleaned);
  return Number.isNaN(n) ? undefined : n;
}
