import { motion } from "framer-motion";
import { slides } from "./slides";
import { SlideView } from "./SlideView";
import { IconClose } from "../components/Icons";

export function Overview({
  current,
  reduced,
  onSelect,
  onClose,
}: {
  current: number;
  reduced: boolean;
  onSelect: (index: number, origin: { x: number; y: number }) => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="absolute inset-0 z-40 flex flex-col bg-cream/97"
      initial={reduced ? { opacity: 0 } : { opacity: 0, backdropFilter: "blur(0px)" }}
      animate={{ opacity: 1, backdropFilter: "blur(10px)" }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0.15 : 0.32, ease: [0.22, 1, 0.36, 1] }}
      role="dialog"
      aria-modal="true"
      aria-label="شبكة العرض"
    >
      <div className="flex items-center justify-between px-12 pb-4 pt-9">
        <div>
          <p className="text-[20px] font-medium tracking-wide text-gold">شبكة العرض</p>
          <h2 className="mt-1 text-[40px] font-bold text-green">اختار السلايد اللي عايزه</h2>
        </div>
        <button
          onClick={onClose}
          aria-label="اقفل شبكة العرض"
          className="grid h-14 w-14 place-items-center rounded-full border border-green/15 bg-white/70 text-green transition hover:bg-white"
        >
          <IconClose size={24} />
        </button>
      </div>

      <div className="grid flex-1 grid-cols-5 content-start gap-x-6 gap-y-8 overflow-hidden px-12 pb-10">
        {slides.map((slide, index) => (
          <motion.button
            key={slide.id}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 26, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: reduced ? 0.15 : 0.42,
              delay: reduced ? 0 : 0.03 * index,
              ease: [0.22, 1, 0.36, 1],
            }}
            onClick={(event) => onSelect(index, { x: event.clientX, y: event.clientY })}
            className="group text-right focus-visible:outline-gold"
            aria-current={index === current ? "true" : undefined}
            aria-label={`السلايد ${index + 1}: ${slide.title}`}
          >
            <div
              className={`relative aspect-[16/9] w-full overflow-hidden rounded-2xl border bg-white shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:shadow-md ${
                index === current ? "border-gold ring-2 ring-gold/40" : "border-green/10"
              }`}
            >
              <div
                className="pointer-events-none absolute right-0 top-0 h-[1080px] w-[1920px]"
                style={{ transform: "scale(0.166)", transformOrigin: "top right" }}
              >
                <SlideView index={index} step={slide.steps - 1} preview reducedMotion />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-cream/60 via-transparent to-transparent" />
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="num text-[18px] font-bold text-gold">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-[21px] font-medium text-green">{slide.title}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
