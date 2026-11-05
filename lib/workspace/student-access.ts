import { WorkspaceError } from "./workspace-error";
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
  if (!post) throw new WorkspaceError("Post not found", 404);
  if (post.createdBy === studentId)
    throw new WorkspaceError("Only an enrolled Student can work on this Post", 403);
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      studentId,
      classId: { in: post.classes.map((c) => c.classId) },
      class: { instructorId: { not: studentId } },
    },
  });
  if (!enrollment)
    throw new WorkspaceError("Only an enrolled Student can work on this Post", 403);
  return post;
}
