import { expect, it, vi } from "vitest";
const db = vi.hoisted(() => ({
  xpEvent: { createMany: vi.fn(), aggregate: vi.fn() },
  streak: { findUnique: vi.fn(), update: vi.fn() },
  assignmentClass: { findMany: vi.fn() },
  submission: { findMany: vi.fn() },
  badge: { findMany: vi.fn() },
  userBadge: { findMany: vi.fn(), create: vi.fn() },
}));
vi.mock("@/lib/prisma", () => ({ prisma: db }));
vi.mock("./notifications", () => ({ createNotification: vi.fn() }));
import { awardSubmissionXp } from "./gamification";
it("uses Returned final grades for perfect-score badges", async () => {
  db.streak.findUnique.mockResolvedValue({
    currentStreak: 1,
    lastSubmissionWeek: 0,
  });
  db.streak.findUnique.mockResolvedValueOnce({
    currentStreak: 1,
    lastSubmissionWeek: 202645,
  });
  db.assignmentClass.findMany.mockResolvedValue([]);
  db.submission.findMany.mockResolvedValue([
    { finalGrade: 75, assignment: { items: [{ points: 100 }] } },
  ]);
  db.xpEvent.aggregate.mockResolvedValue({ _sum: { xpAmount: 10 } });
  db.badge.findMany.mockResolvedValue([
    { id: "perfect", condition: "perfect_score", name: "Perfect" },
  ]);
  db.userBadge.findMany.mockResolvedValue([]);
  await awardSubmissionXp("student", "post", 75, 1);
  expect(db.submission.findMany).toHaveBeenCalledWith(
    expect.objectContaining({
      where: { studentId: "student", status: "returned" },
    }),
  );
  expect(db.userBadge.create).not.toHaveBeenCalled();
});
