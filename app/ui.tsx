export function SectionHeading({ en, ja }: { en: string; ja: string }) {
  return (
    <h2 className="kok-section-heading">
      <strong>{en}</strong>
      <span className="jp">{ja}</span>
    </h2>
  );
}

export function TableRow({ th, children }: { th: string; children: React.ReactNode }) {
  return (
    <div className="tr">
      <div className="th">{th}</div>
      <div className="td">{children}</div>
    </div>
  );
}

export function CardCornerMarks() {
  return (
    <span className="kok-card-corners" aria-hidden="true">
      <img className="kok-card-corner kok-card-corner--top" width="270" height="499" src="/assets/img/kok-k-piece.svg" alt="" loading="lazy" />
      <img className="kok-card-corner kok-card-corner--bottom" width="270" height="499" src="/assets/img/kok-k-piece.svg" alt="" loading="lazy" />
    </span>
  );
}
