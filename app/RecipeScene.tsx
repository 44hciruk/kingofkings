"use client";

import { useLayoutEffect, useRef } from "react";
import { loadGsap, prefersReducedMotion } from "./scroll/loadGsap";
import { judgingCategories, scoringSummary } from "./data";

const TIMELINE_TOTAL = 100;

/**
 * "Recipe" scene: the confirmed JUDGING categories (TECHNICAL / PERFORMANCE
 * / FUTURE IMPACT) reveal one at a time in the same on-screen slot, each
 * replacing the previous rather than accumulating into a list — matching
 * the reference's interactive recipe/equation mechanic. Resolves into the
 * confirmed scoring-method line. The full six-category rule text stays
 * available in RulesDetails; this scene only re-stages the judging split.
 */
export default function RecipeScene() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const eyebrowRef = useRef<HTMLHeadingElement | null>(null);
  const rowRefs = useRef<Array<HTMLDivElement | null>>([]);
  const resultRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    const eyebrow = eyebrowRef.current;
    const result = resultRef.current;
    const rows = rowRefs.current.filter((el): el is HTMLDivElement => el !== null);
    if (!section || !eyebrow || !result || rows.length !== judgingCategories.length) return;

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    (async () => {
      try {
        const { gsap, ScrollTrigger } = await loadGsap();
        if (cancelled) return;

        ctx = gsap.context(() => {
          gsap.set(eyebrow, { opacity: 0, y: 16 });
          gsap.set(rows, { opacity: 0, y: 18 });
          gsap.set(result, { opacity: 0, y: 18 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top",
              pin: true,
              end: () => `+=${window.innerHeight * 1.8}`,
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });

          tl.to(eyebrow, { opacity: 1, y: 0, duration: 8, ease: "power1.out" }, 0);

          // Each row fades in, holds, then fades out just as the next one
          // fades in — a replace-in-place crossfade, not an accumulating list.
          const stepSpan = 24;
          rows.forEach((row, i) => {
            const start = 8 + i * stepSpan;
            tl.to(row, { opacity: 1, y: 0, duration: 8, ease: "power1.out" }, start);
            tl.to(row, { opacity: 0, y: -18, duration: 6, ease: "power1.in" }, start + stepSpan - 8);
          });

          const resultStart = 8 + rows.length * stepSpan;
          tl.to(result, { opacity: 1, y: 0, duration: 10, ease: "power1.out" }, resultStart);
          tl.set({}, {}, TIMELINE_TOTAL);

          return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
          };
        }, section);
      } catch {
        // leave eyebrow/rows/result in their default, visible state
      }
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section className="v-recipe" id="recipe" ref={sectionRef}>
      <div className="v-recipe__inner">
        <h2 ref={eyebrowRef} className="v-recipe__eyebrow">JUDGING</h2>
        <div className="v-recipe__stage">
          {judgingCategories.map((category, index) => (
            <div
              className="v-recipe__row"
              key={category.en}
              ref={(el) => { rowRefs.current[index] = el; }}
            >
              <span className="v-recipe__index">{String(index + 1).padStart(2, "0")}</span>
              <strong className="v-recipe__label">{category.en}</strong>
              <span className="v-recipe__judges">{category.judgeCount}</span>
              <p className="v-recipe__criteria">{category.criteria.join(" / ")}</p>
            </div>
          ))}
          <div ref={resultRef} className="v-recipe__row v-recipe__row--result">
            <p>{scoringSummary}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
