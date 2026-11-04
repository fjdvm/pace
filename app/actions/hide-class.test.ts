import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { mockAuthenticatedUser } from "../../test/mock-auth";

describe("hideClass", () => {
  let instructorId: string;
  let studentId: string;
  let outsiderId: string;
  let classId: string;

  beforeEach(async () => {
    instructorId = randomUUID();
    studentId = randomUUID();
    outsiderId = randomUUID();
    await prisma.user.createMany({
      data: [instructorId, studentId, outsiderId].map((id) => ({ id, email: `u-${id}@test.com` })),
    });
    const cls = await prisma.class.create({
      data: { name: "Hide Test Class", instructorId, joinCode: randomUUID().slice(0, 6).toUpperCase() },
    });
    classId = cls.id;
    await prisma.enrollment.create({ data: { studentId, classId } });
  });

  afterEach(async () => {
    await prisma.class.deleteMany({ where: { id: classId } });
    await prisma.user.deleteMany({ where: { id: { in: [instructorId, studentId, outsiderId] } } });
    vi.resetModules();
    vi.doUnmock("@/lib/supabase/server");
  });

  it("hides the class for the enrolled student only, keeping the enrollment", async () => {
    mockAuthenticatedUser(studentId);
    const { hideClass } = await import("@/app/actions/hide-class");

    const result = await hideClass(classId);

    expect(result.success).toBe(true);
    const enrollment = await prisma.enrollment.findUnique({ where: { studentId_classId: { studentId, classId } } });
    expect(enrollment?.archived).toBe(true);
    const cls = await prisma.class.findUnique({ where: { id: classId } });
    expect(cls?.archived).toBe(false);
  });

  it("rejects a user who is not enrolled", async () => {
    mockAuthenticatedUser(outsiderId);
    const { hideClass } = await import("@/app/actions/hide-class");

    const result = await hideClass(classId);

    expect(result.success).toBe(false);
  });
});
