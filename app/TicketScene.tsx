import ScrollReveal from "./ScrollReveal";
import { CardCornerMarks, SectionHeading } from "./ui";
import { eventMeta, ticket } from "./data";

// Single confirmed CTA — Magma's two-card pricing layout is adapted to one
// primary ticket card rather than inventing a second tier.
export default function TicketScene() {
  return (
    <section className="ticket" id="ticket">
      <div className="inner">
        <SectionHeading en="TICKET" ja="チケット情報" />
        <ScrollReveal y={24}>
          <div className="kok-ticket-panel kok-section-card" data-label="TICKET">
            <CardCornerMarks />
            <p className="kok-ticket-label">{ticket.label}</p>
            <h3>{ticket.headline}</h3>
            <p className="kok-ticket-copy">{ticket.body}</p>
            <a className="kok-ticket-cta" href={eventMeta.ticketUrl} target="_blank" rel="noreferrer">
              {ticket.ctaLabel}<span>↗</span>
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
