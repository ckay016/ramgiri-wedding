"use client";

import Image from "next/image";
import { useState } from "react";
import { celebrations, type Celebration, type Choice } from "@/content/wedding";
import { dayMonth } from "@/lib/dates";
import {
  emptyPayload,
  LIMITS,
  needsStayQuestion,
  validateRsvp,
  type EventResponse,
  type RsvpPayload,
} from "@/lib/rsvp";
import { ArrowRight, Envelope, FloralRule, Lock, Lotus, Person } from "./Icons";

type Status = { kind: "editing" } | { kind: "sending" } | { kind: "sent"; attending: boolean };

const ATTENDANCE: Choice[] = [
  { value: "yes", label: "We’ll be there" },
  { value: "no", label: "We won’t be able to make it" },
];

const STAY: Choice[] = [
  { value: "yes", label: "Yes, please" },
  { value: "no", label: "No, thank you — we’ll arrange our own" },
];

function newSubmissionId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p className="field-error" id={`${id}-error`} role="alert">
      {message}
    </p>
  ) : null;
}

function ChoiceGroup({
  name,
  value,
  options,
  onChange,
  error,
}: {
  name: string;
  value: string;
  options: Choice[];
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <>
      <div className="choice-group">
        {options.map((option, i) => (
          <label key={option.value} className={`choice ${value === option.value ? "selected" : ""}`}>
            <input
              id={i === 0 ? name : `${name}-${i}`}
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              aria-describedby={error ? `${name}-error` : undefined}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      <FieldError id={name} message={error} />
    </>
  );
}

function EventChoice({
  event,
  ordinal,
  value,
  onChange,
  errors,
}: {
  event: Celebration;
  ordinal: number;
  value: EventResponse;
  onChange: (value: EventResponse) => void;
  errors: Record<string, string>;
}) {
  const update = (patch: Partial<EventResponse>) => onChange({ ...value, ...patch });
  const id = event.id;

  return (
    <fieldset className="rsvp-event">
      <legend>
        <span className="rsvp-event-ornament" aria-hidden="true">
          <span>{String(ordinal).padStart(2, "0")}</span>
          <span className="floral-rule">
            <span /> <Lotus /> <span />
          </span>
        </span>
        <span className="rsvp-event-name">{event.title}</span>
        <span className="rsvp-event-date">
          {dayMonth(event.date)} · {event.shortPlace}
        </span>
      </legend>
      <div className="rsvp-event-body">
        <ChoiceGroup
          name={id}
          value={value.attending}
          options={ATTENDANCE}
          error={errors[id]}
          onChange={(attending) =>
            update(attending === "no" ? { attending: "no", arrival: "", stay: "" } : { attending: "yes" })
          }
        />
        {value.attending === "yes" && (
          <div className="conditional-fields">
            <div className="guest-count-field">
              <label htmlFor={`${id}.guestCount`}>Guests, including you</label>
              <select
                id={`${id}.guestCount`}
                value={value.guestCount}
                onChange={(e) => update({ guestCount: e.target.value })}
                aria-invalid={Boolean(errors[`${id}.guestCount`])}
              >
                {Array.from({ length: LIMITS.guests }, (_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1} {i === 0 ? "guest" : "guests"}
                  </option>
                ))}
              </select>
              <FieldError id={`${id}.guestCount`} message={errors[`${id}.guestCount`]} />
            </div>
            {event.arrival && (
              <fieldset className="travel-field">
                <legend>{event.arrival.question}</legend>
                <ChoiceGroup
                  name={`${id}.arrival`}
                  value={value.arrival}
                  options={event.arrival.options}
                  error={errors[`${id}.arrival`]}
                  onChange={(arrival) => update({ arrival, stay: "" })}
                />
              </fieldset>
            )}
            {needsStayQuestion(event, value) && (
              <fieldset className="travel-field">
                <legend>
                  {event.offerStay
                    ? "Would you like us to arrange an overnight stay for your visit?"
                    : "Would you like us to arrange your stay for the night before?"}
                </legend>
                <ChoiceGroup
                  name={`${id}.stay`}
                  value={value.stay}
                  options={STAY}
                  error={errors[`${id}.stay`]}
                  onChange={(stay) => update({ stay })}
                />
              </fieldset>
            )}
          </div>
        )}
      </div>
    </fieldset>
  );
}

function Decorations() {
  return (
    <>
      <Image src="/images/form-corner.svg" alt="" aria-hidden="true" width={360} height={360} className="rsvp-decoration rsvp-decoration-top" />
      <Image src="/images/form-corner.svg" alt="" aria-hidden="true" width={360} height={360} className="rsvp-decoration rsvp-decoration-bottom" />
    </>
  );
}

export function RsvpForm() {
  const [form, setForm] = useState<RsvpPayload>(emptyPayload);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>({ kind: "editing" });
  const [notice, setNotice] = useState("");
  // Reused across retries so the server can ignore a duplicate of the same response.
  const [submissionId, setSubmissionId] = useState(newSubmissionId);

  const set = <K extends keyof RsvpPayload>(key: K, value: RsvpPayload[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => {
      if (!e[key as string]) return e;
      const rest = { ...e };
      delete rest[key as string];
      return rest;
    });
  };

  const setEvent = (id: string, value: EventResponse) => {
    setForm((f) => ({ ...f, events: { ...f.events, [id]: value } }));
    setErrors((e) => Object.fromEntries(Object.entries(e).filter(([k]) => k !== id && !k.startsWith(`${id}.`))));
  };

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === "sending") return;
    setNotice("");

    const found = validateRsvp(form);
    setErrors(found);
    const firstError = Object.keys(found)[0];
    if (firstError) {
      setNotice("A few details still need your attention.");
      document.getElementById(firstError)?.focus();
      return;
    }

    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, submissionId }),
      });
      if (res.status === 422) {
        const body = (await res.json().catch(() => ({}))) as { errors?: Record<string, string> };
        setErrors(body.errors ?? {});
        throw new Error("The server couldn’t accept these details. Please check your choices and try again.");
      }
      if (res.status === 429) {
        throw new Error("Too many attempts have been made from this connection. Please wait and try again later. Your choices are still here.");
      }
      if (!res.ok) throw new Error();
      const attending = Object.values(form.events).some((r) => r.attending === "yes");
      setStatus({ kind: "sent", attending });
      document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      setStatus({ kind: "editing" });
      setNotice(
        err instanceof Error && err.message
          ? err.message
          : "Your response couldn’t be sent just now. Your choices are still here — please check your connection and try again, or contact the couple.",
      );
    }
  }

  function startAnother() {
    setForm(emptyPayload());
    setErrors({});
    setNotice("");
    setSubmissionId(newSubmissionId());
    setStatus({ kind: "editing" });
  }

  if (status.kind === "sent") {
    return (
      <div className="rsvp-success" role="status">
        <Decorations />
        <p className="eyebrow">Response received</p>
        <h3>Thank you</h3>
        <p>
          {status.attending
            ? "We’ve received your response and look forward to celebrating with you."
            : "We’ll miss you at the celebrations. Thank you for letting us know and for being part of our lives."}
        </p>
        <Lotus />
        <button type="button" className="button secondary" onClick={startAnother}>
          Respond for someone else <ArrowRight />
        </button>
      </div>
    );
  }

  const sending = status.kind === "sending";

  return (
    <form className="rsvp-form" onSubmit={submit} noValidate aria-busy={sending}>
      <Decorations />
      <fieldset className="form-fields" disabled={sending}>
        <legend className="sr-only">Your details and celebration choices</legend>
        <div className="form-topline">
          <h3>Your details</h3>
          <p>One response for you and those coming with you.</p>
        </div>

        <div className="rsvp-contact-fields">
          <div className="field">
            <label htmlFor="guestName">
              Your name <span aria-hidden="true">*</span>
            </label>
            <div className="rsvp-input">
              <Person />
              <input
                id="guestName"
                name="guestName"
                autoComplete="name"
                placeholder="Your full name"
                maxLength={LIMITS.name}
                required
                value={form.guestName}
                onChange={(e) => set("guestName", e.target.value)}
                aria-invalid={Boolean(errors.guestName)}
                aria-describedby={errors.guestName ? "guestName-error" : undefined}
              />
            </div>
            <FieldError id="guestName" message={errors.guestName} />
          </div>
          <div className="field">
            <label htmlFor="contact">
              Email or contact number <span className="optional">(optional)</span>
            </label>
            <div className="rsvp-input">
              <Envelope />
              <input
                id="contact"
                name="contact"
                type="text"
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="Email or phone number"
                maxLength={LIMITS.contact}
                value={form.contact}
                onChange={(e) => set("contact", e.target.value)}
                aria-invalid={Boolean(errors.contact)}
              />
            </div>
            <FieldError id="contact" message={errors.contact} />
          </div>
        </div>

        <FloralRule className="form-divider" />

        <p className="form-instruction">
          Which celebrations will you join?{" "}
          <span>Please choose for each. We’ll ask for a few details if you’re coming.</span>
        </p>

        <div className="rsvp-events-grid">
          {celebrations.map((event, i) => (
            <EventChoice
              key={event.id}
              event={event}
              ordinal={i + 1}
              value={form.events[event.id]}
              onChange={(value) => setEvent(event.id, value)}
              errors={errors}
            />
          ))}
        </div>

        <div className="field message-field">
          <label htmlFor="additionalMessage">
            Anything else you’d like us to know? <span className="optional">(optional)</span>
          </label>
          <textarea
            id="additionalMessage"
            name="additionalMessage"
            rows={2}
            maxLength={LIMITS.message}
            placeholder="A note, a question, or anything we can help with…"
            value={form.additionalMessage}
            onChange={(e) => set("additionalMessage", e.target.value)}
            aria-describedby="message-count"
          />
          <div className="message-bottom">
            <span>Travel, accessibility, or simply a little hello.</span>
            <span id="message-count">
              {form.additionalMessage.length}/{LIMITS.message}
            </span>
          </div>
        </div>
      </fieldset>

      {notice && (
        <p className="notice" role="alert">
          {notice}
        </p>
      )}

      <button type="submit" className="button primary submit-button" disabled={sending}>
        {sending ? (
          <>
            <span className="spinner" aria-hidden="true" />
            Sending your RSVP…
          </>
        ) : (
          <>
            Send RSVP <ArrowRight />
          </>
        )}
      </button>
      <p className="privacy-note">
        <Lock /> Your details are shared only with the wedding organizers.
      </p>
    </form>
  );
}
