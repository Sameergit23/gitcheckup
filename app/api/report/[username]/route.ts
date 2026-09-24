import { NextResponse } from "next/server";
import {
  GitHubNotFoundError,
  GitHubRateLimitError,
  fetchReadmeLength,
  fetchRepos,
  fetchUser,
  maxReposToCheck,
} from "@/lib/github";
import { mapPool } from "@/lib/pool";
import { normalizeUsername } from "@/lib/username";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { username: string } }) {
  const username = normalizeUsername(decodeURIComponent(params.username));
  if (!username) {
    return NextResponse.json({ error: "invalid_username" }, { status: 400 });
  }

  try {
    const user = await fetchUser(username);
    const { repos, truncated } = await fetchRepos(user.login, maxReposToCheck());
    const readmeLengths = await mapPool(repos, 8, (r) => fetchReadmeLength(r.full_name));

    return NextResponse.json({
      login: user.login,
      truncated,
      repos: repos.map((r, i) => ({
        name: r.name,
        url: r.html_url,
        description: r.description,
        homepage: r.homepage,
        language: r.language,
        pushedAt: r.pushed_at,
        topics: r.topics ?? [],
        license: r.license?.spdx_id ?? null,
        readmeLength: readmeLengths[i],
      })),
    });
  } catch (err) {
    if (err instanceof GitHubNotFoundError) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    if (err instanceof GitHubRateLimitError) {
      return NextResponse.json({ error: "rate_limited", resetAt: err.resetAt }, { status: 429 });
    }
    console.error(err);
    return NextResponse.json({ error: "upstream" }, { status: 502 });
  }
}
