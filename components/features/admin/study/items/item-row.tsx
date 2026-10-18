import { cn } from "@/lib/utils";
import type { ItemStats, StudyResults } from "@/lib/study/analysis";
import { formatMean } from "../format";
import { InterpretationTag } from "../interpretation-tag";
import { DistributionBar } from "./distribution-bar";

export const itemGrid = "grid min-w-[760px] grid-cols-[0.6fr_2fr_2.6fr_0.6fr_0.6fr_1.4fr] items-center gap-4 px-3";

type ItemRowProps = {
  item: StudyResults["items"][number];
  stats: ItemStats;
  group: "S" | "I";
  highlight: boolean;
};

export function ItemRow({ item, stats, group, highlight }: ItemRowProps) {
  const hasData = stats.n > 0;
  return (
    <div className={cn(itemGrid, "border-t border-pace-line py-3.5", highlight && "bg-pace-amber-tint")}>
      <span className="text-sm font-bold text-pace-ink">{item.id}</span>
      <span className="text-[13px] text-pace-ink">{item.text}</span>
      {hasData ? <DistributionBar distribution={stats.distribution} /> : <span className="text-xs text-pace-muted">No answers</span>}
      <span className="text-sm font-bold text-pace-ink">{formatMean(stats)}</span>
      <span className="font-mono text-xs text-pace-ink-2">{hasData ? stats.sd.toFixed(2) : "—"}</span>
      <span>{hasData && <InterpretationTag group={group} label={stats.label} plain />}</span>
    </div>
  );
}
