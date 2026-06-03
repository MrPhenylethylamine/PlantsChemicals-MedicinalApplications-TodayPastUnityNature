"use client";

import { useMemo } from "react";
import { ArrowRight, Banknote, CalendarDays, ShieldCheck, Sparkles, Users } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { SUPPORTED_TAX_YEARS, type TaxYear } from "@/types/tax";
import { PERSON_TYPE_GROUPS, personTypesByGroup } from "@/lib/tax/profile";
import { rulesForPersonTypes, groupByCategory, CATEGORY_LABELS } from "@/lib/tax/rules";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Checkbox, Input, Label, Select, Tooltip } from "@/components/ui/primitives";
import { DisclaimerBanner } from "@/components/tax-rules/Disclaimer";
import { PositionCard } from "@/components/forms/PositionCard";

/** Jahre ohne belastbare Datenlage (Hinweis nach Abschnitt A). */
const YEARS_NEEDING_REVIEW: TaxYear[] = [2026];

export function StartStep() {
  const setStep = useAppStore((s) => s.setStep);
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-white shadow-lg">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
          <Sparkles className="h-4 w-4" /> Ihr intelligenter Steuerkompass
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Einkommensteuer-Helper Deutschland</h1>
        <p className="mt-3 max-w-2xl text-brand-50">
          Verstehen Sie systematisch, welche Ausgaben Sie absetzen können – unter welchen Voraussetzungen, bis zu welchen
          Beträgen, mit welchen Nachweisen, ob rückwirkend möglich und ob es sich lohnt. Schritt für Schritt, laienverständlich
          und quellenbasiert nach deutschem Steuerrecht.
        </p>
        <Button size="lg" variant="secondary" className="mt-6" onClick={() => setStep("year")}>
          Jetzt starten <ArrowRight className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <FeatureCard icon={<Users className="h-5 w-5" />} title="Auf Ihre Lebenslage zugeschnitten" text="Wir schalten genau die Steuerbereiche frei, die zu Ihnen passen – nichts wird Sie überladen." />
        <FeatureCard icon={<Banknote className="h-5 w-5" />} title="Rechnet mit Ihren Eingaben" text="Höchstbeträge, Pauschalen, anteilige Abzüge und Steuerersparnis – live berechnet." />
        <FeatureCard icon={<ShieldCheck className="h-5 w-5" />} title="Privacy-first" text="Kein Tracking, keine Serverspeicherung. Ihre Eingaben bleiben lokal in Ihrem Browser." />
      </div>

      <DisclaimerBanner />
    </div>
  );
}

function FeatureCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <Card>
      <CardContent className="pt-5">
        <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-700">{icon}</div>
        <h3 className="font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-600">{text}</p>
      </CardContent>
    </Card>
  );
}

export function YearStep() {
  const year = useAppStore((s) => s.profile.year);
  const setYear = useAppStore((s) => s.setYear);
  const setStep = useAppStore((s) => s.setStep);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-brand-600" /> Veranlagungsjahr wählen
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-600">
          Alle Pauschalen, Höchstbeträge, Grenzwerte und Fristen hängen vom gewählten Jahr ab.
        </p>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {SUPPORTED_TAX_YEARS.map((y) => (
            <button
              key={y}
              onClick={() => setYear(y)}
              className={`rounded-xl border-2 p-4 text-center text-lg font-semibold transition-colors ${
                year === y ? "border-brand-600 bg-brand-50 text-brand-700" : "border-slate-200 bg-white text-slate-700 hover:border-brand-300"
              }`}
            >
              {y}
            </button>
          ))}
        </div>
        {YEARS_NEEDING_REVIEW.includes(year) && (
          <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
            Für dieses Jahr sind noch keine vollständig geprüften Regelwerte hinterlegt. Bitte die aktuellen amtlichen Werte prüfen.
          </p>
        )}
        <div className="flex justify-between">
          <Button variant="ghost" onClick={() => setStep("start")}>Zurück</Button>
          <Button onClick={() => setStep("profile")}>Weiter <ArrowRight className="h-4 w-4" /></Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProfileStep() {
  const personTypes = useAppStore((s) => s.profile.personTypes);
  const toggle = useAppStore((s) => s.togglePersonType);
  const setStep = useAppStore((s) => s.setStep);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-brand-600" /> Ihre Lebenssituation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-sm text-slate-600">
          Wählen Sie alles aus, was auf Sie zutrifft. Daraus schlagen wir die relevanten Steuerbereiche vor.
        </p>
        {PERSON_TYPE_GROUPS.map((group) => (
          <div key={group}>
            <h4 className="mb-2 text-sm font-semibold text-slate-700">{group}</h4>
            <div className="flex flex-wrap gap-2">
              {personTypesByGroup(group).map((p) => {
                const active = personTypes.includes(p.value);
                return (
                  <button
                    key={p.value}
                    onClick={() => toggle(p.value)}
                    className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                      active ? "border-brand-600 bg-brand-600 text-white" : "border-slate-300 bg-white text-slate-700 hover:border-brand-400"
                    }`}
                    title={p.hint}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        <div className="flex justify-between">
          <Button variant="ghost" onClick={() => setStep("year")}>Zurück</Button>
          <Button onClick={() => setStep("income")} disabled={personTypes.length === 0}>
            Weiter <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function IncomeStep() {
  const profile = useAppStore((s) => s.profile);
  const setIncome = useAppStore((s) => s.setIncome);
  const setStep = useAppStore((s) => s.setStep);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Banknote className="h-5 w-5 text-brand-600" /> Steuerliche Wirkung schätzen (optional)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-600">
          Diese Angaben sind freiwillig, machen die{" "}
          <Tooltip content="Die echte Ersparnis eines Abzugs ist Betrag × persönlicher Steuersatz – nicht der ganze Betrag.">
            Steuerersparnis-Schätzung
          </Tooltip>{" "}
          und die zumutbare Belastung aber genauer.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="zve">Zu versteuerndes Einkommen (ungefähr)</Label>
            <Input id="zve" type="number" inputMode="decimal" placeholder="z. B. 40000"
              value={profile.taxableIncome ?? ""}
              onChange={(e) => setIncome({ taxableIncome: e.target.value === "" ? undefined : Number(e.target.value) })}
            />
            <p className="mt-1 text-xs text-slate-500">Für die zumutbare Belastung (Krankheitskosten) und die Spenden-Höchstgrenze.</p>
          </div>
          <div>
            <Label htmlFor="grenz">Geschätzter Grenzsteuersatz</Label>
            <Select id="grenz" value={profile.marginalTaxRate ?? ""} onChange={(e) => setIncome({ marginalTaxRate: e.target.value === "" ? undefined : Number(e.target.value) })}>
              <option value="">Nicht angeben</option>
              <option value="0.14">ca. 14 % (niedriges Einkommen)</option>
              <option value="0.24">ca. 24 %</option>
              <option value="0.32">ca. 32 %</option>
              <option value="0.42">42 % (Spitzensteuersatz)</option>
            </Select>
            <p className="mt-1 text-xs text-slate-500">Bestimmt die geschätzte Steuerersparnis pro abgesetztem Euro.</p>
          </div>
          <div>
            <Label htmlFor="kinder">Anzahl Kinder</Label>
            <Input id="kinder" type="number" min={0} value={profile.numberOfChildren ?? ""}
              onChange={(e) => setIncome({ numberOfChildren: e.target.value === "" ? undefined : Number(e.target.value) })}
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <Checkbox checked={profile.jointAssessment ?? false} onChange={(e) => setIncome({ jointAssessment: e.target.checked })} />
              Zusammenveranlagung
            </label>
          </div>
        </div>
        <div className="flex justify-between">
          <Button variant="ghost" onClick={() => setStep("profile")}>Zurück</Button>
          <Button onClick={() => setStep("areas")}>Zu den Steuerbereichen <ArrowRight className="h-4 w-4" /></Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function AreasStep() {
  const profile = useAppStore((s) => s.profile);
  const setStep = useAppStore((s) => s.setStep);

  const grouped = useMemo(() => {
    const rules = rulesForPersonTypes(profile.personTypes, profile.year);
    return groupByCategory(rules);
  }, [profile.personTypes, profile.year]);

  const categories = Object.keys(grouped);

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Ihre relevanten Steuerbereiche ({profile.year})</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            Auf Basis Ihrer Auswahl haben wir {categories.length} Bereiche freigeschaltet. Öffnen Sie eine Position, geben Sie
            Beträge ein – das Tool prüft Höchstbeträge, Pauschalen, Nachweise und schätzt die Wirkung.
          </p>
        </CardContent>
      </Card>

      {categories.length === 0 && (
        <Card><CardContent className="pt-5 text-sm text-slate-600">Bitte wählen Sie zuvor Ihre Lebenslage aus.</CardContent></Card>
      )}

      {categories.map((cat) => (
        <section key={cat} className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-900">{CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS] ?? cat}</h2>
            <Badge tone="blue">{grouped[cat].length}</Badge>
          </div>
          <div className="space-y-3">
            {grouped[cat].map((rule) => (
              <PositionCard key={rule.id} rule={rule} />
            ))}
          </div>
        </section>
      ))}

      <div className="flex justify-between">
        <Button variant="ghost" onClick={() => setStep("income")}>Zurück</Button>
        <Button onClick={() => setStep("report")}>Auswertung erstellen <ArrowRight className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}
