"use server";

import { prisma } from "@/lib/prisma";
import { requireStudentPost } from "@/lib/workspace/student-access";
import { createClient } from "@/lib/supabase/server";

export async function saveDraft(
  assignmentId: string,
  code: string,
  itemId?: string,
) {
  try {
    if (!assignmentId) {
      throw new Error("Assignment ID is required");
    }
    if (code === undefined || code === null) {
      throw new Error("Code content is required");
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Unauthorized: You must be logged in");
    }

    const post = await requireStudentPost(assignmentId, user.id);
    const item = itemId
      ? post.items.find((i) => i.id === itemId)
      : post.items[0];
    if (!item) throw new Error("Item not found in this Post");

    const draft = await prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM assignments WHERE id = ${assignmentId} FOR UPDATE`;
      const existingSubmission = await tx.submission.findUnique({
        where: {
          studentId_assignmentId: {
            studentId: user.id,
            assignmentId,
          },
        },
        select: { id: true },
      });

      if (existingSubmission) {
        throw new Error("Assignment already submitted. Code is read-only.");
      }

      return tx.codeDraft.upsert({
        where: { studentId_itemId: { studentId: user.id, itemId: item.id } },
        update: { code },
        create: {
          studentId: user.id,
          assignmentId,
          itemId: item.id,
          code,
        },
      });
    });

    return { success: true, updatedAt: draft.updatedAt.toISOString() };
  } catch (err) {
    console.error("Failed to save draft:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
