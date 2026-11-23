import { solutions } from "../data/solutions";
import { SolutionsSlide } from "./SolutionsSlide";

export default function SolutionsSecondSlide({ step }: { step: number }) {
  return (
    <SolutionsSlide
      step={step}
      items={solutions.slice(3)}
      part="٢ / ٢"
    />
  );
}
