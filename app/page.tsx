import type { Metadata } from "next";
import { ChecksMarquee } from "@/components/landing/ChecksMarquee";
import { Faq } from "@/components/landing/Faq";
import { FinalCta } from "@/components/landing/FinalCta";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNav } from "@/components/landing/LandingNav";
import { WhatWeCheck } from "@/components/landing/WhatWeCheck";
import { WhoItsFor } from "@/components/landing/WhoItsFor";

const title = "GitCheckup — Is your GitHub ready?";
const description =
  "Free GitHub repo health checker. GitCheckup scans every public repo and tells you exactly what's missing — README, live link, license and more — with a fix for each.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  openGraph: { title, description, url: "/", siteName: "GitCheckup", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function HomePage() {
  return (
    <>
      <LandingNav />
      <main className="flex-1">
        <Hero />
        <ChecksMarquee />
        <HowItWorks />
        <WhatWeCheck />
        <WhoItsFor />
        <Faq />
        <FinalCta />
      </main>
      <LandingFooter />
    </>
  );
}
