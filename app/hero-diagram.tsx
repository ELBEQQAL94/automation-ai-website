export function HeroDiagram() {
  const sources = [
    { label: "Intake form", y: 24 },
    { label: "Task board", y: 96 },
    { label: "Spreadsheet", y: 168 },
  ];

  return (
    <svg
      viewBox="0 0 480 220"
      className="relative z-10 h-auto w-full"
      role="img"
      aria-label="Diagram showing multiple tools feeding into an automated workflow with a human approval step"
    >
      {sources.map((s) => (
        <g key={s.label}>
          <line
            x1="118"
            y1={s.y + 12}
            x2="200"
            y2="108"
            stroke="currentColor"
            className="text-outline-variant"
            strokeWidth="1.5"
            strokeDasharray="4 5"
          />
          <rect
            x="6"
            y={s.y}
            width="112"
            height="24"
            rx="12"
            className="fill-surface-container-high"
          />
          <text
            x="62"
            y={s.y + 16}
            textAnchor="middle"
            className="fill-on-surface-variant font-mono text-[9px] uppercase tracking-wide"
          >
            {s.label}
          </text>
        </g>
      ))}

      <circle cx="240" cy="108" r="40" className="fill-primary-container" />
      <path
        d="M224 108l11 11 21-23"
        style={{ stroke: "var(--on-primary-container)" }}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <text
        x="240"
        y="164"
        textAnchor="middle"
        className="fill-on-surface-variant font-mono text-[9px] uppercase tracking-wide"
      >
        Human approval
      </text>

      <line
        x1="280"
        y1="108"
        x2="356"
        y2="108"
        stroke="currentColor"
        className="text-primary"
        strokeWidth="1.5"
      />
      <rect
        x="360"
        y="90"
        width="114"
        height="36"
        rx="12"
        className="fill-primary"
      />
      <text
        x="417"
        y="112"
        textAnchor="middle"
        className="fill-on-primary font-mono text-[9px] uppercase tracking-wide"
      >
        Action taken
      </text>
    </svg>
  );
}
