"use client";

import { useLayoutEffect } from "react";

const SECTION_ID = "players";
const LIST_SELECTOR = ".kok-player-list";
const CARD_SELECTOR = ".kok-player";
const HEADING_SELECTOR = ".kok-section-heading";
const FLOAT_SELECTOR = ".kok-player-float";
const FLIP_SELECTOR = ".kok-player-card";
// Timeline position units (arbitrary, not seconds): the trailing gsap.set at
// TIMELINE_TOTAL pads the timeline so scrub progress 0..1 maps linearly onto
// these same 0..100 numbers, giving an exact, predictable percent-of-scroll
// breakdown regardless of tween durations or stagger tails.
const TIMELINE_TOTAL = 100;

/**
 * Animates the PLAYERS cards from a loosely gathered, card-back-facing pose
 * into the existing grid position (5x2 on desktop, 3-4-3 on mobile) as the
 * section scrolls into view, flipping face-up partway through.
 *
 * Three separate elements carry three separate transforms, so none of them
 * ever compete for control of the same property on the same node:
 *   - article.kok-player   -> x/y/z/rotateZ/scale (position/spread only)
 *   - div.kok-player-float -> y/rotateZ (idle floating wobble only, while
 *                             the stack is gathered — see below)
 *   - div.kok-player-card  -> rotateY only (the flip only)
 *
 * The grid itself (CSS) is untouched: each card's resting position is
 * measured from the DOM, so the gathered pose is just an offset transform on
 * top of the normal layout, and both transforms converge back to their CSS
 * resting values (none / rotateY(180deg), i.e. "front showing") at the end.
 *
 * Renders nothing. The existing grid layout with the front face showing is
 * the default, unconditional state (see globals.css: .kok-player-card's
 * resting transform is rotateY(180deg), the "front" orientation) — this
 * effect only ever *adds* the gathered/back-facing pose on top of it, and
 * only once DOM lookup and GSAP both succeed. If #players / .kok-player-list
 * / .kok-player / .kok-player-card aren't found, if the gsap import rejects,
 * or if anything else throws, this exits without touching the DOM, so the
 * cards (and the player info in them) are never at risk of staying hidden
 * or stuck back-facing.
 */
export default function PlayersScrollReveal() {
  useLayoutEffect(() => {
    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotionQuery.matches) return;

    const section = document.getElementById(SECTION_ID);
    if (!section) return;

    const list = section.querySelector<HTMLElement>(LIST_SELECTOR);
    const cards = section.querySelectorAll<HTMLElement>(`${LIST_SELECTOR} ${CARD_SELECTOR}`);
    if (!list || cards.length === 0) return;

    // Optional: used to start the pin as soon as the heading is comfortably
    // in view rather than waiting for the whole section (which has a lot of
    // top padding) to reach the top of the viewport. Falls back to the
    // section itself if, for any reason, the heading isn't found.
    const heading = section.querySelector<HTMLElement>(HEADING_SELECTOR);

    const cardEls = Array.from(cards);
    const floatEls = cardEls
      .map((card) => card.querySelector<HTMLElement>(FLOAT_SELECTOR))
      .filter((el): el is HTMLElement => el !== null);
    const flipEls = cardEls
      .map((card) => card.querySelector<HTMLElement>(`${FLOAT_SELECTOR} ${FLIP_SELECTOR}`))
      .filter((el): el is HTMLElement => el !== null);
    if (floatEls.length !== cardEls.length || flipEls.length !== cardEls.length) return;

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    (async () => {
      try {
        const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
        if (cancelled) return;

        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          const mm = gsap.matchMedia();

          // Both conditions must be registered: gsap.matchMedia() only invokes
          // this callback when at least one named condition currently matches.
          // With only "isDesktop" registered, the callback was silently never
          // called at mobile widths (on first load *or* after a desktop-to-
          // mobile resize) because no condition was ever true there.
          mm.add({ isDesktop: "(min-width: 768px)", isMobile: "(max-width: 767px)" }, (context) => {
            const { isDesktop } = context.conditions as { isDesktop: boolean; isMobile: boolean };

            list.style.setProperty("--kok-player-flip-perspective", isDesktop ? "1300px" : "1900px");

            const listRect = list.getBoundingClientRect();
            const centerX = listRect.left + listRect.width / 2;
            // Gather anchor: X stays at the grid's true horizontal center,
            // but Y is biased toward the *top* of the grid (near the
            // heading) instead of its vertical center. That one change
            // does double duty: it's what puts the initial stack up near
            // PLAYERS instead of centered in the whole card area, and it's
            // what makes the expansion mostly downward — top-row cards
            // start close to this anchor (short travel), bottom-row cards
            // start far from it (long travel down).
            const gatherYFraction = isDesktop ? 0.16 : 0.14;
            const gatherY = listRect.top + listRect.height * gatherYFraction;

            // Tuned separately for desktop vs. mobile per project requirements.
            // spreadFactor close to 1 means the gathered pose sits almost
            // exactly at the gather anchor; the deliberately-small jitter/
            // rotationRange keep it reading as a "stack of cards" rather
            // than a single collapsed point, without looking "scattered".
            const spreadFactor = isDesktop ? 0.82 : 0.65;
            const rotationRange = isDesktop ? 3.5 : 2;
            const depthRange = isDesktop ? 46 : 24;
            const jitter = isDesktop ? 6 : 4;
            const scaleBase = isDesktop ? 0.82 : 0.87;

            // Position/spread pose for article.kok-player. No rotateY here —
            // that lives exclusively on .kok-player-card (the flip element).
            const initial = cardEls.map((card, i) => {
              const rect = card.getBoundingClientRect();
              const cx = rect.left + rect.width / 2;
              const cy = rect.top + rect.height / 2;
              const sign = i % 2 === 0 ? 1 : -1;
              const spreadX = (centerX - cx) * spreadFactor;
              const spreadY = (gatherY - cy) * spreadFactor;
              const jitterX = sign * jitter * (((i * 7) % 5) / 4);
              const jitterY = -sign * jitter * (((i * 3) % 5) / 4);
              const rotateZ = sign * rotationRange * (0.5 + ((i * 5) % 5) / 10);
              const z = -depthRange * (0.4 + (i % 4) / 4);
              const scale = scaleBase - (i % 3) * 0.012;
              return { x: spreadX + jitterX, y: spreadY + jitterY, rotateZ, z, scale };
            });

            // Only reached once DOM lookup + GSAP init succeeded, so it's safe
            // to move the cards away from their normal, visible layout here.
            gsap.set(cardEls, {
              x: (i) => initial[i].x,
              y: (i) => initial[i].y,
              rotateZ: (i) => initial[i].rotateZ,
              z: (i) => initial[i].z,
              scale: (i) => initial[i].scale,
              transformPerspective: 1600,
              force3D: true,
            });

            // Start the flip elements back-facing (rotateY:0). CSS's resting
            // value is 180deg (front); this is the only place JS ever moves
            // that away from 180, and the timeline below always returns it
            // there exactly.
            gsap.set(flipEls, { rotateY: 0, force3D: true });

            // Idle "floating" wobble on the gathered stack: a slow, small
            // up/down drift plus a faint tilt, on .kok-player-float — a
            // dedicated element separate from both article (spread) and
            // .kok-player-card (flip), so this loop never fights either of
            // them for control of the same transform property. Created once
            // (autoplaying) and only ever paused/played thereafter — never
            // re-created — so there is exactly one instance for this
            // breakpoint's lifetime; matchMedia's own revert-on-breakpoint-
            // change and the cleanup function below both kill it outright.
            const floatAmplitude = isDesktop ? 5.5 : 3;
            const floatTilt = isDesktop ? 0.75 : 0.35;
            const floatTween = gsap.to(floatEls, {
              y: `+=${floatAmplitude}`,
              rotateZ: `+=${floatTilt}`,
              duration: isDesktop ? 2.8 : 3.2,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
              stagger: { each: 0.15, from: "start" },
              force3D: true,
            });
            let floatActive = true;
            let floatSettleTween: gsap.core.Tween | null = null;

            // Longer pin + gentler scrub than the original tuning: the stack
            // now travels a much larger distance (spreadFactor is much
            // closer to 1, and starting the pin earlier — see `start` below
            // — means more of that travel happens on-screen), so the pin
            // needs more room for the spread/flip to read clearly and for
            // the finished grid to hold before releasing.
            const pinDistance = () => window.innerHeight * (isDesktop ? 1.35 : 1.2);

            const spreadStagger = isDesktop ? 2 : 1.5;
            const flipStagger = isDesktop ? 1.6 : 1.2;

            const tl = gsap.timeline({
              scrollTrigger: {
                // The section itself has a large top-padding before the
                // heading (shared with every other section), so "trigger:
                // section, start: top top" only fired once that padding had
                // already scrolled past — well after the heading (and the
                // gathered stack, now positioned right under it) was
                // already visible. Using the heading as the trigger instead
                // reacts to PLAYERS itself, not that padding.
                //
                // The "top X%" value is a compromise, not a free choice: on
                // desktop the finished 5x2 grid is ~711px tall on its own
                // (before heading/gap), so pinning with the heading much
                // below the top of the viewport leaves the bottom of the
                // grid cropped in the pinned view for the *entire* scroll
                // (pin locks the viewport framing, so nothing scrolls the
                // rest of the grid into view later). "top 10%"/"top 40%"
                // were chosen by measuring heading+gap+grid height against
                // common viewport heights so the finished grid fits (or
                // comes close) rather than firing the instant the heading
                // appears, which would crop it badly.
                trigger: heading ?? section,
                start: isDesktop ? "top 10%" : "top 40%",
                pin: section,
                end: () => `+=${pinDistance()}`,
                scrub: isDesktop ? 0.7 : 0.95,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            });

            // 0-15%: hold on the gathered, back-facing card stack.
            // 15-65%: spread article.kok-player out to its grid position.
            tl.to(
              cardEls,
              {
                x: 0,
                y: 0,
                rotateZ: 0,
                z: 0,
                scale: 1,
                duration: 50,
                ease: "power1.inOut",
                stagger: { each: spreadStagger, from: "start" },
              },
              15,
            );
            // 35-80%: flip .kok-player-card from back (0deg) to front (180deg),
            // overlapping the tail of the spread so cards turn face-up while
            // still finishing their move outward.
            tl.to(
              flipEls,
              {
                rotateY: 180,
                duration: 45,
                ease: "power1.inOut",
                stagger: { each: flipStagger, from: "start" },
                force3D: true,
              },
              35,
            );
            // 80-100%: hold on the settled grid, front-facing. Padding the
            // timeline to exactly TIMELINE_TOTAL makes the percentages above
            // match scroll progress 1:1, regardless of the tweens' own
            // durations/stagger tails.
            tl.set({}, {}, TIMELINE_TOTAL);

            // Pause (not kill) the float the moment real scroll progress
            // begins, easing it to neutral so the spread/flip take over
            // cleanly; resume it if the user scrolls back up to progress
            // ~0. floatTween itself is only ever played/paused here, never
            // re-created, so scrolling back and forth can't stack up
            // duplicate loops.
            const FLOAT_PROGRESS_THRESHOLD = 0.01;
            tl.eventCallback("onUpdate", () => {
              const progress = tl.progress();
              if (floatActive && progress > FLOAT_PROGRESS_THRESHOLD) {
                floatActive = false;
                // Pause first, *then* ease to neutral without `overwrite`:
                // overwrite:true would strip y/rotateZ off floatTween itself
                // (same targets, same properties, even while paused),
                // permanently breaking its ability to resume later.
                floatTween.pause();
                floatSettleTween?.kill();
                floatSettleTween = gsap.to(floatEls, { y: 0, rotateZ: 0, duration: 0.3 });
              } else if (!floatActive && progress <= FLOAT_PROGRESS_THRESHOLD) {
                floatActive = true;
                floatSettleTween?.kill();
                floatTween.play();
              }
            });

            return () => {
              tl.scrollTrigger?.kill();
              tl.kill();
              floatTween.kill();
              floatSettleTween?.kill();
            };
          });
        }, section);
      } catch {
        // GSAP failed to load or initialize: leave the cards exactly as
        // server-rendered (opacity:1, grid position, front face via CSS) —
        // nothing to undo.
      }
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return null;
}
