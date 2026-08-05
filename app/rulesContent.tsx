import type { ReactNode } from "react";

export type RuleCategory = {
  no: string;
  en: string;
  ja: string;
  summary: string;
  body: ReactNode;
  /** Extra class applied directly to the .kok-rule-detail-body wrapper (not a nested div) so grid layouts get the same single-element padding as the original markup. */
  bodyClassName?: string;
};

// Full confirmed RULES text. RulesScene reveals no/en/ja/summary one at a
// time while pinned; RulesDetails renders the same array as an accessible
// accordion carrying the full body text, so nothing here is ever hidden or
// omitted, only progressively disclosed.
export const ruleCategories: RuleCategory[] = [
  {
    no: "01",
    en: "PERFORMANCE",
    ja: "演技ルール",
    summary: "演技は1人1回、120秒以上180秒未満。",
    body: (
      <ul>
        <li>演技は原則として1人1回です。</li>
        <li>演技時間は120秒以上180秒未満。音源の最初の音が鳴った瞬間から計測します。</li>
        <li>120秒未満は失格。180秒到達時点で音源をフェードアウトし、採点を終了します。</li>
        <li>180秒到達後の演技は採点対象外です。無音で継続した場合は採点対象外に加え、ペナルティを科します。</li>
        <li>演技終了後、退出指示に従わない場合は失格となります。</li>
      </ul>
    ),
  },
  {
    no: "02",
    en: "JUDGING",
    ja: "審査カテゴリー",
    summary: "TECHNICAL / PERFORMANCE / FUTURE IMPACT、各2名。",
    bodyClassName: "kok-judge-grid",
    body: (
      <>
        <article>
          <b>TECHNICAL</b>
          <em>2名</em>
          <p>難易度 / 精度 / 構成 / 完成度 / リスク / コントロール</p>
        </article>
        <article>
          <b>PERFORMANCE</b>
          <em>2名</em>
          <p>音楽との調和 / 表現力 / 構成 / 伝達力 / 演技の流れ</p>
        </article>
        <article>
          <b>FUTURE IMPACT</b>
          <em>2名</em>
          <p>独創性 / 新しい価値観 / シーンへの影響 / 次世代への影響</p>
        </article>
      </>
    ),
  },
  {
    no: "03",
    en: "SCORING",
    ja: "採点方式",
    summary: "6名のジャッジによる順位点の合計で決定。",
    body: (
      <>
        <div className="kok-score-scale" aria-label="順位点">
          <span><b>1位</b><em>1点</em></span>
          <span><b>2位</b><em>2点</em></span>
          <span><b>3位</b><em>3点</em></span>
          <span><b>4位</b><em>4点</em></span>
          <span><b>5位</b><em>5点</em></span>
          <span><b>圏外</b><em>6点</em></span>
        </div>
        <ul>
          <li>各ジャッジがカテゴリーごとに上位5名を順位付けします。</li>
          <li>6名のジャッジによる順位点を合計し、合計順位点が低い選手を上位とします。</li>
          <li>同一ジャッジが複数選手へ同順位を付けることはできません。</li>
        </ul>
      </>
    ),
  },
  {
    no: "04",
    en: "TIE BREAK",
    ja: "同点時の処理",
    summary: "Future Impact担当2名の順位点で比較。",
    body: (
      <ol>
        <li>Future Impact担当2名の合計順位点を比較し、低い選手を上位とします。</li>
        <li>なお同点の場合、ジャッジ6名と主催者1名の計7名で協議します。</li>
        <li>最もインパクトを残した選手1名へ投票します。</li>
        <li>3名以上の同点時は、必要に応じて決選投票を行います。</li>
      </ol>
    ),
  },
  {
    no: "05",
    en: "CONDUCT",
    ja: "選手ルール・禁止事項",
    summary: "用具は各自で準備。危険物・妨害行為は禁止。",
    bodyClassName: "kok-conduct-grid",
    body: (
      <>
        <article>
          <h4>選手ルール</h4>
          <ul>
            <li>用具は各自で準備</li>
            <li>補助者のステージ参加は事前許可制</li>
            <li>受付・出演時刻を厳守</li>
            <li>運営スタッフの指示に従う</li>
          </ul>
        </article>
        <article>
          <h4>禁止事項</h4>
          <ul>
            <li>危険物・火気・液体の使用</li>
            <li>他選手・ジャッジへの妨害</li>
            <li>差別的・侮辱的・不適切な表現</li>
            <li>大会の公平性を損なう行為</li>
          </ul>
        </article>
      </>
    ),
  },
  {
    no: "06",
    en: "SUPPORT",
    ja: "トラブル対応・補足",
    summary: "運営側のトラブルでは再演技を認める場合があります。",
    body: (
      <ul>
        <li>運営側のトラブルでは、再演技を認める場合があります。</li>
        <li>選手側のトラブルは原則として自己責任です。</li>
        <li>再演技の可否は大会責任者・審査責任者が判断します。</li>
        <li>観客投票の有無・方法、音源の提出形式・期限は後日発表します。</li>
        <li>一部詳細は公式Instagram・Webで順次お知らせします。</li>
      </ul>
    ),
  },
];
