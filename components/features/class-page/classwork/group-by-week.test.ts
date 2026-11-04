import { describe, expect, it } from "vitest";
import { groupByWeek } from "./group-by-week";

describe("groupByWeek", () => {
  it("numbers occupied weeks from the earliest due date and lists the latest week first", () => {
    const groups = groupByWeek([
      { dueDate: "2026-10-05T10:00:00" },
      { dueDate: "2026-10-14T10:00:00" },
      { dueDate: "2026-10-15T10:00:00" },
    ]);
    expect(groups.map((g) => g.label)).toEqual(["Week 2", "Week 1"]);
    expect(groups[0].items).toHaveLength(2);
  });

  it("returns nothing for an empty list", () => {
    expect(groupByWeek([])).toEqual([]);
  });
});
