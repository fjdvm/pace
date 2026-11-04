"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function startAssignment(assignmentId: string) {
  try {
    if (!assignmentId) {
      throw new Error("Assignment ID is required");
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId, isDraft: false },
    });

    if (!assignment) {
      throw new Error("Assignment not found");
    }

    let heartsState = await prisma.heartsState.findUnique({
      where: {
        studentId_assignmentId: {
          studentId: user.id,
          assignmentId,
        },
      },
    });

    if (!heartsState) {
      heartsState = await prisma.heartsState.create({
        data: {
          studentId: user.id,
          assignmentId,
          currentCount: assignment.heartsCount,
        },
      });
    }

    return { success: true, heartsState };
  } catch (err) {
    console.error("Failed to start assignment:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
