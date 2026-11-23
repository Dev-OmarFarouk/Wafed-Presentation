import { useEffect, useState, type ReactNode } from "react";
import { slides } from "./slides";

/** every image the deck can show — preloaded before the first slide appears */
const ASSETS = [
  "/assets/logo.png",
  "/assets/logo-mark.png",
  "/assets/team/member-1.png",
  "/assets/team/member-2.png",
  "/assets/team/member-3.png",
  "/assets/team/member-4.png",
  "/assets/generated/student-struggle.png",
  "/assets/generated/owner-struggle.png",
  "/assets/generated/handshake.png",
  "/assets/generated/persona-student.png",
  "/assets/generated/persona-owner.png",
  "/assets/generated/website-mockup.png",
  "/assets/generated/solution-roommate.png",
  "/assets/generated/solution-manage.png",
  "/assets/generated/solution-filters.png",
  "/assets/generated/solution-verify.png",
  "/assets/generated/solution-chat.png",
  "/assets/generated/solution-transport.png",
  "/assets/brands/casita.png",
  "/assets/brands/sakani.png",
  "/assets/brands/uhomes.png",
];

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    img.onload = finish;
    img.onerror = finish;
    img.src = src;
    // already in the http cache: no load event will fire
    if (img.complete) finish();
    // a stalled request must never hold the deck behind the loader
    window.setTimeout(finish, 12000);
  });
}

export function Boot({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const startedAt = performance.now();
    const total = ASSETS.length + 2;
    let done = 0;

    const bump = () => {
      done += 1;
      if (!cancelled) setProgress(Math.min(1, done / total));
    };

    const jobs: Promise<unknown>[] = ASSETS.map((src) => preloadImage(src).then(bump));

    // warm every slide chunk so no fragment state has to fetch mid-presentation
    jobs.push(Promise.allSettled(slides.map((slide) => slide.preload?.() ?? null)).then(bump));

    jobs.push(
      (document.fonts?.ready ?? Promise.resolve()).then(bump)
    );

    void Promise.allSettled(jobs).then(() => {
      if (cancelled) return;
      const remaining = Math.max(0, 900 - (performance.now() - startedAt));
      window.setTimeout(() => {
        if (cancelled) return;
        setHidden(true);
        // guarantee removal even if the opacity transition is frozen (e.g. backgrounded tab)
        window.setTimeout(() => {
          if (!cancelled) {
            setRemoved(true);
            // mount the deck only after the loader is gone, so the intro
            // timeline starts on screen instead of running behind the loader
            setReady(true);
          }
        }, 750);
      }, remaining);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const percent = Math.round(progress * 100);

  return (
    <>
      {ready ? children : null}

      {!removed && (
      <div
        aria-hidden={hidden}
        role="status"
        aria-live="polite"
        className={`fixed inset-0 z-[200] flex flex-col items-center justify-center gap-9 bg-cream transition-opacity duration-700 ${
          hidden ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <div className="pointer-events-none absolute inset-0 grain opacity-40" />
        <img
          src="/assets/logo.png"
          alt="وافد"
          className="relative h-[210px] w-auto select-none"
          draggable={false}
        />

        <div className="relative flex w-[340px] flex-col items-center gap-3">
          <div className="h-[4px] w-full overflow-hidden rounded-full bg-green/10">
            <div
              className="h-full rounded-full bg-gradient-to-l from-gold-600 via-gold to-gold-300 transition-[width] duration-300 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-[19px] tracking-wide text-ink-soft">
            بنجهّز العرض… <span className="num">{percent}%</span>
          </p>
        </div>
      </div>
      )}
    </>
  );
}
