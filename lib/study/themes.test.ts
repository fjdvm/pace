import { describe, expect, it } from "vitest";
import { DEFAULT_THEMES, addTheme, parseCustomThemes, slugifyTheme } from "./themes";

describe("slugifyTheme", () => {
  it("makes a stable id from a label", () => {
    expect(slugifyTheme("  Wants Dark Mode! ")).toBe("wants-dark-mode");
  });
});

describe("addTheme", () => {
  it("appends a theme with the next palette tone", () => {
    const result = addTheme(DEFAULT_THEMES, "Wants dark mode");
    expect(result.error).toBeUndefined();
    expect(result.theme).toMatchObject({ id: "wants-dark-mode", label: "Wants dark mode" });
    expect(result.theme?.tone).not.toBe("neutral");
  });

  it("rejects blank, overlong and duplicate labels", () => {
    expect(addTheme(DEFAULT_THEMES, "  ").error).toBe("Enter a theme name");
    expect(addTheme(DEFAULT_THEMES, "x".repeat(61)).error).toBe("Theme names must be 60 characters or fewer");
    expect(addTheme(DEFAULT_THEMES, "faster CODE runs").error).toBe("That theme already exists");
  });
});

describe("parseCustomThemes", () => {
  it("returns only well-formed themes", () => {
    const raw = JSON.stringify([{ id: "a", label: "A", tone: "blue" }, { nope: true }, { id: "b", label: "B", tone: "bogus" }]);
    expect(parseCustomThemes(raw)).toEqual([{ id: "a", label: "A", tone: "blue" }]);
    expect(parseCustomThemes(null)).toEqual([]);
    expect(parseCustomThemes("not json")).toEqual([]);
  });
});
