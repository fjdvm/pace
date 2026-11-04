import Link from "next/link";
import { cn } from "@/lib/utils";
import { getInitials } from "@/components/features/student/shared/initials-avatar";
import { PaceTag } from "@/components/features/student/shared/pace-tag";
import type { SubmissionStudentRow } from "@/components/features/instructor/submissions/types";
import { avatarTone } from "./avatar-tone";
import { activityTag, statusTag } from "./work-status";

type WorkRowProps = {
  assignmentId: string;
  dueDate: string;
  student: SubmissionStudentRow;
};

export function WorkRow({ assignmentId, dueDate, student }: WorkRowProps) {
  const status = statusTag(student, dueDate);
  const activity = activityTag(student);
  const body = (
    <>
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold uppercase leading-[1.3] tracking-[0.06em] text-white",
          avatarTone(student.studentId),
        )}
      >
        {getInitials(student.name)}
      </span>
      <span className="min-w-0 flex-1 truncate text-[15px] leading-[1.55] text-pace-ink">{student.name}</span>
      {student.flags.map((flag) => (
        <PaceTag key={flag.label} tone={flag.tone} className="hidden md:inline-flex">
          {flag.label}
        </PaceTag>
      ))}
      <PaceTag tone={status.tone}>{status.label}</PaceTag>
      {activity && (
        <PaceTag tone={activity.tone}>
          <span className="md:hidden">{activity.short}</span>
          <span className="hidden md:inline">{activity.label}</span>
        </PaceTag>
      )}
      <span className="hidden w-16 shrink-0 text-right text-[15px] font-bold leading-[1.55] text-pace-ink md:block">
        {student.score === null ? "—" : `${Math.round(student.score)}%`}
      </span>
    </>
  );

  const className = "flex h-[60px] items-center gap-2 border-b border-pace-line bg-white px-3 last:border-b-0 md:gap-4 md:px-4";
  if (student.status !== "submitted") return <div className={className}>{body}</div>;
  return (
    <Link href={`/dashboard/submissions/${assignmentId}/${student.studentId}`} className={cn(className, "hover:bg-pace-canvas")}>
      {body}
    </Link>
  );
}
