import type { ReactNode } from "react";
import { Marquee } from "./Marquee";

const TONES = {
  rose: "bg-rose",
  yellow: "bg-yellow",
  white: "bg-white",
} as const;

export function ErrorPanel({
  title,
  ticker,
  tone = "rose",
  actions,
  children,
}: {
  title: string;
  ticker: string[];
  tone?: keyof typeof TONES;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <Marquee label={title} items={ticker} />
      <main className="flex flex-1 items-start justify-center px-4 py-12 sm:px-8 sm:py-16">
        <section className={`w-full max-w-2xl animate-pop border-3 border-ink p-6 shadow-brut-lg sm:p-10 ${TONES[tone]}`}>
          <p aria-hidden="true" className="font-display text-6xl leading-none sm:text-7xl">
            ✗
          </p>
          <h1 className="mt-4 font-display text-3xl uppercase leading-none sm:text-5xl">{title}</h1>
          <div className="mt-5 flex flex-col gap-3 text-base sm:text-lg">{children}</div>
          {actions && <div className="mt-8 flex flex-wrap gap-4">{actions}</div>}
        </section>
      </main>
    </>
  );
}
