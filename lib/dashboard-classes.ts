import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { getDisplayName } from "@/lib/display-name";

const instructorSelect = { select: { name: true, email: true } } as const;

export const getDashboardClasses = cache(async (userId: string) => {
  const [teaching, enrollments] = await Promise.all([
    prisma.class.findMany({
      where: { instructorId: userId },
      select: { id: true, name: true, archived: true, joinCode: true, instructor: instructorSelect },
      orderBy: { createdAt: "desc" },
    }),
    prisma.enrollment.findMany({
      where: { studentId: userId },
      select: {
        archived: true,
        class: { select: { id: true, name: true, archived: true, instructor: instructorSelect } },
      },
      orderBy: { enrolledAt: "desc" },
    }),
  ]);
  return {
    teaching: teaching.map(({ instructor, ...cls }) => ({
      ...cls,
      instructorName: getDisplayName(instructor),
    })),
    enrolled: enrollments.map(({ archived, class: { instructor, ...cls } }) => ({
      ...cls,
      archived: archived || cls.archived,
      instructorName: getDisplayName(instructor),
    })),
  };
});

export type DashboardClasses = Awaited<ReturnType<typeof getDashboardClasses>>;
