import type { ReactNode } from "react";

const COLORS = {
  pink: "bg-pink",
  yellow: "bg-yellow",
  mint: "bg-mint",
  white: "bg-white",
} as const;

const MOTION = {
  sticker: "animate-sticker",
  wiggle: "animate-wiggle",
  none: "",
} as const;

/** Tilted label slapped onto a card. */
export function Sticker({
  children,
  color = "pink",
  motion = "sticker",
  className = "",
}: {
  children: ReactNode;
  color?: keyof typeof COLORS;
  motion?: keyof typeof MOTION;
  className?: string;
}) {
  return (
    <span
      className={`inline-block rotate-[7deg] border-3 border-ink px-3 py-2 font-display text-sm uppercase leading-none text-ink shadow-brut-sm ${COLORS[color]} ${MOTION[motion]} ${className}`}
    >
      {children}
    </span>
  );
}
