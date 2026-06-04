"use client";

import { useState } from "react";
import { BookOpen, CalendarClock, Check, Compass, RotateCcw } from "lucide-react";
import { useAppStore, type WizardStep } from "@/lib/store";
import { Button } from "@/components/ui/primitives";
import { AreasStep, IncomeStep, ProfileStep, StartStep, YearStep } from "./steps";
import { ReportStep } from "@/components/report/Report";
import { Glossary } from "@/components/glossary/Glossary";
import { FristenChecker } from "@/components/fristen/FristenChecker";

type Tab = "assistent" | "glossar" | "fristen";

const STEPS: { key: WizardStep; label: string }[] = [
  { key: "start", label: "Start" },
  { key: "year", label: "Steuerjahr" },
  { key: "profile", label: "Lebenslage" },
  { key: "income", label: "Wirkung" },
  { key: "areas", label: "Steuerbereiche" },
  { key: "report", label: "Auswertung" },
];

export function AppShell() {
  const step = useAppStore((s) => s.step);
  const setStep = useAppStore((s) => s.setStep);
  const reset = useAppStore((s) => s.reset);
  const [tab, setTab] = useState<Tab>("assistent");

  const currentIndex = STEPS.findIndex((s) => s.key === step);
  const progress = Math.round((currentIndex / (STEPS.length - 1)) * 100);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <button onClick={() => { setTab("assistent"); setStep("start"); }} className="flex items-center gap-2 text-left">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white"><Compass className="h-5 w-5" /></span>
          <span>
            <span className="block text-sm font-bold leading-tight text-slate-900">Einkommensteuer-Helper</span>
            <span className="block text-xs text-slate-500">Deutschland · quellenbasiert</span>
          </span>
        </button>
        <nav className="flex items-center gap-1 rounded-lg bg-white p-1 shadow-sm ring-1 ring-slate-200">
          <TabButton active={tab === "assistent"} onClick={() => setTab("assistent")} icon={<Compass className="h-4 w-4" />} label="Assistent" />
          <TabButton active={tab === "glossar"} onClick={() => setTab("glossar")} icon={<BookOpen className="h-4 w-4" />} label="Glossar" />
          <TabButton active={tab === "fristen"} onClick={() => setTab("fristen")} icon={<CalendarClock className="h-4 w-4" />} label="Fristen-Check" />
        </nav>
      </header>

      {tab === "assistent" && (
        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-6 space-y-1 rounded-xl border border-slate-200 bg-white p-3">
              <div className="mb-3">
                <div className="mb-1 flex justify-between text-xs text-slate-500"><span>Fortschritt</span><span>{progress}%</span></div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full bg-brand-600 transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>
              {STEPS.map((s, i) => {
                const done = i < currentIndex;
                const active = i === currentIndex;
                return (
                  <button
                    key={s.key}
                    onClick={() => setStep(s.key)}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      active ? "bg-brand-50 font-medium text-brand-700" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs ${done ? "bg-emerald-500 text-white" : active ? "bg-brand-600 text-white" : "bg-slate-200 text-slate-600"}`}>
                      {done ? <Check className="h-3 w-3" /> : i + 1}
                    </span>
                    {s.label}
                  </button>
                );
              })}
              <Button variant="ghost" size="sm" className="mt-2 w-full justify-start text-slate-500" onClick={reset}>
                <RotateCcw className="h-4 w-4" /> Alles zurücksetzen
              </Button>
            </div>
          </aside>

          <main className="animate-fade-in">
            {step === "start" && <StartStep />}
            {step === "year" && <YearStep />}
            {step === "profile" && <ProfileStep />}
            {step === "income" && <IncomeStep />}
            {step === "areas" && <AreasStep />}
            {step === "report" && <ReportStep />}
          </main>
        </div>
      )}

      {tab === "glossar" && (
        <main className="mx-auto max-w-3xl animate-fade-in">
          <h1 className="mb-1 text-2xl font-bold text-slate-900">Glossar</h1>
          <p className="mb-4 text-sm text-slate-600">Alle wichtigen Steuerbegriffe – laienverständlich erklärt.</p>
          <Glossary />
        </main>
      )}

      {tab === "fristen" && (
        <main className="mx-auto max-w-3xl animate-fade-in">
          <h1 className="mb-1 text-2xl font-bold text-slate-900">Fristen- & Rückwirkungsprüfung</h1>
          <p className="mb-4 text-sm text-slate-600">Lassen sich alte Ausgaben noch geltend machen? Transparente Einschätzung nach AO/EStG.</p>
          <FristenChecker />
        </main>
      )}

      <footer className="mt-10 border-t border-slate-200 pt-4 text-center text-xs text-slate-400">
        Keine Steuerberatung · Privacy-first (lokale Speicherung) · Quellen: EStG, AO, BMF, BFH, ELSTER
      </footer>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
        active ? "bg-brand-600 text-white" : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      {icon} <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
