"use client";

import { firstOpenStep, type FormState } from "@/lib/study/form-progress";
import type { SittingForm } from "@/lib/study/sitting-form";
import { CommentsSection } from "./comments-section";
import { ProfileSection } from "./profile-section";
import { ProgressCard } from "./progress-card";
import { RatingsSection } from "./ratings-section";
import { SectionFrame } from "./section-frame";
import { StepPills } from "./step-pills";
import { SubmitBlock } from "./submit-block";
import { useActiveStep } from "./use-active-step";
import { useSittingForm } from "./use-sitting-form";

type Props = { form: SittingForm; initial: FormState; onSubmitted: () => void };

export function SittingFormView({ form, initial, onSubmitted }: Props) {
  const sitting = useSittingForm(form, initial, onSubmitted);
  const { active, report } = useActiveStep(form, firstOpenStep(form, initial));

  return (
    <>
      <StepPills steps={sitting.stepsFor(active)} />
      <ProgressCard label={form.progressLabel} answered={sitting.answered} total={form.total} />
      {form.sections.map((section) => (
        <SectionFrame key={section.id} id={section.id} onView={report}>
          {section.kind === "profile" && (
            <ProfileSection section={section} state={sitting.state} onChange={sitting.setProfile} />
          )}
          {section.kind === "ratings" && (
            <RatingsSection section={section} state={sitting.state} onAnswer={sitting.setAnswer} />
          )}
          {section.kind === "comments" && (
            <CommentsSection section={section} state={sitting.state} onChange={sitting.setComment} />
          )}
        </SectionFrame>
      ))}
      <SubmitBlock
        hint={form.submitHint}
        label={form.submitLabel}
        ready={sitting.ready}
        isSubmitting={sitting.isSubmitting}
        onSubmit={sitting.submit}
      />
    </>
  );
}
