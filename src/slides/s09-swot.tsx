import { AnimatePresence, motion } from "framer-motion";
import { swot } from "../data/swot";
import { LeavesFrame } from "../components/Leaves";
import { useSlideRuntime } from "../engine/runtime";

const CX = 400;
const CY = 380;
const R = 250;

function polar(cx: number, cy: number, r: number, deg: number) {
  const a = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function arcPath(start: number, end: number) {
  const s = polar(CX, CY, R, start);
  const e = polar(CX, CY, R, end);
  const large = end - start > 180 ? 1 : 0;
  return `M ${s.x.toFixed(1)} ${s.y.toFixed(1)} A ${R} ${R} 0 ${large} 1 ${e.x.toFixed(1)} ${e.y.toFixed(1)}`;
}

const TONES = {
  strength: { stroke: "#0f5e58", chip: "rgba(15,94,88,0.12)", ink: "#0f5e58" },
  weakness: { stroke: "#a3673f", chip: "rgba(163,103,63,0.14)", ink: "#8c5730" },
  opportunity: { stroke: "#ca9c5e", chip: "rgba(202,156,94,0.18)", ink: "#a4791f" },
  threat: { stroke: "#8c3f38", chip: "rgba(140,63,56,0.14)", ink: "#8c3f38" },
} as const;

const segments = [
  { id: "s", letter: "S", start: -85, end: -5, mid: -45, tone: "strength" as const },
  { id: "w", letter: "W", start: 5, end: 85, mid: 45, tone: "weakness" as const },
  { id: "o", letter: "O", start: 95, end: 175, mid: 135, tone: "opportunity" as const },
  { id: "t", letter: "T", start: 185, end: 265, mid: 225, tone: "threat" as const },
];

export default function SwotSlide({ step }: { step: number }) {
  const { reducedMotion } = useSlideRuntime();
  const activeIndex = step - 1;
  const active = activeIndex >= 0 ? swot[activeIndex] : null;

  return (
    <div className="slide-inner overflow-hidden">
      <LeavesFrame opacity={0.4} />
      <div className="flex items-start justify-between">
        <div>
          <span className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            تحليل استراتيجي
          </span>
          <h2 className="title-lg mt-4 flex items-baseline gap-4">
            الصورة الكاملة لوافد
            <span className="text-[26px] font-medium tracking-wide text-gold-600" dir="ltr">
              (SWOT Analysis)
            </span>
          </h2>
        </div>
        <span className="num rounded-2xl border border-green/10 bg-white/60 px-5 py-3 text-[21px] text-ink-soft">
          {Math.max(0, Math.min(4, step))} / 4
        </span>
      </div>

      <div className="relative mt-2 flex flex-1 items-center gap-10">
        {/* circle */}
        <div className="relative h-[700px] w-[780px] shrink-0">
          <svg viewBox="0 0 800 760" preserveAspectRatio="none" className="h-full w-full" fill="none" aria-hidden>
            <circle cx={CX} cy={CY} r={R + 54} fill="#fbf6ea" opacity="0.75" />
            <circle cx={CX} cy={CY} r={R + 56} stroke="#ca9c5e" strokeOpacity="0.18" strokeDasharray="4 10" />
            {segments.map((seg, index) => {
              const isActive = activeIndex === index;
              const dim = activeIndex >= 0 && !isActive;
              const color = TONES[seg.tone].stroke;
              return (
                <path
                  key={seg.id}
                  d={arcPath(seg.start, seg.end)}
                  stroke={color}
                  strokeWidth={isActive ? 92 : 74}
                  strokeOpacity={isActive ? 1 : dim ? 0.26 : 0.45}
                  strokeLinecap="round"
                  style={{
                    transition: "stroke-width 700ms cubic-bezier(.22,1,.36,1), stroke-opacity 500ms",
                  }}
                />
              );
            })}
            {segments.map((seg, index) => {
              const p = polar(CX, CY, R - 2, seg.mid);
              const isActive = activeIndex === index;
              return (
                <text
                  key={seg.id}
                  x={p.x}
                  y={p.y + 30}
                  textAnchor="middle"
                  fontFamily="Tajawal, sans-serif"
                  fontSize={isActive ? 96 : 84}
                  fontWeight={700}
                  fill={isActive ? "#fdfaf3" : "#fdfaf3"}
                  fillOpacity={isActive ? 1 : 0.75}
                >
                  {seg.letter}
                </text>
              );
            })}
            <text
              x={CX}
              y={CY + 6}
              textAnchor="middle"
              fontFamily="Tajawal, sans-serif"
              fontSize={40}
              fontWeight={700}
              fill="#0f5e58"
            >
              وافد
            </text>
            <text
              x={CX}
              y={CY + 46}
              textAnchor="middle"
              fontFamily="Tajawal, sans-serif"
              fontSize={20}
              fill="#5c6673"
            >
              الصورة الكاملة
            </text>
          </svg>

          {[
            { id: "s", label: "القوة", x: 400, y: 74, tone: "strength" as const },
            { id: "w", label: "الضعف", x: 706, y: 380, tone: "weakness" as const },
            { id: "o", label: "الفرص", x: 400, y: 690, tone: "opportunity" as const },
            { id: "t", label: "التهديدات", x: 94, y: 380, tone: "threat" as const },
          ].map((tag) => (
            <span
              key={tag.id}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border border-green/10 bg-white/85 px-4 py-1.5 text-[19px] text-ink-soft"
              style={{ left: (tag.x / 800) * 780, top: (tag.y / 760) * 700 }}
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: TONES[tag.tone].stroke }}
              />
              {tag.label}
            </span>
          ))}
        </div>

        {/* details */}
        <div className="relative flex-1">
          <AnimatePresence mode="wait">
            {active ? (
              <motion.div
                key={active.id}
                initial={{ opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: reducedMotion ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-[30px] border border-gold/25 bg-[#fffdf8]/92 px-9 py-8 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <span
                    className="num grid h-16 w-16 place-items-center rounded-2xl text-[38px] font-bold"
                    style={{ background: TONES[active.tone].chip, color: TONES[active.tone].ink }}
                  >
                    {active.letter}
                  </span>
                  <h3 className="text-[40px] font-bold text-green-deep">{active.title}</h3>
                </div>
                <ul className="mt-6 flex flex-col gap-2.5">
                  {active.items.map((item, index) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: 18 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: reducedMotion ? 0 : 0.4,
                        delay: reducedMotion ? 0 : 0.12 + index * 0.07,
                      }}
                      className="flex items-start gap-3 rounded-xl bg-cream-2/60 px-4 py-3"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      <span className="text-[25px] leading-snug text-ink">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ) : (
              <motion.div
                key="intro"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-[30px] border border-green/10 bg-[#fffdf8]/85 px-9 py-9"
              >
                <h3 className="text-[38px] font-bold text-green-deep">أربع أرباع… صورة واحدة</h3>
                <p className="mt-3 text-[25px] leading-relaxed text-ink-soft">
                  قوة، وضعف، وفرص، وتهديدات — كل ربع بيقول حاجة عن وافد.
                </p>
                <div className="mt-8 grid grid-cols-2 gap-4">
                  {swot.map((quad) => (
                    <div key={quad.id} className="rounded-2xl border border-green/12 bg-cream-2/50 px-5 py-5">
                      <span className="text-[26px] font-medium text-gold-600">{quad.title}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
