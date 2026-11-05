import type { ImportKind, ImportSettings, ImportedItem } from "./types";

const KINDS: ImportKind[] = ["coding", "multiple_choice", "short_answer"];

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function points(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? Math.round(value * 100) / 100
    : 10;
}

function tests(value: unknown, enabled: boolean) {
  if (!enabled || !Array.isArray(value)) return [];
  return value.flatMap((raw) => {
    const t = raw as Record<string, unknown>;
    if (typeof t?.input !== "string" || typeof t?.expectedOutput !== "string")
      return [];
    return [{
      input: t.input,
      expectedOutput: t.expectedOutput,
      visible: t.visible === true,
      fromAi: t.fromExample !== true,
    }];
  });
}

function parseItem(raw: unknown, index: number, settings: ImportSettings): ImportedItem | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const kind = r.kind as ImportKind;
  const title = text(r.title);
  if (!KINDS.includes(kind) || !title) return null;
  if (settings.kinds !== "auto" && kind !== settings.kinds) return null;
  const options = Array.isArray(r.options) ? r.options.map(text) : [];
  let correct = Number.isInteger(r.correctOption) ? (r.correctOption as number) : -1;
  let note = text(r.checkNote) || null;
  if (kind === "multiple_choice") {
    if (options.length < 2 || options.length > 20 || options.some((o) => !o)) return null;
    if (!settings.detectKeys || correct < 0 || correct >= options.length) {
      correct = 0;
      note ??= "No answer key was found. Pick the correct option.";
    }
  }
  const instructions = text(r.instructions) || (kind === "coding" ? title : "");
  return {
    key: `import-${index}-${Math.random().toString(36).slice(2, 8)}`,
    kind,
    title,
    instructions,
    points: points(r.points),
    language: kind === "coding" ? settings.language : "",
    starterCode: kind === "coding" ? text(r.starterCode) : "",
    options: kind === "multiple_choice" ? options : [],
    correctOption: kind === "multiple_choice" ? correct : -1,
    testCases: kind === "coding" ? tests(r.testCases, settings.writeTests) : [],
    fromFile: true,
    checkNote: note,
    sourceText: text(r.sourceText) || title,
  };
}

export function validateImportedItems(raw: unknown, settings: ImportSettings) {
  const list = Array.isArray(raw) ? raw : [];
  const items: ImportedItem[] = [];
  list.forEach((entry, index) => {
    const item = parseItem(entry, index, settings);
    if (item) items.push(item);
  });
  return { items, dropped: list.length - items.length };
}
