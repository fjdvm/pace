import { describe, expect, it } from "vitest";
import { deriveItemStatus, itemStatusLabel, startLabel, workStatusLabel } from "./item-status";

describe("item status", () => {
  it("derives status from submission and draft", () => {
    expect(deriveItemStatus(true, true)).toBe("submitted");
    expect(deriveItemStatus(false, true)).toBe("in-progress");
    expect(deriveItemStatus(false, false)).toBe("not-started");
  });

  it("labels the work status", () => {
    expect(workStatusLabel([{ status: "not-started" }])).toBe("Assigned");
    expect(workStatusLabel([{ status: "in-progress" }])).toBe("In progress");
    expect(workStatusLabel([{ status: "submitted" }])).toBe("Submitted");
  });

  it("labels the start button for any number of items", () => {
    expect(startLabel([{ status: "not-started" }])).toBe("Start item 1");
    expect(startLabel([{ status: "submitted" }, { status: "in-progress" }])).toBe("Continue item 2");
    expect(startLabel([{ status: "submitted" }])).toBe("Review item 1");
    expect(itemStatusLabel("in-progress")).toBe("in progress");
  });
});
