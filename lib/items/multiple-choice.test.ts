import { expect, it } from "vitest";
import { multipleChoiceScore, validateChoice } from "./multiple-choice";

it("awards all points only for the correct option", () => {
  expect(multipleChoiceScore("2", 2, 10)).toBe(10);
  expect(multipleChoiceScore("1", 2, 10)).toBe(0);
  expect(multipleChoiceScore("", 2, 10)).toBe(0);
  expect(multipleChoiceScore("02", 2, 10)).toBe(0);
});
it("rejects forged selections but accepts an unanswered Item", () => {
  expect(() => validateChoice("", ["for", "while"])).not.toThrow();
  expect(() => validateChoice("1", ["for", "while"])).not.toThrow();
  for (const value of ["-1", "2", "NaN", "01", "for"])
    expect(() => validateChoice(value, ["for", "while"])).toThrow(
      "Invalid option",
    );
});
