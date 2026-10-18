import { CONSTRUCTS, type ConstructId } from "@/lib/study/questionnaire";
import type { RatingAnswers } from "@/lib/study/form-progress";
import { PartCard } from "./part-card";
import { ScaleLegend } from "./scale-legend";
import { ConstructBlock } from "./construct-block";


type RatingsSectionProps = {
  answers: RatingAnswers;
  onAnswer: (construct: ConstructId, itemIndex: number, rating: number) => void;
};

export function RatingsSection({ answers, onAnswer }: RatingsSectionProps) {
  return (
    <PartCard
      part="Part II"
      title="Rate each statement"
      description="Choose how much you agree, from 1 (Strongly disagree) to 5 (Strongly agree)."
    >
      <ScaleLegend />
      <div className="flex flex-col gap-5">
        {CONSTRUCTS.map((construct) => (
          <ConstructBlock
            key={construct.id}
            construct={construct}
            values={answers[construct.id]}
            onAnswer={(index, rating) => onAnswer(construct.id, index, rating)}
          />
        ))}
      </div>
    </PartCard>
  );
}
