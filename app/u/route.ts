import { NextResponse, type NextRequest } from "next/server";
import { normalizeUsername } from "@/lib/username";

// No-JS fallback for the username form: /u?username=octocat → /u/octocat
export function GET(req: NextRequest) {
  const username = normalizeUsername(req.nextUrl.searchParams.get("username") ?? "");
  return NextResponse.redirect(new URL(username ? `/u/${username}` : "/", req.url));
}
