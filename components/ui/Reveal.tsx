"use client";

import { createElement, useEffect, useRef, useState, type ReactNode } from "react";

type Phase = "static" | "waiting" | "shown";

/**
 * Pops its content in the first time it scrolls into view, then never again.
 * Content renders visible on the server; it's only hidden once JS confirms it
 * is below the fold, so no-JS and reduced-motion visitors always see it.
 */
export function Reveal({
  as = "div",
  delay = 0,
  className = "",
  children,
}: {
  as?: "div" | "li";
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState<Phase>("static");

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return; // already on screen

    setPhase("waiting");
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setPhase("shown");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return createElement(
    as,
    {
      ref,
      className: `${phase === "waiting" ? "opacity-0" : phase === "shown" ? "animate-pop" : ""} ${className}`,
      style: phase === "shown" && delay ? { animationDelay: `${delay}ms` } : undefined,
    },
    children,
  );
}
