import Link from "next/link";
import { Code2, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProgressBar } from "@/components/features/student/shared/progress-bar";
import { PaceButton } from "@/components/features/student/shared/pace-button";
import { describeInstructorDue } from "@/lib/instructor-dates";
import { splitClassName } from "@/lib/class-name";
import { classTone } from "@/components/features/shared/class-tone";
import type { InstructorAssignmentRow } from "@/components/features/instructor/types";

type AssignmentRowProps = {
  assignment: InstructorAssignmentRow;
  classIndex: number;
};

export function AssignmentRow({ assignment: a, classIndex }: AssignmentRowProps) {
  const due = describeInstructorDue(a.dueDate);
  const purple = classTone(classIndex) === "purple";
  const hasSubmissions = a.submittedCount > 0;
  const percent = a.totalStudents ? (a.submittedCount / a.totalStudents) * 100 : 0;
  const classCodes = a.classes.map((c) => splitClassName(c.name).code).join(", ");

  return (
    <div className="grid min-w-[760px] grid-cols-[minmax(0,2.4fr)_1fr_1.4fr_0.8fr_0.9fr_1fr] items-center gap-4 border-t border-pace-line px-6 py-3.5">
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-[10px]",
            purple ? "bg-pace-purple-tint text-pace-purple" : "bg-pace-green-tint text-pace-green-deep",
          )}
        >
          <Code2 className="size-4" />
        </span>
        <span className="flex min-w-0 flex-col">
          <Link
            href={`/dashboard/instructor/submissions/${a.id}`}
            className="truncate text-sm font-semibold text-pace-ink"
          >
            {a.title}
          </Link>
          <span className="truncate text-xs text-pace-muted">
            {classCodes} · {a.language}
          </span>
        </span>
      </div>
      <span
        className={cn("text-[13px]", due.tone === "urgent" ? "font-medium text-pace-red" : "text-pace-ink-2")}
      >
        {due.label}
      </span>
      <div className="flex flex-col gap-1.5">
        <span className="text-[13px] text-pace-ink">
          {a.submittedCount} of {a.totalStudents}
        </span>
        <ProgressBar value={percent} className="h-1.5 max-w-36" />
      </div>
      <span className="text-[13px] font-semibold text-pace-ink">
        {a.averageScore === null ? "—" : `${a.averageScore}%`}
      </span>
      <span className="flex items-center gap-1.5 text-[13px] text-pace-ink-2">
        <Heart className="size-3 fill-pace-red text-pace-red" />
        {a.heartsCount} · {a.heartsRegenMinutes} min
      </span>
      <div className="flex justify-end">
        {hasSubmissions ? (
          <PaceButton href={`/dashboard/instructor/submissions/${a.id}`} variant="secondary" className="h-9 px-4">
            Review
          </PaceButton>
        ) : (
          <Link
            href={`/dashboard/instructor/assignments/${a.id}/edit`}
            className="px-4 text-[13px] font-semibold text-pace-ink"
          >
            Edit
          </Link>
        )}
      </div>
    </div>
  );
}
