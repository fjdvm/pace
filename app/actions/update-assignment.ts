"use server";

import { hasStudentWork } from "@/lib/items/started";
import { prisma } from "@/lib/prisma";
import { isAssignmentInstructor } from "@/lib/assignment-instructor";
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
      include: { items: { orderBy: { position: "asc" }, take: 1 }, classes: { select: { classId: true } },
        _count: { select: { submissions: true, codeDrafts: true, heartsStates: true, chatMessages: true } } },
    });
    if (!assignment) throw new Error("Assignment not found");
    if (!(await isAssignmentInstructor(assignmentId, user.id))) throw new Error("Unauthorized: Only the class's instructor can edit this assignment");

    const previousClassIds = new Set(assignment.classes.map((c) => c.classId));
    const addedClassIds = values.classIds.filter((id) => !previousClassIds.has(id));
    const locksTestCases = hasStudentWork(assignment._count);
    if (locksTestCases && values.language !== assignment.language) throw new Error("Cannot change language after a Student has started");
    const itemId = assignment.items[0]?.id;
    if (!itemId) throw new Error("Coding Item not found");

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

      if (!assignment.isDraft && addedClassIds.length > 0) {
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
        await tx.testCase.deleteMany({ where: { assignmentId, itemId } });
        await tx.testCase.createMany({
          data: values.testCases.map((tc) => ({
            assignmentId,
            itemId,
            input: tc.input.trim(),
            expectedOutput: tc.expectedOutput.trim(),
            visible: tc.visible,
          })),
        });
      }
    });

    await notifyAssignmentPublished(assignment.isDraft ? [] : addedClassIds, { id: assignmentId, title: values.title.trim() }).catch((err) =>
      console.error("Failed to notify students:", err),
    );

    return { success: true };
  } catch (err) {
    console.error("Failed to update assignment:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
