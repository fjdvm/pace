"use server";

import { assertPublishableCodingItems } from "@/lib/items/publishable-coding";
import { multipleChoiceData, type MultipleChoiceInput } from "@/lib/items/multiple-choice";
import { shortAnswerData, type ShortAnswerInput } from "@/lib/items/short-answer";
import { prisma } from "@/lib/prisma";
import { codingItemData, type CodingItemInput } from "@/lib/items/input";
import { currentUserId, requireItemInstructor } from "@/lib/items/permissions";

export async function createItem(assignmentId: string, input: CodingItemInput | MultipleChoiceInput | ShortAnswerInput) {
  try {
    const userId = await currentUserId();
    const data = input.kind === "short_answer" ? shortAnswerData(input as ShortAnswerInput) : input.kind === "multiple_choice" ? multipleChoiceData(input as MultipleChoiceInput) : codingItemData(input as CodingItemInput);
    const item = await prisma.$transaction(async (tx) => {
      const assignment = await requireItemInstructor(tx, assignmentId, userId);
      if (assignment.isDraft === false && data.kind === "coding") {
        assertPublishableCodingItems([{ ...data, testCases: (input as CodingItemInput).testCases ?? [] }]);
      }
      const items = await tx.item.findMany({ where: { assignmentId }, orderBy: { position: "desc" }, take: 1 });
      return tx.item.create({
        data: {
          ...data, assignmentId, position: (items[0]?.position ?? -1) + 1,
          testCases: { create: (data.kind === "coding" ? (input as CodingItemInput).testCases ?? [] : []).map((tc) => ({ ...tc })) },
        },
      });
    });
    return { success: true, item };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unable to create Item" };
  }
}
