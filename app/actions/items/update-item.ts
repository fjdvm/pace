"use server";

import { prisma } from "@/lib/prisma";
import { codingItemData, type CodingItemInput } from "@/lib/items/input";
import { currentUserId, requireItemInstructor } from "@/lib/items/permissions";
import { hasStudentWork } from "@/lib/items/started";

export async function updateItem(assignmentId: string, itemId: string, input: CodingItemInput) {
  try {
    const userId = await currentUserId();
    const data = codingItemData(input);
    const item = await prisma.$transaction(async (tx) => {
      const assignment = await requireItemInstructor(tx, assignmentId, userId);
      const existing = await tx.item.findUnique({ where: { id: itemId, assignmentId } });
      if (!existing) throw new Error("Item not found");
      const updatedData = { ...data, starterCode: input.starterCode ?? existing.starterCode };
      if (hasStudentWork(assignment._count) && (
        input.testCases !== undefined || data.language !== existing.language || updatedData.starterCode !== existing.starterCode
      )) throw new Error("Cannot change coding configuration after a Student has started");
      if (input.testCases !== undefined) {
        await tx.testCase.deleteMany({ where: { itemId, assignmentId } });
        await tx.testCase.createMany({ data: input.testCases.map((tc) => ({ ...tc, itemId, assignmentId })) });
      }
      return tx.item.update({ where: { id: itemId, assignmentId }, data: updatedData });
    });
    return { success: true, item };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unable to update Item" };
  }
}
