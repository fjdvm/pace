"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { requireStudentPost } from "@/lib/workspace/student-access";

export async function unsubmitSubmission(postId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  await requireStudentPost(postId, user.id);
  await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM assignments WHERE id = ${postId} FOR UPDATE`;
    const submission = await tx.submission.findUnique({
      where: {
        studentId_assignmentId: { studentId: user.id, assignmentId: postId },
      },
      include: { answers: true },
    });
    if (!submission || submission.status !== "turned_in")
      throw new Error("Only a Turned in Submission can be unsubmitted");
    const answers = submission.answers.length
      ? submission.answers
      : [{ itemId: submission.itemId, code: submission.code }];
    for (const answer of answers) {
      await tx.codeDraft.upsert({
        where: {
          studentId_itemId: { studentId: user.id, itemId: answer.itemId },
        },
        create: {
          studentId: user.id,
          assignmentId: postId,
          itemId: answer.itemId,
          code: answer.code,
        },
        update: { code: answer.code },
      });
    }
    await tx.submission.delete({ where: { id: submission.id } });
  });
  revalidatePath("/dashboard", "layout");
  return { success: true };
}
