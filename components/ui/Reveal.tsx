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

    // The observer's first callback says whether the element starts on screen,
    // without forcing a synchronous layout read.
    let first = true;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.isIntersecting);
        if (first) {
          first = false;
          if (visible) io.disconnect(); // already on screen: leave it be
          else setPhase("waiting");
          return;
        }
        if (visible) {
          setPhase("shown");
          io.disconnect();
        }
      },
      { threshold: 0.1 },
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
