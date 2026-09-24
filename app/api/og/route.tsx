import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { TIER_LABEL, stickerFor } from "@/lib/tiers";
import type { Report, Tier } from "@/lib/types";
import { normalizeUsername } from "@/lib/username";

// Edge keeps satori's font loading portable (the Node build trips over Windows paths in dev).
// The report itself comes from our own API route, which does the GitHub work and is CDN-cached.
export const runtime = "edge";

const C = {
  cream: "#FFF4D6",
  ink: "#111111",
  white: "#FFFFFF",
  yellow: "#FFD23F",
  pink: "#FF6B9A",
  mint: "#7BE0AD",
  rose: "#FF8FA3",
};
const BG: Record<string, string> = { "bg-mint": C.mint, "bg-yellow": C.yellow, "bg-pink": C.pink };
const TIER_COLOR: Record<Tier, string> = { healthy: C.mint, "needs-work": C.yellow, poor: C.rose };

/** Satori needs TTF/OTF; Google serves those to non-browser clients. Subset to the text we draw. */
async function googleFont(family: string, weight: number, text: string): Promise<ArrayBuffer | null> {
  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(cssUrl, { next: { revalidate: 86400 } })).text();
    const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!src) return null;
    const res = await fetch(src, { next: { revalidate: 86400 } });
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}

/** The user's report, or null (not found, rate limited, no repos) to fall back to the generic card. */
async function loadReport(origin: string, username: string): Promise<Report | null> {
  try {
    const res = await fetch(`${origin}/api/report/${encodeURIComponent(username)}`, {
      next: { revalidate: 600 },
    });
    if (!res.ok) return null;
    const report: Report = await res.json();
    return report.repos.length > 0 ? report : null;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const username = normalizeUsername(req.nextUrl.searchParams.get("u") ?? "");
  const report = username ? await loadReport(req.nextUrl.origin, username) : null;

  const text =
    "GitCheckupYOURSCORE0123456789/·@IS YOUR GITHUB READY FOR JUDGES & CLIENTS?READMELIVELINKLICENSETOPICSHEALTHYNEEDSWORKPOORLOVEGETTINGTHERELOOKINGGOOD" +
    (report?.login ?? "");
  const [display, mono] = await Promise.all([
    googleFont("Archivo Black", 400, text),
    googleFont("Space Mono", 700, text),
  ]);
  const fonts = [
    ...(display ? [{ name: "Archivo Black", data: display, weight: 400 as const, style: "normal" as const }] : []),
    ...(mono ? [{ name: "Space Mono", data: mono, weight: 700 as const, style: "normal" as const }] : []),
  ];

  const image = report ? <ScoreImage report={report} /> : <GenericImage />;

  return new ImageResponse(image, {
    width: 1200,
    height: 630,
    fonts,
    headers: { "cache-control": "public, max-age=0, s-maxage=600, stale-while-revalidate=600" },
  });
}

function Logo({ size }: { size: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignSelf: "flex-start",
        background: C.yellow,
        border: `5px solid ${C.ink}`,
        boxShadow: `8px 8px 0 ${C.ink}`,
        padding: "10px 22px",
        fontFamily: "Archivo Black",
        fontSize: size,
        transform: "rotate(-2deg)",
      }}
    >
      GitCheckup
    </div>
  );
}

function ScoreImage({ report }: { report: Report }) {
  const sticker = stickerFor(report.score);
  const tiers: Tier[] = ["healthy", "needs-work", "poor"];

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: C.cream,
        color: C.ink,
        padding: "64px 72px",
        fontFamily: "Space Mono",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          width: 440,
          background: C.yellow,
          border: `6px solid ${C.ink}`,
          boxShadow: `14px 14px 0 ${C.ink}`,
          padding: "34px 38px",
        }}
      >
        <div style={{ fontFamily: "Archivo Black", fontSize: 34 }}>YOUR SCORE</div>
        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            fontFamily: "Archivo Black",
            fontSize: report.score === 100 ? 170 : 230,
            lineHeight: 1,
            letterSpacing: report.score === 100 ? -8 : -12,
          }}
        >
          {String(report.score)}
        </div>
        <div style={{ fontSize: 32, fontWeight: 700 }}>/ 100</div>
        <div
          style={{
            position: "absolute",
            top: -30,
            right: -34,
            display: "flex",
            background: BG[sticker.bg] ?? C.pink,
            border: `5px solid ${C.ink}`,
            boxShadow: `6px 6px 0 ${C.ink}`,
            padding: "10px 18px",
            fontFamily: "Archivo Black",
            fontSize: 26,
            transform: "rotate(7deg)",
          }}
        >
          {sticker.label.toUpperCase()}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", flex: 1, marginLeft: 80 }}>
        <Logo size={44} />
        <div
          style={{
            fontFamily: "Archivo Black",
            fontSize: report.login.length > 16 ? 46 : 68,
            marginTop: 44,
            wordBreak: "break-all",
          }}
        >
          {`@${report.login}`}
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: "auto", gap: 16 }}>
          {tiers.map((tier) => (
            <div
              key={tier}
              style={{
                display: "flex",
                alignItems: "center",
                background: C.white,
                border: `5px solid ${C.ink}`,
                boxShadow: `7px 7px 0 ${C.ink}`,
                padding: "10px 20px",
                fontSize: 26,
                fontWeight: 700,
              }}
            >
              <div style={{ width: 26, height: 26, background: TIER_COLOR[tier], border: `4px solid ${C.ink}`, marginRight: 16 }} />
              {TIER_LABEL[tier].toUpperCase()}
              <div style={{ marginLeft: "auto", fontFamily: "Archivo Black", fontSize: 34 }}>
                {String(report.counts[tier])}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Drawn rather than typed: the subset fonts don't carry the ✱ glyph. */
function Asterisk() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={C.yellow} strokeWidth="4" strokeLinecap="square">
      <path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9" />
    </svg>
  );
}

function GenericImage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: C.cream,
        color: C.ink,
        fontFamily: "Space Mono",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "64px 72px 0" }}>
        <Logo size={52} />
        <div style={{ fontFamily: "Archivo Black", fontSize: 80, lineHeight: 1, marginTop: 48 }}>
          IS YOUR GITHUB READY FOR JUDGES & CLIENTS?
        </div>
      </div>
      <div
        style={{
          display: "flex",
          background: C.ink,
          color: C.cream,
          padding: "22px 0",
          fontFamily: "Archivo Black",
          fontSize: 30,
          whiteSpace: "nowrap",
        }}
      >
        {["README", "LIVE LINK", "LICENSE", "TOPICS", "README", "LIVE LINK"].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ padding: "0 26px" }}>{item}</div>
            <Asterisk />
          </div>
        ))}
      </div>
    </div>
  );
}
