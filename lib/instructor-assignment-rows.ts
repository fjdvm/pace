import { prisma } from "@/lib/prisma";
import type { InstructorAssignmentRow } from "@/components/features/instructor/types";

export async function getInstructorAssignmentRows(instructorId: string): Promise<InstructorAssignmentRow[]> {
  const assignments = await prisma.assignment.findMany({
    where: { createdBy: instructorId, classes: { some: { class: { archived: false } } } },
    include: {
      classes: { include: { class: { include: { enrollments: { select: { studentId: true } } } } } },
      submissions: { select: { score: true } },
    },
    orderBy: { dueDate: "asc" },
  });

  return assignments.map((a) => {
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
}
