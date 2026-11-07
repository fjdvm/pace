import { beforeEach, expect, it, vi } from "vitest";

const db = vi.hoisted(() => ({
  class: { findMany: vi.fn() },
  enrollment: { findMany: vi.fn() },
}));
vi.mock("@/lib/prisma", () => ({ prisma: db }));
vi.mock("react", async (original) => ({ ...(await original<typeof import("react")>()), cache: <T,>(fn: T) => fn }));

beforeEach(() => {
  vi.resetAllMocks();
  db.class.findMany.mockResolvedValue([
    { id: "t1", name: "Mine", archived: false, joinCode: "ABC123", instructor: { name: "Ernesto Odpaga", email: "e@test.com" } },
  ]);
  db.enrollment.findMany.mockResolvedValue([
    { archived: false, class: { id: "e1", name: "Theirs", archived: true, _count: { assignments: 1 }, instructor: { name: null, email: "maria.reyes@test.com" } } },
  ]);
});

it("returns the Instructor name for Teaching and Enrolled Classes and keeps join code and archived flag", async () => {
  const { getDashboardClasses } = await import("./dashboard-classes");
  const result = await getDashboardClasses("user");
  expect(result.teaching).toEqual([
    { id: "t1", name: "Mine", archived: false, joinCode: "ABC123", instructorName: "Ernesto Odpaga" },
  ]);
  expect(result.enrolled).toEqual([
    { id: "e1", name: "Theirs", archived: true, todoCount: 1, instructorName: "Maria Reyes" },
  ]);
});
