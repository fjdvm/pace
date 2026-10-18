"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { notifyAssignmentPublished } from "@/lib/notifications";
import { validateAssignment, type AssignmentFormValues } from "@/lib/assignment-form";

export async function updateAssignment(assignmentId: string, values: AssignmentFormValues) {
  try {
    const invalid = validateAssignment(values);
    if (invalid) throw new Error(invalid);

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized: You must be logged in");

    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: { classes: { select: { classId: true } }, _count: { select: { submissions: true } } },
    });
    if (!assignment) throw new Error("Assignment not found");
    if (assignment.createdBy !== user.id) throw new Error("Unauthorized: Only the assignment's creator can edit it");

    const previousClassIds = new Set(assignment.classes.map((c) => c.classId));
    const addedClassIds = values.classIds.filter((id) => !previousClassIds.has(id));
    const locksTestCases = assignment._count.submissions > 0;

    await prisma.$transaction(async (tx) => {
      const ownedClasses = await tx.class.count({ where: { id: { in: values.classIds }, instructorId: user.id } });
      if (ownedClasses !== values.classIds.length) throw new Error("You can only assign to your own classes");

      await tx.assignment.update({
        where: { id: assignmentId },
        data: {
          title: values.title.trim(),
          instructions: values.instructions.trim(),
          language: values.language,
          dueDate: new Date(values.dueDate),
          heartsCount: values.heartsCount,
          heartsRegenMinutes: values.heartsRegenMinutes,
        },
      });

      await tx.assignmentClass.deleteMany({ where: { assignmentId } });
      await tx.assignmentClass.createMany({ data: values.classIds.map((classId) => ({ assignmentId, classId })) });

      if (addedClassIds.length > 0) {
        await tx.post.createMany({
          data: addedClassIds.map((classId) => ({
            classId,
            authorId: user.id,
            type: "assignment_created",
            body: `New assignment posted: ${values.title.trim()}`,
            assignmentId,
          })),
        });
      }

      if (!locksTestCases) {
        await tx.testCase.deleteMany({ where: { assignmentId } });
        await tx.testCase.createMany({
          data: values.testCases.map((tc) => ({
            assignmentId,
            input: tc.input.trim(),
            expectedOutput: tc.expectedOutput.trim(),
            visible: tc.visible,
          })),
        });
      }
    });

    await notifyAssignmentPublished(addedClassIds, { id: assignmentId, title: values.title.trim() }).catch((err) =>
      console.error("Failed to notify students:", err),
    );

    return { success: true };
  } catch (err) {
    console.error("Failed to update assignment:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
