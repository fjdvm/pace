import { describe, expect, it } from "vitest";
import { describeInstructorDue, isDueWithinWeek } from "./instructor-dates";

const now = new Date(2026, 9, 18, 10, 0);

describe("describeInstructorDue", () => {
  it("marks tomorrow as urgent", () => {
    expect(describeInstructorDue(new Date(2026, 9, 19, 23, 59).toISOString(), now)).toEqual({
      label: "Tomorrow",
      tone: "urgent",
    });
  });

  it("shows a short date for later dues", () => {
    expect(describeInstructorDue(new Date(2026, 9, 25, 23, 59).toISOString(), now)).toEqual({
      label: "Oct 25",
      tone: "normal",
    });
  });

  it("prefixes closed for past dues", () => {
    expect(describeInstructorDue(new Date(2026, 9, 12, 23, 59).toISOString(), now)).toEqual({
      label: "Closed Oct 12",
      tone: "closed",
    });
  });
});

describe("isDueWithinWeek", () => {
  it("includes dues in the next seven days", () => {
    expect(isDueWithinWeek(new Date(2026, 9, 22).toISOString(), now)).toBe(true);
  });

  it("excludes past and far dues", () => {
    expect(isDueWithinWeek(new Date(2026, 9, 12).toISOString(), now)).toBe(false);
    expect(isDueWithinWeek(new Date(2026, 10, 12).toISOString(), now)).toBe(false);
  });
});
