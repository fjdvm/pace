import { randomUUID } from "node:crypto";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { prisma } from "@/lib/prisma";
import { mockAuthenticatedUser, mockUnauthenticated } from "../../test/mock-auth";

let instructorId: string;

beforeEach(async () => {
  instructorId = randomUUID();
  await prisma.user.create({ data: { id: instructorId, email: `${instructorId}@test.com`, name: "Ernesto Odpaga" } });
  mockAuthenticatedUser(instructorId);
});

afterEach(async () => {
  await prisma.user.delete({ where: { id: instructorId } });
  vi.resetModules();
  vi.doUnmock("@/lib/supabase/server");
});

it("a Class created from Home appears in Teaching with its join code and empty review summary", async () => {
  const { createClass } = await import("./create-class");
  const { getTeachingHome } = await import("./teaching-home");
  const created = await createClass("CS 101 · Programming 1 · BSIT 1-1");
  expect(created.success).toBe(true);
  expect(await getTeachingHome()).toEqual([
    expect.objectContaining({
      id: created.class!.id,
      name: "CS 101 · Programming 1 · BSIT 1-1",
      joinCode: created.class!.joinCode,
      instructorName: "Ernesto Odpaga",
      studentCount: 0,
      reviewCount: 0,
      reviews: [],
    }),
  ]);
});

it("shows only active Classes taught by the signed-in User and scopes review counts to each Class's Students", async () => {
  const { seedTeachingReviews } = await import("../../test/teaching-home-fixture");
  const fixture = await seedTeachingReviews(instructorId);
  try {
    const { getTeachingHome } = await import("./teaching-home");
    const result = await getTeachingHome();
    expect(result).toHaveLength(2);
    expect(result.find((cls) => cls.id === fixture.first.id)).toMatchObject({
      studentCount: 4, reviewCount: 1,
      reviews: [{ assignmentId: fixture.post.id, title: "Sum of Two Numbers", count: 1 }],
    });
    expect(result.find((cls) => cls.id === fixture.second.id)).toMatchObject({ studentCount: 1, reviewCount: 1 });
  } finally {
    await prisma.user.deleteMany({ where: { id: { in: fixture.ids } } });
  }
});

it("requires sign-in and never accepts an Instructor ID from the caller", async () => {
  vi.resetModules();
  mockUnauthenticated();
  const { getTeachingHome } = await import("./teaching-home");
  await expect(getTeachingHome()).rejects.toThrow("logged in");
});
