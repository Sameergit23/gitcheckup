import type { ReactNode } from "react";

/** Black eyebrow tag + big uppercase h2 (+ optional intro line). */
export function SectionHeading({
  id,
  eyebrow,
  intro,
  children,
}: {
  id: string;
  eyebrow?: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex max-w-3xl flex-col items-start gap-4">
      {eyebrow && (
        <p className="bg-ink px-2 py-1 font-display text-xs uppercase tracking-widest text-cream">
          {eyebrow}
        </p>
      )}
      <h2 id={id} className="font-display text-4xl uppercase leading-[0.95] sm:text-5xl lg:text-6xl">
        {children}
      </h2>
      {intro && <p className="text-base sm:text-lg">{intro}</p>}
    </div>
  );
}
