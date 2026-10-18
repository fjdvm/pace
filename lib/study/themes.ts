export type ThemeTone = "green" | "red" | "amber" | "blue" | "purple" | "neutral";

export type ThemeDef = { id: string; label: string; tone: ThemeTone };

export const UNCODED_ID = "uncoded";
export const MAX_THEME_LENGTH = 60;

export const DEFAULT_THEMES: ThemeDef[] = [
  { id: "hints-helped", label: "Hints helped me find the bug myself", tone: "green" },
  { id: "more-hearts", label: "Wants more hearts or a faster refill", tone: "red" },
  { id: "vague-hints", label: "Level 1 hints felt too vague", tone: "amber" },
  { id: "faster-runs", label: "Faster code runs", tone: "blue" },
  { id: "instructor-hearts", label: "Instructor reports on heart use", tone: "purple" },
];

const TONES: ThemeTone[] = ["green", "red", "amber", "blue", "purple", "neutral"];
const CUSTOM_TONES: ThemeTone[] = ["purple", "blue", "green", "amber", "red"];

export function slugifyTheme(label: string) {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function addTheme(existing: ThemeDef[], label: string): { theme?: ThemeDef; error?: string } {
  const trimmed = label.trim();
  if (!trimmed) return { error: "Enter a theme name" };
  if (trimmed.length > MAX_THEME_LENGTH) return { error: `Theme names must be ${MAX_THEME_LENGTH} characters or fewer` };
  const id = slugifyTheme(trimmed);
  if (!id || id === UNCODED_ID || existing.some((t) => t.id === id || t.label.toLowerCase() === trimmed.toLowerCase())) {
    return { error: "That theme already exists" };
  }
  return { theme: { id, label: trimmed, tone: CUSTOM_TONES[existing.length % CUSTOM_TONES.length] } };
}

export function parseCustomThemes(raw: string | null): ThemeDef[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (t): t is ThemeDef =>
        typeof t?.id === "string" && typeof t?.label === "string" && TONES.includes(t?.tone),
    );
  } catch {
    return [];
  }
}
