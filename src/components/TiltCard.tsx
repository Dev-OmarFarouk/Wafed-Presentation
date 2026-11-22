import type { ReactNode } from "react";
import { useTilt } from "../engine/runtime";

export function TiltCard({
  children,
  className = "",
  strength = 6,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const { ref, handlers } = useTilt(strength);

  return (
    <div
      ref={ref}
      {...handlers}
      className={`tilt-surface ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}
