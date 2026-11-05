"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireGradingInstructor } from "@/lib/submission-access";
import { validateGrade, type ItemGrade } from "@/lib/submission-state";

export async function saveSubmissionGrade(
  postId: string,
  submissionId: string,
  grades: ItemGrade[],
  finalGrade: number | null,
  feedback: string,
) {
  await requireGradingInstructor(postId);
  if (typeof feedback !== "string" || feedback.length > 10000)
    throw new Error("Feedback is too long");
  await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM assignments WHERE id = ${postId} FOR UPDATE`;
    const submission = await tx.submission.findUnique({
      where: { id: submissionId, assignmentId: postId },
      include: { answers: true, assignment: { include: { items: true } } },
    });
    if (!submission || submission.status === "returned")
      throw new Error("Submission is missing or already Returned");
    const items = submission.assignment.items.map((i) => ({
      itemId: i.id,
      kind: i.kind,
      points: i.points,
    }));
    if (grades.length !== items.length)
      throw new Error("Provide a grade or blank for every Item");
    const grade = validateGrade(items, grades, finalGrade, false);
    if (
      grades.some((g) => !submission.answers.some((a) => a.itemId === g.itemId))
    )
      throw new Error("Submission answer not found");
    for (const item of grades) {
      await tx.submissionAnswer.update({
        where: { submissionId_itemId: { submissionId, itemId: item.itemId } },
        data: { grade: item.grade },
      });
    }
    await tx.submission.update({
      where: { id: submissionId },
      data: {
        status: "graded",
        finalGrade: grades.some((g) => g.grade === null) ? finalGrade : grade,
        feedback: feedback.trim() || null,
      },
    });
  });
  revalidatePath("/dashboard", "layout");
  return { success: true };
}

export async function deleteSubmissionGrade(
  postId: string,
  submissionId: string,
) {
  await requireGradingInstructor(postId);
  await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM assignments WHERE id = ${postId} FOR UPDATE`;
    const submission = await tx.submission.findUnique({
      where: { id: submissionId, assignmentId: postId },
    });
    if (!submission || submission.status !== "graded")
      throw new Error("Only a draft grade can be deleted");
    await tx.submissionAnswer.updateMany({
      where: { submissionId },
      data: { grade: null },
    });
    await tx.submission.update({
      where: { id: submissionId },
      data: { status: "turned_in", finalGrade: null, feedback: null },
    });
  });
  revalidatePath("/dashboard", "layout");
  return { success: true };
}
