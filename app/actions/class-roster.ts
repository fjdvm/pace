"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function getClassRoster(classId: string) {
  try {
    if (!classId) throw new Error("Class ID is required");

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized: You must be logged in");

    const cls = await prisma.class.findUnique({
      where: { id: classId },
      include: { instructor: { select: { id: true, email: true, name: true } } },
    });
    if (!cls) throw new Error("Class not found");

    if (cls.instructorId !== user.id) {
      throw new Error("Unauthorized: Only the class's instructor can view the roster");
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { classId },
      include: { student: { select: { id: true, email: true, name: true } } },
      orderBy: { enrolledAt: "asc" },
    });

    return {
      success: true,
      instructor: { id: cls.instructor.id, email: cls.instructor.email, name: cls.instructor.name },
      students: enrollments.map((e) => ({ id: e.student.id, email: e.student.email, name: e.student.name })),
    };
  } catch (err) {
    console.error("Failed to fetch class roster:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
