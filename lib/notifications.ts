import { prisma } from "./prisma";

export type NotificationType = "badge_earned" | "submission_graded" | "hearts_regenerated" | "private_comment" | "assignment_published";

interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
}

export async function createNotification(input: CreateNotificationInput) {
  return prisma.notification.create({
    data: {
      userId: input.userId,
      type: input.type,
      title: input.title,
      message: input.message,
      link: input.link,
    },
  });
}

export async function createNotifications(inputs: CreateNotificationInput[]) {
  if (inputs.length === 0) return;
  await prisma.notification.createMany({
    data: inputs.map((input) => ({
      userId: input.userId,
      type: input.type,
      title: input.title,
      message: input.message,
      link: input.link,
    })),
  });
}

export async function notifyAssignmentPublished(
  classIds: string[],
  assignment: { id: string; title: string },
) {
  if (classIds.length === 0) return;
  const enrollments = await prisma.enrollment.findMany({
    where: { classId: { in: classIds }, archived: false },
    select: { studentId: true },
  });
  const studentIds = Array.from(new Set(enrollments.map((e) => e.studentId)));
  await createNotifications(
    studentIds.map((userId) => ({
      userId,
      type: "assignment_published" as const,
      title: "New assignment",
      message: `${assignment.title} is ready in your workspace.`,
      link: `/dashboard/student/assignments/${assignment.id}`,
    })),
  );
}
