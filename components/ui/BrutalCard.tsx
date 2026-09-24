import type { HTMLAttributes } from "react";

const COLORS = {
  white: "bg-white",
  cream: "bg-cream",
  yellow: "bg-yellow",
  pink: "bg-pink",
  mint: "bg-mint",
  rose: "bg-rose",
} as const;

const SHADOWS = {
  sm: "shadow-brut-sm",
  md: "shadow-brut",
  lg: "shadow-brut-lg",
} as const;

type Props = HTMLAttributes<HTMLElement> & {
  as?: "div" | "article" | "li" | "section" | "figure";
  color?: keyof typeof COLORS;
  shadow?: keyof typeof SHADOWS;
  /** Press into the shadow on hover / keyboard focus inside. */
  press?: boolean;
};

/** 3px ink border, square corners, hard offset shadow. */
export function BrutalCard({
  as: Tag = "div",
  color = "white",
  shadow = "md",
  press = false,
  className = "",
  ...props
}: Props) {
  return (
    <Tag
      {...props}
      className={`border-3 border-ink ${COLORS[color]} ${SHADOWS[shadow]} ${press ? "press" : ""} ${className}`}
    />
  );
}
