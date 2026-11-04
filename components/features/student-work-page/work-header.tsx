import Link from "next/link";
import { formatDueSentence } from "@/lib/student-dates";
import { ExportScoresButton } from "@/components/features/instructor/submissions/export-scores-button";
import type { AssignmentOverview } from "@/components/features/instructor/submissions/types";

export function WorkHeader({ overview }: { overview: AssignmentOverview }) {
  const { assignment } = overview;
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 flex-col gap-1">
        <h1 className="text-[22px] font-bold leading-tight tracking-[-0.22px] text-pace-green-deep md:text-[32px] md:leading-[1.15] md:tracking-[-0.48px]">
          {assignment.title}
        </h1>
        <p className="text-[13px] leading-normal text-pace-muted">
          {formatDueSentence(assignment.dueDate)} · {assignment.heartsCount} hearts
        </p>
      </div>
      <div className="hidden shrink-0 items-center gap-3 md:flex">
        <Link
          href={`/dashboard/assignments/${assignment.id}/edit`}
          className="px-2 text-[13px] font-semibold text-pace-ink"
        >
          Edit assignment
        </Link>
        <ExportScoresButton overview={overview} />
      </div>
    </div>
  );
}
