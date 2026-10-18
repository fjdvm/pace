import {
  AI_USAGE_OPTIONS,
  COMMENT_PROMPTS,
  CONSTRUCTS,
  COURSE_COUNTS,
  ITEMS_PER_CONSTRUCT,
  YEAR_LEVELS,
  type CommentPromptId,
  type ConstructId,
  type QuestionnaireVersion,
} from "./questionnaire";

export const MAX_COMMENT_LENGTH = 1000;

export type ResponseInput = {
  version: string;
  yearLevel?: string;
  coursesTaken?: string;
  aiUsage: string;
  answers: Record<string, number[]>;
  comments: Partial<Record<string, string>>;
};

export type ParsedResponse = {
  version: QuestionnaireVersion;
  yearLevel: string | null;
  coursesTaken: string | null;
  aiUsage: string;
  answers: Record<ConstructId, number[]>;
  comments: Partial<Record<CommentPromptId, string>>;
};

type Result = { ok: true; value: ParsedResponse } | { ok: false; error: string };

const fail = (error: string): Result => ({ ok: false, error });

function validAnswers(answers: ResponseInput["answers"]) {
  return CONSTRUCTS.every(({ id }) => {
    const values = answers?.[id];
    return (
      Array.isArray(values) &&
      values.length === ITEMS_PER_CONSTRUCT &&
      values.every((v) => Number.isInteger(v) && v >= 1 && v <= 5)
    );
  });
}

export function parseResponse(input: ResponseInput): Result {
  if (input.version !== "student" && input.version !== "instructor") return fail("Choose a questionnaire version");
  const isStudent = input.version === "student";

  if (isStudent && !YEAR_LEVELS.includes(input.yearLevel ?? "")) return fail("Tell us your year level");
  if (isStudent && !COURSE_COUNTS.includes(input.coursesTaken ?? "")) {
    return fail("Tell us how many programming courses you have taken");
  }
  if (!AI_USAGE_OPTIONS.some((o) => o.id === input.aiUsage)) return fail("Tell us how often you use AI tools");
  if (!validAnswers(input.answers)) return fail("Answer all 20 statements");

  const comments: ParsedResponse["comments"] = {};
  for (const { id } of COMMENT_PROMPTS) {
    const text = (input.comments?.[id] ?? "").trim();
    if (text.length > MAX_COMMENT_LENGTH) return fail(`Comments must be ${MAX_COMMENT_LENGTH} characters or fewer`);
    if (text) comments[id] = text;
  }

  return {
    ok: true,
    value: {
      version: input.version,
      yearLevel: isStudent ? (input.yearLevel as string) : null,
      coursesTaken: isStudent ? (input.coursesTaken as string) : null,
      aiUsage: input.aiUsage,
      answers: Object.fromEntries(CONSTRUCTS.map(({ id }) => [id, input.answers[id]])) as Record<ConstructId, number[]>,
      comments,
    },
  };
}
