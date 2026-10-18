import { PaceTag } from "@/components/features/student/shared/pace-tag";

const tones: Record<string, "green" | "blue" | "amber" | "red"> = {
  "Highly acceptable": "green",
  Acceptable: "blue",
  "Moderately acceptable": "amber",
  "Slightly acceptable": "red",
  "Not acceptable": "red",
};

export function InterpretationTag({ group, label }: { group: "S" | "I"; label: string }) {
  return (
    <PaceTag tone={tones[label] ?? "neutral"} className="px-2.5 py-0.5 text-[11px]">
      {group} · {label}
    </PaceTag>
  );
}
