import Link from "next/link";

const SIZES = {
  sm: "px-3 py-2 text-xl shadow-brut-sm",
  md: "px-4 py-3 text-2xl shadow-brut",
  lg: "px-6 py-4 text-4xl shadow-brut-lg sm:text-5xl",
} as const;

export function Logo({ size = "md", href }: { size?: keyof typeof SIZES; href?: string }) {
  const className = `inline-block animate-wiggle border-3 border-ink bg-yellow font-display leading-none text-ink ${SIZES[size]}`;

  return href ? (
    <Link href={href} className={className}>
      GitCheckup
    </Link>
  ) : (
    <div className={className}>GitCheckup</div>
  );
}
