import { Marquee } from "@/components/Marquee";

const CARD_STRIPS = ["bg-rose", "bg-yellow", "bg-mint", "bg-yellow", "bg-rose", "bg-mint"];

/** Same borders and shadows as the real report, pulsing while the checkup runs. */
export function ReportSkeleton() {
  return (
    <>
      <Marquee label="Checkup in progress" items={["SCANNING REPOS", "PINGING LIVE LINKS", "READING READMES"]} />
      <main
        aria-busy="true"
        className="mx-auto grid w-full max-w-[1400px] flex-1 grid-cols-1 gap-10 px-4 py-10 sm:px-8 md:grid-cols-[300px_minmax(0,1fr)] md:items-start"
      >
        <div aria-hidden="true" className="flex flex-col gap-5">
          <div className="h-[268px] animate-shimmer border-3 border-ink bg-yellow shadow-brut-lg" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="card h-[58px] animate-shimmer" style={{ animationDelay: `${i * 120}ms` }} />
          ))}
        </div>

        <div aria-hidden="true" className="flex min-w-0 flex-col gap-8">
          <div className="flex flex-wrap gap-3">
            {[72, 128, 84, 100].map((w, i) => (
              <div key={i} className="h-11 animate-shimmer border-3 border-ink bg-white shadow-brut-sm" style={{ width: w }} />
            ))}
          </div>
          <ul className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {CARD_STRIPS.map((strip, i) => (
              <li key={i} className="card animate-shimmer" style={{ animationDelay: `${i * 120}ms` }}>
                <div className={`h-[52px] border-b-3 border-ink ${strip}`} />
                <div className="flex flex-col gap-3 p-4">
                  <div className="h-3 w-2/3 bg-ink/15" />
                  <div className="mt-2 h-4 w-1/2 bg-ink/25" />
                  <div className="h-3 w-5/6 bg-ink/10" />
                  <div className="mt-2 h-4 w-2/5 bg-ink/25" />
                  <div className="h-3 w-3/4 bg-ink/10" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}
