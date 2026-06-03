"use client";

import dynamic from "next/dynamic";

// Der App-Shell nutzt LocalStorage-Persistenz und wird daher clientseitig geladen.
const AppShell = dynamic(() => import("@/components/wizard/AppShell").then((m) => m.AppShell), {
  ssr: false,
  loading: () => <div className="p-8 text-center text-slate-400">Lädt…</div>,
});

export default function HomePage() {
  return <AppShell />;
}
