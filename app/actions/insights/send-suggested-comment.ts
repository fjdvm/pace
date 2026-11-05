"use server";

import { prisma } from "@/lib/prisma";
import { requireGradingInstructor } from "@/lib/submission-access";
import { createComment } from "@/app/actions/comments";

export async function sendSuggestedComment(postId: string, studentId: string, body: string) {
  const user = await requireGradingInstructor(postId);
  const text = typeof body === "string" ? body.trim() : "";
  if (!text) throw new Error("Write a comment first");
  if (text.length > 2000) throw new Error("The comment is too long");
  const entry = await prisma.post.findFirst({
    where: {
      assignmentId: postId,
      class: { instructorId: user.id, enrollments: { some: { studentId } } },
    },
    select: { id: true },
  });
  if (!entry) throw new Error("This Student is not in a Class that has this Post in its Stream");
  const result = await createComment(entry.id, text, "private", studentId);
  if (!result.success) throw new Error(result.error);
}
