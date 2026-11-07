"use server";

import { prisma } from "@/lib/prisma";
import { currentUserId } from "@/lib/items/permissions";
import { LANGUAGES, decodeLineBreaks, type TestCaseForm } from "@/lib/assignment-form";
import { executeTests } from "@/lib/workspace/execute-tests";

type SolutionInput = { classId: string; language: string; code: string; testCases: TestCaseForm[] };

export async function checkCodingSolution(input: SolutionInput) {
  try {
    const userId = await currentUserId();
    const owned = await prisma.class.count({ where: { id: input.classId, instructorId: userId } });
    if (!owned) throw new Error("Only the Class Instructor can check a solution");
    if (!LANGUAGES.includes(input.language)) throw new Error("Unsupported language");
    if (!input.code.trim() || input.code.length > 100_000) throw new Error("Enter a solution under 100,000 characters");
    if (!input.testCases.length || input.testCases.length > 20) throw new Error("Check between 1 and 20 tests at a time");
    if (input.testCases.some((test) => typeof test.input !== "string" || typeof test.expectedOutput !== "string" || typeof test.visible !== "boolean" || !test.expectedOutput.trim())) throw new Error("Every test needs an expected output");
    const results = await executeTests(input.language, input.code, input.testCases.map((test, index) => ({
      ...test, id: String(index + 1), input: decodeLineBreaks(test.input), expectedOutput: decodeLineBreaks(test.expectedOutput),
    })));
    return { success: true as const, results };
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : "Could not check solution" };
  }
}
