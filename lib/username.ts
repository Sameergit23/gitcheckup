// GitHub logins: 1–39 chars, letters/digits/hyphens, can't start with a hyphen.
const USERNAME_RE = /^[a-z\d][a-z\d-]{0,38}$/i;

/**
 * Turns whatever someone typed ("@octocat", "github.com/octocat", " octocat ")
 * into a bare username, or null if it can't be one.
 */
export function normalizeUsername(input: string): string | null {
  const bare = input
    .trim()
    .replace(/^(https?:\/\/)?(www\.)?github\.com\//i, "")
    .replace(/^@/, "")
    .split(/[/?#]/)[0];
  return USERNAME_RE.test(bare) ? bare : null;
}
