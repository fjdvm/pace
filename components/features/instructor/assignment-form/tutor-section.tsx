import { Eye, Heart } from "lucide-react";
import { MAX_HINT_LEVEL, hintLevelName } from "@/components/features/student/workspace/hint-levels";
import type { AssignmentFormValues } from "@/lib/assignment-form";
import { FormSection } from "./form-section";
import { NumberStepper } from "./number-stepper";

type TutorSectionProps = {
  values: AssignmentFormValues;
  onChange: (patch: Partial<AssignmentFormValues>) => void;
};

export function TutorSection({ values, onChange }: TutorSectionProps) {
  const { heartsCount, heartsRegenMinutes } = values;
  const topLevel = Math.min(heartsCount, MAX_HINT_LEVEL);

  return (
    <FormSection step={3} title="AI tutor" subtitle="Control how much help students can ask for">
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberStepper
          id="hearts-count"
          label="Hearts per student"
          unit="hearts"
          value={heartsCount}
          max={20}
          hint="Each tutor question costs one heart."
          onChange={(heartsCount) => onChange({ heartsCount })}
        />
        <NumberStepper
          id="hearts-cooldown"
          label="Cooldown per heart"
          unit="minutes"
          value={heartsRegenMinutes}
          step={5}
          max={600}
          hint="How long until a used heart comes back."
          onChange={(heartsRegenMinutes) => onChange({ heartsRegenMinutes })}
        />
      </div>
      <div className="flex flex-col gap-3 rounded-2xl bg-pace-purple-tint p-4">
        <p className="flex items-center gap-2 text-xs font-bold text-pace-purple">
          <Eye className="size-3.5" />
          What students will experience
        </p>
        <p className="text-[13px] leading-relaxed text-pace-ink">
          Students can ask up to {heartsCount} {heartsCount === 1 ? "question" : "questions"} at once, then get one more
          every {heartsRegenMinutes} minutes. Hints start as conceptual nudges and become more specific with each heart,
          up to near-pseudocode. The tutor never writes the solution or corrected code.
        </p>
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-pace-ink-2">
          {Array.from({ length: Math.min(heartsCount, 10) }, (_, i) => (
            <Heart key={i} className="size-3.5 fill-pace-red text-pace-red" />
          ))}
          <span className="ml-1.5">
            → Level 1 {hintLevelName(1).toLowerCase()} … Level {topLevel} {hintLevelName(topLevel).toLowerCase()}
          </span>
        </div>
      </div>
    </FormSection>
  );
}
