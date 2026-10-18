import { prisma } from "@/lib/prisma";
import { instructorLastName } from "@/lib/instructor-name";
import { isDueWithinWeek } from "@/lib/instructor-dates";
import type { StoredBehavioralSignals } from "@/lib/types/behavioral-signals";
import type { InstructorHomeData } from "@/components/features/instructor/types";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function ownedActive(instructorId: string) {
  return {
    assignment: {
      createdBy: instructorId,
      classes: { some: { class: { archived: false } } },
    },
  };
}

export function countRecentSubmissions(instructorId: string) {
  return prisma.submission.count({
    where: { ...ownedActive(instructorId), submittedAt: { gte: new Date(Date.now() - WEEK_MS) } },
  });
}

async function countFlagged(instructorId: string) {
  const rows = await prisma.submission.findMany({
    where: ownedActive(instructorId),
    select: { behavioralSignals: true },
  });
  return rows.filter((row) => {
    const flag = (row.behavioralSignals as StoredBehavioralSignals | null)?.riskScore?.flag;
    return flag === "High" || flag === "Medium";
  }).length;
}

export async function getInstructorHomeData(user: {
  id: string;
  name: string | null;
  email: string;
}): Promise<InstructorHomeData> {
  const [classes, assignments, newSubmissions, flagged] = await Promise.all([
    prisma.class.findMany({
      where: { instructorId: user.id, archived: false },
      include: { enrollments: { select: { studentId: true } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.assignment.findMany({
      where: { createdBy: user.id, classes: { some: { class: { archived: false } } } },
      include: {
        classes: { include: { class: { include: { enrollments: { select: { studentId: true } } } } } },
        submissions: { select: { score: true } },
      },
      orderBy: { dueDate: "asc" },
    }),
    countRecentSubmissions(user.id),
    countFlagged(user.id),
  ]);

  const studentIds = new Set(classes.flatMap((c) => c.enrollments.map((e) => e.studentId)));

  const rows = assignments.map((a) => {
    const active = a.classes.filter((link) => !link.class.archived);
    const roster = new Set(active.flatMap((link) => link.class.enrollments.map((e) => e.studentId)));
    const scores = a.submissions.map((s) => s.score);
    return {
      id: a.id,
      title: a.title,
      language: a.language,
      dueDate: a.dueDate.toISOString(),
      classes: active.map((link) => ({ id: link.class.id, name: link.class.name })),
      submittedCount: scores.length,
      totalStudents: roster.size,
      averageScore: scores.length ? Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length) : null,
      heartsCount: a.heartsCount,
      heartsRegenMinutes: a.heartsRegenMinutes,
    };
  });

  return {
    greetingName: instructorLastName(user),
    classes: classes.map((c) => ({
      id: c.id,
      name: c.name,
      joinCode: c.joinCode,
      studentCount: c.enrollments.length,
    })),
    studentCount: studentIds.size,
    stats: {
      newSubmissions,
      dueThisWeek: rows.filter((r) => isDueWithinWeek(r.dueDate)).length,
      flagged,
    },
    assignments: rows,
  };
}
