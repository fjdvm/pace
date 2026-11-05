import { beforeEach, expect, it, vi } from "vitest";

const auth = vi.hoisted(() => ({ userId: "instructor" as string | null }));
const db = vi.hoisted(() => ({
  assignmentClass: { findMany: vi.fn() },
  assignment: { findUnique: vi.fn() },
  chatMessage: { findMany: vi.fn() },
  submission: { updateMany: vi.fn() },
  post: { findFirst: vi.fn() },
}));
const ai = vi.hoisted(() => ({ generateText: vi.fn() }));
const comments = vi.hoisted(() => ({ createComment: vi.fn() }));
vi.mock("@/lib/prisma", () => ({ prisma: db }));
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({ auth: { getUser: async () => ({ data: { user: auth.userId ? { id: auth.userId } : null } }) } }),
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("ai", async (original) => ({ ...(await original<typeof import("ai")>()), generateText: ai.generateText }));
vi.mock("@/app/actions/comments", () => comments);
vi.mock("@/lib/similarity/assignment-pairs", () => ({ computeSimilarityPairs: vi.fn().mockResolvedValue([]) }));

import { getInsights } from "./get-insights";
import { markSubmissionReviewed } from "./mark-reviewed";
import { sendSuggestedComment } from "./send-suggested-comment";

const steps = { summary: "S", explanation: "E", suggestedComment: "Hi Maria", similarNote: "N", draftNote: "D" };
const post = {
  items: [{ id: "one", kind: "coding", language: "Python", position: 0 }],
  submissions: [{
    studentId: "maria", student: { name: "Maria Santos", email: "m@x.edu" },
    behavioralSignals: { keystrokeCount: 38, events: [{ type: "paste", timestamp: 5, length: 74, charsAtTimeOfPaste: 0 }] },
    answers: [{ itemId: "one", code: "a = 1", testResults: [{ passed: true }] }],
  }],
};
beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("GOOGLE_GENERATIVE_AI_API_KEY", "key");
  auth.userId = "instructor";
  db.assignmentClass.findMany.mockResolvedValue([{ class: { instructorId: "instructor" } }]);
  db.assignment.findUnique.mockResolvedValue(post);
  db.chatMessage.findMany.mockResolvedValue([{ createdAt: new Date(10) }]);
  ai.generateText.mockResolvedValue({ output: steps });
});

it("builds the log and flag from events and takes next steps from one stubbed Gemini call", async () => {
  const result = await getInsights("post", "maria", "one");
  expect(result).toMatchObject({ success: true, steps, stepsError: null, pastePercent: 100 });
  if (result.success) expect(result.log.map((l) => l.kind)).toEqual(["paste", "tutor"]);
  expect(ai.generateText).toHaveBeenCalledTimes(1);
  expect(ai.generateText.mock.calls[0][0].prompt).toContain("Never say the student copied");
});

it("keeps the log and flag when the AI is unavailable, and refuses other Users", async () => {
  ai.generateText.mockRejectedValue(new Error("down"));
  expect(await getInsights("post", "maria", "one")).toMatchObject({ success: true, steps: null, stepsError: expect.any(String) });
  auth.userId = "someone";
  expect(await getInsights("post", "maria", "one")).toMatchObject({ success: false });
});

it("marks a Submission reviewed only for its Post's Instructor", async () => {
  db.submission.updateMany.mockResolvedValue({ count: 1 });
  await markSubmissionReviewed("post", "sub");
  expect(db.submission.updateMany).toHaveBeenCalledWith({ where: { id: "sub", assignmentId: "post" }, data: { reviewedAt: expect.any(Date) } });
  db.submission.updateMany.mockResolvedValue({ count: 0 });
  await expect(markSubmissionReviewed("post", "nope")).rejects.toThrow("not found");
  auth.userId = null;
  await expect(markSubmissionReviewed("post", "sub")).rejects.toThrow("Only the Class's Instructor");
});

it("posts the suggested comment as a private comment to the Student", async () => {
  db.post.findFirst.mockResolvedValue({ id: "stream" });
  comments.createComment.mockResolvedValue({ success: true });
  await sendSuggestedComment("post", "maria", "  Hi Maria  ");
  expect(comments.createComment).toHaveBeenCalledWith("stream", "Hi Maria", "private", "maria");
  await expect(sendSuggestedComment("post", "maria", " ")).rejects.toThrow("Write a comment");
  db.post.findFirst.mockResolvedValue(null);
  await expect(sendSuggestedComment("post", "x", "Hi")).rejects.toThrow("not in a Class");
});
