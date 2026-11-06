import { COMMENT_PROMPTS, CONSTRUCTS, MARGIN_OF_ERROR, POPULATION, type CommentPromptId, type ConstructId } from "./questionnaire";
import { slovinSampleSize } from "./stats";
import { UNCODED_ID, type ThemeDef } from "./themes";
import type { Respondent, RespondentProfile, StudyComment, StudyDataset, StudyRole } from "./dataset";

export type StoredResponse = {
  id: string;
  version: string;
  role?: string | null;
  sitting?: number | null;
  respondentId?: string | null;
  respondentCode?: string | null;
  yearLevel: string | null;
  coursesTaken: string | null;
  aiUsage: string | null;
  profile?: unknown;
  answers: unknown;
  comments: unknown;
  commentThemes: unknown;
  createdAt: Date;
};

type Stored = Record<string, unknown>;

function themeIdsOf(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string");
  return typeof value === "string" && value !== UNCODED_ID ? [value] : [];
}

const text = (value: unknown) => (typeof value === "string" ? value : null);

function profileOf(row: StoredResponse): RespondentProfile {
  if (row.sitting == null) return { yearLevel: row.yearLevel, coursesTaken: row.coursesTaken, aiUsage: row.aiUsage };
  const p = (row.profile ?? {}) as Stored;
  return {
    yearLevel: text(p.yearLevel),
    coursesTaken: text(p.coursesTaken),
    aiUsage: text(p.aiUsage),
    yearsTeaching: text(p.yearsTeaching),
    coursesHandled: text(p.coursesHandled),
    allowsAi: text(p.allowsAi),
  };
}

function constructAnswers(row: StoredResponse): Record<ConstructId, number[]> {
  const stored = (row.answers ?? {}) as Stored;
  return Object.fromEntries(
    CONSTRUCTS.map(({ id, items }) => [
      id,
      row.sitting == null
        ? ((stored[id] as number[] | undefined) ?? [])
        : items.map((_, i) => ((stored[`${id}${i + 1}`] as { value?: number } | undefined)?.value ?? 0)),
    ]),
  ) as Record<ConstructId, number[]>;
}

export function toDataset(rows: StoredResponse[], instructorTarget: number, themes: ThemeDef[]): StudyDataset {
  const counters: Record<StudyRole, number> = { student: 0, instructor: 0 };
  const respondents: Respondent[] = [];
  const comments: StudyComment[] = [];
  const baselineProfile = new Map<string, RespondentProfile>();
  for (const row of rows) {
    if (row.sitting === 1 && row.respondentId) baselineProfile.set(row.respondentId, profileOf(row));
  }

  for (const row of rows) {
    if (row.sitting === 1) continue;
    const role: StudyRole = (row.role ?? row.version) === "instructor" ? "instructor" : "student";
    let id = row.respondentCode ?? "";
    if (row.sitting == null) {
      counters[role] += 1;
      id = `${role === "student" ? "S" : "I"}${String(counters[role]).padStart(3, "0")}`;
    }
    const profile = row.sitting == null ? profileOf(row) : (baselineProfile.get(row.respondentId ?? "") ?? profileOf(row));

    respondents.push({ id, role, submittedAt: row.createdAt.toISOString(), answers: constructAnswers(row), profile });

    const texts = row.comments as Partial<Record<CommentPromptId, string>>;
    const coded = row.commentThemes as Partial<Record<CommentPromptId, unknown>>;
    for (const { id: promptId } of COMMENT_PROMPTS) {
      const body = texts[promptId];
      if (body) {
        comments.push({
          key: `${row.id}:${promptId}`,
          respondentId: id,
          role,
          yearLevel: profile.yearLevel,
          promptId,
          themeIds: themeIdsOf(coded[promptId]).filter((themeId) => themes.some((t) => t.id === themeId)),
          text: body,
        });
      }
    }
  }

  return { respondents, comments, themes, studentTarget: slovinSampleSize(POPULATION, MARGIN_OF_ERROR), instructorTarget };
}
