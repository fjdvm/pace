export function multipleChoiceScore(
  selected: string,
  correctOption: number,
  points: number,
) {
  return selected === String(correctOption) ? points : 0;
}

export function validateChoice(selected: string, options: string[]) {
  if (
    typeof selected !== "string" ||
    (selected !== "" && !options.some((_, index) => String(index) === selected))
  )
    throw new Error("Invalid option");
}

export interface MultipleChoiceInput {
  kind: "multiple_choice";
  title: string;
  instructions: string;
  points: number;
  options: string[];
  correctOption: number;
}

export function multipleChoiceData(input: MultipleChoiceInput) {
  if (!input.title?.trim()) throw new Error("Item prompt is required");
  if (!Number.isFinite(input.points) || input.points < 0)
    throw new Error("Points must be a non-negative number");
  if (
    !Array.isArray(input.options) ||
    input.options.length < 2 ||
    input.options.length > 20 ||
    input.options.some((option) => typeof option !== "string" || !option.trim())
  )
    throw new Error("Provide between 2 and 20 non-empty options");
  if (
    !Number.isInteger(input.correctOption) ||
    input.correctOption < 0 ||
    input.correctOption >= input.options.length
  )
    throw new Error("Mark one correct option");
  return {
    kind: "multiple_choice" as const,
    title: input.title.trim(),
    instructions: input.instructions?.trim() ?? "",
    points: input.points,
    options: input.options.map((option) => option.trim()),
    correctOption: input.correctOption,
    language: "",
    starterCode: "",
  };
}
