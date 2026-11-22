import { motion } from "framer-motion";
import { IconClose } from "../components/Icons";

const shortcuts: { keys: string[]; label: string }[] = [
  { keys: ["←", "Space", "PageDown"], label: "السلايد أو الخطوة اللي بعدها" },
  { keys: ["→", "Backspace", "PageUp"], label: "السلايد أو الخطوة اللي قبلها" },
  { keys: ["Home"], label: "أول سلايد" },
  { keys: ["End"], label: "آخر سلايد" },
  { keys: ["G"], label: "شبكة العرض" },
  { keys: ["F"], label: "ملء الشاشة" },
  { keys: ["Esc"], label: "اقفل الشبكة أو المساعدة" },
  { keys: ["?"], label: "لوحة الاختصارات" },
];

export function HelpPanel({ reduced, onClose }: { reduced: boolean; onClose: () => void }) {
  return (
    <motion.div
      className="absolute inset-0 z-50 grid place-items-center bg-green-deep/25"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0.12 : 0.25 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="اختصارات الكيبورد"
    >
      <motion.div
        className="card w-[760px] px-12 py-10"
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: reduced ? 0.12 : 0.32, ease: [0.22, 1, 0.36, 1] }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-7 flex items-start justify-between">
          <div>
            <p className="text-[20px] font-medium text-gold">اختصارات سريعة</p>
            <h2 className="mt-1 text-[40px] font-bold text-green">تحكم في العرض من الكيبورد</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="اقفل لوحة الاختصارات"
            className="grid h-12 w-12 place-items-center rounded-full border border-green/15 text-green transition hover:bg-green-100"
          >
            <IconClose size={22} />
          </button>
        </div>
        <ul className="grid grid-cols-2 gap-x-10 gap-y-4">
          {shortcuts.map((row) => (
            <li key={row.label} className="flex items-center justify-between gap-4 border-b border-green/10 pb-3">
              <span className="text-[24px] text-ink">{row.label}</span>
              <span className="flex gap-1.5">
                {row.keys.map((key) => (
                  <kbd
                    key={key}
                    className="num min-w-[42px] rounded-lg border border-green/15 bg-cream-2 px-2 py-1 text-center text-[18px] font-medium text-green"
                    dir="ltr"
                  >
                    {key}
                  </kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-7 text-[20px] text-ink-soft">
          على الموبايل: اسحب بإصبعك في اتجاه السهم، أو دوس على أزرار التنقل.
        </p>
      </motion.div>
    </motion.div>
  );
}
