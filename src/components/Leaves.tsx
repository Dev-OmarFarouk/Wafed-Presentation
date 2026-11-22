/** Hand drawn eucalyptus-ish branch, mirrored for the four corners. */
export function LeafBranch({
  className = "",
  flip = false,
  tone = "green",
}: {
  className?: string;
  flip?: boolean;
  tone?: "green" | "gold" | "mixed";
}) {
  const deep = tone === "gold" ? "#ca9c5e" : "#0f5e58";
  const soft = tone === "gold" ? "#e3cba1" : "#3f8a80";

  return (
    <svg
      viewBox="0 0 320 360"
      fill="none"
      aria-hidden
      className={`pointer-events-none select-none ${className}`}
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
    >
      <path
        d="M18 342C78 300 116 246 138 190c24-62 58-112 122-146"
        stroke={deep}
        strokeOpacity="0.55"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {[
        { x: 44, y: 316, r: -34, s: 1 },
        { x: 74, y: 282, r: -18, s: 0.92 },
        { x: 100, y: 244, r: -8, s: 1.05 },
        { x: 124, y: 200, r: 8, s: 0.88 },
        { x: 146, y: 154, r: 20, s: 1 },
        { x: 172, y: 112, r: 36, s: 0.9 },
        { x: 204, y: 76, r: 46, s: 1.02 },
        { x: 238, y: 52, r: 58, s: 0.82 },
      ].map((leaf, index) => (
        <g key={index} transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.r}) scale(${leaf.s})`}>
          <path
            d="M0 0c22-6 44 4 54 24-20 12-44 8-58-8 1-6 2-11 4-16Z"
            fill={index % 2 === 0 ? soft : deep}
            fillOpacity={index % 2 === 0 ? 0.2 : 0.28}
          />
          <path d="M2 4c14 2 26 8 38 16" stroke={deep} strokeOpacity="0.35" strokeWidth="1.3" strokeLinecap="round" />
        </g>
      ))}
      <circle cx="262" cy="42" r="4.5" fill="#ca9c5e" fillOpacity="0.55" />
    </svg>
  );
}

/** Four soft corner decorations used as a slide background layer. */
export function LeavesFrame({ opacity = 1 }: { opacity?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ opacity }}>
      <LeafBranch className="leaf-sway absolute -right-6 -top-10 h-[300px] w-[270px]" />
      <LeafBranch className="leaf-sway-slow absolute -bottom-12 -left-8 h-[260px] w-[230px]" flip />
      <div className="absolute left-1/2 top-0 h-[1px] w-[420px] -translate-x-1/2 bg-gradient-to-l from-transparent via-gold/40 to-transparent" />
    </div>
  );
}
