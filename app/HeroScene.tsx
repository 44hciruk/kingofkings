"use client";

import { useLayoutEffect, useRef } from "react";
import { loadGsap, prefersReducedMotion } from "./scroll/loadGsap";
import HeroVisualSlot from "./HeroVisualSlot";
import { hero, brand } from "./vantaCloneContent";

const TIMELINE_TOTAL = 100;

/**
 * Hero: pinned, object rotating continuously behind/beside the text, a
 * heading fading in first, then the body copy — matching the reference's
 * own reveal order. Near the end of the pin, the background shifts from
 * black to a dark blue gradient, matching the reference's own color cue
 * that a new section is about to take over.
 */
export default function HeroScene() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const objectTrackRef = useRef<HTMLDivElement | null>(null);
  const objectRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const bodyRef = useRef<HTMLParagraphElement | null>(null);
  const pillRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    const object = objectRef.current;
    const heading = headingRef.current;
    const body = bodyRef.current;
    const pill = pillRef.current;
    if (!section || !object || !heading || !body || !pill) return;

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    (async () => {
      try {
        const { gsap, ScrollTrigger } = await loadGsap();
        if (cancelled) return;

        ctx = gsap.context(() => {
          const mm = gsap.matchMedia();

          mm.add({ isDesktop: "(min-width: 768px)", isMobile: "(max-width: 767px)" }, (context) => {
            const { isDesktop } = context.conditions as { isDesktop: boolean; isMobile: boolean };

            gsap.set(heading, { opacity: 0, y: 20 });
            gsap.set(body, { opacity: 0, y: 16 });
            gsap.set(pill, { opacity: 0, y: -10 });
            gsap.set(section, { backgroundColor: "#000" });

            const pinDistance = () => window.innerHeight * (isDesktop ? 2.4 : 3.2);

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: "top top",
                pin: true,
                end: () => `+=${pinDistance()}`,
                scrub: 0.6,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            });

            // Object rotates continuously across the whole pin.
            tl.to(object, { rotateY: 360, rotateZ: isDesktop ? 25 : 15, ease: "none", duration: 100 }, 0);

            tl.to(heading, { opacity: 1, y: 0, duration: 8, ease: "power1.out" }, 14);
            tl.to(pill, { opacity: 1, y: 0, duration: 8, ease: "power1.out" }, 16);
            tl.to(body, { opacity: 1, y: 0, duration: 10, ease: "power1.out" }, 24);

            // Background cues the next section is about to take over.
            tl.to(section, { backgroundColor: "#0a1a33", duration: 12, ease: "power1.inOut" }, 82);
            tl.set({}, {}, TIMELINE_TOTAL);

            return () => {
              tl.scrollTrigger?.kill();
              tl.kill();
            };
          });
        }, section);
      } catch {
        // leave heading/body/pill in their default, visible state
      }
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  const [line1, line2, accentWord, line3] = hero.bodyLines as [string, string, { accent: string }, string];

  return (
    <section className="v2-hero" id="top" ref={sectionRef}>
      <div ref={pillRef} className="v2-edition-pill">
        <span><sup>1</sup> {brand.editionLabel}</span>
        <a href="#pricing">{brand.buyLabel} →</a>
      </div>
      <div ref={objectTrackRef} className="v2-hero-object-wrap">
        <HeroVisualSlot ref={objectRef} />
      </div>
      <h1 ref={headingRef} className="v2-hero-heading">{hero.eyebrow}</h1>
      <p ref={bodyRef} className="v2-hero-body">
        {line1}<br />{line2} <span className="v2-accent">{accentWord.accent}</span> {line3}
      </p>
    </section>
  );
}
