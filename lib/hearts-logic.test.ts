import { describe, expect, it } from "vitest";
import { regenerateHearts } from "./hearts-logic";
const start = new Date("2026-11-05T00:00:00Z");
const state = { currentCount: 0, totalSpent: 5, lastRegenAt: start };
describe("Item heart regeneration", () => {
  it("regenerates elapsed intervals while preserving the partial interval and total spent", () => {
    expect(regenerateHearts(state, 5, 30, new Date("2026-11-05T01:17:00Z"))).toEqual({
      currentCount: 2, totalSpent: 5, lastRegenAt: new Date("2026-11-05T01:00:00Z"),
    });
  });
  it("caps the balance and starts a fresh clock when full", () => {
    const now = new Date("2026-11-05T10:00:00Z");
    expect(regenerateHearts(state, 5, 30, now)).toEqual({ currentCount: 5, totalSpent: 5, lastRegenAt: now });
  });
  it("does not regenerate early or for a future timestamp", () => {
    expect(regenerateHearts(state, 5, 30, new Date(start.getTime() + 1_799_999))).toEqual(state);
    expect(regenerateHearts(state, 5, 30, new Date(start.getTime() - 1000))).toEqual(state);
  });
  it("applies changed Post settings to each Item", () => {
    expect(regenerateHearts({ ...state, currentCount: 5 }, 3, 30, start).currentCount).toBe(3);
    expect(regenerateHearts(state, 5, 15, new Date(start.getTime() + 900_000)).currentCount).toBe(1);
  });
});
