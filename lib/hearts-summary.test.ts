import { expect, it } from "vitest";
import { heartsSpentByStudent } from "./hearts-summary";
it("sums all Item spending per Student without mixing Students", () => {
  expect([...heartsSpentByStudent([
    { studentId: "a", totalSpent: 2 }, { studentId: "b", totalSpent: 4 }, { studentId: "a", totalSpent: 3 },
  ])]).toEqual([["a", 5], ["b", 4]]);
});
