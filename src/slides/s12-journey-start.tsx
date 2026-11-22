import { entryFlow } from "../data/flows";
import { FlowSlide } from "../components/FlowSlide";

export default function JourneyStartSlide({ step }: { step: number }) {
  return <FlowSlide flow={entryFlow} step={step} />;
}
