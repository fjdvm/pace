"use server";

import { prisma } from "@/lib/prisma";
import { currentUserId } from "@/lib/items/permissions";
import { notifyAssignmentPublished } from "@/lib/notifications";
import { validateSaveInput, type SaveImportInput } from "@/lib/ai-import/save-input";

const DAY = 24 * 60 * 60 * 1000;

export async function saveImportedPost(input: SaveImportInput) {
  try {
    const userId = await currentUserId();
    const records = validateSaveInput(input);
    const dueDate = new Date(Date.now() + 7 * DAY);
    const assignment = await prisma.$transaction(async (tx) => {
      const owned = await tx.class.count({ where: { id: input.classId, instructorId: userId } });
      if (!owned) throw new Error("You can only assign to your own classes");
      const first = records[0].data;
      const post = await tx.assignment.create({
        data: {
          label: "Activity", isDraft: !input.assign, title: input.title.trim(),
          instructions: input.instructions.trim(), language: first.language || "Python",
          dueDate, createdBy: userId,
        },
      });
      await tx.assignmentClass.create({ data: { assignmentId: post.id, classId: input.classId } });
      await tx.testCase.deleteMany({ where: { assignmentId: post.id } });
      await tx.item.deleteMany({ where: { assignmentId: post.id } });
      for (const [position, { item, data }] of records.entries()) {
        await tx.item.create({
          data: {
            ...data, assignmentId: post.id, position,
            testCases: { create: item.testCases.map((t) => ({ assignmentId: post.id, input: t.input, expectedOutput: t.expectedOutput, visible: t.visible })) },
          },
        });
      }
      if (input.assign)
        await tx.post.create({ data: { classId: input.classId, authorId: userId, type: "assignment_created", body: `New assignment posted: ${post.title}`, assignmentId: post.id } });
      return post;
    });
    if (input.assign)
      await notifyAssignmentPublished([input.classId], assignment).catch((e) => console.error("Failed to notify students:", e));
    return { success: true as const, id: assignment.id };
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : "Unable to save" };
  }
}
