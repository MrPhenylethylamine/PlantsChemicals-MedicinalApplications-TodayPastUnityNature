import type { GlossaryEntry } from "@/types/tax";
import { SRC } from "@/lib/tax/sources";

/**
 * Glossar: laienverständliche Erklärungen aller zentralen Fachbegriffe
 * (Abschnitt C). `short` für Tooltips, `long` für das Info-Panel.
 */
export const GLOSSARY: GlossaryEntry[] = [
  {
    term: "Werbungskosten",
    short: "Beruflich veranlasste Ausgaben bei Arbeitnehmern und Vermietern.",
    long: "Werbungskosten sind Aufwendungen zur Erwerbung, Sicherung und Erhaltung der Einnahmen – z. B. Fahrtkosten, Arbeitsmittel oder Fortbildung. Sie mindern das zu versteuernde Einkommen. Bei Arbeitnehmern wird automatisch der Arbeitnehmer-Pauschbetrag berücksichtigt; eigene Werbungskosten lohnen sich erst darüber.",
    related: ["Arbeitnehmer-Pauschbetrag", "Betriebsausgaben", "Pauschbetrag"],
    sources: [SRC.estg9, SRC.estg9a],
  },
  {
    term: "Betriebsausgaben",
    short: "Durch den Betrieb veranlasste Ausgaben bei Selbständigen.",
    long: "Betriebsausgaben sind alle Aufwendungen, die durch den Betrieb veranlasst sind. Sie mindern den Gewinn (Anlage EÜR) und damit das zu versteuernde Einkommen. Das Pendant zu Werbungskosten – nur bei Gewinneinkünften (Selbständige, Gewerbe, Freiberufler).",
    related: ["Werbungskosten", "geringwertiges Wirtschaftsgut"],
    sources: [SRC.estg4],
  },
  {
    term: "Sonderausgaben",
    short: "Privat veranlasste, aber gesetzlich begünstigte Ausgaben.",
    long: "Sonderausgaben sind bestimmte private Aufwendungen, die das Gesetz dennoch zum Abzug zulässt – z. B. Vorsorgeaufwendungen, Kirchensteuer, Spenden, Kinderbetreuungskosten. Ohne Nachweis gilt ein geringer Pauschbetrag (36/72 €).",
    related: ["Vorsorgeaufwendungen", "Pauschbetrag"],
    sources: [SRC.estg10, SRC.estg10b],
  },
  {
    term: "außergewöhnliche Belastungen",
    short: "Zwangsläufige, außergewöhnliche Kosten (z. B. Krankheit).",
    long: "Außergewöhnliche Belastungen sind zwangsläufige Aufwendungen, die größer sind als bei der Mehrzahl vergleichbarer Steuerpflichtiger – typisch Krankheitskosten. Sie wirken sich meist erst oberhalb der zumutbaren Belastung aus. Daneben gibt es Pauschbeträge (Behinderung, Pflege).",
    related: ["zumutbare Belastung", "Behinderten-Pauschbetrag", "Pflege-Pauschbetrag"],
    sources: [SRC.estg33, SRC.estg33a, SRC.estg33b],
  },
  {
    term: "Steuerermäßigung",
    short: "Abzug direkt von der Steuerschuld (nicht vom Einkommen).",
    long: "Eine Steuerermäßigung mindert die festgesetzte Einkommensteuer unmittelbar – Euro für Euro. Beispiele: haushaltsnahe Dienstleistungen und Handwerkerleistungen (§ 35a) sowie energetische Sanierung (§ 35c). Sie wirkt stärker als ein gleich hoher Abzug bei den Einkünften.",
    related: ["haushaltsnahe Dienstleistung", "Handwerkerleistung", "Grenzsteuersatz"],
    sources: [SRC.estg35a, SRC.estg35c],
  },
  {
    term: "Pauschbetrag",
    short: "Fester Betrag, der ohne Einzelnachweis abgezogen wird.",
    long: "Ein Pauschbetrag wird automatisch berücksichtigt, ohne dass Belege nötig sind (z. B. Arbeitnehmer-Pauschbetrag, Sonderausgaben-Pauschbetrag). Eigene Einzelkosten lohnen sich erst, wenn sie den Pauschbetrag übersteigen.",
    related: ["Freibetrag", "Höchstbetrag", "Arbeitnehmer-Pauschbetrag"],
  },
  {
    term: "Freibetrag",
    short: "Betrag, bis zu dem Einkünfte steuerfrei bleiben.",
    long: "Ein Freibetrag bleibt steuerfrei; nur der übersteigende Teil wird besteuert (z. B. Grundfreibetrag, Sparer-Pauschbetrag, Kinderfreibetrag). Anders als ein Freigrenze: Wird ein Freibetrag überschritten, ist nur der Mehrbetrag steuerpflichtig.",
    related: ["Pauschbetrag", "Höchstbetrag"],
  },
  {
    term: "Höchstbetrag",
    short: "Obergrenze, bis zu der Kosten abziehbar sind.",
    long: "Ein Höchstbetrag begrenzt den Abzug nach oben. Kosten darüber hinaus wirken sich steuerlich nicht aus (z. B. 4.000 € je Kind bei Kinderbetreuung bis 2024, 1.200 € bei Handwerkerleistungen).",
    related: ["Freibetrag", "Pauschbetrag"],
  },
  {
    term: "Grenzsteuersatz",
    short: "Steuersatz auf den zuletzt verdienten Euro.",
    long: "Der Grenzsteuersatz ist der Prozentsatz, mit dem Ihr nächster (oder letzter) Euro Einkommen besteuert wird. Er bestimmt die Ersparnis eines Abzugs: Wer 30 % Grenzsteuersatz hat, spart bei 1.000 € Werbungskosten rund 300 € Steuern.",
    related: ["zu versteuerndes Einkommen", "Steuerermäßigung"],
  },
  {
    term: "zumutbare Belastung",
    short: "Eigenanteil bei außergewöhnlichen Belastungen.",
    long: "Die zumutbare Belastung ist ein einkommens- und familienabhängiger Eigenanteil (1–7 %), den Sie bei außergewöhnlichen Belastungen selbst tragen müssen. Erst Kosten darüber hinaus wirken sich steuerlich aus. Seit 2017 wird sie stufenweise berechnet.",
    related: ["außergewöhnliche Belastungen"],
    sources: [SRC.estg33],
  },
  {
    term: "Verlustvortrag",
    short: "Verluste in Folgejahre übertragen.",
    long: "Nicht genutzte Verluste (negative Einkünfte) eines Jahres können in spätere Jahre vorgetragen werden und mindern dort die Steuer. Besonders wichtig bei Studienkosten ohne Einkommen (Zweitstudium). Die Verlustfeststellung ist bis zu 7 Jahre rückwirkend möglich.",
    related: ["Verlustrücktrag", "Festsetzungsfrist"],
    sources: [SRC.estg10d, SRC.ao181],
  },
  {
    term: "Verlustrücktrag",
    short: "Verluste in das/die Vorjahr(e) zurücktragen.",
    long: "Beim Verlustrücktrag werden Verluste mit dem Einkommen vorangegangener Jahre verrechnet – das kann zu einer Steuererstattung für das Vorjahr führen. Der Rücktrag ist betragsmäßig begrenzt und kann auf Antrag beschränkt werden.",
    related: ["Verlustvortrag"],
    sources: [SRC.estg10d],
  },
  {
    term: "Festsetzungsfrist",
    short: "Zeitraum, in dem ein Steuerbescheid ergehen/geändert werden kann.",
    long: "Die reguläre Festsetzungsfrist beträgt 4 Jahre. Innerhalb dieser Frist kann die Steuer festgesetzt oder geändert werden. Bei Abgabepflicht verschiebt die Anlaufhemmung (§ 170 Abs. 2 AO) den Beginn um bis zu 3 Jahre.",
    related: ["Bestandskraft", "Anlaufhemmung"],
    sources: [SRC.ao169, SRC.ao170],
  },
  {
    term: "Bestandskraft",
    short: "Bescheid ist endgültig (Einspruchsfrist abgelaufen).",
    long: "Ein Bescheid wird bestandskräftig, wenn die einmonatige Einspruchsfrist abgelaufen ist und kein Einspruch/Vorbehalt besteht. Danach ist eine Änderung nur noch unter besonderen Voraussetzungen (z. B. neue Tatsachen) möglich.",
    related: ["Einspruch", "Vorbehalt der Nachprüfung", "schlichte Änderung"],
    sources: [SRC.ao355],
  },
  {
    term: "Einspruch",
    short: "Rechtsbehelf gegen einen Steuerbescheid (1 Monat).",
    long: "Mit dem Einspruch wenden Sie sich innerhalb eines Monats nach Bekanntgabe gegen einen Bescheid. Während des Einspruchsverfahrens kann der Bescheid in vollem Umfang geändert werden (auch zu Ihren Gunsten).",
    related: ["Bestandskraft", "schlichte Änderung"],
    sources: [SRC.ao355],
  },
  {
    term: "schlichte Änderung",
    short: "Formloser Änderungsantrag innerhalb der Einspruchsfrist.",
    long: "Bei der schlichten Änderung (§ 172 Abs. 1 Nr. 2a AO) beantragen Sie innerhalb der Einspruchsfrist eine punktuelle Korrektur des Bescheids – ohne förmliches Einspruchsverfahren, aber nur im beantragten Umfang.",
    related: ["Einspruch", "Bestandskraft"],
    sources: [SRC.ao172],
  },
  {
    term: "Vorbehalt der Nachprüfung",
    short: "Bescheid bleibt offen änderbar (§ 164 AO).",
    long: "Steht ein Bescheid unter dem Vorbehalt der Nachprüfung, kann er innerhalb der Festsetzungsfrist jederzeit und in jede Richtung geändert werden. Das eröffnet auch nachträgliche Korrekturen zu Ihren Gunsten.",
    related: ["Festsetzungsfrist", "Bestandskraft"],
    sources: [SRC.ao164],
  },
  {
    term: "berufliche Veranlassung",
    short: "Sachlicher Zusammenhang mit dem Beruf.",
    long: "Eine Ausgabe ist beruflich veranlasst, wenn ein objektiver Zusammenhang mit dem Beruf besteht und sie zur Förderung des Berufs getätigt wird. Nur beruflich veranlasste Kosten sind Werbungskosten/Betriebsausgaben.",
    related: ["private Lebensführung", "gemischt veranlasste Aufwendungen"],
  },
  {
    term: "private Lebensführung",
    short: "Privat veranlasste Kosten – meist nicht abziehbar.",
    long: "Kosten der privaten Lebensführung (§ 12 EStG) sind grundsätzlich nicht abziehbar – auch wenn sie der Förderung des Berufs dienen, aber privat mitveranlasst sind. Eine Aufteilung ist nur bei objektiven Maßstäben möglich.",
    related: ["berufliche Veranlassung", "gemischt veranlasste Aufwendungen"],
  },
  {
    term: "gemischt veranlasste Aufwendungen",
    short: "Teils beruflich, teils privat – ggf. aufteilbar.",
    long: "Bei gemischt veranlassten Aufwendungen (z. B. Laptop, Reise, Telefon) ist der berufliche Anteil abziehbar, wenn er sich nach objektiven Kriterien aufteilen lässt (z. B. Zeit-/Nutzungsanteil).",
    related: ["berufliche Veranlassung", "private Lebensführung"],
  },
  {
    term: "haushaltsnahe Dienstleistung",
    short: "Im Haushalt erbrachte Dienstleistung (§ 35a Abs. 2).",
    long: "Haushaltsnahe Dienstleistungen sind Tätigkeiten, die gewöhnlich durch Haushaltsmitglieder erledigt werden (Reinigung, Garten, Pflege). 20 % der Kosten mindern direkt die Steuer (max. 4.000 €). Voraussetzung: Rechnung und Überweisung.",
    related: ["Handwerkerleistung", "Steuerermäßigung"],
    sources: [SRC.estg35a],
  },
  {
    term: "Handwerkerleistung",
    short: "Handwerkerarbeit im Haushalt (§ 35a Abs. 3).",
    long: "Für Handwerkerleistungen (Renovierung, Reparatur, Wartung) im eigenen Haushalt gibt es 20 % der Arbeitskosten als Steuerermäßigung, höchstens 1.200 €. Nur Lohn-/Arbeitskosten zählen – Material nicht. Rechnung und Überweisung sind Pflicht.",
    related: ["haushaltsnahe Dienstleistung", "Steuerermäßigung"],
    sources: [SRC.estg35a],
  },
  {
    term: "Arbeitszimmer",
    short: "Abgeschlossener, beruflich genutzter Raum.",
    long: "Ein häusliches Arbeitszimmer ist ein abgeschlossener, (nahezu) ausschließlich beruflich genutzter Raum. Seit 2023 ist der volle Abzug bzw. die Jahrespauschale 1.260 € auf den Fall beschränkt, dass das Arbeitszimmer Mittelpunkt der gesamten Tätigkeit ist.",
    related: ["Homeoffice-Pauschale"],
    sources: [SRC.estg4Abs5, SRC.estg9],
  },
  {
    term: "Homeoffice-Pauschale",
    short: "Tagespauschale fürs Arbeiten zu Hause.",
    long: "Die Homeoffice-/Tagespauschale beträgt seit 2023 6 € je Tag (max. 1.260 €/Jahr, 210 Tage), zuvor 5 €/Tag (max. 600 €). Sie gilt auch ohne separates Arbeitszimmer. Für denselben Tag ist i. d. R. keine Entfernungspauschale möglich.",
    related: ["Arbeitszimmer", "Entfernungspauschale"],
    sources: [SRC.estg9],
  },
  {
    term: "doppelte Haushaltsführung",
    short: "Zweitwohnung am Arbeitsort aus beruflichen Gründen.",
    long: "Wer aus beruflichen Gründen eine Zweitwohnung am Arbeitsort unterhält und zugleich einen eigenen Hausstand am Lebensmittelpunkt hat, kann Unterkunft (bis 1.000 €/Monat), Familienheimfahrten und – zeitlich begrenzt – Verpflegung absetzen.",
    related: ["Entfernungspauschale"],
    sources: [SRC.estg9],
  },
  {
    term: "Entfernungspauschale",
    short: "Pauschale je Kilometer zur Arbeit.",
    long: "Die Entfernungspauschale (Pendlerpauschale) beträgt 0,30 €/km für die ersten 20 km, ab dem 21. km erhöht (2021: 0,35 €; 2022–2026: 0,38 €). Es zählt nur die einfache Entfernung. Höchstbetrag 4.500 €/Jahr (außer eigener Pkw).",
    related: ["Homeoffice-Pauschale"],
    sources: [SRC.estg9Nr4],
  },
];

export const GLOSSARY_BY_TERM: Map<string, GlossaryEntry> = new Map(
  GLOSSARY.map((g) => [g.term.toLowerCase(), g]),
);

export function findGlossaryEntry(term: string): GlossaryEntry | undefined {
  return GLOSSARY_BY_TERM.get(term.toLowerCase());
}

export function searchGlossary(query: string): GlossaryEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return GLOSSARY;
  return GLOSSARY.filter(
    (g) => g.term.toLowerCase().includes(q) || g.short.toLowerCase().includes(q) || g.long.toLowerCase().includes(q),
  );
}
