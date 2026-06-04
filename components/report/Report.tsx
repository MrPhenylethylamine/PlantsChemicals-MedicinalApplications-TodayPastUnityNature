"use client";

import { useMemo } from "react";
import { AlertTriangle, Download, FileText, Printer } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { buildReport, reportToMarkdown } from "@/lib/tax/report";
import { formatEuro } from "@/lib/tax/values";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui/primitives";
import { DisclaimerBanner } from "@/components/tax-rules/Disclaimer";

export function ReportStep() {
  const profile = useAppStore((s) => s.profile);
  const positions = useAppStore((s) => s.positions);
  const setStep = useAppStore((s) => s.setStep);

  const report = useMemo(() => buildReport(profile, positions), [profile, positions]);

  function downloadMarkdown() {
    const md = reportToMarkdown(report);
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `einkommensteuer-auswertung-${report.year}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const hasPositions = report.positions.length > 0;

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-brand-600" /> Ihr Ergebnisbericht {report.year}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ul className="space-y-1 text-sm text-slate-700">
            {report.profileSummary.map((s, i) => <li key={i}>• {s}</li>)}
          </ul>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={downloadMarkdown}><Download className="h-4 w-4" /> Als Markdown exportieren</Button>
            <Button variant="outline" size="sm" onClick={() => window.print()}><Printer className="h-4 w-4" /> Drucken / als PDF speichern</Button>
          </div>
        </CardContent>
      </Card>

      {hasPositions ? (
        <>
          <div className="grid gap-3 sm:grid-cols-4">
            <SummaryTile label="Summe Eingaben" value={formatEuro(report.totals.totalInput)} />
            <SummaryTile label="Mindert z. v. E." value={formatEuro(report.totals.totalDeductible)} tone="blue" />
            <SummaryTile label="Direkte Steuerermäßigung" value={formatEuro(report.totals.totalDirectTaxReduction)} tone="green" />
            <SummaryTile label="≈ Steuerersparnis gesamt" value={formatEuro(report.totals.estimatedTaxSaving)} tone="green" />
          </div>
          {report.totals.estimatedTaxSaving === 0 && (
            <p className="text-xs text-slate-500">Hinweis: Für eine Ersparnis-Schätzung Grenzsteuersatz im Schritt „Steuerliche Wirkung“ angeben.</p>
          )}

          <Card>
            <CardHeader><CardTitle>Erfasste Positionen</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {report.positions.map((p) => (
                <div key={p.rule.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 p-3">
                  <div>
                    <div className="font-medium text-slate-800">{p.rule.title}</div>
                    {p.result && (
                      <div className="text-sm text-slate-600">
                        {p.result.directTaxReduction !== undefined
                          ? `Steuerermäßigung: ${formatEuro(p.result.directTaxReduction)}`
                          : `Abziehbar: ${formatEuro(p.result.deductibleAmount)}`}
                        {p.result.nonDeductibleAmount > 0 && ` · nicht berücksichtigt: ${formatEuro(p.result.nonDeductibleAmount)}`}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {p.rule.auditRiskLevel === "high" && <Badge tone="red">Risiko</Badge>}
                    {p.missingEvidence && <Badge tone="amber">Beleg fehlt</Badge>}
                    <Badge tone="gray">{p.rule.declarationArea}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {report.warnings.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-amber-600" /> Warnhinweise</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-amber-900">
                  {report.warnings.map((w, i) => <li key={i}>• {w}</li>)}
                </ul>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Belegliste</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-slate-700">
                  {report.evidenceChecklist.map((e, i) => <li key={i}>☐ {e}</li>)}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Nächste Schritte</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-slate-700">
                  {report.nextSteps.map((s, i) => <li key={i}>→ {s}</li>)}
                </ul>
                {report.professionalHelpRecommended && (
                  <p className="mt-3 rounded-md bg-amber-50 p-2 text-xs text-amber-900">
                    Für einzelne Positionen ist eine fachliche Prüfung (Steuerberatung / Lohnsteuerhilfeverein) empfehlenswert.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <Card><CardContent className="pt-5 text-sm text-slate-600">Noch keine Positionen erfasst. Gehen Sie zurück und geben Sie Beträge ein.</CardContent></Card>
      )}

      <DisclaimerBanner />

      <div className="flex justify-between">
        <Button variant="ghost" onClick={() => setStep("areas")}>Zurück zu den Bereichen</Button>
      </div>
    </div>
  );
}

function SummaryTile({ label, value, tone = "gray" }: { label: string; value: string; tone?: "gray" | "blue" | "green" }) {
  const toneClass = tone === "blue" ? "text-brand-700" : tone === "green" ? "text-emerald-700" : "text-slate-800";
  return (
    <Card>
      <CardContent className="pt-5">
        <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
        <div className={`mt-1 text-xl font-bold ${toneClass}`}>{value}</div>
      </CardContent>
    </Card>
  );
}
