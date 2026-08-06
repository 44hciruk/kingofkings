"use client";

import { useLayoutEffect, useRef } from "react";
import { loadGsap, prefersReducedMotion } from "./scroll/loadGsap";
import { eventMeta, venueImages } from "./data";

const TIMELINE_TOTAL = 100;

/**
 * Single showcase object: one framed panel that cycles the two confirmed
 * mowl OSAKA venue photographs via crossfade, matching the reference's
 * single-device/object showcase mechanic instead of AboutScene's static
 * two-up gallery. Venue name/address reveal alongside as the object holds.
 */
export default function ShowcaseScene() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const imageRefs = useRef<Array<HTMLImageElement | null>>([]);
  const nameRef = useRef<HTMLSpanElement | null>(null);
  const addressRef = useRef<HTMLParagraphElement | null>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    const frame = frameRef.current;
    const name = nameRef.current;
    const address = addressRef.current;
    const images = imageRefs.current.filter((el): el is HTMLImageElement => el !== null);
    if (!section || !frame || !name || !address || images.length !== venueImages.length) return;

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    (async () => {
      try {
        const { gsap, ScrollTrigger } = await loadGsap();
        if (cancelled) return;

        ctx = gsap.context(() => {
          gsap.set(frame, { opacity: 0, scale: 0.94, force3D: true });
          gsap.set(images.slice(1), { opacity: 0 });
          gsap.set(name, { opacity: 0, y: 14 });
          gsap.set(address, { opacity: 0, y: 14 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top",
              pin: true,
              end: () => `+=${window.innerHeight * 1.5}`,
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });

          tl.to(frame, { opacity: 1, scale: 1, duration: 16, ease: "power1.out" }, 0);
          tl.to(name, { opacity: 1, y: 0, duration: 10, ease: "power1.out" }, 16);
          // Crossfade image 0 -> image 1 inside the same frame.
          tl.to(images[0], { opacity: 0, duration: 10, ease: "power1.inOut" }, 42);
          tl.to(images[1], { opacity: 1, duration: 10, ease: "power1.inOut" }, 42);
          tl.to(address, { opacity: 1, y: 0, duration: 10, ease: "power1.out" }, 58);
          tl.set({}, {}, TIMELINE_TOTAL);

          return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
          };
        }, section);
      } catch {
        // leave frame/images/text in their default, visible state
      }
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section className="v-showcase" id="venue" ref={sectionRef}>
      <div className="v-showcase__inner">
        <div ref={frameRef} className="v-showcase__frame">
          {venueImages.map((image, index) => (
            <img
              key={image.src}
              ref={(el) => { imageRefs.current[index] = el; }}
              className="v-showcase__image"
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              loading="lazy"
            />
          ))}
        </div>
        <div className="v-showcase__meta">
          <span ref={nameRef} className="v-showcase__name">{eventMeta.venueNameJa}</span>
          <p ref={addressRef} className="v-showcase__address">{eventMeta.venueAddress}</p>
        </div>
      </div>
    </section>
  );
}
