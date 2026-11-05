"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { currentUserId, requireItemInstructor } from "@/lib/items/permissions";

export async function reorderItems(assignmentId: string, itemIds: string[]) {
  try {
    const userId = await currentUserId();
    await prisma.$transaction(async (tx) => {
      await requireItemInstructor(tx, assignmentId, userId);
      const items = await tx.item.findMany({
        where: { assignmentId },
        select: { id: true, position: true },
      });
      if (
        !Array.isArray(itemIds) ||
        itemIds.length !== items.length ||
        new Set(itemIds).size !== items.length ||
        itemIds.some((id) => !items.some((item) => item.id === id))
      )
        throw new Error("Provide every Item in this Post exactly once");
      const offset = Math.max(0, ...items.map((item) => item.position)) + 1;
      for (const [position, id] of itemIds.entries())
        await tx.item.update({
          where: { id, assignmentId },
          data: { position: offset + position },
        });
      for (const [position, id] of itemIds.entries())
        await tx.item.update({
          where: { id, assignmentId },
          data: { position },
        });
    });
    revalidatePath(`/dashboard/assignments/${assignmentId}`);
    revalidatePath(`/dashboard/submissions/${assignmentId}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unable to reorder Items",
    };
  }
}
