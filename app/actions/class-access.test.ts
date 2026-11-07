import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mockAuthenticatedUser, mockUnauthenticated } from "../../test/mock-auth";

const db = vi.hoisted(() => ({
  user: { findUnique: vi.fn() },
  class: { findUnique: vi.fn(), create: vi.fn() },
  enrollment: { findUnique: vi.fn(), findMany: vi.fn(), create: vi.fn() },
}));
vi.mock("@/lib/prisma", () => ({ prisma: db }));

beforeEach(() => {
  vi.resetAllMocks();
  mockAuthenticatedUser("new-user");
});
afterEach(() => {
  vi.resetModules();
  vi.doUnmock("@/lib/supabase/server");
});

describe("per-Class access", () => {
  it("lets a signed-in User without global role fields create a Class and receive a join code", async () => {
    db.user.findUnique.mockResolvedValue({ id: "new-user" });
    db.class.findUnique.mockResolvedValue(null);
    db.class.create.mockImplementation(async ({ data }) => ({ id: "class", ...data }));
    const { createClass } = await import("./create-class");

    const result = await createClass(" First Class ");

    expect(result.success).toBe(true);
    expect(result.class).toMatchObject({ name: "First Class", instructorId: "new-user" });
    expect(result.class?.joinCode).toMatch(/^[A-Z0-9]{6}$/);
  });
  it("lets a User who teaches elsewhere join a Class by code", async () => {
    db.user.findUnique.mockResolvedValue({ id: "new-user" });
    db.class.findUnique.mockResolvedValue({ id: "class", name: "Other Class", instructorId: "other" });
    db.enrollment.findUnique.mockResolvedValue(null);
    const { joinClass } = await import("./join-class");

    expect(await joinClass(" abc123 ")).toEqual({ success: true, className: "Other Class" });
  });
  it("tells the Class's own Instructor they already own it", async () => {
    db.class.findUnique.mockResolvedValue({ id: "class", instructorId: "new-user" });
    const { joinClass } = await import("./join-class");

    expect(await joinClass("ABC123")).toEqual({ success: false, error: "You already own this class" });
    expect(db.enrollment.create).not.toHaveBeenCalled();
  });
  it("rejects an enrolled Student requesting the roster", async () => {
    db.class.findUnique.mockResolvedValue({ id: "class", instructorId: "other", instructor: { id: "other" } });
    db.enrollment.findMany.mockResolvedValue([]);
    db.enrollment.findUnique.mockResolvedValue({ studentId: "new-user", classId: "class" });
    const { getClassRoster } = await import("./class-roster");

    expect(await getClassRoster("class")).toMatchObject({ success: false, error: expect.stringContaining("Unauthorized") });
  });
  it("preserves the existing rejection for an already enrolled User", async () => {
    db.class.findUnique.mockResolvedValue({ id: "class", instructorId: "other" });
    db.enrollment.findUnique.mockResolvedValue({ studentId: "new-user", classId: "class" });
    const { joinClass } = await import("./join-class");
    expect(await joinClass("ABC123")).toEqual({ success: false, error: "You are already enrolled in this class" });
    expect(db.enrollment.create).not.toHaveBeenCalled();
  });

  it("requires sign-in to create or join a Class", async () => {
    vi.resetModules();
    mockUnauthenticated();
    const { createClass } = await import("./create-class");
    const { joinClass } = await import("./join-class");
    expect(await createClass("Class")).toMatchObject({ success: false, error: expect.stringContaining("logged in") });
    expect(await joinClass("ABC123")).toMatchObject({ success: false, error: expect.stringContaining("logged in") });
  });
});
