// Server-only GitHub REST helpers. Never import this from a client component:
// it reads GITHUB_TOKEN.

const API = "https://api.github.com";
const REVALIDATE_SECONDS = 600; // cache GitHub responses for 10 minutes
const PER_PAGE = 100;
const MAX_PAGES = 3;

export interface GitHubUser {
  login: string;
  name: string | null;
  html_url: string;
  public_repos: number;
}

export interface GitHubRepo {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  language: string | null;
  fork: boolean;
  private: boolean;
  pushed_at: string | null;
  stargazers_count: number;
  topics?: string[];
  license: { spdx_id: string | null; name: string } | null;
}

export class GitHubNotFoundError extends Error {
  constructor(username: string) {
    super(`GitHub user "${username}" not found`);
  }
}

export class GitHubRateLimitError extends Error {
  /** Epoch milliseconds when the limit resets. */
  constructor(readonly resetAt: number) {
    super("GitHub API rate limit exceeded");
  }
}

export class GitHubError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

/** Unauthenticated calls are capped at 60/hour, so check fewer repos without a token. */
export function maxReposToCheck(): number {
  return process.env.GITHUB_TOKEN ? 100 : 30;
}

function headers(): HeadersInit {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "GitCheckup",
  };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

async function gh(path: string): Promise<Response> {
  const res = await fetch(`${API}${path}`, {
    headers: headers(),
    next: { revalidate: REVALIDATE_SECONDS },
  });

  const limited =
    (res.status === 403 || res.status === 429) &&
    (res.headers.get("x-ratelimit-remaining") === "0" || res.headers.has("retry-after"));
  if (limited) {
    const reset = Number(res.headers.get("x-ratelimit-reset"));
    const retryAfter = Number(res.headers.get("retry-after"));
    throw new GitHubRateLimitError(
      reset > 0 ? reset * 1000 : Date.now() + (retryAfter > 0 ? retryAfter : 60) * 1000,
    );
  }
  return res;
}

export async function fetchUser(username: string): Promise<GitHubUser> {
  const res = await gh(`/users/${encodeURIComponent(username)}`);
  if (res.status === 404) throw new GitHubNotFoundError(username);
  if (!res.ok) throw new GitHubError(`GitHub returned ${res.status} for user`, res.status);
  return res.json();
}

/**
 * Public, non-fork repos owned by `login`, most recently pushed first.
 * `truncated` is true when there were more than `limit`.
 */
export async function fetchRepos(
  login: string,
  limit: number,
): Promise<{ repos: GitHubRepo[]; truncated: boolean }> {
  const repos: GitHubRepo[] = [];
  let moreOnServer = false;

  for (let page = 1; page <= MAX_PAGES; page++) {
    const res = await gh(
      `/users/${encodeURIComponent(login)}/repos?type=owner&sort=pushed&per_page=${PER_PAGE}&page=${page}`,
    );
    if (!res.ok) throw new GitHubError(`GitHub returned ${res.status} for repos`, res.status);

    const batch: GitHubRepo[] = await res.json();
    repos.push(...batch.filter((r) => !r.fork && !r.private));
    moreOnServer = batch.length === PER_PAGE;
    if (!moreOnServer || repos.length > limit) break;
  }

  return {
    repos: repos.slice(0, limit),
    truncated: repos.length > limit || moreOnServer,
  };
}

/** Length of the repo's README in characters; 0 when there isn't one. */
export async function fetchReadmeLength(fullName: string): Promise<number> {
  const res = await gh(`/repos/${fullName}/readme`);
  // 404 = no README. Other failures (e.g. a DMCA 451) are rare; count them as missing too.
  if (!res.ok) return 0;

  const data: { content?: string; encoding?: string; size?: number } = await res.json();
  if (data.content && data.encoding === "base64") {
    return Buffer.from(data.content, "base64").toString("utf8").trim().length;
  }
  // Files over 1 MB come back without inline content; the byte size is close enough.
  return data.size ?? 0;
}
