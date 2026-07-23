type IconProps = {
  className?: string;
};

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function BotIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect x="4" y="8" width="16" height="12" rx="3" />
      <path d="M12 8V4" />
      <circle cx="12" cy="3" r="1" />
      <circle cx="9" cy="13.5" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="15" cy="13.5" r="1.25" fill="currentColor" stroke="none" />
      <path d="M9 17h6" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
    </svg>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function AlertTriangleIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M12 3.5 21 20H3L12 3.5Z" />
      <path d="M12 9.5v4.5" />
      <circle cx="12" cy="17" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function UserMinusIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <circle cx="9.5" cy="8" r="3.5" />
      <path d="M3 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
      <path d="M16 11h5" />
    </svg>
  );
}

export function CloudSyncIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M7 18a4.5 4.5 0 0 1-.5-8.97 5.5 5.5 0 0 1 10.7-1.7A4 4 0 0 1 17 18H7Z" />
      <path d="m10 13-1.5 1.5L10 16" />
      <path d="m14 13 1.5 1.5L14 16" />
    </svg>
  );
}

export function DatabaseIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <ellipse cx="12" cy="6" rx="7" ry="2.75" />
      <path d="M5 6v6c0 1.5 3.1 2.75 7 2.75s7-1.25 7-2.75V6" />
      <path d="M5 12v6c0 1.5 3.1 2.75 7 2.75s7-1.25 7-2.75v-6" />
    </svg>
  );
}

export function PlugIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M9 3v4" />
      <path d="M15 3v4" />
      <path d="M7 7h10v4a5 5 0 0 1-10 0V7Z" />
      <path d="M12 16v5" />
    </svg>
  );
}

export function ChecklistIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M4 6.5 5.5 8 8 5.5" />
      <path d="M11 6.5h9" />
      <path d="M4 12.5 5.5 14l2.5-2.5" />
      <path d="M11 12.5h9" />
      <path d="M4 18.5 5.5 20l2.5-2.5" />
      <path d="M11 18.5h9" />
    </svg>
  );
}

export function GaugeIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M4 15a8 8 0 1 1 16 0" />
      <path d="M12 15 15.5 10" />
      <circle cx="12" cy="15" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TrendingUpIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="m4 16 5.5-5.5 3.5 3.5L20 6.5" />
      <path d="M15 6.5h5v5" />
    </svg>
  );
}

export function UnlockIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7.5a4 4 0 0 1 7.5-1.9" />
    </svg>
  );
}

export function SparkleIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M12 3v3.5" />
      <path d="M12 17.5V21" />
      <path d="M3 12h3.5" />
      <path d="M17.5 12H21" />
      <path d="m6 6 2.2 2.2" />
      <path d="m15.8 15.8 2.2 2.2" />
      <path d="m18 6-2.2 2.2" />
      <path d="m8.2 15.8-2.2 2.2" />
    </svg>
  );
}
