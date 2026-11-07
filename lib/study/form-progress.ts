import type { CommentPromptId } from "./questionnaire";
import type { FormSection, SittingForm, StepId } from "./sitting-form";

export type FormState = {
  profile: Record<string, string>;
  answers: Record<string, number>;
  comments: Partial<Record<CommentPromptId, string>>;
};
export type StepState = "done" | "current" | "todo";

export const emptyState = (): FormState => ({ profile: {}, answers: {}, comments: {} });

export const isRating = (value: unknown): value is number =>
  typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 5;

function sectionCounts(section: FormSection, state: FormState) {
  if (section.kind === "profile") {
    const answered = section.questions.filter((q) => q.options.includes(state.profile[q.id])).length;
    return { answered, total: section.questions.length };
  }
  if (section.kind === "ratings") {
    const items = section.groups.flatMap((g) => g.items);
    return { answered: items.filter((i) => isRating(state.answers[i.code])).length, total: items.length };
  }
  return { answered: 0, total: 0 };
}

export function countAnswered(form: SittingForm, state: FormState) {
  return form.sections.reduce((sum, section) => sum + sectionCounts(section, state).answered, 0);
}

export function isComplete(form: SittingForm, state: FormState) {
  return countAnswered(form, state) === form.total;
}

export function stepStates(form: SittingForm, state: FormState, active: StepId): StepState[] {
  return form.sections.map((section) => {
    if (section.id === active) return "current";
    const { answered, total } = sectionCounts(section, state);
    return total > 0 && answered === total ? "done" : "todo";
  });
}

export function firstOpenStep(form: SittingForm, state: FormState): StepId {
  const open = form.sections.find((s) => {
    const { answered, total } = sectionCounts(s, state);
    return total > 0 && answered < total;
  });
  return (open ?? form.sections[0]).id;
}
