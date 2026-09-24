/**
 * Black ticker band. The run is rendered twice side by side so sliding the
 * track by -50% loops seamlessly. Screen readers get a plain sentence instead.
 */
export function Marquee({ items, label }: { items: string[]; label: string }) {
  // Repeat short lists so one run is always wider than the viewport.
  const repeats = Math.max(1, Math.ceil(12 / Math.max(items.length, 1)));
  const run = Array.from({ length: repeats }, () => items).flat();

  return (
    <div className="overflow-hidden border-y-3 border-ink bg-ink py-3 text-cream">
      <p className="sr-only">
        {label}: {items.join(", ")}.
      </p>
      <div aria-hidden="true" className="flex w-max">
        <MarqueeRun items={run} />
        <MarqueeRun items={run} />
      </div>
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
