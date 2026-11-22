import { ownerPersona } from "../data/personas";
import { PersonaSlide } from "./PersonaSlide";

export default function PersonaOwnerSlide({ step }: { step: number }) {
  return <PersonaSlide persona={ownerPersona} step={step} />;
}
