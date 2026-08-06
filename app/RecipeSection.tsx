"use client";

import { useLayoutEffect, useRef } from "react";
import { loadGsap, prefersReducedMotion } from "./scroll/loadGsap";
import { recipe } from "./vantaCloneContent";

const TIMELINE_TOTAL = 100;

/**
 * §04 — warm gradient background (a genuine color shift, matching the
 * reference), heading + body copy, then a PROMPT + material = RESULT
 * equation row. Desktop shows all three side by side; mobile stacks them
 * (the reference uses a swipe carousel on mobile — approximated here as a
 * simple stacked reveal, a documented simplification).
 */
export default function RecipeSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const bodyRef = useRef<HTMLParagraphElement | null>(null);
  const rowRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    const heading = headingRef.current;
    const body = bodyRef.current;
    const row = rowRef.current;
    if (!section || !heading || !body || !row) return;
    const items = Array.from(row.children) as HTMLElement[];

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    (async () => {
      try {
        const { gsap, ScrollTrigger } = await loadGsap();
        if (cancelled) return;

        ctx = gsap.context(() => {
          gsap.set(heading, { opacity: 0, y: 20 });
          gsap.set(body, { opacity: 0, y: 16 });
          gsap.set(items, { opacity: 0, y: 24 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
              end: "top 10%",
              scrub: 0.6,
            },
          });

          tl.to(heading, { opacity: 1, y: 0, duration: 30, ease: "power1.out" }, 0);
          tl.to(body, { opacity: 1, y: 0, duration: 30, ease: "power1.out" }, 10);
          tl.to(items, { opacity: 1, y: 0, duration: 30, ease: "power1.out", stagger: { each: 8, from: "start" } }, 30);
          tl.set({}, {}, TIMELINE_TOTAL);

          return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
          };
        }, section);
      } catch {
        // leave heading/body/row in their default, visible state
      }
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section className="v2-recipe" id="recipe" ref={sectionRef}>
      <div className="v2-recipe__top">
        <span className="v2-section-eyebrow">{recipe.section}</span>
        <h2 ref={headingRef} className="v2-recipe__heading">
          {recipe.headingLines.map((line, i) => (
            <span key={line}>{i === 1 ? <span className="v2-accent">{line}</span> : line}<br /></span>
          ))}
        </h2>
        <p ref={bodyRef} className="v2-recipe__body">{recipe.body}</p>
      </div>

      <div ref={rowRef} className="v2-recipe__row">
        <div className="v2-recipe__card v2-recipe__card--prompt">
          <small>PROMPT</small>
          <p>{recipe.prompt}</p>
        </div>
        <span className="v2-recipe__op" aria-hidden="true">+</span>
        <div className="v2-recipe__material" aria-hidden="true" />
        <span className="v2-recipe__op" aria-hidden="true">=</span>
        <div className="v2-recipe__card v2-recipe__card--result">
          <small>RESULT</small>
          <div className="v2-recipe__result-image" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
