"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { QUESTIONNAIRE_CLOSED_KEY } from "@/lib/study/study-data";

export async function setQuestionnaireOpen(open: boolean) {
  try {
    await requireAdmin();
    if (open) {
      await prisma.systemSetting.deleteMany({ where: { key: QUESTIONNAIRE_CLOSED_KEY } });
    } else {
      const value = new Date().toISOString();
      await prisma.systemSetting.upsert({
        where: { key: QUESTIONNAIRE_CLOSED_KEY },
        create: { key: QUESTIONNAIRE_CLOSED_KEY, value },
        update: { value },
      });
    }
    revalidatePath("/dashboard/admin/study-results");
    return { success: true };
  } catch (err) {
    console.error("Failed to update questionnaire status:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
