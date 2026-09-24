import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CHECKS } from "@/lib/scoring";
import type { CheckId } from "@/lib/types";

// Points come from the real scoring table; this only adds the copy.
const COPY: Record<CheckId, { name: string; why: string }> = {
  readme: { name: "README", why: "The first thing anyone reads: what it is and how to run it." },
  description: { name: "Description", why: "Shows in search results, on your profile and on pinned repos." },
  homepage: { name: "Live link set", why: "Judges and clients want to click and try it, not clone it." },
  live: { name: "Live link works", why: "A dead demo link is worse than none — so we actually ping it." },
  license: { name: "License", why: "Tells people they're allowed to use and build on your code." },
  activity: { name: "Updated in last 6 months", why: "Recent commits say the project is alive and maintained." },
  topics: { name: "Topics", why: "Tags make the repo discoverable in GitHub search and Explore." },
};

const LEGEND = [
  { label: "80+", name: "Healthy", bg: "bg-mint" },
  { label: "50–79", name: "Needs work", bg: "bg-yellow" },
  { label: "<50", name: "Poor", bg: "bg-rose" },
];

export function WhatWeCheck() {
  const total = CHECKS.reduce((sum, c) => sum + c.points, 0);

  return (
    <section
      id="what-we-check"
      aria-labelledby="checks-heading"
      className="scroll-mt-24 border-y-3 border-ink bg-white"
    >
      <div className="mx-auto w-full max-w-[1400px] px-4 py-20 sm:px-8 lg:py-28">
        <SectionHeading
          id="checks-heading"
          eyebrow="What we check"
          intro="Every public, non-fork repo is scored on the same seven checks. Your profile score is the average."
        >
          {CHECKS.length} checks. {total} points.
        </SectionHeading>

        <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {CHECKS.map((check, i) => (
            <Reveal as="li" key={check.id} delay={(i % 4) * 100} className="card flex flex-col gap-4 bg-cream p-5">
              <p className="flex items-baseline gap-2 font-display leading-none">
                <span className="text-6xl">{check.points}</span>
                <span className="text-sm uppercase">pts</span>
              </p>
              <h3 className="font-display text-xl uppercase leading-tight">{COPY[check.id].name}</h3>
              <p className="text-sm text-muted">{COPY[check.id].why}</p>
            </Reveal>
          ))}
        </ul>

        <ul aria-label="Score legend" className="mt-12 flex flex-wrap gap-4">
          {LEGEND.map((item) => (
            <li
              key={item.name}
              className={`flex items-center gap-3 border-3 border-ink px-4 py-2 font-display uppercase shadow-brut-sm ${item.bg}`}
            >
              <span>{item.label}</span>
              <span className="font-mono font-bold">{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
