export type TestCaseForm = {
  input: string;
  expectedOutput: string;
  visible: boolean;
};

export type AssignmentFormValues = {
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
  if (!values.instructions.trim()) return "Please enter instructions";
  if (!values.dueDate || Number.isNaN(new Date(values.dueDate).getTime())) return "Please set a valid due date";
  if (!LANGUAGES.includes(values.language)) return "Choose a supported language";
  if (values.heartsCount < 1) return "Hearts per student must be at least 1";
  if (values.heartsRegenMinutes < 1) return "Cooldown must be at least 1 minute";
  if (values.classIds.length === 0) return "Please assign to at least one class";
  if (values.testCases.length === 0) return "Add at least one test case";
  if (values.testCases.some((tc) => !tc.expectedOutput.trim())) return "Every test case needs an expected output";
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
