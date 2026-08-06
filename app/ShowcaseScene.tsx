"use client";

import { useLayoutEffect, useRef } from "react";
import { loadGsap, prefersReducedMotion } from "./scroll/loadGsap";
import { showcase } from "./vantaCloneContent";

const TIMELINE_TOTAL = 100;

/**
 * Device showcase: a transitional "APPLIED" heading, then a laptop-shaped
 * object opens/tilts into view with placeholder screen content — matching
 * the reference's own device-showcase beat between Recipe and Pricing.
 * The laptop is a CSS placeholder (screen + keyboard-base shapes), standing
 * in for the reference's own product-mockup render.
 */
export default function ShowcaseScene() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const deviceRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    const heading = headingRef.current;
    const device = deviceRef.current;
    if (!section || !heading || !device) return;

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    (async () => {
      try {
        const { gsap, ScrollTrigger } = await loadGsap();
        if (cancelled) return;

        ctx = gsap.context(() => {
          gsap.set(heading, { opacity: 0, y: 20 });
          gsap.set(device, { opacity: 0, y: 60, rotateX: 25, scale: .92 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top",
              pin: true,
              end: () => `+=${window.innerHeight * 1.4}`,
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });

          tl.to(heading, { opacity: 1, y: 0, duration: 20, ease: "power1.out" }, 0);
          tl.to(heading, { opacity: 0, y: -20, duration: 16, ease: "power1.in" }, 30);
          tl.to(device, { opacity: 1, y: 0, rotateX: 0, scale: 1, duration: 40, ease: "power2.out" }, 30);
          tl.set({}, {}, TIMELINE_TOTAL);

          return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
          };
        }, section);
      } catch {
        // leave heading/device in their default, visible state
      }
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section className="v2-showcase" id="showcase" ref={sectionRef}>
      <span className="v2-section-eyebrow v2-showcase__eyebrow">APPLIED</span>
      <h2 ref={headingRef} className="v2-showcase__heading">{showcase.heading}</h2>
      <div ref={deviceRef} className="v2-device" aria-hidden="true">
        <div className="v2-device__screen">
          <div className="v2-device__nav">
            <span /><span /><span />
          </div>
          <p className="v2-device__label">{showcase.deviceLabel}</p>
          <span className="v2-device__cta">Try it now</span>
        </div>
        <div className="v2-device__base" />
      </div>
    </section>
  );
}
