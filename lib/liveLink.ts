import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { unstable_cache } from "next/cache";
import type { LinkCheck } from "./types";

const TIMEOUT_MS = 5000;
const MAX_REDIRECTS = 5;
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36 GitCheckup/1.0";

type Failure = "timeout" | "dns" | "unreachable" | "private" | "redirects";

const REASONS: Record<Failure, string> = {
  timeout: "timed out after 5 seconds",
  dns: "points at a domain that doesn't resolve",
  unreachable: "couldn't be reached",
  private: "doesn't point at a public site",
  redirects: "redirects too many times",
};

/** "my-app.vercel.app" → https://my-app.vercel.app/. Only http(s) is allowed. */
export function normalizeHomepage(raw: string): URL | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    const url = new URL(/^[a-z][a-z\d+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
    return url.protocol === "http:" || url.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}

function isPrivateIp(ip: string): boolean {
  if (isIP(ip) === 4) {
    const [a, b] = ip.split(".").map(Number);
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      a >= 224 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168)
    );
  }
  const v6 = ip.toLowerCase();
  if (v6.startsWith("::ffff:")) return isPrivateIp(v6.slice(7));
  return v6 === "::" || v6 === "::1" || /^(fc|fd|fe[89ab])/.test(v6);
}

/**
 * Homepages are user-controlled, so never let them point the server at
 * localhost, cloud metadata or other internal addresses.
 */
async function checkHost(hostname: string): Promise<Failure | null> {
  const host = hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (host === "localhost" || /\.(localhost|local|internal)$/.test(host)) return "private";
  if (isIP(host)) return isPrivateIp(host) ? "private" : null;
  try {
    const addresses = await lookup(host, { all: true });
    return addresses.some((a) => isPrivateIp(a.address)) ? "private" : null;
  } catch {
    return "dns";
  }
}

/** One attempt with a single 5s budget, following redirects by hand so every hop is vetted. */
async function attempt(start: URL, method: "HEAD" | "GET"): Promise<{ status: number } | { failure: Failure }> {
  const signal = AbortSignal.timeout(TIMEOUT_MS);
  let url = start;

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const hostProblem = await checkHost(url.hostname);
    if (hostProblem) return { failure: hostProblem };

    let res: Response;
    try {
      res = await fetch(url, {
        method,
        redirect: "manual",
        cache: "no-store",
        signal,
        headers: { "User-Agent": USER_AGENT, Accept: "text/html,*/*;q=0.8" },
      });
    } catch (err) {
      const name = err instanceof Error ? err.name : "";
      return { failure: name === "TimeoutError" || name === "AbortError" ? "timeout" : "unreachable" };
    }
    // We only care about the status line; don't download the page.
    res.body?.cancel().catch(() => {});

    const location = res.headers.get("location");
    if (res.status >= 300 && res.status < 400 && location) {
      try {
        url = new URL(location, url);
      } catch {
        return { failure: "unreachable" };
      }
      if (url.protocol !== "http:" && url.protocol !== "https:") return { failure: "unreachable" };
      continue;
    }
    return { status: res.status };
  }
  return { failure: "redirects" };
}

async function pingHomepage(raw: string): Promise<LinkCheck> {
  const url = normalizeHomepage(raw);
  if (!url) return { ok: false, reason: "isn't a valid http(s) URL" };

  let result = await attempt(url, "HEAD");
  // Plenty of hosts reject or mishandle HEAD, so retry with GET — unless the
  // host is unreachable in a way a different method won't fix.
  const retry =
    "status" in result ? result.status >= 400 : result.failure === "unreachable";
  if (retry) result = await attempt(url, "GET");

  if ("failure" in result) return { ok: false, reason: REASONS[result.failure] };
  return result.status < 400
    ? { ok: true, status: result.status }
    : { ok: false, reason: `returned ${result.status}` };
}

/** Pings a repo homepage: HEAD, falling back to GET, 5s timeout. Results are cached 10 minutes. */
export const checkLiveLink = unstable_cache(pingHomepage, ["gitcheckup-live-link-v1"], {
  revalidate: 600,
});
