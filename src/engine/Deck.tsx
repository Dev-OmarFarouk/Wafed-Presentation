import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { slides } from "./slides";
import { SlideView } from "./SlideView";
import { Overview } from "./Overview";
import { HelpPanel } from "./HelpPanel";
import { TransitionFX } from "./TransitionFX";
import type { DeckPosition, TransitionKind } from "./types";
import { usePrefersReducedMotion, useStageScale, clientToStage } from "./runtime";
import {
  IconChevronLeft,
  IconChevronRight,
  IconExpand,
  IconGrid,
  IconHelp,
} from "../components/Icons";

function clampIndex(index: number): number {
  if (!Number.isFinite(index)) return 0;
  return Math.max(0, Math.min(slides.length - 1, Math.floor(index)));
}

function readHash(): DeckPosition {
  // #/slide or #/slide/step (1-based) — deep links straight into a fragment state
  const match = window.location.hash.match(/#\/?(\d+)(?:\/(\d+))?/);
  if (!match) return { index: 0, step: 0 };
  const index = clampIndex(Number(match[1]) - 1);
  const maxStep = slides[index].steps - 1;
  const step = match[2] ? Math.max(0, Math.min(maxStep, Number(match[2]) - 1)) : 0;
  return { index, step };
}

export default function Deck() {
  const reduced = usePrefersReducedMotion();
  const scale = useStageScale();
  const [pos, setPos] = useState<DeckPosition>(() => readHash());
  const posRef = useRef(pos);
  posRef.current = pos;

  const incomingRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const tokenRef = useRef(0);
  const skipRef = useRef<(() => void) | null>(null);

  const [ghost, setGhost] = useState<{ token: number; index: number; step: number } | null>(null);
  const [fx, setFx] = useState<{ token: number; kind: TransitionKind; origin: { x: number; y: number } } | null>(
    null
  );

  const [overview, setOverview] = useState(false);
  const [help, setHelp] = useState(false);
  const [chrome, setChrome] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const current = slides[pos.index];
  const total = slides.length;

  const hideTimer = useRef<number | null>(null);
  const wake = useCallback(() => {
    setChrome(true);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setChrome(false), 3800);
  }, []);

  const startTransition = useCallback(
    (target: DeckPosition, origin?: { x: number; y: number }, kind?: TransitionKind) => {
      const from = posRef.current;
      const token = ++tokenRef.current;
      const def = slides[target.index];
      setGhost({ token, index: from.index, step: from.step });
      setFx({
        token,
        kind: kind ?? def.transition,
        origin: origin ?? { x: 960, y: 540 },
      });
      setPos(target);
    },
    []
  );

  const goToSlide = useCallback(
    (index: number, origin?: { x: number; y: number }) => {
      const target = { index: clampIndex(index), step: 0 };
      if (target.index === posRef.current.index) return;
      skipRef.current?.();
      startTransition(target, origin);
    },
    [startTransition]
  );

  const next = useCallback(() => {
    skipRef.current?.();
    const { index, step } = posRef.current;
    const def = slides[index];
    if (step < def.steps - 1) {
      setPos({ index, step: step + 1 });
      return;
    }
    if (index < total - 1) {
      startTransition({ index: index + 1, step: 0 });
    }
  }, [startTransition, total]);

  const prev = useCallback(() => {
    skipRef.current?.();
    const { index, step } = posRef.current;
    if (step > 0) {
      setPos({ index, step: step - 1 });
      return;
    }
    if (index > 0) {
      startTransition({ index: index - 1, step: slides[index - 1].steps - 1 }, undefined, "parallax");
    }
  }, [startTransition]);

  const toggleFullscreen = useCallback(() => {
    const doc = document;
    if (!doc.fullscreenElement) {
      doc.documentElement.requestFullscreen?.().catch(() => undefined);
    } else {
      doc.exitFullscreen?.().catch(() => undefined);
    }
  }, []);

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // wheel (scroll) navigation: down = next, up = previous
  useEffect(() => {
    let last = 0;
    const onWheel = (event: WheelEvent) => {
      if (overview || help) return;
      const now = Date.now();
      if (now - last < 700) return;
      if (Math.abs(event.deltaY) < 24) return;
      last = now;
      event.preventDefault();
      if (event.deltaY > 0) next();
      else prev();
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [help, next, overview, prev]);

  // click anywhere on the stage advances one step (unless on an interactive control)
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (overview || help) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("button, a, input, textarea, [data-no-advance]")) return;
      next();
    };
    const stage = document.querySelector<HTMLElement>("[data-stage-root]")?.parentElement;
    stage?.addEventListener("click", onClick);
    return () => stage?.removeEventListener("click", onClick);
  }, [help, next, overview]);

  // allow browser back / forward and deep links while presenting
  useEffect(() => {
    const onHash = () => {
      const next = readHash();
      if (next.index !== posRef.current.index) {
        skipRef.current?.();
        startTransition(next, undefined, "circle");
        return;
      }
      if (next.step !== posRef.current.step) setPos(next);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [startTransition]);

  // keep the url hash in sync (including the fragment step)
  useEffect(() => {
    const want = pos.step > 0 ? `#/${pos.index + 1}/${pos.step + 1}` : `#/${pos.index + 1}`;
    if (window.location.hash !== want) {
      window.history.replaceState(null, "", want);
    }
  }, [pos.index, pos.step]);

  // keyboard controls
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      wake();

      if (event.key === "Escape") {
        if (help) {
          setHelp(false);
          event.preventDefault();
          return;
        }
        if (overview) {
          setOverview(false);
          event.preventDefault();
          return;
        }
      }

      if (event.key === "?" || (event.key === "/" && event.shiftKey)) {
        event.preventDefault();
        setHelp((value) => !value);
        return;
      }

      if (event.key.toLowerCase() === "g") {
        event.preventDefault();
        setOverview((value) => !value);
        return;
      }

      if (event.key.toLowerCase() === "f") {
        event.preventDefault();
        toggleFullscreen();
        return;
      }

      if (overview || help) return;

      switch (event.key) {
        case "ArrowLeft":
        case "PageDown":
        case " ":
        case "Spacebar":
          event.preventDefault();
          next();
          break;
        case "ArrowRight":
        case "PageUp":
        case "Backspace":
          event.preventDefault();
          prev();
          break;
        case "Home":
          event.preventDefault();
          goToSlide(0);
          break;
        case "End":
          event.preventDefault();
          goToSlide(total - 1);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goToSlide, help, next, overview, prev, toggleFullscreen, total, wake]);

  // hide the chrome after a few idle seconds, reset on any activity
  useEffect(() => {
    wake();
    return () => {
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, [wake]);

  useEffect(() => {
    const onMove = () => wake();
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
    };
  }, [wake]);

  // quietly warm up the next slide chunk
  useEffect(() => {
    const upcoming = slides[pos.index + 1];
    if (!upcoming) return;
    const id = window.setTimeout(() => {
      void upcoming.preload?.();
    }, 400);
    return () => window.clearTimeout(id);
  }, [pos.index]);

  const onTouchStart = (event: React.TouchEvent) => {
    const touch = event.changedTouches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || overview || help) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) < 56 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
    if (dx < 0) next();
    else prev();
  };

  const progress = useMemo(() => {
    const stepFraction = (pos.step + 1) / current.steps;
    return Math.min(1, (pos.index + stepFraction) / total);
  }, [current.steps, pos.index, pos.step, total]);

  return (
    <div
      className="stage-wrap"
      onPointerMove={wake}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="stage" data-stage-root style={{ transform: `scale(${scale})` }}>
        {/* incoming / current slide */}
        <div className="slide-layer z-20" ref={incomingRef}>
          <SlideView index={pos.index} step={pos.step} reducedMotion={reduced} />
        </div>

        {/* outgoing slide ghost */}
        {ghost && (
          <div className="slide-layer z-10" ref={ghostRef} aria-hidden>
            <SlideView index={ghost.index} step={ghost.step} reducedMotion={reduced} />
          </div>
        )}

        {fx && (
          <TransitionFX
            token={fx.token}
            kind={fx.kind}
            origin={fx.origin}
            incoming={incomingRef}
            outgoing={ghostRef}
            reduced={reduced}
            onReady={(skip) => {
              skipRef.current = skip;
            }}
            onDone={() => {
              skipRef.current = null;
              setGhost(null);
              setFx(null);
            }}
          />
        )}

        {/* progress bar */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-40 h-[4px] bg-green/10">
          <div
            className="h-full rounded-l-full transition-[width] duration-500 ease-out"
            style={{
              width: `${progress * 100}%`,
              background: "linear-gradient(90deg,#b8853f,#e3cba1,#ca9c5e)",
            }}
          />
        </div>

        {/* chrome */}
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 z-40 transition-opacity duration-500 ${
            chrome || overview || help ? "opacity-100" : "opacity-0"
          }`}
          style={{ pointerEvents: chrome || overview || help ? "auto" : "none" }}
        >
          <div className="flex items-end justify-between px-10 pb-7">
            {/* navigation */}
            <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-green/10 bg-white/70 p-1.5 shadow-sm backdrop-blur">
              <button
                onClick={prev}
                aria-label="السابق"
                className="grid h-11 w-11 place-items-center rounded-full text-green transition hover:bg-green-100 disabled:opacity-30"
                disabled={pos.index === 0 && pos.step === 0}
              >
                <IconChevronRight size={22} />
              </button>
              <button
                onClick={next}
                aria-label="التالي"
                className="grid h-11 w-11 place-items-center rounded-full bg-green text-cream transition hover:bg-green-deep disabled:opacity-30"
                disabled={pos.index === total - 1 && pos.step === current.steps - 1}
              >
                <IconChevronLeft size={22} />
              </button>
            </div>

            {/* counter + dots */}
            <div className="pointer-events-auto flex flex-col items-center gap-2">
              <div className="text-[19px] font-medium text-green/80">
                <span className="num text-gold">{pos.index + 1}</span>
                <span className="num"> / {total}</span>
                <span className="mx-3 text-green/25">|</span>
                <span className="text-ink-soft">{current.title}</span>
              </div>
              <div className="flex items-center gap-1.5" role="tablist" aria-label="التنقل بين السلايدز">
                {slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    role="tab"
                    aria-selected={index === pos.index}
                    aria-label={slide.title}
                    onClick={() => goToSlide(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === pos.index
                        ? "w-7 bg-gold"
                        : index < pos.index
                          ? "w-1.5 bg-green/40"
                          : "w-1.5 bg-green/15 hover:bg-green/30"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* utilities */}
            <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-green/10 bg-white/70 p-1.5 shadow-sm backdrop-blur">
              <button
                onClick={() => setOverview((value) => !value)}
                aria-label="شبكة العرض"
                aria-pressed={overview}
                className="grid h-11 w-11 place-items-center rounded-full text-green transition hover:bg-green-100"
              >
                <IconGrid size={20} />
              </button>
              <button
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? "اخرج من ملء الشاشة" : "ملء الشاشة"}
                aria-pressed={isFullscreen}
                className="grid h-11 w-11 place-items-center rounded-full text-green transition hover:bg-green-100"
              >
                <IconExpand size={20} />
              </button>
              <button
                onClick={() => setHelp(true)}
                aria-label="اختصارات الكيبورد"
                className="grid h-11 w-11 place-items-center rounded-full text-green transition hover:bg-green-100"
              >
                <IconHelp size={20} />
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {overview && (
            <Overview
              current={pos.index}
              reduced={reduced}
              onSelect={(index, client) => {
                const origin = clientToStage(client.x, client.y);
                setOverview(false);
                goToSlide(index, origin);
              }}
              onClose={() => setOverview(false)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>{help && <HelpPanel reduced={reduced} onClose={() => setHelp(false)} />}</AnimatePresence>

        <p className="sr-only" aria-live="polite">
          {`السلايد ${pos.index + 1} من ${total}: ${current.title}`}
        </p>

        {/* portrait phone hint */}
        <div className="rotate-hint" aria-hidden>
          <div className="rotate-phone">
            <span />
          </div>
          <p>لف الموبايل عشان العرض يبان صح</p>
          <span className="rotate-sub">العرض أفقي، وكل سلايد شاشة كاملة</span>
        </div>
      </div>
    </div>
  );
}
