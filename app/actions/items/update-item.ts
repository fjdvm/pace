"use server";

import { assertPublishableCodingItems } from "@/lib/items/publishable-coding";
import { multipleChoiceData, type MultipleChoiceInput } from "@/lib/items/multiple-choice";
import { shortAnswerData, type ShortAnswerInput } from "@/lib/items/short-answer";
import { prisma } from "@/lib/prisma";
import { codingItemData, type CodingItemInput } from "@/lib/items/input";
import { currentUserId, requireItemInstructor } from "@/lib/items/permissions";
import { hasStudentWork } from "@/lib/items/started";

export async function updateItem(assignmentId: string, itemId: string, input: CodingItemInput | MultipleChoiceInput | ShortAnswerInput) {
  try {
    const userId = await currentUserId();
    const data = input.kind === "short_answer" ? shortAnswerData(input as ShortAnswerInput) : input.kind === "multiple_choice" ? multipleChoiceData(input as MultipleChoiceInput) : codingItemData(input as CodingItemInput);
    const item = await prisma.$transaction(async (tx) => {
      const assignment = await requireItemInstructor(tx, assignmentId, userId);
      const existing = await tx.item.findUnique({ where: { id: itemId, assignmentId } });
      if (!existing) throw new Error("Item not found");
      if (hasStudentWork(assignment._count) && (
        data.kind !== (existing.kind ?? "coding") ||
        (data.kind === "multiple_choice" && (data.correctOption !== existing.correctOption ||
          JSON.stringify(data.options) !== JSON.stringify(existing.options)))
      )) throw new Error("Cannot change Item kind or answer key after a Student has started");
      const updatedData = { ...data, starterCode: data.kind !== "coding" ? "" : ((input as CodingItemInput).starterCode ?? existing.starterCode) };
      if (hasStudentWork(assignment._count) && (
        (input as CodingItemInput).testCases !== undefined || data.language !== existing.language || updatedData.starterCode !== existing.starterCode
      )) throw new Error("Cannot change coding configuration after a Student has started");
      if (assignment.isDraft === false && data.kind === "coding") {
        const testCases = (input as CodingItemInput).testCases ?? await tx.testCase.findMany({ where: { itemId, assignmentId } });
        assertPublishableCodingItems([{ ...data, testCases }]);
      }
      if (data.kind === "coding" && (input as CodingItemInput).testCases !== undefined) {
        await tx.testCase.deleteMany({ where: { itemId, assignmentId } });
        await tx.testCase.createMany({ data: (input as CodingItemInput).testCases!.map((tc) => ({ ...tc, itemId, assignmentId })) });
      }
      return tx.item.update({ where: { id: itemId, assignmentId }, data: updatedData });
    });
    return { success: true, item };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unable to update Item" };
  }
}
