"use client";

import { useMemo, useState } from "react";
import type { RepoReport, Tier } from "@/lib/types";
import { RepoCard } from "./RepoCard";

type Filter = "all" | Tier;
type Sort = "score" | "updated";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "needs-work", label: "Needs work" },
  { id: "poor", label: "Poor" },
  { id: "healthy", label: "Healthy" },
];

const SORTS: { id: Sort; label: string; hint: string }[] = [
  { id: "score", label: "Score", hint: "lowest first" },
  { id: "updated", label: "Updated", hint: "newest first" },
];

const pushedTime = (r: RepoReport) => (r.pushedAt ? Date.parse(r.pushedAt) : 0);
const byUpdated = (a: RepoReport, b: RepoReport) => pushedTime(b) - pushedTime(a);
const byScore = (a: RepoReport, b: RepoReport) => a.score - b.score || byUpdated(a, b);

export function RepoGrid({ repos }: { repos: RepoReport[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("score");

  const visible = useMemo(() => {
    const list = filter === "all" ? repos : repos.filter((r) => r.tier === filter);
    return [...list].sort(sort === "score" ? byScore : byUpdated);
  }, [repos, filter, sort]);

  const countFor = (f: Filter) => (f === "all" ? repos.length : repos.filter((r) => r.tier === f).length);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-5">
        <div role="group" aria-label="Filter repos" className="flex flex-wrap gap-3">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`btn px-3 py-2 text-sm ${filter === f.id ? "bg-yellow" : "bg-white"}`}
            >
              {f.label}
              <span className="font-mono font-bold">{countFor(f.id)}</span>
            </button>
          ))}
        </div>

        <div role="group" aria-label="Sort repos" className="flex flex-wrap items-center gap-3">
          <span aria-hidden="true" className="text-sm font-bold uppercase tracking-widest">
            Sort
          </span>
          {SORTS.map((s) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={sort === s.id}
              onClick={() => setSort(s.id)}
              title={`${s.label}, ${s.hint}`}
              className={`btn px-3 py-2 text-sm ${sort === s.id ? "bg-yellow" : "bg-white"}`}
            >
              {s.label}
              <span className="sr-only">, {s.hint}</span>
            </button>
          ))}
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        Showing {visible.length} of {repos.length} repos.
      </p>

      {visible.length > 0 ? (
        // Keyed so the cards pop in again whenever the view changes.
        <ul key={`${filter}-${sort}`} className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {visible.map((repo, i) => (
            <li
              key={repo.name}
              className="animate-pop"
              // Stagger 120ms per card, capped so long lists don't keep you waiting.
              style={{ animationDelay: `${Math.min(i, 15) * 120}ms` }}
            >
              <RepoCard repo={repo} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="card p-6 font-bold">
          <span aria-hidden="true">✱ </span>No repos in this bucket.
        </p>
      )}
    </div>
  );
}
