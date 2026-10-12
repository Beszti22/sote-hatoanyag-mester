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
