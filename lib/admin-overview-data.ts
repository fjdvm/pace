import { prisma } from "@/lib/prisma";
import { getDisplayName } from "@/lib/display-name";
import { getSystemStatus } from "@/lib/system-status-data";
import type { AdminOverviewData, InstructorRequest } from "@/components/features/admin/types";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function toRequest(user: { id: string; name: string | null; email: string; createdAt: Date; approvalStatus: string }): InstructorRequest {
  return {
    id: user.id,
    name: getDisplayName(user),
    email: user.email,
    createdAt: user.createdAt.toISOString(),
    status: user.approvalStatus,
  };
}

export async function getPendingInstructors() {
  const users = await prisma.user.findMany({
    where: { role: "instructor", approvalStatus: "pending" },
    orderBy: { createdAt: "asc" },
  });
  return users.map(toRequest);
}

export async function getReviewedInstructors() {
  const users = await prisma.user.findMany({
    where: { role: "instructor", approvalStatus: { not: "pending" } },
    orderBy: { createdAt: "desc" },
  });
  return users.map(toRequest);
}

export async function getAdminOverview(): Promise<AdminOverviewData> {
  const since = new Date(Date.now() - WEEK_MS);
  const [students, instructors, submissionsThisWeek, tutorQuestionsThisWeek, pending, system] = await Promise.all([
    prisma.user.count({ where: { role: "student" } }),
    prisma.user.count({ where: { role: "instructor", approvalStatus: "approved" } }),
    prisma.submission.count({ where: { submittedAt: { gte: since } } }),
    prisma.chatMessage.count({ where: { role: "user", createdAt: { gte: since } } }),
    getPendingInstructors(),
    getSystemStatus(),
  ]);

  return {
    counts: { students, instructors, submissionsThisWeek, tutorQuestionsThisWeek },
    pending,
    status: system.items,
    operational: system.operational,
  };
}
