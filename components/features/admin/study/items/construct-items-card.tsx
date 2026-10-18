import { CONSTRUCTS, type ConstructId } from "@/lib/study/questionnaire";
import type { StudyResults } from "@/lib/study/analysis";
import type { StudyRole } from "@/lib/study/dataset";
import { formatMean, hasData } from "../format";
import { InterpretationTag } from "../interpretation-tag";
import { ItemRow, itemGrid } from "./item-row";
import { lowestItemId } from "./item-insights";

const heading = "text-[11px] font-bold uppercase tracking-[0.06em] text-pace-muted";

type ConstructItemsCardProps = {
  results: StudyResults;
  group: StudyRole;
  construct: ConstructId;
};

export function ConstructItemsCard({ results, group, construct }: ConstructItemsCardProps) {
  const meta = CONSTRUCTS.find((c) => c.id === construct)!;
  const stats = results.constructs.find((c) => c.id === construct)![group];
  const items = results.items.filter((i) => i.constructId === construct);
  const lowest = lowestItemId(items, group);
  const groupLabel = group === "student" ? "Students" : "Instructors";
  const letter = group === "student" ? "S" : "I";

  return (
    <section className="flex flex-col gap-4 rounded-[20px] border-[1.5px] border-pace-line bg-white p-5 shadow-[0_3px_0_0_var(--color-pace-line)]">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-[15px] font-bold text-pace-ink">
            {meta.name} · {groupLabel}
          </h2>
          <p className="text-xs text-pace-ink-2">
            n = {results.responses[group].count} · share of answers per statement, with weighted mean and SD
          </p>
        </div>
        {hasData(stats) && (
          <div className="flex items-center gap-3 text-pace-ink-2">
            <span className="text-[13px]">Construct mean</span>
            <span className="text-xl font-bold text-pace-ink">{formatMean(stats)}</span>
            <span className="font-mono text-xs">SD {stats.sd.toFixed(2)}</span>
            <InterpretationTag group={letter} label={stats.label} plain />
          </div>
        )}
      </header>
      <div className="overflow-x-auto">
        <div className={`${itemGrid} rounded-lg bg-pace-canvas py-2`}>
          {["Item", "Statement", "Distribution of answers", "Mean", "SD", "Interpretation"].map((h) => (
            <span key={h} className={heading}>
              {h}
            </span>
          ))}
        </div>
        {items.map((item) => (
          <ItemRow key={item.id} item={item} stats={item[group]} group={letter} highlight={item.id === lowest} />
        ))}
      </div>
    </section>
  );
}
