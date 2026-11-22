import type { ReactNode } from "react";
import { FlowDiagram } from "./FlowDiagram";
import type { Flow } from "../data/flows";

export function FlowSlide({
  flow,
  step,
  overlay,
}: {
  flow: Flow;
  step: number;
  overlay?: ReactNode;
}) {
  return (
    <div className="slide-inner pb-20">
      <div className="flex items-start justify-between">
        <div>
          <span className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            {flow.eyebrow}
          </span>
          <h2 className="title-lg mt-3">{flow.title}</h2>
          <p className="lead mt-1 max-w-[1050px]">{flow.subtitle}</p>
        </div>

      </div>

      <div className="relative mt-4 h-[648px] overflow-hidden rounded-[30px] border border-green/12 bg-[#fcf8ee]">
        <div className="grain pointer-events-none absolute inset-0 opacity-50" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              flow.accent === "gold"
                ? "radial-gradient(ellipse at 82% 12%, rgba(202,156,94,0.16), transparent 55%)"
                : "radial-gradient(ellipse at 82% 12%, rgba(15,94,88,0.12), transparent 55%)",
          }}
        />
        <FlowDiagram flow={flow} step={step} className="relative h-full w-full" viewportH={648} />

      </div>

      {overlay}
    </div>
  );
}
