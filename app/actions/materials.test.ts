import { randomUUID } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "@/lib/prisma";
import { mockAuthenticatedUser, mockUnauthenticated } from "../../test/mock-auth";

describe("Material server actions", () => {
  const instructorId = randomUUID();
  const studentId = randomUUID();
  const outsiderId = randomUUID();
  let classId: string;

  beforeEach(async () => {
    await prisma.user.createMany({ data: [instructorId, studentId, outsiderId].map((id) => ({ id, email: `${id}@test.com` })) });
    const cls = await prisma.class.create({ data: { name: "Materials", instructorId, joinCode: randomUUID() } });
    classId = cls.id;
    await prisma.enrollment.create({ data: { classId, studentId } });
  });
  afterEach(async () => {
    await prisma.class.deleteMany({ where: { id: classId } });
    await prisma.user.deleteMany({ where: { id: { in: [instructorId, studentId, outsiderId] } } });
    vi.resetModules();
    vi.doUnmock("@/lib/supabase/server");
  });

  it("shares titled reading in the Instructor and enrolled Student Stream", async () => {
    mockAuthenticatedUser(instructorId);
    const { createMaterial } = await import("./materials");
    const created = await createMaterial(classId, " Week 1 slides ", " Read before class ", "https://example.com/slides");
    expect(created.success).toBe(true);
    for (const id of [instructorId, studentId]) {
      vi.resetModules();
      mockAuthenticatedUser(id);
      const { getClassStream } = await import("./class-stream");
      const stream = await getClassStream(classId);
      expect(stream.posts).toEqual([expect.objectContaining({ type: "material", title: "Week 1 slides", body: "Read before class", linkUrl: "https://example.com/slides", assignmentId: null })]);
    }
  });
  it("allows only the Class Instructor to create or remove Material", async () => {
    mockAuthenticatedUser(instructorId);
    const { createMaterial } = await import("./materials");
    const created = await createMaterial(classId, "Reading", "Notes");
    expect(created.success).toBe(true);
    for (const id of [studentId, outsiderId]) {
      vi.resetModules();
      mockAuthenticatedUser(id);
      const material = await import("./materials");
      const { deletePost } = await import("./posts");
      expect((await material.createMaterial(classId, "Reading", "Notes")).success).toBe(false);
      expect((await deletePost(created.postId!)).success).toBe(false);
    }
    vi.resetModules();
    mockAuthenticatedUser(outsiderId);
    const { getClassStream } = await import("./class-stream");
    expect((await getClassStream(classId)).success).toBe(false);
    vi.resetModules();
    mockUnauthenticated();
    const anonymous = await import("./materials");
    const anonymousPosts = await import("./posts");
    expect((await anonymous.createMaterial(classId, "Reading", "Notes")).success).toBe(false);
    expect((await anonymousPosts.deletePost(created.postId!)).success).toBe(false);
    vi.resetModules();
    mockAuthenticatedUser(instructorId);
    const { deletePost } = await import("./posts");
    expect((await deletePost(created.postId!)).success).toBe(true);
    const stream = await import("./class-stream");
    expect((await stream.getClassStream(classId)).posts).toEqual([]);
  });

  it("accepts notes or a safe link and requires a title and content", async () => {
    mockAuthenticatedUser(instructorId);
    const { createMaterial } = await import("./materials");
    expect((await createMaterial(classId, "Notes", "Read this")).success).toBe(true);
    expect((await createMaterial(classId, "Slides", "", "https://example.com")).success).toBe(true);
    for (const [title, notes, link] of [[" ", "Notes", ""], ["Title", " ", ""], ["Title", "", "javascript:alert(1)"], ["Title", "", "invalid"]]) {
      expect((await createMaterial(classId, title, notes, link)).success).toBe(false);
    }
    await prisma.class.update({ where: { id: classId }, data: { archived: true } });
    expect((await createMaterial(classId, "Archived", "Notes")).success).toBe(false);
  });
});
