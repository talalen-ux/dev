import type { Metadata } from "next";
import { Chivo, Chivo_Mono, Roboto_Mono } from "next/font/google";
import "./globals.css";

const chivo = Chivo({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-chivo",
});

const chivoMono = Chivo_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-chivo-mono",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title: "Resident — The resident market maker for tokenized equities",
  description:
    "Systematic liquidity provision against reference-price dislocations in tokenized equities. An autonomous market-making desk on Robinhood Chain paying 75% of realized profit to holders every 15 minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // The font variables must live on <html>: globals.css derives --font-sans
    // from --font-chivo in an @theme block that lands on :root, and that
    // substitution fails if the variable is only defined further down the tree.
    <html
      lang="en"
      data-theme="light"
      className={`${chivo.variable} ${chivoMono.variable} ${robotoMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
