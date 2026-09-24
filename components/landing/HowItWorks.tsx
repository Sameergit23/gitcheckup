import type { ComponentType, SVGProps } from "react";
import { ScanIcon, UserIcon, WrenchIcon } from "@/components/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const STEPS: { title: string; body: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { title: "Enter a username", body: "Any public GitHub account. No sign-up.", Icon: UserIcon },
  {
    title: "We scan every repo",
    body: "README, links, license, activity and topics — live links are actually pinged.",
    Icon: ScanIcon,
  },
  {
    title: "Fix what's flagged",
    body: "Each issue comes with a one-line fix. Re-run to see your score climb.",
    Icon: WrenchIcon,
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-heading"
      className="mx-auto w-full max-w-[1400px] scroll-mt-24 px-4 py-20 sm:px-8 lg:py-28"
    >
      <SectionHeading id="how-heading" eyebrow="How it works">
        Three steps. Zero sign-up.
      </SectionHeading>

      <ol className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
        {STEPS.map(({ title, body, Icon }, i) => (
          <Reveal as="li" key={title} delay={i * 120} className="card flex flex-col gap-5 p-6">
            <div className="flex items-start justify-between">
              <span
                aria-hidden="true"
                className="grid h-16 w-16 place-items-center border-3 border-ink bg-yellow font-display text-4xl shadow-brut-sm"
              >
                {i + 1}
              </span>
              <Icon width={36} height={36} />
            </div>
            <h3 className="font-display text-2xl uppercase leading-tight">
              <span className="sr-only">Step {i + 1}: </span>
              {title}
            </h3>
            <p className="text-muted">{body}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
