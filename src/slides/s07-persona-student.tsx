import { studentPersona } from "../data/personas";
import { PersonaSlide } from "./PersonaSlide";

export default function PersonaStudentSlide({ step }: { step: number }) {
  return <PersonaSlide persona={studentPersona} step={step} />;
}
