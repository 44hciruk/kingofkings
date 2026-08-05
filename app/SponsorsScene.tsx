import ScrollReveal from "./ScrollReveal";
import { SPONSOR_SLOT_COUNT } from "./data";

// No sponsor is confirmed yet, so every slot renders as an explicitly
// labeled placeholder. The grid works for any slot count and for a future
// mix of real logos + remaining placeholders — swapping in a real
// {name, logoSrc}[] array only changes what's inside each <li>, not the
// grid or the reveal.
export default function SponsorsScene() {
  const slots = Array.from({ length: SPONSOR_SLOT_COUNT }, (_, index) => index + 1);

  return (
    <section className="kok-footer-sponsors" id="sponsors">
      <h2>SPONSORS</h2>
      <p>スポンサー</p>
      <ScrollReveal className="sponsor-list__wrap" selector="li">
        <div className="sponsor-list">
          <div className="sponsor-list__grade1">
            <ul>
              {slots.map((slot) => (
                <li key={slot}>
                  <figure className="sponsor-logo-placeholder">
                    <small>SPONSOR</small>
                    <strong>{String(slot).padStart(2, "0")}</strong>
                    <span>LOGO</span>
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
