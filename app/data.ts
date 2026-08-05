// Confirmed KING OF KINGS event data, kept separate from presentation and
// animation code so it can be updated (or, for players/sponsors/ticket,
// replaced with real entries) without touching layout or ScrollTrigger setup.

export type ScheduleItem = { time: string; ja: string; en: string };
export type PlayerEntry = { no: string; name: string; image: string; confirmed: boolean };

export const eventMeta = {
  name: "KING OF KINGS",
  tagline: "一夜で決まる、キングの中のキング。",
  taglineDetail:
    "予選・決勝ラウンドを設けない招待制ヨーヨーコンテスト。6名のジャッジによる順位点の合計で最終順位を決定します。",
  dateLabel: "2026.08.19 WED",
  dateJa: "2026年8月19日（水）",
  doorsJa: "一般入場 14:00 / イベント終了 22:00",
  venueName: "MOWL OSAKA",
  venueNameJa: "mowl OSAKA",
  venueAddress: "〒556-0013 大阪府大阪市浪速区戎本町1丁目2-21",
  prizeAmount: "1,000,000",
  prizeLabel: "優勝賞金",
  ticketUrl: "https://livepocket.jp/e/n4le2",
  mapEmbedUrl:
    "https://www.google.com/maps?q=mowl%20OSAKA%20%E5%A4%A7%E9%98%AA%E5%BA%9C%E5%A4%A7%E9%98%AA%E5%B8%82%E6%B5%AA%E9%80%9F%E5%8C%BA%E6%88%8E%E6%9C%AC%E7%94%BA1%E4%B8%81%E7%9B%AE2-21&output=embed",
  mapLinkUrl:
    "https://www.google.com/maps/search/?api=1&query=mowl%20OSAKA%20%E5%A4%A7%E9%98%AA%E5%BA%9C%E5%A4%A7%E9%98%AA%E5%B8%82%E6%B5%AA%E9%80%9F%E5%8C%BA%E6%88%8E%E6%9C%AC%E7%94%BA1%E4%B8%81%E7%9B%AE2-21",
  socials: {
    x: "https://x.com/KingOfKings_JPN",
    instagram: "https://www.instagram.com/kingofkings_jp/",
  },
};

export const schedule: ScheduleItem[] = [
  { time: "14:00", ja: "一般入場", en: "DOOR OPEN" },
  { time: "17:30", ja: "ゲストパフォーマンス", en: "GUEST PERFORMANCE" },
  { time: "18:30", ja: "コンテスト開始", en: "CONTEST START" },
  { time: "21:30", ja: "表彰式", en: "AWARD CEREMONY" },
  { time: "22:00", ja: "イベント終了", en: "EVENT CLOSE" },
];

// Entrant roster is not finalized. Every slot renders the same neutral,
// non-identifiable placeholder (no real person, team mark, or sponsor mark)
// until the confirmed player list and photos are supplied. PLAYER_COUNT is
// the only thing that drives how many cards render.
export const PLAYER_COUNT = 10;
export const PLACEHOLDER_PLAYER_IMAGE = "/assets/img/players/placeholder-silhouette.svg";

export const players: PlayerEntry[] = Array.from({ length: PLAYER_COUNT }, (_, index) => ({
  name: "TBA",
  image: PLACEHOLDER_PLAYER_IMAGE,
  confirmed: false,
  no: String(index + 1).padStart(2, "0"),
}));

export const ticket = {
  label: "KING OF KINGS 2026 / ADMISSION TICKET",
  headline: "チケット販売情報は近日公開",
  body: "チケットの発売日・料金・入場方法は、決定次第SNSおよびこちらでお知らせします。",
  ctaLabel: "LIVEPOCKETへ",
};

// No sponsor list is confirmed yet. SponsorsScene renders this many empty
// placeholder slots; swap in a real array of {name, logoSrc} entries (and
// drop SPONSOR_SLOT_COUNT) once sponsors are confirmed — the grid layout
// already supports any count.
export const SPONSOR_SLOT_COUNT = 10;
