import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const getDashboardClasses = cache(async (userId: string) => {
  const [teaching, enrollments] = await Promise.all([
    prisma.class.findMany({
      where: { instructorId: userId },
      select: { id: true, name: true, archived: true, joinCode: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.enrollment.findMany({
      where: { studentId: userId },
      select: { archived: true, class: { select: { id: true, name: true, archived: true } } },
      orderBy: { enrolledAt: "desc" },
    }),
  ]);
  return {
    teaching,
    enrolled: enrollments.map(({ archived, class: cls }) => ({
      ...cls,
      archived: archived || cls.archived,
    })),
  };
});

export type DashboardClasses = Awaited<ReturnType<typeof getDashboardClasses>>;
