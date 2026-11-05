import { expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ enrollments: vi.fn() }));
vi.mock("@/lib/prisma", () => ({ prisma: { enrollment: { findMany: mocks.enrollments } } }));
vi.mock("@/lib/gamification", () => ({ computeLevel: vi.fn(), getTotalXp: vi.fn() }));
import { getStudentClasses } from "./student-home-data";
it("shows the first workspace Item's balance regardless of heart row order", async () => {
  mocks.enrollments.mockResolvedValue([{ archived: false, class: {
    id: "class", name: "Class", instructor: { email: "instructor@test.com" }, joinCode: "code", archived: false,
    assignments: [{ assignment: { id: "post", title: "Post", language: "Python", dueDate: new Date(),
      items: [{ id: "first" }], heartsCount: 5, submissions: [],
      heartsStates: [{ itemId: "second", currentCount: 0 }, { itemId: "first", currentCount: 4 }],
    } }],
  } }]);
  const classes = await getStudentClasses("student");
  expect(classes[0].assignments[0].heartsLeft).toBe(4);
  expect(classes[0].assignments[0].status).toBe("in progress");
});
