import { afterEach, expect, it, vi } from "vitest";
import { mockAuthenticatedUser, mockUnauthenticated } from "./mock-auth";

afterEach(() => {
  vi.resetModules();
  vi.doUnmock("@/lib/supabase/server");
});

it("updates the session seen by an already imported auth client", async () => {
  mockAuthenticatedUser("instructor");
  const { createClient } = await import("@/lib/supabase/server");
  const client = await createClient();
  expect((await client.auth.getUser()).data.user?.id).toBe("instructor");

  mockUnauthenticated();
  expect((await client.auth.getUser()).data.user).toBeNull();

  mockAuthenticatedUser("student");
  expect((await client.auth.getUser()).data.user?.id).toBe("student");
});
