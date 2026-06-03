import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Einkommensteuer-Helper Deutschland",
  description:
    "Interaktiver, quellenbasierter Einkommensteuer-Assistent für Privatpersonen in Deutschland. Keine Steuerberatung – allgemeine Orientierung nach deutschem Steuerrecht.",
  robots: { index: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
