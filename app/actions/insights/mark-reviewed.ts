"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireGradingInstructor } from "@/lib/submission-access";

export async function markSubmissionReviewed(postId: string, submissionId: string, reviewed = true) {
  await requireGradingInstructor(postId);
  const { count } = await prisma.submission.updateMany({
    where: { id: submissionId, assignmentId: postId },
    data: { reviewedAt: reviewed ? new Date() : null },
  });
  if (count === 0) throw new Error("Submission not found");
  revalidatePath(`/dashboard/submissions/${postId}`, "layout");
}
