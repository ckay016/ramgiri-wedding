// Everything a guest reads on the invitation lives here.
// Replace the placeholder names, dates and venues with the real details.

export type Choice = { value: string; label: string };

export type ArrivalOption = Choice & {
  /** Ask whether the couple should arrange a stay when this option is chosen. */
  offerStay?: boolean;
};

export type Celebration = {
  id: string;
  title: string;
  /** ISO date, YYYY-MM-DD (India Standard Time). */
  date: string;
  /** 24h start time, HH:MM (IST). */
  start: string;
  /** 24h end time, HH:MM (IST). Leave out for open-ended events. */
  end?: string;
  timeLabel: string;
  meal?: string;
  region: string;
  /** Short place name shown in the RSVP form, e.g. "Kerala". */
  shortPlace: string;
  venue: { name: string; address: string[]; mapsQuery: string; mapsUrl?: string };
  art: { src: string; alt: string };
  arrival?: { question: string; options: ArrivalOption[] };
  /** Ask about an overnight stay for every guest who says yes. */
  offerStay?: boolean;
};

export const couple = {
  bride: { name: "Gireesa", initial: "G" },
  groom: { name: "Rampratap", initial: "R" },
};

export const coupleNames = `${couple.bride.name} & ${couple.groom.name}`;

export const invitation = {
  blessing: "With the blessings of Lord Ganapati",
  family: "Together with our families",
  inviteLine: "invite you to celebrate our wedding",
  footerWish: "Your presence is our most cherished gift.",
  timezoneLabel: "IST",
  timezone: "Asia/Kolkata",
};

export const celebrations: Celebration[] = [
  {
    id: "reception",
    title: "The reception",
    date: "2026-11-14",
    start: "19:00",
    timeLabel: "7:00 PM onwards",
    meal: "Followed by dinner",
    region: "Anantapur, Andhra Pradesh",
    shortPlace: "Anantapur",
    venue: {
      name: "Dwaraka Chalama Reddy Function Hall",
      address: ["Gooty Road", "Anantapur, Andhra Pradesh"],
      mapsQuery: "Dwaraka Chalama Reddy Function Hall, Gooty Road, Anantapur",
      mapsUrl: "https://maps.app.goo.gl/ip6n9sBemfH3mcCL9?g_st=iw",
    },
    art: { src: "/images/event-reception.svg", alt: "Painted temple tower with festive lamps" },
  },
  {
    id: "wedding",
    title: "The wedding",
    date: "2026-11-15",
    start: "09:50",
    end: "10:20",
    timeLabel: "9:50 AM – 10:20 AM",
    meal: "Muhurtham at Dhanassu Lagnam, followed by lunch",
    region: "Anantapur, Andhra Pradesh",
    shortPlace: "Anantapur",
    venue: {
      name: "Dwaraka Chalama Reddy Function Hall",
      address: ["Gooty Road", "Anantapur, Andhra Pradesh"],
      mapsQuery: "Dwaraka Chalama Reddy Function Hall, Gooty Road, Anantapur",
      mapsUrl: "https://maps.app.goo.gl/ip6n9sBemfH3mcCL9?g_st=iw",
    },
    art: { src: "/images/event-wedding.svg", alt: "Painted tiled-roof hall among coconut palms" },
  },
];

export const mainEvent = celebrations[1];
