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
  title: "PinLink — Your Gateway to Tokenized Compute Power",
  description:
    "The First RWA-Tokenized DePIN marketplace driving down costs for AI Developers and creating new revenue for asset owners.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark">
      <body
        className={`${chivo.variable} ${chivoMono.variable} ${robotoMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
