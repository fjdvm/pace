import { COMMENT_PROMPTS, CONSTRUCTS, MARGIN_OF_ERROR, POPULATION, type CommentPromptId, type ConstructId } from "./questionnaire";
import { slovinSampleSize } from "./stats";
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

export function toDataset(rows: StoredResponse[], instructorTarget: number): StudyDataset {
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
    const themes = row.commentThemes as Partial<Record<CommentPromptId, string>>;
    for (const { id: promptId } of COMMENT_PROMPTS) {
      const text = texts[promptId];
      if (text) {
        comments.push({ key: `${row.id}:${promptId}`, respondentId: id, role, promptId, themeId: themes[promptId] ?? "uncoded", text });
      }
    }
  }

  return { respondents, comments, studentTarget: slovinSampleSize(POPULATION, MARGIN_OF_ERROR), instructorTarget };
}

