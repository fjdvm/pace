import { beforeEach, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ getUser: vi.fn(), assignment: vi.fn(), classes: vi.fn(), enrollment: vi.fn(), hearts: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ createClient: async () => ({ auth: { getUser: mocks.getUser } }) }));
vi.mock("@/lib/prisma", () => ({ prisma: {
  assignment: { findUnique: mocks.assignment },
  assignmentClass: { findMany: mocks.classes },
  enrollment: { findFirst: mocks.enrollment },
} }));
vi.mock("@/lib/hearts", () => ({ getOrRegenerateHearts: mocks.hearts }));
vi.mock("next/navigation", () => ({ redirect: (path: string) => { throw new Error(`redirect:${path}`); } }));
vi.mock("./student-workspace-view", () => ({ StudentWorkspaceView: vi.fn() }));
import { AssignmentWorkspacePage } from "./page-content";

const open = () => AssignmentWorkspacePage({ params: Promise.resolve({ id: "assignment" }) });
beforeEach(() => {
  vi.resetAllMocks();
  mocks.getUser.mockResolvedValue({ data: { user: { id: "user" } } });
  mocks.assignment.mockResolvedValue({ id: "assignment" });
  mocks.classes.mockResolvedValue([{ classId: "class" }]);
});

it("requires sign-in to open an assignment", async () => {
  mocks.getUser.mockResolvedValue({ data: { user: null } });
  await expect(open()).rejects.toThrow("redirect:/login");
});
it("returns to the shared dashboard for a missing assignment", async () => {
  mocks.assignment.mockResolvedValue(null);
  await expect(open()).rejects.toThrow("redirect:/dashboard");
});
it("rejects a User who is not enrolled before initializing hearts", async () => {
  mocks.enrollment.mockResolvedValue(null);
  await expect(open()).rejects.toThrow("redirect:/dashboard");
  expect(mocks.hearts).not.toHaveBeenCalled();
});
