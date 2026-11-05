"use server";

import { prisma } from "@/lib/prisma";
import { currentUserId, requireItemInstructor } from "@/lib/items/permissions";

export async function readItems(assignmentId: string) {
  try {
    const userId = await currentUserId();
    return await prisma.$transaction(async (tx) => {
      await requireItemInstructor(tx, assignmentId, userId);
      const items = await tx.item.findMany({
        where: { assignmentId }, orderBy: { position: "asc" }, include: { testCases: true },
      });
      return { success: true as const, items, totalPoints: items.reduce((sum, item) => sum + item.points, 0) };
    });
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : "Unable to read Items" };
  }
}
