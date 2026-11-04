import { createClient } from "@/lib/supabase/server";
import type { Prisma } from "@/lib/generated/prisma/client";

export async function currentUserId() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return user.id;
}

export async function requireItemInstructor(tx: Prisma.TransactionClient, assignmentId: string, userId: string) {
  await tx.$queryRaw`SELECT id FROM assignments WHERE id = ${assignmentId} FOR UPDATE`;
  const assignment = await tx.assignment.findUnique({
    where: { id: assignmentId },
    include: {
      classes: { select: { class: { select: { instructorId: true } } } },
      _count: { select: { codeDrafts: true, submissions: true, heartsStates: true, chatMessages: true } },
    },
  });
  if (!assignment) throw new Error("Post not found");
  if (!assignment.classes.length || assignment.classes.some(({ class: cls }) => cls.instructorId !== userId)) {
    throw new Error("Only the Instructor of every linked Class can manage Items");
  }
  return assignment;
}
