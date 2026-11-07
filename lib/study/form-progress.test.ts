import { describe, expect, it } from "vitest";
import { completeState } from "./fixtures-state";
import { countAnswered, emptyState, firstOpenStep, isComplete, stepStates } from "./form-progress";
import { buildSittingForm } from "./sitting-form";

describe("sitting totals", () => {
  it.each([
    ["student", 1, 33],
    ["student", 2, 35],
    ["instructor", 1, 38],
    ["instructor", 2, 40],
  ] as const)("%s sitting %i has %i required answers", (role, sitting, total) => {
    expect(buildSittingForm(role, sitting).total).toBe(total);
  });
});

describe("countAnswered and isComplete", () => {
  const form = buildSittingForm("student", 1);

  it("counts profile answers and ratings and ignores invalid ones", () => {
    const state = emptyState();
    state.profile.yearLevel = "2nd year";
    state.profile.coursesTaken = "99";
    state.answers.P1 = 5;
    state.answers.P2 = 6;
    expect(countAnswered(form, state)).toBe(2);
    expect(isComplete(form, state)).toBe(false);
  });

  it("enables submit only when every statement is answered", () => {
    const state = completeState("student", 1);
    expect(isComplete(form, state)).toBe(true);
    delete state.answers.PEOU5;
    expect(isComplete(form, state)).toBe(false);
  });

  it("does not require the optional comments in Sitting 2", () => {
    expect(isComplete(buildSittingForm("instructor", 2), completeState("instructor", 2))).toBe(true);
  });
});

describe("stepStates", () => {
  const form = buildSittingForm("student", 1);

  it("marks the active step current and finished steps done", () => {
    const state = emptyState();
    state.profile = { yearLevel: "1st year", coursesTaken: "1", aiUsage: "Never" };
    expect(stepStates(form, state, "problems")).toEqual(["done", "current", "todo"]);
  });

  it("opens at the first unfinished step", () => {
    expect(firstOpenStep(form, emptyState())).toBe("about");
    const state = completeState("student", 1);
    delete state.answers.P3;
    expect(firstOpenStep(form, state)).toBe("problems");
  });
});
