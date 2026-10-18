import { prisma } from "@/lib/prisma";
import { instructorLastName } from "@/lib/instructor-name";
import { getInstructorAssignmentRows } from "@/lib/instructor-assignment-rows";
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
  const [classes, rows, newSubmissions, flagged] = await Promise.all([
    prisma.class.findMany({
      where: { instructorId: user.id, archived: false },
      include: { enrollments: { select: { studentId: true } } },
      orderBy: { createdAt: "asc" },
    }),
    getInstructorAssignmentRows(user.id),
    countRecentSubmissions(user.id),
    countFlagged(user.id),
  ]);

  const studentIds = new Set(classes.flatMap((c) => c.enrollments.map((e) => e.studentId)));

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
