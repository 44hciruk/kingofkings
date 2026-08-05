import ScrollReveal from "./ScrollReveal";
import { CardCornerMarks, SectionHeading, TableRow } from "./ui";
import { eventMeta } from "./data";

export default function AboutScene() {
  return (
    <section className="about" id="about">
      <div className="inner">
        <SectionHeading en="ABOUT" ja="大会概要" />
        <div className="itemWrap kok-about-card kok-section-card" data-label="ABOUT">
          <CardCornerMarks />
          <div className="item">
            <ScrollReveal selector=".tr, .kok-venue-gallery figure" y={20} stagger={0.06}>
              <div className="table">
                <h4>KING OF KINGS 大会概要</h4>
                <TableRow th="大会名">{eventMeta.name}</TableRow>
                <TableRow th="大会内容">選抜選手によるヨーヨーコンテスト。キングの中のキングを決定します。</TableRow>
                <TableRow th="開催日程">
                  {eventMeta.dateJa}
                  <br />
                  {eventMeta.doorsJa}
                </TableRow>
                <TableRow th="開催場所">
                  {eventMeta.venueNameJa}
                  <br />
                  {eventMeta.venueAddress}
                  <div className="kok-map-wrap">
                    <iframe
                      className="kok-map-embed"
                      src={eventMeta.mapEmbedUrl}
                      title={`${eventMeta.venueNameJa} Google Map`}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                    <a className="kok-map-link" href={eventMeta.mapLinkUrl} target="_blank" rel="noreferrer">
                      Google Mapsで会場を見る ↗
                    </a>
                  </div>
                </TableRow>
                <TableRow th="会場観戦">
                  {eventMeta.dateJa}
                  <br />
                  {eventMeta.doorsJa}
                  <a className="kok-about-ticket livepocket-logo-button" href={eventMeta.ticketUrl} target="_blank" rel="noreferrer" aria-label="LivePocket チケット販売ページを開く">
                    <img width="2160" height="640" src="/assets/img/livepocket-logo.jpg" alt="LivePocket" loading="lazy" />
                  </a>
                </TableRow>
                <TableRow th="大会形式">
                  <p className="indent">1. 各メーカーによるジャッジのポイント制とします。</p>
                  <p className="indent">2. スキル・パフォーマンス・インプレッションの3項目を、それぞれ5点満点で採点します。</p>
                  <p className="indent">3. 合計ポイントを最も多く獲得した選手が「KING OF KINGS」となります。</p>
                  <p className="indent">4. 最終順位は1位から5位まで発表します。</p>
                </TableRow>
                <TableRow th="賞金">{eventMeta.prizeLabel} {eventMeta.prizeAmount}円</TableRow>
                <div className="kok-venue-gallery" aria-label={`${eventMeta.venueNameJa} 会場写真`}>
                  <figure><img width="3578" height="2013" src="/assets/img/mowl-osaka-01.jpg" alt="mowl OSAKAのステージとウォールアート" loading="lazy" decoding="async" /></figure>
                  <figure><img width="4032" height="2268" src="/assets/img/mowl-osaka-02.jpg" alt="mowl OSAKAの外観とウォールアート" loading="lazy" decoding="async" /></figure>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
