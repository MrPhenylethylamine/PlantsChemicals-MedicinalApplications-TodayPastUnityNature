import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { PersonType, TaxYear } from "@/types/tax";
import type { PositionEntry, Profile } from "@/lib/schema";

/**
 * Globaler App-State (Zustand) mit Privacy-first-Persistenz:
 * Es werden NUR lokale, nicht-personenbezogene Eingaben (Beträge, Auswahl) im
 * LocalStorage des Browsers gespeichert. Es findet kein Tracking und keine
 * Server-Speicherung statt.
 */

export type WizardStep =
  | "start"
  | "year"
  | "profile"
  | "income"
  | "areas"
  | "report";

interface AppState {
  step: WizardStep;
  profile: Profile;
  positions: Record<string, PositionEntry>; // key = ruleId
  setStep: (step: WizardStep) => void;
  setYear: (year: TaxYear) => void;
  togglePersonType: (p: PersonType) => void;
  setPersonTypes: (p: PersonType[]) => void;
  setIncome: (data: { marginalTaxRate?: number; taxableIncome?: number; numberOfChildren?: number; jointAssessment?: boolean }) => void;
  upsertPosition: (entry: PositionEntry) => void;
  removePosition: (ruleId: string) => void;
  reset: () => void;
}

const DEFAULT_PROFILE: Profile = {
  year: 2024,
  personTypes: [],
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      step: "start",
      profile: DEFAULT_PROFILE,
      positions: {},

      setStep: (step) => set({ step }),
      setYear: (year) => set((s) => ({ profile: { ...s.profile, year } })),

      togglePersonType: (p) =>
        set((s) => {
          const has = s.profile.personTypes.includes(p);
          const personTypes = has
            ? s.profile.personTypes.filter((x) => x !== p)
            : [...s.profile.personTypes, p];
          return { profile: { ...s.profile, personTypes } };
        }),

      setPersonTypes: (personTypes) => set((s) => ({ profile: { ...s.profile, personTypes } })),

      setIncome: (data) => set((s) => ({ profile: { ...s.profile, ...data } })),

      upsertPosition: (entry) =>
        set((s) => ({ positions: { ...s.positions, [entry.ruleId]: entry } })),

      removePosition: (ruleId) =>
        set((s) => {
          const next = { ...s.positions };
          delete next[ruleId];
          return { positions: next };
        }),

      reset: () => set({ step: "start", profile: DEFAULT_PROFILE, positions: {} }),
    }),
    {
      name: "est-helper-de",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? window.localStorage : undefined as never)),
      partialize: (s) => ({ profile: s.profile, positions: s.positions, step: s.step }),
    },
  ),
);
