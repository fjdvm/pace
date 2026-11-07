import { vi } from "vitest";

let currentUser: { id: string } | null = null;

function mockSession(user: { id: string } | null) {
  currentUser = user;
  vi.doMock("@/lib/supabase/server", () => ({
    createClient: async () => ({
      auth: {
        getUser: async () => ({ data: { user: currentUser } }),
      },
    }),
  }));
}

export function mockAuthenticatedUser(userId: string) {
  mockSession({ id: userId });
}

export function mockUnauthenticated() {
  mockSession(null);
}
