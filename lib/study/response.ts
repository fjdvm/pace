import { COMMENT_PROMPTS, type CommentPromptId } from "./questionnaire";
import { isComplete } from "./form-progress";
import { MAX_COMMENT_LENGTH, normalizeState } from "./normalize-state";
import { buildSittingForm, ratingCodes, type Sitting } from "./sitting-form";
import type { Setup, StudyRole } from "./items/types";

export type SubmissionInput = { role: string; sitting: number; state: unknown };

export type ParsedSubmission = {
  role: StudyRole;
  sitting: Sitting;
  profile: Record<string, string>;
  answers: Record<string, { setup: Setup; value: number }>;
  comments: Partial<Record<CommentPromptId, string>>;
};

type Result<T> = { ok: true; value: T } | { ok: false; error: string };

const fail = (error: string): { ok: false; error: string } => ({ ok: false, error });

export function parseTarget(role: string, sitting: number, submitted: number[]): Result<{ role: StudyRole; sitting: Sitting }> {
  if (role !== "student" && role !== "instructor") return fail("Choose student or instructor");
  if (sitting !== 1 && sitting !== 2) return fail("Choose Sitting 1 or Sitting 2");
  if (submitted.includes(sitting)) return fail("This Sitting was already submitted and can no longer be changed");
  return { ok: true, value: { role, sitting } };
}

export function parseSubmission(input: SubmissionInput, submitted: number[]): Result<ParsedSubmission> {
  const target = parseTarget(input.role, input.sitting, submitted);
  if (!target.ok) return target;
  const { role, sitting } = target.value;

  const form = buildSittingForm(role, sitting);
  const state = normalizeState(role, sitting, input.state);
  if (!isComplete(form, state)) return fail("Answer every statement before submitting");

  const comments: ParsedSubmission["comments"] = {};
  for (const { id } of COMMENT_PROMPTS) {
    const text = (state.comments[id] ?? "").trim();
    if (text.length > MAX_COMMENT_LENGTH) return fail(`Comments must be ${MAX_COMMENT_LENGTH} characters or fewer`);
    if (text) comments[id] = text;
  }

  const answers = Object.fromEntries(
    ratingCodes(form).map((code) => [code, { setup: form.setup, value: state.answers[code] }]),
  );
  return { ok: true, value: { role, sitting, profile: state.profile, answers, comments } };
}
