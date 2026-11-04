import { prisma } from "@/lib/prisma";

export async function isAssignmentInstructor(assignmentId: string, userId: string) {
  const links = await prisma.assignmentClass.findMany({
    where: { assignmentId },
    select: { class: { select: { instructorId: true } } },
  });

  return links.length > 0 && links.every(({ class: cls }) => cls.instructorId === userId);
}
