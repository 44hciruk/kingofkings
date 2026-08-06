import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import HeroScene from "./HeroScene";
import ConvictionScene from "./ConvictionScene";
import LibraryScene from "./LibraryScene";
import TicketScene from "./TicketScene";
import RulesScene from "./RulesScene";
import AboutScene from "./AboutScene";

export default function Home() {
  return (
    <div className="app wrap kok-site">
      <a className="kok-skip-link" href="#main-content">メインコンテンツへ移動</a>
      <SiteHeader />

      <div className="stage">
        <main className="kok-main" id="main-content">
          <div className="container">
            <HeroScene />
            <ConvictionScene />
            <LibraryScene />
            <TicketScene />
            <RulesScene />
            <AboutScene />
          </div>
          <a className="backTop" href="#top" aria-label="ページ上部へ戻る">
            <img className="backTop-mark backTop-mark--top" width="270" height="499" src="/assets/img/kok-k-piece.svg" alt="" />
            <span>TOPへ</span>
            <img className="backTop-mark backTop-mark--bottom" width="270" height="499" src="/assets/img/kok-k-piece.svg" alt="" />
          </a>
        </main>
      </div>

      <SiteFooter />
      <div className="videoBg"><video src="/assets/img/final/back.mp4" poster="/assets/img/final/bg_gf.jpg" autoPlay loop playsInline muted preload="auto" /></div>
    </div>
  );
}
