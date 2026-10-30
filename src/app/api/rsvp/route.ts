import { NextResponse } from "next/server";
import { celebrations } from "@/content/wedding";
import { normaliseRsvp, validateRsvp } from "@/lib/rsvp";

// Best-effort, per-instance protection. Serverless instances don't share memory,
// so this only slows down obvious repeat submissions.
const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 10;
const attempts = new Map<string, number[]>();
const seenSubmissions = new Set<string>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  attempts.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const submissionId =
    body && typeof body === "object" && typeof (body as { submissionId?: unknown }).submissionId === "string"
      ? (body as { submissionId: string }).submissionId.slice(0, 64)
      : "";
  const rsvp = normaliseRsvp(body);
  const errors = validateRsvp(rsvp);
  if (Object.keys(errors).length) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  if (submissionId && seenSubmissions.has(submissionId)) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  // One flat row per response, ready for a spreadsheet.
  const record: Record<string, string | number> = {
    submittedAt: new Date().toISOString(),
    submissionId,
    guestName: rsvp.guestName,
    contact: rsvp.contact,
    additionalMessage: rsvp.additionalMessage,
  };
  for (const event of celebrations) {
    const r = rsvp.events[event.id];
    record[`${event.id}_attending`] = r.attending;
    record[`${event.id}_guests`] = r.attending === "yes" ? Number(r.guestCount) : 0;
    if (event.arrival) record[`${event.id}_arrival`] = r.arrival;
    if (event.arrival || event.offerStay) record[`${event.id}_stay`] = r.stay;
  }

  const webhook = process.env.RSVP_WEBHOOK_URL;
  if (!webhook) {
    if (process.env.NODE_ENV === "production") {
      console.error("RSVP_WEBHOOK_URL is not set; RSVP was not stored.", record);
      return NextResponse.json({ error: "not_configured" }, { status: 503 });
    }
    console.info("RSVP received (dev, not stored):", record);
  } else {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: process.env.RSVP_WEBHOOK_SECRET ?? "", record }),
        redirect: "follow",
      });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    } catch (err) {
      console.error("Failed to store RSVP", err, record);
      return NextResponse.json({ error: "storage_failed" }, { status: 502 });
    }
  }

  if (submissionId) seenSubmissions.add(submissionId);
  return NextResponse.json({ ok: true });
}
