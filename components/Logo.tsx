import Link from "next/link";

export function Logo({ size = "md", href }: { size?: "md" | "lg"; href?: string }) {
  const className = `inline-block animate-wiggle border-3 border-ink bg-yellow font-display leading-none text-ink ${
    size === "lg" ? "px-6 py-4 text-4xl shadow-brut-lg sm:text-5xl" : "px-4 py-3 text-2xl shadow-brut"
  }`;

  return href ? (
    <Link href={href} className={className}>
      GitCheckup
    </Link>
  ) : (
    <div className={className}>GitCheckup</div>
  );
}
