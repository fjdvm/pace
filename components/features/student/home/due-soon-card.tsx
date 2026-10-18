import Link from "next/link";
import { PaceTag } from "@/components/features/student/shared/pace-tag";
import { PaceIcon } from "@/components/features/student/shared/pace-icon";
import { AssignmentRow } from "@/components/features/student/shared/assignment-row";
import { formatDueShort, isUrgent } from "@/lib/student-dates";
import type { StudentAssignment } from "@/components/features/student/types";

type DueSoonCardProps = {
  assignments: StudentAssignment[];
};

export function DueSoonCard({ assignments }: DueSoonCardProps) {
  return (
    <section className="flex flex-col rounded-[20px] border-[1.5px] border-pace-line bg-white px-2 pb-2 pt-5">
      <div className="flex items-center justify-between px-4 pb-2">
        <h2 className="text-[22px] font-bold leading-tight tracking-[-0.01em] text-pace-ink">Due soon</h2>
        <Link href="/dashboard/student/todo" className="text-[13px] font-semibold text-pace-green-deep">
          See all to-dos
        </Link>
      </div>
      {assignments.length === 0 && (
        <p className="px-4 py-6 text-[13px] text-pace-muted">Nothing due. You&apos;re all caught up.</p>
      )}
      {assignments.map((a) => (
        <AssignmentRow
          key={a.id}
          href={`/dashboard/student/assignments/${a.id}`}
          icon={a.classIndex % 2 === 1 ? "code-purple" : "code-green"}
          iconTone={a.classIndex % 2 === 1 ? "purple" : "green"}
          title={a.title}
          subtitle={`${a.className} · ${a.language}`}
          className="rounded-[14px] border-0 px-4 py-3.5"
        >
          <PaceTag tone={a.status === "in progress" ? "amber" : "neutral"} className="hidden sm:inline-flex">
            {a.status === "in progress" ? "In progress" : "Not started"}
          </PaceTag>
          <PaceTag tone={isUrgent(a.dueDate) ? "red" : "neutral"}>{formatDueShort(a.dueDate)}</PaceTag>
          <PaceIcon name="chevron" size={18} />
        </AssignmentRow>
      ))}
    </section>
  );
}
