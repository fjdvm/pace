import { PaceTag } from "@/components/features/student/shared/pace-tag";
import type { StudentStatus } from "./types";

const config = {
  submitted: { label: "Submitted", tone: "green" },
  "in-progress": { label: "In progress", tone: "amber" },
  "not-started": { label: "Not started", tone: "neutral" },
} as const;

export function StudentStatusTag({ status }: { status: StudentStatus }) {
  const { label, tone } = config[status];
  return (
    <PaceTag tone={tone} className="px-2.5 py-0.5 text-[11px]">
      {label}
    </PaceTag>
  );
}
