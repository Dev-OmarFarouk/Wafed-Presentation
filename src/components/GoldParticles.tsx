import { useMemo } from "react";

type Props = {
  count?: number;
  className?: string;
  /** 0..1 overall opacity */
  intensity?: number;
};

function seeded(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

/** Deterministic particles so re-renders never reshuffle. */
export function GoldParticles({ count = 34, className = "", intensity = 1 }: Props) {
  const dots = useMemo(() => {
    const random = seeded(7);
    return Array.from({ length: count }, (_, index) => {
      const size = 2 + random() * 6;
      return {
        id: index,
        left: random() * 100,
        top: random() * 100,
        size,
        depth: 0.35 + random() * 0.9,
        delay: random() * 12,
        duration: 14 + random() * 16,
        drift: (random() - 0.5) * 90,
        opacity: 0.2 + random() * 0.55,
      };
    });
  }, [count]);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {dots.map((dot) => (
        <span
          key={dot.id}
          className="gold-dot absolute rounded-full"
          style={
            {
              left: `${dot.left}%`,
              top: `${dot.top}%`,
              width: dot.size,
              height: dot.size,
              opacity: dot.opacity * intensity,
              filter: dot.depth > 0.9 ? "blur(0.3px)" : undefined,
              "--drift": `${dot.drift}px`,
              "--dur": `${dot.duration}s`,
              "--delay": `-${dot.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
