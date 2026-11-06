import type { FormState } from "@/lib/study/form-progress";
import type { ProfileSection as ProfileSectionData } from "@/lib/study/sitting-form";
import { FadeUp } from "../shared/fade-up";
import { ChoiceChips } from "./choice-chips";
import { PartHeader } from "./part-header";

type Props = { section: ProfileSectionData; state: FormState; onChange: (id: string, value: string) => void };

export function ProfileSection({ section, state, onChange }: Props) {
  return (
    <>
      <FadeUp>
        <PartHeader part={section.part} title={section.title} />
      </FadeUp>
      {section.questions.map((question) => (
        <FadeUp key={question.id}>
          <ChoiceChips
            label={question.label}
            options={question.options}
            value={state.profile[question.id]}
            onChange={(value) => onChange(question.id, value)}
          />
        </FadeUp>
      ))}
    </>
  );
}
