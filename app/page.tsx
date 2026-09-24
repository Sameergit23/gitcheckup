import { ChecksMarquee } from "@/components/landing/ChecksMarquee";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LandingNav } from "@/components/landing/LandingNav";
import { CHECKS } from "@/lib/scoring";

export default function HomePage() {
  return (
    <>
      <LandingNav />
      <main className="flex-1">
        <Hero />

        <ChecksMarquee />
        <HowItWorks />

        <section aria-labelledby="checks-heading" className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
          <h2 id="checks-heading" className="font-display text-3xl uppercase sm:text-4xl">
            The checks
          </h2>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CHECKS.map((check) => (
              <li key={check.id} className="card flex flex-col gap-3 p-5">
                <span className="self-start border-3 border-ink bg-yellow px-2 py-1 font-display text-sm">
                  {check.points} PTS
                </span>
                <h3 className="font-display text-xl uppercase">{check.label}</h3>
                <p className="text-sm text-muted">{check.rule}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
