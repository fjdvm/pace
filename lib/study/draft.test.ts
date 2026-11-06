import { describe, expect, it } from "vitest";
import { parseDraft } from "./draft";

describe("parseDraft", () => {
  it("keeps valid answers and drops anything else", () => {
    const result = parseDraft("student", 1, { profile: { yearLevel: "3rd year", x: "y" }, answers: { P1: 3, P2: 0, Q9: 2 } }, []);
    expect(result).toEqual({
      ok: true,
      value: { role: "student", sitting: 1, state: { profile: { yearLevel: "3rd year" }, answers: { P1: 3 }, comments: {} } },
    });
  });

  it("keeps comments only for Sitting 2", () => {
    const raw = { comments: { helpful: "ok" } };
    const first = parseDraft("student", 1, raw, []);
    const second = parseDraft("student", 2, raw, [1]);
    expect(first.ok && first.value.state.comments).toEqual({});
    expect(second.ok && second.value.state.comments).toEqual({ helpful: "ok" });
  });

  it("locks a Sitting once it is submitted", () => {
    expect(parseDraft("student", 2, {}, [2]).ok).toBe(false);
  });

  it("survives garbage", () => {
    expect(parseDraft("instructor", 2, "nope", []).ok).toBe(true);
  });
});
