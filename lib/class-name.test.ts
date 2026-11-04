import { describe, expect, it } from "vitest";
import { composeClassName, splitClassName, splitSection } from "./class-name";

describe("splitClassName", () => {
  it("splits the code from the description on the first separator", () => {
    expect(splitClassName("CS 101 · Programming 1 · BSIT 1–1")).toEqual({
      code: "CS 101",
      description: "Programming 1 · BSIT 1–1",
    });
  });

  it("returns an empty description when there is no separator", () => {
    expect(splitClassName("CS101")).toEqual({ code: "CS101", description: "" });
  });
});

describe("composeClassName", () => {
  it("joins code and description with a separator", () => {
    expect(composeClassName(" CS 101 ", " Programming 1 ")).toBe("CS 101 · Programming 1");
  });

  it("omits the separator when description is blank", () => {
    expect(composeClassName("CS 101", " ")).toBe("CS 101");
  });
});

describe("composeClassName with a section", () => {
  it("appends the section after the course name", () => {
    expect(composeClassName("CS 101", "Programming 1", " BSIT 1–1 ")).toBe("CS 101 · Programming 1 · BSIT 1–1");
  });
});

describe("splitSection", () => {
  it("takes the last segment as the section when there are three or more", () => {
    expect(splitSection("CS 101 · Programming 1 · BSIT 1–1")).toEqual({ title: "CS 101 · Programming 1", section: "BSIT 1–1" });
  });

  it("has no section when the name has fewer than three segments", () => {
    expect(splitSection("CS 101 · Programming 1")).toEqual({ title: "CS 101 · Programming 1", section: null });
    expect(splitSection("CS101")).toEqual({ title: "CS101", section: null });
  });
});
