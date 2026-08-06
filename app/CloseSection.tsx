"use client";

import { useLayoutEffect, useRef } from "react";
import { loadGsap, prefersReducedMotion } from "./scroll/loadGsap";
import { showcase, pricing } from "./vantaCloneContent";

const TIMELINE_TOTAL = 100;

/**
 * "APPLIED" — one continuous section (confirmed by live measurement:
 * closeSection's document geometry contiguously contains the device demo,
 * both pricing tiers, and the testimonial with no gap between them). An
 * earlier build split this into two separate pinned scenes; the reference
 * treats it as a single scrolling unit, so this component merges what were
 * previously ShowcaseScene + PricingScene.
 *
 * Only the device-video region is sticky/pinned (measured: deviceVideo's
 * `top` holds constant for ~800px of scroll, matching its own element
 * height — a `position:sticky` signature, not a GSAP pin-spacer). The
 * pricing tiers, detail panel, and testimonial that follow are plain
 * scroll-linked reveals in normal document flow.
 */
export default function CloseSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const deviceRef = useRef<HTMLDivElement | null>(null);
  const tiersRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const testimonialRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    const heading = headingRef.current;
    const device = deviceRef.current;
    const tiers = tiersRef.current;
    const panel = panelRef.current;
    const testimonial = testimonialRef.current;
    if (!section || !heading || !device || !tiers || !panel || !testimonial) return;
    const tierCards = Array.from(tiers.children) as HTMLElement[];

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    (async () => {
      try {
        const { gsap, ScrollTrigger } = await loadGsap();
        if (cancelled) return;

        ctx = gsap.context(() => {
          gsap.set(heading, { opacity: 0, y: 20 });
          gsap.set(device, { opacity: 0, y: 60, rotateX: 25, scale: .92 });
          gsap.set(tierCards, { opacity: 0, y: 30 });
          gsap.set(panel, { opacity: 0, y: 20 });
          gsap.set(testimonial, { opacity: 0, y: 20 });

          // Device demo: sticky region, revealed/settled while pinned.
          const deviceTl = gsap.timeline({
            scrollTrigger: {
              trigger: device.parentElement,
              start: "top top",
              end: () => `+=${window.innerHeight * 0.85}`,
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });
          deviceTl.to(heading, { opacity: 1, y: 0, duration: 30, ease: "power1.out" }, 0);
          deviceTl.to(device, { opacity: 1, y: 0, rotateX: 0, scale: 1, duration: 60, ease: "power2.out" }, 20);
          deviceTl.set({}, {}, TIMELINE_TOTAL);

          // Pricing + testimonial: normal-flow reveal beneath the sticky device.
          const pricingTl = gsap.timeline({
            scrollTrigger: {
              trigger: tiers,
              start: "top 80%",
              end: "top 20%",
              scrub: 0.6,
            },
          });
          pricingTl.to(tierCards, { opacity: 1, y: 0, duration: 30, ease: "power1.out", stagger: { each: 8, from: "start" } }, 0);
          pricingTl.to(panel, { opacity: 1, y: 0, duration: 30, ease: "power1.out" }, 30);
          pricingTl.to(testimonial, { opacity: 1, y: 0, duration: 30, ease: "power1.out" }, 65);
          pricingTl.set({}, {}, TIMELINE_TOTAL);

          return () => {
            deviceTl.scrollTrigger?.kill();
            deviceTl.kill();
            pricingTl.scrollTrigger?.kill();
            pricingTl.kill();
          };
        }, section);
      } catch {
        // leave heading/device/tiers/panel/testimonial in their default, visible state
      }
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section className="v2-close" id="close" ref={sectionRef}>
      <div className="v2-close__device-region">
        <span className="v2-section-eyebrow v2-close__eyebrow">APPLIED</span>
        <h2 ref={headingRef} className="v2-close__heading">{showcase.heading}</h2>
        <div ref={deviceRef} className="v2-device" aria-hidden="true">
          <div className="v2-device__screen">
            <div className="v2-device__nav">
              <span /><span /><span />
            </div>
            <p className="v2-device__label">{showcase.deviceLabel}</p>
            <span className="v2-device__cta">{showcase.replayLabel}</span>
          </div>
          <div className="v2-device__base" />
        </div>
      </div>

      <div className="v2-close__pricing-region">
        <h2 className="v2-pricing__heading">{pricing.heading}</h2>

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
      </div>
    </section>
  );
}
