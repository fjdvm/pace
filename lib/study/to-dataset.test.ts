import { describe, expect, it } from "vitest";
import { toDataset, type StoredResponse } from "./to-dataset";

const answers = { PU: [5, 5, 5, 5, 5], PEOU: [4, 4, 4, 4, 4], ATU: [3, 3, 3, 3, 3], BI: [2, 2, 2, 2, 2] };

function row(id: string, version: string, extra: Partial<StoredResponse> = {}): StoredResponse {
  return {
    id,
    version,
    yearLevel: version === "student" ? "2nd year" : null,
    coursesTaken: version === "student" ? "3" : null,
    aiUsage: "sometimes",
    answers,
    comments: {},
    commentThemes: {},
    createdAt: new Date("2026-10-03T00:00:00Z"),
    ...extra,
  };
}

describe("toDataset", () => {
  const dataset = toDataset(
    [
      row("a", "student", { comments: { helpful: "Hints", improve: "More hearts" }, commentThemes: { helpful: "hints-helped" } }),
      row("b", "instructor"),
      row("c", "student"),
    ],
    4,
  );

  it("numbers respondents per group without exposing database ids", () => {
    expect(dataset.respondents.map((r) => r.id)).toEqual(["S001", "I001", "S002"]);
    expect(JSON.stringify(dataset.respondents)).not.toContain('"a"');
  });

  it("turns each non-empty comment into a keyed comment, uncoded by default", () => {
    expect(dataset.comments).toEqual([
      { key: "a:helpful", respondentId: "S001", role: "student", promptId: "helpful", themeId: "hints-helped", text: "Hints" },
      { key: "a:improve", respondentId: "S001", role: "student", promptId: "improve", themeId: "uncoded", text: "More hearts" },
    ]);
  });

  it("carries targets and the respondent profile", () => {
    expect(dataset.studentTarget).toBe(248);
    expect(dataset.instructorTarget).toBe(4);
    expect(dataset.respondents[0].profile).toEqual({ yearLevel: "2nd year", coursesTaken: "3", aiUsage: "sometimes" });
  });
});
