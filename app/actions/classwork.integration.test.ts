import { randomUUID } from "node:crypto";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { prisma } from "@/lib/prisma";
import { mockAuthenticatedUser } from "../../test/mock-auth";

let instructorId: string;
let studentId: string;
let classId: string;
beforeEach(async () => {
  instructorId = randomUUID(); studentId = randomUUID(); classId = randomUUID();
  await prisma.user.createMany({ data: [instructorId, studentId].map((id) => ({ id, email: `${id}@test.com` })) });
  await prisma.class.create({ data: { id: classId, instructorId, name: "CS 101", joinCode: randomUUID() } });
  await prisma.enrollment.create({ data: { classId, studentId } });
  mockAuthenticatedUser(instructorId);
});
afterEach(async () => {
  await prisma.user.deleteMany({ where: { id: { in: [instructorId, studentId] } } });
  vi.resetModules(); vi.doUnmock("@/lib/supabase/server");
});

it("lists saved Drafts and published Posts with Student counts, scoped to the Class", async () => {
  const { createAssignment } = await import("./create-assignment");
  const { updateAssignment } = await import("./update-assignment");
  const { loadClassPageData } = await import("@/components/features/dashboard/home/load-class-page-data");
  const values = {
    title: "Sum of Two Numbers", instructions: "Print one", language: "Python", dueDate: "2099-10-21T23:59", isDraft: true,
    heartsCount: 3, heartsRegenMinutes: 15, classIds: [classId],
    testCases: [{ input: "", expectedOutput: "1", visible: true }],
  };
  const created = await createAssignment(values);
  expect(created.success).toBe(true);
  const id = created.assignment!.id;
  let data = await loadClassPageData(classId, instructorId);
  expect(data).toMatchObject({ role: "instructor", assignments: [{ id, isDraft: true, assigned: 1, turnedIn: 0 }] });
  expect(await updateAssignment(id, { ...values, isDraft: false })).toMatchObject({ success: true });
  await prisma.submission.create({ data: {
    studentId, assignmentId: id, itemId: id, code: "1", score: 1, testResults: [], behavioralSignals: {},
  } });
  data = await loadClassPageData(classId, instructorId);
  expect(data).toMatchObject({ assignments: [{ id, isDraft: false, assigned: 1, turnedIn: 1 }] });
  const foreign = await prisma.class.create({ data: { instructorId, name: "Other", joinCode: randomUUID() } });
  expect(await loadClassPageData(foreign.id, instructorId)).toMatchObject({ assignments: [] });
  expect(await loadClassPageData(foreign.id, studentId)).toBeNull();
});
