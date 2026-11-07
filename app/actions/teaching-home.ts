"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { getDisplayName } from "@/lib/display-name";

export async function getTeachingHome() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized: You must be logged in");

  const classes = await prisma.class.findMany({
    where: { instructorId: user.id, archived: false },
    orderBy: { createdAt: "desc" },
    select: {
      id: true, name: true, joinCode: true,
      instructor: { select: { name: true, email: true } },
      enrollments: { select: { studentId: true } },
      assignments: {
        where: { assignment: { isDraft: false } },
        orderBy: { assignment: { createdAt: "desc" } },
        select: {
          assignment: {
            select: {
              id: true, title: true,
              submissions: {
                where: { status: "turned_in", reviewedAt: null },
                select: { studentId: true },
              },
            },
          },
        },
      },
    },
  });

  return classes.map(({ instructor, enrollments, assignments, ...cls }) => {
    const students = new Set(enrollments.map((e) => e.studentId));
    const reviews = assignments.flatMap(({ assignment }) => {
      const count = assignment.submissions.filter((s) => students.has(s.studentId)).length;
      return count ? [{ assignmentId: assignment.id, title: assignment.title, count }] : [];
    });
    return {
      ...cls,
      instructorName: getDisplayName(instructor),
      studentCount: students.size,
      reviewCount: reviews.reduce((total, review) => total + review.count, 0),
      reviews,
    };
  });
}

export type TeachingHomeClass = Awaited<ReturnType<typeof getTeachingHome>>[number];
