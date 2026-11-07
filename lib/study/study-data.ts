import { prisma } from "@/lib/prisma";
import { analyzeStudy } from "./analysis";
import { getQuestionnaireClosedAt } from "./questionnaire-status";
import { getThemes } from "./theme-store";
import { toDataset } from "./to-dataset";

export async function getStudyBundle() {
  const [rows, instructors, closedAt, themes] = await Promise.all([
    prisma.studyResponse.findMany({ orderBy: { createdAt: "asc" }, include: { respondent: { select: { code: true } } } }),
    prisma.user.count({ where: { classes: { some: {} } } }),
    getQuestionnaireClosedAt(),
    getThemes(),
  ]);
  const dataset = toDataset(rows.map(({ respondent, ...row }) => ({ ...row, respondentCode: respondent?.code ?? null })), instructors, themes);
  return { dataset, results: analyzeStudy(dataset, { final: !!closedAt }), closedAt };
}
