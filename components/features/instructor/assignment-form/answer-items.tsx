"use client";
import { ItemAuthoringRow } from "./item-authoring-row";
import { AddChoiceMenu } from "./add-choice-menu";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formControl } from "./form-field";
import { Input } from "@/components/ui/input";
import { AnswerEditor, type AnswerInput } from "./answer-editor";
import { ShortAnswerPreview } from "./short-answer-preview";
import { ChoicePreview } from "./choice-preview";
import { usePostItems, emptyChoice, emptyShortAnswer } from "./use-post-items";

import type { useAssignmentForm } from "./use-assignment-form";
import type { ReactNode } from "react";

type Props = {
  form: ReturnType<typeof useAssignmentForm>;
  locked: boolean;
  settings: ReactNode;
  codingEditor: ReactNode;
};
export function AnswerItems({ form, locked, settings, codingEditor }: Props) {
  const state = usePostItems(form.id, form.setItemEditing);
  const [preview, setPreview] = useState<AnswerInput | null>(null);
  const [newKind, setNewKind] = useState<"multiple_choice" | "short_answer">("multiple_choice");
  const select = (id: string | null, kind = newKind) => {
    state.edit(id);
    const item = state.items.find((i) => i.id === id);
    setPreview(
      id === "new"
        ? (kind === "short_answer" ? emptyShortAnswer : emptyChoice)
        : item?.kind === "short_answer" ? { ...item, kind: "short_answer" } : item?.kind === "multiple_choice"
          ? {
              ...item,
              kind: "multiple_choice",
              correctOption: item.correctOption ?? -1,
            }
          : null,
    );
  };
  const total =
    state.items.reduce(
      (sum, i, n) =>
        sum +
        (n === 0
          ? (form.values.points ?? i.points)
          : state.editing === i.id
            ? (preview?.points ?? i.points)
            : i.points),
      0,
    ) + (state.editing === "new" ? (preview?.points ?? 10) : 0);
  const count = state.items.length + Number(state.editing === "new");
  const activeIndex =
    state.editing === "new"
      ? count - 1
      : state.items.findIndex((i) => i.id === state.editing);
  return (
    <div className="grid flex-1 items-start gap-6 px-4 py-4 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-12 lg:py-6">
      <main className="min-w-0 space-y-4">
        <section className="space-y-3.5 rounded-[12px] border border-pace-line bg-white p-6">
          <label className="block space-y-2 text-[13px] font-semibold">
            <span className="block">Title</span>
            <Input
              value={form.values.title}
              onChange={(e) => form.patch({ title: e.target.value })}
              className={formControl}
            />
          </label>
          <label className="block space-y-2 text-[13px] font-semibold">
            <span className="block">Instructions (optional)</span>
            <Input
              value={form.values.instructions}
              onChange={(e) => form.patch({ instructions: e.target.value })}
              className={formControl}
            />
          </label>
          <p className="text-[13px]">
            <b>{count} items</b>
            <span className="text-pace-muted">
              {" "}
              · {total} points total (added up from the items)
            </span>
          </p>
        </section>
        <section className="space-y-4" aria-label="Post Items">
          {state.items.map((item, index) => (
            <section
              key={item.id}
              className={`overflow-hidden rounded-[12px] border bg-white ${state.editing === item.id ? "border-2 border-pace-green" : "border-pace-line"}`}
            >
              {ItemAuthoringRow(
                state,
                select,
                item.id,
                index === 0
                  ? (form.values.itemTitle ?? item.title)
                  : item.title,
                item.kind,
                index === 0 ? (form.values.points ?? item.points) : item.points,
                index,
              )}
              {state.editing === item.id &&
                (item.kind !== "coding" ? (
                  <AnswerEditor
                    key={item.id}
                    initial={{
                      ...item,
                      kind: item.kind as "multiple_choice" | "short_answer",
                      correctOption: item.correctOption ?? -1,
                    }}
                    locked={locked}
                    busy={state.busy}
                    onPreviewChange={setPreview}
                    onSave={async (input) => {
                      if (await state.save(input)) setPreview(null);
                    }}
                    onDelete={async () => {
                      if (await state.remove()) setPreview(null);
                    }}
                  />
                ) : index === 0 ? (
                  <div className="space-y-4 p-4">
                    {codingEditor}
                    <Button onClick={() => select(null)} variant="outline">
                      Done editing Coding Item
                    </Button>
                  </div>
                ) : (
                  <p className="px-4 pb-4 text-sm">{item.instructions}</p>
                ))}
            </section>
          ))}
          {state.editing === "new" && (
            <section className="overflow-hidden rounded-[12px] border-2 border-pace-green bg-white">
              {ItemAuthoringRow(
                state,
                select,
                "new",
                newKind === "short_answer" ? "New short answer item" : "New multiple choice item",
                newKind,
                preview?.points ?? 10,
                count - 1,
              )}
              <AnswerEditor
                initial={newKind === "short_answer" ? emptyShortAnswer : emptyChoice}
                locked={false}
                busy={state.busy}
                onPreviewChange={setPreview}
                onSave={async (input) => {
                  if (await state.save(input)) setPreview(null);
                }}
                onDelete={() => {
                  select(null);
                }}
              />
            </section>
          )}
          <AddChoiceMenu
            disabled={!state.loaded || state.busy || state.editing !== null}
            onAdd={(kind) => { setNewKind(kind); select("new", kind); }}
          />
        </section>
      </main>
      <aside className="min-w-0">
        {preview ? (
          preview.kind === "multiple_choice" ? <ChoicePreview value={preview} index={activeIndex} total={count} /> : <ShortAnswerPreview value={preview} index={activeIndex} total={count} />
        ) : (
          <div className="space-y-4 rounded-[12px] border border-pace-line bg-white p-5">
            <h2 className="text-base font-bold">Settings</h2>
            {settings}
          </div>
        )}
      </aside>
    </div>
  );
}
