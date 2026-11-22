import { useEffect, useRef, useState } from "react";
import { useSlideRuntime } from "../engine/runtime";

export function Counter({
  to,
  duration = 900,
  suffix = "",
  className = "",
}: {
  to: number;
  duration?: number;
  suffix?: string;
  className?: string;
}) {
  const { reducedMotion } = useSlideRuntime();
  const hidden = typeof document !== "undefined" && document.hidden;
  const [value, setValue] = useState(reducedMotion || hidden ? to : 0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (reducedMotion) {
      setValue(to);
      return;
    }
    if (startedRef.current) return;
    startedRef.current = true;
    // rAF can be throttled in a background tab: never leave the count at 0
    const failsafe = window.setTimeout(() => setValue(to), duration + 250);
    if (document.hidden) {
      setValue(to);
      return () => window.clearTimeout(failsafe);
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(to * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      window.clearTimeout(failsafe);
      cancelAnimationFrame(raf);
    };
  }, [duration, reducedMotion, to]);

  return (
    <span className={`num ${className}`} dir="ltr">
      {value}
      {suffix}
    </span>
  );
}
