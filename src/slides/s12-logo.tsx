import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { identity } from "../data/identity";
import { LeavesFrame } from "../components/Leaves";
import { useSlideRuntime } from "../engine/runtime";

/** order follows the logo presentation: pin, house, waw, golden path */
const ORDER = ["pin", "house", "waw", "path"] as const;

/** percentages over the logo artwork */
const HOTSPOTS: Record<(typeof ORDER)[number], { x: number; y: number }> = {
  pin: { x: 65, y: 37 },
  house: { x: 47, y: 29 },
  waw: { x: 50, y: 12 },
  path: { x: 38, y: 55 },
};

const ARROW_COLORS: Record<(typeof ORDER)[number], string> = {
  pin: "#d6b07a",
  house: "#d6b07a",
  waw: "#d6b07a",
  path: "#d6b07a",
};

const ELEMENTS = ORDER.map((id) => identity.elements.find((element) => element.id === id)).filter(
  (element): element is (typeof identity.elements)[number] => Boolean(element)
);

export default function Logoslide({ step }: { step: number }) {
  const { reducedMotion } = useSlideRuntime();
  const activeIndex = step <= 0 ? -1 : Math.min(ELEMENTS.length - 1, step - 1);
  const active = activeIndex >= 0 ? ELEMENTS[activeIndex] : null;

  const wrapRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [arrow, setArrow] = useState<{ d: string; color: string } | null>(null);

  const compute = useCallback(() => {
    const wrap = wrapRef.current;
    const logo = logoRef.current;
    const card = cardRef.current;
    if (!wrap || !logo || !card || !active) {
      setArrow(null);
      return;
    }
    const wrapRect = wrap.getBoundingClientRect();
    if (!wrapRect.width || !wrap.offsetWidth) return;
    // screen px -> stage px (the deck is scaled to fit the window)
    const k = wrapRect.width / wrap.offsetWidth;
    const logoRect = logo.getBoundingClientRect();
    const logoW = logoRect.width / k;
    const logoH = logoRect.height / k;
    const logoX = (logoRect.left - wrapRect.left) / k;
    const logoY = (logoRect.top - wrapRect.top) / k;

    const cardRect = card.getBoundingClientRect();
    const x0 = (cardRect.left - wrapRect.left) / k - 6;
    const y0 = (cardRect.top + cardRect.height / 2 - wrapRect.top) / k;

    const spot = HOTSPOTS[ORDER[activeIndex]];
    const x1 = logoX + (logoW * spot.x) / 100;
    const y1 = logoY + (logoH * spot.y) / 100;

    const dx = x1 - x0;
    const dy = y1 - y0;
    const len = Math.hypot(dx, dy) || 1;
    const ex = x1 - (dx / len) * 44;
    const ey = y1 - (dy / len) * 44;
    const c1 = x0 + dx * 0.38;
    const c2 = ex - dx * 0.2;

    setArrow({
      d: `M ${x0.toFixed(1)} ${y0.toFixed(1)} C ${c1.toFixed(1)} ${y0.toFixed(1)}, ${c2.toFixed(
        1
      )} ${ey.toFixed(1)}, ${ex.toFixed(1)} ${ey.toFixed(1)}`,
      color: ARROW_COLORS[ORDER[activeIndex]],
    });
  }, [active, activeIndex]);

  useLayoutEffect(() => {
    compute();
    const wrap = wrapRef.current;
    const observer =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => compute()) : null;
    if (wrap) observer?.observe(wrap);

    const raf = requestAnimationFrame(compute);
    const timer = window.setTimeout(compute, 420);
    void document.fonts?.ready.then(() => compute());

    return () => {
      observer?.disconnect();
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, [compute]);

  return (
    <div className="slide-inner overflow-hidden">
      <LeavesFrame opacity={0.3} />
      <div className="relative flex items-end justify-between">
        <div>
          <span className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            الهوية البصرية
          </span>
          <h2 className="title-lg mt-4">الشعار</h2>
        </div>
        <p className="mb-3 max-w-[620px] text-[24px] leading-relaxed text-ink-soft">
          أربعة عناصر… معنى واحد: سكن للطلاب، وفرصة لأصحاب السكن.
        </p>
      </div>

      <div
        ref={wrapRef}
        className="relative mx-auto mt-3 grid w-full max-w-[1500px] flex-1 grid-cols-[minmax(0,1fr)_520px_minmax(0,1fr)] items-center gap-12"
      >
        {/* right: the active symbol, or the intro on the overview step */}
        <div className="relative z-20 flex flex-col items-end justify-center">
          <motion.div
            key={active?.id ?? "intro"}
            ref={cardRef}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="card relative w-full max-w-[470px] overflow-hidden px-8 py-8"
          >
            <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-transparent via-gold/60 to-transparent" />
            {active ? (
              <>
                <span dir="ltr" className="num block text-[24px] font-bold text-gold/80">
                  {String(activeIndex + 1).padStart(2, "0")} / {String(ELEMENTS.length).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-[52px] font-bold leading-tight text-green-deep">
                  {active.title}
                </h3>
                <p className="mt-4 text-[27px] leading-relaxed text-ink">{active.text}</p>
              </>
            ) : (
              <>
                <span className="text-[22px] font-medium text-gold-600">الشعار</span>
                <p className="mt-3 text-[27px] leading-relaxed text-ink">{identity.logoIntro}</p>
              </>
            )}
          </motion.div>
        </div>

        {/* centre: the mark */}
        <div className="relative flex h-full items-center justify-center">
          <img
            ref={logoRef}
            src="/assets/logo.png"
            alt="شعار وافد"
            draggable={false}
            onLoad={compute}
            className="h-[620px] w-auto select-none"
          />
        </div>

        {/* left: a quiet stepper, so the four symbols keep their context */}
        <div className="relative z-20 flex flex-col items-start gap-3">
          {ELEMENTS.map((element, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={element.id}
                className={`flex w-full max-w-[260px] items-center gap-3 rounded-2xl border px-4 py-3 transition-colors duration-300 ${
                  isActive
                    ? "border-gold/60 bg-[#fffdf8] shadow-[0_18px_36px_-28px_rgba(68,47,20,0.55)]"
                    : "border-green/10 bg-[#fffdf8]/55"
                }`}
              >
                <span
                  className={`num grid h-9 w-9 shrink-0 place-items-center rounded-full text-[17px] font-bold ${
                    isActive ? "bg-gold text-[#12332d]" : "bg-green/8 text-green/55"
                  }`}
                >
                  {index + 1}
                </span>
                <span
                  className={`text-[22px] font-medium ${
                    isActive ? "text-green-deep" : "text-ink-soft/70"
                  }`}
                >
                  {element.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* one leader line, only for the active symbol, in that symbol's colour */}
        {arrow && (
          <svg
            className="pointer-events-none absolute inset-0 z-10 h-full w-full"
            fill="none"
            aria-hidden
          >
            <defs>
              <marker
                id="logo-arrow"
                viewBox="0 0 8 8"
                refX="7"
                refY="4"
                markerWidth="8"
                markerHeight="8"
                orient="auto"
              >
                <path d="M0 0 L8 4 L0 8 Z" fill={arrow.color} />
              </marker>
            </defs>
            <motion.path
              key={`${active?.id}-arrow`}
              d={arrow.d}
              stroke={arrow.color}
              strokeWidth={3}
              strokeDasharray="8 8"
              strokeLinecap="round"
              markerEnd="url(#logo-arrow)"
              initial={{ opacity: 0, strokeDashoffset: 30 }}
              animate={{ opacity: 1, strokeDashoffset: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.65, ease: "easeOut" }}
            />
          </svg>
        )}
      </div>
    </div>
  );
}
