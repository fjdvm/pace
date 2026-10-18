import { prisma } from "@/lib/prisma";
import { analyzeStudy } from "./analysis";
import { getQuestionnaireClosedAt } from "./questionnaire-status";
import { toDataset } from "./to-dataset";

export async function getStudyBundle() {
  const [rows, instructors, closedAt] = await Promise.all([
    prisma.studyResponse.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.user.count({ where: { role: "instructor", approvalStatus: "approved" } }),
    getQuestionnaireClosedAt(),
  ]);
  const dataset = toDataset(rows, instructors);
  return { dataset, results: analyzeStudy(dataset, { final: !!closedAt }), closedAt };
}
