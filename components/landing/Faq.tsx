"use client";

import { useId, useState } from "react";
import { MinusIcon, PlusIcon } from "@/components/Icons";
import { SectionHeading } from "@/components/ui/SectionHeading";

const FAQS = [
  { q: "Is it free?", a: "Yes, completely." },
  {
    q: "Do I need to log in or give access?",
    a: "No. GitCheckup only reads public data from the GitHub API. There's no sign-in and nothing to authorize.",
  },
  {
    q: "Does it check private repos?",
    a: "No. Only public, non-fork repos are scored.",
  },
  {
    q: "How is the live link checked?",
    a: "Our server requests the homepage URL set on your repo. If it returns an error (4xx/5xx) or doesn't answer within 5 seconds, it's marked down.",
  },
  {
    q: "Why is my score low?",
    a: "Most points come from a good README, a description and a working live link — those are the quickest wins. Each flagged repo tells you exactly what to add.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="mx-auto w-full max-w-[1400px] scroll-mt-24 px-4 py-20 sm:px-8 lg:py-28"
    >
      <SectionHeading id="faq-heading" eyebrow="FAQ">
        Questions, answered.
      </SectionHeading>

      <div className="mt-12 flex max-w-4xl flex-col gap-5">
        {FAQS.map((item, i) => {
          const isOpen = open === i;
          const buttonId = `${baseId}-q${i}`;
          const panelId = `${baseId}-a${i}`;
          return (
            <div key={item.q} className="press border-3 border-ink bg-white shadow-brut">
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-display text-lg uppercase leading-tight focus-visible:outline-offset-[-7px] sm:text-xl"
                >
                  {item.q}
                  <span
                    aria-hidden="true"
                    className={`grid h-9 w-9 shrink-0 place-items-center border-3 border-ink ${isOpen ? "bg-yellow" : "bg-cream"}`}
                  >
                    {isOpen ? <MinusIcon /> : <PlusIcon />}
                  </span>
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                hidden={!isOpen}
                className="border-t-3 border-ink px-5 py-4"
              >
                <p>{item.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
