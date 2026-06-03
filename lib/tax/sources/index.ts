import type { OfficialSource } from "@/types/tax";

/**
 * Zentrales Quellenregister. Regeln referenzieren Quellen über diese Helfer,
 * damit Rechtsgrundlagen einheitlich und mit Links hinterlegt sind.
 *
 * Die hier verlinkten Portale sind die maßgeblichen amtlichen bzw.
 * halbamtlichen Fundstellen des deutschen Einkommensteuerrechts.
 */

export const PORTALS = {
  gesetzeImInternet: "https://www.gesetze-im-internet.de",
  bmf: "https://www.bundesfinanzministerium.de",
  bzst: "https://www.bzst.de",
  elster: "https://www.elster.de",
  bfh: "https://www.bundesfinanzhof.de",
} as const;

/** Erzeugt eine Gesetzes-Quelle mit Link auf gesetze-im-internet.de. */
export function gesetz(
  label: string,
  slug: string,
  paragraphAnchor?: string,
): OfficialSource {
  const url = paragraphAnchor
    ? `${PORTALS.gesetzeImInternet}/${slug}/${paragraphAnchor}.html`
    : `${PORTALS.gesetzeImInternet}/${slug}/`;
  return { label, type: "gesetz", url };
}

export function bmfSchreiben(label: string, note?: string): OfficialSource {
  return { label, type: "bmf_schreiben", url: PORTALS.bmf, note };
}

export function bfhUrteil(label: string, note?: string): OfficialSource {
  return { label, type: "bfh_urteil", url: PORTALS.bfh, note };
}

export function richtlinie(label: string, note?: string): OfficialSource {
  return { label, type: "richtlinie", note };
}

export function behoerde(label: string, url?: string): OfficialSource {
  return { label, type: "behoerde", url };
}

/** Häufig genutzte Einzelnachweise. */
export const SRC = {
  estg9: gesetz("§ 9 EStG (Werbungskosten)", "estg", "__9"),
  estg9a: gesetz("§ 9a EStG (Pauschbeträge für Werbungskosten)", "estg", "__9a"),
  estg9Nr4: gesetz("§ 9 Abs. 1 Nr. 4 EStG (Entfernungspauschale)", "estg", "__9"),
  estg4: gesetz("§ 4 EStG (Betriebsausgaben/Gewinn)", "estg", "__4"),
  estg4Abs5: gesetz("§ 4 Abs. 5 EStG (nicht abziehbare Betriebsausgaben)", "estg", "__4"),
  estg6Abs2: gesetz("§ 6 Abs. 2 EStG (GWG)", "estg", "__6"),
  estg7: gesetz("§ 7 EStG (AfA/Abschreibung)", "estg", "__7"),
  estg10: gesetz("§ 10 EStG (Sonderausgaben)", "estg", "__10"),
  estg10b: gesetz("§ 10b EStG (Spenden)", "estg", "__10b"),
  estg10c: gesetz("§ 10c EStG (Sonderausgaben-Pauschbetrag)", "estg", "__10c"),
  estg10d: gesetz("§ 10d EStG (Verlustabzug)", "estg", "__10d"),
  estg20: gesetz("§ 20 EStG (Kapitalvermögen, Sparer-Pauschbetrag)", "estg", "__20"),
  estg21: gesetz("§ 21 EStG (Vermietung und Verpachtung)", "estg", "__21"),
  estg24b: gesetz("§ 24b EStG (Entlastungsbetrag für Alleinerziehende)", "estg", "__24b"),
  estg32: gesetz("§ 32 EStG (Kinderfreibetrag)", "estg", "__32"),
  estg33: gesetz("§ 33 EStG (außergewöhnliche Belastungen)", "estg", "__33"),
  estg33a: gesetz("§ 33a EStG (Unterhalt, Ausbildungsfreibetrag)", "estg", "__33a"),
  estg33b: gesetz("§ 33b EStG (Pauschbeträge Behinderung/Pflege)", "estg", "__33b"),
  estg35a: gesetz("§ 35a EStG (haushaltsnahe Leistungen, Handwerker)", "estg", "__35a"),
  estg35c: gesetz("§ 35c EStG (energetische Sanierung)", "estg", "__35c"),
  ao169: gesetz("§ 169 AO (Festsetzungsfrist)", "ao_1977", "__169"),
  ao170: gesetz("§ 170 AO (Beginn Festsetzungsfrist / Anlaufhemmung)", "ao_1977", "__170"),
  ao171: gesetz("§ 171 AO (Ablaufhemmung)", "ao_1977", "__171"),
  ao164: gesetz("§ 164 AO (Vorbehalt der Nachprüfung)", "ao_1977", "__164"),
  ao172: gesetz("§ 172 AO (Aufhebung/Änderung)", "ao_1977", "__172"),
  ao173: gesetz("§ 173 AO (neue Tatsachen)", "ao_1977", "__173"),
  ao355: gesetz("§ 355 AO (Einspruchsfrist)", "ao_1977", "__355"),
  ao181: gesetz("§ 181 Abs. 5 AO (Verlustfeststellung)", "ao_1977", "__181"),
  elster: behoerde("ELSTER (elektronische Steuererklärung)", PORTALS.elster),
} as const;
