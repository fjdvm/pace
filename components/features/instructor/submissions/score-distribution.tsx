import { ProgressBar } from "@/components/features/student/shared/progress-bar";
import type { AssignmentOverview } from "./types";

const rows = [
  { key: "high", label: "70–100%", tone: "green" },
  { key: "mid", label: "40–69%", tone: "amber" },
  { key: "low", label: "0–39%", tone: "red" },
] as const;

export function ScoreDistribution({ bands, total }: { bands: AssignmentOverview["insights"]["bands"]; total: number }) {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-xs text-pace-ink-2">Score distribution</span>
      {rows.map(({ key, label, tone }) => (
        <div key={key} className="grid grid-cols-[4.5rem_1fr_1.5rem] items-center gap-3 text-xs">
          <span className="text-pace-ink-2">{label}</span>
          <ProgressBar value={total ? (bands[key] / total) * 100 : 0} tone={tone} className="h-2" />
          <span className="text-right font-semibold text-pace-ink">{bands[key]}</span>
        </div>
      ))}
    </div>
  );
}
