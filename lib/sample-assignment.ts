import type { AssignmentFormValues } from "./assignment-form";

const pad = (n: number) => String(n).padStart(2, "0");

export function defaultDueDate(daysAhead = 7) {
  const due = new Date();
  due.setDate(due.getDate() + daysAhead);
  due.setHours(23, 59, 0, 0);
  return `${due.getFullYear()}-${pad(due.getMonth() + 1)}-${pad(due.getDate())}T${pad(due.getHours())}:${pad(due.getMinutes())}`;
}

export function sampleAssignment(): Omit<AssignmentFormValues, "classIds"> {
  return {
    title: "Sum of Two Numbers",
    instructions:
      "Read two whole numbers, one per line, and print their sum.\nExample: input 3 and 4 → output 7",
    language: "Python",
    dueDate: defaultDueDate(),
    heartsCount: 5,
    heartsRegenMinutes: 30,
    testCases: [
      { input: "3\\n4", expectedOutput: "7", visible: true },
      { input: "10\\n5", expectedOutput: "15", visible: true },
      { input: "0\\n0", expectedOutput: "0", visible: true },
      { input: "-8\\n3", expectedOutput: "-5", visible: false },
      { input: "1000000\\n1", expectedOutput: "1000001", visible: false },
    ],
  };
}

export function emptyAssignment(): AssignmentFormValues {
  return {
    title: "",
    instructions: "",
    language: "Python",
    dueDate: defaultDueDate(),
    heartsCount: 5,
    heartsRegenMinutes: 30,
    classIds: [],
    testCases: [{ input: "", expectedOutput: "", visible: true }],
  };
}
