import { describe, expect, it } from "vitest";
import { filterComments, themeCounts } from "./comment-filter";
import type { StudyComment } from "./dataset";

const make = (key: string, promptId: StudyComment["promptId"], themeIds: string[], text: string): StudyComment => ({
  key,
  respondentId: "S001",
  role: "student",
  yearLevel: "2nd year",
  promptId,
  themeIds,
  text,
});

const comments = [
  make("1", "helpful", ["hints-helped"], "The hints made me look again"),
  make("2", "improve", ["more-hearts", "hints-helped"], "More hearts please"),
  make("3", "problems", [], "Code runs slowly"),
];

describe("filterComments", () => {
  it("returns everything by default", () => {
    expect(filterComments(comments, { themeId: "all", promptId: "all", query: "" })).toHaveLength(3);
  });

  it("filters by theme, including comments with several themes", () => {
    const result = filterComments(comments, { themeId: "hints-helped", promptId: "all", query: "" });
    expect(result.map((c) => c.key)).toEqual(["1", "2"]);
  });

  it("treats uncoded as comments without themes", () => {
    expect(filterComments(comments, { themeId: "uncoded", promptId: "all", query: "" }).map((c) => c.key)).toEqual(["3"]);
  });

  it("combines prompt and case-insensitive text search", () => {
    expect(filterComments(comments, { themeId: "all", promptId: "improve", query: "" }).map((c) => c.key)).toEqual(["2"]);
    expect(filterComments(comments, { themeId: "all", promptId: "all", query: "SLOWLY" }).map((c) => c.key)).toEqual(["3"]);
  });
});

describe("themeCounts", () => {
  it("counts each theme, the uncoded comments and the total", () => {
    expect(themeCounts(comments)).toEqual({ all: 3, uncoded: 1, byTheme: { "hints-helped": 2, "more-hearts": 1 } });
  });
});
