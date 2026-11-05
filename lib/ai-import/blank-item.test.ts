import { expect, it } from "vitest";
import { blankItem, moveItem, totalPoints } from "./blank-item";

it("creates blank Items per kind", () => {
  expect(blankItem("multiple_choice", "Python")).toMatchObject({ options: ["", ""], fromFile: false });
  expect(blankItem("coding", "C").language).toBe("C");
  expect(blankItem("short_answer", "C").language).toBe("");
});

it("reorders within bounds and totals points", () => {
  expect(moveItem([1, 2, 3], 0, 1)).toEqual([2, 1, 3]);
  expect(moveItem([1, 2, 3], 0, -1)).toEqual([1, 2, 3]);
  expect(totalPoints([{ ...blankItem("short_answer", ""), points: 25 }, { ...blankItem("short_answer", ""), points: 10 }])).toBe(35);
});
