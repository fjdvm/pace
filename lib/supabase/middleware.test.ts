import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { updateSession } from "./middleware";

const mocks = vi.hoisted(() => ({ getUser: vi.fn(), findUnique: vi.fn(), signOut: vi.fn() }));
vi.mock("@supabase/ssr", () => ({ createServerClient: () => ({ auth: mocks }) }));
vi.mock("@/lib/prisma", () => ({ prisma: { user: { findUnique: mocks.findUnique } } }));

beforeEach(() => {
  vi.resetAllMocks();
  mocks.getUser.mockResolvedValue({ data: { user: { id: "user", email_confirmed_at: "2026-11-04" } } });
});
const visit = (path: string) => updateSession(new NextRequest(`https://pace.example${path}`));

describe("admin route access", () => {
  it("allows a student with the Admin flag to open settings", async () => {
    mocks.findUnique.mockResolvedValue({ role: "student", approvalStatus: "approved", isAdmin: true });
    expect((await visit("/dashboard/admin/settings")).headers.get("location")).toBeNull();
  });
});

it.each(["student", "instructor", "admin"])("redirects a non-admin with legacy role %s away from admin pages", async (role) => {
  mocks.findUnique.mockResolvedValue({ role, approvalStatus: "approved", isAdmin: false });
  for (const path of ["/dashboard/admin", "/dashboard/admin/settings", "/dashboard/admin/study-results", "/dashboard/admin/study-results/export"]) {
    const response = await visit(path);
    expect(response.headers.get("location")).toBe(`https://pace.example/dashboard/${role === "admin" ? "student" : role}`);
  }
});
it("redirects a signed-out visitor to login", async () => {
  mocks.getUser.mockResolvedValue({ data: { user: null } });
  expect((await visit("/dashboard/admin/settings")).headers.get("location")).toBe("https://pace.example/login");
});
it("allows a pending instructor with the Admin flag to open research results", async () => {
  mocks.findUnique.mockResolvedValue({ role: "instructor", approvalStatus: "pending", isAdmin: true });
  expect((await visit("/dashboard/admin/study-results")).headers.get("location")).toBeNull();
});
it("lets a legacy Admin use the regular dashboard navigation", async () => {
  mocks.findUnique.mockResolvedValue({ role: "admin", approvalStatus: "approved", isAdmin: true });
  expect((await visit("/dashboard/student")).headers.get("location")).toBeNull();
});
