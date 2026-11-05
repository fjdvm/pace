import type { TestRunResult } from "@/components/features/assignments/types";

const LANGUAGE_MAP: Record<string, number> = {
  Python: 100,
  C: 103,
  JavaScript: 102,
  "C#": 51,
};

type Case = {
  id: string;
  input: string;
  expectedOutput: string;
  visible: boolean;
};
export async function executeTests(
  language: string,
  code: string,
  testCases: Case[],
): Promise<TestRunResult[]> {
  const langId = LANGUAGE_MAP[language];
  if (!langId) throw new Error(`Unsupported programming language: ${language}`);
  const testCasesToRun = testCases;

  const runPromises = testCasesToRun.map(async (tc) => {
    try {
      const response = await fetch(
        "https://ce.judge0.com/submissions?wait=true&base64_encoded=false",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          signal: AbortSignal.timeout(20000),
          body: JSON.stringify({
            source_code: code,
            language_id: langId,
            stdin: tc.input || "",
            expected_output: tc.expectedOutput || undefined,
            cpu_time_limit: 10.0,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Judge0 responded with status: ${response.status}`);
      }

      const result = await response.json();

      const stdout = result.stdout || "";
      const stderr = result.stderr || "";
      const compileOutput = result.compile_output || "";
      const status = result.status || { id: 13, description: "Internal Error" };

      let passed = false;
      if (status.id === 3) {
        const cleanActual = stdout.trim().replace(/\r\n/g, "\n");
        const cleanExpected = (tc.expectedOutput || "")
          .trim()
          .replace(/\r\n/g, "\n");
        passed = cleanActual === cleanExpected;
      }

      return {
        testCaseId: tc.id,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: stdout || stderr || compileOutput || "",
        stderr,
        compileOutput,
        status,
        passed,
        visible: tc.visible,
      };
    } catch (err) {
      return {
        testCaseId: tc.id,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput:
          err instanceof Error ? err.message : "Error executing test case",
        stderr: err instanceof Error ? err.message : "Error",
        compileOutput: "",
        status: { id: 13, description: "Connection Error" },
        passed: false,
        visible: tc.visible,
      };
    }
  });

  return Promise.all(runPromises);
}
