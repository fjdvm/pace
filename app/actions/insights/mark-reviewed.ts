"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireGradingInstructor } from "@/lib/submission-access";

export async function markSubmissionReviewed(postId: string, submissionId: string) {
  await requireGradingInstructor(postId);
  const { count } = await prisma.submission.updateMany({
    where: { id: submissionId, assignmentId: postId },
    data: { reviewedAt: new Date() },
  });
  if (count === 0) throw new Error("Submission not found");
  revalidatePath(`/dashboard/submissions/${postId}`, "layout");
}
