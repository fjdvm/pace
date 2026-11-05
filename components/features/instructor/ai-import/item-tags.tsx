import { PaceTag } from "@/components/features/student/shared/pace-tag";
import type { ImportedItem } from "@/lib/ai-import/types";

export const KIND_TAG = {
  coding: { tone: "blue", label: "Coding" },
  multiple_choice: { tone: "green", label: "Multiple choice" },
  short_answer: { tone: "amber", label: "Short answer" },
} as const;

export function ItemTags({ item }: { item: ImportedItem }) {
  const kind = KIND_TAG[item.kind];
  return (
    <>
      <PaceTag tone={kind.tone}>{kind.label}</PaceTag>
      {item.fromFile && <PaceTag tone="purple">✦ From file</PaceTag>}
      {item.checkNote && <PaceTag tone="amber">Check this</PaceTag>}
    </>
  );
}
