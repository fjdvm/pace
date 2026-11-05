import { expect, it } from "vitest";
import { itemComplete } from "./item-completion";
it("marks an Item done only when all of its visible tests passed", () => {
  expect(itemComplete(null)).toBe(false);
  expect(itemComplete([])).toBe(false);
  expect(itemComplete([{ passed: true }, { passed: false }])).toBe(false);
  expect(itemComplete([{ passed: true }, { passed: true }])).toBe(true);
});
