"use client";

import { useState } from "react";
import { PauseIcon, PlayIcon } from "./Icons";

/**
 * Black ticker band. The run is rendered twice side by side so sliding the
 * track by -50% loops seamlessly. Screen readers get a plain sentence instead,
 * and the button lets anyone stop the motion.
 */
export function Marquee({ items, label }: { items: string[]; label: string }) {
  const [paused, setPaused] = useState(false);

  // Repeat short lists so one run is always wider than the viewport.
  const repeats = Math.max(1, Math.ceil(12 / Math.max(items.length, 1)));
  const run = Array.from({ length: repeats }, () => items).flat();

  return (
    <div className="group flex border-y-3 border-ink bg-ink text-cream">
      <p className="sr-only">
        {label}: {items.join(", ")}.
      </p>
      <div aria-hidden="true" className="min-w-0 flex-1 overflow-hidden py-3">
        <div
          className={`flex w-max animate-marquee group-hover:[animation-play-state:paused] ${
            paused ? "[animation-play-state:paused]" : ""
          }`}
        >
          <MarqueeRun items={run} />
          <MarqueeRun items={run} />
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-pressed={paused}
        className="flex shrink-0 items-center border-l-3 border-cream/30 px-3 text-yellow hover:bg-cream hover:text-ink focus-visible:outline-cream focus-visible:outline-offset-[-6px] motion-reduce:hidden"
      >
        {paused ? <PlayIcon /> : <PauseIcon />}
        <span className="sr-only">Pause ticker</span>
      </button>
    </div>
  );
}

function MarqueeRun({ items }: { items: string[] }) {
  return (
    <ul className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <li key={i} className="flex items-center whitespace-nowrap font-display text-lg uppercase sm:text-xl">
          <span className="px-5">{item}</span>
          <span className="text-yellow">✱</span>
        </li>
      ))}
    </ul>
  );
}
