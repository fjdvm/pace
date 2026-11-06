import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { saveStudyDraft } from "@/app/actions/study-draft";
import { submitStudyResponse } from "@/app/actions/submit-study-response";
import { countAnswered, isComplete, stepStates, type FormState } from "@/lib/study/form-progress";
import type { CommentPromptId } from "@/lib/study/questionnaire";
import type { SittingForm, StepId } from "@/lib/study/sitting-form";

const AUTOSAVE_MS = 700;

export function useSittingForm(form: SittingForm, initial: FormState, onSubmitted: () => void) {
  const [state, setState] = useState(initial);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dirty = useRef(false);

  useEffect(() => {
    if (!dirty.current) return;
    const timer = setTimeout(async () => {
      const result = await saveStudyDraft(form.role, form.sitting, state);
      if (!result.success) toast.error(result.error || "Could not save your progress");
    }, AUTOSAVE_MS);
    return () => clearTimeout(timer);
  }, [state, form]);

  const update = (change: (prev: FormState) => FormState) => {
    dirty.current = true;
    setState(change);
  };

  const submit = async () => {
    if (!isComplete(form, state) || isSubmitting) return;
    setIsSubmitting(true);
    dirty.current = false;
    const result = await submitStudyResponse(form.role, form.sitting, state);
    setIsSubmitting(false);
    if (!result.success) {
      toast.error(result.error || "Could not save your answers");
      return;
    }
    onSubmitted();
  };

  return {
    state,
    answered: countAnswered(form, state),
    ready: isComplete(form, state),
    isSubmitting,
    submit,
    stepsFor: (active: StepId) => {
      const states = stepStates(form, state, active);
      return form.steps.map((step, i) => ({ label: step.label, state: states[i] }));
    },
    setProfile: (id: string, value: string) => update((p) => ({ ...p, profile: { ...p.profile, [id]: value } })),
    setAnswer: (code: string, value: number) => update((p) => ({ ...p, answers: { ...p.answers, [code]: value } })),
    setComment: (id: CommentPromptId, value: string) =>
      update((p) => ({ ...p, comments: { ...p.comments, [id]: value } })),
  };
}
