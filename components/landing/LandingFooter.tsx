import { ExternalIcon } from "@/components/Icons";
import { site } from "@/lib/site";

const LINK =
  "inline-flex items-center gap-2 font-bold underline decoration-2 underline-offset-4 hover:text-yellow focus-visible:outline-yellow";

export function LandingFooter() {
  return (
    <footer className="mt-auto border-t-3 border-ink bg-ink text-cream">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-4 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
        <p>
          <span className="font-display text-lg">GitCheckup</span> — made by {site.author}
        </p>
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          <li>
            <a href={site.repoUrl} target="_blank" rel="noopener noreferrer" className={LINK}>
              GitHub repo <ExternalIcon width={16} height={16} />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
          <li>
            <a href={site.linkedinUrl} target="_blank" rel="noopener noreferrer" className={LINK}>
              LinkedIn <ExternalIcon width={16} height={16} />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
          <li>Not affiliated with GitHub.</li>
        </ul>
      </div>
    </footer>
  );
}
