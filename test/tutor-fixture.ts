import { beforeEach, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  user: vi.fn(), access: vi.fn(), model: vi.fn(), stream: vi.fn(),
  hearts: { upsert: vi.fn(), findUniqueOrThrow: vi.fn(), update: vi.fn() },
  submission: vi.fn(), messages: { create: vi.fn(), findMany: vi.fn() }, query: vi.fn(), transaction: vi.fn(),
}));
vi.mock("@/lib/prisma", () => ({ prisma: {
  $transaction: mocks.transaction,
  chatMessage: mocks.messages,
} }));
vi.mock("@/lib/supabase/server", () => ({ createClient: async () => ({ auth: { getUser: mocks.user } }) }));
vi.mock("@/lib/workspace/student-access", () => ({ requireStudentPost: mocks.access }));
vi.mock("@/lib/ai-provider", () => ({ getModelWithFallback: mocks.model }));
vi.mock("ai", () => ({ streamText: mocks.stream }));
export const post = { id: "post", heartsCount: 5, heartsRegenMinutes: 30, items: [
  { id: "one", kind: "coding", title: "One", instructions: "First instructions", language: "PYTHON" },
  { id: "two", kind: "coding", title: "Two", instructions: "Second instructions", language: "PYTHON" },
] };
beforeEach(() => {
  vi.resetAllMocks();
  mocks.user.mockResolvedValue({ data: { user: { id: "student" } } });
  mocks.access.mockResolvedValue(post);
  mocks.submission.mockResolvedValue(null);
  mocks.hearts.findUniqueOrThrow.mockResolvedValue({ currentCount: 5, totalSpent: 0, lastRegenAt: new Date() });
  mocks.hearts.update.mockImplementation(async ({ data }) => typeof data.currentCount === "number"
    ? data : { currentCount: 4, totalSpent: 1, lastRegenAt: new Date() });
  mocks.messages.findMany.mockResolvedValue([{ role: "user", content: "Help" }]);
  mocks.transaction.mockImplementation(async (fn) => fn({
    $queryRaw: mocks.query, heartsState: mocks.hearts,
    submission: { findUnique: mocks.submission }, chatMessage: mocks.messages,
  }));
  mocks.stream.mockReturnValue({ toUIMessageStreamResponse: vi.fn((options: ResponseInit) => new Response("stream", options)) });
});

export { mocks };
