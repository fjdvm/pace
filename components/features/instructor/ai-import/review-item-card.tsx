import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ItemTags } from "./item-tags";
import { CheckNote } from "./check-note";
import { CodingBody } from "./coding-body";
import { ChoiceBody } from "./choice-body";
import { ShortBody } from "./short-body";
import type { ImportedItem } from "@/lib/ai-import/types";

type Props = {
  item: ImportedItem;
  index: number;
  count: number;
  open: boolean;
  onToggle: () => void;
  onChange: (patch: Partial<ImportedItem>) => void;
  onMove: (direction: number) => void;
  onRemove: () => void;
};

export function ReviewItemCard({ item, index, count, open, onToggle, onChange, onMove, onRemove }: Props) {
  const Body = item.kind === "coding" ? CodingBody : item.kind === "multiple_choice" ? ChoiceBody : ShortBody;
  return (
    <section className={`overflow-hidden rounded-[12px] border bg-white ${item.checkNote ? "border-pace-amber" : "border-pace-line"}`}>
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2 px-3.5 py-3">
        <div className="flex flex-col text-pace-muted">
          <button type="button" aria-label={`Move item ${index + 1} up`} disabled={index === 0} onClick={() => onMove(-1)} className="text-[10px] leading-none disabled:opacity-30">▲</button>
          <button type="button" aria-label={`Move item ${index + 1} down`} disabled={index === count - 1} onClick={() => onMove(1)} className="text-[10px] leading-none disabled:opacity-30">▼</button>
        </div>
        <span className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-pace-sunken text-[11px] font-bold">{index + 1}</span>
        <button type="button" onClick={onToggle} aria-expanded={open} className="min-w-0 flex-1 basis-40 truncate text-left text-[15px] font-bold leading-[1.55]">{item.title || "Untitled item"}</button>
        <div className="flex flex-wrap items-center gap-2"><ItemTags item={item} /></div>
        <span className="text-[13px] font-bold text-pace-ink-2">{item.points} pts</span>
        <button type="button" onClick={onToggle} aria-label={open ? "Collapse item" : "Expand item"} className="text-[13px] text-pace-muted">{open ? "▴" : "▾"}</button>
      </div>
      {open && (
        <div className="flex flex-col gap-3 px-4 pb-4 md:pl-[50px]">
          {item.checkNote && <CheckNote note={item.checkNote} onConfirm={() => onChange({ checkNote: null })} />}
          <div className="grid gap-3 sm:grid-cols-[1fr_110px]">
            <Input value={item.title} onChange={(e) => onChange({ title: e.target.value })} aria-label="Item title" placeholder="Item prompt" className="h-10" />
            <Input type="number" min={0} value={item.points} onChange={(e) => onChange({ points: Number(e.target.value) })} aria-label="Points" className="h-10" />
          </div>
          <Body item={item} onChange={onChange} />
          <Button type="button" variant="ghost" onClick={onRemove} className="w-fit font-bold text-pace-red">Delete item</Button>
        </div>
      )}
    </section>
  );
}
