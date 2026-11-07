import { randomUUID } from "node:crypto";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { prisma } from "@/lib/prisma";
import { mockAuthenticatedUser } from "../../test/mock-auth";
import type { AssignmentFormValues } from "@/lib/assignment-form";

let instructorId: string;
let studentId: string;
let classIds: string[];
let values: AssignmentFormValues;
beforeEach(async () => {
  instructorId = randomUUID(); studentId = randomUUID(); classIds = [randomUUID(), randomUUID()];
  await prisma.user.createMany({ data: [instructorId, studentId].map((id) => ({ id, email: `${id}@test.com` })) });
  await prisma.class.createMany({ data: classIds.map((id) => ({ id, instructorId, name: id, joinCode: randomUUID() })) });
  await prisma.enrollment.createMany({ data: classIds.map((classId) => ({ classId, studentId })) });
  mockAuthenticatedUser(instructorId);
  values = {
    title: "Settings", instructions: "Print one", language: "Python", dueDate: "2099-10-21T23:59", isDraft: true,
    heartsCount: 3, heartsRegenMinutes: 15, classIds,
    aiTutorEnabled: false, tieredHintsEnabled: false, monitoringEnabled: false, similarityCheckEnabled: false,
    testCases: [{ input: "", expectedOutput: "1", visible: true }],
  };
});
afterEach(async () => {
  await prisma.user.deleteMany({ where: { id: { in: [instructorId, studentId] } } });
  vi.resetModules(); vi.doUnmock("@/lib/supabase/server"); vi.clearAllMocks();
});

it("saves settings, hides Drafts, publishes to several Classes and edits the published Post", async () => {
  const { createAssignment } = await import("./create-assignment");
  const { updateAssignment } = await import("./update-assignment");
  const { readPost } = await import("./read-post");
  const created = await createAssignment(values);
  expect(created).toMatchObject({ success: true });
  const id = created.assignment!.id;
  expect(created.assignment).toMatchObject({ aiTutorEnabled: false, monitoringEnabled: false, tieredHintsEnabled: false, similarityCheckEnabled: false });
  mockAuthenticatedUser(studentId);
  expect(await readPost(id)).toMatchObject({ success: false });
  mockAuthenticatedUser(instructorId);
  expect(await updateAssignment(id, { ...values, isDraft: false })).toMatchObject({ success: true });
  expect(await prisma.post.count({ where: { assignmentId: id } })).toBe(2);
  expect(await updateAssignment(id, { ...values, isDraft: false, title: "Updated", heartsCount: 7, heartsRegenMinutes: 20, monitoringEnabled: true })).toMatchObject({ success: true });
  expect(await prisma.post.count({ where: { assignmentId: id } })).toBe(2);
  mockAuthenticatedUser(studentId);
  expect(await readPost(id)).toMatchObject({ success: true, post: { title: "Updated", isDraft: false, heartsCount: 7, heartsRegenMinutes: 20, monitoringEnabled: true } });
  expect(await updateAssignment(id, { ...values, isDraft: false })).toMatchObject({ success: false });
});

it("rejects another Instructor's Class atomically", async () => {
  const { createAssignment } = await import("./create-assignment");
  const foreign = await prisma.class.create({ data: { instructorId: studentId, name: "Foreign", joinCode: randomUUID() } });
  expect(await createAssignment({ ...values, classIds: [...classIds, foreign.id] })).toMatchObject({ success: false });
  expect(await prisma.assignment.count({ where: { createdBy: instructorId } })).toBe(0);
});

it("disabled tutor spends no Hearts and disabled similarity returns no pairs", async () => {
  const { createAssignment } = await import("./create-assignment");
  const { checkSimilarity } = await import("./check-similarity");
  const { recordTutorRequest } = await import("@/lib/workspace/tutor-request");
  const created = await createAssignment({ ...values, isDraft: false });
  const post = created.assignment!;
  expect(await checkSimilarity(post.id)).toMatchObject({ success: true, pairs: [] });
  await expect(recordTutorRequest(studentId, post, post.id, "Help")).rejects.toThrow("disabled");
  expect(await prisma.heartsState.count({ where: { assignmentId: post.id } })).toBe(0);
});

it("does not store behavioral signals when monitoring is disabled", async () => {
  const { createAssignment } = await import("./create-assignment");
  const { createItem } = await import("./items/create-item");
  const { deleteItem } = await import("./items/delete-item");
  const { updateAssignment } = await import("./update-assignment");
  const { submitCode } = await import("./submit-code");
  const created = await createAssignment(values);
  const id = created.assignment!.id;
  const item = await createItem(id, { kind: "short_answer", title: "Explain", instructions: "", points: 10 });
  expect(item.success).toBe(true);
  expect(await deleteItem(id, id)).toMatchObject({ success: true });
  expect(await updateAssignment(id, { ...values, hasCodingItem: false, isDraft: false })).toMatchObject({ success: true });
  mockAuthenticatedUser(studentId);
  const signals = { pasteCount: 9, pasteLength: 90, keystrokeCount: 2, wpm: 10, totalFocusTimeSecs: 10, tabSwitchCount: 3, events: [] };
  expect(await submitCode(id, "Answer", signals, [{ itemId: item.item!.id, code: "Answer" }])).toMatchObject({ success: true });
  expect((await prisma.submission.findFirstOrThrow({ where: { assignmentId: id } })).behavioralSignals).toBeNull();
});
