import Image from "next/image";
import { couple, invitation, mainEvent } from "@/content/wedding";
import { clockLabel, istInstant, longDate } from "@/lib/dates";
import { Countdown } from "./Countdown";
import { FloralRule } from "./Icons";

export function Footer() {
  const start = istInstant(mainEvent.date, mainEvent.start).toISOString();

  return (
    <footer className="site-footer">
      <div className="footer-landscape" aria-hidden="true">
        <Image src="/images/footer.svg" alt="" fill className="footer-art" sizes="100vw" />
      </div>
      <div className="footer-content section-shell">
        <section className="countdown-section" aria-labelledby="countdown-heading">
          <div className="countdown-intro">
            <p className="countdown-prelude">Until we celebrate together</p>
            <h2 id="countdown-heading">Counting the moments</h2>
          </div>
          <Countdown target={start} />
          <noscript>
            The wedding begins on {longDate(mainEvent.date)} at {clockLabel(mainEvent.start)} {invitation.timezoneLabel}.
          </noscript>
        </section>
        <FloralRule />
        <p className="footer-with-love">With love,</p>
        <p className="footer-names">
          {couple.bride.name} <span>&amp;</span> {couple.groom.name}
        </p>
        <p className="footer-date">{longDate(mainEvent.date)}</p>
        <p className="footer-wish">{invitation.footerWish}</p>
        <a href="#main" className="back-top">
          Back to the invitation ↑
        </a>
      </div>
    </footer>
  );
}
