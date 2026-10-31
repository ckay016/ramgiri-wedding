import Image from "next/image";
import { celebrations, invitation } from "@/content/wedding";
import { directionsUrl, longDate, mapsUrl } from "@/lib/dates";
import { CalendarAction } from "./CalendarAction";
import { ArrowRight, FloralRule, Pin } from "./Icons";

export function Celebrations() {
  return (
    <section id="celebrations" className="celebrations section-shell" aria-labelledby="celebrations-title">
      <div className="section-heading">
        <h2 id="celebrations-title">Our celebrations</h2>
        <FloralRule />
      </div>

      <div className="event-list">
        {celebrations.map((event) => (
          <article key={event.id} className="event-card" aria-labelledby={`${event.id}-title`}>
            <Image
              src={event.art.src}
              alt={event.art.alt}
              width={600}
              height={400}
              className="event-art"
              sizes="(max-width: 767px) calc(100vw - 84px), (max-width: 1050px) 552px, 444px"
            />
            <div className="event-story">
              <p className="event-date">
                <time dateTime={event.date}>{longDate(event.date)}</time>
              </p>
              <h3 id={`${event.id}-title`}>{event.title}</h3>
              <p className="event-region">{event.region}</p>
              <p className="event-time">
                {event.timeLabel}
                <span className="timezone"> {invitation.timezoneLabel}</span>
              </p>
              {event.meal && <p className="event-meal">{event.meal}</p>}
            </div>
            <div className="event-venue">
              <h4>{event.venue.name}</h4>
              <address>
                {event.venue.address.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </address>
            </div>
            <div className="event-links">
              <div className="event-actions">
                <a className="event-button event-button-primary" href={directionsUrl(event)} target="_blank" rel="noreferrer">
                  <Pin /> Get directions
                </a>
                <CalendarAction event={event} />
              </div>
              <a className="venue-link" href={mapsUrl(event)} target="_blank" rel="noreferrer">
                View venue on Google Maps <span className="sr-only">for {event.title.toLowerCase()}</span>
                <ArrowRight />
              </a>
            </div>
          </article>
        ))}
      </div>

      <p className="calendar-note">
        All times are in India Standard Time. Choose Add to calendar to save the date in your preferred calendar.
      </p>
    </section>
  );
}
