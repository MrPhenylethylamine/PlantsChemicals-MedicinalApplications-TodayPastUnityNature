import { test, expect } from "@playwright/test";

/**
 * Zentrale End-to-End-Tests für typische Nutzerprofile (Abschnitt N).
 * Lauf: `npm run test:e2e` (startet den Dev-Server automatisch).
 */

test("Arbeitnehmer-Flow: Pendeln + Homeoffice + Auswertung", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Jetzt starten/ }).click();

  // Steuerjahr 2024
  await page.getByRole("button", { name: "2024", exact: true }).click();
  await page.getByRole("button", { name: /Weiter/ }).click();

  // Lebenslage: Arbeitnehmer + Pendeln + Homeoffice
  await page.getByRole("button", { name: "Arbeitnehmer:in" }).click();
  await page.getByRole("button", { name: "Pendeln zur Arbeit" }).click();
  await page.getByRole("button", { name: "Homeoffice" }).click();
  await page.getByRole("button", { name: /Weiter/ }).click();

  // Wirkung überspringen
  await page.getByRole?.("button", { name: /Zu den Steuerbereichen/ }).click?.();

  // Steuerbereiche sichtbar
  await expect(page.getByText(/relevante Steuerbereiche/i)).toBeVisible();

  // Entfernungspauschale öffnen und ausfüllen
  await page.getByRole("button", { name: /Entfernungspauschale/ }).click();
  await page.getByLabel(/Einfache Entfernung/).fill("25");
  await page.getByLabel(/Arbeitstage/).fill("210");
  await expect(page.getByText(/Abziehbar/)).toBeVisible();

  // Zur Auswertung
  await page.getByRole("button", { name: /Auswertung erstellen/ }).click();
  await expect(page.getByText(/Ergebnisbericht/)).toBeVisible();
});

test("Glossar ist durchsuchbar", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Glossar/ }).click();
  await page.getByPlaceholder(/Steuerbegriff suchen/).fill("zumutbare");
  await expect(page.getByText(/zumutbare Belastung/)).toBeVisible();
});

test("Fristen-Check liefert eine Einschätzung", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Fristen-Check/ }).click();
  await page.getByRole("button", { name: /Frist prüfen/ }).click();
  await expect(page.getByText(/Voraussichtlich noch|Festsetzungsfrist|Verlustfeststellung|Individuelle/)).toBeVisible();
});
