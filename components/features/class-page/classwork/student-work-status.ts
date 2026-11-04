import { formatDueLong, formatDueShort } from "@/lib/student-dates";
import type { StudentAssignment } from "@/components/features/student/types";

export function statusLabel(item: StudentAssignment, long: boolean) {
  if (item.score !== null) return `Graded · ${item.score}/100`;
  if (item.status === "submitted") return "Submitted";
  if (!long) return `Due ${formatDueShort(item.dueDate)}`;
  const text = formatDueLong(item.dueDate).replace(/^Overdue · /, "");
  return `Due ${text.replace(/^(Today|Tomorrow)/, (m) => m.toLowerCase())}`;
}
