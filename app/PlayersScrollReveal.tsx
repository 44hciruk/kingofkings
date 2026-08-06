"use client";

import { useLayoutEffect } from "react";

const SECTION_ID = "players";
const PIN_SHELL_SELECTOR = ".kok-ticket-players-pin-shell";
const STAGE_SELECTOR = ".kok-ticket-players-stage";
const HEADING_SELECTOR = "#players-heading";
const PANEL_SELECTOR = ".kok-ticket-panel";
const LIST_SELECTOR = ".kok-player-list";
const CARD_SELECTOR = ".kok-player";
const FLOAT_SELECTOR = ".kok-player-float";
const FLIP_SELECTOR = ".kok-player-card";
// Timeline position units (arbitrary, not seconds): the trailing gsap.set at
// timelineTotal (computed per breakpoint below) pads the timeline so scrub
// progress 0..1 maps linearly onto these same 0..N numbers, giving an exact,
// predictable percent-of-scroll breakdown regardless of tween durations or
// stagger tails.

/**
 * Pin target and moving target are deliberately DIFFERENT elements:
 *   - .kok-ticket-players-pin-shell -> the ScrollTrigger trigger AND pin.
 *     A plain wrapper, never given a transform of its own, so its frozen
 *     screen position is stable and never fights with the stage's own
 *     y-shift below.
 *   - .kok-ticket-players-stage    -> holds the visible TICKET panel, the
 *     fixed CSS gap, the PLAYERS heading, and the card area as siblings.
 *     Gets a single y transform driven by the same main timeline as the
 *     card spread, so the whole composition — TICKET panel, PLAYERS
 *     heading, and cards together — visibly moves upward while the cards
 *     expand, instead of sitting frozen at the pin's initial position.
 * Putting a moving transform on the SAME element GSAP pins was tried
 * earlier (for a different, now-reverted purpose) and is a mistake to
 * repeat: ScrollTrigger's pin logic and an ordinary tween both drive
 * `transform` on the pinned element, and they fight. Splitting pin (shell)
 * from motion (stage) avoids that entirely, the same way giving trigger and
 * pin the same element (both are the shell here) avoids the separate GSAP
 * pin-position bug documented below.
 *
 * Four elements carry four separate transforms, so none ever compete for
 * control of the same property on the same node:
 *   - div.kok-ticket-players-stage -> y only (whole-composition upward
 *                             shift, synced with the card spread)
 *   - div.kok-player-float -> x/y/rotateZ (each card's own independent,
 *                             never-paused idle float — see below)
 *   - article.kok-player   -> x/y/z/rotateZ/scale (gather -> spread only)
 *   - div.kok-player-card  -> rotateY only (the flip only)
 * .kok-player-list itself carries no transform of its own — it is CSS Grid
 * and card placement only.
 *
 * trigger and pin are the SAME element (the pin shell). Using a different
 * element as trigger than the one being pinned was tried and hits a real
 * GSAP bug: the pinned element's frozen screen position does not match its
 * own natural (unpinned) position at the trigger's start scroll point,
 * putting the whole composition well off-screen at the exact moment it
 * should appear. Matching trigger to pin avoids this entirely.
 *
 * The grid itself (CSS) is untouched: each card's resting position is
 * measured from the DOM, so the gathered pose is just an offset transform on
 * top of the normal layout, and both transforms converge back to their CSS
 * resting values (none / rotateY(180deg), i.e. "front showing") at the end.
 *
 * Renders nothing. The existing grid layout with the front face showing is
 * the default, unconditional state (see globals.css: .kok-player-card's
 * resting transform is rotateY(180deg), the "front" orientation) — this
 * effect only ever *adds* the gathered/back-facing pose and the stage
 * y-shift on top of it, and only once every required element is found and
 * GSAP loads successfully. If the pin shell / stage / heading /
 * .kok-player-list / any .kok-player / .kok-player-card aren't found, or the
 * gsap import rejects, this exits without touching the DOM or pinning
 * anything, so the cards are never at risk of staying hidden, stuck
 * back-facing, or pinned in a broken layout.
 */
export default function PlayersScrollReveal() {
  useLayoutEffect(() => {
    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotionQuery.matches) return;

    const section = document.getElementById(SECTION_ID);
    if (!section) return;

    const pinShellEl = section.querySelector<HTMLElement>(PIN_SHELL_SELECTOR);
    const stageEl = section.querySelector<HTMLElement>(STAGE_SELECTOR);
    const heading = section.querySelector<HTMLElement>(HEADING_SELECTOR);
    const list = section.querySelector<HTMLElement>(LIST_SELECTOR);
    const cards = section.querySelectorAll<HTMLElement>(`${LIST_SELECTOR} ${CARD_SELECTOR}`);
    // Every one of these is required. There is no fallback to pinning
    // section#players, or any other element, if one of them is missing.
    // Missing any required element means: do nothing, leave the normal CSS
    // grid (and normal TICKET/PLAYERS document flow) exactly as-is.
    if (!pinShellEl || !stageEl || !heading || !list || cards.length === 0) return;

    const cardEls = Array.from(cards);
    const flipEls = cardEls
      .map((card) => card.querySelector<HTMLElement>(FLIP_SELECTOR))
      .filter((el): el is HTMLElement => el !== null);
    const floatEls = cardEls
      .map((card) => card.querySelector<HTMLElement>(FLOAT_SELECTOR))
      .filter((el): el is HTMLElement => el !== null);
    if (flipEls.length !== cardEls.length || floatEls.length !== cardEls.length) return;

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

            const listRect = list.getBoundingClientRect();
            const centerX = listRect.left + listRect.width / 2;

            // Gather anchor: X stays at the grid's true horizontal center;
            // Y is derived from the heading's own measured bottom edge (not
            // a guessed fraction) so the stack sits a fixed, deliberate gap
            // below "出場選手" regardless of heading size or viewport width.
            // gatherY is the target *center* for gathered cards, so half a
            // (scaled) card height is added on top of the gap so the card's
            // *top* edge — not its center — clears the heading by that gap.
            const headingGap = isDesktop ? 88 : 72;
            const sampleCardHeight = cardEls[0].getBoundingClientRect().height;
            const gatherY = heading.getBoundingClientRect().bottom + headingGap + (sampleCardHeight * scaleBase) / 2;

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

            // Trimmed from 1.5/1.35: with the old multiplier + a full
            // TIMELINE_TOTAL=100 tail hold, the last few percent of pin
            // distance were pure "nothing is changing" scroll before RULES
            // could appear — measured (Playwright, stepping 10px at a time
            // until every animated transform stopped changing) at ~1190px
            // of ~1350px pin distance on desktop, ~900px of ~1139px on
            // mobile. These smaller multipliers plus the smaller
            // timelineTotal below reallocate more of the same *feel* of
            // scroll gesture to the actual animation and leave only a
            // small settle buffer at the end.
            const pinDistance = () => window.innerHeight * (isDesktop ? 1.3 : 1.15);
            const spreadStagger = isDesktop ? 2 : 1.5;
            const flipStagger = isDesktop ? 1.6 : 1.2;
            // Timeline's own total duration (was the shared TIMELINE_TOTAL
            // constant = 100 for both breakpoints). Measured animation
            // convergence sits at ~88% of the old total on desktop, ~79% on
            // mobile (see pinDistance comment above) — these give each
            // breakpoint a ~5-6 point settle buffer past that instead of
            // the old ~11-20 point one, without touching any tween's own
            // start position or duration.
            const timelineTotal = isDesktop ? 93 : 84;

            // The stage (TICKET panel + gap + PLAYERS heading + card area)
            // is much taller than any real viewport — measured ~1381px on a
            // 900px-tall desktop screen, ~931px on an 844px-tall phone — so
            // "pin the instant the stage's own top crosses some % of the
            // viewport" (what a plain "top X%" start does) freezes the wrong
            // window: mostly blank space, with the heading and card bundle
            // still off-screen below. The goal per spec isn't showing the
            // *entire* panel — only enough of its bottom to read as
            // continuous with PLAYERS below it — so start is computed
            // numerically: fire once the stage has scrolled up by (its own
            // panel height minus a fixed "keep this many px of the panel
            // visible" budget), which pins with the panel's bottom portion,
            // the full heading, and the full initial card bundle all inside
            // the viewport together. Budgets were measured against the
            // shortest realistic viewports (800px desktop, 667px phones) to
            // guarantee the heading + bundle never get pushed off-screen.
            // Raised from 120/220: measured that with the old budget, the
            // gathered bundle scrolls into view (ordinary scroll, before pin
            // ever engages — cards track their gather offset continuously
            // regardless of pin state) well before the pin/progress starts
            // advancing, so the user sees the static bundle arrive, then
            // has to keep scrolling through a dead zone before it reacts.
            // Firing earlier closes that gap — see report for the measured
            // before/after timeline-progress-at-bundle-visible numbers.
            const visiblePanelPortion = isDesktop ? 260 : 360;
            const panelEl = section.querySelector<HTMLElement>(PANEL_SELECTOR);

            // How far, in px, the pin's start point sits below the shell's
            // own natural top — same quantity the "start" callback below
            // uses. Factored out because computeStageShiftY() needs the
            // same number to reconstruct the frozen (pre-shift) screen
            // position of the heading and the grid.
            const pinStartOffset = () => {
              const panelHeight = panelEl ? panelEl.getBoundingClientRect().height : 0;
              return panelHeight - visiblePanelPortion;
            };

            const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

            // How far up (px, negative) to translate .kok-ticket-players-stage
            // so the frozen composition reads as centered rather than
            // bottom-heavy. Measured from the DOM — not a guessed constant —
            // every time this runs (tween init + each ScrollTrigger refresh,
            // via invalidateOnRefresh below; never per scroll frame).
            //
            // At the instant the pin engages (before any stage shift is
            // applied), the shell's top lands exactly at viewport y=0 minus
            // pinStartOffset() (that's what the "start" callback's
            // `top+=offset top` produces). Everything else in the stage is
            // normal document flow below the shell's top, so its own
            // pre-shift screen position is just that same offset plus its
            // measured distance from the stage's top — independent of
            // wherever the page actually happens to be scrolled to right
            // now, since only the *difference* between two rects is used.
            //
            // Two goals pull in the same direction (both want a bigger
            // upward shift) but hit different limits, and the fixed
            // heading-to-grid gap (kept as-is per spec) means they can't
            // both be satisfied exactly at once on every viewport:
            //   - primary: pull the final grid's bottom edge inside the
            //     viewport (small margin) so the bottom row is never left
            //     mostly off-screen.
            //   - floor: never push the heading above a small minimum
            //     fraction of the viewport height, so "moves toward the
            //     top" never becomes "scrolls off the top".
            // The floor wins when the two conflict — see round report for
            // the measured px of any residual bottom-row overlap this
            // leaves on short viewports.
            // Cached rather than recomputed by the tween on every render:
            // recomputeStageShiftY() (below) is the only thing that reads
            // layout (getBoundingClientRect) for this value, and it only
            // runs at effect init and on ScrollTrigger's onRefresh — never
            // per scroll frame. The tween itself just reads this cache.
            let cachedShiftY = 0;

            // Because the shift stays on .kok-ticket-players-stage as a
            // permanent inline transform once the timeline reaches its end
            // (scrub holds progress at 1 past the pin's own end — the
            // transform doesn't revert), it silently added its own
            // magnitude as *extra* visual gap between the settled cards and
            // whatever comes next in the document flow, on top of
            // --kok-section-gap's own padding. Root-caused by comparing the
            // measured PLAYERS -> RULES gap against the standard RULES ->
            // ABOUT gap: the excess matched the shift's own magnitude
            // almost exactly (confirmed: reducing pinDistance/end has no
            // effect on this gap at all — pin distance only changes how
            // much virtual scroll happens *while pinned*, not any actual
            // document-flow box size, so it was never the right lever here;
            // the "preferred_fix_order" #1 item didn't apply to this
            // particular symptom, only to the separate dead-scroll-tail
            // issue).
            //
            // Measured directly rather than assumed from --kok-section-gap's
            // raw rem value, per spec ("まず...標準距離も実測してください") —
            // RULES's own card bottom -> ABOUT's heading top is a stable,
            // always-present reference for "what a normal category gap
            // actually renders as" at the current breakpoint.
            const rulesCardEl = document.querySelector<HTMLElement>(".rules .kok-rule-board");
            const aboutHeadingEl = document.querySelector<HTMLElement>("#about .kok-section-heading");
            const standardGapPx =
              rulesCardEl && aboutHeadingEl
                ? aboutHeadingEl.getBoundingClientRect().top - rulesCardEl.getBoundingClientRect().bottom
                : isDesktop
                  ? 180
                  : 66.5;

            // The shift's magnitude can exceed the standard gap itself (it
            // does on desktop), so a single non-negative padding-bottom
            // can't absorb all of it — padding can shrink to 0 but no
            // further. Split the needed reduction into what padding alone
            // can cover (up to the standard gap's own size) and, only for
            // whatever's left over, a small negative margin-bottom on
            // .team-info__body (the stage's own last child, still entirely
            // inside the PLAYERS section — not the pin-spacer and not
            // RULES) to make up the difference. Both are root-cause,
            // measured reductions of this section's own trailing space, not
            // a guessed constant.
            const recomputeStageShiftY = () => {
              const vh = window.innerHeight;
              const offset = pinStartOffset();
              const stageRect = stageEl.getBoundingClientRect();
              const headingRect = heading.getBoundingClientRect();
              const listRect = list.getBoundingClientRect();

              const headingTop0 = -offset + (headingRect.top - stageRect.top);
              const gridBottom0 = -offset + (listRect.bottom - stageRect.top);

              const gridBottomMarginFrac = 0.04;
              const shiftForGridFit = vh * (1 - gridBottomMarginFrac) - gridBottom0;

              const headingMinFrac = isDesktop ? 0.05 : 0.04;
              const headingMinShift = vh * headingMinFrac - headingTop0;

              const minMagnitude = isDesktop ? 100 : 160;
              const maxMagnitude = isDesktop ? 560 : 460;

              let shift = Math.min(shiftForGridFit, -minMagnitude);
              shift = Math.max(shift, headingMinShift);
              shift = clamp(shift, -maxMagnitude, 0);

              cachedShiftY = Math.round(shift);
              const needed = Math.abs(cachedShiftY);
              const paddingCompensation = Math.min(standardGapPx, needed);
              const overflowCompensation = Math.max(0, needed - standardGapPx);
              section.style.setProperty("--kok-players-shift-compensation", `${Math.round(paddingCompensation)}px`);
              section.style.setProperty("--kok-players-shift-overflow", `${Math.round(overflowCompensation)}px`);
              return cachedShiftY;
            };

            // Run once synchronously now so the compensating padding (and
            // the tween's first render) are correct even before
            // ScrollTrigger's own first refresh fires.
            recomputeStageShiftY();

            const tl = gsap.timeline({
              scrollTrigger: {
                // trigger and pin are the SAME element — the pin shell, not
                // the stage (see file docblock — matching trigger/pin avoids
                // a real GSAP pin-position bug that appears when they
                // differ; keeping the stage out of the pin lets it carry its
                // own y-shift tween without fighting ScrollTrigger's pin
                // transform on the same node).
                trigger: pinShellEl,
                start: () => `top+=${pinStartOffset()} top`,
                pin: pinShellEl,
                end: () => `+=${pinDistance()}`,
                // Lowered again from 0.3/0.18: this round's target is
                // tracking the scroll input even more directly (spec asks
                // for ease:none on both the stage shift and the card
                // spread, i.e. as close to 1:1 with raw scroll as
                // scrub-smoothing allows) so there's no lagging-catch-up
                // feel once the stage-shift + spread + flip are all moving
                // at once.
                scrub: isDesktop ? 0.2 : 0.12,
                anticipatePin: 0,
                invalidateOnRefresh: true,
                // Recomputes the cached shift (and its CSS gap
                // compensation) on resize/content-size changes. Not a
                // per-frame scroll callback — ScrollTrigger only fires this
                // on refresh (init, resize, matchMedia re-entry).
                onRefresh: () => recomputeStageShiftY(),
              },
            });

            // 0-65%: the whole stage (TICKET panel + gap + PLAYERS heading +
            // card area) translates upward, starting on the very first
            // pixel of scroll — same start point as the card spread below,
            // so the composition visibly rises and the cards visibly
            // expand at the same time, never one after the other.
            // ease:none tracks scroll input directly (matches the spec's
            // request to sync 1:1 with the scrub, not ease in/out on its
            // own schedule). Holds at its shifted position for the
            // remaining 65%-timelineTotal while the flip/settle plays out.
            // Reads the cache only — no getBoundingClientRect() here, so
            // this costs nothing per frame.
            tl.to(
              stageEl,
              {
                y: () => cachedShiftY,
                duration: 65,
                ease: "none",
              },
              0,
            );
            // 0-60%: spread article.kok-player out to its grid position,
            // starting immediately (no held/static区間). power1.out (fast
            // out of the gate, easing off toward the end) replaces the
            // earlier power2.inOut — that had a near-zero starting
            // velocity, which combined with scrub smoothing read as a
            // continuation of the "nothing is moving yet" feeling. The
            // first pixel of scroll now visibly moves the cards.
            // Switched again from power1.out to none: with the stage shift
            // already tracking scroll 1:1 (ease:none), leaving the spread
            // on an eased curve meant the two moved at visibly different
            // rates through the middle of the gesture — one tracking input
            // directly, the other still accelerating/decelerating on its
            // own schedule — which read as a subtle stutter between them.
            // Matching both to ease:none removes that mismatch.
            tl.to(
              cardEls,
              {
                x: 0,
                y: 0,
                rotateZ: 0,
                z: 0,
                scale: 1,
                duration: 60,
                ease: "none",
                stagger: { each: spreadStagger, from: "start" },
              },
              0,
            );
            // 18-75%: flip .kok-player-card from back (0deg) to front (180deg),
            // overlapping the tail of the spread so cards turn face-up while
            // still finishing their move outward.
            tl.to(
              flipEls,
              {
                rotateY: 180,
                duration: 57,
                ease: "power1.inOut",
                stagger: { each: flipStagger, from: "start" },
                force3D: true,
              },
              18,
            );
            // Small settle buffer, then straight into RULES: padding the
            // timeline to exactly timelineTotal (not the old shared
            // TIMELINE_TOTAL=100 constant) makes the percentages above map
            // to scroll progress 1:1, while keeping the post-completion
            // hold to the ~5-6 points of buffer measured as enough to read
            // as "settled" without turning into pure dead scroll (see
            // pinDistance/timelineTotal comments above).
            tl.set({}, {}, timelineTotal);

            // Per-card float: a pure CSS animation (see globals.css'
            // .kok-player-float--floating / @keyframes kok-player-float),
            // not 10 concurrent infinite GSAP tweens. Each card only gets a
            // one-time gsap.set() of four CSS custom properties (amplitude
            // x/y/rotate + duration/delay baked into one --float-timing
            // shorthand isn't used here — plain properties keep this
            // readable) and a class toggle; the browser's compositor drives
            // the animation on its own thread from then on, with zero
            // per-frame JS. This is unconditionally independent of the main
            // timeline's progress and of every other card, running through
            // the gathered hold, the spread, the flip, and the settled
            // final grid without ever being paused or killed by scroll.
            // Amplitude/duration/delay vary per card index using the same
            // small deterministic (not Math.random) formulas as before, so
            // cards stay out of phase with each other rather than bobbing
            // as one block, while remaining fully reproducible.
            const floatAmpYRange = isDesktop ? [5, 9] : [4, 7];
            const floatAmpXRange = isDesktop ? [1, 3] : [0.5, 2];
            const floatRotateRange = isDesktop ? [0.25, 0.7] : [0.2, 0.5];
            const floatDurationRange = isDesktop ? [2.8, 4.2] : [3.1, 4.5];

            floatEls.forEach((el, i) => {
              const ampY = floatAmpYRange[0] + ((i * 3) % 10) / 10 * (floatAmpYRange[1] - floatAmpYRange[0]);
              const ampX = floatAmpXRange[0] + ((i * 2) % 10) / 10 * (floatAmpXRange[1] - floatAmpXRange[0]);
              const ampRotate = floatRotateRange[0] + ((i * 5) % 10) / 10 * (floatRotateRange[1] - floatRotateRange[0]);
              const duration = floatDurationRange[0] + ((i * 0.37) % 1) * (floatDurationRange[1] - floatDurationRange[0]);
              // Negative delay seeks each card into its own cycle
              // immediately (rather than all starting from the same phase
              // and drifting apart only over time), so the out-of-phase
              // look is present from the very first frame.
              const phaseDelay = -((i * 0.31) % duration);
              el.style.setProperty("--float-x", `${ampX}px`);
              el.style.setProperty("--float-y", `${ampY}px`);
              el.style.setProperty("--float-rotate", `${ampRotate}deg`);
              el.style.setProperty("--float-duration", `${duration}s`);
              el.style.setProperty("--float-delay", `${phaseDelay}s`);
              el.classList.add("kok-player-float--floating");
            });

            return () => {
              tl.scrollTrigger?.kill();
              tl.kill();
              floatEls.forEach((el) => {
                el.classList.remove("kok-player-float--floating");
                el.style.removeProperty("--float-x");
                el.style.removeProperty("--float-y");
                el.style.removeProperty("--float-rotate");
                el.style.removeProperty("--float-duration");
                el.style.removeProperty("--float-delay");
              });
              gsap.set(floatEls, { x: 0, y: 0, rotation: 0, clearProps: "transform" });
              gsap.set(stageEl, { clearProps: "transform" });
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
