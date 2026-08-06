import { forwardRef } from "react";

// Deferred: final asset is a rendered 3D glass/iridescent object that morphs
// shape across the Hero scroll. This is a neutral translucent placeholder —
// matching the reference's approximate object footprint, transparency, and
// continuous rotation — standing in until the final render is supplied.
// Forwards a ref so HeroScene's ScrollTrigger timeline can animate it
// directly, without a separate query for a nested, non-forwarded node.
const HeroVisualSlot = forwardRef<HTMLDivElement>(function HeroVisualSlot(_props, ref) {
  return (
    <div className="v2-hero-object-track">
      <div className="v2-hero-object" ref={ref} aria-hidden="true" />
    </div>
  );
});

export default HeroVisualSlot;
