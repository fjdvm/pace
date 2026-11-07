"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { validateAssignment } from "@/lib/assignment-form";
import { notifyAssignmentPublished } from "@/lib/notifications";

type CreateAssignmentParams =
  import("@/lib/assignment-form").AssignmentFormValues;

export async function createAssignment(params: CreateAssignmentParams) {
  try {
    const {
      title,
      instructions,
      language,
      dueDate,
      heartsCount,
      heartsRegenMinutes,
      classIds,
      testCases,
    } = params;

    const invalid = validateAssignment({ ...params, hasCodingItem: true });
    if (invalid) throw new Error(invalid);

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Unauthorized: You must be logged in");
    }

    const newAssignment = await prisma.$transaction(async (tx) => {
      const ownedClasses = await tx.class.count({
        where: { id: { in: classIds }, instructorId: user.id },
      });
      if (ownedClasses !== classIds.length) {
        throw new Error("You can only assign to your own classes");
      }

      const assignment = await tx.assignment.create({
        data: {
          label: params.label ?? "Assignment",
          isDraft: params.isDraft ?? false,
          title: title.trim(),
          instructions: instructions.trim(),
          language,
          dueDate: new Date(dueDate),
          heartsCount,
          heartsRegenMinutes,
          createdBy: user.id,
        },
      });

      await tx.item.update({
        where: { id: assignment.id },
        data: {
          starterCode: params.starterCode ?? "",
          points: params.points ?? 100,
          ...(params.itemTitle !== undefined
            ? { title: params.itemTitle.trim() }
            : {}),
          ...(params.itemInstructions !== undefined
            ? { instructions: params.itemInstructions.trim() }
            : {}),
        },
      });

      await tx.assignmentClass.createMany({
        data: classIds.map((classId) => ({
          assignmentId: assignment.id,
          classId,
        })),
      });

      await tx.testCase.createMany({
        data: testCases.map((tc) => ({
          assignmentId: assignment.id,
          itemId: assignment.id,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          visible: tc.visible,
        })),
      });

      if (!params.isDraft)
        await tx.post.createMany({
          data: classIds.map((classId) => ({
            classId,
            authorId: user.id,
            type: "assignment_created",
            body: `New assignment posted: ${assignment.title}`,
            assignmentId: assignment.id,
          })),
        });

      return assignment;
    });

    if (!params.isDraft)
      await notifyAssignmentPublished(classIds, newAssignment).catch((err) =>
        console.error("Failed to notify students:", err),
      );

    return { success: true, assignment: newAssignment };
  } catch (err) {
    console.error("Failed to create assignment:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
