import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import HeroScene from "./HeroScene";
import BrandStatementScene from "./BrandStatementScene";
import ScheduleScene from "./ScheduleScene";
import TicketScene from "./TicketScene";
import PlayersScrollReveal from "./PlayersScrollReveal";
import RulesScene from "./RulesScene";
import AboutScene from "./AboutScene";
import { players } from "./data";

export default function Home() {
  return (
    <div className="app wrap kok-site">
      <a className="kok-skip-link" href="#main-content">メインコンテンツへ移動</a>
      <SiteHeader />

      <div className="stage">
        <main className="kok-main" id="main-content">
          <div className="container">
            <HeroScene />
            <BrandStatementScene />
            <ScheduleScene />
            <TicketScene />

            <section className="team" id="players">
              <PlayersScrollReveal />
              <div className="inner">
                <h2 className="kok-section-heading"><strong>PLAYERS</strong><span className="jp">出場選手</span></h2>
                <div className="team-info__body">
                  <div className="team-info__players kok-player-list">
                    {players.map((player) => (
                      <article className={`team-info__player kok-player${player.confirmed ? " kok-player--confirmed" : ""}`} key={player.no} aria-label={`出場選手 ${player.no}${player.confirmed ? "" : " 未発表"}`}>
                        <div className="kok-player-float">
                          <div className="kok-player-card">
                            <div className="kok-player-card__back" aria-hidden="true" />
                            <div className="kok-player-card__front">
                              <figure>
                                <span className="kok-player-corners" aria-hidden="true">
                                  <img className="kok-player-corner kok-player-corner--top" width="270" height="499" src="/assets/img/kok-k-piece.svg" alt="" />
                                  <img className="kok-player-corner kok-player-corner--bottom" width="270" height="499" src="/assets/img/kok-k-piece.svg" alt="" />
                                </span>
                                <figcaption><p className="team-info__player-name-en">{player.name}</p></figcaption>
                                <img className={player.confirmed ? "kok-player-photo" : "kok-player-silhouette"} width="1137" height="1383" src={player.image} alt="" aria-hidden="true" loading="lazy" decoding="async" />
                              </figure>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </section>

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
