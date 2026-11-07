"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ItemOrderControls } from "./item-order-controls";
import { ItemAuthoringRow } from "./item-authoring-row";
import { AddChoiceMenu } from "./add-choice-menu";
import { AnswerEditor, type AnswerInput } from "./answer-editor";
import { ShortAnswerPreview } from "./short-answer-preview";
import { ChoicePreview } from "./choice-preview";
import { CodingItemEditor } from "./coding-item-editor";
import { usePostItems, emptyChoice, emptyShortAnswer } from "./use-post-items";
import type { useAssignmentForm } from "./use-assignment-form";

type Props = {
  form: ReturnType<typeof useAssignmentForm>;
  locked: boolean;
  settings: (total: number) => ReactNode;
  codingEditor: ReactNode;
};

export function AnswerItems({ form, locked, settings, codingEditor }: Props) {
  const primaryId = form.values.itemId ?? form.id;
  const state = usePostItems(form.id, form.setItemEditing, primaryId);
  const [preview, setPreview] = useState<AnswerInput | null>(null);
  const [newKind, setNewKind] = useState<"coding" | "multiple_choice" | "short_answer">("coding");
  const select = (id: string | null, kind = newKind) => {
    state.edit(id);
    const item = state.items.find((candidate) => candidate.id === id);
    setPreview(id === "new" ? kind === "coding" ? null : kind === "short_answer" ? emptyShortAnswer : emptyChoice
      : item?.kind === "short_answer" ? { ...item, kind: "short_answer" }
      : item?.kind === "multiple_choice" ? { ...item, kind: "multiple_choice", correctOption: item.correctOption ?? -1 } : null);
  };
  const primaryPoints = form.values.points ?? 100;
  const total = state.items.reduce((sum, item) => sum + (item.id === primaryId ? primaryPoints : item.points), 0);
  const activeId = state.editing ?? primaryId;
  const active = state.items.find((item) => item.id === activeId);
  const count = state.items.length;
  const activeIndex = state.editing === "new" ? count : state.items.findIndex((item) => item.id === activeId);
  const isCoding = state.editing === "new" ? newKind === "coding" : active?.kind === "coding";
  const finish = () => { select(null); setPreview(null); };
  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <main className="flex min-w-0 flex-1 flex-col gap-5 px-4 py-4 md:px-10 md:py-8">
        <section className="flex flex-col gap-3 rounded-xl border border-pace-line bg-white p-4 md:p-6" aria-label="Post Items">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold">Items</h2>
            <p className="text-[13px] text-pace-muted">{count} {count === 1 ? "item" : "items"} · {total} points total</p>
          </div>
          {state.items.map((item, index) => (
            <div key={item.id} className={`flex items-center rounded-[10px] border ${activeId === item.id ? "border-pace-green bg-pace-green-tint" : "border-pace-line"}`}>
              <ItemOrderControls index={index} count={count} title={item.title} disabled={locked || state.busy || !!state.editing || form.isSaving} onMove={(direction) => state.move(item.id, direction)} />
              {ItemAuthoringRow(state, select, item.id, item.id === primaryId ? form.values.itemTitle ?? item.title : item.title, item.kind, item.id === primaryId ? primaryPoints : item.points, index, item.id === primaryId ? (points) => form.patch({ points }) : undefined)}
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-3">
            <AddChoiceMenu disabled={locked || !state.loaded || state.busy || state.editing !== null || form.isSaving} onAdd={(kind) => { setNewKind(kind); select("new", kind); }} />
            <Link href={`/dashboard/assignments/import?classId=${form.values.classIds[0] ?? ""}`} className="rounded-full bg-pace-purple-tint px-3 py-2 text-[13px] font-bold text-pace-purple">✦ Import items from a file</Link>
          </div>
        </section>
        {activeId === primaryId && codingEditor}
        {activeId !== primaryId && (isCoding ? (
          <CodingItemEditor key={activeId} classId={form.values.classIds[0]} locked={locked} busy={state.busy} isDraft={form.values.isDraft}
            initial={active ? { ...active, language: active.language ?? "Python" } : undefined}
            onSave={async (input, close = true) => { const saved = await state.save(input, close); if (saved && close) finish(); return saved; }} onDelete={async () => { if (await state.remove()) finish(); }} />
        ) : (active || state.editing === "new") && (
          <AnswerEditor key={activeId}
            initial={active ? { ...active, kind: active.kind as "multiple_choice" | "short_answer", correctOption: active.correctOption ?? -1 } : newKind === "short_answer" ? emptyShortAnswer : emptyChoice}
            locked={locked} busy={state.busy} onPreviewChange={setPreview}
            onSave={async (input) => { if (await state.save(input)) finish(); }} onDelete={async () => { if (await state.remove()) finish(); }} />
        ))}
        {state.editing && <Button variant="outline" disabled={state.busy} onClick={finish}>Close editor</Button>}
      </main>
      <aside className="flex min-w-0 flex-col gap-4 border-pace-line bg-white px-6 py-8 md:w-[300px] md:shrink-0 md:border-l xl:w-[380px]">
        {preview ? preview.kind === "multiple_choice" ? <ChoicePreview value={preview} index={activeIndex} total={count + Number(state.editing === "new")} /> : <ShortAnswerPreview value={preview} index={activeIndex} total={count + Number(state.editing === "new")} /> : settings(total)}
      </aside>
    </div>
  );
}
