import { randomUUID } from "node:crypto";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { prisma } from "@/lib/prisma";
import { mockAuthenticatedUser } from "../../test/mock-auth";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

let instructorId: string;
let studentId: string;
let postId: string;
let codingId: string;
beforeEach(async () => {
  instructorId = randomUUID(); studentId = randomUUID();
  await prisma.user.createMany({ data: [instructorId, studentId].map((id) => ({ id, email: `${id}@test.com` })) });
  const cls = await prisma.class.create({ data: { instructorId, name: "CS 101", joinCode: randomUUID(), enrollments: { create: { studentId } } } });
  mockAuthenticatedUser(instructorId);
  const { createAssignment } = await import("./create-assignment");
  const result = await createAssignment({ title: "Loops", instructions: "Answer all items", isDraft: true, label: "Activity", language: "Python", dueDate: "2099-10-28T23:59", heartsCount: 5, heartsRegenMinutes: 30, classIds: [cls.id], points: 25, testCases: [{ input: "", expectedOutput: "1", visible: true }] });
  expect(result.success).toBe(true);
  postId = result.assignment!.id; codingId = postId;
});
afterEach(async () => {
  await prisma.user.deleteMany({ where: { id: { in: [instructorId, studentId] } } });
  vi.resetModules(); vi.doUnmock("@/lib/supabase/server");
});

const choice = { kind: "multiple_choice" as const, title: "What does break do inside a loop?", instructions: "", points: 10, options: ["Skips to the next iteration", "Exits the loop right away", "Restarts the loop", "Ends the program"], correctOption: 1 };

it("authors both manual kinds, persists edits, reorders and removes any Item with derived totals", async () => {
  const { createItem } = await import("./items/create-item");
  const { updateItem } = await import("./items/update-item");
  const { reorderItems } = await import("./items/reorder-items");
  const { deleteItem } = await import("./items/delete-item");
  const { readItems } = await import("./items/read-items");
  const mc = await createItem(postId, choice);
  const short = await createItem(postId, { kind: "short_answer", title: "Explain when a loop stops", instructions: "", points: 5 });
  expect(mc).toMatchObject({ success: true, item: { options: choice.options, correctOption: 1 } });
  expect(short).toMatchObject({ success: true, item: { kind: "short_answer", correctOption: null } });
  expect(await updateItem(postId, mc.item!.id, { ...choice, points: 15, options: ["Continues", "Stops"], correctOption: 1 })).toMatchObject({ success: true });
  expect(await reorderItems(postId, [short.item!.id, mc.item!.id, codingId])).toMatchObject({ success: true });
  expect(await prisma.assignment.findUniqueOrThrow({ where: { id: postId } })).toMatchObject({ instructions: "Answer all items", language: "Python" });
  expect(await readItems(postId)).toMatchObject({ totalPoints: 45, items: [{ id: short.item!.id }, { id: mc.item!.id, points: 15, options: ["Continues", "Stops"], correctOption: 1 }, { id: codingId }] });
  expect(await deleteItem(postId, codingId)).toMatchObject({ success: true });
  expect(await readItems(postId)).toMatchObject({ totalPoints: 20 });
  expect(await deleteItem(postId, mc.item!.id)).toMatchObject({ success: true });
  expect(await readItems(postId)).toMatchObject({ totalPoints: 5 });
  expect(await deleteItem(postId, short.item!.id)).toMatchObject({ success: false });
  const { updateAssignment } = await import("./update-assignment");
  const { readPost } = await import("./read-post");
  const post = await prisma.assignment.findUniqueOrThrow({ where: { id: postId }, include: { classes: true } });
  expect(await updateAssignment(postId, { title: "Manual Items", instructions: "", isDraft: false, language: "Python", dueDate: "2099-10-28T23:59", heartsCount: 5, heartsRegenMinutes: 30, classIds: post.classes.map((c) => c.classId), testCases: [] })).toMatchObject({ success: true });
  expect(await readPost(postId)).toMatchObject({ post: { isDraft: false, totalPoints: 5, items: [{ kind: "short_answer", title: "Explain when a loop stops" }] } });
});

it("rejects incomplete options and answer keys without changing stored Items", async () => {
  const { createItem } = await import("./items/create-item");
  const { readItems } = await import("./items/read-items");
  for (const input of [{ ...choice, correctOption: -1 }, { ...choice, options: ["Only one"] }, { ...choice, options: ["A", " "] }, { ...choice, points: -1 }]) {
    expect(await createItem(postId, input)).toMatchObject({ success: false });
  }
  expect(await createItem(postId, { kind: "short_answer", title: " ", instructions: "", points: 5 })).toMatchObject({ success: false });
  expect(await readItems(postId)).toMatchObject({ totalPoints: 25, items: [{ id: codingId }] });
});

it("denies Student authoring and never exposes the correct answer through readPost", async () => {
  const { createItem } = await import("./items/create-item");
  const { updateItem } = await import("./items/update-item");
  const { deleteItem } = await import("./items/delete-item");
  const { reorderItems } = await import("./items/reorder-items");
  const { readPost } = await import("./read-post");
  const mc = await createItem(postId, choice);
  await prisma.assignment.update({ where: { id: postId }, data: { isDraft: false } });
  mockAuthenticatedUser(studentId);
  expect(await createItem(postId, choice)).toMatchObject({ success: false });
  expect(await updateItem(postId, mc.item!.id, choice)).toMatchObject({ success: false });
  expect(await deleteItem(postId, mc.item!.id)).toMatchObject({ success: false });
  expect(await reorderItems(postId, [mc.item!.id, codingId])).toMatchObject({ success: false });
  const post = await readPost(postId);
  expect(post.success).toBe(true);
  expect(post.post!.items[1].correctOption).toBeUndefined();
});
