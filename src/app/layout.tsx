import type { Metadata } from "next";
import { Source_Serif_4, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
});

// This app reads the Supabase session (cookies) in the Header on every page,
// so the static shell can't be prerendered under Cache Components' default
// "instant" validation. Opting out here keeps pages server-rendered per
// request, which is correct for now; streaming the header behind a
// <Suspense> boundary is a later optimization, not a Phase 1 blocker.
export const instant = false;

export const metadata: Metadata = {
  title: "Hatóanyag Mester — SOTE gyógyszertan vizsgakártyák",
  description:
    "Interaktív hatóanyag-kártyák orvostanhallgatóknak: mechanizmus, javallat, mellékhatás egy pillantásra.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu">
      <body className={`${sourceSerif.variable} ${plexSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
