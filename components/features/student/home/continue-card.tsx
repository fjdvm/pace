import Link from "next/link";
import { PaceTag } from "@/components/features/student/shared/pace-tag";
import { PaceButton } from "@/components/features/student/shared/pace-button";
import { PaceIcon } from "@/components/features/student/shared/pace-icon";
import { formatDueSentence, isUrgent } from "@/lib/student-dates";
import type { StudentAssignment } from "@/components/features/student/types";
import { HeartsRow } from "@/components/features/student/shared/hearts-row";

type ContinueCardProps = {
  assignment: StudentAssignment;
};

export function ContinueCard({ assignment }: ContinueCardProps) {
  const href = `/dashboard/student/assignments/${assignment.id}`;
  const started = assignment.status === "in progress";
  const urgent = isUrgent(assignment.dueDate);

  return (
    <section className="flex flex-col gap-5 rounded-[20px] border-[1.5px] border-pace-line bg-white p-7 shadow-[0_4px_0_0_var(--color-pace-line)] md:flex-row md:items-center md:gap-7">
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          <PaceTag>{started ? "Continue where you left off" : "Up next"}</PaceTag>
          <PaceTag tone="neutral">
            {assignment.className} · {assignment.language}
          </PaceTag>
        </div>
        <Link href={href} className="text-[32px] font-bold leading-[1.15] tracking-[-0.015em] text-pace-ink">
          {assignment.title}
        </Link>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-pace-ink-2">
          <span className="flex items-center gap-1.5">
            <HeartsRow left={assignment.heartsLeft} max={assignment.heartsMax} />
            {assignment.heartsLeft} {assignment.heartsLeft === 1 ? "heart" : "hearts"} left
          </span>
          <span
            className={`flex items-center gap-1.5 font-semibold ${urgent ? "text-pace-red" : "text-pace-ink-2"}`}
          >
            <PaceIcon name="clock" size={16} />
            {formatDueSentence(assignment.dueDate)}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <PaceButton href={href} className="h-[52px] px-7 text-[15px]">
          {started ? "Resume coding" : "Start coding"}
        </PaceButton>
        <p className="text-[13px] text-pace-muted">Your code is saved automatically</p>
      </div>
    </section>
  );
}
