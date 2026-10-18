import Link from "next/link";
import { ChevronRight, Clock, GraduationCap, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InstructorHomeData } from "@/components/features/instructor/types";

type StatCardsProps = { stats: InstructorHomeData["stats"] };

const cards = [
  { key: "newSubmissions", label: "New submissions to review", Icon: GraduationCap, tone: "bg-pace-green-tint text-pace-green-deep" },
  { key: "dueThisWeek", label: "Assignments due this week", Icon: Clock, tone: "bg-pace-amber-tint text-pace-amber" },
  { key: "flagged", label: "Submissions flagged to check", Icon: ShieldAlert, tone: "bg-pace-red-tint text-pace-red" },
] as const;

export function StatCards({ stats }: StatCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map(({ key, label, Icon, tone }) => (
        <Link
          key={key}
          href="/dashboard/instructor/submissions"
          className="flex items-center gap-3.5 rounded-[20px] border-[1.5px] border-pace-line bg-white p-5 shadow-[0_3px_0_0_var(--color-pace-line)]"
        >
          <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-[14px]", tone)}>
            <Icon className="size-5" strokeWidth={1.75} />
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="text-[26px] font-bold leading-tight text-pace-ink">{stats[key]}</span>
            <span className="truncate text-[13px] text-pace-ink-2">{label}</span>
          </span>
          <ChevronRight className="size-[18px] shrink-0 text-pace-muted" />
        </Link>
      ))}
    </div>
  );
}
