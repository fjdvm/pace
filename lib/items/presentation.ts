export function itemKindLabel(kind?: string) {
  return kind === "short_answer" ? "Short answer" : kind === "multiple_choice" ? "Multiple choice" : "Coding";
}

export function itemKindTone(kind?: string) {
  return kind === "short_answer" ? "amber" as const : kind === "multiple_choice" ? "green" as const : "blue" as const;
}
