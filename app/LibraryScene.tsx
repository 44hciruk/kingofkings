"use client";

import { useLayoutEffect, useRef } from "react";
import { loadGsap, prefersReducedMotion } from "./scroll/loadGsap";
import { players, schedule, librarySceneStatement, PLAYER_COUNT } from "./data";

const TIMELINE_TOTAL = 100;

/**
 * "Library" scene: a perspective-tilted grid of player-roster tiles forms
 * in the background while a foreground schedule card and a factual
 * statement (standing in for the reference's testimonial, for which no
 * real quote exists) hold in front. Matches the reference's layered
 * background-forms / foreground-holds composition instead of a plain list.
 *
 * Every tile is the same neutral, non-identifiable placeholder — see
 * app/data.ts. The grid works for any PLAYER_COUNT.
 */
export default function LibraryScene() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const statementRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    const grid = gridRef.current;
    const card = cardRef.current;
    const statement = statementRef.current;
    if (!section || !grid || !card || !statement) return;
    const tiles = Array.from(grid.querySelectorAll<HTMLElement>(".v-library__tile"));
    if (tiles.length === 0) return;

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    (async () => {
      try {
        const { gsap, ScrollTrigger } = await loadGsap();
        if (cancelled) return;

        ctx = gsap.context(() => {
          gsap.set(tiles, { opacity: 0, scale: 0.7, force3D: true });
          gsap.set(card, { opacity: 0, y: 30 });
          gsap.set(statement, { opacity: 0, y: 20 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top",
              pin: true,
              end: () => `+=${window.innerHeight * 1.6}`,
              scrub: 0.65,
              invalidateOnRefresh: true,
            },
          });

          // 0-45%: tile grid fans in behind, staggered. Reference's own
          // library grid assembles in a scattered order, not row-by-row —
          // "random" reads closer to that than "start".
          tl.to(tiles, {
            opacity: 1, scale: 1, duration: 40, ease: "power1.out",
            stagger: { each: 2.6, from: "random", grid: "auto" },
          }, 0);
          // 40-65%: foreground schedule card holds in.
          tl.to(card, { opacity: 1, y: 0, duration: 20, ease: "power1.out" }, 42);
          // 62-82%: factual statement (testimonial-slot replacement).
          tl.to(statement, { opacity: 1, y: 0, duration: 18, ease: "power1.out" }, 64);
          tl.set({}, {}, TIMELINE_TOTAL);

          return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
          };
        }, section);
      } catch {
        // leave everything in its default, visible state
      }
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section className="v-library" id="players" ref={sectionRef}>
      <div ref={gridRef} className="v-library__grid" aria-hidden="true">
        {players.map((player) => (
          <div className="v-library__tile" key={player.no}>
            <img src={player.image} alt="" loading="lazy" />
          </div>
        ))}
      </div>
      <div className="v-library__foreground">
        <div ref={cardRef} className="v-library__card">
          <div className="v-library__card-header">
            <strong>{PLAYER_COUNT} PLAYERS.</strong> ONE LIBRARY OF CHALLENGERS.
          </div>
          <ul className="v-library__card-list">
            {schedule.map((item, index) => (
              <li key={item.time}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <time>{item.time}</time>
                <div>
                  <strong>{item.ja}</strong>
                  <small>{item.en}</small>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div ref={statementRef} className="v-library__statement">
          <span>{librarySceneStatement.eyebrow}</span>
          <p>{librarySceneStatement.body}</p>
        </div>
      </div>
    </section>
  );
}
