"use client";

import { useEffect, useState } from "react";
import { Marquee } from "@/components/Marquee";
import type { Report, ReportError } from "@/lib/types";
import { ScoreCard } from "./ScoreCard";

type State =
  | { status: "loading" }
  | { status: "error"; error: ReportError }
  | { status: "ready"; report: Report };

export function ReportView({ username }: { username: string }) {
  const [state, setState] = useState<State>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const ctrl = new AbortController();
    setState({ status: "loading" });

    fetch(`/api/report/${encodeURIComponent(username)}`, { signal: ctrl.signal })
      .then(async (res) => {
        const body = await res.json();
        setState(res.ok ? { status: "ready", report: body } : { status: "error", error: body });
      })
      .catch(() => {
        if (!ctrl.signal.aborted) setState({ status: "error", error: { error: "upstream" } });
      });

    return () => ctrl.abort();
  }, [username, attempt]);

  if (state.status === "loading") {
    return <main className="flex-1 px-4 py-10 sm:px-8">Loading…</main>;
  }

  if (state.status === "error") {
    return (
      <main className="flex-1 px-4 py-10 sm:px-8">
        <p>Error: {state.error.error}</p>
        <button type="button" className="btn mt-4 bg-white px-4 py-2" onClick={() => setAttempt((n) => n + 1)}>
          Try again
        </button>
      </main>
    );
  }

  const { report } = state;
  return (
    <>
      <Marquee
        label="Issues found"
        items={report.issueTags.length > 0 ? report.issueTags : ["ALL CHECKS PASSED", "NICE WORK"]}
      />
      <main className="mx-auto grid w-full max-w-[1400px] flex-1 gap-10 px-4 py-10 sm:px-8 md:grid-cols-[300px_minmax(0,1fr)] md:items-start">
        <aside aria-label="Summary">
          <ScoreCard report={report} />
        </aside>
        <section aria-labelledby="repos-heading" className="min-w-0">
          <h2 id="repos-heading" className="sr-only">
            Repos
          </h2>
          <ul className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {report.repos.map((repo) => (
              <li key={repo.name} className="card p-4">
                <span className="font-display">{repo.name}</span> — {repo.score}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
