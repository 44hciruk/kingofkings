import { faq } from "./vantaCloneContent";

// Accessible native <details>/<summary> accordion — always present, no
// scroll-gated reveal, matching how the reference's FAQ list itself is
// just a plain accordion (not part of a pinned mechanic).
export default function FaqSection() {
  return (
    <section className="v2-faq" id="faq">
      <span className="v2-section-eyebrow v2-faq__eyebrow">{faq.heading}</span>
      <div className="v2-faq__list">
        {faq.items.map((item, i) => (
          <details key={item.q} className="v2-faq__item" open={i === 0}>
            <summary>
              <span>Q{String(i + 1).padStart(2, "0")}</span>
              <strong>{item.q}</strong>
              <i aria-hidden="true">+</i>
            </summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
