import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";

export async function seedTeachingReviews(instructorId: string) {
  const ids = Array.from({ length: 7 }, () => randomUUID());
  const [otherInstructor, firstStudent, secondStudent, reviewedStudent, returnedStudent, gradedStudent, outsider] = ids;
  await prisma.user.createMany({ data: ids.map((id) => ({ id, email: `${id}@test.com` })) });
  async function makeClass(owner: string, name: string, archived = false) {
    return prisma.class.create({ data: { instructorId: owner, name, archived, joinCode: randomUUID().slice(0, 6) } });
  }
  const first = await makeClass(instructorId, "First Class");
  const second = await makeClass(instructorId, "Second Class");
  const archived = await makeClass(instructorId, "Archived Class", true);
  const foreign = await makeClass(otherInstructor, "Foreign Class");
  await prisma.enrollment.createMany({ data: [
    ...[firstStudent, reviewedStudent, returnedStudent, gradedStudent].map((studentId) => ({ studentId, classId: first.id })),
    { studentId: secondStudent, classId: second.id },
  ] });
  const post = await prisma.assignment.create({ data: {
    title: "Sum of Two Numbers", createdBy: instructorId, instructions: "Add", language: "Python", dueDate: new Date(),
    classes: { create: [first, second, archived].map((cls) => ({ classId: cls.id })) },
  }, include: { items: true } });
  await prisma.submission.createMany({ data: [
    { studentId: firstStudent }, { studentId: secondStudent }, { studentId: outsider },
    { studentId: reviewedStudent, reviewedAt: new Date() },
    { studentId: returnedStudent, status: "returned" as const, finalGrade: 80, returnedAt: new Date() },
    { studentId: gradedStudent, status: "graded" as const },
  ].map((row) => ({ ...row, assignmentId: post.id, itemId: post.items[0].id, code: "", score: 0, testResults: [], behavioralSignals: {} })) });
  const draft = await prisma.assignment.create({ data: {
    title: "Draft", isDraft: true, createdBy: instructorId, instructions: "", language: "Python", dueDate: new Date(),
    classes: { create: { classId: first.id } },
  }, include: { items: true } });
  await prisma.submission.create({ data: {
    studentId: firstStudent, assignmentId: draft.id, itemId: draft.items[0].id, code: "", score: 0, testResults: [], behavioralSignals: {},
  } });
  return { ids, first, second, archived, foreign, post };
}
