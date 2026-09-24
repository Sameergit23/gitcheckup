import type { CheckId, Issue, LinkCheck, RepoReport, Tier } from "./types";

export const CHECKS: { id: CheckId; label: string; points: number; rule: string }[] = [
  { id: "readme", label: "README", points: 25, rule: "25 if over 300 characters, 20 if shorter, 0 if missing" },
  { id: "description", label: "Description", points: 15, rule: "A one-line summary in the About section" },
  { id: "homepage", label: "Live link", points: 15, rule: "A homepage URL is set on the repo" },
  { id: "live", label: "Link actually works", points: 15, rule: "The URL answers without a 4xx/5xx within 5 seconds" },
  { id: "license", label: "License", points: 10, rule: "A LICENSE file GitHub can detect" },
  { id: "activity", label: "Recent activity", points: 10, rule: "At least one push in the last 6 months" },
  { id: "topics", label: "Topics", points: 10, rule: "At least one topic tag" },
];

const README_MIN_CHARS = 300;
const SIX_MONTHS_MS = 183 * 24 * 60 * 60 * 1000;

export interface RepoFacts {
  description: string | null;
  homepage: string | null;
  language: string | null;
  pushedAt: string | null;
  topics: string[];
  hasLicense: boolean;
  /** README length in characters, 0 when missing. */
  readmeLength: number;
  /** Result of pinging the homepage; null when there is no homepage. */
  live: LinkCheck | null;
}

export function scoreRepo(facts: RepoFacts, now = Date.now()): { score: number; issues: Issue[] } {
  let score = 0;
  const issues: Issue[] = [];

  if (facts.readmeLength > README_MIN_CHARS) {
    score += 25;
  } else if (facts.readmeLength > 0) {
    score += 20;
    issues.push({
      check: "readme",
      tag: "THIN README",
      title: "README is too short",
      fix: "grow it past 300 characters — what it does, a screenshot, how to run it",
    });
  } else {
    issues.push({
      check: "readme",
      tag: "NO README",
      title: "No README",
      fix: "add a README.md with what it does, a screenshot and how to run it",
    });
  }

  if (facts.description?.trim()) {
    score += 15;
  } else {
    issues.push({
      check: "description",
      tag: "NO DESCRIPTION",
      title: "No description",
      fix: "write a one-line summary in the repo's About section (gear icon)",
    });
  }

  if (facts.homepage?.trim()) {
    score += 15;
    if (facts.live?.ok) {
      score += 15;
    } else {
      issues.push({
        check: "live",
        tag: "LIVE LINK DOWN",
        title: "Live link is down",
        fix: `redeploy it or update the URL in About — it ${facts.live?.reason ?? "didn't respond"}`,
      });
    }
  } else {
    // No link also means nothing to ping, so both link checks are lost; one fix covers them.
    issues.push({
      check: "homepage",
      tag: "NO LIVE LINK",
      title: "No live link",
      fix: "add your Vercel link in the repo's About section",
    });
  }

  if (facts.hasLicense) {
    score += 10;
  } else {
    issues.push({
      check: "license",
      tag: "NO LICENSE",
      title: "No license",
      fix: "Add file → Create new file, name it LICENSE and pick a template (MIT is a safe default)",
    });
  }

  const pushed = facts.pushedAt ? Date.parse(facts.pushedAt) : NaN;
  if (now - pushed < SIX_MONTHS_MS) {
    score += 10;
  } else {
    issues.push({
      check: "activity",
      tag: "NO RECENT ACTIVITY",
      title: "No commits in 6+ months",
      fix: "push a small update — docs, dependencies or a bug fix — so it looks maintained",
    });
  }

  if (facts.topics.length > 0) {
    score += 10;
  } else {
    const lang = topicSlug(facts.language);
    issues.push({
      check: "topics",
      tag: "NO TOPICS",
      title: "No topics",
      fix: lang
        ? `add 3–5 topics in the About section, e.g. ${lang} plus what it's for`
        : "add 3–5 topics in the About section: what it's built with and what it's for",
    });
  }

  return { score, issues };
}

/** "C#" → "csharp", "Jupyter Notebook" → "jupyter-notebook". */
function topicSlug(language: string | null): string | null {
  if (!language) return null;
  return language
    .toLowerCase()
    .replace(/#/g, "sharp")
    .replace(/\+/g, "p")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function tierFor(score: number): Tier {
  if (score >= 80) return "healthy";
  if (score >= 50) return "needs-work";
  return "poor";
}

export function profileScore(scores: number[]): number {
  if (scores.length === 0) return 0;
  return Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);
}

export function countTiers(repos: Pick<RepoReport, "tier">[]): Record<Tier, number> {
  const counts: Record<Tier, number> = { healthy: 0, "needs-work": 0, poor: 0 };
  for (const r of repos) counts[r.tier]++;
  return counts;
}

/** Distinct issue tags, most frequent first. */
export function issueTags(repos: Pick<RepoReport, "issues">[]): string[] {
  const freq = new Map<string, number>();
  for (const r of repos) for (const i of r.issues) freq.set(i.tag, (freq.get(i.tag) ?? 0) + 1);
  return [...freq.entries()].sort((a, b) => b[1] - a[1]).map(([tag]) => tag);
}
