import { randomUUID } from "node:crypto";
import { expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { seedTeachingReviews } from "../test/teaching-home-fixture";
import { getDashboardClasses } from "./dashboard-classes";

it("counts only published Posts with no Submission by the enrolled Student", async () => {
  const instructorId = randomUUID();
  await prisma.user.create({ data: { id: instructorId, email: `${instructorId}@test.com` } });
  let ids: string[] = [];
  try {
    const fixture = await seedTeachingReviews(instructorId);
    ids = fixture.ids;
    await prisma.assignment.create({ data: {
      title: "Pending", createdBy: instructorId, instructions: "Explain", language: "Python", dueDate: new Date(),
      classes: { create: { classId: fixture.first.id } },
    } });
    const classes = await getDashboardClasses(ids[1]);
    expect(classes.enrolled).toEqual([expect.objectContaining({ id: fixture.first.id, todoCount: 1 })]);
    expect((await getDashboardClasses(ids[2])).enrolled).toEqual([expect.objectContaining({ id: fixture.second.id, todoCount: 0 })]);
  } finally {
    await prisma.user.deleteMany({ where: { id: { in: [instructorId, ...ids] } } });
  }
});
