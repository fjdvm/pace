import { describe, expect, it } from "vitest";
import { formatRelative } from "./relative-time";

const now = new Date("2026-10-18T12:00:00Z");
const ago = (ms: number) => new Date(now.getTime() - ms).toISOString();
const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

describe("formatRelative", () => {
  it.each([
    [10_000, "just now"],
    [5 * MIN, "5 minutes ago"],
    [MIN, "1 minute ago"],
    [2 * HOUR, "2 hours ago"],
    [30 * HOUR, "yesterday"],
    [3 * DAY, "3 days ago"],
  ])("formats %d ms", (elapsed, expected) => {
    expect(formatRelative(ago(elapsed), now)).toBe(expected);
  });

  it("falls back to a date after two weeks", () => {
    expect(formatRelative(ago(20 * DAY), now)).toBe("Sep 28");
  });
});
