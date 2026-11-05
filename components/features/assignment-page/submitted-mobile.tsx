import Image from "next/image";
import Link from "next/link";
import { formatDueSentence } from "@/lib/student-dates";
import { PaceTag } from "@/components/features/student/shared/pace-tag";
import {
  paceButtonBase,
  paceButtonStyles,
} from "@/components/features/student/shared/pace-button";
import { UnsubmitButton } from "./unsubmit-button";
import type { StudentAssignmentData } from "./types";

export function SubmittedMobile({
  data,
  workHref,
}: {
  data: StudentAssignmentData;
  workHref: string;
}) {
  const s = data.submission!;
  const returned = s.status === "returned";
  return (
    <div className="fixed inset-0 z-30 flex flex-col overflow-y-auto bg-white text-pace-ink md:hidden">
      <header className="flex h-[52px] shrink-0 items-center gap-2 border-b border-pace-line pl-1 pr-4">
        <Link
          href={`/dashboard/classes/${data.classId}`}
          aria-label="Back to Class"
          className="flex size-10 items-center justify-center"
        >
          <Image src="/grading/back.svg" alt="" width={24} height={24} />
        </Link>
        <div>
          <h1 className="text-base font-bold">Assignment</h1>
          <p className="text-[11px] font-bold uppercase tracking-[0.66px] text-pace-muted">
            {data.className}
          </p>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-3 px-4 pb-8 pt-4">
        <h2 className="text-[22px] font-bold leading-tight tracking-[-0.22px] text-pace-green-deep">
          {data.title}
        </h2>
        <p className="text-[13px] text-pace-muted">
          {data.totalPoints} points · {formatDueSentence(data.dueDate)}
        </p>
        <div className="flex flex-col items-center gap-1.5 rounded-[12px] bg-pace-green-tint px-4 py-3.5">
          <span className="flex size-10 items-center justify-center rounded-full bg-pace-green text-base font-bold text-white">
            ✓
          </span>
          <b className="text-base text-pace-green-deep">
            {returned ? `${s.grade}/${data.totalPoints}` : "Turned in"}
            {s.late && " · Late"}
          </b>
          <p className="text-[13px] text-pace-ink-2">
            {new Date(s.submittedAt).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div className="flex items-center justify-between border-b border-pace-line py-1.5 text-[13px] text-pace-ink-2">
          Visible tests
          <PaceTag>
            {s.visiblePassed} of {s.visibleTotal} passed
          </PaceTag>
        </div>
        <div className="flex items-center justify-between border-b border-pace-line py-1.5 text-[13px] text-pace-ink-2">
          Hidden tests
          <PaceTag tone="neutral">
            {returned ? "Reviewed" : "After the due date"}
          </PaceTag>
        </div>
        <div className="flex items-center justify-between border-b border-pace-line py-1.5 text-[13px] text-pace-ink-2">
          Hearts used
          <PaceTag tone="neutral">
            {s.heartsUsed} total
          </PaceTag>
        </div>
        {s.status === "turned_in" && (
          <p className="text-[13px] text-pace-muted">
            You can unsubmit and keep working until your work is graded.
          </p>
        )}
        {s.feedback && (
          <section className="rounded-[8px] border border-pace-line p-4 text-[13px]">
            <h3 className="mb-2 font-bold">Private comments</h3>
            <p className="whitespace-pre-wrap">{s.feedback}</p>
          </section>
        )}
      </main>
      <footer className="sticky bottom-0 flex shrink-0 gap-3 border-t border-pace-line bg-white px-4 pb-7 pt-3">
        {s.status === "turned_in" && <UnsubmitButton postId={data.id} />}
        <Link
          href={workHref}
          className={`${paceButtonBase} ${paceButtonStyles.green} h-[52px] flex-1 text-[15px]`}
        >
          View my code
        </Link>
      </footer>
    </div>
  );
}
