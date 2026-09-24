import { ImageResponse } from "next/og";
import { googleFont } from "./fonts";

export const LANDING_OG_ALT = "GitCheckup — Is your GitHub ready for judges & clients?";
export const LANDING_OG_SIZE = { width: 1200, height: 630 };

const C = { cream: "#FFF4D6", ink: "#111111", white: "#FFFFFF", yellow: "#FFD23F", pink: "#FF6B9A" };
const TEXT = "GitCheckupFREE·NOLOGINISYOURGITHUBREADYFORJUDGES&CLIENTS?READMELIVELINKLICENSETOPICS ";

/** Drawn rather than typed: the subset fonts don't carry the ✱ glyph. */
function Asterisk() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={C.ink} strokeWidth="4" strokeLinecap="square">
      <path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9" />
    </svg>
  );
}

/** Brutalist share card for the landing page: yellow card, black border, logo + headline. */
export async function landingOgImage() {
  const [display, mono] = await Promise.all([
    googleFont("Archivo Black", 400, TEXT),
    googleFont("Space Mono", 700, TEXT),
  ]);
  const fonts = [
    ...(display ? [{ name: "Archivo Black", data: display, weight: 400 as const, style: "normal" as const }] : []),
    ...(mono ? [{ name: "Space Mono", data: mono, weight: 700 as const, style: "normal" as const }] : []),
  ];

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: C.cream, padding: "48px 64px 64px 48px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            background: C.yellow,
            border: `8px solid ${C.ink}`,
            boxShadow: `18px 18px 0 ${C.ink}`,
            padding: "44px 56px",
            color: C.ink,
            fontFamily: "Archivo Black",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div
              style={{
                display: "flex",
                background: C.white,
                border: `5px solid ${C.ink}`,
                boxShadow: `8px 8px 0 ${C.ink}`,
                padding: "8px 20px",
                fontSize: 44,
                transform: "rotate(-2deg)",
              }}
            >
              GitCheckup
            </div>
            <div
              style={{
                display: "flex",
                background: C.pink,
                border: `5px solid ${C.ink}`,
                boxShadow: `6px 6px 0 ${C.ink}`,
                padding: "10px 18px",
                fontSize: 26,
                transform: "rotate(7deg)",
              }}
            >
              FREE · NO LOGIN
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", marginTop: 40, fontSize: 76, lineHeight: 1.05 }}>
            <div style={{ display: "flex" }}>IS YOUR GITHUB</div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  display: "flex",
                  background: C.white,
                  border: `5px solid ${C.ink}`,
                  padding: "0 14px",
                  marginRight: 22,
                  transform: "rotate(-2deg)",
                }}
              >
                READY
              </div>
              FOR JUDGES
            </div>
            <div style={{ display: "flex" }}>& CLIENTS?</div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "auto",
              fontFamily: "Space Mono",
              fontWeight: 700,
              fontSize: 26,
            }}
          >
            {["README", "LIVE LINK", "LICENSE", "TOPICS"].map((item, i) => (
              <div key={item} style={{ display: "flex", alignItems: "center" }}>
                {i > 0 && (
                  <div style={{ display: "flex", margin: "0 18px" }}>
                    <Asterisk />
                  </div>
                )}
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...LANDING_OG_SIZE, fonts },
  );
}
