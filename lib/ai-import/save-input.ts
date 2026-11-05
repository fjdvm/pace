import { codingItemData } from "@/lib/items/input";
import { multipleChoiceData } from "@/lib/items/multiple-choice";
import { shortAnswerData } from "@/lib/items/short-answer";
import type { ImportedItem } from "./types";

export interface SaveImportInput {
  classId: string;
  title: string;
  instructions: string;
  assign: boolean;
  items: ImportedItem[];
}

export function itemRecord(item: ImportedItem) {
  if (item.kind === "multiple_choice")
    return multipleChoiceData({ kind: "multiple_choice", title: item.title, instructions: item.instructions, points: item.points, options: item.options, correctOption: item.correctOption });
  if (item.kind === "short_answer")
    return shortAnswerData({ kind: "short_answer", title: item.title, instructions: item.instructions, points: item.points });
  return codingItemData({ title: item.title, instructions: item.instructions || item.title, language: item.language, starterCode: item.starterCode, points: item.points });
}

export function validateSaveInput(input: SaveImportInput) {
  if (!input.title.trim()) throw new Error("Please enter a title");
  if (!input.items.length) throw new Error("Add at least one Item");
  if (input.assign && input.items.some((i) => i.kind === "coding" && !i.instructions.trim()))
    throw new Error("Every coding Item needs instructions");
  return input.items.map((item) => ({ item, data: itemRecord(item) }));
}
