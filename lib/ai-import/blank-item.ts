import type { ImportKind, ImportedItem } from "./types";

export function blankItem(kind: ImportKind, language: string): ImportedItem {
  return {
    key: `new-${Math.random().toString(36).slice(2, 10)}`,
    kind,
    title: "",
    instructions: "",
    points: 10,
    language: kind === "coding" ? language : "",
    starterCode: "",
    options: kind === "multiple_choice" ? ["", ""] : [],
    correctOption: kind === "multiple_choice" ? 0 : -1,
    testCases: [],
    fromFile: false,
    checkNote: null,
    sourceText: "",
  };
}

export function moveItem<T>(list: T[], index: number, direction: number) {
  const target = index + direction;
  if (index < 0 || target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function totalPoints(items: ImportedItem[]) {
  return items.reduce((sum, item) => sum + (Number.isFinite(item.points) ? item.points : 0), 0);
}
