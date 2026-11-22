import { AnimatePresence, motion } from "framer-motion";
import type { Persona } from "../data/personas";
import { GenImage } from "../components/GenImage";
import { TiltCard } from "../components/TiltCard";
import { LeavesFrame } from "../components/Leaves";
import { useSlideRuntime } from "../engine/runtime";
import {
  IconBuilding,
  IconCompass,
  IconDoc,
  IconHeart,
  IconHome,
  IconPin,
  IconShield,
  IconSpark,
  IconTarget,
  IconUsers,
} from "../components/Icons";

const factIcons = {
  age: IconSpark,
  pin: IconPin,
  study: IconDoc,
  heart: IconHeart,
  user: IconUsers,
  job: IconBuilding,
  home: IconHome,
} as const;

type SectionKey = "overview" | "goals" | "needs" | "behaviors" | "pains" | "personality";

const sections: { key: SectionKey; label: string; icon: typeof IconDoc; warm?: boolean }[] = [
  { key: "overview", label: "نظرة عامة", icon: IconDoc },
  { key: "goals", label: "أهدافها", icon: IconTarget },
  { key: "needs", label: "احتياجاتها", icon: IconHeart },
  { key: "behaviors", label: "سلوكها وتفضيلاتها", icon: IconCompass },
  { key: "pains", label: "أبرز التحديات", icon: IconShield, warm: true },
  { key: "personality", label: "شخصيتها باختصار", icon: IconSpark },
];

export function PersonaSlide({ persona, step }: { persona: Persona; step: number }) {
  const { reducedMotion } = useSlideRuntime();
  const isOwner = persona.accent === "gold";
  const accentText = isOwner ? "text-gold-600" : "text-green";
  const accentBg = isOwner ? "bg-gold/12" : "bg-green/8";
  const accentHex = isOwner ? "#ca9c5e" : "#0f5e58";

  const labels = sections.map((section) => {
    if (isOwner) {
      return {
        ...section,
        label:
          section.key === "goals"
            ? "أهدافه"
            : section.key === "needs"
              ? "احتياجاته"
              : section.key === "behaviors"
                ? "سلوكه وتفضيلاته"
                : section.key === "personality"
                  ? "شخصيته باختصار"
                  : section.label,
      };
    }
    return section;
  });

  const activeIndex = step - 1;
  const active = activeIndex >= 0 ? labels[Math.min(activeIndex, labels.length - 1)] : null;

  const bullets =
    active && active.key !== "overview" && active.key !== "personality"
      ? (persona[active.key] as string[])
      : null;

  return (
    <div className="slide-inner overflow-hidden">
      <LeavesFrame opacity={0.25} />
      <div className="relative flex items-end justify-between">
        <div>
          <span className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            Customer Persona
          </span>
          <h2 className="title-lg mt-4">{isOwner ? "صوت أصحاب السكن" : "صوت الطلاب"}</h2>
        </div>
      </div>

      <div className="relative mt-6 flex flex-1 gap-7">
        {/* identity column */}
        <div className="w-[352px] shrink-0">
          <TiltCard strength={4}>
            <article className="card relative overflow-hidden px-5 pb-5 pt-5">
              <div className="relative">
                <GenImage
                  name={persona.photo}
                  ratio="4 / 5"
                  alt={`صورة ${persona.name}`}
                  className="rounded-[26px]"
                />
                <span
                  className="absolute right-4 top-4 rounded-full px-4 py-1.5 text-[17px] font-medium text-cream"
                  style={{ background: accentHex }}
                >
                  {persona.role}
                </span>
              </div>
              <div className="mt-5">
                <h3 className="text-[42px] font-bold text-green-deep">{persona.name}</h3>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-x-2 gap-y-1.5">
                {persona.facts.map((fact) => {
                  const Icon = factIcons[fact.icon];
                  return (
                    <div key={fact.label} className="flex items-start gap-2">
                      <span className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg ${accentBg} ${accentText}`}>
                        <Icon size={15} />
                      </span>
                      <span className="text-[17px] leading-snug text-ink">{fact.value}</span>
                    </div>
                  );
                })}
              </div>
            </article>
          </TiltCard>
        </div>

        {/* section tabs */}
        <div className="flex w-[300px] shrink-0 flex-col gap-2">
          {labels.map((section, index) => {
            const revealed = step > index;
            const isActive = activeIndex === index;
            const Icon = section.icon;
            return (
              <motion.div
                key={section.key}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
                  isActive
                    ? "border-gold/45 bg-white shadow-sm"
                    : revealed
                      ? "border-green/10 bg-white/50"
                      : "border-dashed border-green/10 bg-transparent"
                }`}
                initial={false}
                animate={{ opacity: revealed || isActive ? 1 : 0.4, x: isActive ? -6 : 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.4 }}
              >
                <span
                  className={`grid h-9 w-9 place-items-center rounded-xl ${
                    section.warm ? "bg-[#f6e7e3] text-[#a4544a]" : `${accentBg} ${accentText}`
                  }`}
                >
                  <Icon size={17} />
                </span>
                <span className="text-[23px] font-medium text-ink">{section.label}</span>
                {revealed && <span className="mr-auto h-2 w-2 rounded-full bg-gold/70" />}
              </motion.div>
            );
          })}

        </div>

        {/* detail panel */}
        <div className="relative flex-1 overflow-hidden rounded-[30px] border border-green/10 bg-[#fffdf8]/85 px-10 py-8">
          <span className="absolute -left-6 -top-8 text-[160px] font-bold leading-none text-gold/10">”</span>

          <AnimatePresence mode="wait">
            {!active && (
              <motion.div
                key="quote"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: reducedMotion ? 0 : 0.45 }}
                className="relative flex h-full flex-col justify-center"
              >
                <span className="text-[20px] font-medium tracking-wide text-gold">
                  {isOwner ? "كلامه بلسانه" : "كلامها بلسانها"}
                </span>
                <p className="mt-5 text-[38px] font-medium leading-snug text-green-deep">
                  {persona.quote}
                </p>
                <div className="mt-8 h-[2px] w-24 rounded-full bg-gold/50" />
                <p className="mt-5 text-[22px] text-ink-soft">
                  {persona.name} — {persona.role}
                </p>
              </motion.div>
            )}

            {active && (
              <motion.div
                key={active.key}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: reducedMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex h-full flex-col"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`grid h-12 w-12 place-items-center rounded-2xl ${
                      active.warm ? "bg-[#f6e7e3] text-[#a4544a]" : `${accentBg} ${accentText}`
                    }`}
                  >
                    {(() => {
                      const ActiveIcon = active.icon;
                      return <ActiveIcon size={22} />;
                    })()}
                  </span>
                  <h3 className={`text-[38px] font-bold ${active.warm ? "text-[#a4544a]" : "text-green-deep"}`}>
                    {active.warm ? "أبرز التحديات (نقاط الألم)" : active.label}
                  </h3>
                </div>

                {active.key === "overview" && (
                  <p className="mt-6 text-[27px] leading-relaxed text-ink">{persona.overview}</p>
                )}

                {active.key === "personality" && (
                  <div className="mt-8">
                    <p className="text-[34px] leading-relaxed text-ink">{persona.personality}</p>
                    <div className="mt-8 flex flex-wrap gap-2">
                      {persona.personality.split("،").map((trait) => (
                        <span
                          key={trait}
                          className="rounded-full border border-gold/30 bg-gold/8 px-4 py-1.5 text-[20px] text-green"
                        >
                          {trait.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {bullets && (
                  <ul className="mt-6 grid grid-cols-1 gap-3">
                    {bullets.map((item, index) => (
                      <motion.li
                        key={item}
                        className={`flex items-start gap-3 rounded-xl px-3 py-2 ${
                          active.warm ? "bg-[#fbf0ed]" : index % 2 === 0 ? "bg-cream-2/70" : "bg-transparent"
                        }`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: reducedMotion ? 0 : 0.4,
                          delay: reducedMotion ? 0 : index * 0.06,
                        }}
                      >
                        <span
                          className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${
                            active.warm ? "bg-[#a4544a]" : "bg-gold"
                          }`}
                        />
                        <span className="text-[25px] leading-snug text-ink">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
