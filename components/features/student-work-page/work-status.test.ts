import { describe, expect, it } from "vitest";
import type { SubmissionStudentRow } from "@/components/features/instructor/submissions/types";
import { activityTag, statusTag } from "./work-status";

const base: SubmissionStudentRow = {
  studentId: "s1",
  name: "Kim Cruz",
  email: "kim@example.com",
  status: "not-started",
  score: null,
  hearts: 0,
  flags: [],
  activity: null,
  submittedAt: null,
};
const now = new Date("2026-01-10T12:00:00Z");

describe("student work status", () => {
  it("marks submitted students as turned in", () => {
    expect(statusTag({ ...base, status: "submitted" }, "2026-01-01T00:00:00Z", now)).toEqual({ label: "Turned in", tone: "green" });
  });

  it("marks unsubmitted students missing only after the due date", () => {
    expect(statusTag(base, "2026-01-01T00:00:00Z", now).label).toBe("Missing");
    expect(statusTag(base, "2026-01-20T00:00:00Z", now).label).toBe("Assigned");
  });

  it("derives the activity tag from the behaviour flag", () => {
    expect(activityTag({ ...base, status: "submitted", activity: "High" })).toEqual({ label: "Activity: High", short: "High", tone: "red" });
    expect(activityTag({ ...base, status: "submitted", activity: null })).toBeNull();
    expect(activityTag(base)?.label).toBe("Not started");
    expect(activityTag({ ...base, status: "in-progress" })?.label).toBe("In progress");
  });
});
