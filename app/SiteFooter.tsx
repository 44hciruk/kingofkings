import { eventMeta, SPONSOR_SLOT_COUNT } from "./data";

// Atmospheric footer: an oversized, low-opacity repeated KING OF KINGS
// wordmark sits behind the confirmed sponsor grid, socials, mowl branding,
// and copyright — replacing the previous kok-footer's compact stacked
// layout with the reference's footer-as-final-scene treatment. No sponsor
// is confirmed yet, so every slot renders as an explicitly labeled
// placeholder (see data.ts).
export default function SiteFooter() {
  const sponsorSlots = Array.from({ length: SPONSOR_SLOT_COUNT }, (_, index) => index + 1);

  return (
    <footer className="v-footer">
      <div className="v-footer__wordmark" aria-hidden="true">
        <span>KING OF KINGS</span>
        <span>KING OF KINGS</span>
      </div>

      <div className="v-footer__content">
        <div className="v-footer__sponsors" id="sponsors">
          <h2>SPONSORS</h2>
          <p>スポンサー</p>
          <ul className="v-footer__sponsor-list">
            {sponsorSlots.map((slot) => (
              <li key={slot}>
                <figure className="v-footer__sponsor-placeholder">
                  <small>SPONSOR</small>
                  <strong>{String(slot).padStart(2, "0")}</strong>
                  <span>LOGO</span>
                </figure>
              </li>
            ))}
          </ul>
        </div>

        <div className="v-footer__main" id="official-information">
          <div className="v-footer__socials" aria-label="公式SNS">
            <a href={eventMeta.socials.x} target="_blank" rel="noreferrer" aria-label="KING OF KINGS公式X">
              <img width="48" height="48" src="/assets/img/social-x.svg" alt="" />
            </a>
            <a href={eventMeta.socials.instagram} target="_blank" rel="noreferrer" aria-label="KING OF KINGS公式Instagram">
              <img width="48" height="48" src="/assets/img/social-instagram.svg" alt="" />
            </a>
          </div>
          <nav className="v-footer__links" aria-label="フッターリンク">
            <span>サイトのご利用について</span>
            <i aria-hidden="true">|</i>
            <span>プライバシーポリシー</span>
          </nav>
          <div className="v-footer__mowl">
            <img width="725" height="477" src="/assets/img/mowl-logo.svg" alt="mowl" loading="lazy" />
            <small>Powered by mowl Osaka</small>
          </div>
          <p className="v-footer__copyright">© 2026 KING OF KINGS. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>
  );
}
