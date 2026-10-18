import type { SubmissionDetail } from "./types";

export function DetailStatCards({ detail }: { detail: SubmissionDetail }) {
  const passed = detail.testResults.filter((t) => t.passed).length;
  const stats = [
    { label: "Score", value: detail.score === null ? "—" : `${Math.round(detail.score)}%` },
    { label: "Tests", value: `${passed} / ${detail.testResults.length}` },
    { label: "Hearts used", value: `${detail.heartsUsed} of ${detail.assignment.heartsCount}` },
    { label: "Time on task", value: detail.minutesOnTask === null ? "—" : `${detail.minutesOnTask} min` },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="flex flex-col gap-1.5 rounded-2xl border-[1.5px] border-pace-line bg-white px-4 py-3 shadow-[0_3px_0_0_var(--color-pace-line)]"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-pace-muted">{s.label}</span>
          <span className="text-[26px] font-bold leading-none text-pace-ink">{s.value}</span>
        </div>
      ))}
    </div>
  );
}
