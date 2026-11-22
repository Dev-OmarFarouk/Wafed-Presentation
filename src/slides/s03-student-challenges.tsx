import { problem } from "../data/problem";
import { ChallengeSlide } from "../components/ChallengeSlide";

export default function StudentChallengesSlide({ step }: { step: number }) {
  return (
    <ChallengeSlide
      title="تحديات الطالب"
      subtitle="البحث عن سكن قريب وآمن وبسعر مناسب… رحلة مليانة مفاجآت."
      items={problem.student}
      photo="student-struggle"
      shift={0}
      alt="طالب بيدور على سكن"
      tone="green"
      step={step}
    />
  );
}
