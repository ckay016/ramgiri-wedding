type IconProps = { className?: string };

export function Lotus({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 26 22" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
      <path d="M13 3c2.6 2.8 3.4 6.4 0 11.5C9.6 9.4 10.4 5.8 13 3Z" />
      <path d="M13 14.5c-1.4-4.3-4.2-6.9-8.6-7.6.2 4.5 3.4 7.3 8.6 7.6Z" />
      <path d="M13 14.5c1.4-4.3 4.2-6.9 8.6-7.6-.2 4.5-3.4 7.3-8.6 7.6Z" />
      <path d="M13 14.5c-3.2-1.7-6.9-1.9-11-.4 2.6 3 6.8 3.3 11 .4Zm0 0c3.2-1.7 6.9-1.9 11-.4-2.6 3-6.8 3.3-11 .4Z" />
      <path d="M7 19h12" strokeLinecap="round" />
    </svg>
  );
}

export function FloralRule({ className = "" }: IconProps) {
  return (
    <div className={`floral-rule ${className}`} aria-hidden="true">
      <span /> <Lotus /> <span />
    </div>
  );
}

export function ArrowRight({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <path d="M0 5h15M11 1l4 4-4 4" />
    </svg>
  );
}

export function Pin({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <path d="M8 14.5s4.5-4.2 4.5-8a4.5 4.5 0 0 0-9 0c0 3.8 4.5 8 4.5 8Z" />
      <circle cx="8" cy="6.5" r="1.6" />
    </svg>
  );
}

export function CalendarIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <rect x="2" y="3" width="12" height="11" rx="1" />
      <path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3" />
    </svg>
  );
}

export function Download({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <path d="M8 2v8M4.5 7 8 10.5 11.5 7M2.5 13.5h11" />
    </svg>
  );
}

export function Person({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <circle cx="8" cy="5.5" r="2.8" />
      <path d="M2.5 14c.7-2.8 2.8-4.3 5.5-4.3s4.8 1.5 5.5 4.3" />
    </svg>
  );
}

export function Envelope({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <rect x="1.5" y="3.5" width="13" height="9" rx="1" />
      <path d="m2 4 6 5 6-5" />
    </svg>
  );
}

export function Lock({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <rect x="3" y="7" width="10" height="7" rx="1" />
      <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
    </svg>
  );
}

/** Thin gold rays drawn behind the blessing artwork. */
export function Halo({ className }: IconProps) {
  const rays = Array.from({ length: 48 }, (_, i) => i * 7.5);
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" stroke="currentColor" aria-hidden="true">
      <circle cx="100" cy="100" r="96" strokeWidth=".6" />
      <circle cx="100" cy="100" r="90" strokeWidth=".4" strokeDasharray="1 3" />
      {rays.map((deg) => (
        <line
          key={deg}
          x1="100"
          y1={deg % 15 === 0 ? 14 : 20}
          x2="100"
          y2="26"
          strokeWidth=".6"
          transform={`rotate(${deg} 100 100)`}
        />
      ))}
    </svg>
  );
}
