"use client";

import { useLayoutEffect, useRef } from "react";
import { loadGsap, prefersReducedMotion } from "./scroll/loadGsap";
import { pitch } from "./vantaCloneContent";

const TIMELINE_TOTAL = 100;

/**
 * §02 — diptych-style feature statement: heading + body copy at top, then a
 * three-card row (dark UI-mockup card, a center floating object with radar
 * rings, a second dark card) staggering in beneath it. Not pinned in the
 * reference — a plain scroll-linked reveal as the section enters view.
 */
export default function PitchScene() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const bodyRef = useRef<HTMLParagraphElement | null>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    const heading = headingRef.current;
    const body = bodyRef.current;
    const cards = cardRefs.current.filter((el): el is HTMLDivElement => el !== null);
    if (!section || !heading || !body || cards.length === 0) return;

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    (async () => {
      try {
        const { gsap, ScrollTrigger } = await loadGsap();
        if (cancelled) return;

        ctx = gsap.context(() => {
          gsap.set(heading, { opacity: 0, y: 24 });
          gsap.set(body, { opacity: 0, y: 16 });
          gsap.set(cards, { opacity: 0, y: 36 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
              end: "top 15%",
              scrub: 0.6,
            },
          });

          tl.to(heading, { opacity: 1, y: 0, duration: 30, ease: "power1.out" }, 0);
          tl.to(body, { opacity: 1, y: 0, duration: 30, ease: "power1.out" }, 12);
          tl.to(cards, { opacity: 1, y: 0, duration: 30, ease: "power1.out", stagger: { each: 10, from: "start" } }, 30);
          tl.set({}, {}, TIMELINE_TOTAL);

          return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
          };
        }, section);
      } catch {
        // leave heading/body/cards in their default, visible state
      }
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section className="v2-pitch" id="pitch" ref={sectionRef}>
      <div className="v2-pitch__top">
        <span className="v2-section-eyebrow">{pitch.section}</span>
        <h2 ref={headingRef} className="v2-pitch__heading">
          {pitch.headingPlain}<br /><span className="v2-accent">{pitch.headingAccent}</span>
        </h2>
        <p ref={bodyRef} className="v2-pitch__body">{pitch.body}</p>
      </div>

      <div className="v2-pitch__row">
        <div className="v2-pitch-card" ref={(el) => { cardRefs.current[0] = el; }}>
          <div className="v2-pitch-card__image v2-pitch-card__image--mock" aria-hidden="true">
            <span>Placeholder UI</span>
          </div>
          <div className="v2-pitch-card__text">
            <h3>{pitch.cards[0].title}</h3>
            <p>{pitch.cards[0].body}</p>
          </div>
        </div>

        <div className="v2-pitch-object-wrap" ref={(el) => { cardRefs.current[1] = el; }}>
          <div className="v2-pitch-object-rings" aria-hidden="true">
            <span /><span /><span />
          </div>
          <div className="v2-pitch-object" aria-hidden="true" />
          <div className="v2-pitch-object-tag">
            <small>{pitch.cards[1].tag}</small>
            <strong>{pitch.cards[1].code}</strong>
            <small>{pitch.cards[1].label}</small>
          </div>
        </div>

        <div className="v2-pitch-card" ref={(el) => { cardRefs.current[2] = el; }}>
          <div className="v2-pitch-card__image v2-pitch-card__image--portrait" aria-hidden="true">
            <span>Placeholder UI</span>
          </div>
          <div className="v2-pitch-card__text">
            <h3>{pitch.cards[2].title}</h3>
            <p>{pitch.cards[2].body}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
