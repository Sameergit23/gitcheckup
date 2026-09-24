"use client";

import { useEffect, useState } from "react";

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Counts from 0 to `value` with an ease-out, bouncing up into place.
 * Renders the real value first (server HTML, no-JS, reduced motion) and only
 * rewinds to 0 on the client when it's allowed to animate; the bounce-in
 * starts transparent, so the rewind isn't visible.
 */
export function CountUp({ value, duration = 900 }: { value: number; duration?: number }) {
  const [shown, setShown] = useState(value);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setShown(value);
      return;
    }
    setShown(0);
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setShown(Math.round(value * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return (
    <>
      <span aria-hidden="true" className="inline-block animate-bounce-in">
        {shown}
      </span>
      <span className="sr-only">{value}</span>
    </>
  );
}
