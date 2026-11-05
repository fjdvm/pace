"use client";
import { useState } from "react";
import { blankItem, moveItem } from "@/lib/ai-import/blank-item";
import type { ExtractedDraft, ImportKind, ImportedItem } from "@/lib/ai-import/types";

export function useReviewDraft() {
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [items, setItems] = useState<ImportedItem[]>([]);
  const [fileName, setFileName] = useState("");
  const [pages, setPages] = useState<number | null>(null);
  const [dropped, setDropped] = useState(0);
  const [open, setOpen] = useState<string | null>(null);

  const load = (draft: ExtractedDraft) => {
    setTitle((t) => t || draft.title);
    setInstructions((i) => i || draft.instructions);
    setItems((prev) => [...prev, ...draft.items]);
    setFileName(draft.fileName);
    setPages(draft.pages);
    setDropped(draft.dropped);
    setOpen(draft.items.find((i) => i.checkNote)?.key ?? null);
  };
  const update = (key: string, patch: Partial<ImportedItem>) =>
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, ...patch } : i)));
  const remove = (key: string) => setItems((prev) => prev.filter((i) => i.key !== key));
  const move = (key: string, direction: number) =>
    setItems((prev) => moveItem(prev, prev.findIndex((i) => i.key === key), direction));
  const dropFromFile = () => setItems((prev) => prev.filter((i) => !i.fromFile));
  const add = (kind: ImportKind, language: string) => {
    const item = blankItem(kind, language);
    setItems((prev) => [...prev, item]);
    setOpen(item.key);
  };
  return { title, setTitle, instructions, setInstructions, items, fileName, pages, dropped, open, setOpen, load, update, remove, move, add, dropFromFile };
}

export type ReviewDraft = ReturnType<typeof useReviewDraft>;
