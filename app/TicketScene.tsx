"use client";

import { useLayoutEffect, useRef } from "react";
import { loadGsap, prefersReducedMotion } from "./scroll/loadGsap";
import { eventMeta, ticket } from "./data";

const TIMELINE_TOTAL = 100;

/**
 * Pricing/CTA scene: a short confirmed date+venue bridge line leads into a
 * single ticket card that scales and glows in — the reference's pricing
 * entrance, adapted to one real card instead of inventing a second tier.
 */
export default function TicketScene() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const bridgeRef = useRef<HTMLParagraphElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    const bridge = bridgeRef.current;
    const card = cardRef.current;
    if (!section || !bridge || !card) return;

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    (async () => {
      try {
        const { gsap, ScrollTrigger } = await loadGsap();
        if (cancelled) return;

        ctx = gsap.context(() => {
          gsap.set(bridge, { opacity: 0, y: 16 });
          gsap.set(card, { opacity: 0, scale: 0.88, force3D: true });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
              end: "top 25%",
              scrub: 0.6,
            },
          });

          tl.to(bridge, { opacity: 1, y: 0, duration: 30, ease: "power1.out" }, 0);
          // The card's glow is a static CSS box-shadow; animating its own
          // opacity/scale in is enough to make the glow read as "entering"
          // without tweening a boxShadow string (unreliable to interpolate).
          tl.to(card, {
            opacity: 1,
            scale: 1,
            duration: 50,
            ease: "back.out(1.6)",
          }, 25);
          tl.set({}, {}, TIMELINE_TOTAL);

          return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
          };
        }, section);
      } catch {
        // leave bridge/card in their default, visible state
      }
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section className="v-ticket" id="ticket" ref={sectionRef}>
      <div className="v-ticket__inner">
        <p ref={bridgeRef} className="v-ticket__bridge">{eventMeta.dateLabel} — {eventMeta.venueName}</p>
        <div ref={cardRef} className="v-ticket__card">
          <p className="v-ticket__label">{ticket.label}</p>
          <h3 className="v-ticket__headline">{ticket.headline}</h3>
          <p className="v-ticket__copy">{ticket.body}</p>
          <a className="v-ticket__cta" href={eventMeta.ticketUrl} target="_blank" rel="noreferrer">
            {ticket.ctaLabel}<span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
