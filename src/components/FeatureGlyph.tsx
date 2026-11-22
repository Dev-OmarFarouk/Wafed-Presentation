import { DrawPath } from "./DrawPath";

type GlyphId = "search" | "shield" | "users" | "bus" | "building";

const glyphPaths: Record<GlyphId, string[]> = {
  search: ["M10.5 10.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Z", "M14.8 14.8 21 21"],
  shield: ["M12 2.6 19.4 5.4v6.1c0 4.8-3.2 8-7.4 10-4.2-2-7.4-5.2-7.4-10V5.4Z", "m8.6 11.9 2.3 2.3 4.6-4.8"],
  users: [
    "M9 11.2a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2Z",
    "M2.6 20.6c.5-3.5 3-5.6 6.4-5.6s5.9 2.1 6.4 5.6",
    "M16.4 4.6a3.4 3.4 0 0 1 .5 6.6M18 15.6c2.2.6 3.6 2.4 4 5",
  ],
  bus: [
    "M4.4 4.5h15.2a1.4 1.4 0 0 1 1.4 1.4v9.4a1.4 1.4 0 0 1-1.4 1.4H4.4A1.4 1.4 0 0 1 3 15.3V5.9a1.4 1.4 0 0 1 1.4-1.4Z",
    "M3 10.4h18M7.6 20.4v-3.6M16.4 20.4v-3.6",
    "M7.2 13.4h.01M16.8 13.4h.01",
  ],
  building: [
    "M5 21V7.4L12 3.6l7 3.8V21",
    "M2.8 21h18.4",
    "M9.4 21v-4.6h5.2V21",
    "M8.2 9.4h.01M15.8 9.4h.01M8.2 13h.01M15.8 13h.01",
  ],
};

/** The glyph strokes itself in when `active` becomes true. */
export function FeatureGlyph({
  id,
  active,
  reduced,
  size = 34,
  color = "currentColor",
}: {
  id: GlyphId;
  active: boolean;
  reduced: boolean;
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.55}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {glyphPaths[id].map((d, index) => (
        <DrawPath
          key={d}
          d={d}
          active={active}
          duration={reduced ? 0 : 0.85}
          delay={reduced ? 0 : index * 0.12}
          stroke={color}
        />
      ))}
    </svg>
  );
}
