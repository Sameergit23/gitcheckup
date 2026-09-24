"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ErrorPanel } from "@/components/ErrorPanel";
import { ArrowLeftIcon, ExternalIcon, RefreshIcon } from "@/components/Icons";
import type { ReportError } from "@/lib/types";

function HomeLink() {
  return (
    <Link href="/" className="btn bg-white px-4 py-2">
      <ArrowLeftIcon /> Back home
    </Link>
  );
}

function RetryButton({ onRetry }: { onRetry: () => void }) {
  return (
    <button type="button" onClick={onRetry} className="btn bg-pink px-4 py-2">
      <RefreshIcon /> Try again
    </button>
  );
}

export function ReportErrorView({
  error,
  username,
  onRetry,
}: {
  error: ReportError;
  username: string;
  onRetry: () => void;
}) {
  switch (error.error) {
    case "not_found":
      return (
        <ErrorPanel
          title="User not found"
          ticker={["USER NOT FOUND", "CHECK THE SPELLING", "TRY ANOTHER USERNAME"]}
          actions={<HomeLink />}
        >
          <p>
            There&apos;s no GitHub account called <strong className="break-all">@{username}</strong>.
          </p>
          <p>Check the spelling, or try another username in the box above.</p>
        </ErrorPanel>
      );

    case "rate_limited":
      return <RateLimited resetAt={error.resetAt} onRetry={onRetry} />;

    case "invalid_username":
      return <InvalidUsername value={username} />;

    default:
      return (
        <ErrorPanel
          title="Something broke"
          ticker={["SOMETHING BROKE", "PROBABLY TEMPORARY", "TRY AGAIN"]}
          actions={
            <>
              <RetryButton onRetry={onRetry} />
              <HomeLink />
            </>
          }
        >
          <p>GitHub didn&apos;t answer the way we expected. It&apos;s usually temporary — give it another go.</p>
        </ErrorPanel>
      );
  }
}

function RateLimited({ resetAt, onRetry }: { resetAt: number; onRetry: () => void }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 15_000);
    return () => clearInterval(id);
  }, []);

  const minutes = Math.ceil((resetAt - now) / 60_000);
  const at = new Date(resetAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  return (
    <ErrorPanel
      title="Rate limit hit"
      tone="yellow"
      ticker={["RATE LIMIT HIT", `RESETS AT ${at.toUpperCase()}`, "TAKE A BREATHER"]}
      actions={
        <>
          <RetryButton onRetry={onRetry} />
          <HomeLink />
        </>
      }
    >
      <p>GitHub caps how many API calls this site can make per hour, and that cap is used up.</p>
      <p className="border-3 border-ink bg-white px-4 py-3 font-bold">
        Resets at {at}
        {minutes > 0
          ? ` — in about ${minutes} minute${minutes === 1 ? "" : "s"}.`
          : " — it should work again now."}
      </p>
      <p className="text-sm text-muted">
        Running your own copy? Set a <code className="font-bold text-ink">GITHUB_TOKEN</code> to raise
        the limit from 60 to 5,000 requests an hour.
      </p>
    </ErrorPanel>
  );
}

export function InvalidUsername({ value }: { value: string }) {
  return (
    <ErrorPanel
      title="Not a username"
      ticker={["NOT A USERNAME", "LETTERS NUMBERS HYPHENS", "39 CHARACTERS MAX"]}
      actions={<HomeLink />}
    >
      <p>
        <strong className="break-all">&ldquo;{value}&rdquo;</strong> can&apos;t be a GitHub username.
      </p>
      <p>Usernames are 1–39 letters, numbers or hyphens, and can&apos;t start with a hyphen.</p>
    </ErrorPanel>
  );
}

export function NoRepos({ login, profileUrl }: { login: string; profileUrl: string }) {
  return (
    <ErrorPanel
      title="No public repos"
      tone="white"
      ticker={["NO PUBLIC REPOS", "NOTHING TO CHECK", "PUSH SOMETHING"]}
      actions={
        <>
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn bg-yellow px-4 py-2"
          >
            View profile <ExternalIcon />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <HomeLink />
        </>
      }
    >
      <p>
        <strong className="break-all">@{login}</strong> has no public, non-fork repos to check yet.
      </p>
      <p>Push a project (or make one public) and run the checkup again.</p>
    </ErrorPanel>
  );
}
