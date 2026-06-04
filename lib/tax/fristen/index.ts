/**
 * Fristen- und Rückwirkungsmodul (Abschnitt H).
 *
 * Bewertet anhand transparenter Regeln, ob eine rückwirkende Geltendmachung für
 * ein bestimmtes Jahr voraussichtlich noch möglich ist. KEINE Rechtsberatung –
 * die Logik wird offen erklärt.
 *
 * Maßgebliche Vorschriften: §§ 169–171 AO (Festsetzungsfrist), § 170 Abs. 2 AO
 * (Anlaufhemmung), § 164 AO (Vorbehalt der Nachprüfung), §§ 347 ff., § 355 AO
 * (Einspruch), § 10d EStG / § 181 Abs. 5 AO (Verlustfeststellung, 7 Jahre).
 */

export type FristStatus = "green" | "yellow" | "red" | "gray";

export interface FristInput {
  /** Betroffenes Steuerjahr. */
  year: number;
  /** Aktuelles Datum (für Testbarkeit injizierbar). */
  today?: Date;
  /** Wurde damals eine Steuererklärung abgegeben? */
  erklaerungAbgegeben: boolean;
  /** War es eine freiwillige Erklärung (Antragsveranlagung)? */
  freiwillig: boolean;
  /** Bestand eine Pflicht zur Abgabe? */
  abgabepflicht: boolean;
  /** Liegt bereits ein Steuerbescheid vor? */
  bescheidVorhanden: boolean;
  /** Ist der Bescheid bestandskräftig (Einspruchsfrist abgelaufen)? */
  bestandskraeftig: boolean;
  /** Wurde Einspruch eingelegt und ist noch offen? */
  einspruchOffen: boolean;
  /** Stand der Bescheid unter Vorbehalt der Nachprüfung (§ 164 AO)? */
  vorbehaltNachpruefung: boolean;
  /** Geht es um einen Verlustvortrag / Verlustfeststellung? */
  verlustvortrag: boolean;
  /** Geht es um Studienkosten? */
  studienkosten: boolean;
  /** Falls Studienkosten: Erststudium (true) oder Zweitstudium (false)? */
  istErststudium?: boolean;
  /** Gab es in dem Jahr (positive) Einkünfte? */
  hatteEinkuenfte: boolean;
}

export interface FristResult {
  status: FristStatus;
  headline: string;
  reasons: string[];
  /** Maßgebliche rechtliche Anknüpfungspunkte. */
  legalNotes: string[];
  /** Empfohlene nächste Schritte. */
  nextSteps: string[];
}

const FOUR_YEARS = 4;
const VERLUST_YEARS = 7;

/** Jahr, in dem die reguläre 4-jährige Festsetzungsfrist (Antragsveranlagung) endet. */
export function antragsveranlagungDeadlineYear(year: number): number {
  // Festsetzungsfrist beginnt mit Ablauf des Kalenderjahres, endet nach 4 Jahren.
  return year + FOUR_YEARS;
}

/** Endjahr inkl. maximaler Anlaufhemmung (§ 170 Abs. 2 AO: bis zu 3 Jahre). */
export function pflichtDeadlineYearMax(year: number): number {
  return year + 3 + FOUR_YEARS;
}

export function evaluateFrist(input: FristInput): FristResult {
  const today = input.today ?? new Date();
  const currentYear = today.getFullYear();
  const reasons: string[] = [];
  const legalNotes: string[] = [];
  const nextSteps: string[] = [];

  // 1) Offener Einspruch -> Änderung im Rahmen des Einspruchs möglich.
  if (input.einspruchOffen) {
    return {
      status: "green",
      headline: "Voraussichtlich noch möglich (offener Einspruch)",
      reasons: ["Es ist ein Einspruch offen – innerhalb des Einspruchsverfahrens kann der Bescheid noch geändert werden."],
      legalNotes: ["§§ 347 ff. AO (Einspruchsverfahren)"],
      nextSteps: ["Die zusätzlichen Aufwendungen im laufenden Einspruchsverfahren nachreichen."],
    };
  }

  // 2) Vorbehalt der Nachprüfung -> Änderung innerhalb der Festsetzungsfrist.
  if (input.bescheidVorhanden && input.vorbehaltNachpruefung) {
    reasons.push("Der Bescheid steht unter Vorbehalt der Nachprüfung – er kann innerhalb der Festsetzungsfrist jederzeit geändert werden.");
    legalNotes.push("§ 164 AO (Vorbehalt der Nachprüfung)");
    nextSteps.push("Schlichten Antrag auf Änderung des Bescheids stellen.");
    return {
      status: "green",
      headline: "Voraussichtlich noch möglich (Vorbehalt der Nachprüfung)",
      reasons,
      legalNotes,
      nextSteps,
    };
  }

  // 3) Verlustvortrag / Zweitstudium -> 7-Jahres-Logik der Verlustfeststellung.
  if (input.verlustvortrag || (input.studienkosten && input.istErststudium === false)) {
    const deadline = input.year + VERLUST_YEARS;
    legalNotes.push("§ 10d EStG, § 181 Abs. 5 AO (Verlustfeststellung, 7 Jahre)");
    if (currentYear <= deadline) {
      reasons.push(
        `Für die erstmalige Verlustfeststellung gilt eine Frist von 7 Jahren. Für ${input.year} läuft sie voraussichtlich bis Ende ${deadline}.`,
      );
      if (!input.hatteEinkuenfte) {
        reasons.push("Ohne (ausreichende) Einkünfte im Verlustjahr entsteht ein vortragsfähiger Verlust – das ist genau der begünstigte Fall.");
      }
      nextSteps.push("Erklärung zur Feststellung des verbleibenden Verlustvortrags abgeben (mit Belegen des Verlustjahres).");
      return { status: "green", headline: "Verlustfeststellung voraussichtlich noch möglich", reasons, legalNotes, nextSteps };
    }
    reasons.push(`Die 7-Jahres-Frist für die Verlustfeststellung (${input.year}) ist Ende ${deadline} voraussichtlich abgelaufen.`);
    return { status: "red", headline: "Verlustfeststellung voraussichtlich nicht mehr möglich", reasons, legalNotes, nextSteps };
  }

  // 4) Erststudium ohne Bescheid und ohne Einkünfte -> meist verloren.
  if (input.studienkosten && input.istErststudium && !input.hatteEinkuenfte) {
    reasons.push(
      "Erststudiumskosten sind nur Sonderausgaben und NICHT vortragsfähig. Ohne Einkünfte im selben Jahr wirken sie sich steuerlich in der Regel nicht aus.",
    );
    legalNotes.push("§ 10 Abs. 1 Nr. 7 EStG, § 9 Abs. 6 EStG");
    nextSteps.push("Fachliche Prüfung, ob ausnahmsweise doch Werbungskosten (Zweitausbildung) vorliegen.");
    return { status: "red", headline: "Erststudiumskosten ohne Einkünfte: i. d. R. nicht nutzbar", reasons, legalNotes, nextSteps };
  }

  // 5) Bestandskräftiger Bescheid (ohne Vorbehalt/Einspruch) -> nur enge Änderung.
  if (input.bescheidVorhanden && input.bestandskraeftig) {
    reasons.push(
      "Es liegt ein bestandskräftiger Bescheid vor. Eine Änderung ist nur unter besonderen Voraussetzungen möglich (z. B. neue Tatsachen, die ohne grobes Verschulden erst jetzt bekannt werden).",
    );
    legalNotes.push("§ 173 AO (neue Tatsachen), § 172 AO");
    nextSteps.push("Prüfen, ob eine Änderungsvorschrift greift (am besten mit fachlicher Hilfe).");
    return { status: "yellow", headline: "Nur unter besonderen Voraussetzungen änderbar", reasons, legalNotes, nextSteps };
  }

  // 6) Noch keine Erklärung abgegeben -> Festsetzungsfrist prüfen.
  if (!input.erklaerungAbgegeben) {
    if (input.abgabepflicht) {
      // Pflichtveranlagung mit Anlaufhemmung (großzügiger).
      const maxDeadline = pflichtDeadlineYearMax(input.year);
      legalNotes.push("§ 169 AO (4 Jahre), § 170 Abs. 2 AO (Anlaufhemmung bis 3 Jahre)");
      if (currentYear <= maxDeadline) {
        reasons.push(
          `Bei Abgabepflicht verschiebt die Anlaufhemmung den Fristbeginn. Für ${input.year} kann die Festsetzungsfrist (je nach Abgabezeitpunkt) bis längstens Ende ${maxDeadline} laufen.`,
        );
        nextSteps.push("Steuererklärung für das Jahr abgeben.");
        return { status: "yellow", headline: "Abhängig von der Anlaufhemmung – voraussichtlich noch möglich", reasons, legalNotes, nextSteps };
      }
      reasons.push(`Auch mit maximaler Anlaufhemmung ist die Festsetzungsfrist für ${input.year} Ende ${maxDeadline} voraussichtlich abgelaufen.`);
      return { status: "red", headline: "Festsetzungsfrist voraussichtlich abgelaufen", reasons, legalNotes, nextSteps };
    }

    // Freiwillige Veranlagung (Antragsveranlagung): strikte 4-Jahres-Frist.
    const deadline = antragsveranlagungDeadlineYear(input.year);
    legalNotes.push("§ 169 AO (4 Jahre Festsetzungsfrist, Antragsveranlagung)");
    if (currentYear <= deadline) {
      reasons.push(
        `Eine freiwillige Steuererklärung ist im Rahmen der 4-jährigen Festsetzungsfrist möglich. Für ${input.year} läuft sie bis Ende ${deadline}.`,
      );
      nextSteps.push(`Freiwillige Steuererklärung für ${input.year} bis spätestens 31.12.${deadline} abgeben.`);
      return { status: "green", headline: "Freiwillige Veranlagung voraussichtlich noch möglich", reasons, legalNotes, nextSteps };
    }
    reasons.push(`Die 4-Jahres-Frist für die freiwillige Veranlagung ${input.year} ist Ende ${deadline} abgelaufen.`);
    return { status: "red", headline: "Frist für freiwillige Veranlagung abgelaufen", reasons, legalNotes, nextSteps };
  }

  // 7) Erklärung abgegeben, aber (noch) kein Bescheid / Restfall -> individuelle Prüfung.
  reasons.push("Die Konstellation lässt sich pauschal nicht eindeutig bewerten und sollte individuell geprüft werden.");
  legalNotes.push("§§ 169–173 AO");
  nextSteps.push("Steuerberater oder Lohnsteuerhilfeverein hinzuziehen.");
  return { status: "gray", headline: "Individuelle Prüfung erforderlich", reasons, legalNotes, nextSteps };
}

export const FRIST_STATUS_LABEL: Record<FristStatus, string> = {
  green: "Voraussichtlich noch prüfbar",
  yellow: "Nur unter bestimmten Voraussetzungen",
  red: "Wahrscheinlich nicht mehr möglich",
  gray: "Individuelle Prüfung erforderlich",
};
