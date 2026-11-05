export interface ShortAnswerInput {
  kind: "short_answer";
  title: string;
  instructions: string;
  points: number;
}

export function shortAnswerData(input: ShortAnswerInput) {
  if (typeof input.title !== "string" || !input.title.trim())
    throw new Error("Item prompt is required");
  if (typeof input.instructions !== "string") throw new Error("Invalid instructions");
  if (!Number.isFinite(input.points) || input.points < 0)
    throw new Error("Points must be a non-negative number");
  return {
    kind: "short_answer" as const,
    title: input.title.trim(), instructions: input.instructions.trim(),
    points: input.points, options: [] as string[], correctOption: null,
    language: "", starterCode: "",
  };
}
