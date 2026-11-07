import { prisma } from "@/lib/prisma";
import { emptyState, type FormState } from "./form-progress";
import { normalizeState } from "./normalize-state";
import { makeRespondentCode } from "./respondent-code";
import type { Sitting } from "./sitting-form";
import type { StudyRole } from "./items/types";

export type RoleProgress = { submitted: Sitting[]; drafts: Partial<Record<Sitting, FormState>> };
export type QuestionnaireProgress = Record<StudyRole, RoleProgress>;

const ROLES: StudyRole[] = ["student", "instructor"];
const MAX_CODE_TRIES = 5;

export async function getOrCreateRespondent(userId: string, role: StudyRole) {
  const existing = await prisma.respondent.findUnique({ where: { userId_role: { userId, role } } });
  if (existing) return existing;
  for (let attempt = 0; attempt < MAX_CODE_TRIES; attempt++) {
    try {
      return await prisma.respondent.create({ data: { userId, role, code: makeRespondentCode() } });
    } catch (err) {
      const raced = await prisma.respondent.findUnique({ where: { userId_role: { userId, role } } });
      if (raced) return raced;
      if (attempt === MAX_CODE_TRIES - 1) throw err;
    }
  }
  throw new Error("Could not create respondent");
}

export async function submittedSittings(respondentId: string): Promise<Sitting[]> {
  const rows = await prisma.studyResponse.findMany({ where: { respondentId }, select: { sitting: true } });
  return rows.flatMap((r) => (r.sitting === 1 || r.sitting === 2 ? [r.sitting] : []));
}

export async function getQuestionnaireProgress(userId: string): Promise<QuestionnaireProgress> {
  const respondents = await prisma.respondent.findMany({
    where: { userId },
    include: { drafts: true, responses: { select: { sitting: true } } },
  });
  const progress = Object.fromEntries(ROLES.map((r) => [r, { submitted: [], drafts: {} }])) as unknown as QuestionnaireProgress;
  for (const respondent of respondents) {
    const role = respondent.role as StudyRole;
    if (!ROLES.includes(role)) continue;
    progress[role].submitted = respondent.responses.flatMap((r) => (r.sitting === 1 || r.sitting === 2 ? [r.sitting] : []));
    for (const draft of respondent.drafts) {
      if (draft.sitting !== 1 && draft.sitting !== 2) continue;
      const state = normalizeState(role, draft.sitting, draft.state);
      progress[role].drafts[draft.sitting] = { ...emptyState(), ...state };
    }
  }
  return progress;
}
