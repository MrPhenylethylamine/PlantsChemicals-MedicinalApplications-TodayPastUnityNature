import type { PersonType } from "@/types/tax";

/** Anzeige-Metadaten und Gruppierung der Lebenslagen/Personentypen (Abschnitt B). */
export interface PersonTypeMeta {
  value: PersonType;
  label: string;
  group: string;
  hint?: string;
}

export const PERSON_TYPES: PersonTypeMeta[] = [
  { value: "arbeitnehmer", label: "Arbeitnehmer:in", group: "Erwerbssituation" },
  { value: "selbststaendig", label: "Selbständig", group: "Erwerbssituation" },
  { value: "freiberufler", label: "Freiberuflich", group: "Erwerbssituation" },
  { value: "gewerbetreibend", label: "Gewerbetreibend", group: "Erwerbssituation" },
  { value: "minijob", label: "Minijob", group: "Erwerbssituation" },
  { value: "nebentaetigkeit", label: "Nebentätigkeit / Ehrenamt", group: "Erwerbssituation" },
  { value: "rentner", label: "Rentner:in", group: "Erwerbssituation" },
  { value: "pensionaer", label: "Pensionär:in", group: "Erwerbssituation" },

  { value: "student", label: "Student:in", group: "Bildung" },
  { value: "auszubildender", label: "Auszubildende:r", group: "Bildung" },
  { value: "umschulung", label: "Umschulung", group: "Bildung" },
  { value: "fortbildung", label: "Fortbildung", group: "Bildung" },

  { value: "ledig", label: "Ledig", group: "Familienstand" },
  { value: "verheiratet", label: "Verheiratet / Lebenspartnerschaft", group: "Familienstand" },
  { value: "zusammenveranlagung", label: "Zusammenveranlagung", group: "Familienstand" },
  { value: "einzelveranlagung", label: "Einzelveranlagung", group: "Familienstand" },
  { value: "elternteil", label: "Elternteil (Kinder)", group: "Familienstand" },
  { value: "alleinerziehend", label: "Alleinerziehend", group: "Familienstand" },

  { value: "pendler", label: "Pendeln zur Arbeit", group: "Beruf & Arbeitswege" },
  { value: "homeoffice", label: "Homeoffice", group: "Beruf & Arbeitswege" },
  { value: "arbeitszimmer", label: "Häusliches Arbeitszimmer", group: "Beruf & Arbeitswege" },
  { value: "dienstreisen", label: "Dienstreisen / Auswärtstätigkeit", group: "Beruf & Arbeitswege" },
  { value: "doppelte_haushaltsfuehrung", label: "Doppelte Haushaltsführung", group: "Beruf & Arbeitswege" },
  { value: "umzug", label: "Beruflicher Umzug", group: "Beruf & Arbeitswege" },

  { value: "vermieter", label: "Vermietung & Verpachtung", group: "Vermögen" },
  { value: "kapitalanleger", label: "Kapitalanleger:in", group: "Vermögen" },

  { value: "krankheitskosten", label: "Krankheitskosten", group: "Gesundheit & Soziales" },
  { value: "behinderung", label: "Behinderung", group: "Gesundheit & Soziales" },
  { value: "pflegende_person", label: "Pflege von Angehörigen", group: "Gesundheit & Soziales" },

  { value: "spenden", label: "Spenden", group: "Haushalt & Sonstiges" },
  { value: "kirchensteuer", label: "Kirchensteuer", group: "Haushalt & Sonstiges" },
  { value: "handwerkerleistungen", label: "Handwerkerleistungen", group: "Haushalt & Sonstiges" },
  { value: "haushaltsnahe_dienstleistungen", label: "Haushaltsnahe Dienstleistungen", group: "Haushalt & Sonstiges" },
  { value: "energetische_sanierung", label: "Energetische Sanierung", group: "Haushalt & Sonstiges" },
  { value: "auslandssachverhalt", label: "Auslandssachverhalt", group: "Haushalt & Sonstiges", hint: "Komplex – fachliche Prüfung meist sinnvoll." },
];

export const PERSON_TYPE_GROUPS: string[] = Array.from(new Set(PERSON_TYPES.map((p) => p.group)));

export function personTypesByGroup(group: string): PersonTypeMeta[] {
  return PERSON_TYPES.filter((p) => p.group === group);
}

export function personTypeLabel(value: PersonType): string {
  return PERSON_TYPES.find((p) => p.value === value)?.label ?? value;
}
