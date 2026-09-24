import { UsernameForm } from "@/components/UsernameForm";
import { Sticker } from "@/components/ui/Sticker";
import { ReportPreview } from "./ReportPreview";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-14 px-4 pb-16 pt-10 sm:px-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16 lg:pb-24 lg:pt-16"
    >
      <div className="flex flex-col items-start gap-7">
        <Sticker color="pink">Free · No login</Sticker>
        <h1
          id="hero-heading"
          className="font-display text-[40px] uppercase leading-[1.02] sm:text-[56px] lg:text-[60px] xl:text-[72px]"
        >
          Is your GitHub{" "}
          <span className="inline-block -rotate-2 border-3 border-ink bg-yellow px-2 leading-[0.95] shadow-brut-sm">
            ready
          </span>{" "}
          for judges &amp; clients?
        </h1>
        <p className="max-w-xl text-base sm:text-lg">
          GitCheckup scans every public repo and tells you exactly what&apos;s missing — README, live
          link, license and more — with a fix for each.
        </p>
        <div className="w-full max-w-xl">
          <UsernameForm variant="hero" examples={["vercel", "Sameergit23"]} />
        </div>
      </div>

      <ReportPreview />
    </section>
  );
}
