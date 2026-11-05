"use server";

import { rewardReturnedSubmissions } from "@/lib/submission-return-rewards";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireGradingInstructor } from "@/lib/submission-access";
import { validateGrade } from "@/lib/submission-state";

export async function returnSubmissions(
  postId: string,
  submissionIds: string[],
) {
  await requireGradingInstructor(postId);
  const ids = [...new Set(submissionIds)];
  if (!ids.length || ids.length > 500)
    throw new Error("Select between 1 and 500 Submissions");
  await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM assignments WHERE id = ${postId} FOR UPDATE`;
    const submissions = await tx.submission.findMany({
      where: { id: { in: ids }, assignmentId: postId },
      include: { answers: true, assignment: { include: { items: true } } },
    });
    if (submissions.length !== ids.length)
      throw new Error("Submission not found in this Post");
    for (const submission of submissions) {
      if (submission.status !== "graded")
        throw new Error("Save a draft grade before returning");
      validateGrade(
        submission.assignment.items.map((i) => ({
          itemId: i.id,
          kind: i.kind,
          points: i.points,
        })),
        submission.answers.map((a) => ({ itemId: a.itemId, grade: a.grade })),
        submission.finalGrade,
        true,
      );
    }
    await tx.submission.updateMany({
      where: { id: { in: ids }, assignmentId: postId, status: "graded" },
      data: { status: "returned", returnedAt: new Date() },
    });
  });
  try {
    await rewardReturnedSubmissions(ids);
  } catch (error) {
    console.error("Submissions returned; rewards failed:", error);
  }
  revalidatePath("/dashboard", "layout");
  return { success: true };
}
