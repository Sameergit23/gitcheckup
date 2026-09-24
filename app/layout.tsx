import type { Metadata, Viewport } from "next";
import { Archivo_Black, Space_Mono } from "next/font/google";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const display = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
  // A monospace fallback has almost the same advance width (0.60em vs 0.612em),
  // so text wraps the same before and after the swap: far less layout shift
  // than the default size-adjusted Arial.
  fallback: ["Courier New", "monospace"],
  adjustFontFallback: false,
});

const description =
  "Score every public repo on README, description, live link, license, activity and topics — and get a fix for each problem.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: "GitCheckup · GitHub Repo Health Checker",
  description,
  openGraph: {
    title: "GitCheckup",
    description,
    siteName: "GitCheckup",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#FFD23F",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`}>
      <body className="flex min-h-screen flex-col">
        {children}
      </body>
    </html>
  );
}
