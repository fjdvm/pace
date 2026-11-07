"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { itemKindLabel } from "@/lib/items/presentation";
import Image from "next/image";
import { PostItemsDetails } from "./post-items-details";
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
  const primaryId = form.values.hasCodingItem === false ? undefined : form.values.itemId ?? form.id;
  const state = usePostItems(form.id, form.setItemEditing, primaryId);
  const [overview, setOverview] = useState(false);
  const [editorSession, setEditorSession] = useState(0);
  const [preview, setPreview] = useState<AnswerInput | null>(null);
  const [newKind, setNewKind] = useState<"coding" | "multiple_choice" | "short_answer">("coding");
  const select = (id: string | null, kind = newKind) => {
    setOverview(id === null);
    setEditorSession((current) => current + 1);
    state.edit(id);
    const item = state.items.find((candidate) => candidate.id === id);
    setPreview(id === "new" ? kind === "coding" ? null : kind === "short_answer" ? emptyShortAnswer : emptyChoice
      : item?.kind === "short_answer" ? { ...item, kind: "short_answer" }
      : item?.kind === "multiple_choice" ? { ...item, kind: "multiple_choice", correctOption: item.correctOption ?? -1 } : null);
  };
  const primaryPoints = form.values.points ?? 100;
  const total = state.items.reduce((sum, item) => sum + (item.id === primaryId ? primaryPoints : item.id === state.editing && preview ? preview.points : item.points), 0) + (state.editing === "new" ? preview?.points ?? 0 : 0);
  const activeId = state.editing ?? (overview ? undefined : primaryId);
  const active = state.items.find((item) => item.id === activeId);
  const count = state.items.length;
  const displayCount = count + Number(state.editing === "new");
  const activeIndex = state.editing === "new" ? count : state.items.findIndex((item) => item.id === activeId);
  const isCoding = state.editing === "new" ? newKind === "coding" : active?.kind === "coding";
  const finish = () => { select(null); setPreview(null); };
  const answerEditor = !isCoding && (active || state.editing === "new") ? (
    <AnswerEditor key={editorSession}
      initial={active ? { ...active, kind: active.kind as "multiple_choice" | "short_answer", correctOption: active.correctOption ?? -1 } : newKind === "short_answer" ? emptyShortAnswer : emptyChoice}
      locked={locked} busy={state.busy} onPreviewChange={setPreview}
      onSave={async (input) => { if (await state.save(input)) finish(); }} onDelete={async () => { if (await state.remove()) finish(); }} />
  ) : null;
  return (
    <div className="flex flex-1 flex-col gap-6 md:flex-row md:items-start md:px-12 md:py-6">
      <main className="flex min-w-0 flex-1 flex-col gap-4 px-4 py-4 md:p-0">
        {(!primaryId || overview || state.editing && !isCoding) && <PostItemsDetails form={form} count={displayCount} total={total} />}
        <section className="flex flex-col gap-4" aria-label="Post Items">
          <h2 className="sr-only">Items</h2>
          <p className="sr-only">{displayCount} {displayCount === 1 ? "item" : "items"} · {total} points total</p>
          {state.items.map((item, index) => (
            <div key={item.id} className={`overflow-hidden rounded-[12px] border bg-white ${activeId === item.id ? "border-pace-green" : "border-pace-line"}`}>
              <div className="flex items-center">
                <ItemOrderControls index={index} count={count} title={item.title} disabled={locked || state.busy || !!state.editing || form.isSaving} onMove={(direction) => state.move(item.id, direction)} />
                <ItemAuthoringRow state={state} onSelect={select}
                  item={item.id === primaryId ? { ...item, title: form.values.itemTitle ?? item.title, points: primaryPoints } : item.id === state.editing && preview ? { ...item, points: preview.points } : item}
                  index={index} selected={activeId === item.id}
                  onPointsChange={item.id === primaryId ? (points) => form.patch({ points }) : undefined} />
              </div>
              {activeId === item.id && answerEditor}
            </div>
          ))}
          {state.editing === "new" && !isCoding && (
            <div className="overflow-hidden rounded-[12px] border border-pace-green bg-white">
              <div className="flex items-center gap-2.5 px-3.5 py-3 text-[13px] font-bold">
                <span aria-hidden className="text-pace-muted">⋮⋮</span>
                <span className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-pace-sunken text-[11px]">{displayCount}</span>
                <span className="min-w-0 flex-1">New {itemKindLabel(newKind).toLowerCase()} item</span>
                <span className="rounded-full bg-pace-green-tint px-2.5 py-1 text-xs text-pace-green-deep">{itemKindLabel(newKind)}</span>
                <span>{preview?.points ?? 10} pts</span>
              </div>
              {answerEditor}
            </div>
          )}
          <div className="flex flex-wrap items-center justify-center gap-3 rounded-[12px] border border-dashed border-pace-line-strong p-4">
            <AddChoiceMenu onOpen={() => setOverview(true)} classId={form.values.classIds[0]} disabled={locked || !state.loaded || state.busy || state.editing !== null || form.isSaving} onAdd={(kind) => { setNewKind(kind); select("new", kind); }} />
            <span className="text-[13px] text-pace-muted">or</span>
            <Link href={`/dashboard/assignments/import?classId=${form.values.classIds[0] ?? ""}`} className="flex items-center gap-2 rounded-full bg-pace-purple-tint px-2.5 py-[9px] text-[13px] font-bold text-pace-purple"><Image src="/activity-editor/import-folder.svg" alt="" width={24} height={24} />Import items from a file</Link>
          </div>
        </section>
        {primaryId && activeId === primaryId && <>{codingEditor}<Button variant="ghost" disabled={locked || state.busy || form.isSaving || form.dirty || count <= 1} onClick={async () => { if (await state.remove(primaryId)) window.location.reload(); }}>Delete Item</Button></>}
        {activeId !== primaryId && isCoding && (
          <CodingItemEditor key={editorSession} itemNumber={activeIndex + 1} classId={form.values.classIds[0]} locked={locked} busy={state.busy} isDraft={form.values.isDraft}
            initial={active ? { ...active, language: active.language ?? "Python" } : undefined}
            onSave={async (input, close = true) => { const saved = await state.save(input, close); if (saved && close) { if (!primaryId) window.location.reload(); else finish(); } return saved; }} onDelete={async () => { if (await state.remove()) finish(); }} />
        )}
        {state.editing && <Button variant="outline" disabled={state.busy} onClick={finish}>Close editor</Button>}
      </main>
      <aside className="flex min-w-0 flex-col gap-4 px-4 pb-6 md:w-[36%] md:max-w-[420px] md:shrink-0 md:p-0">
        {preview ? preview.kind === "multiple_choice" ? <ChoicePreview value={preview} index={activeIndex} total={displayCount} /> : <ShortAnswerPreview value={preview} index={activeIndex} total={displayCount} /> : <section className="space-y-3.5 rounded-[12px] border border-pace-line bg-white p-5"><h2 className="text-base font-bold">Settings</h2>{settings(total)}</section>}
      </aside>
    </div>
  );
}
