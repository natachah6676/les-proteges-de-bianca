import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

const title = "Les Protégés de Bianca | Petits chiens, grandes histoires";
const description =
  "Les Protégés de Bianca soutient l’accueil familial de chiens, principalement petits à moyens, chez Bianca en Roumanie. Les démarches d’adoption sont réalisées par l’association partenaire Les Pattes Oubliées.";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: title,
    template: "%s | Les Protégés de Bianca",
  },
  description,
  openGraph: {
    title,
    description,
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${sourceSans.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
