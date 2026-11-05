"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { reorderItems } from "@/app/actions/items/reorder-items";
import { createItem } from "@/app/actions/items/create-item";
import { updateItem } from "@/app/actions/items/update-item";
import { deleteItem } from "@/app/actions/items/delete-item";
import { readItems } from "@/app/actions/items/read-items";
import type { AnswerInput } from "./answer-editor";
import type { MultipleChoiceInput } from "@/lib/items/multiple-choice";

export type AuthoringItem = {
  id: string;
  title: string;
  kind: string;
  points: number;
  instructions: string;
  options: string[];
  correctOption: number | null;
};
export const emptyChoice: MultipleChoiceInput = {
  kind: "multiple_choice",
  title: "",
  instructions: "",
  points: 10,
  options: ["", "", "", ""],
  correctOption: -1,
};
export const emptyShortAnswer = { kind: "short_answer" as const, title: "", instructions: "", points: 10 };
export function usePostItems(
  postId: string | undefined,
  onEditingChange: (editing: boolean) => void,
  primaryId?: string,
) {
  const [items, setItems] = useState<AuthoringItem[]>([]);
  const [editing, setEditingState] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let active = true;
    if (postId)
      void readItems(postId)
        .then((result) => {
          if (!active) return;
          if (!result.success) return toast.error(result.error);
          setItems(result.items);
          setLoaded(true);
        })
        .catch(() => toast.error("Could not load Items"));
    return () => {
      active = false;
    };
  }, [postId]);
  const edit = (id: string | null) => {
    setEditingState(id);
    onEditingChange(id !== null && id !== primaryId);
  };
  const save = async (input: AnswerInput) => {
    if (!postId || busy) return;
    setBusy(true);
    try {
      const result =
        editing === "new"
          ? await createItem(postId, input)
          : await updateItem(postId, editing!, input);
      if (!result.success || !result.item) return toast.error(result.error);
      const saved = { ...input, options: result.item.options, correctOption: result.item.correctOption, id: result.item.id };
      setItems((prev) =>
        editing === "new"
          ? [...prev, saved]
          : prev.map((i) => (i.id === editing ? saved : i)),
      );
      edit(null);
      toast.success("Item saved");
      return true;
    } catch {
      toast.error("Could not save Item");
    } finally {
      setBusy(false);
    }
  };
  const remove = async () => {
    if (editing === "new") return edit(null);
    if (!postId || !editing || busy) return;
    setBusy(true);
    try {
      const result = await deleteItem(postId, editing);
      if (!result.success) return toast.error(result.error);
      setItems((prev) => prev.filter((i) => i.id !== editing));
      edit(null);
      return true;
    } catch {
      toast.error("Could not delete Item");
    } finally {
      setBusy(false);
    }
  };
  const move = async (id: string, direction: number) => {
    if (!postId || busy || editing) return;
    const index = items.findIndex((item) => item.id === id);
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const ordered = [...items];
    [ordered[index], ordered[target]] = [ordered[target], ordered[index]];
    setBusy(true);
    onEditingChange(true);
    try {
      const result = await reorderItems(postId, ordered.map((item) => item.id));
      if (result.success) setItems(ordered);
      else toast.error(result.error);
    } catch { toast.error("Could not reorder Items"); }
    finally { setBusy(false); onEditingChange(false); }
  };
  return { items, editing, busy, loaded, edit, save, remove, move };
}
