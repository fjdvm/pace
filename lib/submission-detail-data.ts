import { prisma } from "@/lib/prisma";
import { getDisplayName } from "@/lib/display-name";
import type { SupportedLanguage } from "@/lib/similarity/tokenizer";
import { computeSimilarityPairs } from "@/lib/similarity/assignment-pairs";
import type { StoredBehavioralSignals } from "@/lib/types/behavioral-signals";
import type {
  CompareData,
  DetailTestResult,
  SubmissionDetail,
} from "@/components/features/instructor/submissions/detail/types";

async function loadOwnedAssignment(instructorId: string, assignmentId: string) {
  const assignment = await prisma.assignment.findUnique({ where: { id: assignmentId } });
  return assignment && assignment.createdBy === instructorId ? assignment : null;
}

export async function getSubmissionDetail(
  instructorId: string,
  assignmentId: string,
  studentId: string,
): Promise<SubmissionDetail | null> {
  const assignment = await loadOwnedAssignment(instructorId, assignmentId);
  if (!assignment) return null;

  const [submissions, student, chat, hearts] = await Promise.all([
    prisma.submission.findMany({
      where: { assignmentId },
      include: { student: { select: { id: true, name: true, email: true } } },
    }),
    prisma.user.findUnique({ where: { id: studentId }, select: { id: true, name: true, email: true } }),
    prisma.chatMessage.findMany({ where: { studentId, assignmentId }, orderBy: { createdAt: "asc" } }),
    prisma.heartsState.findUnique({ where: { studentId_assignmentId: { studentId, assignmentId } } }),
  ]);
  if (!student) return null;

  const names = new Map(submissions.map((s) => [s.studentId, getDisplayName(s.student)]));
  const submission = submissions.find((s) => s.studentId === studentId) ?? null;
  const ordered = [...submissions].sort(
    (a, b) => b.score - a.score || (names.get(a.studentId) ?? "").localeCompare(names.get(b.studentId) ?? ""),
  );
  const index = ordered.findIndex((s) => s.studentId === studentId);

  let similar: SubmissionDetail["similar"] = null;
  if (submission) {
    const pairs = await computeSimilarityPairs(assignment.language as SupportedLanguage, submissions);
    const top = pairs.find((p) => p.studentAId === studentId || p.studentBId === studentId);
    if (top) {
      const otherId = top.studentAId === studentId ? top.studentBId : top.studentAId;
      similar = { studentId: otherId, name: names.get(otherId) ?? "another student", similarity: top.similarity };
    }
  }

  const signals = (submission?.behavioralSignals as StoredBehavioralSignals | undefined) ?? null;

  return {
    assignment: {
      id: assignment.id,
      title: assignment.title,
      language: assignment.language,
      heartsCount: assignment.heartsCount,
    },
    student: { id: student.id, name: getDisplayName(student) },
    submittedAt: submission?.submittedAt.toISOString() ?? null,
    code: submission?.code ?? null,
    score: submission?.score ?? null,
    testResults: (submission?.testResults as DetailTestResult[] | undefined) ?? [],
    signals,
    heartsUsed: hearts?.totalSpent ?? 0,
    minutesOnTask: signals?.totalFocusTimeSecs ? Math.max(1, Math.round(signals.totalFocusTimeSecs / 60)) : null,
    chat: chat.map((m) => ({ role: m.role, content: m.content, createdAt: m.createdAt.toISOString() })),
    similar,
    neighbors: {
      previousId: index > 0 ? ordered[index - 1].studentId : null,
      nextId: index !== -1 && index < ordered.length - 1 ? ordered[index + 1].studentId : null,
    },
  };
}

export async function getCompareData(
  instructorId: string,
  assignmentId: string,
  leftId: string,
  rightId: string,
): Promise<CompareData | null> {
  const assignment = await loadOwnedAssignment(instructorId, assignmentId);
  if (!assignment || leftId === rightId) return null;

  const submissions = await prisma.submission.findMany({
    where: { assignmentId },
    include: { student: { select: { id: true, name: true, email: true } } },
  });
  const left = submissions.find((s) => s.studentId === leftId);
  const right = submissions.find((s) => s.studentId === rightId);
  if (!left || !right) return null;

  const pairs = await computeSimilarityPairs(assignment.language as SupportedLanguage, [left, right]);
  return {
    assignment: { id: assignment.id, title: assignment.title, language: assignment.language },
    similarity: pairs[0]?.similarity ?? 0,
    left: { id: leftId, name: getDisplayName(left.student), code: left.code },
    right: { id: rightId, name: getDisplayName(right.student), code: right.code },
  };
}
