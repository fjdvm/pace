import { describe, expect, it } from "vitest";
import { CLASS_COLOURS, classColour } from "./class-colour";

describe("classColour", () => {
  it("returns the same colour for the same class id", () => {
    expect(classColour("a1b2c3")).toBe(classColour("a1b2c3"));
  });

  it("always returns a colour from the palette", () => {
    for (const id of ["a", "b", "c", "d", "e", "f", "11111111-2222-3333-4444-555555555555", ""]) {
      expect(CLASS_COLOURS).toContain(classColour(id));
    }
  });

  it("spreads different ids across the palette", () => {
    const ids = Array.from({ length: 60 }, (_, index) => `class-${index}`);
    const used = new Set(ids.map(classColour));
    expect(used.size).toBe(CLASS_COLOURS.length);
  });
});
