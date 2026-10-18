import { prisma } from "@/lib/prisma";
import { analyzeStudy } from "./analysis";
import { getQuestionnaireClosedAt } from "./questionnaire-status";
import { getThemes } from "./theme-store";
import { toDataset } from "./to-dataset";

export async function getStudyBundle() {
  const [rows, instructors, closedAt, themes] = await Promise.all([
    prisma.studyResponse.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.user.count({ where: { role: "instructor", approvalStatus: "approved" } }),
    getQuestionnaireClosedAt(),
    getThemes(),
  ]);
  const dataset = toDataset(rows, instructors, themes);
  return { dataset, results: analyzeStudy(dataset, { final: !!closedAt }), closedAt };
}
