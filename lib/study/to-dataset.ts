import { COMMENT_PROMPTS, CONSTRUCTS, MARGIN_OF_ERROR, POPULATION, type CommentPromptId, type ConstructId } from "./questionnaire";
import { slovinSampleSize } from "./stats";
import { UNCODED_ID, type ThemeDef } from "./themes";
import type { Respondent, StudyComment, StudyDataset, StudyRole } from "./dataset";

export type StoredResponse = {
  id: string;
  version: string;
  yearLevel: string | null;
  coursesTaken: string | null;
  aiUsage: string;
  answers: unknown;
  comments: unknown;
  commentThemes: unknown;
  createdAt: Date;
};

function themeIdsOf(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string");
  return typeof value === "string" && value !== UNCODED_ID ? [value] : [];
}

export function toDataset(rows: StoredResponse[], instructorTarget: number, themes: ThemeDef[]): StudyDataset {
  const counters: Record<StudyRole, number> = { student: 0, instructor: 0 };
  const respondents: Respondent[] = [];
  const comments: StudyComment[] = [];

  for (const row of rows) {
    const role: StudyRole = row.version === "instructor" ? "instructor" : "student";
    counters[role] += 1;
    const id = `${role === "student" ? "S" : "I"}${String(counters[role]).padStart(3, "0")}`;
    const stored = row.answers as Record<ConstructId, number[]>;

    respondents.push({
      id,
      role,
      submittedAt: row.createdAt.toISOString(),
      answers: Object.fromEntries(CONSTRUCTS.map((c) => [c.id, stored[c.id] ?? []])) as Record<ConstructId, number[]>,
      profile: { yearLevel: row.yearLevel, coursesTaken: row.coursesTaken, aiUsage: row.aiUsage },
    });

    const texts = row.comments as Partial<Record<CommentPromptId, string>>;
    const coded = row.commentThemes as Partial<Record<CommentPromptId, unknown>>;
    for (const { id: promptId } of COMMENT_PROMPTS) {
      const text = texts[promptId];
      if (text) {
        comments.push({
          key: `${row.id}:${promptId}`,
          respondentId: id,
          role,
          yearLevel: row.yearLevel,
          promptId,
          themeIds: themeIdsOf(coded[promptId]).filter((themeId) => themes.some((t) => t.id === themeId)),
          text,
        });
      }
    }
  }

  return { respondents, comments, themes, studentTarget: slovinSampleSize(POPULATION, MARGIN_OF_ERROR), instructorTarget };
}

