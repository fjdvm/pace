"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { COMMENT_PROMPTS } from "@/lib/study/questionnaire";
import { CUSTOM_THEMES_KEY, getCustomThemes, getThemes } from "@/lib/study/theme-store";
import { addTheme } from "@/lib/study/themes";

const PATH = "/dashboard/admin/study-results";

export async function setCommentThemes(responseId: string, promptId: string, themeIds: string[]) {
  try {
    await requireAdmin();
    if (!COMMENT_PROMPTS.some((p) => p.id === promptId)) throw new Error("Unknown comment");
    const known = new Set((await getThemes()).map((t) => t.id));
    const cleaned = Array.from(new Set(themeIds)).filter((id) => known.has(id));

    const response = await prisma.studyResponse.findUnique({ where: { id: responseId } });
    if (!response) throw new Error("Response not found");

    const themes = { ...(response.commentThemes as Record<string, string[]>), [promptId]: cleaned };
    await prisma.studyResponse.update({ where: { id: responseId }, data: { commentThemes: themes } });
    revalidatePath(PATH);
    return { success: true };
  } catch (err) {
    console.error("Failed to set comment themes:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function createStudyTheme(label: string) {
  try {
    await requireAdmin();
    const custom = await getCustomThemes();
    const result = addTheme(await getThemes(), label);
    if (!result.theme) throw new Error(result.error);

    const value = JSON.stringify([...custom, result.theme]);
    await prisma.systemSetting.upsert({
      where: { key: CUSTOM_THEMES_KEY },
      create: { key: CUSTOM_THEMES_KEY, value },
      update: { value },
    });
    revalidatePath(PATH);
    return { success: true, theme: result.theme };
  } catch (err) {
    console.error("Failed to create theme:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
