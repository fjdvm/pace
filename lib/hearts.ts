import { prisma } from "./prisma";
import { regenerateHearts } from "./hearts-logic";
import { requireStudentPost } from "./workspace/student-access";
import type { Prisma } from "@/lib/generated/prisma/client";

export async function regenerateItemHearts(
  tx: Prisma.TransactionClient,
  studentId: string,
  post: { id: string; heartsCount: number; heartsRegenMinutes: number },
  itemId: string,
) {
  const key = { studentId_itemId: { studentId, itemId } };
  await tx.heartsState.upsert({
    where: key, update: {},
    create: { studentId, assignmentId: post.id, itemId, currentCount: post.heartsCount },
  });
  await tx.$queryRaw`SELECT student_id FROM hearts_states WHERE student_id = ${studentId} AND item_id = ${itemId} FOR UPDATE`;
  const state = await tx.heartsState.findUniqueOrThrow({ where: key });
  return tx.heartsState.update({
    where: key,
    data: regenerateHearts(state, post.heartsCount, post.heartsRegenMinutes),
  });
}

export async function getOrRegenerateHearts(studentId: string, assignmentId: string, itemId?: string) {
  const post = await requireStudentPost(assignmentId, studentId);
  const item = itemId ? post.items.find((i) => i.id === itemId) : post.items[0];
  if (!item) throw new Error("Item not found in this Post");
  return prisma.$transaction((tx) => regenerateItemHearts(tx, studentId, post, item.id));
}
