import ScrollReveal from "./ScrollReveal";
import { CardCornerMarks, SectionHeading } from "./ui";
import { eventMeta, schedule } from "./data";

export default function ScheduleScene() {
  return (
    <section className="streaming" id="schedule">
      <div className="inner">
        <SectionHeading en="TIME TABLE" ja="タイムテーブル" />
        <div className="tableWrap kok-time-wrap kok-section-card" data-label="TIME TABLE">
          <CardCornerMarks />
          <h3>{eventMeta.dateLabel}</h3>
          <p className="schedule-location">{eventMeta.venueName} / OSAKA, JAPAN</p>
          <ScrollReveal selector="li" y={20} stagger={0.12}>
            <ul className="kok-timeline">
              {schedule.map((item, index) => (
                <li key={item.time}>
                  <span className="seq">0{index + 1}</span>
                  <time>{item.time}</time>
                  <div>
                    <strong>{item.ja}</strong>
                    <small>{item.en}</small>
                  </div>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
