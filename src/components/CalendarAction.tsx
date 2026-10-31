"use client";

import { useRef } from "react";
import { coupleNames, invitation, type Celebration } from "@/content/wedding";
import { googleCalendarUrl, icsDataUrl, longDate } from "@/lib/dates";
import { CalendarIcon, Download } from "./Icons";

export function CalendarAction({ event }: { event: Celebration }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = `${event.id}-calendar-title`;

  return (
    <>
      <button type="button" className="event-button event-button-secondary" onClick={() => dialog.current?.showModal()}>
        <CalendarIcon /> Add to calendar
      </button>
      <dialog
        ref={dialog}
        className="calendar-dialog"
        aria-labelledby={titleId}
        onClick={(e) => {
          // A click on the backdrop lands on the dialog element itself.
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
      >
        <div className="calendar-dialog-content">
          <button
            type="button"
            className="calendar-dialog-close"
            aria-label="Close calendar options"
            onClick={() => dialog.current?.close()}
          >
            ×
          </button>
          <p className="eyebrow">Mark your calendar</p>
          <h3 id={titleId}>Save the date</h3>
          <p className="calendar-event-name">{event.title}</p>
          <p>{coupleNames}</p>
          <p className="calendar-meta">
            {longDate(event.date)} · {event.timeLabel} {invitation.timezoneLabel}
          </p>
          <p className="calendar-meta">
            {event.venue.name}, {event.region}
          </p>
          <div className="calendar-options">
            <a className="calendar-option google" href={googleCalendarUrl(event)} target="_blank" rel="noreferrer">
              <CalendarIcon /> Google Calendar
            </a>
            <a className="calendar-option native" href={icsDataUrl(event)} download={`${event.id}.ics`}>
              <Download /> Download .ics
            </a>
          </div>
          <p className="calendar-note-small">
            Confirm the event in your calendar. Its usual reminder settings apply; check that a reminder is enabled.
          </p>
          {!event.end && (
            <p className="calendar-note-small">
              Google uses a one-hour calendar slot; the actual finishing time is open-ended.
            </p>
          )}
        </div>
      </dialog>
    </>
  );
}
