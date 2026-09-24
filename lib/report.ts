import { unstable_cache } from "next/cache";
import { fetchReadmeLength, fetchRepos, fetchUser, maxReposToCheck } from "./github";
import { mapPool } from "./pool";
import { countTiers, issueTags, profileScore, scoreRepo, tierFor } from "./scoring";
import type { LinkCheck, Report, RepoReport } from "./types";

async function buildReport(username: string): Promise<Report> {
  const user = await fetchUser(username);
  const { repos, truncated } = await fetchRepos(user.login, maxReposToCheck());

  const readmeLengths = await mapPool(repos, 8, (r) => fetchReadmeLength(r.full_name));
  // TODO: ping the homepage once the live link checker exists.
  const links: (LinkCheck | null)[] = repos.map((r) =>
    r.homepage?.trim() ? { ok: true, status: 0 } : null,
  );

  const now = Date.now();
  const scored: RepoReport[] = repos.map((r, i) => {
    const { score, issues } = scoreRepo(
      {
        description: r.description,
        homepage: r.homepage,
        language: r.language,
        pushedAt: r.pushed_at,
        topics: r.topics ?? [],
        hasLicense: r.license !== null,
        readmeLength: readmeLengths[i],
        live: links[i],
      },
      now,
    );
    return {
      name: r.name,
      url: r.html_url,
      language: r.language,
      pushedAt: r.pushed_at,
      score,
      tier: tierFor(score),
      issues,
    };
  });

  const score = profileScore(scored.map((r) => r.score));
  return {
    login: user.login,
    profileUrl: user.html_url,
    score,
    tier: tierFor(score),
    counts: countTiers(scored),
    issueTags: issueTags(scored),
    repos: scored,
    truncated,
    checkedAt: new Date(now).toISOString(),
  };
}

const cachedReport = unstable_cache(buildReport, ["gitcheckup-report-v1"], {
  revalidate: 600,
});

/** Full health report for a user, cached for 10 minutes. Throws GitHub* errors. */
export function getReport(username: string): Promise<Report> {
  return cachedReport(username.toLowerCase());
}
