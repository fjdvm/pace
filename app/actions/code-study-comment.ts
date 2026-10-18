"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { COMMENT_PROMPTS, THEMES } from "@/lib/study/questionnaire";

export async function codeStudyComment(responseId: string, promptId: string, themeId: string) {
  try {
    await requireAdmin();
    if (!COMMENT_PROMPTS.some((p) => p.id === promptId)) throw new Error("Unknown comment");
    if (!THEMES.some((t) => t.id === themeId)) throw new Error("Unknown theme");

    const response = await prisma.studyResponse.findUnique({ where: { id: responseId } });
    if (!response) throw new Error("Response not found");

    const themes = { ...(response.commentThemes as Record<string, string>), [promptId]: themeId };
    await prisma.studyResponse.update({ where: { id: responseId }, data: { commentThemes: themes } });
    revalidatePath("/dashboard/admin/study-results");
    return { success: true };
  } catch (err) {
    console.error("Failed to code comment:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
