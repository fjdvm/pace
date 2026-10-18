import { describe, expect, it } from "vitest";
import { composeClassName, splitClassName } from "./class-name";

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
