"use server";

import { prisma } from "@/lib/prisma";
import { currentUserId, requireItemInstructor } from "@/lib/items/permissions";
import { hasStudentWork } from "@/lib/items/started";

export async function deleteItem(assignmentId: string, itemId: string) {
  try {
    const userId = await currentUserId();
    await prisma.$transaction(async (tx) => {
      const assignment = await requireItemInstructor(tx, assignmentId, userId);
      const item = await tx.item.findUnique({ where: { id: itemId, assignmentId } });
      if (!item) throw new Error("Item not found");
      if (hasStudentWork(assignment._count)) throw new Error("Cannot delete an Item after a Student has started");
      if (await tx.item.count({ where: { assignmentId } }) <= 1) throw new Error("A Post must have at least one Item");
      await tx.item.delete({ where: { id: itemId, assignmentId } });
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unable to delete Item" };
  }
}
