import { motion } from "framer-motion";
import { brands, features, matrix } from "../data/competitors";
import { useSlideRuntime } from "../engine/runtime";
import { IconCheck, IconX } from "../components/Icons";
import { LogoImage } from "../components/Logo";

export default function CompetitionSlide({ step }: { step: number }) {
  const { reducedMotion } = useSlideRuntime();
  const counterVisible = step >= 6;

  return (
    <div className="slide-inner overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(202,156,94,0.1),transparent_55%)]" />
      <div className="flex items-start justify-between">
        <div>
          <span className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            المقارنة
          </span>
          <h2 className="title-lg mt-4">المنافسة</h2>
          <p className="lead mt-2 max-w-[900px]">
            خمس خصائص، أربع منصات — ووافد بيغطي الخمسة كلهم.
          </p>
        </div>
        <LogoImage className="h-[84px] w-auto opacity-90" priority />
      </div>

      <div className="relative mt-6 rounded-[30px] border border-green/12 bg-[#fffdf8]/85 px-3 py-3 shadow-sm">
        <div className="grid" style={{ gridTemplateColumns: "1.7fr repeat(4, 1fr)" }}>
          {/* header */}
          <div className="flex items-center justify-start px-6 py-4 text-[22px] font-medium text-green/70">
            الخصائص
          </div>
          {brands.map((brand) => {
            const isWafed = brand.id === "wafed";
            return (
              <div
                key={brand.id}
                className={`relative m-1 flex flex-col items-center justify-center gap-1.5 rounded-2xl py-3 ${
                  isWafed ? "bg-gold/10" : "bg-transparent"
                }`}
              >
                {isWafed && (
                  <motion.span
                    className="pointer-events-none absolute inset-0 rounded-2xl border border-gold/60"
                    animate={
                      reducedMotion
                        ? { opacity: 1 }
                        : { opacity: [0.55, 1, 0.55], boxShadow: ["0 0 0 0 rgba(202,156,94,0)", "0 0 26px 2px rgba(202,156,94,0.28)", "0 0 0 0 rgba(202,156,94,0)"] }
                    }
                    transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
                <span className="flex h-[64px] w-full items-center justify-center">
                  <img
                    src={brand.logo}
                    alt={`لوجو ${brand.name}`}
                    className={`w-auto object-contain ${isWafed ? "h-[64px]" : "h-[48px]"}`}
                    draggable={false}
                  />
                </span>
                <span
                  className={`text-[25px] font-bold ${isWafed ? "text-green-deep" : "text-ink-soft"}`}
                  dir={brand.id === "casita" || brand.id === "uhomes" ? "ltr" : "rtl"}
                >
                  {brand.name}
                </span>
              </div>
            );
          })}

          {/* rows */}
          {features.map((feature, rowIndex) => {
            const visible = step > rowIndex;
            return (
              <motion.div
                key={feature}
                className="col-span-5 grid"
                style={{ gridTemplateColumns: "1.7fr repeat(4, 1fr)" }}
                initial={false}
                animate={{ opacity: visible ? 1 : 0.22, y: visible ? 0 : 10 }}
                transition={{ duration: reducedMotion ? 0 : 0.45, delay: reducedMotion ? 0 : 0.02 }}
              >
                <div className="flex items-center border-t border-green/8 px-6 py-3.5">
                  <span className="num ml-4 w-8 shrink-0 text-[17px] text-gold/70">0{rowIndex + 1}</span>
                  <span className="text-[24px] leading-snug text-ink">{feature}</span>
                </div>
                {brands.map((brand) => {
                  const has = matrix[brand.id][rowIndex];
                  const isWafed = brand.id === "wafed";
                  return (
                    <div
                      key={brand.id}
                      className={`flex items-center justify-center border-t border-green/8 py-3.5 ${
                        isWafed ? "bg-gold/8" : ""
                      }`}
                    >
                      {has ? (
                        <motion.span
                          className={`grid h-11 w-11 place-items-center rounded-full ${
                            isWafed ? "bg-green text-cream" : "bg-green/8 text-green"
                          }`}
                          initial={false}
                          animate={{ scale: visible ? [0.7, 1.08, 1] : 0.7, opacity: visible ? 1 : 0 }}
                          transition={{ duration: reducedMotion ? 0 : 0.45 }}
                        >
                          <IconCheck size={22} />
                        </motion.span>
                      ) : (
                        <motion.span
                          className="grid h-11 w-11 place-items-center rounded-full bg-[#ecebe6] text-[#9aa3a0]"
                          initial={false}
                          animate={
                            visible && !reducedMotion
                              ? { opacity: 1, x: [0, -3, 3, -2, 0] }
                              : { opacity: visible ? 1 : 0.3 }
                          }
                          transition={{ duration: 0.4 }}
                        >
                          <IconX size={20} />
                        </motion.span>
                      )}
                    </div>
                  );
                })}
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 flex h-[104px] shrink-0 items-center justify-end">
        <motion.div
          className="flex items-center gap-5 rounded-[26px] border border-gold/40 bg-[#fffaf0] px-8 py-4 shadow-sm"
          initial={false}
          animate={{ opacity: counterVisible ? 1 : 0, y: counterVisible ? 0 : 16, scale: counterVisible ? 1 : 0.96 }}
          transition={{ duration: reducedMotion ? 0 : 0.5 }}
        >
          <span className="text-[24px] text-green">وافد بيغطي</span>
          <motion.span
            className="num text-[56px] font-bold leading-none text-gold-600"
            dir="ltr"
            initial={false}
            animate={{ scale: counterVisible ? 1 : 0.8, opacity: counterVisible ? 1 : 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.45 }}
          >
            5
          </motion.span>
          <span className="text-[24px] text-green">من 5</span>
        </motion.div>
      </div>
    </div>
  );
}
