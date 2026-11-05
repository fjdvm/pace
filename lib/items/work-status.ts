import { DEFAULT_CODE_TEMPLATES } from "@/components/features/assignments/code-templates";

type Item = { kind?: string; starterCode?: string; language?: string };
export type ItemWorkStatus = "not-started" | "in-progress" | "answered";

export function initialItemCode(item: Item) {
  return item.kind === "multiple_choice" || item.kind === "short_answer"
    ? ""
    : item.starterCode || DEFAULT_CODE_TEMPLATES[item.language ?? ""] || "";
}

export function itemWorkStatus(
  item: Item,
  code: string | null | undefined,
  results?: { passed: boolean }[] | null,
): ItemWorkStatus {
  if (!code?.trim()) return "not-started";
  if (item.kind === "multiple_choice" || item.kind === "short_answer")
    return "answered";
  if (results?.length && results.every((result) => result.passed))
    return "answered";
  return code === initialItemCode(item) ? "not-started" : "in-progress";
}
