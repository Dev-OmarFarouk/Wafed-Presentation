import { motion } from "framer-motion";
import { GoldParticles } from "../components/GoldParticles";
import { useSlideRuntime } from "../engine/runtime";
import { IconBuilding, IconUsers } from "../components/Icons";

export default function AudienceSlide({ step }: { step: number }) {
  const { reducedMotion } = useSlideRuntime();
  const met = step >= 2;
  const shift = met ? 0 : 108;

  return (
    <div className="slide-inner items-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,rgba(202,156,94,0.16),transparent_62%)]" />
      <GoldParticles count={20} intensity={0.6} />

      <div className="relative flex flex-col items-center">
        <span className="eyebrow">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          لمين بنتكلم؟
        </span>
        <h2 className="title-lg mt-4">الفئة المستهدفة</h2>
      </div>

      <div
        className="relative flex w-full flex-1 items-center justify-center"
        style={{ perspective: "1600px" }}
      >
        <div className="relative flex items-center justify-center gap-[300px]">
          <motion.div
            initial={false}
            animate={{ x: shift, rotateY: met ? -4 : -10 }}
            transition={{ duration: reducedMotion ? 0 : 0.95, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <article className="card relative w-[496px] overflow-hidden px-8 py-9 text-center">
              <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-transparent via-gold/60 to-transparent" />
              <span className="mx-auto grid h-[92px] w-[92px] place-items-center rounded-[26px] bg-green/8 text-green">
                <IconUsers size={42} strokeWidth={1.3} />
              </span>
              <h3 className="mt-5 text-[40px] font-bold text-green-deep">الطلاب المغتربون</h3>
              <p className="mt-2 text-[21px] text-ink-soft">الفئة الأولى</p>
              <span className="mt-5 inline-block rounded-full border border-green/15 bg-green-100/60 px-5 py-2 text-[19px] text-green">
                بيدور على سكن قريب من جامعته
              </span>
            </article>
          </motion.div>

          <motion.div
            initial={false}
            animate={{ x: -shift, rotateY: met ? 4 : 10 }}
            transition={{ duration: reducedMotion ? 0 : 0.95, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <article className="card relative w-[496px] overflow-hidden px-8 py-9 text-center">
              <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-transparent via-gold/60 to-transparent" />
              <span className="mx-auto grid h-[92px] w-[92px] place-items-center rounded-[26px] bg-gold/12 text-gold-600">
                <IconBuilding size={42} strokeWidth={1.3} />
              </span>
              <h3 className="mt-5 text-[40px] font-bold text-green-deep">أصحاب العقارات</h3>
              <p className="mt-2 text-[21px] text-ink-soft">الفئة الثانية</p>
              <span className="mt-5 inline-block rounded-full border border-gold/30 bg-gold/10 px-5 py-2 text-[19px] text-gold-600">
                عنده شقة وبيدور على طلاب جدّيين
              </span>
            </article>
          </motion.div>

          {/* handshake, dead centre between the two cards */}
          <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
            <motion.div
              className="relative flex flex-col items-center"
              initial={false}
              animate={{ opacity: met ? 1 : 0, scale: met ? 1 : 0.72, y: met ? 0 : 26 }}
              transition={{
                duration: reducedMotion ? 0 : 0.7,
                delay: reducedMotion ? 0 : 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div
                className={`absolute -inset-8 rounded-full bg-[radial-gradient(circle,rgba(202,156,94,0.4),transparent_66%)] ${
                  met ? "soft-pulse" : ""
                }`}
              />
              <div
                className="relative h-[366px] w-[366px] overflow-hidden rounded-[48px]"
                style={{
                  WebkitMaskImage:
                    "radial-gradient(closest-side, #000 74%, rgba(0,0,0,0.35) 92%, transparent 100%)",
                  maskImage:
                    "radial-gradient(closest-side, #000 74%, rgba(0,0,0,0.35) 92%, transparent 100%)",
                }}
              >
                {/* the source photo has its subject right of centre: crop it back to the middle */}
                <img
                  src="/assets/generated/handshake.png"
                  alt="اتفاق الطالب وصاحب السكن"
                  draggable={false}
                  className="absolute left-[-21%] top-[-12%] h-[126%] w-[126%] max-w-none object-cover"
                />
              </div>
              <span className="absolute -bottom-7 whitespace-nowrap rounded-full border border-gold/40 bg-[#fffdf8] px-5 py-1.5 text-[21px] font-medium text-green shadow-sm">
                وافد بيجمعهم
              </span>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="mt-4 h-16">
        {met && (
          <motion.p
            className="text-center text-[25px] text-ink-soft"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            الاتنين بيدوروا على نفس الحاجة… بس كل واحد كان بيدور في مكان مختلف.
          </motion.p>
        )}
      </div>
    </div>
  );
}
