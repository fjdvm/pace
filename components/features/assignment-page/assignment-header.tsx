import Image from "next/image";
import { formatDueSentence, formatMonthDay } from "@/lib/student-dates";
import type { StudentAssignmentData } from "./types";

export function AssignmentHeader({ data }: { data: StudentAssignmentData }) {
  return (
    <div className="flex items-start gap-4">
      <span className="hidden size-10 shrink-0 items-center justify-center rounded-full bg-pace-green md:flex">
        <Image src="/class/assignment.svg" alt="" width={24} height={24} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-3 md:gap-2.5">
        <h1 className="text-[22px] font-bold leading-tight tracking-[-0.22px] text-pace-green-deep md:text-[32px] md:leading-[1.15] md:tracking-[-0.48px]">
          {data.title}
        </h1>
        <p className="text-[13px] text-pace-muted">
          Prof. {data.instructorName.replace(/^prof\.?\s+/i, "")} · {formatMonthDay(data.postedAt)}
        </p>
        <p className="border-b border-pace-line pb-3 text-right text-[13px] font-bold text-pace-ink md:[border-bottom-color:var(--color-pace-green-deep)] md:text-[15px]">
          {formatDueSentence(data.dueDate)}
        </p>
        <p className="whitespace-pre-wrap text-[15px] leading-[1.55] text-pace-ink">{data.instructions}</p>
      </div>
    </div>
  );
}
