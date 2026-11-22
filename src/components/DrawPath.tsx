import type { CSSProperties } from "react";

/** A stroke that draws itself using a normalised (pathLength=1) dash offset. */
export function DrawPath({
  d,
  active,
  delay = 0,
  duration = 0.8,
  stroke = "currentColor",
  strokeWidth = 1.6,
  opacityOn = 1,
  opacityOff = 0.25,
  style,
}: {
  d: string;
  active: boolean;
  delay?: number;
  duration?: number;
  stroke?: string;
  strokeWidth?: number;
  opacityOn?: number;
  opacityOff?: number;
  style?: CSSProperties;
}) {
  return (
    <path
      d={d}
      pathLength={1}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="1"
      strokeDashoffset={active ? 0 : 1}
      opacity={active ? opacityOn : opacityOff}
      style={{
        transition: `stroke-dashoffset ${duration}s cubic-bezier(.22,1,.36,1) ${delay}s, opacity .45s ease ${delay}s`,
        ...style,
      }}
    />
  );
}
