import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { mockAuthenticatedUser, mockUnauthenticated } from "../../../test/mock-auth";
import type { ImportedItem } from "@/lib/ai-import/types";

const db = vi.hoisted(() => ({
  class: { count: vi.fn() },
  assignment: { create: vi.fn() },
  assignmentClass: { create: vi.fn() },
  testCase: { deleteMany: vi.fn() },
  item: { deleteMany: vi.fn(), create: vi.fn() },
  post: { create: vi.fn() },
}));
vi.mock("@/lib/prisma", () => ({ prisma: { ...db, $transaction: async (run: (tx: typeof db) => unknown) => run(db) } }));
vi.mock("@/lib/notifications", () => ({ notifyAssignmentPublished: vi.fn().mockResolvedValue(undefined) }));

const base: ImportedItem = { key: "k", kind: "short_answer", title: "Explain", instructions: "", points: 10, language: "", starterCode: "", options: [], correctOption: -1, testCases: [], fromFile: true, checkNote: null, sourceText: "" };
const coding: ImportedItem = { ...base, kind: "coding", title: "Print", instructions: "Print 1..N", language: "Python", testCases: [{ input: "3", expectedOutput: "1", visible: true, fromAi: false }] };
const input = { classId: "c1", title: "Lab", instructions: "", assign: false, items: [coding, base] };

beforeEach(() => {
  vi.resetAllMocks();
  mockAuthenticatedUser("instructor");
  db.class.count.mockResolvedValue(1);
  db.assignment.create.mockResolvedValue({ id: "p1", title: "Lab" });
});

it("saves a Draft with ordered Items and tests, invisible to Students", async () => {
  const { saveImportedPost } = await import("./save-imported-post");
  expect(await saveImportedPost(input)).toEqual({ success: true, id: "p1" });
  expect(db.assignment.create.mock.calls[0][0].data).toMatchObject({ isDraft: true, createdBy: "instructor" });
  expect(db.item.create.mock.calls.map((c) => [c[0].data.position, c[0].data.kind])).toEqual([[0, "coding"], [1, "short_answer"]]);
  expect(db.item.create.mock.calls[0][0].data.testCases.create).toHaveLength(1);
  expect(db.post.create).not.toHaveBeenCalled();
});

it("assigns by publishing to the Stream", async () => {
  const { saveImportedPost } = await import("./save-imported-post");
  await saveImportedPost({ ...input, assign: true });
  expect(db.assignment.create.mock.calls[0][0].data.isDraft).toBe(false);
  expect(db.post.create).toHaveBeenCalled();
});

it("rejects other people's Classes, empty drafts, invalid Items and logged-out users", async () => {
  const { saveImportedPost } = await import("./save-imported-post");
  db.class.count.mockResolvedValue(0);
  expect(await saveImportedPost(input)).toMatchObject({ success: false, error: expect.stringContaining("own classes") });
  expect(await saveImportedPost({ ...input, items: [] })).toMatchObject({ success: false });
  expect(await saveImportedPost({ ...input, title: " " })).toMatchObject({ success: false });
  expect(await saveImportedPost({ ...input, items: [{ ...base, title: "" }] })).toMatchObject({ success: false });
  mockUnauthenticated();
  expect(await saveImportedPost(input)).toMatchObject({ success: false });
  expect(db.assignment.create).not.toHaveBeenCalled();
});

afterEach(() => { vi.resetModules(); vi.doUnmock("@/lib/supabase/server"); });
