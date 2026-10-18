import { describe, expect, it } from "vitest";
import { parseResponse, type ResponseInput } from "./response";

const ratings = () => ({ PU: [5, 4, 3, 2, 1], PEOU: [1, 2, 3, 4, 5], ATU: [3, 3, 3, 3, 3], BI: [5, 5, 5, 5, 5] });

const student: ResponseInput = {
  version: "student",
  yearLevel: "2nd year",
  coursesTaken: "3",
  aiUsage: "sometimes",
  answers: ratings(),
  comments: { helpful: "  The hints  ", problems: "", improve: "" },
};

describe("parseResponse", () => {
  it("accepts a complete student response and trims comments", () => {
    const result = parseResponse(student);
    expect(result).toEqual({
      ok: true,
      value: {
        version: "student",
        yearLevel: "2nd year",
        coursesTaken: "3",
        aiUsage: "sometimes",
        answers: ratings(),
        comments: { helpful: "The hints" },
      },
    });
  });

  it("accepts an instructor without student-only fields", () => {
    const result = parseResponse({ ...student, version: "instructor", yearLevel: undefined, coursesTaken: undefined });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.yearLevel).toBeNull();
  });

  it.each([
    [{ version: "teacher" }, "Choose a questionnaire version"],
    [{ yearLevel: undefined }, "Tell us your year level"],
    [{ coursesTaken: "99" }, "Tell us how many programming courses you have taken"],
    [{ aiUsage: "daily" }, "Tell us how often you use AI tools"],
    [{ answers: { ...ratings(), BI: [5, 5, 5, 5] } }, "Answer all 20 statements"],
    [{ answers: { ...ratings(), BI: [5, 5, 5, 5, 6] } }, "Answer all 20 statements"],
    [{ answers: { ...ratings(), PU: [5, 4, 3, 2, 2.5] } }, "Answer all 20 statements"],
    [{ comments: { helpful: "x".repeat(1001) } }, "Comments must be 1000 characters or fewer"],
  ])("rejects %j", (patch, message) => {
    expect(parseResponse({ ...student, ...patch } as ResponseInput)).toEqual({ ok: false, error: message });
  });
});
