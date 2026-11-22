import { studentFlow } from "../data/flows";
import { FlowSlide } from "../components/FlowSlide";

export default function JourneyStudentSlide({ step }: { step: number }) {
  return <FlowSlide flow={studentFlow} step={step} />;
}
