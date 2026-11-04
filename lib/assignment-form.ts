export type TestCaseForm = {
  input: string;
  expectedOutput: string;
  visible: boolean;
};

export type AssignmentFormValues = {
  label?: "Assignment" | "Activity" | "Quiz";
  isDraft?: boolean;
  itemTitle?: string;
  itemInstructions?: string;
  starterCode?: string;
  points?: number;
  title: string;
  instructions: string;
  language: string;
  dueDate: string;
  heartsCount: number;
  heartsRegenMinutes: number;
  classIds: string[];
  testCases: TestCaseForm[];
};

export const LANGUAGES = ["Python", "C", "JavaScript", "C#"];

export function encodeLineBreaks(value: string) {
  return value.replace(/\r?\n/g, "\\n");
}

export function decodeLineBreaks(value: string) {
  return value.replace(/\\n/g, "\n");
}

export function validateAssignment(values: AssignmentFormValues) {
  if (!values.title.trim()) return "Please enter a title";
  if (values.itemTitle !== undefined && !values.itemTitle.trim()) return "Item title is required";
  if (!values.isDraft && values.itemInstructions !== undefined && !values.itemInstructions.trim()) return "Item instructions are required";
  if (values.label !== undefined && !["Assignment", "Activity", "Quiz"].includes(values.label)) return "Invalid Label";
  if (values.isDraft !== undefined && typeof values.isDraft !== "boolean") return "Invalid Draft flag";
  if (values.starterCode !== undefined && typeof values.starterCode !== "string") return "Invalid starter code";
  if (values.points !== undefined && (!Number.isFinite(values.points) || values.points < 0)) return "Points must be a non-negative number";
  if (!values.isDraft && !values.instructions.trim()) return "Please enter instructions";
  if (!values.dueDate || Number.isNaN(new Date(values.dueDate).getTime())) return "Please set a valid due date";
  if (!LANGUAGES.includes(values.language)) return "Choose a supported language";
  if (!Number.isInteger(values.heartsCount) || values.heartsCount < 1) return "Hearts per student must be at least 1";
  if (!Number.isInteger(values.heartsRegenMinutes) || values.heartsRegenMinutes < 1) return "Cooldown must be at least 1 minute";
  if (values.classIds.length === 0) return "Please assign to at least one class";
  if (new Set(values.classIds).size !== values.classIds.length) return "Choose each Class once";
  if (values.testCases.some((tc) => typeof tc.input !== "string" || typeof tc.expectedOutput !== "string" || typeof tc.visible !== "boolean")) return "Invalid test cases";
  if (!values.isDraft && values.testCases.length === 0) return "Add at least one test case";
  if (!values.isDraft && values.testCases.some((tc) => !tc.expectedOutput.trim())) return "Every test case needs an expected output";
  return null;
}

export function buildChecklist(values: AssignmentFormValues, classCodes: string[]) {
  const hidden = values.testCases.filter((tc) => !tc.visible).length;
  const count = values.testCases.length;
  return [
    { label: "Title and instructions", done: !!values.title.trim() && !!values.instructions.trim() },
    {
      label: `${count} test ${count === 1 ? "case" : "cases"} (${hidden} hidden)`,
      done: count > 0 && values.testCases.every((tc) => tc.expectedOutput.trim()),
    },
    { label: `Tutor: ${values.heartsCount} hearts, ${values.heartsRegenMinutes} min`, done: true },
    classCodes.length > 0
      ? { label: `Assigned to ${classCodes.join(", ")}`, done: true }
      : { label: "Choose a class", done: false },
  ];
}
