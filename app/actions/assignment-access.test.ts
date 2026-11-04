import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { mockAuthenticatedUser } from "../../test/mock-auth";

const db = vi.hoisted(() => ({
  user: { findUnique: vi.fn() },
  class: { count: vi.fn() },
  assignment: { create: vi.fn() },
  assignmentClass: { createMany: vi.fn() },
  testCase: { createMany: vi.fn() },
  post: { createMany: vi.fn() },
}));
vi.mock("@/lib/prisma", () => ({ prisma: { ...db, $transaction: async (run: (tx: typeof db) => unknown) => run(db) } }));
vi.mock("@/lib/notifications", () => ({ notifyAssignmentPublished: vi.fn().mockResolvedValue(undefined) }));

const params = {
  title: "First assignment", instructions: "Print 1", language: "Python",
  dueDate: "2099-01-01T00:00:00Z", heartsCount: 5, heartsRegenMinutes: 30,
  classIds: ["own-class"], testCases: [{ input: "", expectedOutput: "1", visible: true }],
};

beforeEach(() => {
  vi.clearAllMocks();
  mockAuthenticatedUser("user");
  db.user.findUnique.mockResolvedValue({ id: "user", role: "student", approvalStatus: "pending" });
  db.class.count.mockResolvedValue(1);
  db.assignment.create.mockResolvedValue({ id: "assignment", title: params.title });
});
afterEach(() => {
  vi.resetModules();
  vi.doUnmock("@/lib/supabase/server");
});

it("lets a User create an assignment in a Class they teach without global role or approval", async () => {
  const { createAssignment } = await import("./create-assignment");
  expect(await createAssignment(params)).toMatchObject({ success: true, assignment: { id: "assignment" } });
});

it("rejects creating an assignment in someone else's Class", async () => {
  db.class.count.mockResolvedValue(0);
  const { createAssignment } = await import("./create-assignment");
  expect(await createAssignment({ ...params, classIds: ["other-class"] })).toEqual({
    success: false, error: "You can only assign to your own classes",
  });
  expect(db.assignment.create).not.toHaveBeenCalled();
});

it("rejects a mix of teaching and someone else's Classes", async () => {
  const { createAssignment } = await import("./create-assignment");
  expect(await createAssignment({ ...params, classIds: ["own-class", "other-class"] })).toMatchObject({ success: false });
  expect(db.assignment.create).not.toHaveBeenCalled();
});
