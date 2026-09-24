import { TIER_BG, TIER_LABEL, stickerFor } from "@/lib/tiers";
import type { Report, Tier } from "@/lib/types";

const ROWS: Tier[] = ["healthy", "needs-work", "poor"];

export function ScoreCard({ report }: { report: Report }) {
  const sticker = stickerFor(report.score);

  return (
    <div className="flex flex-col gap-5">
      <section
        aria-labelledby="score-heading"
        className="relative border-3 border-ink bg-yellow px-5 pb-6 pt-5 shadow-brut-lg"
      >
        <h2 id="score-heading" className="font-display text-lg uppercase">
          Your score
        </h2>
        <p
          className={`mt-3 font-display leading-[0.85] tracking-[-0.05em] ${
            report.score === 100 ? "text-[112px]" : "text-[130px]"
          }`}
        >
          {report.score}
        </p>
        <p className="mt-4 break-all font-bold">/ 100 · {report.login}</p>
        <span
          className={`absolute -right-3 -top-5 rotate-[7deg] border-3 border-ink px-3 py-2 font-display text-sm uppercase shadow-brut-sm ${sticker.bg}`}
        >
          {sticker.label}
        </span>
      </section>

      <ul aria-label="Repos by health" className="flex flex-col gap-4">
        {ROWS.map((tier) => (
          <li key={tier} className="card flex items-center gap-3 px-4 py-3">
            <span aria-hidden="true" className={`h-5 w-5 shrink-0 border-3 border-ink ${TIER_BG[tier]}`} />
            <span className="font-bold uppercase">{TIER_LABEL[tier]}</span>
            <span className="ml-auto font-display text-2xl">{report.counts[tier]}</span>
          </li>
        ))}
      </ul>

      <p className="text-sm text-muted">
        {report.repos.length} public repo{report.repos.length === 1 ? "" : "s"} checked
        {report.truncated ? " (the most recently pushed ones)" : ""}.{" "}
        <a href={report.profileUrl} className="font-bold text-ink underline underline-offset-4">
          View profile
        </a>
      </p>
    </div>
  );
}
