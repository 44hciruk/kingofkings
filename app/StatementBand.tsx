"use client";

import { useLayoutEffect, useRef } from "react";
import { loadGsap, prefersReducedMotion } from "./scroll/loadGsap";
import { eventMeta } from "./data";

/**
 * Transitional statement band: the confirmed full-format sentence
 * (eventMeta.taglineDetail — not yet shown anywhere else; ConvictionScene
 * only shows the short tagline) presented as plain event copy bridging the
 * ticket CTA into the full rules/venue detail section. Never styled as a
 * quote, review, or endorsement — no quotation marks, no attribution.
 */
export default function StatementBand() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const textRef = useRef<HTMLParagraphElement | null>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    const text = textRef.current;
    if (!section || !text) return;

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    (async () => {
      try {
        const { gsap, ScrollTrigger } = await loadGsap();
        if (cancelled) return;

        ctx = gsap.context(() => {
          gsap.set(text, { opacity: 0, y: 20 });

          const tween = gsap.to(text, {
            opacity: 1,
            y: 0,
            ease: "power1.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              end: "top 40%",
              scrub: 0.6,
            },
          });

          return () => {
            tween.scrollTrigger?.kill();
            tween.kill();
          };
        }, section);
      } catch {
        // leave text in its default, visible state
      }
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section className="v-statement" id="statement" ref={sectionRef}>
      <p ref={textRef} className="v-statement__text">{eventMeta.taglineDetail}</p>
    </section>
  );
}
