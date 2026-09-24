"use client";

import { useEffect, useState } from "react";
import { CloseIcon, GitHubIcon, MenuIcon } from "@/components/Icons";
import { Logo } from "@/components/Logo";
import { site } from "@/lib/site";

const LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#what-we-check", label: "What we check" },
  { href: "#faq", label: "FAQ" },
];

export function LandingNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b-3 border-ink bg-cream">
      <nav aria-label="Main" className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 sm:px-8">
        <Logo size="sm" href="/" />

        <ul className="hidden items-center gap-2 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="block px-3 py-2 text-sm font-bold uppercase tracking-wider underline-offset-4 hover:bg-yellow hover:underline"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="ml-2">
            <a
              href={site.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitCheckup source code on GitHub (opens in a new tab)"
              className="btn bg-white p-2"
            >
              <GitHubIcon width={20} height={20} />
            </a>
          </li>
        </ul>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
          className="btn bg-white px-3 py-2 text-sm md:hidden"
        >
          {open ? <CloseIcon /> : <MenuIcon />}
          Menu
        </button>
      </nav>

      <div id="mobile-menu" hidden={!open} className="border-t-3 border-ink bg-cream md:hidden">
        <ul className="mx-auto flex max-w-[1400px] flex-col px-4 py-2">
          {LINKS.map((link) => (
            <li key={link.href} className="border-b-3 border-ink last:border-b-0">
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block py-3 font-display text-lg uppercase hover:bg-yellow"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={site.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 py-3 font-display text-lg uppercase hover:bg-yellow"
            >
              <GitHubIcon width={20} height={20} /> GitHub
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
