import SponsorsScene from "./SponsorsScene";
import { eventMeta } from "./data";

export default function SiteFooter() {
  return (
    <footer className="kok-footer">
      <SponsorsScene />
      <div className="kok-footer-socials" id="official-information">
        <p>Official Informations:</p>
        <div aria-label="公式SNS">
          <a className="x" href={eventMeta.socials.x} target="_blank" rel="noreferrer" aria-label="KING OF KINGS公式X">
            <img width="48" height="48" src="/assets/img/social-x.svg" alt="" />
          </a>
          <a className="instagram" href={eventMeta.socials.instagram} target="_blank" rel="noreferrer" aria-label="KING OF KINGS公式Instagram">
            <img width="48" height="48" src="/assets/img/social-instagram.svg" alt="" />
          </a>
        </div>
      </div>
      <div className="kok-footer-main">
        <div className="kok-footer-event">
          <img width="2030" height="665" src="/assets/img/kok-fontlogo.svg" alt="KING OF KINGS" loading="lazy" />
        </div>
        <nav aria-label="フッターリンク">
          <span>サイトのご利用について</span>
          <i>|</i>
          <span>プライバシーポリシー</span>
        </nav>
        <div className="kok-footer-mowl">
          <img width="725" height="477" src="/assets/img/mowl-logo.svg" alt="mowl" loading="lazy" />
          <small>Powered by mowl Osaka</small>
        </div>
        <p className="kok-copyright">© 2026 KING OF KINGS. ALL RIGHTS RESERVED.</p>
      </div>
    </footer>
  );
}
