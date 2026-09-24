import { ChecksMarquee } from "@/components/landing/ChecksMarquee";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LandingNav } from "@/components/landing/LandingNav";
import { WhatWeCheck } from "@/components/landing/WhatWeCheck";

export default function HomePage() {
  return (
    <>
      <LandingNav />
      <main className="flex-1">
        <Hero />
        <ChecksMarquee />
        <HowItWorks />
        <WhatWeCheck />
      </main>
    </>
  );
}
