import { describe, expect, it } from "vitest";
import type { StudentAssignment } from "@/components/features/student/types";
import { groupAssigned, tabOf } from "./group-todos";

const now = new Date(2026, 9, 14, 12);

function item(id: string, due: Date, status: StudentAssignment["status"] = "not started"): StudentAssignment {
  return {
    id,
    title: id,
    language: "python",
    dueDate: due.toISOString(),
    status,
    classId: "c1",
    className: "CS 101 · Programming 1",
    classIndex: 0,
    heartsLeft: 3,
    heartsMax: 3,
    score: null,
    submittedAt: null,
  };
}

describe("tabOf", () => {
  it("puts submitted work in done, past-due unsubmitted work in missing, the rest in assigned", () => {
    expect(tabOf(item("a", new Date(2026, 9, 10), "submitted"), now)).toBe("done");
    expect(tabOf(item("b", new Date(2026, 9, 10)), now)).toBe("missing");
    expect(tabOf(item("c", new Date(2026, 9, 15)), now)).toBe("assigned");
  });
});

describe("groupAssigned", () => {
  it("groups by calendar week from the due date, soonest first", () => {
    const sunday = item("sun", new Date(2026, 9, 18, 23, 59));
    const tomorrow = item("tue", new Date(2026, 9, 15, 9));
    const nextMonday = item("mon", new Date(2026, 9, 19, 9));
    const nextSunday = item("nextsun", new Date(2026, 9, 25, 23, 59));
    const later = item("later", new Date(2026, 9, 26, 9));
    const groups = groupAssigned([later, sunday, nextSunday, nextMonday, tomorrow], now);
    expect(groups.thisWeek.map((a) => a.id)).toEqual(["tue", "sun"]);
    expect(groups.nextWeek.map((a) => a.id)).toEqual(["mon", "nextsun"]);
    expect(groups.later.map((a) => a.id)).toEqual(["later"]);
  });
});

it("keeps Turned in, Graded and Returned work Done, and unsubmitted overdue work Missing", () => {
  for (const submissionStatus of ["turned_in", "graded", "returned"] as const) {
    expect(tabOf({ ...item("post", new Date(2026, 9, 10)), submissionStatus }, now)).toBe("done");
  }
  expect(tabOf({ ...item("post", new Date(2026, 9, 10), "in progress"), submissionStatus: null }, now)).toBe("missing");
});
