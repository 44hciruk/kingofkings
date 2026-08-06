"use client";

import { useLayoutEffect, useRef, type CSSProperties } from "react";
import { loadGsap, prefersReducedMotion } from "./scroll/loadGsap";
import { library } from "./vantaCloneContent";

const TIMELINE_TOTAL = 100;

/**
 * §03 — pinned tilted tile grid forms behind a foreground white metadata
 * panel (tabs + format/resolution/licensing rows + thumbnail grid), then
 * releases into a testimonial. Neutral abstract-shape placeholder tiles
 * stand in for the reference's own material renders.
 */
export default function LibrarySection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const testimonialRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    const heading = headingRef.current;
    const grid = gridRef.current;
    const panel = panelRef.current;
    const testimonial = testimonialRef.current;
    if (!section || !heading || !grid || !panel || !testimonial) return;
    const tiles = Array.from(grid.querySelectorAll<HTMLElement>(".v2-library__tile"));
    if (tiles.length === 0) return;

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    (async () => {
      try {
        const { gsap, ScrollTrigger } = await loadGsap();
        if (cancelled) return;

        ctx = gsap.context(() => {
          gsap.set(heading, { opacity: 0, y: 20 });
          gsap.set(tiles, { opacity: 0, scale: .7 });
          gsap.set(panel, { opacity: 0, y: 30 });
          gsap.set(testimonial, { opacity: 0, y: 20 });

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

          tl.to(heading, { opacity: 1, y: 0, duration: 10, ease: "power1.out" }, 0);
          tl.to(tiles, {
            opacity: 1, scale: 1, duration: 30, ease: "power1.out",
            stagger: { each: 1.2, from: "random", grid: "auto" },
          }, 8);
          tl.to(panel, { opacity: 1, y: 0, duration: 16, ease: "power1.out" }, 34);
          tl.to(heading, { opacity: 0, duration: 10, ease: "power1.in" }, 46);
          tl.to(panel, { opacity: 0, y: -20, duration: 10, ease: "power1.in" }, 66);
          tl.to(tiles, { opacity: 0, duration: 10, ease: "power1.in" }, 66);
          tl.to(testimonial, { opacity: 1, y: 0, duration: 16, ease: "power1.out" }, 74);
          tl.set({}, {}, TIMELINE_TOTAL);

          return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
          };
        }, section);
      } catch {
        // leave heading/tiles/panel/testimonial in their default visible state
      }
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  const tileCount = 40;

  return (
    <section className="v2-library" id="library" ref={sectionRef}>
      <div ref={gridRef} className="v2-library__grid" aria-hidden="true">
        {Array.from({ length: tileCount }, (_, i) => (
          <div className="v2-library__tile" key={i} style={{ "--i": i } as CSSProperties} />
        ))}
      </div>

      <div className="v2-library__foreground">
        <h2 ref={headingRef} className="v2-library__heading">
          {library.headingPlain}<br /><span className="v2-accent">{library.headingAccent}</span>
        </h2>

        <div ref={panelRef} className="v2-library__panel">
          <div className="v2-library__tabs">
            {library.tabs.map((tab, i) => (
              <span key={tab} className={i === 0 ? "is-active" : ""}>{tab}</span>
            ))}
          </div>
          <h3>{library.panelTitle}</h3>
          <dl className="v2-library__meta">
            {library.meta.map((row) => (
              <div key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>
            ))}
          </dl>
          <div className="v2-library__thumbs">
            {Array.from({ length: 30 }, (_, i) => <span key={i} />)}
          </div>
        </div>

        <div ref={testimonialRef} className="v2-testimonial">
          <div className="v2-testimonial__stars" aria-hidden="true">★★★★★ <span>5.0</span></div>
          <p><strong>{library.testimonial.quoteLead}</strong> {library.testimonial.quoteRest}</p>
          <div className="v2-testimonial__attr"><i /> {library.testimonial.name} · {library.testimonial.role}</div>
        </div>
      </div>
    </section>
  );
}
