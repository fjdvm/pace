import { prisma } from "@/lib/prisma";
import { getClassStream } from "@/app/actions/class-stream";
import { getClassRoster } from "@/app/actions/class-roster";
import { getClassLeaderboardTabData } from "@/app/actions/class-leaderboard";
import { getStudentClasses } from "@/lib/student-home-data";
import type { ClassPageData } from "@/components/features/class-page/types";

async function countTurnedIn(classId: string, assignmentIds: string[]) {
  const rows = await prisma.submission.groupBy({
    by: ["assignmentId"],
    where: { assignmentId: { in: assignmentIds }, student: { enrollments: { some: { classId } } } },
    _count: { _all: true },
  });
  return new Map(rows.map((r) => [r.assignmentId, r._count._all]));
}

export async function loadClassPageData(classId: string, userId: string): Promise<ClassPageData | null> {
  const cls = await prisma.class.findUnique({
    where: { id: classId },
    include: { instructor: { select: { id: true, email: true, name: true } } },
  });
  if (!cls) return null;
  const isInstructor = cls.instructorId === userId;
  if (!isInstructor) {
    const enrollment = await prisma.enrollment.findUnique({
      where: { studentId_classId: { studentId: userId, classId } },
    });
    if (!enrollment) return null;
  }

  const [stream, roster, board] = await Promise.all([
    getClassStream(classId),
    isInstructor ? getClassRoster(classId) : Promise.resolve({ success: true, students: [] }),
    getClassLeaderboardTabData(classId),
  ]);
  const base = {
    classId,
    className: cls.name,
    joinCode: cls.joinCode,
    archived: cls.archived,
    currentUserId: userId,
    posts: stream.success ? stream.posts! : [],
    roster: roster.success ? roster.students! : [],
    leaderboard: board.success ? board.leaderboard! : [],
    myRank: board.success ? board.myRank : 0,
    instructor: cls.instructor,
  };

  if (!isInstructor) {
    const classes = await getStudentClasses(userId);
    return { ...base, role: "student", assignments: classes.find((c) => c.id === classId)?.assignments ?? [] };
  }

  const links = await prisma.assignmentClass.findMany({
    where: { classId },
    include: { assignment: { include: { _count: { select: { classes: true, testCases: true } } } } },
    orderBy: { assignment: { createdAt: "desc" } },
  });
  const turnedIn = await countTurnedIn(classId, links.map((l) => l.assignmentId));
  const assigned = roster.success ? roster.students!.length : 0;
  return {
    ...base,
    role: "instructor",
    assignments: links.map(({ assignment: a }) => ({
      id: a.id,
      title: a.title,
      isDraft: a.isDraft,
      language: a.language,
      dueDate: a.dueDate.toISOString(),
      testCaseCount: a._count.testCases,
      turnedIn: turnedIn.get(a.id) ?? 0,
      assigned,
      isSharedWithOtherClasses: a._count.classes > 1,
    })),
  };
}
