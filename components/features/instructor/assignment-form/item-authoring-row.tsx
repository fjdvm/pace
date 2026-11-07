import { itemKindLabel } from "@/lib/items/presentation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { AuthoringItem } from "./use-post-items";

type Props = {
  state: { busy: boolean; editing: string | null };
  onSelect: (id: string | null) => void;
  item: Pick<AuthoringItem, "id" | "title" | "kind" | "points">;
  index: number;
  selected: boolean;
  onPointsChange?: (points: number) => void;
};

export function ItemAuthoringRow({ state, onSelect, item, index, selected, onPointsChange }: Props) {
  const { id, title, kind, points } = item;
  return (
    <div className="flex min-w-0 flex-1 items-center">
      <Button
        variant="ghost"
        disabled={state.busy || (state.editing !== null && (state.editing !== id || kind !== "coding"))}
        onClick={() => onSelect(state.editing === id ? null : id)}
        className="flex h-auto min-w-0 flex-1 justify-start gap-2.5 whitespace-normal rounded-none px-3.5 py-3 text-left disabled:opacity-100"
      >
        <span aria-hidden className="text-[13px] text-pace-muted">⋮⋮</span>
        <span className={`flex size-[26px] shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${selected ? "bg-pace-green text-white" : "bg-pace-sunken"}`}>{index + 1}</span>
        <span className="min-w-0 flex-1 text-[15px] font-bold">{title}</span>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${kind === "short_answer" ? "bg-pace-amber-tint text-pace-ink" : kind === "coding" ? "bg-pace-blue-tint text-pace-blue" : "bg-pace-green-tint text-pace-green-deep"}`}>
          {itemKindLabel(kind)}
        </span>
        {selected && <span className="hidden text-xs text-pace-green-deep lg:inline">Editing</span>}
        {!onPointsChange && <span className="shrink-0 text-[13px]">{points} pts</span>}
      </Button>
      {onPointsChange && (
        <label className="flex shrink-0 items-center gap-1 pr-3 text-[13px]">
          <Input aria-label={`Item ${index + 1} points`} type="number" min={0} value={points}
            onChange={(event) => onPointsChange(event.target.valueAsNumber)}
            className="h-8 w-14 border-transparent px-1 text-right text-[13px] shadow-none md:text-[13px]" />
          pts
        </label>
      )}
    </div>
  );
}
