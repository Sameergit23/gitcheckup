import type { Metadata, Viewport } from "next";
import { Archivo_Black, Space_Mono } from "next/font/google";
import { Footer } from "@/components/Footer";
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
    images: [{ url: "/api/og", width: 1200, height: 630, alt: "GitCheckup — is your GitHub ready for judges & clients?" }],
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
        <Footer />
      </body>
    </html>
  );
}
