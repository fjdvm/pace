import { beforeEach, expect, it, vi } from "vitest";

const db = vi.hoisted(() => ({
  computeSimilarityPairs: vi.fn(),
  assignmentClass: { findMany: vi.fn() },
  assignment: { findUnique: vi.fn() },
  submission: { findMany: vi.fn() },
}));
vi.mock("@/lib/prisma", () => ({ prisma: db }));
vi.mock("@/lib/similarity/assignment-pairs", () => ({
  computeSimilarityPairs: db.computeSimilarityPairs,
}));

beforeEach(() => {
  vi.resetAllMocks();
  db.computeSimilarityPairs.mockResolvedValue([{ similarity: 75 }]);
  db.assignment.findUnique.mockResolvedValue({
    id: "assignment", title: "Loops", language: "python", createdBy: "caller",
  });
  db.submission.findMany.mockResolvedValue([
    { studentId: "a", code: "print(1)", student: { id: "a", name: "Ana", email: "a@test.com" } },
    { studentId: "b", code: "print(2)", student: { id: "b", name: "Ben", email: "b@test.com" } },
  ]);
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

it("allows comparison for the Class Instructor even when someone else created the assignment", async () => {
  db.assignmentClass.findMany.mockResolvedValue([{ class: { instructorId: "caller" } }]);
  db.assignment.findUnique.mockResolvedValue({
    id: "assignment", title: "Loops", language: "python", createdBy: "other",
  });
  const { getCompareData } = await import("./submission-detail-data");
  expect(await getCompareData("caller", "assignment", "a", "b")).toMatchObject({
    assignment: { id: "assignment" },
    left: { id: "a", name: "Ana", code: "print(1)" },
    right: { id: "b", name: "Ben", code: "print(2)" },
    similarity: 75,
  });
});
