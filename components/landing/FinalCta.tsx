import { UsernameForm } from "@/components/UsernameForm";
import { Sticker } from "@/components/ui/Sticker";

export function FinalCta() {
  return (
    <section aria-labelledby="cta-heading" className="px-4 pb-24 pt-8 sm:px-8 lg:pb-32">
      <div className="relative mx-auto max-w-4xl border-3 border-ink bg-yellow px-6 py-12 shadow-brut-lg sm:px-12 sm:py-16">
        <Sticker color="pink" motion="wiggle" className="absolute -right-3 -top-5 text-base sm:-right-6">
          It&apos;s free
        </Sticker>
        <h2 id="cta-heading" className="font-display text-4xl uppercase leading-[0.95] sm:text-6xl">
          Check your repos in 10 seconds
        </h2>
        <div className="mt-10 max-w-2xl">
          <UsernameForm variant="hero" />
        </div>
      </div>
    </section>
  );
}
