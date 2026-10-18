import type { AssignmentOverview } from "./types";

export function HeartsScoreTiles({ buckets }: { buckets: AssignmentOverview["insights"]["byHearts"] }) {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-xs text-pace-ink-2">Average score by hearts used</span>
      <div className="grid grid-cols-3 gap-2">
        {buckets.map((bucket) => (
          <div key={bucket.label} className="flex flex-col items-center gap-0.5 rounded-xl bg-pace-canvas py-2.5">
            <span className="text-base font-bold text-pace-ink">
              {bucket.average === null ? "—" : `${bucket.average}%`}
            </span>
            <span className="text-[11px] text-pace-muted">{bucket.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
