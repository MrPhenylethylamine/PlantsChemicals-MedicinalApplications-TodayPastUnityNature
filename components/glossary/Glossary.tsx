"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { searchGlossary } from "@/lib/tax/glossary";
import { Card, CardContent, Input } from "@/components/ui/primitives";

/** Durchsuchbares Glossar (Abschnitt C / K: Suchfunktion + Begriffserklärungen). */
export function Glossary() {
  const [query, setQuery] = useState("");
  const entries = useMemo(() => searchGlossary(query), [query]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          className="pl-9"
          placeholder="Steuerbegriff suchen (z. B. zumutbare Belastung, Verlustvortrag)…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Glossar durchsuchen"
        />
      </div>
      <p className="text-xs text-slate-500">{entries.length} Begriffe</p>
      <div className="space-y-3">
        {entries.map((g) => (
          <Card key={g.term}>
            <CardContent className="pt-4">
              <h3 className="font-semibold text-slate-900">{g.term}</h3>
              <p className="mt-1 text-sm font-medium text-slate-600">{g.short}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{g.long}</p>
              {g.related && g.related.length > 0 && (
                <p className="mt-2 text-xs text-slate-500">Verwandt: {g.related.join(", ")}</p>
              )}
              {g.sources && g.sources.length > 0 && (
                <p className="mt-1 text-xs text-slate-500">
                  Quelle:{" "}
                  {g.sources.map((s, i) => (
                    <span key={i}>
                      {s.url ? (
                        <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-brand-600 underline">{s.label}</a>
                      ) : (
                        s.label
                      )}
                      {i < g.sources!.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
