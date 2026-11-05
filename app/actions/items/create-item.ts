"use server";

import { multipleChoiceData, type MultipleChoiceInput } from "@/lib/items/multiple-choice";
import { prisma } from "@/lib/prisma";
import { codingItemData, type CodingItemInput } from "@/lib/items/input";
import { currentUserId, requireItemInstructor } from "@/lib/items/permissions";

export async function createItem(assignmentId: string, input: CodingItemInput | MultipleChoiceInput) {
  try {
    const userId = await currentUserId();
    const data = input.kind === "multiple_choice" ? multipleChoiceData(input as MultipleChoiceInput) : codingItemData(input as CodingItemInput);
    const item = await prisma.$transaction(async (tx) => {
      await requireItemInstructor(tx, assignmentId, userId);
      const items = await tx.item.findMany({ where: { assignmentId }, orderBy: { position: "desc" }, take: 1 });
      return tx.item.create({
        data: {
          ...data, assignmentId, position: (items[0]?.position ?? -1) + 1,
          testCases: { create: ((input as CodingItemInput).testCases ?? []).map((tc) => ({ ...tc, assignmentId })) },
        },
      });
    });
    return { success: true, item };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unable to create Item" };
  }
}
