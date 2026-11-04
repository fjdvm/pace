"use server";

import { prisma } from "@/lib/prisma";
import { codingItemData, type CodingItemInput } from "@/lib/items/input";
import { currentUserId, requireItemInstructor } from "@/lib/items/permissions";

export async function createItem(assignmentId: string, input: CodingItemInput) {
  try {
    const userId = await currentUserId();
    const data = codingItemData(input);
    const item = await prisma.$transaction(async (tx) => {
      await requireItemInstructor(tx, assignmentId, userId);
      const items = await tx.item.findMany({ where: { assignmentId }, orderBy: { position: "desc" }, take: 1 });
      return tx.item.create({
        data: {
          ...data, assignmentId, position: (items[0]?.position ?? -1) + 1,
          testCases: { create: (input.testCases ?? []).map((tc) => ({ ...tc, assignmentId })) },
        },
      });
    });
    return { success: true, item };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unable to create Item" };
  }
}
