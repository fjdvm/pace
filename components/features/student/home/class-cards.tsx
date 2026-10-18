import Link from "next/link";
import { cn } from "@/lib/utils";
import { PaceIcon } from "@/components/features/student/shared/pace-icon";
import { isDueWithin48Hours } from "@/lib/student-dates";
import type { StudentClass } from "@/components/features/student/types";

type ClassCardsProps = {
  classes: StudentClass[];
};

export function ClassCards({ classes }: ClassCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {classes.map((cls, index) => {
        const purple = index % 2 === 1;
        const open = cls.assignments.filter((a) => a.status !== "submitted");
        const dueSoon = open.filter((a) => isDueWithin48Hours(a.dueDate)).length;
        const owner = cls.instructorEmail.split("@")[0];
        return (
          <Link
            key={cls.id}
            href={`/dashboard/student/classes/${cls.id}`}
            className="flex items-center gap-3.5 rounded-[20px] border-[1.5px] border-pace-line bg-white p-5"
          >
            <span
              className={cn(
                "flex size-12 shrink-0 items-center justify-center rounded-[14px]",
                purple ? "bg-pace-purple-tint" : "bg-pace-green-tint",
              )}
            >
              <PaceIcon name={purple ? "cap-purple" : "cap-green"} size={22} />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="truncate text-base font-bold leading-snug tracking-[-0.005em] text-pace-ink">
                {cls.name}
              </span>
              <span className="text-[13px] leading-normal text-pace-muted">
                {owner} · {cls.assignments.length} assignments
                {dueSoon > 0 ? ` · ${dueSoon} due soon` : ""}
              </span>
            </span>
            <PaceIcon name="chevron" size={18} />
          </Link>
        );
      })}
    </div>
  );
}
