import { expect, it } from "vitest";
import { auth, db, item, post } from "../../test/workspace-fixture";
import { saveDraft } from "./save-draft";
import { submitCode } from "./submit-code";
const choice = {
  ...item,
  kind: "multiple_choice",
  options: ["for", "while", "do-while"],
  correctOption: 2,
  testCases: [],
};
const signals = {
  pasteCount: 0,
  pasteLength: 0,
  keystrokeCount: 0,
  wpm: 0,
  totalFocusTimeSecs: 1,
  tabSwitchCount: 0,
  events: [],
};
it("saves and changes a selection as a draft", async () => {
  db.assignment.findUnique.mockResolvedValue({ ...post, items: [choice] });
  expect((await saveDraft("post", "0", "one")).success).toBe(true);
  expect((await saveDraft("post", "2", "one")).success).toBe(true);
  expect(db.codeDraft.upsert).toHaveBeenLastCalledWith(
    expect.objectContaining({ update: { code: "2" } }),
  );
  expect((await saveDraft("post", "99", "one")).success).toBe(false);
});
it.each([
  ["2", 100],
  ["0", 0],
  ["", 0],
])(
  "auto-scores selection %s on turn-in without a code runner",
  async (code, score) => {
    db.assignment.findUnique.mockResolvedValue({ ...post, items: [choice] });
    const result = await submitCode("post", code, signals);
    expect(result.success).toBe(true);
    expect(db.submission.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        score,
        answers: {
          create: [expect.objectContaining({ code, score, testResults: [] })],
        },
      }),
    });
    expect(fetch).not.toHaveBeenCalled();
    expect(result.submission?.score).toBeNull();
    expect(JSON.stringify(result)).not.toContain("correctOption");
  },
);
it("rejects forged selections, unenrolled Users and changes after turn-in", async () => {
  db.assignment.findUnique.mockResolvedValue({ ...post, items: [choice] });
  expect((await submitCode("post", "99", signals)).success).toBe(false);
  expect(db.submission.create).not.toHaveBeenCalled();
  db.submission.findUnique.mockResolvedValue({ id: "done" });
  expect((await saveDraft("post", "2", "one")).success).toBe(false);
  db.enrollment.findFirst.mockResolvedValue(null);
  expect((await saveDraft("post", "2", "one")).success).toBe(false);
  auth.userId = null;
  expect((await submitCode("post", "2", signals)).success).toBe(false);
});

it("rejects a first save or turn-in when the answer key changes before the lock", async () => {
  db.assignment.findUnique.mockResolvedValue({ ...post, items: [choice] });
  db.item.findMany.mockResolvedValue([{ ...choice, options: ["do-while", "while", "for"], correctOption: 0 }]);
  expect(await saveDraft("post", "2", "one")).toMatchObject({ success: false, error: expect.stringContaining("Items changed") });
  expect(await submitCode("post", "2", signals)).toMatchObject({ success: false, error: expect.stringContaining("Items changed") });
  expect(db.codeDraft.upsert).not.toHaveBeenCalled();
  expect(db.submission.create).not.toHaveBeenCalled();
});
