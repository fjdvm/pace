import { beforeEach, expect, it, vi } from "vitest";

const db = vi.hoisted(() => ({
  assignmentClass: { findMany: vi.fn() },
  assignment: { findUnique: vi.fn() },
}));
vi.mock("@/lib/prisma", () => ({ prisma: db }));

beforeEach(() => {
  vi.resetAllMocks();
  db.assignment.findUnique.mockResolvedValue(null);
});

const reviews = [
  ["overview", async () => (await import("./assignment-overview-data")).getAssignmentOverview("caller", "assignment")],
  ["Student review", async () => (await import("./submission-detail-data")).getSubmissionDetail("caller", "assignment", "student")],
  ["comparison", async () => (await import("./submission-detail-data")).getCompareData("caller", "assignment", "a", "b")],
] as const;

it.each(reviews)("denies %s when the User does not teach the Class", async (_name, review) => {
  db.assignmentClass.findMany.mockResolvedValue([{ class: { instructorId: "other" } }]);
  expect(await review()).toBeNull();
});

it.each(reviews)("denies %s when only one of the linked Classes is taught by the User", async (_name, review) => {
  db.assignmentClass.findMany.mockResolvedValue([
    { class: { instructorId: "caller" } },
    { class: { instructorId: "other" } },
  ]);
  expect(await review()).toBeNull();
});

it.each(reviews)("denies %s for an assignment without a Class", async (_name, review) => {
  db.assignmentClass.findMany.mockResolvedValue([]);
  expect(await review()).toBeNull();
});
