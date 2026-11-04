import { describe, expect, it } from "vitest";
import { sortByDue } from "./sort-by-due";

describe("sortByDue", () => {
  it("orders soonest due first without mutating the input", () => {
    const items = [
      { id: "b", dueDate: "2026-11-20T10:00:00.000Z" },
      { id: "a", dueDate: "2026-11-06T10:00:00.000Z" },
      { id: "c", dueDate: "2026-12-01T10:00:00.000Z" },
    ];
    expect(sortByDue(items).map((i) => i.id)).toEqual(["a", "b", "c"]);
    expect(items[0].id).toBe("b");
  });
});
