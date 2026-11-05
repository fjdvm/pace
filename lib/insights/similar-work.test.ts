import { expect, it } from "vitest";
import { mostSimilarTo } from "./similar-work";

const pairs = [
  { studentAId: "a", studentBId: "b", similarity: 0.6 },
  { studentAId: "c", studentBId: "a", similarity: 0.9 },
  { studentAId: "b", studentBId: "d", similarity: 0.95 },
];
it("returns the closest classmate above 80% and nothing otherwise", () => {
  expect(mostSimilarTo(pairs, "a")).toEqual({ studentId: "c", similarity: 0.9 });
  expect(mostSimilarTo(pairs, "e")).toBeNull();
  expect(mostSimilarTo([pairs[0]], "a")).toBeNull();
});
