import { itemKindLabel } from "@/lib/items/presentation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
export function ItemAuthoringRow(
  state: { busy: boolean; editing: string | null },
  select: (id: string | null) => void,

  id: string,
  title: string,
  kind: string,
  points: number,
  index: number,
  onPointsChange?: (points: number) => void,
) {
  return (
    <div className="flex min-w-0 flex-1 items-center">
    <Button
      variant="ghost"
      disabled={
        state.busy ||
        (state.editing !== null &&
          (state.editing !== id || kind !== "coding"))
      }
      onClick={() => select(state.editing === id ? null : id)}
      className="flex h-auto min-w-0 flex-1 justify-start gap-2.5 whitespace-normal rounded-none disabled:opacity-100 px-3.5 py-3 text-left"
    >
      <span aria-hidden className="text-[13px] text-pace-muted">
        ⋮⋮
      </span>
      <span className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-pace-sunken text-[11px] font-bold">
        {index + 1}
      </span>
      <span className="min-w-0 flex-1 text-[15px] font-bold">{title}</span>
      <span
        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${kind === "short_answer" ? "bg-pace-amber-tint text-pace-ink" : kind === "coding" ? "bg-pace-blue-tint text-pace-blue" : "bg-pace-green-tint text-pace-green-deep"}`}
      >
        {itemKindLabel(kind)}
      </span>
      {!onPointsChange && <span className="shrink-0 text-[13px]">{points} pts</span>}
      <span className="text-pace-muted">
        {state.editing === id ? "▴" : "▾"}
      </span>
    </Button>
    {onPointsChange && <label className="flex shrink-0 items-center gap-1 pr-3 text-[13px]"><Input aria-label={`Item ${index + 1} points`} type="number" min={0} value={points} onChange={(event) => onPointsChange(event.target.valueAsNumber)} className="h-8 w-14 border-transparent px-1 text-right text-[13px] shadow-none md:text-[13px]" />pts</label>}
    </div>
  );
}
