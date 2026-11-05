import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { mockAuthenticatedUser } from "../../../test/mock-auth";
const db = vi.hoisted(() => ({
  $queryRaw: vi.fn(),
  assignment: { findUnique: vi.fn() },
  item: { findMany: vi.fn(), update: vi.fn() },
}));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    ...db,
    $transaction: async (run: (tx: typeof db) => unknown) => run(db),
  },
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
beforeEach(() => {
  vi.resetAllMocks();
  mockAuthenticatedUser("instructor");
  db.assignment.findUnique.mockResolvedValue({
    classes: [{ class: { instructorId: "instructor" } }],
  });
  db.item.findMany.mockResolvedValue([
    { id: "a", position: 0 },
    { id: "b", position: 1 },
  ]);
});
afterEach(() => {
  vi.resetModules();
  vi.doUnmock("@/lib/supabase/server");
});
it("stores a complete order without colliding with existing positions", async () => {
  const { reorderItems } = await import("./reorder-items");
  expect(await reorderItems("post", ["b", "a"])).toEqual({ success: true });
  expect(
    db.item.update.mock.calls.map(([arg]) => [arg.where.id, arg.data.position]),
  ).toEqual([
    ["b", 2],
    ["a", 3],
    ["b", 0],
    ["a", 1],
  ]);
});
it.each([["a"], ["a", "a"], ["a", "foreign"]])(
  "rejects incomplete, duplicate and foreign orders: %j",
  async (...ids) => {
    const { reorderItems } = await import("./reorder-items");
    expect(await reorderItems("post", ids)).toMatchObject({ success: false });
    expect(db.item.update).not.toHaveBeenCalled();
  },
);
it.each([
  [],
  [{ class: { instructorId: "student" } }],
  [
    { class: { instructorId: "instructor" } },
    { class: { instructorId: "other" } },
  ],
])("requires Instructor permission in every Class", async (...links) => {
  db.assignment.findUnique.mockResolvedValue({ classes: links });
  const { reorderItems } = await import("./reorder-items");
  expect(await reorderItems("post", ["b", "a"])).toMatchObject({
    success: false,
  });
  expect(db.item.update).not.toHaveBeenCalled();
});
