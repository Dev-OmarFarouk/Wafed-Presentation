import { useEffect, useRef } from "react";
import gsap from "gsap";
import { GoldParticles } from "../components/GoldParticles";
import { LeavesFrame } from "../components/Leaves";
import { site } from "../data/site";
import { useSlideRuntime, useTilt } from "../engine/runtime";

export default function IntroSlide({ step: _step }: { step: number }) {
  const { preview, reducedMotion } = useSlideRuntime();
  const root = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const { ref: logoRef, handlers } = useTilt(6);

  useEffect(() => {
    if (preview) return;
    const el = root.current;
    const path = pathRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      if (reducedMotion) {
        gsap.set(
          [q(".intro-logo"), q(".intro-tagline"), q(".intro-def"), q(".intro-kicker")],
          { opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }
        );
        gsap.set(q(".intro-halo"), { opacity: 0.9, scale: 1 });
        gsap.set(q(".intro-path"), { opacity: 0.32 });
        return;
      }

      if (path) {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length, opacity: 1 });
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(q(".intro-halo"), { scale: 0.55, opacity: 0, duration: 1.5, ease: "power2.out" }, 0)
        .from(
          q(".intro-logo"),
          { y: 46, opacity: 0, scale: 0.92, filter: "blur(16px)", duration: 1.25 },
          0.15
        )
        .fromTo(q(".intro-kicker"), { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.8 }, 0.3)
        .to(q(".intro-path"), { strokeDashoffset: 0, duration: 2.1, ease: "power2.inOut" }, 0.45)
        .fromTo(
          q(".intro-tagline"),
          { y: 24, opacity: 0, filter: "blur(10px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.95 },
          1.0
        )
        .fromTo(q(".intro-def"), { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, 1.3);
    }, el);

    // if the intro tween is ever interrupted, never leave the hero invisible
    const failsafe = window.setTimeout(() => {
      gsap.set(
        el.querySelectorAll(".intro-logo, .intro-tagline, .intro-def, .intro-kicker"),
        { opacity: 1, filter: "blur(0px)", y: 0, scale: 1 }
      );
    }, 4200);

    return () => {
      window.clearTimeout(failsafe);
      ctx.revert();
    };
  }, [preview, reducedMotion]);

  return (
    <div ref={root} className="slide-inner items-center justify-center overflow-hidden">
      <LeavesFrame opacity={0.9} />
      <GoldParticles count={36} intensity={0.85} />

      {/* the travel line behind the brand */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1920 1080"
        fill="none"
        aria-hidden
      >
        <path
          ref={pathRef}
          className="intro-path"
          d="M1730 74C1450 60 1350 236 1104 302 848 370 902 546 690 604 462 668 322 800 196 1028"
          stroke="url(#introPath)"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0"
        />
        <defs>
          <linearGradient id="introPath" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#cbe7de" />
            <stop offset="50%" stopColor="#9fcdc1" />
            <stop offset="100%" stopColor="#6faaa0" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute left-24 top-9 flex items-center gap-3">
        <span className="intro-kicker pill border border-green/15 bg-white/50 text-green/70">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          <span dir="ltr" className="tracking-[0.18em] text-[18px]">
            {site.uxLabel}
          </span>
        </span>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div
          className="intro-halo pointer-events-none absolute left-1/2 top-[270px] h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(202,156,94,0.28),rgba(202,156,94,0)_66%)] blur-2xl"
          aria-hidden
        />
        <div
          className="intro-halo pointer-events-none absolute left-1/2 top-[270px] h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/20"
          aria-hidden
        />

        <div className="intro-logo relative" style={{ perspective: "1400px" }}>
          <div ref={logoRef} {...handlers} className="tilt-surface">
            <img
              src="/assets/logo.png"
              alt="وافد — سكن للطلاب، فرصة لأصحاب السكن"
              draggable={false}
              className="floaty h-[540px] w-auto select-none drop-shadow-[0_46px_60px_rgba(80,56,24,0.20)]"
            />
          </div>
        </div>

        <p className="intro-tagline mt-2 text-center text-[44px] font-medium leading-snug text-green">
          {site.tagline}
        </p>
        <p className="intro-def mt-5 flex items-center gap-4 text-center text-[27px] text-ink-soft">
          <span className="h-[1px] w-14 bg-gold/50" />
          {site.definition}
          <span className="h-[1px] w-14 bg-gold/50" />
        </p>
      </div>
    </div>
  );
}
