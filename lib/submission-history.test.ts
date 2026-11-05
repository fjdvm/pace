import { beforeEach, expect, it, vi } from "vitest";
const db = vi.hoisted(() => ({
  assignmentClass: { findMany: vi.fn() },
  submissionRevision: { findMany: vi.fn() },
}));
vi.mock("@/lib/prisma", () => ({ prisma: db }));
import { getSubmissionHistory } from "./submission-history";
beforeEach(() => vi.clearAllMocks());
it("retains previous answers and activity for the Class's Instructor", async () => {
  db.assignmentClass.findMany.mockResolvedValue([
    { class: { instructorId: "instructor" } },
  ]);
  const snapshot = {
    code: "print(7)",
    behavioralSignals: { pasteLength: 74 },
    submittedAt: "2026-11-05T10:00:00Z",
    answers: [{ code: "print(7)", testResults: [{ passed: true }] }],
  };
  db.submissionRevision.findMany.mockResolvedValue([
    { id: "prior", snapshot, withdrawnAt: new Date("2026-11-05T11:00:00Z") },
  ]);
  expect(await getSubmissionHistory("post", "student", "instructor")).toEqual([
    { id: "prior", snapshot, withdrawnAt: "2026-11-05T11:00:00.000Z" },
  ]);
});
it("does not expose retained evidence to Students or other Instructors", async () => {
  db.assignmentClass.findMany.mockResolvedValue([
    { class: { instructorId: "instructor" } },
  ]);
  for (const user of ["student", "other-instructor"])
    expect(await getSubmissionHistory("post", "student", user)).toEqual([]);
  expect(db.submissionRevision.findMany).not.toHaveBeenCalled();
});
