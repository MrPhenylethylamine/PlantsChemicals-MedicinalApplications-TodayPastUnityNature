import { Info } from "lucide-react";

/** Sichtbarer rechtlicher Disclaimer (Abschnitt U). */
export const DISCLAIMER_TEXT =
  "Dieses Tool bietet eine allgemeine, quellenbasierte Orientierung zum deutschen Einkommensteuerrecht. Es ersetzt keine individuelle Steuerberatung. Steuerliche Ergebnisse können vom Einzelfall abhängen. Bei hohen Beträgen, Selbständigkeit, Vermietung, Auslandssachverhalten, Pflegefällen, alten Verlusten, bestandskräftigen Steuerbescheiden oder komplexen Ausbildungskosten sollte ein Steuerberater, eine Steuerberaterin oder ein Lohnsteuerhilfeverein hinzugezogen werden.";

export function DisclaimerBanner({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-900">
      <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
      <p className={compact ? "text-xs leading-relaxed" : "text-sm leading-relaxed"}>
        <strong>Keine Steuerberatung.</strong> {DISCLAIMER_TEXT}
      </p>
    </div>
  );
}
