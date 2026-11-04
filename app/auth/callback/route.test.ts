import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

const mocks = vi.hoisted(() => ({
  exchangeCodeForSession: vi.fn(),
  getUser: vi.fn(),
  signOut: vi.fn(),
  upsert: vi.fn(),
}));
vi.mock("@/lib/supabase/server", () => ({ createClient: async () => ({ auth: mocks }) }));
vi.mock("@/lib/prisma", () => ({ prisma: { user: { upsert: mocks.upsert } } }));

const googleUser = {
  id: "existing-user", email: "ada@example.com", email_confirmed_at: "2026-11-04",
  app_metadata: { provider: "google", providers: ["google"] },
  user_metadata: { full_name: "Ada Lovelace" },
  identities: [{ provider: "google" }],
};

beforeEach(() => {
  vi.resetAllMocks();
  mocks.exchangeCodeForSession.mockResolvedValue({ error: null });
  mocks.getUser.mockResolvedValue({ data: { user: googleUser }, error: null });
  mocks.signOut.mockResolvedValue({ error: null });
  mocks.upsert.mockResolvedValue({ id: "existing-user", role: "student", approvalStatus: "approved" });
});

const callback = (query = "code=valid") => GET(new Request(`https://pace.example/auth/callback?${query}`));

describe("Google sign-in callback", () => {
  it("creates a User with the Google profile and a temporary student role", async () => {
    const response = await callback();
    expect(response.headers.get("location")).toBe("https://pace.example/dashboard");
    expect(mocks.upsert).toHaveBeenCalledWith({
      where: { id: "existing-user" },
      create: { id: "existing-user", email: "ada@example.com", name: "Ada Lovelace", role: "student" },
      update: { email: "ada@example.com", name: "Ada Lovelace" },
    });
  });

  it("keeps the linked existing User id and role without replacing related data", async () => {
    mocks.upsert.mockResolvedValue({ id: "existing-user", role: "instructor", approvalStatus: "approved" });
    const response = await callback();
    expect(response.headers.get("location")).toBe("https://pace.example/dashboard");
    const { where, update } = mocks.upsert.mock.calls[0][0];
    expect(where).toEqual({ id: "existing-user" });
    expect(update).toEqual({ email: "ada@example.com", name: "Ada Lovelace" });
  });

  it("sends existing pending instructors to the single dashboard", async () => {
    mocks.upsert.mockResolvedValue({ role: "instructor", approvalStatus: "pending" });
    expect((await callback()).headers.get("location")).toBe("https://pace.example/dashboard");
  });

  it.each(["", "error=access_denied"])("returns failed or cancelled sign-in to login (%s)", async (query) => {
    expect((await callback(query)).headers.get("location")).toBe("https://pace.example/login?error=google_sign_in");
    expect(mocks.upsert).not.toHaveBeenCalled();
  });

  it("rejects an invalid or expired authorization code", async () => {
    mocks.exchangeCodeForSession.mockResolvedValue({ error: new Error("expired") });
    expect((await callback()).headers.get("location")).toContain("/login?error=google_sign_in");
    expect(mocks.upsert).not.toHaveBeenCalled();
  });

  it("rejects unverified email addresses", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: { ...googleUser, email_confirmed_at: null } }, error: null });
    expect((await callback()).headers.get("location")).toContain("/login?error=google_sign_in");
    expect(mocks.upsert).not.toHaveBeenCalled();
    expect(mocks.signOut).toHaveBeenCalled();
  });

  it("clears the session if profile storage fails instead of entering a redirect loop", async () => {
    mocks.upsert.mockRejectedValue(new Error("database unavailable"));
    expect((await callback()).headers.get("location")).toContain("/login?error=google_sign_in");
    expect(mocks.signOut).toHaveBeenCalled();
  });

  it("ignores a supplied external redirect destination", async () => {
    expect((await callback("code=valid&next=https://evil.example")).headers.get("location"))
      .toBe("https://pace.example/dashboard");
  });
});

it("cannot grant Admin through Google metadata", async () => {
  mocks.getUser.mockResolvedValue({ data: { user: {
    ...googleUser, user_metadata: { full_name: "Ada Lovelace", role: "admin", isAdmin: true, is_admin: true },
  } }, error: null });
  await callback();
  const { create, update } = mocks.upsert.mock.calls[0][0];
  expect(create).not.toHaveProperty("isAdmin");
  expect(update).not.toHaveProperty("isAdmin");
  expect(create.role).toBe("student");
  expect(update).not.toHaveProperty("role");
});

it("preserves a legacy Admin flag and lands on the regular dashboard", async () => {
  mocks.upsert.mockResolvedValue({ role: "admin", isAdmin: true, approvalStatus: "approved" });
  expect((await callback()).headers.get("location")).toBe("https://pace.example/dashboard");
  expect(mocks.upsert.mock.calls[0][0].update).toEqual({ email: "ada@example.com", name: "Ada Lovelace" });
});
