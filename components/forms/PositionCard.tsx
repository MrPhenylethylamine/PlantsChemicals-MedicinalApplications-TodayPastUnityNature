"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, ChevronDown, FileText, HelpCircle, Lightbulb, ShieldAlert } from "lucide-react";
import type { CalculationContext, TaxRule } from "@/types/tax";
import { useAppStore } from "@/lib/store";
import { runCalculator } from "@/lib/tax/calculators";
import { validateInput, DEDUCTIBILITY_LABELS } from "@/lib/tax/validators";
import { formatEuro } from "@/lib/tax/values";
import { Badge, Button, Card, CardContent, Checkbox, Input, Label, Select } from "@/components/ui/primitives";

/** Eine interaktive Eingabe- und Auswertungskarte für genau eine Steuerregel. */
export function PositionCard({ rule }: { rule: TaxRule }) {
  const profile = useAppStore((s) => s.profile);
  const stored = useAppStore((s) => s.positions[rule.id]);
  const upsert = useAppStore((s) => s.upsertPosition);
  const remove = useAppStore((s) => s.removePosition);

  const [inputs, setInputs] = useState<Record<string, number | boolean | string>>(stored?.inputs ?? {});
  const [open, setOpen] = useState(false);
  const status = DEDUCTIBILITY_LABELS[rule.deductibilityStatus];

  const ctx: CalculationContext = useMemo(
    () => ({
      year: profile.year,
      marginalTaxRate: profile.marginalTaxRate,
      taxableIncome: profile.taxableIncome,
      numberOfChildren: profile.numberOfChildren,
      jointAssessment: profile.jointAssessment ?? profile.personTypes.includes("zusammenveranlagung"),
      inputs,
    }),
    [profile, inputs],
  );

  const result = useMemo(() => runCalculator(rule.calculatorKey, ctx), [rule.calculatorKey, ctx]);
  const issues = useMemo(() => validateInput(rule, ctx), [rule, ctx]);

  function update(id: string, value: number | boolean | string) {
    const next = { ...inputs, [id]: value };
    setInputs(next);
    upsert({ ruleId: rule.id, inputs: next });
  }

  const yearSupported = rule.applicableYears.includes(profile.year);

  return (
    <Card className="overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start justify-between gap-3 p-4 text-left hover:bg-slate-50"
        aria-expanded={open}
      >
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-900">{rule.title}</span>
            <Badge tone={status.tone}>{status.label}</Badge>
            {rule.confidenceLevel !== "verified" && <Badge tone="amber">Wert zu prüfen</Badge>}
            {rule.auditRiskLevel === "high" && <Badge tone="red">erhöhtes Risiko</Badge>}
          </div>
          <p className="mt-1 text-sm text-slate-600">{rule.plainLanguageExplanation}</p>
        </div>
        <ChevronDown className={`mt-1 h-5 w-5 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <CardContent className="border-t border-slate-100 bg-slate-50/50">
          {!yearSupported && (
            <p className="mb-3 rounded-md bg-amber-100 p-2 text-sm text-amber-900">
              Für {profile.year} ist diese Position nicht (vollständig) hinterlegt.
            </p>
          )}

          {/* Eingabefelder */}
          {rule.userQuestions.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {rule.userQuestions.map((q) => (
                <div key={q.id}>
                  <Label htmlFor={`${rule.id}-${q.id}`}>
                    {q.label}
                    {q.unit ? <span className="text-slate-400"> ({q.unit})</span> : null}
                  </Label>
                  {q.type === "boolean" ? (
                    <label className="mt-1 flex items-center gap-2 text-sm text-slate-700">
                      <Checkbox
                        id={`${rule.id}-${q.id}`}
                        checked={inputs[q.id] === true}
                        onChange={(e) => update(q.id, e.target.checked)}
                      />
                      Ja
                    </label>
                  ) : q.type === "select" ? (
                    <Select id={`${rule.id}-${q.id}`} value={String(inputs[q.id] ?? "")} onChange={(e) => update(q.id, e.target.value)}>
                      <option value="">Bitte wählen</option>
                      {q.options?.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    <Input
                      id={`${rule.id}-${q.id}`}
                      type="number"
                      inputMode="decimal"
                      value={String(inputs[q.id] ?? "")}
                      onChange={(e) => update(q.id, e.target.value === "" ? "" : Number(e.target.value))}
                    />
                  )}
                  {q.helpText && <p className="mt-1 text-xs text-slate-500">{q.helpText}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Ergebnis */}
          {result && (result.inputAmount > 0 || result.deductibleAmount > 0) && (
            <div className="mt-4 rounded-lg border border-brand-200 bg-brand-50 p-3">
              <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
                <Metric label="Eingegeben" value={formatEuro(result.inputAmount)} />
                {result.directTaxReduction !== undefined ? (
                  <Metric label="Steuerermäßigung" value={formatEuro(result.directTaxReduction)} highlight />
                ) : (
                  <Metric label="Abziehbar" value={formatEuro(result.deductibleAmount)} highlight />
                )}
                {result.nonDeductibleAmount > 0 && <Metric label="Nicht berücksichtigt" value={formatEuro(result.nonDeductibleAmount)} />}
                {result.estimatedTaxSaving !== undefined && <Metric label="≈ Steuerersparnis" value={formatEuro(result.estimatedTaxSaving)} />}
              </div>
              {result.explanation.length > 0 && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs font-medium text-brand-700">Warum wird das so berechnet?</summary>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-xs text-slate-700">
                    {result.explanation.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                </details>
              )}
              {result.lumpSumNote && <p className="mt-2 text-xs text-slate-600">ℹ️ {result.lumpSumNote}</p>}
            </div>
          )}

          {/* Warnungen */}
          {(result?.warnings.length || issues.length || rule.warningMessages.length) ? (
            <div className="mt-3 space-y-1">
              {[...(result?.warnings ?? []), ...rule.warningMessages].map((w, i) => (
                <p key={`w-${i}`} className="flex gap-2 text-xs text-amber-800">
                  <AlertTriangle className="h-4 w-4 shrink-0" /> {w}
                </p>
              ))}
              {issues.map((iss, i) => (
                <p key={`i-${i}`} className={`flex gap-2 text-xs ${iss.level === "error" ? "text-red-700" : "text-slate-600"}`}>
                  <ShieldAlert className="h-4 w-4 shrink-0" /> {iss.message}
                </p>
              ))}
            </div>
          ) : null}

          {/* Detailblöcke */}
          <div className="mt-4 grid gap-3 text-xs sm:grid-cols-2">
            <DetailBlock icon={<FileText className="h-4 w-4" />} title="Was brauche ich als Nachweis?" items={rule.requiredEvidence} />
            {rule.commonMistakes.length > 0 && (
              <DetailBlock icon={<AlertTriangle className="h-4 w-4" />} title="Häufige Fehler" items={rule.commonMistakes} />
            )}
          </div>

          {rule.worthItHint && (
            <p className="mt-3 flex gap-2 rounded-md bg-emerald-50 p-2 text-xs text-emerald-800">
              <Lightbulb className="h-4 w-4 shrink-0" /> <span><strong>Lohnt sich das?</strong> {rule.worthItHint}</span>
            </p>
          )}

          {/* Rechtsgrundlage / Quellen */}
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-3 text-xs text-slate-500">
            <span className="font-medium">Rechtsgrundlage:</span>
            <span>{rule.legalBasis.join(", ") || "—"}</span>
            {rule.officialSources.map((s, i) =>
              s.url ? (
                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="text-brand-600 underline hover:text-brand-700">
                  {s.label}
                </a>
              ) : (
                <span key={i}>{s.label}</span>
              ),
            )}
            <span className="ml-auto inline-flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Stand: {rule.lastVerifiedDate}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <p className="flex items-center gap-1 text-xs text-slate-500">
              <HelpCircle className="h-3 w-3" /> Betrifft i. d. R.: {rule.declarationArea}
            </p>
            {stored && (
              <Button variant="ghost" size="sm" onClick={() => { remove(rule.id); setInputs({}); }}>
                Eingabe entfernen
              </Button>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

function Metric({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className={`font-semibold ${highlight ? "text-brand-700" : "text-slate-800"}`}>{value}</div>
    </div>
  );
}

function DetailBlock({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="rounded-md border border-slate-200 bg-white p-2">
      <div className="mb-1 flex items-center gap-1 font-medium text-slate-700">{icon} {title}</div>
      <ul className="list-disc space-y-0.5 pl-5 text-slate-600">
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    </div>
  );
}
