import { prisma } from "@/lib/prisma";
import { getSystemStatus } from "@/lib/system-status-data";
import type { AdminOverviewData } from "@/components/features/admin/types";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export async function getAdminOverview(): Promise<AdminOverviewData> {
  const since = new Date(Date.now() - WEEK_MS);
  const [students, instructors, submissionsThisWeek, tutorQuestionsThisWeek, system] = await Promise.all([
    prisma.user.count({ where: { enrollments: { some: {} } } }),
    prisma.user.count({ where: { classes: { some: {} } } }),
    prisma.submission.count({ where: { submittedAt: { gte: since } } }),
    prisma.chatMessage.count({ where: { role: "user", createdAt: { gte: since } } }),
    getSystemStatus(),
  ]);

  return {
    counts: { students, instructors, submissionsThisWeek, tutorQuestionsThisWeek },
    status: system.items,
    operational: system.operational,
  };
}
