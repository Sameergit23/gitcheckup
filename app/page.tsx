import { Logo } from "@/components/Logo";
import { Marquee } from "@/components/Marquee";
import { UsernameForm } from "@/components/UsernameForm";
import { CHECKS } from "@/lib/scoring";

const TICKER = [
  "README",
  "DESCRIPTION",
  "LIVE LINK",
  "LINK ACTUALLY WORKS",
  "LICENSE",
  "RECENT ACTIVITY",
  "TOPICS",
];

export default function HomePage() {
  return (
    <main className="flex-1">
      <section className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 pb-16 pt-12 text-center sm:gap-10 sm:pt-20">
        <Logo size="lg" />
        <h1 className="font-display text-[2.4rem] uppercase leading-[0.95] sm:text-6xl lg:text-7xl">
          Is your GitHub ready for{" "}
          <span className="box-decoration-clone bg-pink px-2">judges &amp; clients?</span>
        </h1>
        <p className="max-w-2xl text-base sm:text-lg">
          Drop a username. Every public repo gets scored out of 100 on what reviewers actually
          click — README, live link, license, activity — with a fix for each problem.
        </p>
        <div className="w-full max-w-xl text-left">
          <UsernameForm variant="hero" />
        </div>
      </section>

      <Marquee label="What gets checked" items={TICKER} />

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
          <li className="flex flex-col justify-center gap-2 border-3 border-ink bg-ink p-5 text-cream shadow-brut">
            <span className="font-display text-5xl text-yellow">100</span>
            <p className="text-sm">
              points per repo. Your score is the average across every public, non-fork repo.
            </p>
          </li>
        </ul>
      </section>
    </main>
  );
}
