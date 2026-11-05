import { expect, it } from "vitest";
import { workspaceEntry } from "./workspace-entry";
it("opens a single Item directly", () => {
  expect(workspaceEntry([{ id: "one" }])).toEqual({
    activeId: "one",
    overview: false,
  });
});
it("opens Overview for several Items, preserving stored order", () => {
  expect(workspaceEntry([{ id: "two" }, { id: "one" }])).toEqual({
    activeId: "two",
    overview: true,
  });
});
it("opens an explicit Item and handles invalid links", () => {
  const items = [{ id: "two" }, { id: "one" }];
  expect(workspaceEntry(items, "one")).toEqual({
    activeId: "one",
    overview: false,
  });
  expect(workspaceEntry(items, "foreign").overview).toBe(true);
});
