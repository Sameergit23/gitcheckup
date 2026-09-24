import { timeAgo } from "@/lib/time";
import { TIER_BG } from "@/lib/tiers";
import type { RepoReport } from "@/lib/types";

export function RepoCard({ repo }: { repo: RepoReport }) {
  return (
    <article className="card flex h-full flex-col">
      <header className={`flex items-center gap-3 border-b-3 border-ink px-4 py-3 ${TIER_BG[repo.tier]}`}>
        <h3 className="min-w-0 flex-1 font-display text-lg leading-tight">
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            title={repo.name}
            className="block truncate hover:underline"
          >
            {repo.name}
            <span className="sr-only"> (opens on GitHub)</span>
          </a>
        </h3>
        <p className="font-display text-2xl leading-none">
          <span className="sr-only">Score: </span>
          {repo.score}
        </p>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <p className="text-sm text-muted">
          {repo.language ?? "No language"} ·{" "}
          {repo.pushedAt ? `updated ${timeAgo(repo.pushedAt)}` : "never pushed"}
        </p>

        {repo.issues.length > 0 ? (
          <ul aria-label={`Issues in ${repo.name}`} className="flex flex-col gap-3">
            {repo.issues.map((issue) => (
              <li key={issue.check}>
                <p className="font-bold">
                  <span aria-hidden="true" className="text-issue">
                    ✗{" "}
                  </span>
                  {issue.title}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">Fix: {issue.fix}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="font-bold">
            <span aria-hidden="true">✱ </span>All checks passed
          </p>
        )}
      </div>
    </article>
  );
}
