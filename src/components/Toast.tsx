import { AnimatePresence, motion } from "framer-motion";
import { IconCheck } from "./Icons";

export function Toast({ message, show }: { message: string; show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute bottom-16 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 rounded-full border border-gold/30 bg-green-deep px-7 py-3 text-[24px] text-cream shadow-lg"
          role="status"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-gold/20 text-gold-300">
            <IconCheck size={18} />
          </span>
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
