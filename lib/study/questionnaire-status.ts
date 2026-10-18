import { prisma } from "@/lib/prisma";

export const QUESTIONNAIRE_CLOSED_KEY = "STUDY_QUESTIONNAIRE_CLOSED_AT";

export async function getQuestionnaireClosedAt() {
  const setting = await prisma.systemSetting.findUnique({ where: { key: QUESTIONNAIRE_CLOSED_KEY } });
  return setting?.value ?? null;
}
