"use server";

import { prisma } from "@/lib/prisma";
import { getQuestionnaireClosedAt } from "@/lib/study/questionnaire-status";
import { parseResponse, type ResponseInput } from "@/lib/study/response";

export async function submitStudyResponse(input: ResponseInput) {
  try {
    if (await getQuestionnaireClosedAt()) throw new Error("The questionnaire is closed");

    const parsed = parseResponse(input);
    if (!parsed.ok) throw new Error(parsed.error);
    const { version, yearLevel, coursesTaken, aiUsage, answers, comments } = parsed.value;

    await prisma.studyResponse.create({
      data: { version, yearLevel, coursesTaken, aiUsage, answers, comments },
    });
    return { success: true };
  } catch (err) {
    console.error("Failed to save study response:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
