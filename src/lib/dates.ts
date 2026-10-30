import { coupleNames, invitation, type Celebration } from "@/content/wedding";

const IST_OFFSET_MINUTES = 330;

/** A local IST date + time as a real instant. */
export function istInstant(date: string, time: string): Date {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  return new Date(Date.UTC(y, m - 1, d, hh, mm) - IST_OFFSET_MINUTES * 60_000);
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function parts(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return { y, m, d, weekday: WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()] };
}

/** "15 November 2026" */
export function longDate(date: string) {
  const { y, m, d } = parts(date);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/** "Sunday, 15 November 2026" */
export function fullDate(date: string) {
  return `${parts(date).weekday}, ${longDate(date)}`;
}

/** "15 November" */
export function dayMonth(date: string) {
  const { m, d } = parts(date);
  return `${d} ${MONTHS[m - 1]}`;
}

/** "10:30 AM" */
export function clockLabel(time: string) {
  const [hh, mm] = time.split(":").map(Number);
  const suffix = hh >= 12 ? "PM" : "AM";
  return `${((hh + 11) % 12) + 1}:${String(mm).padStart(2, "0")} ${suffix}`;
}

function utcStamp(instant: Date) {
  return instant.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function eventWindow(event: Celebration) {
  const start = istInstant(event.date, event.start);
  // Open-ended events get a one-hour slot so calendars show a block.
  const end = event.end ? istInstant(event.date, event.end) : new Date(start.getTime() + 3_600_000);
  return { start, end };
}

function location(event: Celebration) {
  return [event.venue.name, ...event.venue.address].join(", ");
}

export function mapsUrl(event: Celebration) {
  if (event.venue.mapsUrl) {
    return event.venue.mapsUrl;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${event.venue.name}, ${event.venue.mapsQuery}`,
  )}`;
}

export function directionsUrl(event: Celebration) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${event.venue.name}, ${event.venue.mapsQuery}`,
  )}`;
}

export function googleCalendarUrl(event: Celebration) {
  const { start, end } = eventWindow(event);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${event.title} · ${coupleNames}`,
    dates: `${utcStamp(start)}/${utcStamp(end)}`,
    ctz: invitation.timezone,
    details: `${event.timeLabel} ${invitation.timezoneLabel}${event.meal ? `. ${event.meal}.` : ""}`,
    location: location(event),
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

function icsEscape(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/([,;])/g, "\\$1");
}

export function icsFile(event: Celebration) {
  const { start, end } = eventWindow(event);
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.id}-${event.date}@wedding-invitation`,
    `DTSTAMP:${utcStamp(new Date())}`,
    `DTSTART:${utcStamp(start)}`,
    `DTEND:${utcStamp(end)}`,
    `SUMMARY:${icsEscape(`${event.title} · ${coupleNames}`)}`,
    `LOCATION:${icsEscape(location(event))}`,
    `DESCRIPTION:${icsEscape(`${event.timeLabel} ${invitation.timezoneLabel}${event.meal ? `. ${event.meal}.` : ""}`)}`,
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${icsEscape(event.title)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function icsDataUrl(event: Celebration) {
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(icsFile(event))}`;
}
