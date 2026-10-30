import { celebrations, type Celebration } from "@/content/wedding";

export type EventResponse = {
  attending: "" | "yes" | "no";
  guestCount: string;
  arrival: string;
  stay: string;
};

export type RsvpPayload = {
  guestName: string;
  contact: string;
  additionalMessage: string;
  events: Record<string, EventResponse>;
};

export const LIMITS = { name: 100, contact: 160, message: 400, guests: 20 };

export const emptyEventResponse: EventResponse = { attending: "", guestCount: "1", arrival: "", stay: "" };

export function emptyPayload(): RsvpPayload {
  return {
    guestName: "",
    contact: "",
    additionalMessage: "",
    events: Object.fromEntries(celebrations.map((e) => [e.id, { ...emptyEventResponse }])),
  };
}

export function needsStayQuestion(event: Celebration, response: EventResponse) {
  if (response.attending !== "yes") return false;
  if (event.offerStay) return true;
  return Boolean(event.arrival?.options.find((o) => o.value === response.arrival)?.offerStay);
}

/** Field id → message. Shared by the form and the API route. */
export function validateRsvp(payload: RsvpPayload): Record<string, string> {
  const errors: Record<string, string> = {};
  const name = payload.guestName.trim();
  if (!name) errors.guestName = "Please tell us your name.";
  else if (name.length > LIMITS.name) errors.guestName = "Please shorten your name.";
  if (payload.contact.length > LIMITS.contact) errors.contact = "Please shorten this.";
  if (payload.additionalMessage.length > LIMITS.message) errors.additionalMessage = "Please shorten your note.";

  for (const event of celebrations) {
    const r = payload.events[event.id];
    if (!r || (r.attending !== "yes" && r.attending !== "no")) {
      errors[event.id] = "Please choose whether you’ll join us.";
      continue;
    }
    if (r.attending === "no") continue;
    const count = Number(r.guestCount);
    if (!Number.isInteger(count) || count < 1 || count > LIMITS.guests) {
      errors[`${event.id}.guestCount`] = "Please choose how many guests are coming.";
    }
    if (event.arrival && !event.arrival.options.some((o) => o.value === r.arrival)) {
      errors[`${event.id}.arrival`] = "Please let us know when you’ll arrive.";
    }
    if (needsStayQuestion(event, r) && r.stay !== "yes" && r.stay !== "no") {
      errors[`${event.id}.stay`] = "Please let us know about your stay.";
    }
  }
  return errors;
}

/** Keep only known fields so the stored record has a predictable shape. */
export function normaliseRsvp(input: unknown): RsvpPayload {
  const raw = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v : "");
  const events = (raw.events && typeof raw.events === "object" ? raw.events : {}) as Record<string, unknown>;
  return {
    guestName: str(raw.guestName).trim(),
    contact: str(raw.contact).trim(),
    additionalMessage: str(raw.additionalMessage).trim(),
    events: Object.fromEntries(
      celebrations.map((event) => {
        const r = (events[event.id] ?? {}) as Record<string, unknown>;
        const attending = str(r.attending);
        return [
          event.id,
          {
            attending: attending === "yes" || attending === "no" ? attending : "",
            guestCount: str(r.guestCount),
            arrival: str(r.arrival),
            stay: str(r.stay),
          },
        ];
      }),
    ),
  };
}
