import { Suspense } from "react";
import { slides } from "./slides";
import { SlideRuntimeProvider } from "./runtime";

export function SlideView({
  index,
  step,
  preview = false,
  reducedMotion = false,
}: {
  index: number;
  step: number;
  preview?: boolean;
  reducedMotion?: boolean;
}) {
  const def = slides[index];
  if (!def) return null;
  const Comp = def.Component;

  return (
    <SlideRuntimeProvider preview={preview} reducedMotion={reducedMotion}>
      <Suspense
        fallback={
          <div className="slide-inner items-center justify-center">
            <div className="h-16 w-16 animate-pulse rounded-full border-2 border-gold/40" />
          </div>
        }
      >
        <Comp step={step} />
      </Suspense>
    </SlideRuntimeProvider>
  );
}
