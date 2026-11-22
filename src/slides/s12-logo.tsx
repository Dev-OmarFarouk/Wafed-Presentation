import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { identity } from "../data/identity";
import { LeavesFrame } from "../components/Leaves";
import { useSlideRuntime } from "../engine/runtime";
import { IconHome, IconPin } from "../components/Icons";

/** percentages over the logo artwork: house, waw spiral, golden path (dangling), pin head */
const HOTSPOTS: Record<string, { x: number; y: number }> = {
  house: { x: 50, y: 22 },
  waw: { x: 40, y: 32 },
  path: { x: 34, y: 70 },
  pin: { x: 50, y: 14 },
};

const ICONS = { house: IconHome, pin: IconPin } as const;

/** card layout: two on the right, two on the left, ordered by where their part sits */
const CALL_OUTS = [
  { id: "house", side: "right" as const },
  { id: "waw", side: "right" as const },
  { id: "path", side: "left" as const },
  { id: "pin", side: "left" as const },
];

type Element = (typeof identity.elements)[number];
type Entry = { id: string; side: "right" | "left"; order: number; element: Element };

const ENTRIES: Entry[] = CALL_OUTS.map((callout) => {
  const order = identity.elements.findIndex((item) => item.id === callout.id);
  return { id: callout.id, side: callout.side, order, element: identity.elements[order] };
}).filter((entry) => Boolean(entry.element));

type Arrow = { id: string; d: string };

export default function Logoslide({ step }: { step: number }) {
  const { reducedMotion } = useSlideRuntime();
  const activeIndex = Math.min(ENTRIES.length - 1, Math.max(0, step - 1));
  const active = ENTRIES[activeIndex];
  const spot = active ? HOTSPOTS[active.id] : null;

  const wrapRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [size, setSize] = useState({ w: 0, h: 0 });
  const [arrows, setArrows] = useState<Arrow[]>([]);

  const compute = useCallback(() => {
    const wrap = wrapRef.current;
    const logo = logoRef.current;
    if (!wrap || !logo) return;
    const wrapRect = wrap.getBoundingClientRect();
    if (!wrapRect.width || !wrap.offsetWidth) return;
    // screen px -> stage px (the whole deck is scaled to fit the window)
    const k = wrapRect.width / wrap.offsetWidth;
    const logoRect = logo.getBoundingClientRect();
    const logoW = logoRect.width / k;
    const logoH = logoRect.height / k;
    const logoX = (logoRect.left - wrapRect.left) / k;
    const logoY = (logoRect.top - wrapRect.top) / k;

    const next: Arrow[] = [];

    for (const entry of ENTRIES) {
      const card = cardRefs.current[entry.id];
      const point = HOTSPOTS[entry.id];
      if (!card || !point) continue;

      const cardRect = card.getBoundingClientRect();
      const x0 = ((entry.side === "right" ? cardRect.left : cardRect.right) - wrapRect.left) / k;
      const y0 = (cardRect.top + cardRect.height / 2 - wrapRect.top) / k;

      const x1 = logoX + (logoW * point.x) / 100;
      const y1 = logoY + (logoH * point.y) / 100;

      const dx = x1 - x0;
      const dy = y1 - y0;
      const len = Math.hypot(dx, dy) || 1;
      // stop short of the ring so the arrowhead sits just outside the highlight
      const ex = x1 - (dx / len) * 56;
      const ey = y1 - (dy / len) * 56;

      const c1 = x0 + dx * 0.42;
      const c2 = ex - dx * 0.26;

      next.push({
        id: entry.id,
        d: `M ${x0.toFixed(1)} ${y0.toFixed(1)} C ${c1.toFixed(1)} ${y0.toFixed(1)}, ${c2.toFixed(
          1
        )} ${ey.toFixed(1)}, ${ex.toFixed(1)} ${ey.toFixed(1)}`,
      });
    }

    setSize({ w: wrap.offsetWidth, h: wrap.offsetHeight });
    setArrows(next);
  }, []);

  useLayoutEffect(() => {
    compute();
    const wrap = wrapRef.current;
    const observer =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => compute()) : null;
    if (wrap) observer?.observe(wrap);

    const raf = requestAnimationFrame(compute);
    const timer = window.setTimeout(compute, 450);
    void document.fonts?.ready.then(() => compute());

    return () => {
      observer?.disconnect();
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, [compute]);

  const renderCard = (entry: Entry) => {
    const visible = step > entry.order;
    const isActive = entry.order === activeIndex;
    const Icon = ICONS[entry.id as keyof typeof ICONS];
    const element = entry.element;

    return (
      <motion.div
        key={entry.id}
        ref={(node: HTMLDivElement | null) => {
          cardRefs.current[entry.id] = node;
        }}
        className="relative w-full max-w-[420px] rounded-[24px] border bg-[#fffdf8]/95 px-6 py-5"
        initial={false}
        animate={{
          opacity: visible ? 1 : 0.22,
          borderColor: isActive ? "rgba(202,156,94,0.85)" : "rgba(202,156,94,0.28)",
          boxShadow: isActive
            ? "0 22px 44px -30px rgba(184,133,63,0.8)"
            : "0 0 0 0 rgba(0,0,0,0)",
        }}
        transition={{ duration: reducedMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-3">
          {Icon ? (
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold/12 text-gold-600">
              <Icon size={20} />
            </span>
          ) : (
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold/12 text-[18px] font-bold text-gold-600">
              {entry.id === "path" ? "↗" : "و"}
            </span>
          )}
          <h3 className="text-[27px] font-bold text-green-deep">{element.title}</h3>
        </div>
        <p className="mt-2 text-[21px] leading-snug text-ink-soft">{element.text}</p>
      </motion.div>
    );
  };

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
        className="relative mx-auto mt-3 grid w-full max-w-[1420px] flex-1 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-10"
      >
        <div className="relative z-20 flex flex-col items-end gap-8">
          {ENTRIES.filter((entry) => entry.side === "right").map(renderCard)}
        </div>

        <div className="relative flex h-full items-center justify-center">
          <div className="relative h-[520px]">
            <img
              ref={logoRef}
              src="/assets/logo.png"
              alt="شعار وافد"
              draggable={false}
              onLoad={compute}
              className="h-full w-auto select-none"
            />

            {spot && (
              <span
                className="pointer-events-none absolute"
                style={{ left: `${spot.x}%`, top: `${spot.y}%`, transform: "translate(-50%, -50%)" }}
              >
                <span className="block h-[74px] w-[74px] rounded-full border-2 border-dashed border-gold/90" />
                <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_0_6px_rgba(202,156,94,0.22)]" />
              </span>
            )}
          </div>
        </div>

        <div className="relative z-20 flex flex-col items-start gap-8">
          {ENTRIES.filter((entry) => entry.side === "left").map(renderCard)}
        </div>

        {/* leader lines: every card points at its own part of the mark */}
        {size.w > 0 && (
          <svg
            className="pointer-events-none absolute inset-0 z-10"
            width={size.w}
            height={size.h}
            viewBox={`0 0 ${size.w} ${size.h}`}
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
                <path d="M0 0 L8 4 L0 8 Z" fill="#b8853f" />
              </marker>
              <marker
                id="logo-arrow-soft"
                viewBox="0 0 8 8"
                refX="7"
                refY="4"
                markerWidth="7"
                markerHeight="7"
                orient="auto"
              >
                <path d="M0 0 L8 4 L0 8 Z" fill="#0f5e58" fillOpacity="0.4" />
              </marker>
            </defs>
            {arrows.map((arrow) => {
              const entry = ENTRIES.find((item) => item.id === arrow.id);
              if (!entry) return null;
              const visible = step > entry.order;
              if (!visible) return null;
              const isActive = entry.order === activeIndex;
              return (
                <path
                  key={arrow.id}
                  d={arrow.d}
                  stroke={isActive ? "#b8853f" : "#0f5e58"}
                  strokeOpacity={isActive ? 1 : 0.32}
                  strokeWidth={isActive ? 2.6 : 2}
                  strokeDasharray="7 7"
                  strokeLinecap="round"
                  markerEnd={`url(#${isActive ? "logo-arrow" : "logo-arrow-soft"})`}
                  style={{ transition: "stroke-opacity 400ms ease, stroke 400ms ease" }}
                />
              );
            })}
          </svg>
        )}
      </div>
    </div>
  );
}
