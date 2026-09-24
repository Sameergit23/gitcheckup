import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const COLORS = {
  pink: "bg-pink",
  yellow: "bg-yellow",
  mint: "bg-mint",
  white: "bg-white",
} as const;

const SIZES = {
  icon: "p-2",
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
} as const;

type Look = {
  color?: keyof typeof COLORS;
  size?: keyof typeof SIZES;
  className?: string;
};

function classes({ color = "white", size = "md", className = "" }: Look) {
  return `btn ${COLORS[color]} ${SIZES[size]} ${className}`;
}

/** Bordered button with a hard shadow that presses in on hover/focus. */
export function BrutalButton({
  color,
  size,
  className,
  type = "button",
  ...props
}: Look & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} {...props} className={classes({ color, size, className })} />;
}

/** Same look as BrutalButton, for navigation. External links open in a new tab. */
export function BrutalLink({
  href,
  external = false,
  children,
  "aria-label": ariaLabel,
  ...look
}: Look & { href: string; external?: boolean; children: ReactNode; "aria-label"?: string }) {
  const className = classes(look);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}
