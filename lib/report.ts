import { fetchReadmeLength, fetchRepos, fetchUser, maxReposToCheck } from "./github";
import { checkLiveLink } from "./liveLink";
import { mapPool } from "./pool";
import { countTiers, issueTags, profileScore, scoreRepo, tierFor } from "./scoring";
import type { Report, RepoReport } from "./types";

/**
 * Full health report for a user. GitHub responses are cached for 10 minutes
 * via fetch revalidation and live-link results per URL. Throws GitHub* errors.
 */
export async function getReport(username: string): Promise<Report> {
  const user = await fetchUser(username);
  const { repos, truncated } = await fetchRepos(user.login, maxReposToCheck());

  const [readmeLengths, links] = await Promise.all([
    mapPool(repos, 8, (r) => fetchReadmeLength(r.full_name)),
    mapPool(repos, 5, (r) => (r.homepage?.trim() ? checkLiveLink(r.homepage) : Promise.resolve(null))),
  ]);

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

