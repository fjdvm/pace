import { ProgressBar } from "@/components/features/student/shared/progress-bar";
import { formatDueShort } from "@/lib/student-dates";
import type { AssignmentOverview } from "./types";

type OverviewStatCardsProps = { overview: AssignmentOverview };

function StatCard({
  label,
  value,
  suffix,
  note,
  percent,
  tone,
}: {
  label: string;
  value: string;
  suffix?: string;
  note?: string;
  percent: number;
  tone: "green" | "red" | "purple";
}) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border-[1.5px] border-pace-line bg-white p-4 shadow-[0_3px_0_0_var(--color-pace-line)]">
      <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-pace-muted">{label}</span>
      <div className="flex items-baseline gap-2">
        <span className="text-[28px] font-bold leading-none text-pace-ink">
          {value}
          {suffix && <span className="text-[28px]"> {suffix}</span>}
        </span>
        {note && <span className="text-xs text-pace-ink-2">{note}</span>}
      </div>
      <ProgressBar value={percent} tone={tone} className="h-1.5" />
    </div>
  );
}

export function OverviewStatCards({ overview }: OverviewStatCardsProps) {
  const { stats, assignment } = overview;
  const share = stats.total ? Math.round((stats.submitted / stats.total) * 100) : 0;
  const missing = Math.max(0, stats.total - stats.submitted);

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Submitted"
        value={`${stats.submitted} / ${stats.total}`}
        note={`${share}% of class`}
        percent={share}
        tone="green"
      />
      <StatCard
        label="Class average"
        value={stats.average === null ? "—" : `${stats.average}%`}
        note={stats.average === null ? undefined : `Median ${stats.median}%`}
        percent={stats.average ?? 0}
        tone="green"
      />
      <StatCard
        label="Not yet submitted"
        value={String(missing)}
        note={`Due ${formatDueShort(assignment.dueDate).toLowerCase()}`}
        percent={stats.total ? (missing / stats.total) * 100 : 0}
        tone="red"
      />
      <StatCard
        label="Avg hearts used"
        value={String(stats.avgHearts)}
        note={`of ${assignment.heartsCount} per student`}
        percent={(stats.avgHearts / Math.max(assignment.heartsCount, 1)) * 100}
        tone="purple"
      />
    </div>
  );
}
