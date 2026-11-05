"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { requireStudentPost } from "@/lib/workspace/student-access";

export async function readWorkspaceDraft(assignmentId: string, itemId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const post = await requireStudentPost(assignmentId, user.id);
  if (!post.items.some((i) => i.id === itemId))
    throw new Error("Item not found in this Post");
  return prisma.codeDraft.findUnique({
    where: { studentId_itemId: { studentId: user.id, itemId } },
  });
}

export async function deleteWorkspaceDraft(
  assignmentId: string,
  itemId: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const post = await requireStudentPost(assignmentId, user.id);
  if (!post.items.some((i) => i.id === itemId))
    throw new Error("Item not found in this Post");
  if (
    await prisma.submission.findUnique({
      where: { studentId_assignmentId: { studentId: user.id, assignmentId } },
    })
  ) {
    throw new Error("Post already turned in");
  }
  await prisma.codeDraft.deleteMany({
    where: { studentId: user.id, assignmentId, itemId },
  });
  return { success: true };
}
