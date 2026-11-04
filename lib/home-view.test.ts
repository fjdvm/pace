import { describe, expect, it } from "vitest";
import { resolveHomeView } from "./home-view";

describe("resolveHomeView", () => {
  it("defaults to Enrolled when the user has both", () => {
    expect(resolveHomeView(null, null, true, true)).toBe("Enrolled");
  });

  it("restores the saved view when the URL has no tab", () => {
    expect(resolveHomeView(null, "teaching", true, true)).toBe("Teaching");
    expect(resolveHomeView(null, "enrolled", true, true)).toBe("Enrolled");
  });

  it("lets the URL override the saved view", () => {
    expect(resolveHomeView("enrolled", "teaching", true, true)).toBe("Enrolled");
  });

  it("falls back to the only list that exists", () => {
    expect(resolveHomeView("enrolled", "enrolled", true, false)).toBe("Teaching");
    expect(resolveHomeView(null, null, false, true)).toBe("Enrolled");
  });
});
