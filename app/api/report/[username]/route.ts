import { NextResponse } from "next/server";
import { GitHubNotFoundError, GitHubRateLimitError } from "@/lib/github";
import { getReport } from "@/lib/report";
import type { Report, ReportError } from "@/lib/types";
import { normalizeUsername } from "@/lib/username";

export const dynamic = "force-dynamic";

function json(body: Report | ReportError, status: number, cache = "no-store") {
  return NextResponse.json(body, { status, headers: { "Cache-Control": cache } });
}

export async function GET(_req: Request, { params }: { params: { username: string } }) {
  const username = normalizeUsername(decodeURIComponent(params.username));
  if (!username) return json({ error: "invalid_username" }, 400);

  try {
    const report = await getReport(username);
    return json(report, 200, "public, s-maxage=600, stale-while-revalidate=60");
  } catch (err) {
    if (err instanceof GitHubNotFoundError) {
      return json({ error: "not_found" }, 404, "public, s-maxage=60");
    }
    if (err instanceof GitHubRateLimitError) {
      return json({ error: "rate_limited", resetAt: err.resetAt }, 429);
    }
    console.error("[report]", err);
    return json({ error: "upstream" }, 502);
  }
}
