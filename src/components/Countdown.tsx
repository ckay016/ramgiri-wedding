"use client";

import { useEffect, useState } from "react";

const UNITS = [
  ["Days", 86_400_000],
  ["Hours", 3_600_000],
  ["Minutes", 60_000],
  ["Seconds", 1_000],
] as const;

function split(ms: number) {
  let rest = Math.max(0, ms);
  return UNITS.map(([label, size]) => {
    const value = Math.floor(rest / size);
    rest -= value * size;
    return { label, value };
  });
}

export function Countdown({ target }: { target: string }) {
  // Rendered as dashes on the server so the markup doesn't depend on the clock.
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const remaining = now === null ? null : new Date(target).getTime() - now;

  if (remaining !== null && remaining <= 0) {
    return <p className="countdown-finished">The celebrations have begun.</p>;
  }

  return (
    <div className="countdown" role="timer" aria-label="Time until the wedding ceremony">
      {(remaining === null ? UNITS.map(([label]) => ({ label, value: null })) : split(remaining)).map(
        ({ label, value }) => (
          <div className="countdown-unit" key={label}>
            <span className="countdown-number" suppressHydrationWarning>
              {value === null ? "—" : String(value).padStart(2, "0")}
            </span>
            <span className="countdown-label">{label}</span>
          </div>
        ),
      )}
    </div>
  );
}
