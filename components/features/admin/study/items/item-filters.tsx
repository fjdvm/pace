import { cn } from "@/lib/utils";
import { CONSTRUCTS, type ConstructId } from "@/lib/study/questionnaire";
import type { StudyRole } from "@/lib/study/dataset";
import { LikertLegend } from "./likert-legend";

type ItemFiltersProps = {
  group: StudyRole;
  construct: ConstructId;
  counts: Record<StudyRole, number>;
  onGroup: (group: StudyRole) => void;
  onConstruct: (construct: ConstructId) => void;
};

export function ItemFilters({ group, construct, counts, onGroup, onConstruct }: ItemFiltersProps) {
  const groups: { id: StudyRole; label: string }[] = [
    { id: "student", label: `Students · ${counts.student}` },
    { id: "instructor", label: `Instructors · ${counts.instructor}` },
  ];
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <div role="radiogroup" aria-label="Group" className="flex gap-1 rounded-full bg-pace-sunken p-1">
          {groups.map((g) => (
            <button
              key={g.id}
              type="button"
              role="radio"
              aria-checked={group === g.id}
              onClick={() => onGroup(g.id)}
              className={cn(
                "cursor-pointer rounded-full px-3.5 py-1.5 text-[13px] font-semibold",
                group === g.id ? "bg-white text-pace-ink shadow-sm" : "text-pace-ink-2",
              )}
            >
              {g.label}
            </button>
          ))}
        </div>
        <div role="radiogroup" aria-label="Construct" className="flex flex-wrap gap-2">
          {CONSTRUCTS.map((c) => (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={construct === c.id}
              onClick={() => onConstruct(c.id)}
              className={cn(
                "cursor-pointer rounded-full border-[1.5px] px-4 py-1.5 text-[13px] font-semibold",
                construct === c.id
                  ? "border-pace-green bg-pace-green-tint text-pace-green-deep"
                  : "border-pace-line-strong bg-white text-pace-ink",
              )}
            >
              {c.id}
            </button>
          ))}
        </div>
      </div>
      <LikertLegend />
    </div>
  );
}
