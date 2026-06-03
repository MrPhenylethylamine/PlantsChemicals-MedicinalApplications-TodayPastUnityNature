import { describe, it, expect } from "vitest";
import { evaluateFrist, type FristInput } from "@/lib/tax/fristen";

const base: FristInput = {
  year: 2021,
  today: new Date("2026-06-03"),
  erklaerungAbgegeben: false,
  freiwillig: true,
  abgabepflicht: false,
  bescheidVorhanden: false,
  bestandskraeftig: false,
  einspruchOffen: false,
  vorbehaltNachpruefung: false,
  verlustvortrag: false,
  studienkosten: false,
  hatteEinkuenfte: true,
};

describe("Fristen-/Rückwirkungsmodul", () => {
  it("freiwillige Veranlagung 2021 ist 2026 abgelaufen (4-Jahres-Frist bis Ende 2025)", () => {
    const r = evaluateFrist({ ...base, year: 2021 });
    expect(r.status).toBe("red");
  });

  it("freiwillige Veranlagung 2022 ist 2026 noch möglich (bis Ende 2026)", () => {
    const r = evaluateFrist({ ...base, year: 2022 });
    expect(r.status).toBe("green");
  });

  it("offener Einspruch -> grün, unabhängig vom Jahr", () => {
    const r = evaluateFrist({ ...base, year: 2019, einspruchOffen: true });
    expect(r.status).toBe("green");
  });

  it("Vorbehalt der Nachprüfung -> grün", () => {
    const r = evaluateFrist({ ...base, year: 2020, bescheidVorhanden: true, vorbehaltNachpruefung: true });
    expect(r.status).toBe("green");
  });

  it("bestandskräftiger Bescheid ohne Vorbehalt -> gelb (nur enge Änderung)", () => {
    const r = evaluateFrist({ ...base, year: 2023, bescheidVorhanden: true, bestandskraeftig: true });
    expect(r.status).toBe("yellow");
  });

  it("Zweitstudium-Verlustvortrag 2019 ist 2026 noch feststellbar (7 Jahre)", () => {
    const r = evaluateFrist({ ...base, year: 2019, verlustvortrag: true, studienkosten: true, istErststudium: false, hatteEinkuenfte: false });
    expect(r.status).toBe("green");
    expect(r.legalNotes.join(" ")).toMatch(/181/);
  });

  it("Verlustfeststellung außerhalb der 7 Jahre -> rot", () => {
    const r = evaluateFrist({ ...base, year: 2015, verlustvortrag: true, hatteEinkuenfte: false });
    expect(r.status).toBe("red");
  });

  it("Erststudium ohne Einkünfte -> rot (nicht vortragsfähig)", () => {
    const r = evaluateFrist({ ...base, year: 2024, studienkosten: true, istErststudium: true, hatteEinkuenfte: false });
    expect(r.status).toBe("red");
  });

  it("Pflichtveranlagung profitiert von Anlaufhemmung (gelb statt rot)", () => {
    const r = evaluateFrist({ ...base, year: 2021, abgabepflicht: true });
    expect(r.status).toBe("yellow");
  });
});
