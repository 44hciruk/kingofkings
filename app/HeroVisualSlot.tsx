// Isolated slot for the Hero's centerpiece visual. Magma's reference uses a
// rotating translucent 3D object here; the eventual replacement is a
// rotating KING OF KINGS playing-card (deferred to a separate task per
// current instructions). This placeholder stands in for it — a static card
// silhouette with a slow idle spin (pure CSS, reduced-motion aware, defined
// in globals.css) — so HeroScene's pin/reveal/wipe choreography can be
// built and tuned now without depending on the final 3D asset.
//
// HeroScene only ever positions/moves this slot as a whole (translateX on
// the outer .kok-hero-visual element); the idle spin lives on the inner
// .kok-hero-visual__spin element so the two transforms never compete for
// control of the same node, matching the pattern already used in
// PlayersScrollReveal (float wrapper vs. flip element).
export default function HeroVisualSlot() {
  return (
    <div className="kok-hero-visual" data-hero-visual-slot="placeholder">
      <div className="kok-hero-visual__spin">
        <img
          className="kok-hero-visual__card"
          width="1137"
          height="1383"
          src="/assets/img/players/card-back.svg"
          alt=""
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
