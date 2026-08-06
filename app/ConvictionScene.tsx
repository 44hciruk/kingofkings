"use client";

import { useLayoutEffect, useRef } from "react";
import { loadGsap, prefersReducedMotion } from "./scroll/loadGsap";
import { eventMeta, convictionCards } from "./data";

const TIMELINE_TOTAL = 100;

/**
 * Diptych feature statement: the reference's first post-hero scene always
 * pairs a large heading with two spatial cards, never bare text alone (the
 * previous BrandStatementScene attempt was bare text and is replaced here).
 * Pinned briefly: heading scales in first, then the two cards stagger in
 * left-then-right.
 */
export default function ConvictionScene() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const nameRef = useRef<HTMLHeadingElement | null>(null);
  const taglineRef = useRef<HTMLParagraphElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    const name = nameRef.current;
    const tagline = taglineRef.current;
    const cardsWrap = cardsRef.current;
    if (!section || !name || !tagline || !cardsWrap) return;
    const cards = Array.from(cardsWrap.querySelectorAll<HTMLElement>(".v-conviction__card"));
    if (cards.length === 0) return;

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    (async () => {
      try {
        const { gsap, ScrollTrigger } = await loadGsap();
        if (cancelled) return;

        ctx = gsap.context(() => {
          gsap.set(name, { opacity: 0, scale: 0.92, force3D: true });
          gsap.set(tagline, { opacity: 0, y: 20 });
          gsap.set(cards, { opacity: 0, y: 36, scale: 0.94, force3D: true });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top",
              pin: true,
              end: () => `+=${window.innerHeight * 1.3}`,
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });

          tl.to(name, { opacity: 1, scale: 1, duration: 22, ease: "power1.out" }, 0);
          tl.to(tagline, { opacity: 1, y: 0, duration: 18, ease: "power1.out" }, 16);
          tl.to(cards, {
            opacity: 1, y: 0, scale: 1, duration: 24, ease: "power1.out",
            stagger: { each: 14, from: "start" },
          }, 38);
          tl.set({}, {}, TIMELINE_TOTAL);

          return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
          };
        }, section);
      } catch {
        // leave heading and cards in their default, visible state
      }
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section className="v-conviction" id="conviction" ref={sectionRef}>
      <div className="v-conviction__inner">
        <h2 ref={nameRef} className="v-conviction__name">{eventMeta.name}</h2>
        <p ref={taglineRef} className="v-conviction__tagline">{eventMeta.tagline}</p>
        <div ref={cardsRef} className="v-conviction__cards">
          {convictionCards.map((card) => (
            <div className="v-conviction__card" key={card.label}>
              <strong>{card.label}</strong>
              <p>{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
