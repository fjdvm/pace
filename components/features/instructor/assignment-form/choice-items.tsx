"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createItem } from "@/app/actions/items/create-item";
import { updateItem } from "@/app/actions/items/update-item";
import { deleteItem } from "@/app/actions/items/delete-item";
import { readItems } from "@/app/actions/items/read-items";
import type { MultipleChoiceInput } from "@/lib/items/multiple-choice";
import { ChoiceEditor } from "./choice-editor";

type Choice = MultipleChoiceInput & { id: string };
const empty: MultipleChoiceInput = {
  kind: "multiple_choice",
  title: "",
  instructions: "",
  points: 10,
  options: ["", "", "", ""],
  correctOption: -1,
};
export function ChoiceItems({
  postId,
  locked,
  onEditingChange,
}: {
  postId?: string;
  locked: boolean;
  onEditingChange?: (editing: boolean) => void;
}) {
  const [items, setItems] = useState<Choice[]>([]);
  const [editing, setEditingState] = useState<string | null>(null);
  const setEditing = (id: string | null) => {
    setEditingState(id);
    onEditingChange?.(id !== null);
  };
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let active = true;
    if (postId)
      void readItems(postId)
        .then((result) => {
          if (!active) return;
          if (!result.success) {
            toast.error(result.error);
            return;
          }
          setItems(
            (result.items ?? [])
              .filter((i) => i.kind === "multiple_choice")
              .map((i) => ({
                ...i,
                kind: "multiple_choice",
                correctOption: i.correctOption ?? -1,
              })),
          );
          setLoaded(true);
        })
        .catch(() => toast.error("Could not load Items"));
    return () => {
      active = false;
    };
  }, [postId]);
  const save = async (input: MultipleChoiceInput) => {
    if (!postId || busy) return;
    setBusy(true);
    try {
      const result =
        editing === "new"
          ? await createItem(postId, input)
          : await updateItem(postId, editing!, input);
      if (!result.success || !result.item) return toast.error(result.error);
      const saved = { ...input, id: result.item.id };
      setItems((prev) =>
        editing === "new"
          ? [...prev, saved]
          : prev.map((i) => (i.id === editing ? saved : i)),
      );
      setEditing(null);
      toast.success("Item saved");
    } catch {
      toast.error("Could not save Item");
    } finally {
      setBusy(false);
    }
  };
  const remove = async () => {
    if (editing === "new") return setEditing(null);
    if (!postId || !editing || busy) return;
    setBusy(true);
    try {
      const result = await deleteItem(postId, editing);
      if (!result.success) return toast.error(result.error);
      setItems((prev) => prev.filter((i) => i.id !== editing));
      setEditing(null);
    } catch {
      toast.error("Could not delete Item");
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="space-y-4" aria-label="Multiple-choice Items">
      {items.map((item) =>
        editing === item.id ? (
          <ChoiceEditor
            key={item.id}
            initial={item}
            locked={locked}
            busy={busy}
            onSave={save}
            onDelete={remove}
          />
        ) : (
          <Button
            key={item.id}
            variant="outline"
            onClick={() => setEditing(item.id)}
            disabled={busy || editing !== null}
            className="h-auto w-full justify-between whitespace-normal rounded-xl border-pace-line bg-white p-4 text-left"
          >
            <span>{item.title}</span>
            <span className="text-xs text-pace-green-deep">
              Multiple choice · {item.points} pts
            </span>
          </Button>
        ),
      )}
      {editing === "new" && (
        <ChoiceEditor
          initial={empty}
          locked={false}
          busy={busy}
          onSave={save}
          onDelete={remove}
        />
      )}
      <div className="flex justify-center rounded-xl border border-dashed border-pace-line-strong p-4">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                disabled={!postId || !loaded || busy || editing !== null}
                className="rounded-full bg-white"
              />
            }
          >
            + Add item
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setEditing("new")}>
              <span>
                <b className="block">Multiple choice</b>
                <span className="text-xs text-pace-muted">
                  Options with one correct answer
                </span>
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {!postId && (
        <p className="text-center text-[13px] text-pace-muted">
          Save this Post as a draft to add multiple-choice Items.
        </p>
      )}
      {items.length > 0 && (
        <p className="text-[13px] text-pace-muted">
          {items.length} multiple-choice Items ·{" "}
          {items.reduce((sum, i) => sum + i.points, 0)} points
        </p>
      )}
    </section>
  );
}
