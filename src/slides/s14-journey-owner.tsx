import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ownerFlow } from "../data/flows";
import { FlowSlide } from "../components/FlowSlide";
import { GoldParticles } from "../components/GoldParticles";
import { site } from "../data/site";
import { useSlideRuntime } from "../engine/runtime";

export default function JourneyOwnerSlide({ step }: { step: number }) {
  const { reducedMotion } = useSlideRuntime();
  const last = ownerFlow.groups.length - 1;
  const isEnd = step >= last;
  const isThanks = step >= last + 1;
  const [showEnd, setShowEnd] = useState(false);
  const [showThanks, setShowThanks] = useState(false);

  useEffect(() => {
    if (!isEnd) {
      setShowEnd(false);
      setShowThanks(false);
      return;
    }
    setShowEnd(true);
  }, [isEnd]);

  useEffect(() => {
    if (!isThanks) {
      setShowThanks(false);
      return;
    }
    setShowThanks(true);
  }, [isThanks]);

  return (
    <FlowSlide
      flow={ownerFlow}
      step={step}
      overlay={
        <AnimatePresence>
          {showEnd && (
            <motion.div
              className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-cream/94 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0.2 : 0.9, ease: "easeOut" }}
            >
              <GoldParticles count={42} intensity={1} />

              <svg
                className="pointer-events-none absolute inset-0 h-full w-full"
                viewBox="0 0 1920 1080"
                fill="none"
                aria-hidden
              >
                <motion.path
                  d="M1710 120C1400 80 1320 250 1080 310 830 372 900 540 700 600 480 666 330 800 230 1010"
                  stroke="#ca9c5e"
                  strokeWidth="4"
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray="1"
                  initial={{ strokeDashoffset: 1, opacity: 0 }}
                  animate={{ strokeDashoffset: 0, opacity: 0.7 }}
                  transition={{ duration: reducedMotion ? 0 : 1.8, ease: "easeInOut" }}
                />
              </svg>

              <motion.img
                src="/assets/logo.png"
                alt="وافد"
                draggable={false}
                className="relative h-[360px] w-auto select-none drop-shadow-[0_40px_60px_rgba(80,56,24,0.22)]"
                initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: reducedMotion ? 0.2 : 1.2, delay: reducedMotion ? 0 : 0.4 }}
              />

              {showThanks && (
                <>
                  <motion.p
                    className="relative mt-6 text-[30px] font-medium text-green"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: reducedMotion ? 0.2 : 0.8 }}
                  >
                    {site.definition}
                  </motion.p>
                  <motion.p
                    className="relative mt-2 text-[21px] text-ink-soft"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: reducedMotion ? 0.2 : 0.8 }}
                  >
                    {site.finalLine}
                  </motion.p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      }
    />
  );
}
