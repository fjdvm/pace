import { prisma } from "@/lib/prisma";
import { DEFAULT_THEMES, parseCustomThemes, type ThemeDef } from "./themes";

export const CUSTOM_THEMES_KEY = "STUDY_CUSTOM_THEMES";

export async function getCustomThemes() {
  const setting = await prisma.systemSetting.findUnique({ where: { key: CUSTOM_THEMES_KEY } });
  return parseCustomThemes(setting?.value ?? null);
}

export async function getThemes(): Promise<ThemeDef[]> {
  return [...DEFAULT_THEMES, ...(await getCustomThemes())];
}
