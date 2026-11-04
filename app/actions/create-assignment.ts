"use server";

import type { PostLabel } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { validateAssignment } from "@/lib/assignment-form";
import { notifyAssignmentPublished } from "@/lib/notifications";

interface TestCaseInput {
  input: string;
  expectedOutput: string;
  visible: boolean;
}

interface CreateAssignmentParams {
  label?: PostLabel;
  isDraft?: boolean;
  title: string;
  instructions: string;
  language: string;
  dueDate: string;
  heartsCount: number;
  heartsRegenMinutes: number;
  classIds: string[];
  testCases: TestCaseInput[];
}

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

    if (params.label !== undefined && !["Assignment", "Activity", "Quiz"].includes(params.label)) throw new Error("Invalid Label");
    if (params.isDraft !== undefined && typeof params.isDraft !== "boolean") throw new Error("Invalid Draft flag");

    const invalid = validateAssignment({ title, instructions, language, dueDate, heartsCount, heartsRegenMinutes, classIds, testCases });
    if (invalid) {
      throw new Error(invalid);
    }

    if (!title || title.trim() === "") {
      throw new Error("Title cannot be empty");
    }
    if (!instructions || instructions.trim() === "") {
      throw new Error("Instructions cannot be empty");
    }
    if (!language) {
      throw new Error("Language must be specified");
    }
    if (!dueDate) {
      throw new Error("Due date must be specified");
    }
    if (!classIds || classIds.length === 0) {
      throw new Error("At least one class must be selected");
    }
    if (!testCases || testCases.length === 0) {
      throw new Error("At least one test case is required");
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Unauthorized: You must be logged in");
    }

    const newAssignment = await prisma.$transaction(async (tx) => {
      const ownedClasses = await tx.class.count({ where: { id: { in: classIds }, instructorId: user.id } });
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

      await tx.assignmentClass.createMany({
        data: classIds.map((classId) => ({
          assignmentId: assignment.id,
          classId,
        })),
      });

      await tx.testCase.createMany({
        data: testCases.map((tc) => ({
          assignmentId: assignment.id,
          input: tc.input.trim(),
          expectedOutput: tc.expectedOutput.trim(),
          visible: tc.visible,
        })),
      });

      if (!params.isDraft) await tx.post.createMany({
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

    if (!params.isDraft) await notifyAssignmentPublished(classIds, newAssignment).catch((err) =>
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
