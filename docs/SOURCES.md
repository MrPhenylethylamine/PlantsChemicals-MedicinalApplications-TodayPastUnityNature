# Quellenregister (SOURCES.md)

Alle steuerlichen Regeln in diesem Tool verweisen auf amtliche bzw.
halbamtliche Fundstellen. Die wichtigsten Portale und Rechtsgrundlagen:

## Maßgebliche Portale

| Portal | Inhalt | Link |
| --- | --- | --- |
| Gesetze im Internet (BMJ/juris) | EStG, AO, EStDV im Volltext | https://www.gesetze-im-internet.de |
| Bundesministerium der Finanzen (BMF) | BMF-Schreiben, Steuerinfos | https://www.bundesfinanzministerium.de |
| Bundeszentralamt für Steuern (BZSt) | Steuer-ID, Auslandssachverhalte | https://www.bzst.de |
| ELSTER | elektronische Steuererklärung | https://www.elster.de |
| Bundesfinanzhof (BFH) | höchstrichterliche Rechtsprechung | https://www.bundesfinanzhof.de |

## Zentrale Rechtsgrundlagen (Auswahl)

### Einkommensteuergesetz (EStG)
- **§ 9 EStG** – Werbungskosten; § 9 Abs. 1 Nr. 4 (Entfernungspauschale),
  Nr. 5 (doppelte Haushaltsführung), Nr. 6 (Arbeitsmittel); § 9 Abs. 4a
  (Verpflegungsmehraufwand)
- **§ 9a EStG** – Arbeitnehmer-Pauschbetrag
- **§ 4 EStG** – Betriebsausgaben; § 4 Abs. 5 (nicht/teilweise abziehbar:
  Bewirtung, Arbeitszimmer Nr. 6b, Homeoffice Nr. 6c)
- **§ 6 Abs. 2 EStG** – geringwertige Wirtschaftsgüter (GWG)
- **§ 7 EStG** – Absetzung für Abnutzung (AfA)
- **§ 10 EStG** – Sonderausgaben (Vorsorge, Kirchensteuer, Kinderbetreuung
  Nr. 5, Schulgeld Nr. 9, Erstausbildung Nr. 7)
- **§ 10b EStG** – Spenden und Mitgliedsbeiträge
- **§ 10c EStG** – Sonderausgaben-Pauschbetrag
- **§ 10d EStG** – Verlustabzug (Verlustvortrag/-rücktrag)
- **§ 20 EStG** – Kapitalvermögen, Sparer-Pauschbetrag (Abs. 9)
- **§ 21 EStG** – Vermietung und Verpachtung
- **§ 24b EStG** – Entlastungsbetrag für Alleinerziehende
- **§ 32 EStG** – Kinderfreibetrag
- **§ 33 EStG** – außergewöhnliche Belastungen, zumutbare Belastung (Abs. 3)
- **§ 33a EStG** – Unterhalt, Ausbildungsfreibetrag
- **§ 33b EStG** – Pauschbeträge für Menschen mit Behinderung / Pflege
- **§ 35a EStG** – haushaltsnahe Beschäftigung, Dienstleistungen, Handwerker
- **§ 35c EStG** – energetische Sanierung selbstgenutzter Gebäude

### Abgabenordnung (AO)
- **§ 164 AO** – Vorbehalt der Nachprüfung
- **§§ 169–171 AO** – Festsetzungsfrist, Anlaufhemmung, Ablaufhemmung
- **§§ 172, 173 AO** – Aufhebung/Änderung, neue Tatsachen
- **§ 181 Abs. 5 AO** – Verlustfeststellung (7-Jahres-Frist)
- **§ 355 AO** – Einspruchsfrist

### Richtlinien / Verwaltungsanweisungen
- Lohnsteuer-Richtlinien (LStR), Lohnsteuer-Hinweise (LStH)
- Einkommensteuer-Richtlinien (EStR)
- BMF-Schreiben (z. B. zur Nutzungsdauer von Computerhardware/Software:
  „1 Jahr“-Regelung seit 2021)

## Hinweis zum Verifizierungsstand

Jede Regel trägt im Code die Felder `confidenceLevel`, `updateStatus` und
`lastVerifiedDate`. Werte mit `confidenceLevel: "needs_verification"` oder
`updateStatus: "annual_update_required"` sind in
[`TAX_RULES_TODO.md`](./TAX_RULES_TODO.md) gelistet und vor produktivem
Einsatz anhand der amtlichen Quellen des jeweiligen Jahres zu prüfen.
