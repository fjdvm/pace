import { describe, expect, it } from "vitest";
import { aboutYouComplete, countAnswered, emptyAnswers, stepStates } from "./form-progress";

describe("countAnswered", () => {
  it("counts non-null ratings across constructs", () => {
    const answers = emptyAnswers();
    answers.PU[0] = 5;
    answers.BI[4] = 1;
    expect(countAnswered(answers)).toBe(2);
    expect(countAnswered(emptyAnswers())).toBe(0);
  });
});

describe("aboutYouComplete", () => {
  it("needs year level and courses for students", () => {
    expect(aboutYouComplete("student", { yearLevel: "", coursesTaken: "", aiUsage: "never" })).toBe(false);
    expect(aboutYouComplete("student", { yearLevel: "2nd year", coursesTaken: "3", aiUsage: "never" })).toBe(true);
  });

  it("only needs AI usage for instructors", () => {
    expect(aboutYouComplete("instructor", { yearLevel: "", coursesTaken: "", aiUsage: "often" })).toBe(true);
    expect(aboutYouComplete("instructor", { yearLevel: "", coursesTaken: "", aiUsage: "" })).toBe(false);
  });
});

describe("stepStates", () => {
  it("moves the current step forward as sections complete", () => {
    expect(stepStates(false, 0, 20)).toEqual(["current", "todo", "todo"]);
    expect(stepStates(true, 5, 20)).toEqual(["done", "current", "todo"]);
    expect(stepStates(true, 20, 20)).toEqual(["done", "done", "current"]);
  });
});
