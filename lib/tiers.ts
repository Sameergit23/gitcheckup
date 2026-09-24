import type { Tier } from "./types";

// Literal class strings so Tailwind can see them.
export const TIER_BG: Record<Tier, string> = {
  healthy: "bg-mint",
  "needs-work": "bg-yellow",
  poor: "bg-rose",
};

export const TIER_LABEL: Record<Tier, string> = {
  healthy: "Healthy",
  "needs-work": "Needs work",
  poor: "Poor",
};

/** Sticker on the big score card. */
export function stickerFor(score: number): { label: string; bg: string } {
  if (score >= 80) return { label: "Looking good", bg: "bg-mint" };
  if (score >= 50) return { label: "Getting there", bg: "bg-yellow" };
  return { label: "Needs love", bg: "bg-pink" };
}
