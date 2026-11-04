import Link from "next/link";
import { HeartsRow } from "@/components/features/student/shared/hearts-row";
import { paceButtonBase, paceButtonStyles } from "@/components/features/student/shared/pace-button";
import { cn } from "@/lib/utils";
import { startLabel, workStatusLabel } from "./item-status";
import type { StudentAssignmentData } from "./types";

export function YourWorkCard({ data, workHref }: { data: StudentAssignmentData; workHref: string }) {
  return (
    <section className="hidden flex-col gap-3 rounded-[6px] border border-pace-line bg-white p-5 md:flex">
      <div className="flex items-start justify-between">
        <h2 className="text-base font-bold leading-[1.35] tracking-[-0.08px] text-pace-ink">Your work</h2>
        <span className="text-[13px] font-bold text-pace-green-deep">{workStatusLabel(data.items)}</span>
      </div>
      <HeartsRow left={data.heartsLeft} max={data.heartsMax} />
      <p className="text-[13px] text-pace-muted">Each question to the AI tutor uses one heart.</p>
      <Link href={workHref} className={cn(paceButtonBase, paceButtonStyles.green, "h-[52px] w-full text-[15px]")}>
        {startLabel(data.items)}
      </Link>
      <p className="text-[13px] text-pace-muted">Typing, pasting, and tab switches are recorded while you work.</p>
    </section>
  );
}
