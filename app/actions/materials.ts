"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function createMaterial(classId: string, title: string, notes: string, linkUrl?: string) {
  try {
    if (!classId) throw new Error("Class ID is required");
    if (!title?.trim()) throw new Error("Title is required");
    if (!notes?.trim() && !linkUrl?.trim()) throw new Error("Notes or a link are required");
    const link = linkUrl?.trim() || null;
    if (link) {
      const url = new URL(link);
      if (!["http:", "https:"].includes(url.protocol)) throw new Error("Use an http or https link");
    }
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized: You must be logged in");
    const cls = await prisma.class.findUnique({ where: { id: classId } });
    if (!cls) throw new Error("Class not found");
    if (cls.instructorId !== user.id) throw new Error("Only the class's Instructor can share Material");
    if (cls.archived) throw new Error("Cannot share Material in an archived Class");
    const post = await prisma.post.create({ data: {
      classId, authorId: user.id, type: "material", title: title.trim(), body: notes.trim() || null, linkUrl: link,
    } });
    return { success: true, postId: post.id };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to share Material" };
  }
}
