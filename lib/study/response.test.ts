import { describe, expect, it } from "vitest";
import { completeState } from "./fixtures-state";
import { parseSubmission } from "./response";

const submit = (patch: Record<string, unknown> = {}, submitted: number[] = []) =>
  parseSubmission({ role: "student", sitting: 1, state: completeState("student", 1), ...patch }, submitted);

describe("parseSubmission", () => {
  it("keys each answer by item code with its Setup", () => {
    const result = submit();
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.answers.P1).toEqual({ setup: "current", value: 4 });
    expect(result.value.profile.yearLevel).toBe("1st year");
  });

  it("rates PACE in Sitting 2 and trims optional comments", () => {
    const state = { ...completeState("instructor", 2), comments: { helpful: "  Hints  ", problems: "", improve: "" } };
    const result = parseSubmission({ role: "instructor", sitting: 2, state }, [1]);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.answers.F5).toEqual({ setup: "pace", value: 4 });
    expect(Object.keys(result.value.answers)).toHaveLength(40);
    expect(result.value.comments).toEqual({ helpful: "Hints" });
  });

  it("refuses an incomplete Sitting", () => {
    const state = completeState("student", 1);
    delete state.answers.BI3;
    expect(submit({ state })).toEqual({ ok: false, error: "Answer every statement before submitting" });
  });

  it("refuses a Sitting that was already submitted", () => {
    expect(submit({}, [1])).toEqual({
      ok: false,
      error: "This Sitting was already submitted and can no longer be changed",
    });
    expect(submit({ sitting: 2, state: completeState("student", 2) }, [2]).ok).toBe(false);
  });

  it.each([
    [{ role: "teacher" }, "Choose student or instructor"],
    [{ sitting: 3 }, "Choose Sitting 1 or Sitting 2"],
  ])("rejects %j", (patch, error) => {
    expect(submit(patch)).toEqual({ ok: false, error });
  });

  it("rejects over-long comments", () => {
    const state = { ...completeState("student", 2), comments: { helpful: "x".repeat(1001) } };
    expect(parseSubmission({ role: "student", sitting: 2, state }, [])).toEqual({
      ok: false,
      error: "Comments must be 1000 characters or fewer",
    });
  });

  it("drops unknown codes and invalid values from the state", () => {
    const state = { ...completeState("student", 1), answers: { ...completeState("student", 1).answers, ZZ9: 3, P1: 9 } };
    expect(submit({ state })).toEqual({ ok: false, error: "Answer every statement before submitting" });
  });
});
