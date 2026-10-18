import { describe, expect, it } from "vitest";
import {
  averageByHeartsBucket,
  buildFlags,
  median,
  mostFailedTest,
  scoreBands,
  studentStatus,
  toCsv,
} from "./assignment-overview";

describe("scoreBands", () => {
  it("splits scores into 70-100, 40-69 and 0-39", () => {
    expect(scoreBands([100, 80, 70, 69, 40, 39, 0])).toEqual({ high: 3, mid: 2, low: 2 });
  });
});

describe("median", () => {
  it("handles odd, even and empty lists", () => {
    expect(median([1, 5, 3])).toBe(3);
    expect(median([1, 2, 3, 4])).toBe(3);
    expect(median([])).toBe(0);
  });
});

describe("averageByHeartsBucket", () => {
  it("averages scores for 0, 1-3 and 4+ hearts, leaving empty buckets null", () => {
    const result = averageByHeartsBucket([
      { score: 100, hearts: 0 },
      { score: 80, hearts: 0 },
      { score: 60, hearts: 2 },
    ]);
    expect(result).toEqual([
      { label: "0 hearts", average: 90 },
      { label: "1–3", average: 60 },
      { label: "4+", average: null },
    ]);
  });
});

describe("mostFailedTest", () => {
  const cases = [
    { id: "a", input: "1", visible: true },
    { id: "b", input: "-8\n3", visible: false },
  ];

  it("labels the test most often failed", () => {
    const results = [
      [{ testCaseId: "a", passed: true }, { testCaseId: "b", passed: false }],
      [{ testCaseId: "a", passed: true }, { testCaseId: "b", passed: false }],
    ];
    expect(mostFailedTest(cases, results)).toEqual({ label: "hidden test 2", count: 2 });
  });

  it("returns null when everything passes", () => {
    expect(mostFailedTest(cases, [[{ testCaseId: "a", passed: true }]])).toBeNull();
  });
});

describe("studentStatus", () => {
  it("prefers submitted, then in progress, then not started", () => {
    expect(studentStatus({ submitted: true, started: true })).toBe("submitted");
    expect(studentStatus({ submitted: false, started: true })).toBe("in-progress");
    expect(studentStatus({ submitted: false, started: false })).toBe("not-started");
  });
});

describe("buildFlags", () => {
  it("shows the highest similarity and a paste flag", () => {
    expect(buildFlags({ similarity: 0.78, riskFlag: "High", pasteDominance: 0.9 })).toEqual([
      { label: "Similar 78%", tone: "amber" },
      { label: "Large paste", tone: "red" },
    ]);
  });

  it("falls back to the risk level and returns nothing when clean", () => {
    expect(buildFlags({ similarity: null, riskFlag: "Medium", pasteDominance: 0.1 })).toEqual([
      { label: "Risk: Medium", tone: "amber" },
    ]);
    expect(buildFlags({ similarity: null, riskFlag: "Low", pasteDominance: 0 })).toEqual([]);
  });
});

describe("toCsv", () => {
  it("quotes fields containing commas and quotes", () => {
    expect(toCsv([["Name", "Note"], ["Cruz, Kim", 'said "hi"']])).toBe('Name,Note\n"Cruz, Kim","said ""hi"""');
  });
});
