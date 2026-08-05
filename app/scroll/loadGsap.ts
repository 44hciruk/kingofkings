"use client";

// Centralized, lazy-loaded GSAP + ScrollTrigger access. gsap.registerPlugin
// is idempotent, but every scene importing "gsap"/"gsap/ScrollTrigger"
// directly would still duplicate the dynamic import and defeat the point of
// code-splitting it out of the initial bundle. Scenes call loadGsap() and
// share this one cached promise instead.
type GsapModule = typeof import("gsap")["default"];
type ScrollTriggerModule = typeof import("gsap/ScrollTrigger")["ScrollTrigger"];

let cached: Promise<{ gsap: GsapModule; ScrollTrigger: ScrollTriggerModule }> | null = null;

export function loadGsap() {
  if (!cached) {
    cached = Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([gsapModule, scrollTriggerModule]) => {
        const gsap = gsapModule.default;
        const { ScrollTrigger } = scrollTriggerModule;
        gsap.registerPlugin(ScrollTrigger);
        return { gsap, ScrollTrigger };
      },
    );
  }
  return cached;
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
