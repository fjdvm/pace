"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { formControl } from "./form-field";
import type { ShortAnswerInput } from "@/lib/items/short-answer";

export function ShortAnswerEditor({ initial, busy, locked, onSave, onDelete, onPreviewChange }: {
  initial: ShortAnswerInput; busy: boolean; locked: boolean;
  onSave: (value: ShortAnswerInput) => void; onDelete: () => void;
  onPreviewChange?: (value: ShortAnswerInput) => void;
}) {
  const [value, setValue] = useState(initial);
  function patch(change: Partial<ShortAnswerInput>) {
    const next = { ...value, ...change };
    setValue(next); onPreviewChange?.(next);
  }
  return <section className="space-y-3 bg-white px-4 pb-4 md:pl-[50px]">
    <label className="block space-y-2 text-[13px] font-semibold"><span>Prompt</span>
      <Textarea disabled={busy} value={value.title} onChange={(e) => patch({ title: e.target.value })} placeholder="Write an Item prompt" className={`${formControl} min-h-24`} />
    </label>
    <p className="text-[13px] text-pace-muted">Graded by the Instructor after turn-in. No automatic score.</p>
    <div className="flex items-end gap-3">
      <label className="min-w-0 flex-1 space-y-2 text-[13px] font-semibold"><span className="block">Points</span>
        <Input aria-label="Points" disabled={busy} type="number" min={0} step="any" value={value.points} onChange={(e) => patch({ points: Number(e.target.value) })} className={`${formControl} max-w-[140px]`} />
      </label>
      <Button variant="ghost" disabled={locked || busy} onClick={onDelete}>Delete</Button>
      <Button disabled={busy} onClick={() => onSave(value)} className="h-10 rounded-full bg-pace-green px-[18px] text-white shadow-[0_3px_0_#11923a]">{busy ? "Saving…" : "Done"}</Button>
    </div>
  </section>;
}
