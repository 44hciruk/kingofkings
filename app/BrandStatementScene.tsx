"use client";

import { useLayoutEffect, useRef } from "react";
import { loadGsap, prefersReducedMotion } from "./scroll/loadGsap";
import { eventMeta } from "./data";

const TIMELINE_TOTAL = 100;

/**
 * Brand/conviction statement: the large-typography scene the reference
 * uses right after its hero to state what the product is, before moving
 * into feature-by-feature detail. Pinned briefly while the event name
 * scales in, then the tagline follows — sequential emphasis on a fixed
 * pin, not a plain fade-in of both lines at once.
 */
export default function BrandStatementScene() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const nameRef = useRef<HTMLHeadingElement | null>(null);
  const taglineRef = useRef<HTMLParagraphElement | null>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    const name = nameRef.current;
    const tagline = taglineRef.current;
    if (!section || !name || !tagline) return;

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    (async () => {
      try {
        const { gsap, ScrollTrigger } = await loadGsap();
        if (cancelled) return;

        ctx = gsap.context(() => {
          gsap.set(name, { opacity: 0, scale: 0.92, force3D: true });
          gsap.set(tagline, { opacity: 0, y: 24 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top",
              pin: true,
              end: () => `+=${window.innerHeight * 1.1}`,
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });

          tl.to(name, { opacity: 1, scale: 1, duration: 40, ease: "power1.out" }, 0);
          tl.to(tagline, { opacity: 1, y: 0, duration: 35, ease: "power1.out" }, 30);
          tl.set({}, {}, TIMELINE_TOTAL);

          return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
          };
        }, section);
      } catch {
        // leave both lines in their default, visible state
      }
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section className="kok-brand-statement" id="brand" ref={sectionRef}>
      <div className="inner">
        <h2 ref={nameRef} className="kok-brand-statement__name">{eventMeta.name}</h2>
        <p ref={taglineRef} className="kok-brand-statement__tagline">{eventMeta.tagline}</p>
      </div>
    </section>
  );
}
