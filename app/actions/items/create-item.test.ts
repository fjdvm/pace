import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { mockAuthenticatedUser, mockUnauthenticated } from "../../../test/mock-auth";

const db = vi.hoisted(() => ({
  assignment: { findUnique: vi.fn() },
  item: { create: vi.fn(), findMany: vi.fn() },
  $queryRaw: vi.fn(),
}));
vi.mock("@/lib/prisma", () => ({ prisma: { ...db, $transaction: async (run: (tx: typeof db) => unknown) => run(db) } }));

const input = { title: "Print one", instructions: "Print 1", language: "Python", points: 25 };

beforeEach(() => {
  vi.resetAllMocks();
  mockAuthenticatedUser("instructor");
  db.assignment.findUnique.mockResolvedValue({ id: "post", classes: [{ class: { instructorId: "instructor" } }] });
  db.item.findMany.mockResolvedValue([{ position: 0 }]);
  db.item.create.mockImplementation(async ({ data }) => ({ id: "item", ...data }));
});
afterEach(() => { vi.resetModules(); vi.doUnmock("@/lib/supabase/server"); });

it("lets the Class's Instructor append an ordered coding Item", async () => {
  const { createItem } = await import("./create-item");
  expect(await createItem("post", input)).toMatchObject({
    success: true, item: { id: "item", assignmentId: "post", kind: "coding", points: 25, position: 1 },
  });
});

it.each([{ classes: [] }, { classes: [{ class: { instructorId: "other" } }] }, { classes: [
  { class: { instructorId: "instructor" } }, { class: { instructorId: "other" } },
]}])("rejects an Item write without permission in every linked Class: %j", async ({ classes }) => {
  db.assignment.findUnique.mockResolvedValue({ id: "post", classes });
  const { createItem } = await import("./create-item");
  expect(await createItem("post", input)).toMatchObject({ success: false, error: expect.stringContaining("Instructor") });
  expect(db.item.create).not.toHaveBeenCalled();
});

it("requires authentication", async () => {
  mockUnauthenticated();
  const { createItem } = await import("./create-item");
  expect(await createItem("post", input)).toMatchObject({ success: false, error: "Unauthorized" });
});

it.each([{ points: -1 }, { points: NaN }, { kind: "multiple_choice" }, { language: "Rust" }, { title: " " }])(
  "rejects invalid coding Items: %j", async (invalid) => {
    const { createItem } = await import("./create-item");
    expect(await createItem("post", { ...input, ...invalid })).toMatchObject({ success: false });
    expect(db.item.create).not.toHaveBeenCalled();
  },
);

it("creates a multiple-choice Item with its options and answer key", async () => {
  const { createItem } = await import("./create-item");
  expect(await createItem("post", { kind: "multiple_choice", title: "Which loop?", instructions: "", points: 10,
    options: ["for", "do-while"], correctOption: 1 })).toMatchObject({ success: true,
      item: { kind: "multiple_choice", options: ["for", "do-while"], correctOption: 1, position: 1 } });
});

it("creates a Short answer without choices or coding configuration", async () => {
  const { createItem } = await import("./create-item");
  expect(await createItem("post", { kind: "short_answer", title: "Explain a loop", instructions: "", points: 10 })).toMatchObject({ success: true, item: { kind: "short_answer", options: [], correctOption: null, language: "", starterCode: "", testCases: { create: [] } } });
});
