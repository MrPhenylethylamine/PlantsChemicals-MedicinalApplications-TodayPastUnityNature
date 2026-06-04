"use client";

import { useState } from "react";
import { evaluateFrist, FRIST_STATUS_LABEL, type FristInput, type FristResult } from "@/lib/tax/fristen";
import { SUPPORTED_TAX_YEARS, type TaxYear } from "@/types/tax";
import { useAppStore } from "@/lib/store";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Checkbox, Label, Select } from "@/components/ui/primitives";

const STATUS_TONE = { green: "green", yellow: "amber", red: "red", gray: "gray" } as const;

const TOGGLES: { key: keyof FristInput; label: string }[] = [
  { key: "erklaerungAbgegeben", label: "Damals wurde eine Steuererklärung abgegeben" },
  { key: "freiwillig", label: "Es war eine freiwillige Erklärung (Antragsveranlagung)" },
  { key: "abgabepflicht", label: "Es bestand eine Pflicht zur Abgabe" },
  { key: "bescheidVorhanden", label: "Es liegt bereits ein Steuerbescheid vor" },
  { key: "bestandskraeftig", label: "Der Bescheid ist bestandskräftig" },
  { key: "einspruchOffen", label: "Es ist ein Einspruch offen" },
  { key: "vorbehaltNachpruefung", label: "Bescheid unter Vorbehalt der Nachprüfung (§ 164 AO)" },
  { key: "verlustvortrag", label: "Es geht um einen Verlustvortrag / Verlustfeststellung" },
  { key: "studienkosten", label: "Es geht um Studien-/Ausbildungskosten" },
  { key: "hatteEinkuenfte", label: "Es gab in dem Jahr (positive) Einkünfte" },
];

/** Interaktive Fristen-/Rückwirkungsprüfung (Abschnitt H). */
export function FristenChecker() {
  const year = useAppStore((s) => s.profile.year);
  const [input, setInput] = useState<FristInput>({
    year,
    erklaerungAbgegeben: false,
    freiwillig: true,
    abgabepflicht: false,
    bescheidVorhanden: false,
    bestandskraeftig: false,
    einspruchOffen: false,
    vorbehaltNachpruefung: false,
    verlustvortrag: false,
    studienkosten: false,
    istErststudium: false,
    hatteEinkuenfte: true,
  });
  const [result, setResult] = useState<FristResult | null>(null);

  function set<K extends keyof FristInput>(key: K, value: FristInput[K]) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rückwirkend noch möglich? Fristen-Check</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-600">
          Prüfen Sie, ob sich Ausgaben aus einem früheren Jahr steuerlich noch geltend machen lassen. Die Logik wird transparent
          erklärt – dies ist keine Rechtsberatung.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="frist-year">Um welches Steuerjahr geht es?</Label>
            <Select id="frist-year" value={input.year} onChange={(e) => set("year", Number(e.target.value) as TaxYear)}>
              {SUPPORTED_TAX_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </Select>
          </div>
          {input.studienkosten && (
            <div>
              <Label htmlFor="frist-erst">Art des Studiums</Label>
              <Select id="frist-erst" value={input.istErststudium ? "erst" : "zweit"} onChange={(e) => set("istErststudium", e.target.value === "erst")}>
                <option value="erst">Erststudium / Erstausbildung</option>
                <option value="zweit">Zweitstudium / Master / Umschulung</option>
              </Select>
            </div>
          )}
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {TOGGLES.map((t) => (
            <label key={t.key} className="flex items-start gap-2 text-sm text-slate-700">
              <Checkbox
                className="mt-0.5"
                checked={Boolean(input[t.key])}
                onChange={(e) => set(t.key, e.target.checked as never)}
              />
              {t.label}
            </label>
          ))}
        </div>

        <Button onClick={() => setResult(evaluateFrist(input))}>Frist prüfen</Button>

        {result && (
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Badge tone={STATUS_TONE[result.status]}>{FRIST_STATUS_LABEL[result.status]}</Badge>
              <span className="font-semibold text-slate-800">{result.headline}</span>
            </div>
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
              {result.reasons.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
            {result.nextSteps.length > 0 && (
              <div className="mt-2 text-sm text-slate-700">
                <span className="font-medium">Nächste Schritte:</span>
                <ul className="list-disc space-y-0.5 pl-5">{result.nextSteps.map((s, i) => <li key={i}>{s}</li>)}</ul>
              </div>
            )}
            <p className="mt-2 text-xs text-slate-500">Rechtliche Anknüpfung: {result.legalNotes.join(" · ")}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
