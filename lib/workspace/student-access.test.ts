import { beforeEach, expect, it, vi } from "vitest";
const db = vi.hoisted(() => ({ findUnique: vi.fn(), enrollment: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    assignment: { findUnique: db.findUnique },
    enrollment: { findFirst: db.enrollment },
  },
}));
import { requireStudentPost } from "./student-access";
beforeEach(() => vi.resetAllMocks());
it("rejects an outsider or Instructor before returning Post content", async () => {
  db.findUnique.mockResolvedValue({
    id: "post",
    createdBy: "instructor",
    classes: [{ classId: "class" }],
  });
  db.enrollment.mockResolvedValue(null);
  await expect(requireStudentPost("post", "outsider")).rejects.toThrow(
    "Student",
  );
  await expect(requireStudentPost("post", "instructor")).rejects.toThrow(
    "Student",
  );
});
