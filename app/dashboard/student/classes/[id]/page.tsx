import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { getClassStream } from "@/app/actions/class-stream";
import { getClassRoster } from "@/app/actions/class-roster";
import { getClassLeaderboardTabData } from "@/app/actions/class-leaderboard";
import { getStudentClasses } from "@/lib/student-home-data";
import { StudentClassPageView } from "@/components/features/student/classes/student-class-page-view";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function StudentClassDetailPage({ params }: PageProps) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const enrollment = await prisma.enrollment.findUnique({
    where: { studentId_classId: { studentId: user.id, classId: id } },
  });
  if (!enrollment) {
    redirect("/dashboard/student");
  }

  const cls = await prisma.class.findUnique({ where: { id } });
  if (!cls) redirect("/dashboard/student");

  const [streamResult, rosterResult, studentClasses, leaderboardResult] = await Promise.all([
    getClassStream(id),
    getClassRoster(id),
    getStudentClasses(user.id),
    getClassLeaderboardTabData(id),
  ]);

  const assignments = (studentClasses.find((c) => c.id === id)?.assignments ?? []).sort(
    (x, y) => new Date(x.dueDate).getTime() - new Date(y.dueDate).getTime(),
  );

  return (
    <StudentClassPageView
      classId={id}
      className={cls.name}
      joinCode={cls.joinCode}
      classArchived={cls.archived}
      currentUserId={user.id}
      assignments={assignments}
      posts={streamResult.success ? streamResult.posts! : []}
      roster={rosterResult.success ? rosterResult.students! : []}
      instructor={rosterResult.success ? rosterResult.instructor! : { id: cls.instructorId, email: "", name: null }}
      leaderboard={leaderboardResult.success ? leaderboardResult.leaderboard! : []}
    />
  );
}
