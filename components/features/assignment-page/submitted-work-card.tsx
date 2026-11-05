import Image from "next/image";
import Link from "next/link";
import { UnsubmitButton } from "./unsubmit-button";
import {
  paceButtonBase,
  paceButtonStyles,
} from "@/components/features/student/shared/pace-button";
import type { StudentAssignmentData } from "./types";

export function SubmittedWorkCard({
  data,
  workHref,
}: {
  data: StudentAssignmentData;
  workHref: string;
}) {
  const submission = data.submission!;
  const returned = submission.status === "returned";
  return (
    <section className="hidden flex-col gap-3 rounded-[8px] border border-pace-line bg-white p-5 md:flex">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold">Your work</h2>
        <span className="text-[13px] font-bold text-pace-green-deep">
          {returned
            ? `${submission.grade}/${data.totalPoints}`
            : `Turned in${submission.late ? " · Late" : ""}`}
        </span>
      </div>
      <Link
        href={workHref}
        className="flex items-center gap-3 rounded-[8px] border border-pace-line p-3 text-[13px]"
      >
        <span className="flex size-8 items-center justify-center rounded-[4px] bg-pace-sunken">
          <Image src="/grading/code.svg" alt="" width={24} height={24} />
        </span>
        <div>
          <b>{data.language === "Python" ? "main.py" : "My code"}</b>
          <p className="text-[11px] uppercase tracking-[0.66px] text-pace-muted">
            Turned in{" "}
            {new Date(submission.submittedAt).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
        </div>
      </Link>
      <p className="flex justify-between text-[13px] text-pace-ink-2">
        Hearts used{" "}
        <b className="text-pace-ink">
          {submission.heartsUsed} of {data.heartsMax}
        </b>
      </p>
      {submission.status === "turned_in" ? (
        <UnsubmitButton postId={data.id} />
      ) : (
        <Link
          href={workHref}
          className={`${paceButtonBase} ${paceButtonStyles.secondary} h-[52px] w-full text-[15px]`}
        >
          View my code
        </Link>
      )}
      {submission.status === "turned_in" && (
        <p className="text-[13px] leading-normal text-pace-muted">
          You can unsubmit and keep working until your work is graded.
        </p>
      )}
    </section>
  );
}
