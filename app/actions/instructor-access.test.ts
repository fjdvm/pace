import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { mockAuthenticatedUser, mockUnauthenticated } from "../../test/mock-auth";

const db = vi.hoisted(() => ({
  class: { findUnique: vi.fn() },
  assignment: { findUnique: vi.fn() },
  assignmentClass: { findMany: vi.fn() },
  submission: { findMany: vi.fn(), findUnique: vi.fn() },
  heartsState: { findMany: vi.fn() },
}));
vi.mock("@/lib/prisma", () => ({ prisma: db }));
vi.mock("@/lib/ai-provider", () => ({ getModelWithFallback: vi.fn() }));

beforeEach(() => {
  vi.resetAllMocks();
  mockAuthenticatedUser("caller");
  db.class.findUnique.mockResolvedValue({ id: "class", instructorId: "other" });
  db.assignment.findUnique.mockResolvedValue({
    id: "assignment", createdBy: "caller", classes: [], language: "Python",
    statsReportNarrative: "Cached report", dueDate: new Date("2099-01-01"),
  });
  db.assignmentClass.findMany.mockResolvedValue([{ class: { instructorId: "other" } }]);
  db.submission.findMany.mockResolvedValue([]);
  db.submission.findUnique.mockResolvedValue(null);
  db.heartsState.findMany.mockResolvedValue([]);
});
afterEach(() => {
  vi.resetModules();
  vi.doUnmock("@/lib/supabase/server");
});

const assignmentActions = [
  ["submissions", async () => (await import("./assignment-score-table")).getAssignmentScoreTable("assignment")],
  ["stats", async () => (await import("./assignment-stats")).getAssignmentStats("assignment")],
  ["similarity", async () => (await import("./check-similarity")).checkSimilarity("assignment")],
  ["analysis", async () => (await import("./submission-analysis")).getSubmissionAnalysis("assignment", "student")],
  ["assignment report", async () => (await import("./assignment-report")).generateAssignmentReport("assignment")],
  ["submission report", async () => (await import("./submission-report")).generateSubmissionReport("assignment", "student")],
  ["delete assignment", async () => (await import("./delete-assignment")).deleteAssignment("assignment")],
] as const;

it.each(assignmentActions)("rejects %s when the creator is not the linked Class's Instructor", async (_name, action) => {
  expect(await action()).toMatchObject({ success: false, error: expect.stringContaining("Unauthorized") });
});

it.each([
  ["remove Student", async () => (await import("./kick-student")).kickStudent("class", "student")],
  ["archive", async () => (await import("./archive-class")).archiveClass("class")],
  ["delete", async () => (await import("./delete-class")).deleteClass("class")],
] as const)("rejects %s for a User who does not teach the Class", async (_name, action) => {
  expect(await action()).toMatchObject({ success: false, error: expect.stringContaining("Unauthorized") });
});

it.each(assignmentActions)("requires sign-in for %s", async (_name, action) => {
  mockUnauthenticated();
  expect(await action()).toMatchObject({ success: false, error: expect.stringContaining("logged in") });
});

it.each(assignmentActions.slice(0, 3))("allows %s for the linked Class's Instructor", async (_name, action) => {
  db.assignment.findUnique.mockResolvedValue({
    id: "assignment", createdBy: "other", classes: [], language: "Python", dueDate: new Date("2099-01-01"),
  });
  db.assignmentClass.findMany.mockResolvedValue([{ class: { instructorId: "caller" } }]);
  expect(await action()).toMatchObject({ success: true });
});

it("rejects stats when only some linked Classes are taught by the caller", async () => {
  db.assignmentClass.findMany.mockResolvedValue([
    { class: { instructorId: "caller" } }, { class: { instructorId: "other" } },
  ]);
  const { getAssignmentStats } = await import("./assignment-stats");
  expect(await getAssignmentStats("assignment")).toMatchObject({ success: false, error: expect.stringContaining("Unauthorized") });
});
