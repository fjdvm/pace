import { COMMENT_PROMPTS } from "./questionnaire";
import { emptyState, isRating, type FormState } from "./form-progress";
import { buildSittingForm, type Sitting, ratingCodes } from "./sitting-form";
import type { StudyRole } from "./items/types";

export const MAX_COMMENT_LENGTH = 1000;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export function normalizeState(role: StudyRole, sitting: Sitting, raw: unknown): FormState {
  const form = buildSittingForm(role, sitting);
  const source = isRecord(raw) ? raw : {};
  const state = emptyState();

  const profile = isRecord(source.profile) ? source.profile : {};
  for (const section of form.sections) {
    if (section.kind !== "profile") continue;
    for (const q of section.questions) {
      const value = profile[q.id];
      if (typeof value === "string" && q.options.includes(value)) state.profile[q.id] = value;
    }
  }

  const answers = isRecord(source.answers) ? source.answers : {};
  for (const code of ratingCodes(form)) {
    const value = answers[code];
    if (isRating(value)) state.answers[code] = value;
  }

  if (form.sections.some((s) => s.kind === "comments")) {
    const comments = isRecord(source.comments) ? source.comments : {};
    for (const { id } of COMMENT_PROMPTS) {
      const value = comments[id];
      if (typeof value === "string") state.comments[id] = value.slice(0, MAX_COMMENT_LENGTH + 1);
    }
  }
  return state;
}
