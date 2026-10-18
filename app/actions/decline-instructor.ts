"use server";

import { prisma } from "@/lib/prisma";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/require-admin";

export async function declineInstructor(userId: string) {
  try {
    await requireAdmin();

    const instructor = await prisma.user.findUnique({ where: { id: userId } });
    if (!instructor || instructor.role !== "instructor") throw new Error("Instructor not found");

    await prisma.user.update({ where: { id: userId }, data: { approvalStatus: "declined" } });

    const { error } = await createAdminClient().auth.admin.updateUserById(userId, {
      user_metadata: { approval_status: "declined" },
    });
    if (error) throw new Error(`Supabase Auth metadata update failed: ${error.message}`);

    return { success: true };
  } catch (err) {
    console.error("Failed to decline instructor:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
