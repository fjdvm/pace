import { prisma } from "@/lib/prisma";
import { getOrRegenerateHearts } from "@/lib/hearts";
import { getDisplayName } from "@/lib/display-name";
import { deriveItemStatus } from "./item-status";
import type { StudentAssignmentData } from "./types";

export async function loadStudentAssignment(
  assignmentId: string,
  userId: string,
): Promise<StudentAssignmentData | null> {
  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    include: { instructor: { select: { id: true, email: true, name: true } }, classes: { select: { classId: true } } },
  });
  if (!assignment) return null;

  const enrollment = await prisma.enrollment.findFirst({
    where: { studentId: userId, classId: { in: assignment.classes.map((c) => c.classId) } },
    select: { classId: true, class: { select: { name: true } } },
  });
  if (!enrollment) return null;

  const [hearts, submission, draft, post] = await Promise.all([
    getOrRegenerateHearts(userId, assignmentId),
    prisma.submission.findUnique({
      where: { studentId_assignmentId: { studentId: userId, assignmentId } },
      select: { id: true },
    }),
    prisma.codeDraft.findUnique({
      where: { studentId_assignmentId: { studentId: userId, assignmentId } },
      select: { studentId: true },
    }),
    prisma.post.findFirst({
      where: { assignmentId, classId: enrollment.classId },
      include: { comments: { orderBy: { createdAt: "asc" } } },
    }),
  ]);

  const instructorName = getDisplayName(assignment.instructor);
  const toView = (c: { id: string; authorId: string; body: string; createdAt: Date }) => ({
    id: c.id,
    authorId: c.authorId,
    body: c.body,
    createdAt: c.createdAt.toISOString(),
  });

  return {
    id: assignment.id,
    title: assignment.title,
    classId: enrollment.classId,
    className: enrollment.class.name,
    instructions: assignment.instructions,
    language: assignment.language,
    dueDate: assignment.dueDate.toISOString(),
    postedAt: (post?.createdAt ?? assignment.createdAt).toISOString(),
    instructorName,
    heartsLeft: hearts.currentCount,
    heartsMax: assignment.heartsCount,
    items: [
      {
        id: assignment.id,
        title: assignment.title,
        kind: "coding",
        status: deriveItemStatus(!!submission, !!draft),
      },
    ],
    comments: post
      ? {
          postId: post.id,
          currentUserId: userId,
          instructorId: assignment.instructor.id,
          instructorName,
          classComments: post.comments.filter((c) => c.visibility === "class").map(toView),
          privateThread: post.comments
            .filter((c) => c.visibility === "private" && c.threadStudentId === userId)
            .map(toView),
        }
      : null,
  };
}
