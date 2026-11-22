import { Fragment } from "react";
import { motion } from "framer-motion";
import { GenImage } from "../components/GenImage";
import { LogoImage } from "../components/Logo";
import { LeavesFrame } from "../components/Leaves";
import { useSlideRuntime } from "../engine/runtime";
import { IconTarget, IconSpark, IconPin } from "../components/Icons";

const cards = [
  {
    id: "problem",
    title: "المشكلة",
    text: "صعوبة العثور على سكن مناسب وموثوق، وتشتت المعلومات بين مصادر كتير.",
    icon: IconPin,
    tone: "green" as const,
  },
  {
    id: "solution",
    title: "الحل",
    text: "منصة بتجمع الطالب وأصحاب الشقق في مكان واحد، بفلاتر وتوثيق وتواصل مباشر.",
    icon: IconSpark,
    tone: "gold" as const,
  },
  {
    id: "audience",
    title: "الفئة المستهدفة",
    text: "الطلاب المغتربون وأصحاب العقارات — الطرفين في نفس المكان.",
    icon: IconTarget,
    tone: "green" as const,
  },
];

export default function OverviewSlide({ step }: { step: number }) {
  const { reducedMotion } = useSlideRuntime();

  return (
    <div className="slide-inner overflow-hidden">
      <LeavesFrame opacity={0.35} />
      <div className="relative flex items-start justify-between">
        <div>
          <span className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            المشروع
          </span>
          <h2 className="title-lg mt-4">نظرة على المشروع</h2>
          <p className="lead mt-2 max-w-[860px]">فكرة واحدة، بتحل مشكلة الطرفين.</p>
        </div>
        <LogoImage className="h-[86px] w-auto opacity-90" priority />
      </div>

      <div className="relative mt-5 flex flex-1 items-center gap-10">
        {/* macbook mockup */}
        <div className="relative w-[860px]">
          <div className="relative">
            {/* flat, no 3D rotation: a rotated screenshot gets re-rasterised and
                the small UI type inside it turns soft on a projector */}
            <motion.div
              className="relative"
              initial={false}
              animate={reducedMotion ? { y: 0 } : { y: [0, -7, 0] }}
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : { duration: 9, repeat: Infinity, ease: "easeInOut" }
              }
            >
              <div className="rounded-[28px] border border-[#2b3a36]/20 bg-[#20302c] p-3 shadow-[0_50px_90px_-40px_rgba(40,32,16,0.6)]">
                <div className="overflow-hidden rounded-[16px] bg-cream">
                  <GenImage
                    name="website-mockup"
                    ratio="16 / 10"
                    alt="موقع وافد على لابتوب"
                    className="w-full"
                    priority
                  />
                </div>
                <div className="mx-auto mt-2 h-1.5 w-16 rounded-full bg-white/15" />
              </div>
              <div className="mx-auto -mt-1 h-4 w-[92%] rounded-b-[18px] bg-[#d8d2c4] shadow-[0_18px_30px_-18px_rgba(50,38,18,0.5)]" />
              <div className="mx-auto h-1.5 w-[26%] rounded-b-full bg-[#bdb6a6]" />
            </motion.div>
            <div className="pointer-events-none absolute -inset-10 -z-10 rounded-[60px] bg-[radial-gradient(ellipse_at_center,rgba(202,156,94,0.22),transparent_65%)] blur-2xl" />
          </div>
        </div>

        {/* cards with a dotted thread running between them */}
        <div className="relative flex w-[552px] flex-col items-stretch">
          {cards.map((card, index) => {
            const visible = step > index;
            const Icon = card.icon;
            return (
              <Fragment key={card.id}>
                {index > 0 && (
                  <div
                    className="relative h-[68px] w-full"
                    aria-hidden
                  >
                    <svg viewBox="0 0 552 68" className="h-full w-full" fill="none">
                      <path
                        d={
                          index === 1
                            ? "M462 6C410 22 330 44 96 60"
                            : "M96 8C220 24 360 40 462 60"
                        }
                        stroke="#ca9c5e"
                        strokeWidth="3"
                        strokeDasharray="10 10"
                        strokeLinecap="round"
                        opacity={visible ? 0.75 : 0.2}
                        style={{ transition: "opacity 500ms ease" }}
                      />
                      <circle cx={index === 1 ? 462 : 96} cy={index === 1 ? 6 : 8} r="5" fill={visible ? "#ca9c5e" : "#d9cfbc"} />
                      <circle cx={index === 1 ? 96 : 462} cy={index === 1 ? 60 : 60} r="5" fill={visible ? "#ca9c5e" : "#d9cfbc"} />
                    </svg>
                  </div>
                )}
                <motion.article
                  className={`relative w-[478px] rounded-[26px] border bg-[#fffdf8]/95 px-7 py-5 ${
                    index === 0 ? "self-start" : index === 1 ? "self-center" : "self-end"
                  }`}
                  style={{
                    borderColor: visible ? "rgba(202,156,94,0.45)" : "rgba(15,94,88,0.1)",
                    boxShadow: visible
                      ? "0 26px 50px -34px rgba(68,47,20,0.4)"
                      : "0 8px 20px -18px rgba(68,47,20,0.2)",
                  }}
                  initial={false}
                  animate={{
                    opacity: visible ? 1 : 0.25,
                    x: visible ? 0 : 34,
                    filter: visible ? "blur(0px)" : "blur(3px)",
                  }}
                  transition={{ duration: reducedMotion ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`grid h-11 w-11 place-items-center rounded-xl ${
                        card.tone === "gold" ? "bg-gold/15 text-gold-600" : "bg-green/10 text-green"
                      }`}
                    >
                      <Icon size={22} />
                    </span>
                    <h3 className="text-[30px] font-medium text-green-deep">{card.title}</h3>
                  </div>
                  <p className="mt-2 text-[24px] leading-relaxed text-ink">{card.text}</p>
                </motion.article>
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
