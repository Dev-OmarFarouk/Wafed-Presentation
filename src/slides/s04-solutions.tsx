import { solutions } from "../data/solutions";
import { SolutionsSlide } from "./SolutionsSlide";

export default function SolutionsFirstSlide({ step }: { step: number }) {
  return (
    <SolutionsSlide
      step={step}
      items={solutions.slice(0, 3)}
      part="١ / ٢"
    />
  );
}
