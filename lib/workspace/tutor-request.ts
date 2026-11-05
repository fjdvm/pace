import { prisma } from "@/lib/prisma";
import { regenerateItemHearts } from "@/lib/hearts";

export async function recordTutorRequest(
  studentId: string,
  post: { id: string; heartsCount: number; heartsRegenMinutes: number },
  itemId: string,
  message: string,
) {
  return prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM assignments WHERE id = ${post.id} FOR UPDATE`;
    const submission = await tx.submission.findUnique({
      where: { studentId_assignmentId: { studentId, assignmentId: post.id } },
    });
    if (submission) throw new Error("Post already turned in. Chat is read-only.");
    const state = await regenerateItemHearts(tx, studentId, post, itemId);
    if (state.currentCount <= 0) throw new Error("0 hearts remaining. Wait for regeneration.");
    const hearts = await tx.heartsState.update({
      where: { studentId_itemId: { studentId, itemId } },
      data: {
        currentCount: { decrement: 1 }, totalSpent: { increment: 1 },
        lastRegenAt: state.currentCount === post.heartsCount ? new Date() : state.lastRegenAt,
      },
    });
    await tx.chatMessage.create({
      data: { studentId, assignmentId: post.id, itemId, role: "user", content: message },
    });
    return hearts;
  });
}
