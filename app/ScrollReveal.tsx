"use client";

import { useLayoutEffect, useRef } from "react";
import { loadGsap, prefersReducedMotion } from "./scroll/loadGsap";

type ScrollRevealProps = {
  children: React.ReactNode;
  className?: string;
  /** CSS selector (relative to the wrapper) for items to stagger in. Omit to animate the wrapper as a single unit. */
  selector?: string;
  y?: number;
  stagger?: number;
  start?: string;
};

/**
 * Lightweight scroll-in reveal for sections that don't need a pinned,
 * scrubbed scene (Schedule rows, Ticket card, About rows, Sponsor slots).
 * Uses ScrollTrigger's toggleActions rather than scrub: it plays once the
 * section nears the viewport and reverses on scroll-back, it does not tie
 * animation progress to scroll position. Renders children unconditionally
 * (SSR/no-JS/reduced-motion always show the final, visible state) and only
 * ever *adds* the reveal on top once GSAP has loaded successfully.
 */
export default function ScrollReveal({
  children,
  className,
  selector,
  y = 32,
  stagger = 0.08,
  start = "top 82%",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    (async () => {
      try {
        const { gsap, ScrollTrigger } = await loadGsap();
        if (cancelled) return;

        ctx = gsap.context(() => {
          const targets = selector ? Array.from(el.querySelectorAll<HTMLElement>(selector)) : [el];
          if (targets.length === 0) return;

          gsap.set(targets, { opacity: 0, y });
          gsap.to(targets, {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power2.out",
            stagger,
            scrollTrigger: {
              trigger: el,
              start,
              toggleActions: "play none none reverse",
            },
          });
        }, el);
      } catch {
        // GSAP failed to load: leave children at their default, visible state.
      }
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [selector, y, stagger, start]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
