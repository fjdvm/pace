import { describe, expect, it } from "vitest";
import {
  cronbachAlpha,
  interpretMean,
  mannWhitney,
  mean,
  median,
  normalCdf,
  sampleSd,
  slovinSampleSize,
} from "./stats";

describe("descriptive statistics", () => {
  it("computes mean, median and sample standard deviation", () => {
    expect(mean([1, 2, 3, 4])).toBe(2.5);
    expect(median([5, 1, 3])).toBe(3);
    expect(median([1, 2, 3, 4])).toBe(2.5);
    expect(sampleSd([2, 4, 4, 4, 5, 5, 7, 9])).toBeCloseTo(2.138, 3);
  });

  it("returns 0 for empty or single-value inputs", () => {
    expect(mean([])).toBe(0);
    expect(median([])).toBe(0);
    expect(sampleSd([3])).toBe(0);
  });
});

describe("slovinSampleSize", () => {
  it("matches the study target of 248 students", () => {
    expect(slovinSampleSize(652, 0.05)).toBe(248);
  });
});

describe("interpretMean", () => {
  it.each([
    [4.2, "Highly acceptable"],
    [4.19, "Acceptable"],
    [3.4, "Acceptable"],
    [3.39, "Moderately acceptable"],
    [2.6, "Moderately acceptable"],
    [1.8, "Slightly acceptable"],
    [1.79, "Not acceptable"],
  ])("labels %d as %s", (value, label) => {
    expect(interpretMean(value)).toBe(label);
  });
});

describe("cronbachAlpha", () => {
  it("is 1 for perfectly consistent items", () => {
    const rows = [
      [1, 1, 1],
      [3, 3, 3],
      [5, 5, 5],
      [2, 2, 2],
    ];
    expect(cronbachAlpha(rows)).toBeCloseTo(1, 6);
  });

  it("is lower when items disagree", () => {
    const rows = [
      [1, 5, 3],
      [5, 1, 3],
      [2, 4, 1],
      [4, 2, 5],
    ];
    expect(cronbachAlpha(rows)).toBeLessThan(0.3);
  });

  it("returns 0 with fewer than two items or respondents", () => {
    expect(cronbachAlpha([[1], [2]])).toBe(0);
    expect(cronbachAlpha([[1, 2]])).toBe(0);
  });
});

describe("normalCdf", () => {
  it("approximates the standard normal distribution", () => {
    expect(normalCdf(0)).toBeCloseTo(0.5, 6);
    expect(normalCdf(1.96)).toBeCloseTo(0.975, 3);
    expect(normalCdf(-1.96)).toBeCloseTo(0.025, 3);
  });
});

describe("mannWhitney", () => {
  it("detects fully separated groups", () => {
    const result = mannWhitney([1, 2, 3], [4, 5, 6]);
    expect(result.u).toBe(0);
    expect(result.z).toBeCloseTo(-1.964, 2);
    expect(result.p).toBeCloseTo(0.0495, 3);
    expect(result.r).toBeCloseTo(0.802, 2);
  });

  it("handles ties with average ranks", () => {
    const result = mannWhitney([1, 2, 2], [2, 3, 3]);
    expect(result.u).toBe(1);
  });

  it("reports no difference for identical groups", () => {
    const result = mannWhitney([1, 2, 3], [1, 2, 3]);
    expect(result.p).toBeCloseTo(1, 5);
    expect(result.r).toBeCloseTo(0, 5);
  });
});
