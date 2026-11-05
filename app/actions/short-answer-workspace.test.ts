import { expect, it } from "vitest";
import { auth, db, item, post } from "../../test/workspace-fixture";
import { saveDraft } from "./save-draft";
import { submitCode } from "./submit-code";
const short = { ...item, kind: "short_answer", language: "", testCases: [] };
const signals = { pasteCount: 0, pasteLength: 0, keystrokeCount: 0, wpm: 0, totalFocusTimeSecs: 1, tabSwitchCount: 0, events: [] };
it("autosaves and updates a written answer", async () => {
  db.assignment.findUnique.mockResolvedValue({ ...post, items: [short] });
  expect((await saveDraft("post", "A loop", "one")).success).toBe(true);
  expect((await saveDraft("post", "A loop repeats instructions", "one")).success).toBe(true);
  expect(db.codeDraft.upsert).toHaveBeenLastCalledWith(expect.objectContaining({ update: { code: "A loop repeats instructions" } }));
});
it.each(["A loop repeats instructions", ""])("turns in %j without automatic points or code execution", async (code) => {
  db.assignment.findUnique.mockResolvedValue({ ...post, items: [short] });
  const result = await submitCode("post", code, signals);
  expect(result.success).toBe(true);
  expect(db.submission.create).toHaveBeenCalledWith({ data: expect.objectContaining({ answers: { create: [expect.objectContaining({ code, score: null, testResults: [] })] } }) });
  expect(fetch).not.toHaveBeenCalled();
  expect(result.submission?.score).toBeNull();
});
it("rejects edits after turn-in, unenrolled Users and unauthenticated Users", async () => {
  db.assignment.findUnique.mockResolvedValue({ ...post, items: [short] });
  db.submission.findUnique.mockResolvedValue({ id: "done" });
  expect((await saveDraft("post", "Changed", "one")).success).toBe(false);
  db.submission.findUnique.mockResolvedValue(null);
  db.enrollment.findFirst.mockResolvedValue(null);
  expect((await submitCode("post", "Answer", signals)).success).toBe(false);
  auth.userId = null;
  expect((await saveDraft("post", "Answer", "one")).success).toBe(false);
  expect(db.submission.create).not.toHaveBeenCalled();
});
