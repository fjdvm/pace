import { emptyState, type FormState } from "./form-progress";
import { buildSittingForm, ratingCodes, type Sitting } from "./sitting-form";
import type { StudyRole } from "./items/types";

export function completeState(role: StudyRole, sitting: Sitting, value = 4): FormState {
  const form = buildSittingForm(role, sitting);
  const state = emptyState();
  for (const section of form.sections) {
    if (section.kind === "profile") for (const q of section.questions) state.profile[q.id] = q.options[0];
  }
  for (const code of ratingCodes(form)) state.answers[code] = value;
  return state;
}
