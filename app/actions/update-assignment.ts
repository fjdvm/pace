"use server";

import { assertPublishableCodingItems } from "@/lib/items/publishable-coding";
import { prisma } from "@/lib/prisma";
import { currentUserId, requireItemInstructor } from "@/lib/items/permissions";
import { hasStudentWork } from "@/lib/items/started";
import { notifyAssignmentPublished } from "@/lib/notifications";
import {
  validateAssignment,
  type AssignmentFormValues,
} from "@/lib/assignment-form";
import { sameTestCases } from "@/lib/items/same-test-cases";

export async function updateAssignment(
  assignmentId: string,
  values: AssignmentFormValues,
) {
  try {
    const invalid = validateAssignment(values);
    if (invalid) throw new Error(invalid);
    const userId = await currentUserId();
    const notifyClassIds = await prisma.$transaction(async (tx) => {
      const assignment = await requireItemInstructor(tx, assignmentId, userId);
      if (!assignment.isDraft && values.isDraft)
        throw new Error("An assigned Post cannot become a Draft");
      const item = await tx.item.findFirst({
        where: { assignmentId, kind: "coding", ...(values.itemId ? { id: values.itemId } : {}) },
        orderBy: { position: "asc" },
      });
      if (!item) throw new Error("Coding Item not found");
      const locked = hasStudentWork(assignment._count);
      const tests = await tx.testCase.findMany({
        where: { assignmentId, itemId: item.id },
      });
      if (
        locked &&
        (values.language !== item.language ||
          (values.starterCode !== undefined &&
            values.starterCode !== item.starterCode) ||
          !sameTestCases(values.testCases, tests))
      ) {
        throw new Error(
          "Cannot change coding configuration after a Student has started",
        );
      }
      const ownedClasses = await tx.class.count({
        where: { id: { in: values.classIds }, instructorId: userId },
      });
      if (ownedClasses !== values.classIds.length)
        throw new Error("You can only assign to your own classes");
      const isDraft = values.isDraft ?? assignment.isDraft;
      const previousIds = new Set(
        assignment.classes.map((link) => link.classId),
      );
      const removedIds = assignment.classes
        .filter((link) => !values.classIds.includes(link.classId))
        .map((link) => link.classId);
      if (locked && removedIds.length)
        throw new Error("Cannot remove a Class after a Student has started");
      const publishIds = isDraft
        ? []
        : values.classIds.filter(
            (id) => assignment.isDraft || !previousIds.has(id),
          );

      await tx.assignment.update({
        where: { id: assignmentId },
        data: {
          title: values.title.trim(),
          instructions: values.instructions.trim(),
          language: values.language,
          label: values.label ?? assignment.label,
          isDraft,
          dueDate: new Date(values.dueDate),
          heartsCount: values.heartsCount,
          heartsRegenMinutes: values.heartsRegenMinutes,
        },
      });
      await tx.item.update({
        where: { id: item.id },
        data: {
          title: values.itemTitle?.trim() ?? item.title,
          instructions:
            values.itemInstructions?.trim() ?? values.instructions.trim(),
          language: values.language,
          starterCode: values.starterCode ?? item.starterCode,
          points: values.points ?? item.points,
        },
      });
      await tx.assignmentClass.deleteMany({ where: { assignmentId } });
      await tx.assignmentClass.createMany({
        data: values.classIds.map((classId) => ({ assignmentId, classId })),
      });
      if (removedIds.length)
        await tx.post.deleteMany({
          where: {
            assignmentId,
            classId: { in: removedIds },
            type: "assignment_created",
          },
        });
      if (publishIds.length)
        await tx.post.createMany({
          data: publishIds.map((classId) => ({
            classId,
            authorId: userId,
            type: "assignment_created",
            body: `New assignment posted: ${values.title.trim()}`,
            assignmentId,
          })),
        });
      if (!locked) {
        await tx.testCase.deleteMany({
          where: { assignmentId, itemId: item.id },
        });
        await tx.testCase.createMany({
          data: values.testCases.map((tc) => ({
            ...tc,
            assignmentId,
            itemId: item.id,
          })),
        });
      }
      if (!isDraft) {
        const codingItems = await tx.item.findMany({
          where: { assignmentId, kind: "coding" }, include: { testCases: true },
        });
        assertPublishableCodingItems(codingItems);
      }
      return publishIds;
    });
    if (notifyClassIds.length)
      await notifyAssignmentPublished(notifyClassIds, {
        id: assignmentId,
        title: values.title.trim(),
      }).catch((error) => console.error("Failed to notify Students:", error));
    return { success: true, savedAt: new Date().toISOString() };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unable to save Post",
    };
  }
}
