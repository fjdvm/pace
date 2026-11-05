import { expect, it } from "vitest";
import { studentFlag } from "./student-flag";
import type { StoredBehavioralSignals } from "@/lib/types/behavioral-signals";

const base = { pasteCount: 0, pasteLength: 0, keystrokeCount: 0, wpm: 0, totalFocusTimeSecs: 0 };
it("takes the highest per-Item flag so the list matches the sheet", () => {
  const signals: StoredBehavioralSignals = {
    ...base,
    events: [
      { type: "typing", timestamp: 1, chars: 200, itemId: "a" },
      { type: "run_attempt", timestamp: 2, passedCount: 0, totalCount: 1, itemId: "a" },
      { type: "run_attempt", timestamp: 3, passedCount: 0, totalCount: 1, itemId: "a" },
      { type: "paste", timestamp: 400_000, length: 100, charsAtTimeOfPaste: 0, itemId: "b" },
      { type: "submit", timestamp: 410_000 },
    ],
  };
  const answers = [{ itemId: "a", code: "x".repeat(200) }, { itemId: "b", code: "y".repeat(100) }];
  expect(studentFlag(signals, answers, ["a", "b"])).not.toBe("Low");
  expect(studentFlag(signals, answers.slice(0, 1), ["a"])).toBe("Low");
});
it("falls back to the stored flag without events", () => {
  expect(studentFlag({ ...base, riskScore: { total: 70, flag: "High", components: {} as never } }, [], ["a"])).toBe("High");
  expect(studentFlag(null, [], ["a"])).toBe("Low");
});
