import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { updateSession } from "./session";

const mocks = vi.hoisted(() => ({ getUser: vi.fn() }));
vi.mock("@supabase/ssr", () => ({
  createServerClient: () => ({ auth: mocks }),
}));

const visit = (path: string) => updateSession(new NextRequest(`https://pace.example${path}`));
const legacyPaths = [
  "/dashboard/student", "/dashboard/student/todo", "/dashboard/instructor",
  "/dashboard/instructor/classes/class-2",
];

beforeEach(() => {
  vi.resetAllMocks();
  mocks.getUser.mockResolvedValue({ data: { user: { id: "user" } } });
});

describe("session guard", () => {
  it.each(["/dashboard", "/dashboard/classes/c", "/dashboard/admin", ...legacyPaths])(
    "sends signed-out requests for %s to login", async (path) => {
      mocks.getUser.mockResolvedValue({ data: { user: null } });
      const response = await visit(path);
      expect(new URL(response.headers.get("location")!).pathname).toBe("/login");
    }
  );

  it.each(legacyPaths)("sends signed-in requests for %s to the dashboard", async (path) => {
    const response = await visit(path);
    expect(new URL(response.headers.get("location")!).pathname).toBe("/dashboard");
  });

  it.each(["/", "/login", "/dashboard", "/dashboard/classes/c"])(
    "lets %s through when allowed", async (path) => {
      const response = await visit(path);
      expect(response.headers.get("location")).toBeNull();
    }
  );

  it("does not guard public pages when signed out", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: null } });
    expect((await visit("/")).headers.get("location")).toBeNull();
  });
});
