import { CountUp } from "@/components/report/CountUp";
import { BrutalCard } from "@/components/ui/BrutalCard";
import { Sticker } from "@/components/ui/Sticker";
import { TIER_BG } from "@/lib/tiers";
import type { Tier } from "@/lib/types";

// Made-up repos, scored with the real rules (see lib/scoring.ts), so the
// example stays honest: (80 + 45 + 20) / 3 = 48 → "Needs love".
const SAMPLE: { name: string; score: number; tier: Tier; meta: string; issues: string[]; more: number }[] = [
  {
    name: "portfolio-site",
    score: 80,
    tier: "healthy",
    meta: "TypeScript · updated 3 days ago",
    issues: ["No license", "No topics"],
    more: 0,
  },
  {
    name: "hackathon-app",
    score: 45,
    tier: "poor",
    meta: "JavaScript · updated 2 weeks ago",
    issues: ["Live link is down", "No description"],
    more: 3,
  },
  {
    name: "old-dotfiles",
    score: 20,
    tier: "poor",
    meta: "Shell · updated 2 years ago",
    issues: ["No commits in 6+ months", "No live link"],
    more: 4,
  },
];
const SAMPLE_SCORE = 48;

export function ReportPreview() {
  return (
    <figure className="mx-auto w-full max-w-xl lg:max-w-none">
      <figcaption className="mb-8 inline-flex items-center gap-2 bg-ink px-3 py-1.5 font-display text-xs uppercase tracking-widest text-cream">
        Example report
        <span className="font-mono font-bold normal-case tracking-normal text-yellow">· sample data</span>
      </figcaption>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-[minmax(0,200px)_minmax(0,1fr)] sm:items-start">
        <BrutalCard color="yellow" shadow="lg" className="relative px-5 pb-5 pt-4">
          <p className="font-display text-sm uppercase">Your score</p>
          <p className="mt-2 font-display text-[104px] leading-[0.85] tracking-[-0.05em]">
            <CountUp value={SAMPLE_SCORE} />
          </p>
          <p className="mt-3 text-sm font-bold">/ 100 · @you</p>
          <Sticker color="pink" className="absolute -right-3 -top-5">
            Needs love
          </Sticker>
        </BrutalCard>

        <ul className="flex flex-col gap-4">
          {SAMPLE.map((repo, i) => (
            <BrutalCard
              as="li"
              key={repo.name}
              className="animate-pop"
              style={{ animationDelay: `${450 + i * 120}ms` }}
            >
              <div className={`flex items-center justify-between gap-3 border-b-3 border-ink px-3 py-2 ${TIER_BG[repo.tier]}`}>
                <span className="truncate font-display">{repo.name}</span>
                <span className="font-display text-xl leading-none">{repo.score}</span>
              </div>
              <div className="flex flex-col gap-1 px-3 py-2 text-xs">
                <p className="text-muted">{repo.meta}</p>
                {repo.issues.map((issue) => (
                  <p key={issue} className="font-bold">
                    <span aria-hidden="true" className="text-issue">
                      ✗{" "}
                    </span>
                    {issue}
                  </p>
                ))}
                {repo.more > 0 && <p className="text-muted">+{repo.more} more</p>}
              </div>
            </BrutalCard>
          ))}
        </ul>
      </div>
    </figure>
  );
}
