import { expect, it } from "vitest";
import { validateImportedItems } from "./validate-items";
import type { ImportSettings } from "./types";

const settings: ImportSettings = { language: "Python", kinds: "auto", writeTests: true, detectKeys: true };

it("keeps well-formed Items and drops malformed ones", () => {
  const { items, dropped } = validateImportedItems([
    { kind: "coding", title: "Print", instructions: "Print 1..N", points: 25, testCases: [{ input: "3", expectedOutput: "1\n2\n3", visible: true, fromExample: true }, { input: 1 }] },
    { kind: "multiple_choice", title: "Which?", options: ["a"], correctOption: 0 },
    { kind: "essay", title: "x" },
    { kind: "short_answer", title: "" },
    null,
    { kind: "short_answer", title: "Explain", instructions: "", points: -3 },
  ], settings);
  expect(items.map((i) => i.kind)).toEqual(["coding", "short_answer"]);
  expect(items[0].testCases).toEqual([{ input: "3", expectedOutput: "1\n2\n3", visible: true, fromAi: false }]);
  expect(items[1].points).toBe(10);
  expect(dropped).toBe(4);
});

it("flags a multiple choice Item without a usable key", () => {
  const raw = [{ kind: "multiple_choice", title: "Q", options: ["a", "b"], correctOption: -1 }];
  expect(validateImportedItems(raw, settings).items[0]).toMatchObject({ correctOption: 0, checkNote: expect.any(String) });
  const keyed = [{ kind: "multiple_choice", title: "Q", options: ["a", "b"], correctOption: 1 }];
  expect(validateImportedItems(keyed, settings).items[0]).toMatchObject({ correctOption: 1, checkNote: null });
  expect(validateImportedItems(keyed, { ...settings, detectKeys: false }).items[0].checkNote).toBeTruthy();
});

it("skips test cases when the Instructor turned them off and respects a fixed kind", () => {
  const raw = [
    { kind: "coding", title: "A", instructions: "A", testCases: [{ input: "1", expectedOutput: "1", visible: true }] },
    { kind: "short_answer", title: "B" },
  ];
  const { items, dropped } = validateImportedItems(raw, { ...settings, kinds: "coding", writeTests: false });
  expect(items).toHaveLength(1);
  expect(items[0].testCases).toEqual([]);
  expect(dropped).toBe(1);
});
