import { ExternalIcon } from "./Icons";

export function Footer() {
  return (
    <footer className="mt-auto border-t-3 border-ink bg-white">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-3 px-4 py-6 text-sm sm:flex-row sm:px-8">
        <p>
          Made by <span className="font-bold">Sameer Akhtar</span>
        </p>
        <a
          href="https://github.com/Sameergit23"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-bold underline decoration-2 underline-offset-4 hover:bg-yellow"
        >
          github.com/Sameergit23
          <ExternalIcon width={16} height={16} />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>
    </footer>
  );
}
