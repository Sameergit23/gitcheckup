"use client";

import { useEffect, useState } from "react";
import { Marquee } from "@/components/Marquee";
import type { Report, ReportError } from "@/lib/types";
import { NoRepos, ReportErrorView } from "./ReportErrors";
import { RepoGrid } from "./RepoGrid";
import { ReportSkeleton } from "./ReportSkeleton";
import { ScoreCard } from "./ScoreCard";

type State =
  | { status: "loading" }
  | { status: "error"; error: ReportError }
  | { status: "ready"; report: Report };

function announcement(state: State, username: string): string {
  if (state.status === "loading") return `Running the checkup for ${username}…`;
  if (state.status === "error") return "The checkup couldn't finish.";
  const { report } = state;
  if (report.repos.length === 0) return `${report.login} has no public repos to check.`;
  return `Checkup done: ${report.login} scored ${report.score} out of 100 across ${report.repos.length} repos.`;
}

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

  return (
    <>
      {/* Stays mounted across states so screen readers hear each change. */}
      <p role="status" className="sr-only">
        {announcement(state, username)}
      </p>
      <ReportBody state={state} username={username} onRetry={() => setAttempt((n) => n + 1)} />
    </>
  );
}

function ReportBody({
  state,
  username,
  onRetry,
}: {
  state: State;
  username: string;
  onRetry: () => void;
}) {
  if (state.status === "loading") return <ReportSkeleton />;
  if (state.status === "error") {
    return <ReportErrorView error={state.error} username={username} onRetry={onRetry} />;
  }

  const { report } = state;
  if (report.repos.length === 0) return <NoRepos login={report.login} profileUrl={report.profileUrl} />;

  return (
    <>
      <Marquee
        label="Issues found"
        items={report.issueTags.length > 0 ? report.issueTags : ["ALL CHECKS PASSED", "NICE WORK"]}
      />
      <main className="mx-auto grid w-full max-w-[1400px] flex-1 gap-10 px-4 py-10 sm:px-8 md:grid-cols-[300px_minmax(0,1fr)] md:items-start">
        <h1 className="sr-only">GitHub repo health report for {report.login}</h1>
        <aside aria-label="Summary">
          <ScoreCard report={report} />
        </aside>
        <section aria-labelledby="repos-heading" className="min-w-0">
          <h2 id="repos-heading" className="sr-only">
            Repos
          </h2>
          <RepoGrid repos={report.repos} />
        </section>
      </main>
    </>
  );
}
