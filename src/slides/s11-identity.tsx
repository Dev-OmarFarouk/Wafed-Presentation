import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { identity } from "../data/identity";
import { LeavesFrame } from "../components/Leaves";
import { useSlideRuntime } from "../engine/runtime";
import { IconCheck } from "../components/Icons";

export default function IdentitySlide() {
  const { reducedMotion } = useSlideRuntime();
  const [weightIndex, setWeightIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const id = window.setInterval(() => {
      setWeightIndex((value) => (value + 1) % identity.font.weights.length);
    }, 2600);
    return () => window.clearInterval(id);
  }, [reducedMotion]);

  const activeWeight = identity.font.weights[weightIndex];

  return (
    <div className="slide-inner overflow-hidden">
      <LeavesFrame opacity={0.28} />
      <div className="relative flex items-end justify-between">
        <div>
          <span className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            الهوية البصرية
          </span>
          <h2 className="title-lg mt-4">الخط والألوان</h2>
        </div>
        <p className="mb-3 max-w-[620px] text-[24px] leading-relaxed text-ink-soft">
          خط واحد واضح، وأربع ألوان بس — دافية وبسيطة ومن غير زحمة.
        </p>
      </div>

      <div className="relative mt-6 flex flex-1 flex-col gap-5">
        {/* typography */}
        <section className="relative flex h-[332px] items-stretch gap-7 rounded-[34px] border border-green/12 bg-[#fffdf8] px-9 py-7">
          <div className="relative z-10 flex flex-1 flex-col justify-center">
            <span className="text-[18px] font-medium tracking-[0.14em] text-gold-600">
              الخط الأساسي
            </span>
            <p className="mt-1 text-[88px] font-bold leading-none text-green-deep" dir="ltr">
              {identity.font.name}
            </p>
            <p className="mt-2 max-w-[520px] text-[21px] leading-relaxed text-ink-soft">
              خط عربي حديث، واضح على الشاشات الصغيرة والكبيرة.
            </p>

            <div className="mt-5">
              <span className="text-[17px] text-ink-soft/75">اضغط على أي وزن تجربه:</span>
              <div className="mt-3 flex items-center gap-3">
                {identity.font.weights.map((weight, index) => {
                  const selected = index === weightIndex;
                  return (
                    <motion.button
                      key={weight.label}
                      type="button"
                      onClick={() => setWeightIndex(index)}
                      aria-pressed={selected}
                      aria-label={`اعرض الخط بوزن ${weight.label}`}
                      className={`group flex items-center gap-2.5 rounded-full border-2 px-6 py-2.5 text-[22px] transition-colors ${
                        selected
                          ? "border-gold bg-gold/15 text-green-deep shadow-[0_10px_24px_-16px_rgba(184,133,63,0.9)]"
                          : "border-green/12 bg-white/70 text-ink-soft hover:border-gold/45 hover:bg-gold/10 hover:text-green-deep"
                      }`}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 420, damping: 26 }}
                      dir="ltr"
                      style={{ fontWeight: weight.value }}
                    >
                      <span
                        className={`grid h-5 w-5 place-items-center rounded-full border transition ${
                          selected
                            ? "border-gold bg-gold text-[#fffdf8]"
                            : "border-green/25 bg-white/60 text-transparent group-hover:border-gold/60"
                        }`}
                      >
                        <IconCheck size={12} />
                      </span>
                      {weight.label}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="relative z-10 flex w-[470px] shrink-0 flex-col items-center justify-center rounded-[26px] border border-green/10 bg-cream-2/70">
            <motion.span
              className="text-[130px] leading-none text-green"
              style={{ fontWeight: activeWeight.value }}
              initial={false}
              animate={{ opacity: 1 }}
              transition={{ duration: reducedMotion ? 0 : 0.3 }}
            >
              وافد
            </motion.span>
            <span className="mt-3 text-[18px] tracking-[0.16em] text-gold-600" dir="ltr">
              {activeWeight.label}
            </span>
          </div>
        </section>

        {/* colours */}
        <section className="relative flex flex-1 gap-4">
          {identity.colors.map((color, index) => (
            <motion.div
              key={color.hex}
              className="group relative flex flex-1 flex-col justify-between overflow-hidden rounded-[30px] border p-6 text-right shadow-[0_22px_44px_-32px_rgba(68,47,20,0.6)]"
              style={{
                background: color.hex,
                color: color.text,
                borderColor:
                  color.hex === "#fdfaf3" ? "rgba(15,94,88,0.16)" : "rgba(255,255,255,0.22)",
              }}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.5, delay: reducedMotion ? 0 : index * 0.08 }}
              whileHover={{ y: -10 }}
            >
              <span
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(160deg, rgba(255,255,255,0.28), rgba(255,255,255,0) 55%)",
                }}
              />
              <span className="num pointer-events-none absolute -top-3 left-4 text-[86px] font-bold leading-none opacity-[0.16]">
                {String(index + 1).padStart(2, "0")}
              </span>

              <span className="relative text-[27px] font-medium">{color.name}</span>

              <span className="relative mt-2 flex items-end justify-between">
                <span className="num text-[21px] font-bold tracking-wide" dir="ltr">
                  {color.hex}
                </span>
                <span className="h-[2px] w-14 rounded-full bg-current opacity-40 transition-all duration-500 group-hover:w-24" />
              </span>
            </motion.div>
          ))}
        </section>
      </div>
    </div>
  );
}
