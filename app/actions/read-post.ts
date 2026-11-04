"use server";

import { prisma } from "@/lib/prisma";
import { currentUserId } from "@/lib/items/permissions";

export async function readPost(assignmentId: string) {
  try {
    const userId = await currentUserId();
    const post = await prisma.assignment.findFirst({
      where: { id: assignmentId, OR: [
        { classes: { some: { class: { instructorId: userId } } } },
        { isDraft: false, classes: { some: { class: { enrollments: { some: { studentId: userId } } } } } },
      ] },
      include: {
        classes: { select: { class: { select: { instructorId: true } } } },
        items: { orderBy: { position: "asc" }, include: { testCases: true } },
      },
    });
    if (!post) throw new Error("Post not found");
    const { classes, ...fields } = post;
    const isInstructor = classes.some(({ class: cls }) => cls.instructorId === userId);
    return { success: true, post: {
      ...fields,
      items: post.items.map((item) => ({ ...item, testCases: item.testCases.filter((tc) => isInstructor || tc.visible) })),
      totalPoints: post.items.reduce((sum, item) => sum + item.points, 0),
    } };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unable to read Post" };
  }
}
