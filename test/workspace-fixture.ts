import { beforeEach, vi } from "vitest";
const auth = vi.hoisted(() => ({ userId: "student" as string | null }));
const db = vi.hoisted(() => ({
  $queryRaw: vi.fn(),
  assignment: { findUnique: vi.fn() }, enrollment: { findFirst: vi.fn() },
  submission: { findUnique: vi.fn(), create: vi.fn() },
  codeDraft: { findUnique: vi.fn(), upsert: vi.fn(), deleteMany: vi.fn() },
  heartsState: { findUnique: vi.fn() },
}));
vi.mock("@/lib/prisma", () => ({ prisma: { ...db, $transaction: (run: (tx: typeof db) => unknown) => run(db) } }));
vi.mock("@/lib/supabase/server", () => ({ createClient: async () => ({ auth: { getUser: async () => ({ data: { user: auth.userId ? { id: auth.userId } : null } }) } }) }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/gamification", () => ({ awardSubmissionXp: vi.fn().mockResolvedValue([]), getTotalXp: vi.fn().mockResolvedValue(0) }));
vi.mock("@/lib/notifications", () => ({ createNotification: vi.fn() }));
const item = { id: "one", title: "Sum", language: "Python", points: 30, testCases: [
  { id: "visible", input: "2\n5", expectedOutput: "7", visible: true },
  { id: "hidden", input: "secret", expectedOutput: "7", visible: false },
] };
const post = { id: "post", title: "Coding Post", createdBy: "instructor", dueDate: new Date("2099-01-01"), classes: [{ classId: "class" }], items: [item] };
beforeEach(() => {
  vi.clearAllMocks(); auth.userId = "student";
  db.assignment.findUnique.mockResolvedValue(post); db.enrollment.findFirst.mockResolvedValue({ studentId: "student" });
  db.submission.findUnique.mockResolvedValue(null);
  db.codeDraft.upsert.mockResolvedValue({ updatedAt: new Date("2026-11-05") });
  db.submission.create.mockResolvedValue({ id: "submission", submittedAt: new Date("2026-11-05") });
  db.heartsState.findUnique.mockResolvedValue(null);
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ stdout: "7\n", status: { id: 3, description: "Accepted" } }) }));
});
export { auth, db, post, item };
