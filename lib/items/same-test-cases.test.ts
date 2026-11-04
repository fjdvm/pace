import { expect, it } from "vitest";
import { sameTestCases } from "./same-test-cases";

const visible = { input: "2\n5", expectedOutput: "7", visible: true };
const hidden = { input: "-8\n-2", expectedOutput: "-10", visible: false };
it("accepts identical tests regardless of database order or extra fields", () => {
  expect(
    sameTestCases(
      [visible, hidden],
      [hidden, { ...visible, ...{ id: "test" } }],
    ),
  ).toBe(true);
});
it.each(
  [
    [{ ...visible, input: "2 5" }],
    [{ ...visible, expectedOutput: "7 " }],
    [{ ...visible, visible: false }],
    [],
    [visible, visible],
  ].map((tests) => ({ tests })),
)("rejects changed test configuration: $tests", ({ tests }) => {
  expect(sameTestCases([visible], tests)).toBe(false);
});
it("preserves the count of duplicate tests", () => {
  expect(
    sameTestCases([visible, visible, hidden], [visible, hidden, hidden]),
  ).toBe(false);
});
