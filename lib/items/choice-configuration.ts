type Configuration = { id: string; kind?: string; points?: number; options?: string[]; correctOption?: number | null };

export function assertChoiceConfiguration(previous: Configuration[], current: Configuration[]) {
  const signature = (items: Configuration[]) => JSON.stringify(items.map((item) => [
    item.id, item.kind ?? "coding", item.points,
    item.kind === "multiple_choice" ? item.options : null,
    item.kind === "multiple_choice" ? item.correctOption : null,
  ]));
  if (signature(previous) !== signature(current))
    throw new Error("Items changed. Reload the Post before saving or turning in.");
}
