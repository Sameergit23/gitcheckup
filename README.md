# GitCheckup

**Is your GitHub ready for judges & clients?** GitCheckup is a GitHub repo health checker with a loud, neo-brutalist UI. Type a username and it scores every public, non-fork repo out of 100. It checks what a reviewer actually clicks: the README, the description, whether the live link exists and actually loads, the license, recent activity and topics. Every failed check comes with a specific fix.

<!-- Screenshot: save one as docs/screenshot.png and uncomment the line below. -->
<!-- ![GitCheckup report page](docs/screenshot.png) -->

> **Screenshot:** _placeholder — add `docs/screenshot.png`_

## Features

- **Profile score.** The average of all repo scores, with a sticker: _Needs love_ (under 50), _Getting there_ (50–79) or _Looking good_ (80+).
- **Repo cards.** Each header strip is colored by health: mint for 80+, yellow for 50–79, rose for under 50. The body lists every failed check as `✗ issue` with a `Fix:` line.
- **Real live-link checks.** Each homepage is pinged server-side with a HEAD request, falling back to GET, and a 5-second timeout.
- **Issue ticker.** A marquee lists the problems found across the user's repos, deduplicated.
- **Filters and sort.** Filter by All / Needs work / Poor / Healthy. Sort by score (lowest first) or last update.
- **Error states** in the same style: user not found, rate limit hit (with the reset time), no public repos, invalid username.
- **Share images.** Each report has its own Open Graph image at `/api/og?u=<username>`.
- **Accessibility.** The UI uses real buttons, links and labels, keeps text contrast at 4.5:1 or better, and shows visible focus rings. Screen readers get status announcements. The ticker has a pause button, and `prefers-reduced-motion` turns off every animation.

## Scoring

Each repo is scored out of 100:

| Check                | Points | Passes when                                                   |
| -------------------- | -----: | ------------------------------------------------------------- |
| README               |     25 | README over 300 characters (**20** if shorter, **0** if missing) |
| Description          |     15 | The repo has a description                                    |
| Live link            |     15 | A homepage URL is set in the About section                    |
| Link actually works  |     15 | The URL answers within 5s without a 4xx/5xx                   |
| License              |     10 | GitHub detects a license                                      |
| Recent activity      |     10 | Pushed to in the last 6 months                                |
| Topics               |     10 | At least one topic                                            |

The profile score is the average of the repo scores. Only public, non-fork repos count. Without a token, the 30 most recently pushed repos are checked; with a token, up to 100.

## Run locally

Requires Node.js 18.17 or newer.

```bash
npm install
cp .env.example .env.local   # optional: add a GITHUB_TOKEN
npm run dev
```

Open http://localhost:3000.

Other scripts: `npm run build`, `npm start`, `npm run typecheck`.

## Environment variables

| Variable               | Required | What it does                                                                                                                                                  |
| ---------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GITHUB_TOKEN`         | No       | A GitHub personal access token. Raises the API limit from 60 to 5,000 requests/hour, and checks up to 100 repos instead of 30. It needs no scopes; a fine-grained token with "Public repositories (read-only)" is enough. |
| `NEXT_PUBLIC_SITE_URL` | No       | Public site URL, used for absolute Open Graph image links. On Vercel it falls back to the production or deployment URL automatically.                        |

Without a token the app still works. Because one checkup costs about 2 + (number of repos) API calls, an unauthenticated deployment runs out quickly. The app then shows a "Rate limit hit" screen with the reset time.

## How it works

```
Browser ──► /u/[username]      (page: header, skeleton, report UI)
   │
   └──fetch──► /api/report/[username]   (route handler, server only)
                  ├─ GET /users/:user                 ┐ GitHub REST, fetch revalidate 600s
                  ├─ GET /users/:user/repos           ┘
                  ├─ GET /repos/:repo/readme  ×N      8 at a time, cached 10 min (hits and misses)
                  └─ HEAD/GET homepage        ×N      5 at a time, 5s timeout, cached 10 min per URL
```

- All GitHub calls happen in route handlers, never in the browser, so the token is never exposed.
- The report response is sent with `s-maxage=600`, so Vercel's CDN serves repeat checkups.
- The live-link checker follows redirects manually. It refuses localhost, private and link-local addresses, because homepage URLs are user-controlled.

```
app/
  page.tsx                   home
  u/[username]/page.tsx      report page (+ metadata)
  u/route.ts                 no-JS form fallback (/u?username=x → /u/x)
  api/report/[username]/     report JSON
  api/og/                    Open Graph image (edge)
components/                  UI (Marquee, Logo, UsernameForm, report/*)
lib/
  github.ts                  GitHub REST client + errors
  scoring.ts                 the 100-point rules and fixes
  liveLink.ts                homepage checker
  report.ts                  builds a report from the pieces
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository. Vercel detects Next.js; keep the default build settings.
3. Under **Environment Variables**, add `GITHUB_TOKEN` for Production (and Preview if you want). Optionally add `NEXT_PUBLIC_SITE_URL` (for example `https://gitcheckup.vercel.app`).
4. Click **Deploy**.

Or from the command line:

```bash
npx vercel
```

```bash
npx vercel --prod
```

After changing environment variables, redeploy so they take effect.

## Tech

Next.js 14 (App Router), TypeScript and Tailwind CSS. Fonts are Archivo Black and Space Mono via `next/font`. Animations are plain CSS keyframes defined in `tailwind.config.ts`. There is no database and no animation library.

---

Made by Sameer Akhtar · [github.com/Sameergit23](https://github.com/Sameergit23)
