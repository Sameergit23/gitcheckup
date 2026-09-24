export type CheckId =
  | "readme"
  | "description"
  | "homepage"
  | "live"
  | "license"
  | "activity"
  | "topics";

export type Tier = "healthy" | "needs-work" | "poor";

export interface Issue {
  check: CheckId;
  /** Short uppercase label for the ticker, e.g. "NO README". */
  tag: string;
  /** Human sentence shown on the card, e.g. "No README". */
  title: string;
  /** What to do about it, shown as "Fix: …". */
  fix: string;
}

/** Result of pinging a repo's homepage. */
export type LinkCheck = { ok: true; status: number } | { ok: false; reason: string };

export interface RepoReport {
  name: string;
  url: string;
  language: string | null;
  pushedAt: string | null;
  score: number;
  tier: Tier;
  issues: Issue[];
}

export interface Report {
  login: string;
  profileUrl: string;
  /** Average of the repo scores, 0–100. */
  score: number;
  tier: Tier;
  counts: Record<Tier, number>;
  /** Distinct issue tags across all repos, most common first. */
  issueTags: string[];
  repos: RepoReport[];
  /** True when the user has more repos than were checked. */
  truncated: boolean;
  checkedAt: string;
}

export type ReportError =
  | { error: "invalid_username" }
  | { error: "not_found" }
  | { error: "rate_limited"; resetAt: number }
  | { error: "upstream" };
