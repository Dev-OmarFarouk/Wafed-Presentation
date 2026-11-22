import { Suspense, lazy } from "react";
import { useSlideRuntime, useWebglSupport } from "../engine/runtime";
import { LogoMark } from "./Logo";

const LogoScene = lazy(() => import("../three/LogoScene"));

export function LogoVisual({ className = "" }: { className?: string }) {
  const { preview, reducedMotion } = useSlideRuntime();
  const webgl = useWebglSupport();
  const weakDevice =
    typeof navigator !== "undefined" && (navigator.hardwareConcurrency ?? 8) <= 4;

  if (preview || reducedMotion || !webgl || weakDevice) {
    return (
      <div className={`grid place-items-center ${className}`}>
        <div className="relative floaty">
          <div className="absolute inset-0 -z-10 rounded-full bg-gold/20 blur-3xl" />
          <LogoMark className="h-[420px] w-[310px] drop-shadow-[0_30px_50px_rgba(80,56,24,0.25)]" />
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <Suspense
        fallback={
          <div className="grid h-full place-items-center">
            <LogoMark className="h-[380px] w-[280px] opacity-60" />
          </div>
        }
      >
        <LogoScene className="h-full w-full" />
      </Suspense>
    </div>
  );
}
