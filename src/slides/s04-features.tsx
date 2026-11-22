import { motion } from "framer-motion";
import { features } from "../data/solutions";
import { FeatureGlyph } from "../components/FeatureGlyph";
import { useSlideRuntime } from "../engine/runtime";

export default function FeaturesSlide({ step }: { step: number }) {
  const { reducedMotion } = useSlideRuntime();

  return (
    <div className="slide-inner overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(202,156,94,0.1),transparent_55%)]" />

      <div className="relative flex items-end justify-between">
        <div>
          <span className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            جوه المنصة
          </span>
          <h2 className="title-lg mt-4">الخصائص الأساسية</h2>
          <p className="lead mt-2 max-w-[900px]">
            خمس خصائص بتشتغل مع بعض، كل واحدة بتقفل جزء من المشكلة.
          </p>
        </div>
        <span className="mb-3 rounded-full border border-gold/30 bg-gold/8 px-6 py-2 text-[20px] text-gold-600">
          خمسة في مكان واحد
        </span>
      </div>

      <div className="relative mt-6 grid flex-1 grid-cols-5 gap-3">
        {features.map((feature, index) => {
          const active = step > index;
          return (
            <motion.article
              key={feature.id}
              className="relative flex flex-col overflow-hidden rounded-[24px] border bg-[#fffdf8] px-5 py-5"
              initial={false}
              animate={{
                opacity: active ? 1 : 0.3,
                y: active ? 0 : 26,
                borderColor: active ? "rgba(202,156,94,0.55)" : "rgba(15,94,88,0.1)",
                boxShadow: active
                  ? "0 28px 54px -38px rgba(68,47,20,0.45)"
                  : "0 8px 18px -16px rgba(68,47,20,0.18)",
              }}
              transition={{ duration: reducedMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-start justify-between">
                <span
                  className={`grid h-12 w-12 place-items-center rounded-xl ${
                    active ? "bg-gold/12 text-gold-600" : "bg-green/8 text-green/60"
                  }`}
                >
                  <FeatureGlyph id={feature.icon} active={active} reduced={reducedMotion} size={22} />
                </span>
                <span className="num text-[20px] font-bold text-gold/70">0{index + 1}</span>
              </div>

              <div className="mt-3">
                <h3 className="text-[22px] font-bold leading-snug text-green-deep">{feature.title}</h3>
                <p className="mt-1.5 text-[16px] leading-relaxed text-ink-soft">{feature.note}</p>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
