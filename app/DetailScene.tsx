import RulesDetails from "./RulesDetails";
import { eventMeta } from "./data";

/**
 * FAQ/detail scene: replaces AboutScene + absorbs RulesDetails wholesale.
 * An always-present, always-accessible native <details>/<summary> accordion
 * carrying the full confirmed event overview and all six rule categories —
 * nothing here is ever hidden behind animation, only organized under
 * disclosure widgets so the page doesn't have to print every line at once.
 */
export default function DetailScene() {
  return (
    <section className="v-detail" id="detail">
      <div className="v-detail__inner">
        <h2 className="v-detail__eyebrow">DETAILS</h2>

        <details className="v-detail__event" open>
          <summary>
            <span>EVENT</span>
            <strong>大会概要</strong>
          </summary>
          <div className="v-detail__event-body">
            <dl>
              <div>
                <dt>大会名</dt>
                <dd>{eventMeta.name}</dd>
              </div>
              <div>
                <dt>大会内容</dt>
                <dd>選抜選手によるヨーヨーコンテスト。キングの中のキングを決定します。</dd>
              </div>
              <div>
                <dt>開催日程</dt>
                <dd>{eventMeta.dateJa}<br />{eventMeta.doorsJa}</dd>
              </div>
              <div>
                <dt>開催場所</dt>
                <dd>
                  {eventMeta.venueNameJa}<br />
                  {eventMeta.venueAddress}
                  <div className="v-detail__map">
                    <iframe
                      src={eventMeta.mapEmbedUrl}
                      title={`${eventMeta.venueNameJa} Google Map`}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                    <a href={eventMeta.mapLinkUrl} target="_blank" rel="noreferrer">Google Mapsで会場を見る ↗</a>
                  </div>
                </dd>
              </div>
              <div>
                <dt>大会形式</dt>
                <dd>
                  <p>1. 各メーカーによるジャッジのポイント制とします。</p>
                  <p>2. スキル・パフォーマンス・インプレッションの3項目を、それぞれ5点満点で採点します。</p>
                  <p>3. 合計ポイントを最も多く獲得した選手が「KING OF KINGS」となります。</p>
                  <p>4. 最終順位は1位から5位まで発表します。</p>
                </dd>
              </div>
              <div>
                <dt>賞金</dt>
                <dd>{eventMeta.prizeLabel} {eventMeta.prizeAmount}円</dd>
              </div>
            </dl>
          </div>
        </details>

        <RulesDetails />
      </div>
    </section>
  );
}
