import { PaceTag } from "@/components/features/student/shared/pace-tag";
import { PaceButton } from "@/components/features/student/shared/pace-button";
import { AssignmentRow } from "@/components/features/student/shared/assignment-row";
import { formatDueLong, formatSubmitted } from "@/lib/student-dates";
import type { StudentAssignment } from "@/components/features/student/types";

export function ClassworkRow({ assignment: a }: { assignment: StudentAssignment }) {
  const href = `/dashboard/student/assignments/${a.id}`;
  const submitted = a.status === "submitted";
  const started = a.status === "in progress";
  const hearts = submitted
    ? `Used ${a.heartsMax - a.heartsLeft} ${a.heartsMax - a.heartsLeft === 1 ? "heart" : "hearts"}`
    : started
      ? `${a.heartsLeft} hearts left`
      : `${a.heartsMax} hearts`;

  return (
    <AssignmentRow
      href={href}
      icon={submitted ? "check-18" : "code-gray"}
      iconTone={submitted ? "green" : "sunken"}
      title={a.title}
      subtitle={`${a.language} · ${submitted && a.submittedAt ? formatSubmitted(a.submittedAt) : `Due ${formatDueLong(a.dueDate)}`}`}
      className="gap-4"
    >
      <span className="hidden text-[13px] text-pace-ink-2 sm:inline">{hearts}</span>
      {submitted ? (
        a.score !== null && <PaceTag>{Math.round(a.score)}%</PaceTag>
      ) : (
        <PaceTag tone={started ? "amber" : "neutral"}>{started ? "In progress" : "Not started"}</PaceTag>
      )}
      <PaceButton href={href} variant={submitted ? "ghost" : started ? "green" : "secondary"}>
        {submitted ? "View" : started ? "Resume" : "Start"}
      </PaceButton>
    </AssignmentRow>
  );
}
