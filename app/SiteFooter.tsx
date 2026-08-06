import { footer, brand } from "./vantaCloneContent";

// Oversized wordmark over a swirl-image placeholder background, an
// attribution pill row, and a small copyright line — matching the
// reference's own footer-as-final-scene treatment.
export default function SiteFooter() {
  return (
    <footer className="v2-footer">
      <div className="v2-footer__swirl" aria-hidden="true" />
      <div className="v2-footer__content">
        <h2>{footer.wordmark}</h2>
        <div className="v2-footer__attr">
          <span>{footer.madeBy}</span>
          {footer.links.map((link) => <a key={link.label} href={link.href}>{link.label} →</a>)}
        </div>
      </div>
      <p className="v2-footer__copyright">{brand.name} · © 2026 {footer.wordmark} — Edition 1</p>
    </footer>
  );
}
