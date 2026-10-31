import Image from "next/image";
import { couple, invitation, mainEvent } from "@/content/wedding";
import { clockLabel, fullDate } from "@/lib/dates";
import { Halo } from "./Icons";

export function Hero() {
  return (
    <section className="hero" aria-labelledby="couple-names">
      <div className="hero-landscape" aria-hidden="true">
        <Image src="/images/hero.svg" alt="" fill priority className="hero-art" sizes="100vw" />
      </div>
      <div className="hero-content">
        <div className="blessing-wrap">
          <Halo className="blessing-halo" />
          <Image
            src="/images/ganapati.avif"
            alt="Lord Ganapati blessing"
            width={240}
            height={240}
            priority
            className="blessing-art"
          />
        </div>
        <p className="blessing">{invitation.blessing}</p>
        <div className="hero-invitation">
          <p className="hero-family">{invitation.family}</p>
          <h1 id="couple-names">
            <span>{couple.bride.name}</span>
            <span className="hero-amp">&amp;</span>
            <span>{couple.groom.name}</span>
          </h1>
          <p className="hero-invite-line">{invitation.inviteLine}</p>
          <p className="hero-date">
            <time dateTime={mainEvent.date}>{fullDate(mainEvent.date)}</time>
          </p>
          <p className="hero-location">
            {clockLabel(mainEvent.start)} {invitation.timezoneLabel} <span aria-hidden="true">·</span>{" "}
            {mainEvent.region}
          </p>
          <a href="#celebrations" className="hero-scroll">
            <span>Explore the celebrations</span>
            <span className="scroll-caret" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
