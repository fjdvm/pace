import { describe, expect, it } from "vitest";
import {
  buildChecklist,
  decodeLineBreaks,
  encodeLineBreaks,
  validateAssignment,
  type AssignmentFormValues,
} from "./assignment-form";

const valid: AssignmentFormValues = {
  title: "Sum of Two Numbers",
  instructions: "Print the sum.",
  language: "Python",
  dueDate: "2026-10-19T23:59",
  heartsCount: 5,
  heartsRegenMinutes: 30,
  classIds: ["c1"],
  testCases: [
    { input: "3\\n4", expectedOutput: "7", visible: true },
    { input: "-8\\n3", expectedOutput: "-5", visible: false },
  ],
};

describe("line break encoding", () => {
  it("round-trips real newlines through the escaped form", () => {
    expect(encodeLineBreaks("3\n4")).toBe("3\\n4");
    expect(decodeLineBreaks("3\\n4")).toBe("3\n4");
  });
});

describe("validateAssignment", () => {
  it("accepts a complete assignment", () => {
    expect(validateAssignment(valid)).toBeNull();
  });

  it.each([
    [{ title: " " }, "Please enter a title"],
    [{ instructions: "" }, "Please enter instructions"],
    [{ dueDate: "" }, "Please set a due date"],
    [{ classIds: [] }, "Please assign to at least one class"],
    [{ testCases: [] }, "Add at least one test case"],
    [{ testCases: [{ input: "", expectedOutput: " ", visible: true }] }, "Every test case needs an expected output"],
    [{ heartsCount: 0 }, "Hearts per student must be at least 1"],
    [{ heartsRegenMinutes: 0 }, "Cooldown must be at least 1 minute"],
  ])("rejects %j", (patch, message) => {
    expect(validateAssignment({ ...valid, ...patch })).toBe(message);
  });
});

describe("buildChecklist", () => {
  it("summarises each requirement", () => {
    const items = buildChecklist(valid, ["CS 101"]);
    expect(items).toEqual([
      { label: "Title and instructions", done: true },
      { label: "2 test cases (1 hidden)", done: true },
      { label: "Tutor: 5 hearts, 30 min", done: true },
      { label: "Assigned to CS 101", done: true },
    ]);
  });

  it("marks missing pieces as not done", () => {
    const items = buildChecklist({ ...valid, title: "", classIds: [] }, []);
    expect(items[0].done).toBe(false);
    expect(items[3]).toEqual({ label: "Choose a class", done: false });
  });
});
