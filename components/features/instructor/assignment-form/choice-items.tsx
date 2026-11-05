"use client";
import { ItemAuthoringRow } from "./item-authoring-row";
import { AddChoiceMenu } from "./add-choice-menu";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formControl } from "./form-field";
import { Input } from "@/components/ui/input";
import { ChoiceEditor } from "./choice-editor";
import { ChoicePreview } from "./choice-preview";
import { usePostItems, emptyChoice } from "./use-post-items";
import type { MultipleChoiceInput } from "@/lib/items/multiple-choice";
import type { useAssignmentForm } from "./use-assignment-form";
import type { ReactNode } from "react";

type Props = {
  form: ReturnType<typeof useAssignmentForm>;
  locked: boolean;
  settings: ReactNode;
  codingEditor: ReactNode;
};
export function ChoiceItems({ form, locked, settings, codingEditor }: Props) {
  const state = usePostItems(form.id, form.setItemEditing);
  const [preview, setPreview] = useState<MultipleChoiceInput | null>(null);
  const select = (id: string | null) => {
    state.edit(id);
    const item = state.items.find((i) => i.id === id);
    setPreview(
      id === "new"
        ? emptyChoice
        : item?.kind === "multiple_choice"
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
                (item.kind === "multiple_choice" ? (
                  <ChoiceEditor
                    key={item.id}
                    initial={{
                      ...item,
                      kind: "multiple_choice",
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
                "New multiple choice item",
                "multiple_choice",
                preview?.points ?? 10,
                count - 1,
              )}
              <ChoiceEditor
                initial={emptyChoice}
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
            onAdd={() => select("new")}
          />
        </section>
      </main>
      <aside className="min-w-0">
        {preview ? (
          <ChoicePreview value={preview} index={activeIndex} total={count} />
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
