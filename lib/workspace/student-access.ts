import { prisma } from "@/lib/prisma";

export async function requireStudentPost(
  assignmentId: string,
  studentId: string,
) {
  const post = await prisma.assignment.findUnique({
    where: { id: assignmentId, isDraft: false },
    include: {
      classes: true,
      items: { orderBy: { position: "asc" }, include: { testCases: true } },
    },
  });
  if (!post) throw new Error("Post not found");
  if (post.createdBy === studentId)
    throw new Error("Only an enrolled Student can work on this Post");
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      studentId,
      classId: { in: post.classes.map((c) => c.classId) },
      class: { instructorId: { not: studentId } },
    },
  });
  if (!enrollment)
    throw new Error("Only an enrolled Student can work on this Post");
  return post;
}
