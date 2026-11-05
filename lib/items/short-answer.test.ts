import { expect, it } from "vitest";
import { shortAnswerData } from "./short-answer";
const input = { kind: "short_answer" as const, title: " Explain a loop ", instructions: "", points: 10 };
it("normalizes a manually graded prompt without an answer key", () => {
  expect(shortAnswerData(input)).toEqual({ ...input, title: "Explain a loop", options: [], correctOption: null, language: "", starterCode: "" });
});
it.each([{ title: " " }, { title: 3 }, { instructions: null }, { points: -1 }, { points: Infinity }, { points: NaN }])("rejects invalid prompt data %j", (invalid) => {
  expect(() => shortAnswerData({ ...input, ...invalid } as typeof input)).toThrow();
});
