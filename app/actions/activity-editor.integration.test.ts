import { randomUUID } from "node:crypto";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { prisma } from "@/lib/prisma";
import { mockAuthenticatedUser } from "../../test/mock-auth";
import { executeTests } from "@/lib/workspace/execute-tests";
import type { AssignmentFormValues } from "@/lib/assignment-form";

vi.mock("@/lib/workspace/execute-tests", () => ({ executeTests: vi.fn().mockResolvedValue([]) }));
let instructorId: string;
let studentId: string;
let classId: string;
let values: AssignmentFormValues;

beforeEach(async () => {
  instructorId = randomUUID(); studentId = randomUUID(); classId = randomUUID();
  await prisma.user.createMany({ data: [instructorId, studentId].map((id) => ({ id, email: `${id}@test.com` })) });
  await prisma.class.create({ data: { id: classId, instructorId, name: "CS 101", joinCode: randomUUID() } });
  await prisma.enrollment.create({ data: { classId, studentId } });
  mockAuthenticatedUser(instructorId);
  values = {
    title: "Input and Output", instructions: "Complete the Items", itemTitle: "Sum of Two Numbers", itemInstructions: "Read two integers and print their sum.",
    label: "Activity", isDraft: true, starterCode: "a = int(input())", language: "Python", points: 50,
    dueDate: "2099-10-21T23:59", heartsCount: 5, heartsRegenMinutes: 30, classIds: [classId],
    testCases: [{ input: "2\n5", expectedOutput: "7", visible: true }, { input: "-8\n-2", expectedOutput: "-10", visible: false }],
  };
});
afterEach(async () => {
  await prisma.user.deleteMany({ where: { id: { in: [instructorId, studentId] } } });
  vi.resetModules(); vi.doUnmock("@/lib/supabase/server"); vi.clearAllMocks();
});

it("saves a multi-Coding-Item Draft, derives points, and publishes without exposing hidden tests", async () => {
  const { createAssignment } = await import("./create-assignment");
  const { updateAssignment } = await import("./update-assignment");
  const { createItem } = await import("./items/create-item");
  const { updateItem } = await import("./items/update-item");
  const { readPost } = await import("./read-post");
  const created = await createAssignment(values);
  expect(created).toMatchObject({ success: true });
  const id = created.assignment!.id;
  const added = await createItem(id, { kind: "coding", title: "Even or Odd", instructions: "Print parity", language: "Python", starterCode: "n = int(input())", points: 30, testCases: [{ input: "2", expectedOutput: "Even", visible: false }] });
  expect(added.error).toBeUndefined();
  expect(added).toMatchObject({ success: true });
  expect(await readPost(id)).toMatchObject({ success: true, post: { isDraft: true, totalPoints: 80, items: [{ title: "Sum of Two Numbers", points: 50 }, { title: "Even or Odd", points: 30 }] } });
  expect(await updateItem(id, added.item!.id, { kind: "coding", title: "Parity", instructions: "Print parity", language: "Python", starterCode: "print('Even')", points: 40, testCases: [{ input: "2", expectedOutput: "Even", visible: true }] })).toMatchObject({ success: true });
  mockAuthenticatedUser(studentId);
  expect(await readPost(id)).toMatchObject({ success: false });
  mockAuthenticatedUser(instructorId);
  expect(await updateAssignment(id, { ...values, itemId: id, isDraft: false, label: "Quiz" })).toMatchObject({ success: true });
  mockAuthenticatedUser(studentId);
  const student = await readPost(id);
  expect(student).toMatchObject({ success: true, post: { isDraft: false, label: "Quiz", totalPoints: 90 } });
  expect(student.post!.items[0].testCases).toHaveLength(1);
  expect(student.post!.items[1]).toMatchObject({ title: "Parity", starterCode: "print('Even')" });
});

it.each(["Assignment", "Activity", "Quiz"] as const)("Label %s does not change Draft or assigning behavior", async (label) => {
  const { createAssignment } = await import("./create-assignment");
  const { updateAssignment } = await import("./update-assignment");
  const { readPost } = await import("./read-post");
  const created = await createAssignment({ ...values, label });
  expect(created.success).toBe(true);
  expect(await updateAssignment(created.assignment!.id, { ...values, label, isDraft: false })).toMatchObject({ success: true });
  expect(await readPost(created.assignment!.id)).toMatchObject({ post: { label, isDraft: false, totalPoints: 50 } });
});

it("cannot assign a Post with no Items", async () => {
  const { createAssignment } = await import("./create-assignment");
  const { updateAssignment } = await import("./update-assignment");
  const created = await createAssignment(values);
  await prisma.item.deleteMany({ where: { assignmentId: created.assignment!.id } });
  expect(await updateAssignment(created.assignment!.id, { ...values, isDraft: false })).toMatchObject({ success: false });
});

it("checks an Instructor solution against visible and hidden tests without saving it as starter code", async () => {
  const { checkCodingSolution } = await import("./check-coding-solution");
  const input = { classId, language: "Python", code: "print(int(input()) + int(input()))", testCases: values.testCases };
  expect(await checkCodingSolution(input)).toMatchObject({ success: true });
  expect(executeTests).toHaveBeenCalledWith("Python", input.code, [expect.objectContaining({ visible: true, input: "2\n5" }), expect.objectContaining({ visible: false, input: "-8\n-2" })]);
  mockAuthenticatedUser(studentId);
  expect(await checkCodingSolution(input)).toMatchObject({ success: false, error: expect.stringContaining("Instructor") });
  expect(executeTests).toHaveBeenCalledTimes(1);
});

it("keeps the Post a Draft when an additional Coding Item has incomplete tests", async () => {
  const { createAssignment } = await import("./create-assignment");
  const { createItem } = await import("./items/create-item");
  const { updateAssignment } = await import("./update-assignment");
  const { readPost } = await import("./read-post");
  const created = await createAssignment(values);
  const id = created.assignment!.id;
  expect(await createItem(id, { kind: "coding", title: "Incomplete", instructions: "Finish this later", language: "Python", points: 10, testCases: [] })).toMatchObject({ success: true });
  expect(await updateAssignment(id, { ...values, isDraft: false })).toMatchObject({ success: false });
  expect(await readPost(id)).toMatchObject({ post: { isDraft: true } });
});

it("rejects incomplete Coding Item writes directly on an assigned Post", async () => {
  const { createAssignment } = await import("./create-assignment");
  const { createItem } = await import("./items/create-item");
  const { updateItem } = await import("./items/update-item");
  const { readPost } = await import("./read-post");
  const created = await createAssignment({ ...values, isDraft: false });
  const id = created.assignment!.id;
  const input = { kind: "coding", title: "Second", instructions: "Print one", language: "Python", points: 10, testCases: [] };
  expect(await createItem(id, input)).toMatchObject({ success: false });
  const added = await createItem(id, { ...input, testCases: [{ input: "", expectedOutput: "1", visible: true }] });
  expect(added).toMatchObject({ success: true });
  expect(await updateItem(id, added.item!.id, input)).toMatchObject({ success: false });
  expect(await updateItem(id, added.item!.id, { ...input, testCases: [{ input: "", expectedOutput: "", visible: false }] })).toMatchObject({ success: false });
  const choice = await createItem(id, { kind: "multiple_choice", title: "Pick one", instructions: "", points: 10, options: ["A", "B"], correctOption: 0 });
  expect(choice).toMatchObject({ success: true });
  expect(await updateItem(id, choice.item!.id, { ...input, testCases: undefined })).toMatchObject({ success: false });
  const post = await readPost(id);
  expect(post.post!.items[2].kind).toBe("multiple_choice");
  expect(post.post!.items[1].testCases).toHaveLength(1);
  expect(post.post!.items[1].testCases[0].expectedOutput).toBe("1");
});
