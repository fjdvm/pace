import type { StudentAssignment } from "@/components/features/student/types";

const time = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });
const weekday = new Intl.DateTimeFormat("en-US", { weekday: "long" });
const monthDay = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

function dayDiff(due: Date, now: Date) {
  const start = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  return Math.round((start(due) - start(now)) / 86_400_000);
}

export function dueLabel(assignment: StudentAssignment, now = new Date()) {
  if (assignment.submittedAt) return `Submitted ${monthDay.format(new Date(assignment.submittedAt))}`;
  const due = new Date(assignment.dueDate);
  const diff = dayDiff(due, now);
  if (diff === 0) return `Due today, ${time.format(due)}`;
  if (diff === 1) return `Due tomorrow, ${time.format(due)}`;
  if (diff > 1 && diff < 7) return `Due ${weekday.format(due)}`;
  return `Due ${monthDay.format(due)}`;
}
