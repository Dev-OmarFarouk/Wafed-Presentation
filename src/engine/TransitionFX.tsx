import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import type { TransitionKind } from "./types";
import { stage } from "../theme/tokens";

export type TransitionOrigin = { x: number; y: number };

type Props = {
  token: number;
  kind: TransitionKind;
  origin: TransitionOrigin;
  incoming: React.RefObject<HTMLDivElement>;
  outgoing: React.RefObject<HTMLDivElement>;
  reduced: boolean;
  onDone: () => void;
  onReady: (skip: () => void) => void;
};

/**
 * Animates the incoming slide while the previous slide stays behind it as a ghost.
 * All motion uses transform / opacity / clip-path only.
 */
export function TransitionFX({
  token,
  kind,
  origin,
  incoming,
  outgoing,
  reduced,
  onDone,
  onReady,
}: Props) {
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useLayoutEffect(() => {
    const inEl = incoming.current;
    const outEl = outgoing.current;
    if (!inEl) return;

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(inEl, { clearProps: "clipPath,transform,opacity,filter" });
        if (outEl) gsap.set(outEl, { clearProps: "clipPath,transform,opacity,filter" });
        doneRef.current();
      },
    });

    const skip = () => {
      tl.progress(1);
    };
    onReady(skip);

    gsap.killTweensOf(inEl);
    if (outEl) gsap.killTweensOf(outEl);

    if (reduced) {
      gsap.set(inEl, { opacity: 0 });
      tl.to(inEl, { opacity: 1, duration: 0.22, ease: "power1.out" });
      return () => {
        tl.kill();
        gsap.set(inEl, { clearProps: "clipPath,transform,opacity,filter" });
        if (outEl) gsap.set(outEl, { clearProps: "clipPath,transform,opacity,filter" });
      };
    }

    switch (kind) {
      case "circle": {
        const radius = Math.hypot(
          Math.max(origin.x, stage.width - origin.x),
          Math.max(origin.y, stage.height - origin.y)
        );
        gsap.set(inEl, {
          clipPath: `circle(0px at ${origin.x}px ${origin.y}px)`,
          opacity: 1,
        });
        tl.to(
          inEl,
          {
            clipPath: `circle(${radius * 1.02}px at ${origin.x}px ${origin.y}px)`,
            duration: 0.95,
            ease: "power3.inOut",
          },
          0
        );
        tl.fromTo(inEl, { scale: 1.05 }, { scale: 1, duration: 1.05, ease: "expo.out" }, 0);
        if (outEl) {
          tl.to(outEl, { scale: 1.045, opacity: 0.35, filter: "blur(6px)", duration: 0.8, ease: "power2.in" }, 0);
        }
        break;
      }

      case "goldPath": {
        // a clean reveal — no drawn line between the slides
        gsap.set(inEl, { clipPath: "inset(0 0 0 100%)", opacity: 1 });
        tl.to(inEl, { clipPath: "inset(0 0 0 0%)", duration: 0.72, ease: "power3.inOut" }, 0.05);
        tl.fromTo(inEl, { scale: 1.02 }, { scale: 1, duration: 0.95, ease: "power2.out" }, 0.05);
        if (outEl) tl.to(outEl, { opacity: 0.25, scale: 0.985, duration: 0.6, ease: "power2.in" }, 0);
        break;
      }

      case "zoom": {
        gsap.set(inEl, { opacity: 0, scale: 0.74, filter: "blur(14px)" });
        tl.to(inEl, { opacity: 1, duration: 0.5, ease: "power2.out" }, 0);
        tl.to(inEl, { scale: 1, filter: "blur(0px)", duration: 1.05, ease: "expo.out" }, 0);
        if (outEl) {
          tl.to(
            outEl,
            { scale: 1.55, opacity: 0, filter: "blur(16px)", duration: 0.75, ease: "power2.in" },
            0
          );
        }
        break;
      }

      case "shared": {
        gsap.set(inEl, { opacity: 1, scale: 0.9, clipPath: "inset(14% 10% 14% 10% round 56px)" });
        tl.to(
          inEl,
          {
            scale: 1,
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            duration: 0.95,
            ease: "power3.inOut",
          },
          0
        );
        if (outEl) {
          tl.to(outEl, { scale: 1.12, opacity: 0.45, duration: 0.85, ease: "power2.inOut" }, 0);
        }
        break;
      }

      case "curtain": {
        gsap.set(inEl, { clipPath: "inset(0 0 100% 0)", opacity: 1 });
        tl.to(inEl, { clipPath: "inset(0 0 0% 0)", duration: 0.8, ease: "power3.inOut" }, 0);
        tl.fromTo(inEl, { y: 26 }, { y: 0, duration: 0.9, ease: "power3.out" }, 0);
        if (outEl) tl.to(outEl, { opacity: 0.3, scale: 0.985, duration: 0.6 }, 0);
        break;
      }

      case "parallax":
      default: {
        gsap.set(inEl, { x: 220, opacity: 0.4, scale: 1.03 });
        tl.to(inEl, { x: 0, opacity: 1, scale: 1, duration: 0.9, ease: "power3.out" }, 0);
        if (outEl) {
          tl.to(outEl, { x: -190, opacity: 0.25, scale: 0.975, duration: 0.9, ease: "power3.inOut" }, 0);
        }
        break;
      }
    }

    return () => {
      tl.kill();
      gsap.set(inEl, { clearProps: "clipPath,transform,opacity,filter" });
      if (outEl) gsap.set(outEl, { clearProps: "clipPath,transform,opacity,filter" });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return null;
}
