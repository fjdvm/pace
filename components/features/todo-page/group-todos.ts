import type { StudentAssignment } from "@/components/features/student/types";

export type TodoTab = "assigned" | "missing" | "done";

export type AssignedGroups = {
  thisWeek: StudentAssignment[];
  nextWeek: StudentAssignment[];
  later: StudentAssignment[];
};

const DAY_MS = 24 * 60 * 60 * 1000;

function weekStart(date: Date) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  start.setDate(start.getDate() - ((date.getDay() + 6) % 7));
  return start;
}

function weeksAhead(due: Date, now: Date) {
  return Math.round((weekStart(due).getTime() - weekStart(now).getTime()) / (7 * DAY_MS));
}

function byDue(a: StudentAssignment, b: StudentAssignment) {
  return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
}

export function tabOf(assignment: StudentAssignment, now = new Date()): TodoTab {
  if (assignment.status === "submitted") return "done";
  return new Date(assignment.dueDate).getTime() < now.getTime() ? "missing" : "assigned";
}

export function groupAssigned(assignments: StudentAssignment[], now = new Date()): AssignedGroups {
  const sorted = [...assignments].sort(byDue);
  const ahead = (a: StudentAssignment) => weeksAhead(new Date(a.dueDate), now);
  return {
    thisWeek: sorted.filter((a) => ahead(a) <= 0),
    nextWeek: sorted.filter((a) => ahead(a) === 1),
    later: sorted.filter((a) => ahead(a) > 1),
  };
}
