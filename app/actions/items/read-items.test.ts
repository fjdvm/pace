import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { mockAuthenticatedUser } from "../../../test/mock-auth";

const db = vi.hoisted(() => ({
  assignment: { findUnique: vi.fn() }, item: { findMany: vi.fn() }, $queryRaw: vi.fn(),
}));
vi.mock("@/lib/prisma", () => ({ prisma: { ...db, $transaction: async (run: (tx: typeof db) => unknown) => run(db) } }));

beforeEach(() => {
  vi.resetAllMocks();
  mockAuthenticatedUser("instructor");
  db.assignment.findUnique.mockResolvedValue({ id: "post", classes: [{ class: { instructorId: "instructor" } }] });
  db.item.findMany.mockResolvedValue([{ id: "first", position: 0, points: 25 }, { id: "second", position: 1, points: 75.5 }]);
});
afterEach(() => { vi.resetModules(); vi.doUnmock("@/lib/supabase/server"); });

it("reads ordered Items with a total derived from their points", async () => {
  const { readItems } = await import("./read-items");
  expect(await readItems("post")).toMatchObject({ success: true, totalPoints: 100.5, items: [{ id: "first" }, { id: "second" }] });
  expect(db.item.findMany).toHaveBeenCalledWith(expect.objectContaining({ orderBy: { position: "asc" } }));
});

it("does not return Items to someone who does not teach the Class", async () => {
  db.assignment.findUnique.mockResolvedValue({ id: "post", classes: [{ class: { instructorId: "other" } }] });
  const { readItems } = await import("./read-items");
  expect(await readItems("post")).toMatchObject({ success: false });
  expect(db.item.findMany).not.toHaveBeenCalled();
});
