import { isLate, studentGrade } from "@/lib/submission-state";
import type { DetailTestResult } from "@/components/features/instructor/submissions/detail/types";
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
    where: { id: assignmentId, isDraft: false },
    include: {
      items: { orderBy: { position: "asc" } },
      instructor: { select: { id: true, email: true, name: true } },
      classes: { select: { classId: true } },
    },
  });
  if (!assignment) return null;

  const enrollment = await prisma.enrollment.findFirst({
    where: {
      studentId: userId,
      classId: { in: assignment.classes.map((c) => c.classId) },
    },
    select: { classId: true, class: { select: { name: true } } },
  });
  if (!enrollment) return null;

  const [hearts, submission, drafts, post] = await Promise.all([
    getOrRegenerateHearts(userId, assignmentId),
    prisma.submission.findUnique({
      where: { studentId_assignmentId: { studentId: userId, assignmentId } },
      include: { answers: true },
    }),
    prisma.codeDraft.findMany({
      where: { studentId: userId, assignmentId },
      select: { itemId: true },
    }),
    prisma.post.findFirst({
      where: { assignmentId, classId: enrollment.classId },
      include: { comments: { orderBy: { createdAt: "asc" } } },
    }),
  ]);

  const codingItem = assignment.items[0];
  if (!codingItem) return null;

  const instructorName = getDisplayName(assignment.instructor);
  const toView = (c: {
    id: string;
    authorId: string;
    body: string;
    createdAt: Date;
  }) => ({
    id: c.id,
    authorId: c.authorId,
    body: c.body,
    createdAt: c.createdAt.toISOString(),
  });

  const results = (
    submission?.answers.flatMap((a) => a.testResults as DetailTestResult[]) ??
    []
  ).filter((r) => r.visible !== false);
  const heartStates = await prisma.heartsState.findMany({
    where: { studentId: userId, assignmentId },
  });
  return {
    monitoringEnabled: assignment.monitoringEnabled,
    aiTutorEnabled: assignment.aiTutorEnabled,
    totalPoints: assignment.items.reduce((sum, i) => sum + i.points, 0),
    submission: submission
      ? {
          status: submission.status,
          submittedAt: submission.submittedAt.toISOString(),
          returnedAt: submission.returnedAt?.toISOString() ?? null,
          late: isLate(assignment.dueDate, submission.submittedAt),
          ...studentGrade(submission),
          heartsUsed: heartStates.reduce((sum, h) => sum + h.totalSpent, 0),
          visiblePassed: results.filter((r) => r.passed).length,
          visibleTotal: results.length,
        }
      : null,
    id: assignment.id,
    title: assignment.title,
    classId: enrollment.classId,
    className: enrollment.class.name,
    instructions: codingItem.instructions,
    language: codingItem.language,
    dueDate: assignment.dueDate.toISOString(),
    postedAt: (post?.createdAt ?? assignment.createdAt).toISOString(),
    instructorName,
    heartsLeft: hearts.currentCount,
    heartsMax: assignment.heartsCount,
    items: assignment.items.map((item) => ({
      id: item.id,
      title: item.title,
      kind: item.kind,
      points: item.points,
      grade:
        submission?.status === "returned"
          ? (submission.answers.find((a) => a.itemId === item.id)?.grade ??
            null)
          : null,
      passed: (
        (submission?.answers.find((a) => a.itemId === item.id)?.testResults ??
          []) as DetailTestResult[]
      ).filter(
        (r) =>
          r.passed &&
          (submission?.status === "returned" || r.visible !== false),
      ).length,
      tests: (
        (submission?.answers.find((a) => a.itemId === item.id)?.testResults ??
          []) as DetailTestResult[]
      ).filter((r) => submission?.status === "returned" || r.visible !== false)
        .length,
      status: deriveItemStatus(
        !!submission,
        drafts.some((d) => d.itemId === item.id),
      ),
    })),
    comments: post
      ? {
          postId: post.id,
          currentUserId: userId,
          instructorId: assignment.instructor.id,
          instructorName,
          classComments: post.comments
            .filter((c) => c.visibility === "class")
            .map(toView),
          privateThread: post.comments
            .filter(
              (c) => c.visibility === "private" && c.threadStudentId === userId,
            )
            .map(toView),
        }
      : null,
  };
}
