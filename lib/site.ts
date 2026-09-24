export const site = {
  name: "GitCheckup",
  author: "Sameer Akhtar",
  authorGitHub: "https://github.com/Sameergit23",
  repoUrl: "https://github.com/Sameergit23/gitcheckup",
  // TODO: replace with your LinkedIn profile URL.
  linkedinUrl: "[YOUR LINKEDIN URL]",
};

/**
 * Absolute origin (no trailing slash) for metadata, sitemap and OG links.
 * Accepts NEXT_PUBLIC_SITE_URL with or without https:// or a trailing slash;
 * a malformed value falls through to Vercel's own URL instead of failing the build.
 */
export function siteUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ];
  for (const raw of candidates) {
    const value = raw?.trim();
    if (!value) continue;
    try {
      return new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`).origin;
    } catch {
      // try the next candidate
    }
  }
  return "http://localhost:3000";
}
