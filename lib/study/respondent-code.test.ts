import { describe, expect, it } from "vitest";
import { makeRespondentCode } from "./respondent-code";

describe("makeRespondentCode", () => {
  it("is a short pseudonymous code with no email or name in it", () => {
    expect(makeRespondentCode(new Uint8Array([0, 1, 2, 3, 4, 5]))).toBe("R-ABCDEF");
    expect(makeRespondentCode()).toMatch(/^R-[A-Z2-9]{6}$/);
  });
});
