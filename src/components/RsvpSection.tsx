import Image from "next/image";
import { FloralRule } from "./Icons";
import { RsvpForm } from "./RsvpForm";

export function RsvpSection() {
  return (
    <section id="rsvp" className="rsvp-section" aria-labelledby="rsvp-title">
      <div className="rsvp-layout section-shell">
        <div className="rsvp-intro">
          <div className="rsvp-heading">
            <h2 id="rsvp-title">Will you join us?</h2>
            <FloralRule />
            <p>It would mean so much to celebrate with you. Let us know which moments you’ll be joining.</p>
          </div>
          <div className="rsvp-artwork">
            <Image
              src="/images/lamp.svg"
              alt="Painted brass lamp garlanded with jasmine"
              width={340}
              height={340}
              className="rsvp-art"
            />
          </div>
        </div>
        <RsvpForm />
      </div>
    </section>
  );
}
