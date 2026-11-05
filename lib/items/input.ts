export interface CodingItemInput {
  title: string;
  instructions: string;
  language: string;
  starterCode?: string;
  points: number;
  kind?: string;
  testCases?: { input: string; expectedOutput: string; visible: boolean }[];
}

export function codingItemData(input: CodingItemInput) {
  if (!input || typeof input.title !== "string" || !input.title.trim()) throw new Error("Item title is required");
  if (typeof input.instructions !== "string" || !input.instructions.trim()) throw new Error("Item instructions are required");
  if (!["Python", "C", "JavaScript", "C#"].includes(input.language)) throw new Error("Unsupported language");
  if (input.kind !== undefined && input.kind !== "coding") throw new Error("Only coding Items are supported");
  if (!Number.isFinite(input.points) || input.points < 0) throw new Error("Points must be a non-negative number");
  if (input.starterCode !== undefined && typeof input.starterCode !== "string") throw new Error("Invalid starter code");
  if (input.testCases !== undefined && (!Array.isArray(input.testCases) || input.testCases.some((tc) =>
    !tc || typeof tc.input !== "string" || typeof tc.expectedOutput !== "string" || typeof tc.visible !== "boolean"
  ))) throw new Error("Invalid test cases");
  return {
    title: input.title.trim(), instructions: input.instructions.trim(), language: input.language,
    options: [] as string[], correctOption: null,
    starterCode: input.starterCode ?? "", points: input.points, kind: "coding" as const,
  };
}
