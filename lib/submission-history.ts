import { prisma } from "@/lib/prisma";
import { isAssignmentInstructor } from "@/lib/assignment-instructor";
import type { StoredBehavioralSignals } from "@/lib/types/behavioral-signals";

export type SubmissionSnapshot = {
  submittedAt: string;
  code: string;
  score: number;
  testResults: unknown;
  behavioralSignals: StoredBehavioralSignals;
  answers: {
    itemId: string;
    code: string;
    score: number;
    testResults: unknown;
  }[];
};

export async function getSubmissionHistory(
  postId: string,
  studentId: string,
  instructorId: string,
) {
  if (!(await isAssignmentInstructor(postId, instructorId))) return [];
  const revisions = await prisma.submissionRevision.findMany({
    where: { assignmentId: postId, studentId },
    orderBy: { withdrawnAt: "desc" },
  });
  return revisions.map((revision) => ({
    id: revision.id,
    withdrawnAt: revision.withdrawnAt.toISOString(),
    snapshot: revision.snapshot as unknown as SubmissionSnapshot,
  }));
}
export type SubmissionHistory = Awaited<
  ReturnType<typeof getSubmissionHistory>
>;
