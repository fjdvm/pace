import { describe, expect, it } from "vitest";
import { getPasswordRules } from "./password-rules";

describe("getPasswordRules", () => {
  it("marks every rule unmet for an empty password", () => {
    expect(getPasswordRules("").map((r) => r.met)).toEqual([false, false, false, false]);
  });

  it("marks rules met independently", () => {
    const met = (pw: string) => Object.fromEntries(getPasswordRules(pw).map((r) => [r.label, r.met]));
    expect(met("abcdefgh")).toEqual({ "8+ characters": true, Uppercase: false, Lowercase: true, Number: false });
    expect(met("ABC1")).toEqual({ "8+ characters": false, Uppercase: true, Lowercase: false, Number: true });
  });

  it("meets all rules for a strong password", () => {
    expect(getPasswordRules("Passw0rdOk").every((r) => r.met)).toBe(true);
  });
});
