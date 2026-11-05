import { gradePercent } from "@/lib/submission-state";
import { prisma } from "@/lib/prisma";
import { awardSubmissionXp } from "@/lib/gamification";
import { createNotification } from "@/lib/notifications";

export async function rewardReturnedSubmissions(ids: string[]) {
  const submissions = await prisma.submission.findMany({
    where: { id: { in: ids }, status: "returned" },
    include: {
      assignment: { include: { items: { select: { points: true } } } },
    },
  });
  await Promise.allSettled(
    submissions.map(async (submission) => {
      const hearts = await prisma.heartsState.findMany({
        where: {
          studentId: submission.studentId,
          assignmentId: submission.assignmentId,
        },
      });
      const total = submission.assignment.items.reduce(
        (sum, i) => sum + i.points,
        0,
      );
      const percent = gradePercent(submission.finalGrade ?? 0, total);
      await awardSubmissionXp(
        submission.studentId,
        submission.assignmentId,
        percent,
        hearts.reduce((sum, h) => sum + h.totalSpent, 0),
      );
      await createNotification({
        userId: submission.studentId,
        type: "submission_graded",
        title: `${submission.assignment.title} returned`,
        message: `Your grade is ${submission.finalGrade}/${total}.`,
        link: `/dashboard/assignments/${submission.assignmentId}`,
      });
    }),
  );
}
