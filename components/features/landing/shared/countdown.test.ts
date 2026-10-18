import { describe, expect, it } from "vitest";
import { formatCountdown, tickCountdown } from "./countdown";

describe("formatCountdown", () => {
  it("pads minutes and seconds", () => {
    expect(formatCountdown(435)).toBe("07:15");
    expect(formatCountdown(9)).toBe("00:09");
  });

  it("clamps negatives to zero", () => {
    expect(formatCountdown(-4)).toBe("00:00");
  });
});

describe("tickCountdown", () => {
  it("counts down by one second", () => {
    expect(tickCountdown(435, 1800)).toBe(434);
  });

  it("resets when it reaches zero", () => {
    expect(tickCountdown(1, 1800)).toBe(1800);
  });
});
