import { prisma } from "@/lib/prisma";
import { getDisplayName } from "@/lib/display-name";
import { splitClassName } from "@/lib/class-name";
import type { SupportedLanguage } from "@/lib/similarity/tokenizer";
import { computeSimilarityPairs } from "@/lib/similarity/assignment-pairs";
import type { StoredBehavioralSignals } from "@/lib/types/behavioral-signals";
import {
  averageByHeartsBucket,
  buildFlags,
  median,
  mostFailedTest,
  scoreBands,
  studentStatus,
} from "@/lib/assignment-overview";
import type { AssignmentOverview, SubmissionStudentRow } from "@/components/features/instructor/submissions/types";

export async function getAssignmentOverview(
  instructorId: string,
  assignmentId: string,
): Promise<AssignmentOverview | null> {
  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    include: {
      testCases: { orderBy: { id: "asc" } },
      classes: {
        include: {
          class: { include: { enrollments: { include: { student: { select: { id: true, name: true, email: true } } } } } },
        },
      },
    },
  });
  if (!assignment || assignment.createdBy !== instructorId) return null;

  const activeClasses = assignment.classes.map((l) => l.class).filter((c) => !c.archived);
  const [submissions, heartsStates, drafts] = await Promise.all([
    prisma.submission.findMany({ where: { assignmentId } }),
    prisma.heartsState.findMany({ where: { assignmentId } }),
    prisma.codeDraft.findMany({ where: { assignmentId }, select: { studentId: true } }),
  ]);

  const roster = Array.from(
    new Map(activeClasses.flatMap((c) => c.enrollments.map((e) => [e.student.id, e.student] as const))).values(),
  );
  const names = new Map(roster.map((s) => [s.id, getDisplayName(s)]));
  const pairs = await computeSimilarityPairs(assignment.language as SupportedLanguage, submissions);
  const topSimilarity = new Map<string, number>();
  for (const pair of pairs) {
    for (const id of [pair.studentAId, pair.studentBId]) {
      topSimilarity.set(id, Math.max(topSimilarity.get(id) ?? 0, pair.similarity));
    }
  }

  const heartsBy = new Map(heartsStates.map((h) => [h.studentId, h.totalSpent]));
  const submissionBy = new Map(submissions.map((s) => [s.studentId, s]));
  const started = new Set([...heartsStates.map((h) => h.studentId), ...drafts.map((d) => d.studentId)]);

  const students: SubmissionStudentRow[] = roster.map((student) => {
    const submission = submissionBy.get(student.id);
    const signals = submission?.behavioralSignals as StoredBehavioralSignals | undefined;
    return {
      studentId: student.id,
      name: names.get(student.id) ?? student.email,
      email: student.email,
      status: studentStatus({ submitted: !!submission, started: started.has(student.id) }),
      score: submission ? submission.score : null,
      hearts: heartsBy.get(student.id) ?? 0,
      flags: submission
        ? buildFlags({
            similarity: topSimilarity.get(student.id) ?? null,
            riskFlag: signals?.riskScore?.flag ?? null,
            pasteDominance: signals?.riskScore?.components.pasteDominance ?? 0,
          })
        : [],
      submittedAt: submission?.submittedAt.toISOString() ?? null,
    };
  });
  const order = { submitted: 0, "in-progress": 1, "not-started": 2 };
  students.sort((a, b) => order[a.status] - order[b.status] || (b.score ?? 0) - (a.score ?? 0) || a.name.localeCompare(b.name));

  const rosterIds = new Set(roster.map((r) => r.id));
  const scores = submissions.filter((s) => rosterIds.has(s.studentId)).map((s) => s.score);
  const totalHearts = roster.reduce((sum, s) => sum + (heartsBy.get(s.id) ?? 0), 0);

  return {
    assignment: {
      id: assignment.id,
      title: assignment.title,
      language: assignment.language,
      classCodes: activeClasses.map((c) => splitClassName(c.name).code).join(", "),
      dueDate: assignment.dueDate.toISOString(),
      heartsCount: assignment.heartsCount,
    },
    students,
    stats: {
      submitted: scores.length,
      total: roster.length,
      average: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null,
      median: median(scores),
      avgHearts: roster.length ? Math.round((totalHearts / roster.length) * 10) / 10 : 0,
    },
    insights: {
      bands: scoreBands(scores),
      byHearts: averageByHeartsBucket(submissions.map((s) => ({ score: s.score, hearts: heartsBy.get(s.studentId) ?? 0 }))),
      mostFailed: mostFailedTest(
        assignment.testCases,
        submissions.map((s) => s.testResults as { testCaseId: string; passed: boolean }[]),
      ),
    },
    pairs: pairs.map((p) => ({
      aId: p.studentAId,
      aName: names.get(p.studentAId) ?? "Student",
      bId: p.studentBId,
      bName: names.get(p.studentBId) ?? "Student",
      similarity: p.similarity,
    })),
    narrative: assignment.statsReportNarrative,
  };
}
