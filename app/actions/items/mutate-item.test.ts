import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { mockAuthenticatedUser } from "../../../test/mock-auth";

const db = vi.hoisted(() => ({
  assignment: { findUnique: vi.fn() },
  item: { findUnique: vi.fn(), update: vi.fn(), delete: vi.fn(), count: vi.fn() },
  testCase: { deleteMany: vi.fn(), createMany: vi.fn() }, $queryRaw: vi.fn(),
}));
vi.mock("@/lib/prisma", () => ({ prisma: { ...db, $transaction: async (run: (tx: typeof db) => unknown) => run(db) } }));
const input = { title: "Print one", instructions: "Print 1", language: "Python", points: 25, starterCode: "" };
const counts = { codeDrafts: 0, submissions: 0, heartsStates: 0, chatMessages: 0, items: 2 };

beforeEach(() => {
  vi.resetAllMocks(); mockAuthenticatedUser("instructor");
  db.assignment.findUnique.mockResolvedValue({ id: "post", _count: counts, classes: [{ class: { instructorId: "instructor" } }] });
  db.item.findUnique.mockResolvedValue({ id: "item", assignmentId: "post", ...input });
  db.item.update.mockImplementation(async ({ data }) => ({ id: "item", ...data }));
  db.item.count.mockResolvedValue(2);
});
afterEach(() => { vi.resetModules(); vi.doUnmock("@/lib/supabase/server"); });

it("lets an Instructor update a coding Item and its tests", async () => {
  const { updateItem } = await import("./update-item");
  expect(await updateItem("post", "item", { ...input, points: 50, testCases: [] })).toMatchObject({
    success: true, item: { id: "item", points: 50 },
  });
});

it("lets an Instructor delete an unstarted Item", async () => {
  const { deleteItem } = await import("./delete-item");
  expect(await deleteItem("post", "item")).toEqual({ success: true });
});

it.each(["update", "delete"])("rejects %s without Class Instructor permission", async (operation) => {
  db.assignment.findUnique.mockResolvedValue({ id: "post", classes: [{ class: { instructorId: "other" } }] });
  const { updateItem } = await import("./update-item"); const { deleteItem } = await import("./delete-item");
  expect(await (operation === "update" ? updateItem("post", "item", input) : deleteItem("post", "item"))).toMatchObject({ success: false });
  expect(db.item.update).not.toHaveBeenCalled(); expect(db.item.delete).not.toHaveBeenCalled();
});

it.each(["update", "delete"])("rejects %s of another Post's Item", async (operation) => {
  db.item.findUnique.mockResolvedValue(null);
  const { updateItem } = await import("./update-item"); const { deleteItem } = await import("./delete-item");
  expect(await (operation === "update" ? updateItem("post", "foreign", input) : deleteItem("post", "foreign"))).toMatchObject({ success: false, error: "Item not found" });
});

it.each(["submissions", "codeDrafts", "heartsStates", "chatMessages"])("blocks deleting an Item after a Student starts (%s)", async (started) => {
  db.assignment.findUnique.mockResolvedValue({ id: "post", _count: { ...counts, [started]: 1 }, classes: [{ class: { instructorId: "instructor" } }] });
  const { deleteItem } = await import("./delete-item");
  expect(await deleteItem("post", "item")).toMatchObject({ success: false, error: expect.stringContaining("started") });
  expect(db.item.delete).not.toHaveBeenCalled();
});

it("blocks changing tests after a Student starts but allows text and points", async () => {
  db.assignment.findUnique.mockResolvedValue({ id: "post", _count: { ...counts, codeDrafts: 1 }, classes: [{ class: { instructorId: "instructor" } }] });
  const { updateItem } = await import("./update-item");
  expect(await updateItem("post", "item", { ...input, testCases: [] })).toMatchObject({ success: false });
  expect(await updateItem("post", "item", { ...input, title: "New text", points: 30 })).toMatchObject({ success: true });
});

it("keeps at least one Item in every Post", async () => {
  db.item.count.mockResolvedValue(1);
  const { deleteItem } = await import("./delete-item");
  expect(await deleteItem("post", "item")).toMatchObject({ success: false, error: "A Post must have at least one Item" });
});

it.each([0, 1])("preserves omitted starter code when editing text (started=%s)", async (started) => {
  db.assignment.findUnique.mockResolvedValue({ id: "post", _count: { ...counts, codeDrafts: started }, classes: [{ class: { instructorId: "instructor" } }] });
  db.item.findUnique.mockResolvedValue({ id: "item", assignmentId: "post", ...input, starterCode: "print('start')" });
  const { updateItem } = await import("./update-item");
  expect(await updateItem("post", "item", { ...input, starterCode: undefined, points: 30 })).toMatchObject({
    success: true, item: { starterCode: "print('start')", points: 30 },
  });
});
