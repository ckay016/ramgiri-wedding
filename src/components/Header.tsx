import { coupleNames, mainEvent } from "@/content/wedding";
import { longDate } from "@/lib/dates";

export function Header() {
  return (
    <header className="site-header">
      <a href="#main" className="monogram" aria-label={`${coupleNames} — top of the invitation`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/logo.svg" alt="" width={52} height={52} className="logo" />
      </a>
      <time className="header-date" dateTime={mainEvent.date}>
        {longDate(mainEvent.date)}
      </time>
      <nav aria-label="Invitation">
        <a href="#celebrations">Celebrations</a>
      </nav>
    </header>
  );
}
