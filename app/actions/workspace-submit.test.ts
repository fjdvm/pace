import { expect, it, vi } from "vitest";
import { auth, db, item, post } from "../../test/workspace-fixture";
import { submitCode } from "./submit-code";
const signals = { pasteCount: 0, pasteLength: 0, keystrokeCount: 10, wpm: 0, totalFocusTimeSecs: 1, tabSwitchCount: 0, events: [] };
it("turns in all Items atomically with per-Item answers and a weighted Post grade", async () => {
  db.assignment.findUnique.mockResolvedValue({ ...post, items: [item, { ...item, id: "two", points: 70 }] });
  const result = await submitCode("post", "print(7)", signals, [{ itemId: "two", code: "print(7)" }, { itemId: "one", code: "print(7)" }]);
  expect(result.success).toBe(true);
  expect(db.submission.create).toHaveBeenCalledTimes(1);
  expect(db.submission.create).toHaveBeenCalledWith({ data: expect.objectContaining({
    assignmentId: "post", studentId: "student", itemId: "one", score: 100,
    answers: { create: [expect.objectContaining({ itemId: "one", score: 100 }), expect.objectContaining({ itemId: "two", score: 100 })] },
  }) });
  expect(db.codeDraft.deleteMany).toHaveBeenCalledWith({ where: { studentId: "student", assignmentId: "post" } });
  expect(result.answers?.every((a) => a.testResults.every((r) => r.visible))).toBe(true);
});
it("keeps single-Item callers working", async () => { expect((await submitCode("post", "print(7)", signals)).success).toBe(true); });
it("rejects incomplete, duplicate and foreign answers before executing", async () => {
  for (const answers of [[], [{ itemId: "foreign", code: "" }], [{ itemId: "one", code: "" }, { itemId: "one", code: "" }]]) {
    expect((await submitCode("post", "", signals, answers)).success).toBe(false);
  }
  expect(fetch).not.toHaveBeenCalled(); expect(db.submission.create).not.toHaveBeenCalled();
});
it("rejects repeated, late and unauthorized turn-in", async () => {
  db.submission.findUnique.mockResolvedValue({ id: "already" });
  expect((await submitCode("post", "", signals)).success).toBe(false);
  db.submission.findUnique.mockResolvedValue(null);
  db.assignment.findUnique.mockResolvedValue({ ...post, dueDate: new Date("2000-01-01") });
  expect((await submitCode("post", "", signals)).success).toBe(false);
  db.assignment.findUnique.mockResolvedValue(post); auth.userId = "instructor";
  expect((await submitCode("post", "", signals)).success).toBe(false);
  auth.userId = null; expect((await submitCode("post", "", signals)).success).toBe(false);
  expect(db.submission.create).not.toHaveBeenCalled();
});
it("does not report a reward failure as an unsuccessful turn-in", async () => {
  const { awardSubmissionXp } = await import("@/lib/gamification");
  vi.mocked(awardSubmissionXp).mockRejectedValueOnce(new Error("offline"));
  expect((await submitCode("post", "print(7)", signals)).success).toBe(true);
});

it("keeps drafts when the test runner is unavailable", async () => {
  vi.mocked(fetch).mockRejectedValueOnce(new Error("offline"));
  const result = await submitCode("post", "print(7)", signals);
  expect(result.success).toBe(false);
  expect(result.error).toContain("not been turned in");
  expect(db.submission.create).not.toHaveBeenCalled();
  expect(db.codeDraft.deleteMany).not.toHaveBeenCalled();
});

it("reports success after commit even if cache invalidation or hearts lookup fails", async () => {
  db.heartsState.findMany.mockRejectedValueOnce(new Error("offline"));
  expect((await submitCode("post", "print(7)", signals)).success).toBe(true);
  const { revalidatePath } = await import("next/cache");
  vi.mocked(revalidatePath).mockImplementationOnce(() => { throw new Error("cache unavailable"); });
  expect((await submitCode("post", "print(7)", signals)).success).toBe(true);
});
