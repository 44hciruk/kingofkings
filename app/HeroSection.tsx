"use client";

import { useLayoutEffect, useRef } from "react";
import { loadGsap, prefersReducedMotion } from "./scroll/loadGsap";
import HeroVisualSlot from "./HeroVisualSlot";
import SiteHeader from "./SiteHeader";
import { hero, brand } from "./vantaCloneContent";

const TIMELINE_TOTAL = 100;

/**
 * Hero — pinned for ~3 viewport heights (measured live at a 1600x1000
 * reference viewport: pin-spacer 4000px, visual pin release ~3000px, i.e.
 * pin distance = 3x viewport height; GSAP's own spacer sizing already adds
 * back the section's own 1x-viewport height, reproducing the measured
 * 4000px spacer automatically).
 *
 * The object's scroll-locked scrub is measured, not guessed: it holds its
 * rest state until ~42.4% into the pin (scrollY 1272 of 3000), then scales
 * from 1 to ~0.78 and translates ~-14.9% of viewport width, settling by
 * ~56.3% (scrollY 1688). A continuous scroll-locked rotation runs the full
 * pin as a neutral placeholder stand-in for the reference's own scroll-
 * scrubbed video currentTime (no real footage exists yet to scrub through,
 * per the content-integrity rules) — critically, this rotation is driven
 * by the shared scrubbed timeline, not by a wall-clock tween, so it holds
 * perfectly still during a scroll pause exactly like the measured video did
 * (currentTime stayed frozen at 0 through an 11s dwell at scrollY 0).
 *
 * Body copy reveals as several independently-staggered phrase spans
 * (measured: ~52%-75% into the pin), not a single fade block, overlapping
 * the tail of the object's transform settle — also measured, not assumed.
 *
 * Nav lives inside this pinned section (measured: nav is `position:absolute`,
 * not `fixed` — it only appears to persist because it is nested in Hero's
 * own pinned wrapper, and scrolls away permanently once the pin releases).
 */
export default function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const objectRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const phraseRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const pillRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    const object = objectRef.current;
    const heading = headingRef.current;
    const phrases = phraseRefs.current.filter((el): el is HTMLSpanElement => el !== null);
    const pill = pillRef.current;
    if (!section || !object || !heading || phrases.length === 0 || !pill) return;

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
            gsap.set(phrases, { opacity: 0, y: 14 });
            gsap.set(pill, { opacity: 0, y: -10 });
            gsap.set(section, { backgroundColor: "#000" });
            gsap.set(object, { scale: 1, x: 0 });

            // Measured desktop pin distance = 3x viewport height. Mobile
            // was not part of the live measurement pass; the prior
            // provisional 3.2x ratio is kept until a mobile recapture.
            const pinDistance = () => window.innerHeight * (isDesktop ? 3 : 3.2);

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

            // Scroll-locked placeholder motion for the whole pin (stands in
            // for scrubbed video currentTime — see file header).
            tl.to(object, { rotateY: 360, rotateZ: isDesktop ? 25 : 15, ease: "none", duration: 100 }, 0);

            tl.to(heading, { opacity: 1, y: 0, duration: 12, ease: "power1.out" }, 8);
            tl.to(pill, { opacity: 1, y: 0, duration: 8, ease: "power1.out" }, 16);

            // Measured object scrub: holds until ~42.4, scales 1->0.78 and
            // translates ~-14.9% of viewport width, settles by ~56.3.
            if (isDesktop) {
              tl.to(object, {
                scale: 0.78,
                x: () => -window.innerWidth * 0.14875,
                duration: 13.9,
                ease: "power2.inOut",
              }, 42.4);
            }

            // Measured phrase-span stagger: spread across ~52-77.
            tl.to(phrases, {
              opacity: 1,
              y: 0,
              duration: 6,
              ease: "power1.out",
              stagger: { each: 3.83, from: "start" },
            }, 52);

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
        // leave heading/phrases/pill in their default, visible state
      }
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section className="v2-hero" id="top" ref={sectionRef}>
      <SiteHeader />
      <div ref={pillRef} className="v2-edition-pill">
        <span><sup>1</sup> {brand.editionLabel}</span>
        <a href="#close">{brand.buyLabel} →</a>
      </div>
      <div className="v2-hero-object-wrap">
        <HeroVisualSlot ref={objectRef} />
      </div>
      <h1 ref={headingRef} className="v2-hero-heading">{hero.eyebrow}</h1>
      <p className="v2-hero-body">
        {hero.bodyPhrases.map((phrase, i) => {
          const isAccent = typeof phrase === "object";
          const text = isAccent ? phrase.accent : phrase;
          return (
            <span key={i}>
              <span
                ref={(el) => { phraseRefs.current[i] = el; }}
                className={`v2-hero-phrase${isAccent ? " v2-accent" : ""}`}
              >
                {text}
              </span>
              {" "}
            </span>
          );
        })}
      </p>
    </section>
  );
}
