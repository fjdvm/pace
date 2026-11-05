"use server";

import { getOrRegenerateHearts } from "@/lib/hearts";
import { createClient } from "@/lib/supabase/server";

export async function startAssignment(assignmentId: string, itemId?: string) {
  try {
    if (!assignmentId) throw new Error("Post ID is required");
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");
    const heartsState = await getOrRegenerateHearts(user.id, assignmentId, itemId);
    return { success: true, heartsState };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
