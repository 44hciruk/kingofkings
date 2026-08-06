"use client";

import { useLayoutEffect, useRef } from "react";
import { loadGsap, prefersReducedMotion } from "./scroll/loadGsap";
import { pricing } from "./vantaCloneContent";

const TIMELINE_TOTAL = 100;

/**
 * "Two ways in" — two pricing tier cards (one purchase, one free), then a
 * detail panel with a feature list and CTA, resolving into a second
 * testimonial. Light purple/glow background, matching the reference's own
 * color shift for this section.
 */
export default function PricingScene() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const tiersRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const testimonialRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    const heading = headingRef.current;
    const tiers = tiersRef.current;
    const panel = panelRef.current;
    const testimonial = testimonialRef.current;
    if (!section || !heading || !tiers || !panel || !testimonial) return;
    const tierCards = Array.from(tiers.children) as HTMLElement[];

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    (async () => {
      try {
        const { gsap, ScrollTrigger } = await loadGsap();
        if (cancelled) return;

        ctx = gsap.context(() => {
          gsap.set(heading, { opacity: 0, y: 20 });
          gsap.set(tierCards, { opacity: 0, y: 30 });
          gsap.set(panel, { opacity: 0, y: 20 });
          gsap.set(testimonial, { opacity: 0, y: 20 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top",
              pin: true,
              end: () => `+=${window.innerHeight * 1.6}`,
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });

          tl.to(heading, { opacity: 1, y: 0, duration: 12, ease: "power1.out" }, 0);
          tl.to(tierCards, { opacity: 1, y: 0, duration: 16, ease: "power1.out", stagger: { each: 8, from: "start" } }, 10);
          tl.to(heading, { opacity: 0, duration: 8, ease: "power1.in" }, 34);
          tl.to(tierCards, { opacity: 0, y: -20, duration: 8, ease: "power1.in" }, 34);
          tl.to(panel, { opacity: 1, y: 0, duration: 16, ease: "power1.out" }, 44);
          tl.to(panel, { opacity: 0, y: -20, duration: 10, ease: "power1.in" }, 72);
          tl.to(testimonial, { opacity: 1, y: 0, duration: 14, ease: "power1.out" }, 82);
          tl.set({}, {}, TIMELINE_TOTAL);

          return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
          };
        }, section);
      } catch {
        // leave heading/tiers/panel/testimonial in their default visible state
      }
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section className="v2-pricing" id="pricing" ref={sectionRef}>
      <h2 ref={headingRef} className="v2-pricing__heading">{pricing.heading}</h2>

      <div ref={tiersRef} className="v2-pricing__tiers">
        {pricing.tiers.map((tier) => (
          <div className={`v2-pricing__tier${tier.featured ? " is-featured" : ""}`} key={tier.name}>
            <div className="v2-testimonial__stars" aria-hidden="true">★★★★★ <span>{tier.featured ? "5.0" : "4.9"}</span></div>
            <h3>{tier.name}</h3>
            <p className="v2-pricing__price">{tier.price}</p>
          </div>
        ))}
      </div>

      <div ref={panelRef} className="v2-pricing__panel">
        <h3>{pricing.panelTitle}</h3>
        <p>{pricing.panelSubtitle}</p>
        <ul>
          {pricing.features.map((f) => <li key={f}>{f}</li>)}
        </ul>
        <a href="#" className="v2-pricing__cta">{pricing.cta}</a>
      </div>

      <div ref={testimonialRef} className="v2-testimonial v2-testimonial--pricing">
        <p>{pricing.testimonial.quote}</p>
        <div className="v2-testimonial__attr"><i /> {pricing.testimonial.name} · {pricing.testimonial.role}</div>
      </div>
    </section>
  );
}
