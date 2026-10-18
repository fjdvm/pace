import { prisma } from "@/lib/prisma";
import { computeLevel, getTotalXp } from "@/lib/gamification";
import type { StudentAssignmentStatus, StudentClass, StudentHomeData } from "@/components/features/student/types";

function mondayIndex(date: Date) {
  return (date.getDay() + 6) % 7;
}

function weekStart(now: Date) {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  start.setDate(start.getDate() - mondayIndex(now));
  return start;
}

export async function getStudentClasses(studentId: string): Promise<StudentClass[]> {
  const enrollments = await prisma.enrollment.findMany({
    where: { studentId },
    include: {
      class: {
        include: {
          instructor: { select: { email: true } },
          assignments: {
            include: {
              assignment: {
                include: {
                  heartsStates: { where: { studentId } },
                  submissions: { where: { studentId } },
                },
              },
            },
          },
        },
      },
    },
    orderBy: { enrolledAt: "desc" },
  });

  return enrollments.map((e, classIndex) => ({
    id: e.class.id,
    name: e.class.name,
    instructorEmail: e.class.instructor.email,
    joinCode: e.class.joinCode,
    archived: e.archived || e.class.archived,
    assignments: e.class.assignments.map(({ assignment: a }) => {
      const submission = a.submissions[0];
      const hearts = a.heartsStates[0];
      const status: StudentAssignmentStatus = submission ? "submitted" : hearts ? "in progress" : "not started";
      return {
        id: a.id,
        title: a.title,
        language: a.language,
        dueDate: a.dueDate.toISOString(),
        status,
        classId: e.class.id,
        className: e.class.name,
        classIndex,
        heartsLeft: hearts ? hearts.currentCount : a.heartsCount,
        heartsMax: a.heartsCount,
        score: submission ? submission.score : null,
        submittedAt: submission ? submission.submittedAt.toISOString() : null,
      };
    }),
  }));
}

export async function getStudentHomeData(user: { id: string; name: string | null; email: string }): Promise<StudentHomeData> {
  const now = new Date();
  const [classes, totalXp, submissions] = await Promise.all([
    getStudentClasses(user.id),
    getTotalXp(user.id),
    prisma.submission.findMany({
      where: { studentId: user.id, submittedAt: { gte: weekStart(now) } },
      select: { submittedAt: true },
    }),
  ]);
  const { level, currentXp, nextThreshold } = computeLevel(totalXp);
  const activeDays = [...new Set(submissions.map((s) => mondayIndex(s.submittedAt)))];
  const source = user.name || user.email.split("@")[0];

  return {
    firstName: source.split(/[\s._-]+/)[0],
    classes,
    activeDays,
    xp: { level, currentXp, nextThreshold },
  };
}
