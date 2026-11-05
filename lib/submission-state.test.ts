import { expect, it } from "vitest";
import { isLate, studentGrade, validateGrade } from "./submission-state";

it("derives Late from the turn-in time, including the exact deadline", () => {
  const due = new Date("2026-11-05T12:00:00Z");
  expect(isLate(due, new Date("2026-11-05T12:00:00Z"))).toBe(false);
  expect(isLate(due, new Date("2026-11-05T12:00:01Z"))).toBe(true);
});
it("only discloses a Returned grade and feedback to the Student", () => {
  for (const status of ["turned_in", "graded"] as const)
    expect(
      studentGrade({ status, finalGrade: 75, feedback: "Private draft" }),
    ).toEqual({ grade: null, feedback: null });
  expect(
    studentGrade({ status: "returned", finalGrade: 75, feedback: "Good work" }),
  ).toEqual({ grade: 75, feedback: "Good work" });
});
it("rejects invalid grades and an ungraded Short answer before return", () => {
  expect(() =>
    validateGrade(
      [{ itemId: "one", kind: "short_answer", points: 20 }],
      [],
      null,
      true,
    ),
  ).toThrow("Short answer");
  expect(() =>
    validateGrade(
      [{ itemId: "one", kind: "coding", points: 20 }],
      [{ itemId: "one", grade: 21 }],
      null,
      false,
    ),
  ).toThrow();
  expect(
    validateGrade(
      [{ itemId: "one", kind: "coding", points: 20 }],
      [{ itemId: "one", grade: 15 }],
      null,
      true,
    ),
  ).toBe(15);
});
