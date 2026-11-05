import { expect, it } from "vitest";
import { multipleChoiceData, multipleChoiceScore, validateChoice } from "./multiple-choice";

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

const validItem = { kind: "multiple_choice" as const, title: "Which loop?", instructions: "", points: 10, options: ["for", "do-while"], correctOption: 1 };
it.each([
  { options: ["only"] }, { options: ["for", " "] },
  { options: Array.from({ length: 21 }, () => "option") },
  { correctOption: -1 }, { correctOption: 2 }, { correctOption: 0.5 },
  { points: -1 }, { points: Infinity }, { points: NaN }, { title: " " },
])("rejects invalid authoring input: %j", (change) => {
  expect(() => multipleChoiceData({ ...validItem, ...change })).toThrow();
});
it("normalizes prompt and options without moving the correct option", () => {
  expect(multipleChoiceData({ ...validItem, title: " Which loop? ", options: [" for ", " do-while "] })).toMatchObject({ title: "Which loop?", options: ["for", "do-while"], correctOption: 1 });
});
