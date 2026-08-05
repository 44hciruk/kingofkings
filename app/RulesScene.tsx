"use client";

import { useLayoutEffect, useRef } from "react";
import { loadGsap, prefersReducedMotion } from "./scroll/loadGsap";
import { CardCornerMarks, SectionHeading } from "./ui";
import { eventMeta } from "./data";
import { ruleCategories } from "./rulesContent";
import RulesDetails from "./RulesDetails";

const TIMELINE_TOTAL = 100;

/**
 * RULES: a short pinned scene states the six rule categories one after
 * another (matching the reference's pattern of revealing short labels in
 * sequence while pinned), then releases into RulesDetails — an ordinary,
 * always-present accordion carrying the full confirmed rule text, so
 * nothing is ever hidden behind the animation, only summarized first.
 */
export default function RulesScene() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const chipsRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    const chips = chipsRef.current;
    if (!section || !chips) return;
    const chipEls = Array.from(chips.querySelectorAll<HTMLElement>(".kok-rule-chip"));
    if (chipEls.length === 0) return;

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    (async () => {
      try {
        const { gsap, ScrollTrigger } = await loadGsap();
        if (cancelled) return;

        ctx = gsap.context(() => {
          gsap.set(chipEls, { opacity: 0, y: 26 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top",
              pin: true,
              end: () => `+=${window.innerHeight * 1.2}`,
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });

          tl.to(chipEls, {
            opacity: 1,
            y: 0,
            duration: 12,
            ease: "power1.out",
            stagger: { each: 10, from: "start" },
          }, 10);
          tl.set({}, {}, TIMELINE_TOTAL);

          return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
          };
        }, section);
      } catch {
        // leave chips in their default, visible state
      }
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section className="rules" id="rules" ref={sectionRef}>
      <div className="inner">
        <SectionHeading en="RULES" ja="大会ルール" />
        <div className="img kok-rule-board kok-section-card" data-label="RULES">
          <CardCornerMarks />
          <div className="kok-rule-intro">
            <span>OFFICIAL RULE GUIDE</span>
            <h3>{eventMeta.tagline}</h3>
            <p>{eventMeta.taglineDetail}</p>
          </div>
          <div ref={chipsRef} className="kok-rule-chips">
            {ruleCategories.map((rule) => (
              <div className="kok-rule-chip" key={rule.no}>
                <span>{rule.no}</span>
                <strong>{rule.ja}</strong>
                <small>{rule.en}</small>
              </div>
            ))}
          </div>
          <RulesDetails />
        </div>
      </div>
    </section>
  );
}
