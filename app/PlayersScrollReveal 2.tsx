"use client";

import { useLayoutEffect } from "react";

const SECTION_ID = "players";
const LIST_SELECTOR = ".kok-player-list";
const CARD_SELECTOR = ".kok-player";

/**
 * Animates the PLAYERS cards from a loosely gathered, centered pose into the
 * existing 3-4-3 grid position as the section scrolls into view. The grid
 * itself (CSS) is untouched: each card's resting position is measured from
 * the DOM, so the "gather" pose is just an offset transform on top of the
 * normal layout, and the animation converges back to zero at the end.
 *
 * Renders nothing. The existing 3-4-3 layout is the default, unconditional
 * state (opacity:1, no transform) — this effect only ever *adds* the
 * gathered pose on top of it, and only once DOM lookup and GSAP both
 * succeed. If #players / .kok-player-list / .kok-player aren't found, if the
 * gsap import rejects, or if anything else throws, this exits without
 * touching the DOM, so the cards are never at risk of staying hidden.
 */
export default function PlayersScrollReveal() {
  useLayoutEffect(() => {
    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotionQuery.matches) return;

    const section = document.getElementById(SECTION_ID);
    if (!section) return;

    const list = section.querySelector<HTMLElement>(LIST_SELECTOR);
    const cards = section.querySelectorAll<HTMLElement>(`${LIST_SELECTOR} ${CARD_SELECTOR}`);
    if (!list || cards.length === 0) return;

    const cardEls = Array.from(cards);
    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    (async () => {
      try {
        const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
        if (cancelled) return;

        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          const mm = gsap.matchMedia();

          mm.add({ isDesktop: "(min-width: 768px)" }, (context) => {
            const { isDesktop } = context.conditions as { isDesktop: boolean };

            const listRect = list.getBoundingClientRect();
            const centerX = listRect.left + listRect.width / 2;
            const centerY = listRect.top + listRect.height / 2;

            // Tuned separately for desktop vs. mobile per project requirements.
            const spreadFactor = isDesktop ? 0.34 : 0.22;
            const rotationRange = isDesktop ? 9 : 5;
            const tiltRange = isDesktop ? 4 : 2;
            const depthRange = isDesktop ? 34 : 16;
            const jitter = isDesktop ? 12 : 7;
            const scaleBase = isDesktop ? 0.91 : 0.94;

            const initial = cardEls.map((card, i) => {
              const rect = card.getBoundingClientRect();
              const cx = rect.left + rect.width / 2;
              const cy = rect.top + rect.height / 2;
              const sign = i % 2 === 0 ? 1 : -1;
              const spreadX = (centerX - cx) * spreadFactor;
              const spreadY = (centerY - cy) * spreadFactor;
              const jitterX = sign * jitter * (((i * 7) % 5) / 4);
              const jitterY = -sign * jitter * (((i * 3) % 5) / 4);
              const rotateZ = sign * rotationRange * (0.5 + ((i * 5) % 5) / 10);
              const rotateY = sign * tiltRange;
              const z = -depthRange * (0.4 + (i % 4) / 4);
              const scale = scaleBase - (i % 3) * 0.012;
              return { x: spreadX + jitterX, y: spreadY + jitterY, rotateZ, rotateY, z, scale };
            });

            // Only reached once DOM lookup + GSAP init succeeded, so it's safe
            // to apply the gathered pose here — this is the only place that
            // ever moves the cards away from their normal, visible layout.
            gsap.set(cardEls, {
              x: (i) => initial[i].x,
              y: (i) => initial[i].y,
              rotateZ: (i) => initial[i].rotateZ,
              rotateY: (i) => initial[i].rotateY,
              z: (i) => initial[i].z,
              scale: (i) => initial[i].scale,
              transformPerspective: 1600,
              force3D: true,
            });

            const pinDistance = () => window.innerHeight * (isDesktop ? 0.95 : 0.85);

            const tween = gsap.to(cardEls, {
              x: 0,
              y: 0,
              rotateZ: 0,
              rotateY: 0,
              z: 0,
              scale: 1,
              ease: "power1.out",
              stagger: { each: isDesktop ? 0.02 : 0.015, from: "start" },
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => `+=${pinDistance()}`,
                scrub: isDesktop ? 0.6 : 0.85,
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            });

            return () => {
              tween.scrollTrigger?.kill();
              tween.kill();
            };
          });
        }, section);
      } catch {
        // GSAP failed to load or initialize: leave the cards exactly as
        // server-rendered (opacity:1, no transform) — nothing to undo.
      }
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return null;
}
