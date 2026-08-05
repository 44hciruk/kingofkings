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
 * Hero: pinned for the length of the scroll-in, matching the reference's
 * long hero pin. While pinned: the centerpiece visual shifts from center
 * toward the left (desktop only — there's no room for that shift on
 * mobile), the prize and meta lines reveal with a staggered rise+fade, and
 * a full-bleed panel wipes up from the bottom over the final stretch,
 * covering the hero before the pin releases and the next section scrolls
 * up from underneath it — the reference's hero-to-next-section transition
 * is a color-block wipe, not a crossfade.
 *
 * The hero logo, prize amount, and date/venue are real, confirmed content
 * (see app/data.ts) and are already visible in the unconditional SSR
 * markup below; this effect only ever adds a temporary hidden/offset state
 * once GSAP has loaded, and only for prize/meta/visual, never the logo
 * itself. If GSAP fails to load, or prefers-reduced-motion is set, nothing
 * here runs and the hero simply renders in its final, fully visible state.
 */
export default function HeroScene() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const visualTrackRef = useRef<HTMLDivElement | null>(null);
  const prizeRef = useRef<HTMLDivElement | null>(null);
  const metaRef = useRef<HTMLDivElement | null>(null);
  const wipeRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const section = sectionRef.current;
    const visual = visualTrackRef.current;
    const prize = prizeRef.current;
    const meta = metaRef.current;
    const wipe = wipeRef.current;
    if (!section || !visual || !prize || !meta || !wipe) return;

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

            gsap.set([prize, meta], { opacity: 0, y: 28, force3D: true });
            gsap.set(wipe, { yPercent: 100, force3D: true });

            const pinDistance = () => window.innerHeight * (isDesktop ? 1.5 : 1.7);

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

            // 0-45%: visual drifts toward the left (desktop only) while
            // prize, then meta, rise in with a short overlap.
            if (isDesktop) {
              tl.to(visual, { xPercent: -32, duration: 45, ease: "power1.inOut" }, 0);
            }
            tl.to(prize, { opacity: 1, y: 0, duration: 20, ease: "power1.out" }, 8);
            tl.to(meta, { opacity: 1, y: 0, duration: 20, ease: "power1.out" }, 22);

            // 45-72%: hold on the settled hero.
            // 72-100%: wipe panel covers the hero before the pin releases.
            tl.to(wipe, { yPercent: 0, duration: 28, ease: "power2.inOut" }, 72);

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
    <section className="top" id="top" ref={sectionRef}>
      <div className="inner">
        <div className="kok-single-hero">
          <div ref={visualTrackRef} className="kok-hero-visual-track">
            <HeroVisualSlot />
          </div>
          <h1 className="kok-single-hero-title">
            <picture>
              <source media="(max-width: 767px)" srcSet="/assets/img/kok-hero-logo-mobile.svg" />
              <img width="3217" height="4026" src="/assets/img/kok-hero-logo-desktop.svg" alt="KING OF KINGS" />
            </picture>
          </h1>
          <div ref={prizeRef} className="kok-single-hero-prize" aria-label={`${eventMeta.prizeLabel} ${eventMeta.prizeAmount}円`}>
            <span>{eventMeta.prizeLabel}</span>
            <strong><small>¥</small>{eventMeta.prizeAmount}</strong>
          </div>
          <div ref={metaRef} className="kok-single-hero-meta">
            <span>{eventMeta.dateLabel}</span>
            <i aria-hidden="true" />
            <span>{eventMeta.venueName}</span>
          </div>
        </div>
      </div>
      <div ref={wipeRef} className="kok-hero-wipe" aria-hidden="true" />
    </section>
  );
}
