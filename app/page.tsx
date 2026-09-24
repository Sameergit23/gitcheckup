import { ChecksMarquee } from "@/components/landing/ChecksMarquee";
import { Faq } from "@/components/landing/Faq";
import { FinalCta } from "@/components/landing/FinalCta";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LandingNav } from "@/components/landing/LandingNav";
import { WhatWeCheck } from "@/components/landing/WhatWeCheck";
import { WhoItsFor } from "@/components/landing/WhoItsFor";

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
    </>
  );
}
