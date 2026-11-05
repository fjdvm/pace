import { expect, it } from "vitest";
import { postScore, validateAnswers } from "./answers";
it("requires exactly one answer per Item and orders them by the Post", () => {
  const a = { itemId: "one", code: "" },
    b = { itemId: "two", code: "print(2)" };
  expect(validateAnswers(["one", "two"], [b, a])).toEqual([a, b]);
  for (const answers of [[a], [a, a], [a, { ...b, itemId: "foreign" }]]) {
    expect(() => validateAnswers(["one", "two"], answers)).toThrow(
      "exactly one",
    );
  }
});
it("weights the Post grade by Item points", () => {
  expect(
    postScore([
      { points: 30, score: 100 },
      { points: 70, score: 50 },
    ]),
  ).toBe(65);
  expect(postScore([{ points: 0, score: 100 }])).toBe(0);
});
