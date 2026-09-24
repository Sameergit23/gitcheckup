export const site = {
  name: "GitCheckup",
  author: "Sameer Akhtar",
  authorGitHub: "https://github.com/Sameergit23",
  repoUrl: "https://github.com/Sameergit23/gitcheckup",
  // TODO: replace with your LinkedIn profile URL.
  linkedinUrl: "[YOUR LINKEDIN URL]",
};

/** Absolute origin for metadata, sitemap and OG links. */
export function siteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  return vercel ? `https://${vercel}` : "http://localhost:3000";
}
