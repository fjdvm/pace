import { prisma } from "@/lib/prisma";
import { analyzeStudy } from "./analysis";
import { buildSampleDataset } from "./sample-dataset";

export const QUESTIONNAIRE_CLOSED_KEY = "STUDY_QUESTIONNAIRE_CLOSED_AT";

export async function getStudyBundle() {
  const dataset = buildSampleDataset();
  const closed = await prisma.systemSetting.findUnique({ where: { key: QUESTIONNAIRE_CLOSED_KEY } });
  const closedAt = closed?.value ?? null;
  const results = analyzeStudy(dataset, { final: !!closedAt });
  return { dataset, results, closedAt, isSample: true };
}
