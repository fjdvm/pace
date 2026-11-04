import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { updateSession } from "./middleware";

type CookieAdapter = {
  setAll(cookies: { name: string; value: string; options: { path: string; httpOnly: boolean } }[]): void;
};
const mocks = vi.hoisted(() => ({
  getUser: vi.fn(), findUnique: vi.fn(), signOut: vi.fn(),
  cookies: undefined as CookieAdapter | undefined,
}));
vi.mock("@supabase/ssr", () => ({
  createServerClient: (_url: string, _key: string, options: { cookies: CookieAdapter }) => {
    mocks.cookies = options.cookies;
    return { auth: mocks };
  },
}));
vi.mock("@/lib/prisma", () => ({ prisma: { user: { findUnique: mocks.findUnique } } }));

beforeEach(() => {
  vi.resetAllMocks();
  mocks.getUser.mockResolvedValue({ data: { user: { id: "user" } } });
  mocks.findUnique.mockResolvedValue({ isAdmin: false });
});
const visit = (path: string) => updateSession(new NextRequest(`https://pace.example${path}`));
const adminPaths = [
  "/dashboard/admin", "/dashboard/admin/settings",
  "/dashboard/admin/study-results", "/dashboard/admin/study-results/export",
];
const legacyPaths = [
  "/dashboard/student", "/dashboard/student/", "/dashboard/student/todo",
  "/dashboard/student/classes/class-1", "/dashboard/student/assignments/a",
  "/dashboard/instructor", "/dashboard/instructor/", "/dashboard/instructor/assignments/new",
  "/dashboard/instructor/submissions/a/b", "/dashboard/instructor/classes/class-2",
];

describe("session guard", () => {
  it.each(["/dashboard", "/dashboard/classes/c", ...adminPaths, ...legacyPaths])(
    "sends signed-out requests for %s to login", async (path) => {
      mocks.getUser.mockResolvedValue({ data: { user: null } });
      expect((await visit(path)).headers.get("location")).toBe("https://pace.example/login");
    },
  );

  it("sends a signed-in User on login to the dashboard", async () => {
    expect((await visit("/login")).headers.get("location")).toBe("https://pace.example/dashboard");
  });

  it.each(legacyPaths)("sends legacy bookmark %s to the dashboard", async (path) => {
    expect((await visit(path)).headers.get("location")).toBe("https://pace.example/dashboard");
  });

  it.each(adminPaths)("redirects non-admins away from %s", async (path) => {
    expect((await visit(path)).headers.get("location")).toBe("https://pace.example/dashboard");
  });

  it.each(adminPaths)("allows Admins on %s", async (path) => {
    mocks.findUnique.mockResolvedValue({ isAdmin: true });
    expect((await visit(path)).headers.get("x-middleware-next")).toBe("1");
  });

  it.each(["/dashboard", "/dashboard/classes/c", "/dashboard/todo", "/dashboard/assignments/a"])(
    "allows authenticated Users without legacy role, approval or email confirmation metadata on %s", async (path) => {
      expect((await visit(path)).headers.get("x-middleware-next")).toBe("1");
    },
  );

  it.each(["/", "/login", "/terms", "/privacy", "/research"])(
    "keeps public route %s accessible when signed out", async (path) => {
      mocks.getUser.mockResolvedValue({ data: { user: null } });
      expect((await visit(path)).headers.get("x-middleware-next")).toBe("1");
    },
  );

  it.each(["/dashboard/student-tools", "/dashboard/instructor-tools", "/dashboard/administrator"])(
    "does not mistake %s for a legacy or Admin route", async (path) => {
      expect((await visit(path)).headers.get("x-middleware-next")).toBe("1");
    },
  );

  it("returns an unavailable application profile to login", async () => {
    mocks.findUnique.mockResolvedValue(null);
    expect((await visit("/dashboard")).headers.get("location")).toBe("https://pace.example/login?error=google_sign_in");
  });

  it.each(["/dashboard", "/login", "/dashboard/student/todo", "/dashboard/admin/settings"])(
    "preserves refreshed session cookies on %s", async (path) => {
      mocks.getUser.mockImplementation(async () => {
        mocks.cookies!.setAll([{
          name: "session", value: "refreshed", options: { path: "/", httpOnly: true },
        }]);
        return { data: { user: { id: "user" } } };
      });
      const response = await visit(path);
      expect(response.cookies.get("session")).toMatchObject({ value: "refreshed", httpOnly: true, path: "/" });
    },
  );
});
