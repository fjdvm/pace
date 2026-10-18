import { PaceTag } from "@/components/features/student/shared/pace-tag";
import { PaceButton } from "@/components/features/student/shared/pace-button";
import { PaceIcon } from "@/components/features/student/shared/pace-icon";
import { AssignmentRow } from "@/components/features/student/shared/assignment-row";
import { formatDueLong, formatSubmitted, isUrgent } from "@/lib/student-dates";
import type { StudentAssignment } from "@/components/features/student/types";

export function TodoRow({ assignment: a }: { assignment: StudentAssignment }) {
  const href = `/dashboard/student/assignments/${a.id}`;
  const purple = a.classIndex % 2 === 1;
  const started = a.status === "in progress";
  const urgent = isUrgent(a.dueDate);

  return (
    <AssignmentRow
      href={href}
      icon={purple ? "code-purple" : "code-green"}
      iconTone={purple ? "purple" : "green"}
      title={a.title}
      subtitle={`${a.className} · ${a.language}`}
    >
      <PaceTag tone={started ? "amber" : "neutral"} className="hidden sm:inline-flex">
        {started ? `In progress · ${a.heartsLeft} hearts left` : "Not started"}
      </PaceTag>
      <span
        className={`hidden items-center gap-1.5 text-[13px] md:flex ${
          urgent ? "font-semibold text-pace-red" : "text-pace-ink-2"
        }`}
      >
        <PaceIcon name={urgent ? "clock" : "clock-gray"} size={16} />
        {formatDueLong(a.dueDate)}
      </span>
      <PaceButton href={href} variant={started ? "green" : "secondary"}>
        {started ? "Resume" : "Start"}
      </PaceButton>
    </AssignmentRow>
  );
}

export function SubmittedRow({ assignment: a }: { assignment: StudentAssignment }) {
  return (
    <AssignmentRow
      href={`/dashboard/student/assignments/${a.id}`}
      icon="check-18"
      iconTone="green"
      title={a.title}
      subtitle={`${a.className} · ${a.language}`}
    >
      {a.score !== null && <PaceTag className="hidden sm:inline-flex">Score {Math.round(a.score)}%</PaceTag>}
      {a.submittedAt && (
        <span className="hidden items-center gap-1.5 text-[13px] text-pace-ink-2 md:flex">
          <PaceIcon name="check-gray" size={16} />
          {formatSubmitted(a.submittedAt)}
        </span>
      )}
      <PaceButton href={`/dashboard/student/assignments/${a.id}`} variant="ghost">
        View
      </PaceButton>
    </AssignmentRow>
  );
}
