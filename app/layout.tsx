import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "./vanta-exact.css";

// Measured (HAR/MHTML): the reference loads Plus Jakarta Sans, weights
// 400/500/600/700, via next/font — real, freely-usable Google Font, not a
// guessed system-font stack.
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kingofkings.jp"),
  title: "KING OF KINGS | YO-YO CHAMPIONSHIP 2026",
  description: "賞金100万円。ヨーヨーメーカー選抜選手が頂点を競う、KING OF KINGS公式イベントサイト。2026年8月19日 mowl OSAKA開催。",
  openGraph: {
    title: "KING OF KINGS | YO-YO CHAMPIONSHIP 2026",
    description: "賞金100万円。キングの中のキングを決めるヨーヨー大会。",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#000000",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={plusJakartaSans.variable}>
      <body>{children}</body>
    </html>
  );
}
