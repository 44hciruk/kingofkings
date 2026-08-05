"use client";

import { useLayoutEffect, useRef } from "react";
import { loadGsap, prefersReducedMotion } from "./scroll/loadGsap";
import HeroVisualSlot from "./HeroVisualSlot";
import { eventMeta } from "./data";

// Timeline position units (arbitrary, not seconds) — the trailing gsap.set
// at TIMELINE_TOTAL pads the timeline so scrub progress 0..1 maps linearly
// onto these same 0..100 numbers, mirroring PlayersScrollReveal's approach.
const TIMELINE_TOTAL = 100;

/**
 * Hero, rebuilt against the reference's actual composition: the centerpiece
 * visual sits BEHIND the text (not beside it) and drifts from center toward
 * the left third as content reveals in five progressive fragments — logo,
 * prize label, prize amount, date, venue — rather than two blocks. The pin
 * releases into a fast, near-instant color-block wipe (a small fraction of
 * the timeline), not a slow fade, matching the reference's abrupt cut.
 */
export default function HeroScene() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const visualTrackRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLHeadingElement | null>(null);
  const prizeLabelRef = useRef<HTMLSpanElement | null>(null);
  const prizeAmountRef = useRef<HTMLElement | null>(null);
  const dateRef = useRef<HTMLSpanElement | null>(null);
  const venueRef = useRef<HTMLSpanElement | null>(null);
  const wipeRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const section = sectionRef.current;
    const visual = visualTrackRef.current;
    const logo = logoRef.current;
    const prizeLabel = prizeLabelRef.current;
    const prizeAmount = prizeAmountRef.current;
    const date = dateRef.current;
    const venue = venueRef.current;
    const wipe = wipeRef.current;
    if (!section || !visual || !logo || !prizeLabel || !prizeAmount || !date || !venue || !wipe) return;

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

            gsap.set(logo, { opacity: 0, y: 24 });
            gsap.set([prizeLabel, prizeAmount, date, venue], { opacity: 0, y: 18 });
            gsap.set(wipe, { yPercent: 100, force3D: true });

            const pinDistance = () => window.innerHeight * (isDesktop ? 1.6 : 1.8);

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: "top top",
                pin: true,
                end: () => `+=${pinDistance()}`,
                scrub: isDesktop ? 0.6 : 0.85,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            });

            // Visual drifts center -> left third across nearly the whole
            // pin (desktop only — no room for the shift on mobile).
            if (isDesktop) {
              tl.to(visual, { xPercent: -34, duration: 78, ease: "power1.inOut" }, 0);
            }

            // Five progressive fragments: logo, prize label, amount, date,
            // venue — each a short, separate beat rather than two blocks.
            tl.to(logo, { opacity: 1, y: 0, duration: 10, ease: "power1.out" }, 4);
            tl.to(prizeLabel, { opacity: 1, y: 0, duration: 8, ease: "power1.out" }, 16);
            tl.to(prizeAmount, { opacity: 1, y: 0, duration: 10, ease: "power1.out" }, 25);
            tl.to(date, { opacity: 1, y: 0, duration: 8, ease: "power1.out" }, 38);
            tl.to(venue, { opacity: 1, y: 0, duration: 8, ease: "power1.out" }, 46);

            // Hold on the settled hero, then a fast, near-instant wipe
            // (small fraction of the timeline) covers it just before the
            // pin releases.
            tl.to(wipe, { yPercent: 0, duration: 9, ease: "power4.in" }, 88);
            tl.set({}, {}, TIMELINE_TOTAL);

            return () => {
              tl.scrollTrigger?.kill();
              tl.kill();
            };
          });
        }, section);
      } catch {
        // GSAP failed to load or initialize: leave the hero exactly as
        // server-rendered (fully visible, no wipe) — nothing to undo.
      }
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section className="v-hero" id="top" ref={sectionRef}>
      <div ref={visualTrackRef} className="v-hero__visual-track">
        <HeroVisualSlot />
      </div>
      <div className="v-hero__content">
        <h1 ref={logoRef} className="v-hero__logo">
          <picture>
            <source media="(max-width: 767px)" srcSet="/assets/img/kok-hero-logo-mobile.svg" />
            <img width="3217" height="4026" src="/assets/img/kok-hero-logo-desktop.svg" alt="KING OF KINGS" />
          </picture>
        </h1>
        <div className="v-hero__prize" aria-label={`${eventMeta.prizeLabel} ${eventMeta.prizeAmount}円`}>
          <span ref={prizeLabelRef} className="v-hero__prize-label">{eventMeta.prizeLabel}</span>
          <strong ref={prizeAmountRef} className="v-hero__prize-amount"><small>¥</small>{eventMeta.prizeAmount}</strong>
        </div>
        <div className="v-hero__meta">
          <span ref={dateRef} className="v-hero__meta-date">{eventMeta.dateLabel}</span>
          <i aria-hidden="true" />
          <span ref={venueRef} className="v-hero__meta-venue">{eventMeta.venueName}</span>
        </div>
      </div>
      <div ref={wipeRef} className="v-hero__wipe" aria-hidden="true" />
    </section>
  );
}
