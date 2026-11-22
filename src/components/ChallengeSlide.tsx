import { motion } from "framer-motion";
import { useSlideRuntime } from "../engine/runtime";

export function ChallengeSlide({
  title,
  subtitle,
  items,
  photo,
  alt,
  tone,
  shift = 0,
  step,
}: {
  title: string;
  subtitle: string;
  items: readonly string[];
  photo: string;
  alt: string;
  tone: "green" | "gold";
  /** nudges the cutout horizontally so its subject sits dead centre */
  shift?: number;
  step: number;
}) {
  const { reducedMotion } = useSlideRuntime();
  const shown = Math.min(items.length, Math.max(0, step));

  const rightItems = items.filter((_, index) => index % 2 === 0);
  const leftItems = items.filter((_, index) => index % 2 === 1);

  const renderItem = (item: string, index: number) => {
    const visible = shown > index;
    return (
      <motion.div
        key={item}
        className={`w-full max-w-[404px] rounded-[26px] border px-6 py-5 ${
          tone === "gold" ? "border-gold/35 bg-[#fffaf0]/92" : "border-green/12 bg-[#fffdf8]/92"
        }`}
        initial={false}
        animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : tone === "gold" ? 20 : -20 }}
        transition={{ duration: reducedMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <span
          className={`num block text-[26px] font-bold leading-none ${
            tone === "gold" ? "text-gold-600/75" : "text-green/45"
          }`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <p className="mt-2 text-[26px] leading-snug text-ink">{item}</p>
      </motion.div>
    );
  };

  return (
    <div className="slide-inner overflow-hidden">
      <div className="flex items-end justify-between">
        <div>
          <span className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            المشكلة
          </span>
          <h2 className="title-lg mt-4">{title}</h2>
        </div>
        <p className="mb-3 max-w-[640px] text-[24px] leading-relaxed text-ink-soft">{subtitle}</p>
      </div>

      <div className="relative mt-4 grid flex-1 grid-cols-[minmax(0,1fr)_452px_minmax(0,1fr)] items-center gap-2">
        <div className="flex flex-col items-end gap-4">
          {rightItems.map((item, index) => renderItem(item, index * 2))}
        </div>

        {/* the cutout stands on the bottom edge of the screen — no card, no crop */}
        <div className="pointer-events-none relative h-full">
          <div
            className={`absolute inset-x-4 bottom-0 h-[85%] rounded-full blur-3xl ${
              tone === "gold"
                ? "bg-[radial-gradient(ellipse_at_center,rgba(202,156,94,0.3),transparent_70%)]"
                : "bg-[radial-gradient(ellipse_at_center,rgba(15,94,88,0.2),transparent_70%)]"
            }`}
          />
          <div
            className="absolute bottom-0 left-1/2 h-[720px] -translate-x-1/2"
            style={{ marginLeft: shift }}
          >
            <motion.img
              src={`/assets/generated/${photo}.png`}
              alt={alt}
              draggable={false}
              className="h-full w-auto max-w-none select-none object-contain object-bottom drop-shadow-[0_30px_50px_rgba(80,56,24,0.18)]"
              initial={false}
              animate={{ opacity: 1 }}
              transition={{ duration: reducedMotion ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>

        <div className="flex flex-col items-start gap-4">
          {leftItems.map((item, index) => renderItem(item, index * 2 + 1))}
        </div>
      </div>
    </div>
  );
}
