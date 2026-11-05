import { prisma } from "@/lib/prisma";
import { isAssignmentInstructor } from "@/lib/assignment-instructor";
import { studentFlag } from "@/lib/insights/student-flag";
import type { StoredBehavioralSignals } from "@/lib/types/behavioral-signals";
import { getDisplayName } from "@/lib/display-name";
import type { DetailTestResult } from "@/components/features/instructor/submissions/detail/types";
import type { SubmissionStatus } from "@/lib/submission-state";

export async function getSubmissionReview(
  postId: string,
  studentId: string,
  instructorId: string,
) {
  if (!(await isAssignmentInstructor(postId, instructorId))) return null;
  const post = await prisma.assignment.findUnique({
    where: { id: postId },
    include: {
      items: { orderBy: { position: "asc" } },
      classes: { include: { class: { select: { name: true } } } },
      submissions: {
        include: { student: true, answers: true },
        orderBy: { submittedAt: "asc" },
      },
    },
  });
  const submission = post?.submissions.find((s) => s.studentId === studentId);
  if (!post || !submission) return null;
  return {
    submissionId: submission.id,
    status: submission.status as SubmissionStatus,
    finalGrade: submission.finalGrade,
    reviewed: submission.reviewedAt !== null,
    feedback: submission.feedback ?? "",
    className: post.classes.map((c) => c.class.name).join(", "),
    students: post.submissions.map((s) => ({
      id: s.studentId,
      submissionId: s.id,
      name: getDisplayName(s.student),
      status: s.status as SubmissionStatus,
      flag: studentFlag(
        s.behavioralSignals as unknown as StoredBehavioralSignals,
        s.answers,
        post.items.map((i) => i.id),
      ),
    })),
    items: post.items.map((item) => {
      const answer = submission.answers.find((a) => a.itemId === item.id);
      return {
        id: item.id,
        title: item.title,
        kind: item.kind,
        options: item.options,
        correctOption: item.correctOption,
        points: item.points,
        language: item.language,
        code:
          answer?.code ??
          (item.id === submission.itemId ? submission.code : ""),
        autoGrade: item.kind === "short_answer" ? null :
          ((answer?.score ??
            (item.id === submission.itemId ? submission.score : 0)) /
            100) *
          item.points,
        grade: answer?.grade ?? null,
        tests: (answer?.testResults ?? []) as DetailTestResult[],
      };
    }),
  };
}
export type SubmissionReview = NonNullable<
  Awaited<ReturnType<typeof getSubmissionReview>>
>;
