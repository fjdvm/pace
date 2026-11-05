import { describe, expect, it } from "vitest";
import { pupilOffset } from "./pupil-offset";

describe("pupilOffset", () => {
  it("is centred when the pointer is on the mascot", () => {
    expect(pupilOffset(0, 0)).toEqual({ x: 0, y: 0 });
  });

  it("never moves more than 4px", () => {
    const { x, y } = pupilOffset(1000, -1000);
    expect(Math.hypot(x, y)).toBeCloseTo(4);
  });

  it("points toward the pointer", () => {
    const { x, y } = pupilOffset(-500, 0);
    expect(x).toBeCloseTo(-4);
    expect(y).toBeCloseTo(0);
  });
});
