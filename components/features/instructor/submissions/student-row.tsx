import Link from "next/link";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { InitialsAvatar } from "@/components/features/student/shared/initials-avatar";
import { PaceTag } from "@/components/features/student/shared/pace-tag";
import { StudentStatusTag } from "./student-status-tag";
import type { SubmissionStudentRow } from "./types";

export const studentGrid =
  "grid min-w-[640px] grid-cols-[minmax(0,2fr)_1.2fr_0.8fr_0.8fr_1.4fr] items-center gap-4 px-6";

type StudentRowProps = {
  assignmentId: string;
  student: SubmissionStudentRow;
};

export function StudentRow({ assignmentId, student }: StudentRowProps) {
  const body = (
    <>
      <span className="flex min-w-0 items-center gap-3">
        <InitialsAvatar name={student.name} tone="green" className="size-8 bg-pace-sunken text-pace-ink text-xs" />
        <span className="truncate text-[13px] font-medium text-pace-ink">{student.name}</span>
      </span>
      <span>
        <StudentStatusTag status={student.status} />
      </span>
      <span className="text-[13px] font-semibold text-pace-ink">
        {student.score === null ? "—" : `${Math.round(student.score)}%`}
      </span>
      <span className="flex items-center gap-1.5 text-[13px] text-pace-ink">
        <Heart className="size-3 fill-pace-red text-pace-red" />
        {student.hearts}
      </span>
      <span className="flex flex-wrap gap-1.5">
        {student.flags.length === 0 ? (
          <span className="text-[13px] text-pace-muted">—</span>
        ) : (
          student.flags.map((flag) => (
            <PaceTag key={flag.label} tone={flag.tone} className="px-2.5 py-0.5 text-[11px]">
              {flag.label}
            </PaceTag>
          ))
        )}
      </span>
    </>
  );

  const className = cn(studentGrid, "border-t border-pace-line py-3");
  if (student.status !== "submitted") return <div className={className}>{body}</div>;
  return (
    <Link
      href={`/dashboard/instructor/submissions/${assignmentId}/${student.studentId}`}
      className={cn(className, "hover:bg-pace-canvas")}
    >
      {body}
    </Link>
  );
}
