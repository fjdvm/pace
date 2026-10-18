import { describe, expect, it } from "vitest";
import { analyzeStudy } from "./analysis";
import { buildSampleDataset } from "./sample-dataset";
import type { Respondent, StudyDataset } from "./dataset";

function respondent(id: string, role: "student" | "instructor", score: number): Respondent {
  const answers = { PU: [score, score, score, score], PEOU: [score, score, score, score], ATU: [score, score, score, score], BI: [score, score, score, score] };
  return { id, role, submittedAt: "2026-10-03T00:00:00.000Z", answers };
}

const tiny: StudyDataset = {
  respondents: [respondent("S1", "student", 4), respondent("S2", "student", 5), respondent("I1", "instructor", 3)],
  comments: [{ respondentId: "S1", role: "student", themeId: "hints-helped", text: "Good" }],
  studentTarget: 10,
  instructorTarget: 2,
};

describe("analyzeStudy on a tiny dataset", () => {
  const results = analyzeStudy(tiny, { final: true });

  it("counts responses against targets", () => {
    expect(results.responses).toEqual({ student: { count: 2, target: 10 }, instructor: { count: 1, target: 2 } });
  });

  it("computes group means with interpretation labels", () => {
    expect(results.constructs[0].student.mean).toBe(4.5);
    expect(results.constructs[0].student.label).toBe("Highly acceptable");
    expect(results.constructs[0].instructor.mean).toBe(3);
    expect(results.constructs[0].instructor.label).toBe("Moderately acceptable");
  });

  it("tallies comment themes", () => {
    expect(results.themes.find((t) => t.id === "hints-helped")?.count).toBe(1);
    expect(results.commentCount).toBe(1);
  });

  it("lists every questionnaire item", () => {
    expect(results.items).toHaveLength(16);
  });
});

describe("analyzeStudy on the sample dataset", () => {
  const dataset = buildSampleDataset();
  const results = analyzeStudy(dataset, { final: false });

  it("matches the study design", () => {
    expect(results.responses.student).toEqual({ count: 186, target: 248 });
    expect(results.responses.instructor).toEqual({ count: 9, target: 11 });
    expect(results.commentCount).toBe(142);
  });

  it("is deterministic", () => {
    expect(analyzeStudy(buildSampleDataset(), { final: false })).toEqual(results);
  });

  it("produces plausible Likert means and acceptable reliability", () => {
    for (const c of results.constructs) {
      expect(c.student.mean).toBeGreaterThan(3.4);
      expect(c.student.mean).toBeLessThan(4.6);
    }
    expect(results.reliability.basis).toBe("pilot, n = 30");
    expect(results.reliability.minAlpha).toBeGreaterThan(0.7);
    expect(results.reliability.passes).toBe(true);
  });

  it("anonymises respondents", () => {
    expect(dataset.respondents.every((r) => /^[SI]\d{3}$/.test(r.id))).toBe(true);
  });
});
