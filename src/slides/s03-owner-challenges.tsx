import { problem } from "../data/problem";
import { ChallengeSlide } from "../components/ChallengeSlide";

export default function OwnerChallengesSlide({ step }: { step: number }) {
  return (
    <ChallengeSlide
      title="تحديات صاحب السكن"
      subtitle="عنده شقة وعايز طلاب جادين… بس كل حاجة ماشية بالطرق القديمة."
      items={problem.owner}
      photo="owner-struggle"
      shift={40}
      alt="صاحب سكن بيدير عقاراته"
      tone="gold"
      step={step}
    />
  );
}
