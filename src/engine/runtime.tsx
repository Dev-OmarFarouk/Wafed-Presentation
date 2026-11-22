import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { stage } from "../theme/tokens";

export type SlideRuntime = {
  /** true while a slide is rendered as an overview miniature */
  preview: boolean;
  reducedMotion: boolean;
};

const RuntimeContext = createContext<SlideRuntime>({ preview: false, reducedMotion: false });

export function SlideRuntimeProvider({
  preview = false,
  reducedMotion,
  children,
}: {
  preview?: boolean;
  reducedMotion: boolean;
  children: React.ReactNode;
}) {
  const value = useMemo(() => ({ preview, reducedMotion }), [preview, reducedMotion]);
  return <RuntimeContext.Provider value={value}>{children}</RuntimeContext.Provider>;
}

export function useSlideRuntime(): SlideRuntime {
  return useContext(RuntimeContext);
}

/** `?motion=off` lets a presenter or a reviewer disable motion by hand. */
function urlWantsReduced(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const value = new URLSearchParams(window.location.search).get("motion");
    return value === "off" || value === "reduce";
  } catch {
    return false;
  }
}

/** Reads the user motion preference and keeps it live. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches || urlWantsReduced();
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches || urlWantsReduced());
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/**
 * Scales the fixed 1920x1080 stage to fill the viewport with letterboxing.
 * Resize events can be missed while a window is minimised or a preview panel
 * changes size, so the measurement is also re-run on a slow heartbeat.
 */
export function useStageScale() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    let frame = 0;
    let last = "";
    void frame;

    const measure = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (!w || !h) return;
      const next = Math.min(w / stage.width, h / stage.height);
      const safe = Number.isFinite(next) && next > 0 ? next : 1;
      const key = `${w}x${h}`;
      if (key === last) return;
      last = key;
      setScale(safe);
    };

    const onResize = () => {
      // measure synchronously: rAF is paused while the tab is hidden, which
      // used to leave the stage at a stale scale after a window resize.
      last = "";
      cancelAnimationFrame(frame);
      measure();
    };

    measure();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    window.visualViewport?.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onResize);

    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(onResize)
        : null;
    observer?.observe(document.documentElement);

    const heartbeat = window.setInterval(onResize, 900);

    return () => {
      cancelAnimationFrame(frame);
      window.clearInterval(heartbeat);
      observer?.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onResize);
    };
  }, []);

  return scale;
}

/** Converts client coordinates to the fixed stage coordinate space. */
export function clientToStage(clientX: number, clientY: number): { x: number; y: number } {
  const el = document.querySelector<HTMLElement>("[data-stage-root]");
  if (!el) return { x: stage.width / 2, y: stage.height / 2 };
  const rect = el.getBoundingClientRect();
  const scale = rect.width / stage.width || 1;
  return {
    x: (clientX - rect.left) / scale,
    y: (clientY - rect.top) / scale,
  };
}

type TiltHandlers = {
  onPointerMove: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerLeave: () => void;
};

/**
 * Lightweight CSS 3D tilt. Writes CSS variables instead of re-rendering.
 */
export function useTilt(strength = 8): {
  ref: React.RefObject<HTMLDivElement>;
  handlers: TiltHandlers;
} {
  const ref = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useSlideRuntime();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
    el.style.setProperty("--tilt-lift", "0px");
  }, []);

  const handlers: TiltHandlers = {
    onPointerMove: (event) => {
      if (reducedMotion) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      el.style.setProperty("--tilt-y", `${(px * strength * 2).toFixed(2)}deg`);
      el.style.setProperty("--tilt-x", `${(-py * strength * 2).toFixed(2)}deg`);
      el.style.setProperty("--tilt-lift", "-6px");
    },
    onPointerLeave: () => {
      const el = ref.current;
      if (!el) return;
      el.style.setProperty("--tilt-x", "0deg");
      el.style.setProperty("--tilt-y", "0deg");
      el.style.setProperty("--tilt-lift", "0px");
    },
  };

  return { ref, handlers };
}

/** True when WebGL is available in this browser. */
export function useWebglSupport(): boolean {
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") ??
        canvas.getContext("webgl") ??
        canvas.getContext("experimental-webgl");
      setSupported(Boolean(gl));
    } catch {
      setSupported(false);
    }
  }, []);

  return supported;
}
