import { beforeEach, describe, expect, it, vi } from "vitest";
import { getAdminApiKeyStatus, saveAdminApiKey, removeAdminApiKey, getDecryptedAdminApiKey } from "./admin-api-keys";

const mocks = vi.hoisted(() => ({ getUser: vi.fn(), findUser: vi.fn(), findMany: vi.fn(), upsert: vi.fn(), delete: vi.fn(), findUnique: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ createClient: async () => ({ auth: { getUser: mocks.getUser } }) }));
vi.mock("@/lib/prisma", () => ({ prisma: {
  user: { findUnique: mocks.findUser },
  systemSetting: { findMany: mocks.findMany, upsert: mocks.upsert, delete: mocks.delete, findUnique: mocks.findUnique },
} }));
vi.mock("@/lib/encryption", () => ({ encrypt: () => "encrypted", decrypt: () => "secret" }));

beforeEach(() => {
  vi.resetAllMocks();
  mocks.getUser.mockResolvedValue({ data: { user: { id: "user" } } });
  mocks.findMany.mockResolvedValue([]);
  mocks.upsert.mockResolvedValue({});
  mocks.delete.mockResolvedValue({});
  mocks.findUnique.mockResolvedValue({ value: "encrypted" });
});

describe("admin API key actions", () => {
  it("rejects a non-admin without global role fields", async () => {
    mocks.findUser.mockResolvedValue({ isAdmin: false });
    expect(await saveAdminApiKey("GROQ_API_KEY", "secret")).toEqual({ success: false, error: "Forbidden" });
    expect(await removeAdminApiKey("GROQ_API_KEY")).toEqual({ success: false, error: "Forbidden" });
    await expect(getAdminApiKeyStatus()).rejects.toThrow("Forbidden");
    await expect(getDecryptedAdminApiKey("GROQ_API_KEY")).rejects.toThrow("Forbidden");
    expect(mocks.upsert).not.toHaveBeenCalled();
    expect(mocks.delete).not.toHaveBeenCalled();
  });

  it("rejects a signed-out caller", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: null } });
    expect(await saveAdminApiKey("GROQ_API_KEY", "secret")).toEqual({ success: false, error: "Unauthorized" });
  });

  it("accepts an Admin without global role fields", async () => {
    mocks.findUser.mockResolvedValue({ isAdmin: true });
    expect(await saveAdminApiKey("GROQ_API_KEY", "secret")).toEqual({ success: true });
    expect(await removeAdminApiKey("GROQ_API_KEY")).toEqual({ success: true });
    expect(await getAdminApiKeyStatus()).toHaveLength(2);
    expect(await getDecryptedAdminApiKey("GROQ_API_KEY")).toBe("secret");
  });
});
