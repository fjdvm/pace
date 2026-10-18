import { prisma } from "@/lib/prisma";
import type { InstructorClassSummary } from "@/components/features/instructor/types";

export async function getInstructorClasses(instructorId: string): Promise<InstructorClassSummary[]> {
  const classes = await prisma.class.findMany({
    where: { instructorId, archived: false },
    include: { _count: { select: { enrollments: true } } },
    orderBy: { createdAt: "asc" },
  });
  return classes.map((c) => ({ id: c.id, name: c.name, joinCode: c.joinCode, studentCount: c._count.enrollments }));
}
