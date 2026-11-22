import { motion } from "framer-motion";
import { GenImage } from "../components/GenImage";
import { useSlideRuntime } from "../engine/runtime";
import type { Solution } from "../data/solutions";

export function SolutionsSlide({
  step,
  items,
  part,
  lead,
}: {
  step: number;
  items: Solution[];
  part: string;
  lead: string;
}) {
  const { reducedMotion } = useSlideRuntime();

  return (
    <div className="slide-inner overflow-hidden">
      <div className="relative flex items-end justify-between">
        <div>
          <span className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            إزاي حللناها
          </span>
          <h2 className="title-lg mt-4">الحلول التي يقدمها وافد</h2>
          <p className="lead mt-2 max-w-[900px]">{lead}</p>
        </div>
        <span className="num mb-3 rounded-full border border-gold/30 bg-gold/8 px-6 py-2 text-[20px] text-gold-600">
          {part}
        </span>
      </div>

      <div className="relative mt-7 grid flex-1 grid-cols-3 content-start gap-6">
        {items.map((solution, index) => {
          const visible = step > index;
          return (
            <motion.article
              key={solution.id}
              className="group relative flex flex-col overflow-hidden rounded-[30px] border border-green/10 bg-[#fffdf8]"
              initial={false}
              animate={{
                opacity: visible ? 1 : 0.28,
                y: visible ? 0 : 28,
                scale: visible ? 1 : 0.97,
                boxShadow: visible
                  ? "0 30px 60px -38px rgba(68,47,20,0.45)"
                  : "0 8px 18px -16px rgba(68,47,20,0.2)",
              }}
              transition={{ duration: reducedMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative">
                <GenImage
                  name={solution.image}
                  ratio="4 / 3"
                  alt={solution.title}
                  label={`${solution.image}.png`}
                  className="w-full"
                />
                <span className="num absolute right-5 top-4 rounded-full bg-[#fffdf8]/92 px-3.5 py-1 text-[19px] font-bold text-gold-600 shadow-sm">
                  0{index + 1}
                </span>
              </div>

              <div className="flex flex-1 flex-col px-7 pb-7 pt-6">
                <h3 className="text-[33px] font-bold leading-snug text-green-deep">{solution.title}</h3>
                <p className="mt-3 text-[23px] leading-snug text-ink-soft">{solution.text}</p>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
