import { isLate } from "@/lib/submission-state";
import type { SubmissionStudentRow } from "@/components/features/instructor/submissions/types";

export type Tone = "green" | "amber" | "red" | "neutral";
export type StatusTag = { label: string; tone: Tone };
export type ActivityTag = { label: string; short: string; tone: Tone };

const activityTones: Record<"Low" | "Medium" | "High", Tone> = { Low: "neutral", Medium: "amber", High: "red" };

export function statusTag(student: SubmissionStudentRow, dueIso: string, now = new Date()): StatusTag {
  if (student.submissionStatus === "returned") return { label: "Returned", tone: "green" };
  if (student.submissionStatus === "graded") return { label: "Graded", tone: "green" };
  if (student.status === "submitted") return { label: student.submittedAt && isLate(dueIso, student.submittedAt) ? "Turned in · Late" : "Turned in", tone: "green" };
  if (new Date(dueIso).getTime() < now.getTime()) return { label: "Missing", tone: "amber" };
  return { label: "Assigned", tone: "neutral" };
}

export function activityTag(student: SubmissionStudentRow): ActivityTag | null {
  if (student.status === "submitted") {
    if (!student.activity) return null;
    return { label: `Activity: ${student.activity}`, short: student.activity, tone: activityTones[student.activity] };
  }
  if (student.status === "in-progress") return { label: "In progress", short: "…", tone: "neutral" };
  return { label: "Not started", short: "—", tone: "neutral" };
}
