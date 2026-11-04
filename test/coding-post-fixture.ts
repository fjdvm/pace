import { beforeEach, vi } from "vitest";
import { notifyAssignmentPublished } from "@/lib/notifications";

const auth = vi.hoisted(() => ({ userId: "instructor" as string | null }));
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({
    auth: {
      getUser: async () => ({
        data: { user: auth.userId ? { id: auth.userId } : null },
      }),
    },
  }),
}));

const db = vi.hoisted(() => ({
  class: { count: vi.fn() },
  assignment: { create: vi.fn(), findUnique: vi.fn(), update: vi.fn() },
  assignmentClass: { createMany: vi.fn(), deleteMany: vi.fn() },
  item: { update: vi.fn(), findFirst: vi.fn() },
  testCase: { createMany: vi.fn(), deleteMany: vi.fn(), findMany: vi.fn() },
  post: { createMany: vi.fn(), deleteMany: vi.fn() },
  $queryRaw: vi.fn(),
}));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    ...db,
    $transaction: async (run: (tx: typeof db) => unknown) => run(db),
  },
}));
vi.mock("@/lib/notifications", () => ({
  notifyAssignmentPublished: vi.fn().mockResolvedValue(undefined),
}));
const values = {
  title: "Sum",
  instructions: "Print the sum",
  language: "Python",
  label: "Activity" as const,
  dueDate: "2099-10-21T23:59",
  heartsCount: 5,
  heartsRegenMinutes: 30,
  classIds: ["class"],
  starterCode: "a = int(input())",
  points: 50,
  testCases: [{ input: "2\n5", expectedOutput: "7", visible: true }],
};
beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(notifyAssignmentPublished).mockResolvedValue(undefined);
  auth.userId = "instructor";
  db.class.count.mockResolvedValue(1);
  db.assignment.create.mockResolvedValue({ id: "post", title: "Sum" });
  db.assignment.findUnique.mockResolvedValue({
    id: "post",
    ...values,
    isDraft: true,
    classes: [{ classId: "class", class: { instructorId: "instructor" } }],
    _count: { codeDrafts: 0, submissions: 0, heartsStates: 0, chatMessages: 0 },
  });
  db.item.findFirst.mockResolvedValue({ id: "post", ...values });
  db.testCase.findMany.mockResolvedValue(values.testCases);
});


export { auth, db, values };
