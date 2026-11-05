import { describe, expect, it } from "vitest";
import { buildItemActivity } from "./activity";
import { itemRisk } from "./item-risk";
import { formatAway } from "./format";
import type { BehavioralEvent } from "@/lib/types/behavioral-signals";

const events: BehavioralEvent[] = [
  { type: "open", timestamp: 1000, itemId: "a" },
  { type: "typing", timestamp: 2000, chars: 38, itemId: "a" },
  { type: "tab_switch", timestamp: 260_000, awayDurationSecs: 250, itemId: "a" },
  { type: "paste", timestamp: 300_000, length: 74, charsAtTimeOfPaste: 38, lines: 3, itemId: "a" },
  { type: "paste", timestamp: 310_000, length: 10, charsAtTimeOfPaste: 5, itemId: "b" },
  { type: "run_attempt", timestamp: 400_000, passedCount: 3, totalCount: 3, itemId: "a" },
  { type: "submit", timestamp: 500_000 },
];
const base = { events, legacyKeystrokes: 0, tutorQuestions: [350_000], itemId: "a", firstItemId: "a", fileName: "main.py", finalCodeLength: 112 };

describe("buildItemActivity", () => {
  it("counts typing, paste, tab away and the log for one Item only", () => {
    const a = buildItemActivity(base);
    expect(a).toMatchObject({ typed: 38, pasted: 74, pastePercent: 66, tabLeaves: 1, awaySecs: 250 });
    expect(a.log.map((l) => l.text)).toEqual([
      "Opened the assignment",
      "Typed 38 characters",
      "Left the assignment tab for 4 min 10 s",
      "Pasted 74 characters (3 lines) into main.py",
      "Asked the AI tutor 1 question",
      "Ran tests · 3 of 3 passed",
      "Turned in",
    ]);
  });

  it("keeps other Items separate and shares turn-in", () => {
    const b = buildItemActivity({ ...base, itemId: "b" });
    expect(b.pasted).toBe(10);
    expect(b.tabLeaves).toBe(0);
    expect(b.log.at(-1)?.text).toBe("Turned in");
  });

  it("attributes legacy events without an Item to the first Item", () => {
    const legacy: BehavioralEvent[] = [{ type: "paste", timestamp: 5, length: 20, charsAtTimeOfPaste: 0 }];
    const input = { ...base, events: legacy, legacyKeystrokes: 12, tutorQuestions: [] };
    expect(buildItemActivity(input)).toMatchObject({ pasted: 20, typed: 12 });
    expect(buildItemActivity({ ...input, itemId: "b" })).toMatchObject({ pasted: 0, typed: 0 });
  });
});

describe("itemRisk", () => {
  it("flags a late large paste and keeps a typed Item Low", () => {
    const risky = itemRisk(events, "a", "a", 112, 38);
    expect(risky.flag).not.toBe("Low");
    const typed: BehavioralEvent[] = [
      { type: "run_attempt", timestamp: 1, passedCount: 0, totalCount: 2, itemId: "a" },
      { type: "submit", timestamp: 999_999 },
    ];
    expect(itemRisk(typed, "a", "a", 100, 100).flag).toBe("Low");
  });
});

describe("formatAway", () => {
  it("formats seconds and minutes", () => {
    expect(formatAway(45)).toBe("45 s");
    expect(formatAway(250)).toBe("4 min 10 s");
    expect(formatAway(250, true)).toBe("4 min");
    expect(formatAway(240)).toBe("4 min");
  });
});
