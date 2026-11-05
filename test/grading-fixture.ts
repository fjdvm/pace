import { beforeEach, vi } from "vitest";
const auth = vi.hoisted(() => ({ userId: "instructor" as string | null }));
const db = vi.hoisted(() => ({
  $queryRaw: vi.fn(),
  assignmentClass: { findMany: vi.fn() },
  assignment: { findUnique: vi.fn() },
  enrollment: { findFirst: vi.fn() },
  submission: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
    delete: vi.fn(),
  },
  submissionAnswer: { update: vi.fn(), updateMany: vi.fn() },
  codeDraft: { upsert: vi.fn() },
}));
vi.mock("@/lib/prisma", () => ({
  prisma: { ...db, $transaction: (fn: (tx: typeof db) => unknown) => fn(db) },
}));
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({
    auth: {
      getUser: async () => ({
        data: { user: auth.userId ? { id: auth.userId } : null },
      }),
    },
  }),
}));
vi.mock("@/lib/submission-return-rewards", () => ({
  rewardReturnedSubmissions: vi.fn(),
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
export const submission = {
  id: "submission",
  studentId: "student",
  assignmentId: "post",
  itemId: "one",
  code: "print(1)",
  status: "turned_in",
  finalGrade: null,
  answers: [
    { itemId: "one", code: "print(1)", grade: 20 },
    { itemId: "two", code: "print(2)", grade: 30 },
  ],
  assignment: {
    items: [
      { id: "one", kind: "coding", points: 50 },
      { id: "two", kind: "coding", points: 50 },
    ],
  },
};
beforeEach(() => {
  vi.clearAllMocks();
  auth.userId = "instructor";
  db.assignmentClass.findMany.mockResolvedValue([
    { class: { instructorId: "instructor" } },
  ]);
  db.assignment.findUnique.mockResolvedValue({
    createdBy: "instructor",
    classes: [{ classId: "class" }],
    items: [],
  });
  db.enrollment.findFirst.mockResolvedValue({ classId: "class" });
  db.submission.findUnique.mockResolvedValue(submission);
  db.submission.findMany.mockResolvedValue([
    { ...submission, status: "graded", finalGrade: 50 },
  ]);
});

export { auth, db };
