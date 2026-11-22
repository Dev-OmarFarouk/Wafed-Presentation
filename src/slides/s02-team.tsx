import { motion } from "framer-motion";
import { team } from "../data/team";
import { SectionTitle } from "../components/SectionTitle";
import { TiltCard } from "../components/TiltCard";
import { LeavesFrame } from "../components/Leaves";
import { useSlideRuntime } from "../engine/runtime";

export default function TeamSlide({ step }: { step: number }) {
  const { reducedMotion } = useSlideRuntime();
  const allVisible = step >= team.length;

  return (
    <div className="slide-inner">
      <LeavesFrame opacity={0.5} />
      <div className="flex items-end justify-between">
        <SectionTitle
          eyebrow="الفريق"
          title="أعضاء الفريق"
          subtitle="أربعة أسماء، شغل واحد: إن السكن يبقى أسهل لطلاب مصر."
        />
      </div>

      <div className="mt-8 grid flex-1 grid-cols-4 content-start gap-6">
        {team.map((member, index) => {
          const visible = step > index;
          return (
            <motion.div
              key={member.id}
              initial={false}
              animate={{
                opacity: visible ? 1 : 0.14,
                y: visible ? 0 : 40,
                rotateY: visible || reducedMotion ? 0 : 26,
                scale: visible ? 1 : 0.94,
              }}
              transition={{ duration: reducedMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformStyle: "preserve-3d", perspective: 1200 }}
            >
              <motion.div
                animate={
                  allVisible && !reducedMotion
                    ? { y: [0, -12, 0] }
                    : { y: 0 }
                }
                transition={
                  allVisible && !reducedMotion
                    ? { duration: 0.95, delay: index * 0.09, ease: "easeOut" }
                    : { duration: 0.2 }
                }
              >
                <TiltCard className="h-full" strength={5}>
                  <article className="card relative flex h-[560px] flex-col items-center justify-between overflow-hidden px-6 pb-9 pt-8">
                    <span className="num absolute right-7 top-6 text-[22px] font-bold text-gold/70">
                      0{index + 1}
                    </span>
                    <span className="absolute left-0 top-0 h-24 w-24 rounded-bl-[80px] bg-gradient-to-br from-gold/12 to-transparent" />

                    <div className="relative mt-6 grid h-[268px] w-[268px] place-items-center">
                      <svg className="absolute inset-0" viewBox="0 0 268 268" aria-hidden>
                        <circle cx="134" cy="134" r="126" fill="#f8f2e6" />
                        <motion.circle
                          cx="134"
                          cy="134"
                          r="128"
                          fill="none"
                          pathLength={1}
                          strokeDasharray="1"
                          stroke={member.accent === "gold" ? "#ca9c5e" : "#0f5e58"}
                          strokeWidth="4"
                          strokeLinecap="round"
                          initial={false}
                          animate={{ strokeDashoffset: visible ? 0 : 1, opacity: visible ? 1 : 0 }}
                          transition={{ duration: reducedMotion ? 0 : 1.1, ease: "easeInOut" }}
                          transform="rotate(-90 134 134)"
                        />
                      </svg>
                      <img
                        src={member.photo}
                        alt={`صورة ${member.name}`}
                        draggable={false}
                        className="h-[236px] w-[236px] rounded-full object-cover"
                        style={{ filter: "saturate(0.94) contrast(1.03)" }}
                      />
                      <span className="absolute -bottom-2 left-1/2 h-2 w-24 -translate-x-1/2 rounded-full bg-gold/25 blur-md" />
                    </div>

                    <div className="w-full text-center">
                      <h3 className="text-[42px] font-bold leading-tight text-green-deep">
                        {member.name}
                      </h3>
                      <div className="mx-auto mt-5 h-[2px] w-20 rounded-full bg-gradient-to-l from-gold/10 via-gold to-gold/10" />
                    </div>
                  </article>
                </TiltCard>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
