import MobileMenu from "./MobileMenu";
import { eventMeta } from "./data";

// Persistent floating pill nav, fixed for the entire scroll — verified
// against the reference recordings, whose nav stays visible from the hero
// through the footer, not just within the hero. (The previous
// implementation copied this comment's intent but never actually set
// position:fixed; this rebuild fixes that.)
export default function SiteHeader() {
  return (
    <header className="v-header">
      <a href="#top" className="v-header__brand" aria-label="KING OF KINGS トップへ">
        <img width="2030" height="665" src="/assets/img/kok-fontlogo.svg" alt="KING OF KINGS" />
      </a>
      <nav className="v-header__nav" aria-label="サイト内メニュー">
        <a href="#ticket">TICKET</a>
        <a href="#players">PLAYERS</a>
        <a href="#rules">RULES</a>
        <a href="#about">ABOUT</a>
      </nav>
      <a className="v-header__cta" href={eventMeta.ticketUrl} target="_blank" rel="noreferrer" aria-label="LivePocket チケット販売ページを開く">
        TICKET<span aria-hidden="true">↗</span>
      </a>
      <MobileMenu />
    </header>
  );
}
