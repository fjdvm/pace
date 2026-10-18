import { CircleAlert, Check } from "lucide-react";
import type { StudyResults } from "@/lib/study/analysis";
import type { StudyRole } from "@/lib/study/dataset";

type Item = StudyResults["items"][number];

function answered(items: Item[], group: StudyRole) {
  return items.filter((i) => i[group].n > 0);
}

export function lowestItemId(items: Item[], group: StudyRole) {
  const candidates = answered(items, group);
  if (candidates.length < 2) return null;
  return candidates.reduce((a, b) => (b[group].mean < a[group].mean ? b : a)).id;
}

function highest(items: Item[], group: StudyRole) {
  return answered(items, group).reduce<Item | null>((a, b) => (!a || b[group].mean > a[group].mean ? b : a), null);
}

export function ItemInsights({ items, group }: { items: Item[]; group: StudyRole }) {
  const lowId = lowestItemId(items, group);
  const low = items.find((i) => i.id === lowId);
  const high = highest(items, group);
  if (!low || !high) return null;
  const who = group === "student" ? "Students" : "Instructors";
  const spread = low[group].sd >= 1 ? "more spread out" : "fairly consistent";

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="flex gap-3 rounded-2xl bg-pace-amber-tint p-5">
        <CircleAlert className="mt-0.5 size-5 shrink-0 text-pace-amber" />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-bold text-pace-ink">
            Lowest item: {low.id} ({low[group].mean.toFixed(2)})
          </p>
          <p className="text-xs leading-relaxed text-pace-ink-2">
            {who} rate &ldquo;{low.text}&rdquo; lowest, and opinions are {spread} (SD {low[group].sd.toFixed(2)}).
          </p>
        </div>
      </div>
      <div className="flex gap-3 rounded-2xl bg-pace-green-tint p-5">
        <Check className="mt-0.5 size-5 shrink-0 text-pace-green-deep" />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-bold text-pace-ink">
            Highest item: {high.id} ({high[group].mean.toFixed(2)})
          </p>
          <p className="text-xs leading-relaxed text-pace-ink-2">
            {Math.round(high[group].distribution[4])}% strongly agree: &ldquo;{high.text}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
