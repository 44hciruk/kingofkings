import MobileMenu from "./MobileMenu";
import PlayersScrollReveal from "./PlayersScrollReveal";

const playerImages = [
  { image: "/assets/img/players/confirmed/player-01.png", confirmed: true },
  { image: "/assets/img/players/confirmed/player-02.png", confirmed: true },
  "/assets/img/players/kazunoko.png",
  "/assets/img/players/bonchan.png",
  "/assets/img/players/tokido.png",
  "/assets/img/players/leshar.png",
  "/assets/img/players/fuudo.png",
  "/assets/img/players/daigo.png",
  "/assets/img/players/dogura.png",
  "/assets/img/players/shuto.png",
];

const players = playerImages.map((entry, index) => ({
  name: "KING",
  image: typeof entry === "string" ? entry : entry.image,
  confirmed: typeof entry !== "string" && entry.confirmed,
  no: String(index + 1).padStart(2, "0"),
}));

const schedule = [
  ["14:00", "一般入場", "DOOR OPEN"],
  ["17:30", "ゲストパフォーマンス", "GUEST PERFORMANCE"],
  ["18:30", "コンテスト開始", "CONTEST START"],
  ["21:30", "表彰式", "AWARD CEREMONY"],
  ["22:00", "イベント終了", "EVENT CLOSE"],
];

const sponsorGroups = [
  { className: "sponsor-list__grade1", slots: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
];

function CardCornerMarks() {
  return (
    <span className="kok-card-corners" aria-hidden="true">
      <img className="kok-card-corner kok-card-corner--top" width="270" height="499" src="/assets/img/kok-k-piece.svg" alt="" loading="lazy" />
      <img className="kok-card-corner kok-card-corner--bottom" width="270" height="499" src="/assets/img/kok-k-piece.svg" alt="" loading="lazy" />
    </span>
  );
}

export default function Home() {
  return (
    <div className="app wrap kok-site">
      <a className="kok-skip-link" href="#main-content">メインコンテンツへ移動</a>
      <header className="kok-header">
        <a href="#top" className="kok-brand" aria-label="KING OF KINGS トップへ">
          <img className="kok-brand-logotype" width="2030" height="665" src="/assets/img/kok-fontlogo.svg" alt="KING OF KINGS" />
        </a>
        <nav aria-label="サイト内メニュー">
          <a href="#ticket">TICKET</a><a href="#players">PLAYERS</a><a href="#rules">RULES</a><a href="#about">ABOUT</a>
        </nav>
        <MobileMenu />
        <a className="header-ticket livepocket-logo-button" href="https://livepocket.jp/e/n4le2" target="_blank" rel="noreferrer" aria-label="LivePocket チケット販売ページを開く">
          <img width="2160" height="640" src="/assets/img/livepocket-logo.jpg" alt="LivePocket" />
        </a>
      </header>

      <div className="stage">
        <main className="kok-main" id="main-content">
          <div className="container">
            <section className="top" id="top">
              <div className="inner">
                <div className="kok-single-hero">
                  <h1 className="kok-single-hero-title">
                    <picture>
                      <source media="(max-width: 767px)" srcSet="/assets/img/kok-hero-logo-mobile.svg" />
                      <img width="3217" height="4026" src="/assets/img/kok-hero-logo-desktop.svg" alt="KING OF KINGS" />
                    </picture>
                  </h1>
                  <div className="kok-single-hero-prize" aria-label="優勝賞金 1,000,000円">
                    <span>優勝賞金</span>
                    <strong><small>¥</small>1,000,000</strong>
                  </div>
                  <div className="kok-single-hero-meta">
                    <span>2026.08.19 WED</span><i aria-hidden="true" /><span>MOWL OSAKA</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="streaming" id="schedule">
              <div className="inner">
                <SectionHeading en="TIME TABLE" ja="タイムテーブル" />
                <div className="tableWrap kok-time-wrap kok-section-card" data-label="TIME TABLE">
                  <CardCornerMarks />
                  <h3>2026.08.19 WED</h3>
                  <p className="schedule-location">MOWL OSAKA / OSAKA, JAPAN</p>
                  <ul className="kok-timeline">
                    {schedule.map(([time, ja, en], index) => (
                      <li key={time}><span className="seq">0{index + 1}</span><time>{time}</time><div><strong>{ja}</strong><small>{en}</small></div></li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section className="ticket" id="ticket">
              <div className="inner">
                <SectionHeading en="TICKET" ja="チケット情報" />
                <div className="kok-ticket-panel kok-section-card" data-label="TICKET">
                  <CardCornerMarks />
                  <p className="kok-ticket-label">KING OF KINGS 2026 / ADMISSION TICKET</p>
                  <h3>チケット販売情報は近日公開</h3>
                  <p className="kok-ticket-copy">チケットの発売日・料金・入場方法は、決定次第SNSおよびこちらでお知らせします。</p>
                  <a className="kok-ticket-cta" href="https://livepocket.jp/e/n4le2" target="_blank" rel="noreferrer">LIVEPOCKETへ<span>↗</span></a>
                </div>
              </div>
            </section>

            <section className="team" id="players">
              <PlayersScrollReveal />
              <div className="inner">
                <SectionHeading en="PLAYERS" ja="出場選手" />
                <div className="team-info__body">
                  <div className="team-info__players kok-player-list">
                    {players.map((player) => (
                      <article className={`team-info__player kok-player${player.confirmed ? " kok-player--confirmed" : ""}`} key={player.no} aria-label={`出場選手 ${player.no}${player.confirmed ? "" : " 未発表"}`}>
                        <figure>
                          <span className="kok-player-corners" aria-hidden="true">
                            <img className="kok-player-corner kok-player-corner--top" width="270" height="499" src="/assets/img/kok-k-piece.svg" alt="" />
                            <img className="kok-player-corner kok-player-corner--bottom" width="270" height="499" src="/assets/img/kok-k-piece.svg" alt="" />
                          </span>
                          <figcaption><p className="team-info__player-name-en">{player.name}</p></figcaption>
                          <img className={player.confirmed ? "kok-player-photo" : "kok-player-silhouette"} width="1137" height="1383" src={player.image} alt="" aria-hidden="true" loading="lazy" decoding="async" />
                        </figure>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="rules" id="rules">
              <div className="inner">
                <SectionHeading en="RULES" ja="大会ルール" />
                <div className="img kok-rule-board kok-section-card" data-label="RULES">
                  <CardCornerMarks />
                  <div className="kok-rule-intro">
                    <span>OFFICIAL RULE GUIDE</span>
                    <h3>一夜で決まる、キングの中のキング。</h3>
                    <p>予選・決勝ラウンドを設けない招待制ヨーヨーコンテスト。<br />6名のジャッジによる順位点の合計で最終順位を決定します。</p>
                  </div>
                  <div className="kok-rule-details">
                    <details open>
                      <summary><span>01</span><strong>演技ルール</strong><small>PERFORMANCE</small></summary>
                      <div className="kok-rule-detail-body">
                        <ul>
                          <li>演技は原則として1人1回です。</li>
                          <li>演技時間は120秒以上180秒未満。音源の最初の音が鳴った瞬間から計測します。</li>
                          <li>120秒未満は失格。180秒到達時点で音源をフェードアウトし、採点を終了します。</li>
                          <li>180秒到達後の演技は採点対象外です。無音で継続した場合は採点対象外に加え、ペナルティを科します。</li>
                          <li>演技終了後、退出指示に従わない場合は失格となります。</li>
                        </ul>
                      </div>
                    </details>
                    <details>
                      <summary><span>02</span><strong>審査カテゴリー</strong><small>JUDGING</small></summary>
                      <div className="kok-rule-detail-body kok-judge-grid">
                        <article><b>TECHNICAL</b><em>2名</em><p>難易度 / 精度 / 構成 / 完成度 / リスク / コントロール</p></article>
                        <article><b>PERFORMANCE</b><em>2名</em><p>音楽との調和 / 表現力 / 構成 / 伝達力 / 演技の流れ</p></article>
                        <article><b>FUTURE IMPACT</b><em>2名</em><p>独創性 / 新しい価値観 / シーンへの影響 / 次世代への影響</p></article>
                      </div>
                    </details>
                    <details>
                      <summary><span>03</span><strong>採点方式</strong><small>SCORING</small></summary>
                      <div className="kok-rule-detail-body">
                        <div className="kok-score-scale" aria-label="順位点">
                          <span><b>1位</b><em>1点</em></span><span><b>2位</b><em>2点</em></span><span><b>3位</b><em>3点</em></span><span><b>4位</b><em>4点</em></span><span><b>5位</b><em>5点</em></span><span><b>圏外</b><em>6点</em></span>
                        </div>
                        <ul>
                          <li>各ジャッジがカテゴリーごとに上位5名を順位付けします。</li>
                          <li>6名のジャッジによる順位点を合計し、合計順位点が低い選手を上位とします。</li>
                          <li>同一ジャッジが複数選手へ同順位を付けることはできません。</li>
                        </ul>
                      </div>
                    </details>
                    <details>
                      <summary><span>04</span><strong>同点時の処理</strong><small>TIE BREAK</small></summary>
                      <div className="kok-rule-detail-body">
                        <ol>
                          <li>Future Impact担当2名の合計順位点を比較し、低い選手を上位とします。</li>
                          <li>なお同点の場合、ジャッジ6名と主催者1名の計7名で協議します。</li>
                          <li>最もインパクトを残した選手1名へ投票します。</li>
                          <li>3名以上の同点時は、必要に応じて決選投票を行います。</li>
                        </ol>
                      </div>
                    </details>
                    <details>
                      <summary><span>05</span><strong>選手ルール・禁止事項</strong><small>CONDUCT</small></summary>
                      <div className="kok-rule-detail-body kok-conduct-grid">
                        <article><h4>選手ルール</h4><ul><li>用具は各自で準備</li><li>補助者のステージ参加は事前許可制</li><li>受付・出演時刻を厳守</li><li>運営スタッフの指示に従う</li></ul></article>
                        <article><h4>禁止事項</h4><ul><li>危険物・火気・液体の使用</li><li>他選手・ジャッジへの妨害</li><li>差別的・侮辱的・不適切な表現</li><li>大会の公平性を損なう行為</li></ul></article>
                      </div>
                    </details>
                    <details>
                      <summary><span>06</span><strong>トラブル対応・補足</strong><small>SUPPORT</small></summary>
                      <div className="kok-rule-detail-body">
                        <ul>
                          <li>運営側のトラブルでは、再演技を認める場合があります。</li>
                          <li>選手側のトラブルは原則として自己責任です。</li>
                          <li>再演技の可否は大会責任者・審査責任者が判断します。</li>
                          <li>観客投票の有無・方法、音源の提出形式・期限は後日発表します。</li>
                          <li>一部詳細は公式Instagram・Webで順次お知らせします。</li>
                        </ul>
                      </div>
                    </details>
                  </div>
                </div>
              </div>
            </section>

            <section className="about" id="about">
              <div className="inner">
                <SectionHeading en="ABOUT" ja="大会概要" />
                <div className="itemWrap kok-about-card kok-section-card" data-label="ABOUT"><CardCornerMarks /><div className="item"><div className="table">
                  <h4>KING OF KINGS 大会概要</h4>
                  <TableRow th="大会名">KING OF KINGS</TableRow>
                  <TableRow th="大会内容">選抜選手によるヨーヨーコンテスト。キングの中のキングを決定します。</TableRow>
                  <TableRow th="開催日程">2026年8月19日（水）<br />一般入場 14:00 / イベント終了 22:00</TableRow>
                  <TableRow th="開催場所">
                    mowl OSAKA<br />〒556-0013 大阪府大阪市浪速区戎本町1丁目2-21
                    <div className="kok-map-wrap">
                      <iframe
                        className="kok-map-embed"
                        src="https://www.google.com/maps?q=mowl%20OSAKA%20%E5%A4%A7%E9%98%AA%E5%BA%9C%E5%A4%A7%E9%98%AA%E5%B8%82%E6%B5%AA%E9%80%9F%E5%8C%BA%E6%88%8E%E6%9C%AC%E7%94%BA1%E4%B8%81%E7%9B%AE2-21&output=embed"
                        title="mowl OSAKA Google Map"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                      <a className="kok-map-link" href="https://www.google.com/maps/search/?api=1&query=mowl%20OSAKA%20%E5%A4%A7%E9%98%AA%E5%BA%9C%E5%A4%A7%E9%98%AA%E5%B8%82%E6%B5%AA%E9%80%9F%E5%8C%BA%E6%88%8E%E6%9C%AC%E7%94%BA1%E4%B8%81%E7%9B%AE2-21" target="_blank" rel="noreferrer">Google Mapsで会場を見る ↗</a>
                    </div>
                  </TableRow>
                  <TableRow th="会場観戦">
                    2026年8月19日（水）<br />一般入場 14:00 / イベント終了 22:00
                    <a className="kok-about-ticket livepocket-logo-button" href="https://livepocket.jp/e/n4le2" target="_blank" rel="noreferrer" aria-label="LivePocket チケット販売ページを開く">
                      <img width="2160" height="640" src="/assets/img/livepocket-logo.jpg" alt="LivePocket" loading="lazy" />
                    </a>
                  </TableRow>
                  <TableRow th="大会形式"><p className="indent">1. 各メーカーによるジャッジのポイント制とします。</p><p className="indent">2. スキル・パフォーマンス・インプレッションの3項目を、それぞれ5点満点で採点します。</p><p className="indent">3. 合計ポイントを最も多く獲得した選手が「KING OF KINGS」となります。</p><p className="indent">4. 最終順位は1位から5位まで発表します。</p></TableRow>
                  <TableRow th="賞金">優勝賞金 1,000,000円</TableRow>
                  <div className="kok-venue-gallery" aria-label="mowl OSAKA 会場写真">
                    <figure><img width="3578" height="2013" src="/assets/img/mowl-osaka-01.jpg" alt="mowl OSAKAのステージとウォールアート" loading="lazy" decoding="async" /></figure>
                    <figure><img width="4032" height="2268" src="/assets/img/mowl-osaka-02.jpg" alt="mowl OSAKAの外観とウォールアート" loading="lazy" decoding="async" /></figure>
                  </div>
                </div></div></div>
              </div>
            </section>

          </div>
          <a className="backTop" href="#top" aria-label="ページ上部へ戻る">
            <img className="backTop-mark backTop-mark--top" width="270" height="499" src="/assets/img/kok-k-piece.svg" alt="" />
            <span>TOPへ</span>
            <img className="backTop-mark backTop-mark--bottom" width="270" height="499" src="/assets/img/kok-k-piece.svg" alt="" />
          </a>
        </main>
      </div>

      <footer className="kok-footer">
        <section className="kok-footer-sponsors" id="sponsors">
          <h2>SPONSORS</h2><p>スポンサー</p>
          <div className="sponsor-list__wrap">
            {sponsorGroups.map((group) => (
              <div className="sponsor-list" key={group.className}>
                <div className={group.className}>
                  <ul>
                    {group.slots.map((slot) => (
                      <li key={slot}>
                        {slot === 1 ? (
                          <figure className="sponsor-logo-real sponsor-logo-empathy">
                            <img width="1199" height="614" src="/assets/img/empathy-transparent.svg" alt="empathy" loading="lazy" />
                          </figure>
                        ) : (
                          <figure className="sponsor-logo-placeholder">
                            <small>SPONSOR</small><strong>{String(slot).padStart(2, "0")}</strong><span>LOGO</span>
                          </figure>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>
        <div className="kok-footer-socials" id="official-information">
          <p>Official Informations:</p>
          <div aria-label="公式SNS">
            <a className="x" href="https://x.com/KingOfKings_JPN" target="_blank" rel="noreferrer" aria-label="KING OF KINGS公式X"><img width="48" height="48" src="/assets/img/social-x.svg" alt="" /></a>
            <a className="instagram" href="https://www.instagram.com/kingofkings_jp/" target="_blank" rel="noreferrer" aria-label="KING OF KINGS公式Instagram"><img width="48" height="48" src="/assets/img/social-instagram.svg" alt="" /></a>
          </div>
        </div>
        <div className="kok-footer-main">
          <div className="kok-footer-event">
            <img width="2030" height="665" src="/assets/img/kok-fontlogo.svg" alt="KING OF KINGS" loading="lazy" />
          </div>
          <nav aria-label="フッターリンク"><span>サイトのご利用について</span><i>|</i><span>プライバシーポリシー</span></nav>
          <div className="kok-footer-mowl">
            <img width="725" height="477" src="/assets/img/mowl-logo.svg" alt="mowl" loading="lazy" />
            <small>Powered by mowl Osaka</small>
          </div>
          <p className="kok-copyright">© 2026 KING OF KINGS. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
      <div className="videoBg"><video src="/assets/img/final/back.mp4" poster="/assets/img/final/bg_gf.jpg" autoPlay loop playsInline muted preload="auto" /></div>
    </div>
  );
}

function SectionHeading({ en, ja }: { en: string; ja: string }) {
  return <h2 className="kok-section-heading"><strong>{en}</strong><span className="jp">{ja}</span></h2>;
}

function TableRow({ th, children }: { th: string; children: React.ReactNode }) {
  return <div className="tr"><div className="th">{th}</div><div className="td">{children}</div></div>;
}
