import type { InstructorAssignment } from "../types";

export function instructorWorkMeta(item: InstructorAssignment) {
  if (item.isDraft) return "Draft";
  const graded = item.graded ?? 0;
  const missing = item.missing ?? 0;
  if (graded === 0 && missing === 0) return `${item.turnedIn} turned in · ${item.assigned} assigned`;
  const parts = [];
  if (graded > 0) parts.push(`${graded} graded`);
  const awaitingGrade = item.turnedIn - graded;
  if (awaitingGrade > 0) parts.push(`${awaitingGrade} turned in`);
  if (missing > 0) parts.push(`${missing} missing`);
  return parts.join(" · ");
}
