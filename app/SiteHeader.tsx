import MobileMenu from "./MobileMenu";
import { eventMeta } from "./data";

// Persistent header: fixed for the entire scroll (verified against the
// Magma reference, whose floating nav pill stays visible from the hero
// through the footer, not just within the hero).
export default function SiteHeader() {
  return (
    <header className="kok-header">
      <a href="#top" className="kok-brand" aria-label="KING OF KINGS トップへ">
        <img className="kok-brand-logotype" width="2030" height="665" src="/assets/img/kok-fontlogo.svg" alt="KING OF KINGS" />
      </a>
      <nav aria-label="サイト内メニュー">
        <a href="#ticket">TICKET</a>
        <a href="#players">PLAYERS</a>
        <a href="#rules">RULES</a>
        <a href="#about">ABOUT</a>
      </nav>
      <MobileMenu />
      <a className="header-ticket livepocket-logo-button" href={eventMeta.ticketUrl} target="_blank" rel="noreferrer" aria-label="LivePocket チケット販売ページを開く">
        <img width="2160" height="640" src="/assets/img/livepocket-logo.jpg" alt="LivePocket" />
      </a>
    </header>
  );
}
