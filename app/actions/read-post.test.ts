import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { mockAuthenticatedUser } from "../../test/mock-auth";

const db = vi.hoisted(() => ({ assignment: { findFirst: vi.fn() } }));
vi.mock("@/lib/prisma", () => ({ prisma: db }));
beforeEach(() => { vi.resetAllMocks(); mockAuthenticatedUser("student"); });
afterEach(() => { vi.resetModules(); vi.doUnmock("@/lib/supabase/server"); });

it("never returns a Draft to a Student, even with its ID", async () => {
  db.assignment.findFirst.mockResolvedValue(null);
  const { readPost } = await import("./read-post");
  expect(await readPost("draft")).toMatchObject({ success: false, error: "Post not found" });
  expect(db.assignment.findFirst).toHaveBeenCalledWith(expect.objectContaining({
    where: { id: "draft", OR: [
      { classes: { some: { class: { instructorId: "student" } } } },
      { isDraft: false, classes: { some: { class: { enrollments: { some: { studentId: "student" } } } } } },
    ] },
  }));
});

it("returns the Post's Label, ordered Items and derived points without hidden tests", async () => {
  db.assignment.findFirst.mockResolvedValue({ id: "post", label: "Activity", isDraft: false, classes: [], items: [
    { id: "one", points: 20, testCases: [{ id: "visible", visible: true }, { id: "hidden", visible: false }] },
    { id: "two", points: 30, testCases: [] },
  ] });
  const { readPost } = await import("./read-post");
  expect(await readPost("post")).toMatchObject({ success: true, post: {
    label: "Activity", totalPoints: 50, items: [{ id: "one", testCases: [{ id: "visible" }] }, { id: "two" }],
  } });
});

it("allows the Class's Instructor to read a Draft and its hidden tests", async () => {
  db.assignment.findFirst.mockResolvedValue({ id: "draft", label: "Quiz", isDraft: true,
    classes: [{ class: { instructorId: "student" } }], items: [{ points: 10, testCases: [{ visible: false }] }],
  });
  const { readPost } = await import("./read-post");
  expect(await readPost("draft")).toMatchObject({ success: true, post: { isDraft: true, items: [{ testCases: [{ visible: false }] }] } });
});

it("keeps Instructor analytics out of the Student Post response", async () => {
  db.assignment.findFirst.mockResolvedValue({ id: "post", classes: [], items: [],
    statsReportNarrative: "Private integrity report", statsReportGeneratedAt: new Date(),
  });
  const { readPost } = await import("./read-post");
  const result = await readPost("post");
  expect(result).toMatchObject({ success: true });
  expect(result.post).not.toHaveProperty("statsReportNarrative");
  expect(result.post).not.toHaveProperty("statsReportGeneratedAt");
});

it("does not disclose the multiple-choice answer key to a Student", async () => {
  db.assignment.findFirst.mockResolvedValue({ id: "post", classes: [], items: [
    { id: "choice", kind: "multiple_choice", points: 10, options: ["for", "while"], correctOption: 1, testCases: [] },
  ] });
  const { readPost } = await import("./read-post");
  const result = await readPost("post");
  expect(result.post?.items[0].options).toEqual(["for", "while"]);
  expect(result.post?.items[0].correctOption).toBeUndefined();
});
