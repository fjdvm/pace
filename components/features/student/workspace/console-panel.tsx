"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PaceTag } from "@/components/features/student/shared/pace-tag";
import type { TestRunResult } from "@/components/features/assignments/types";
import { TestResults } from "./test-results";
type Props = {
  results: TestRunResult[] | null;
  ranAt: number | null;
  output: string;
  isSubmitted: boolean;
};
export function ConsolePanel({ results, output, isSubmitted }: Props) {
  const visible = results?.filter((r) => r.visible !== false) ?? [];
  const passed = visible.filter((r) => r.passed).length;
  return (
    <Tabs
      defaultValue="results"
      className="h-full min-h-0 gap-0 border-t border-pace-line bg-white"
    >
      <div className="flex items-center gap-4 border-b border-pace-line px-4 py-2.5">
        <TabsList variant="line" className="h-auto! gap-6 p-0">
          <TabsTrigger
            value="results"
            className="p-0 text-[13px] after:hidden data-active:font-bold data-active:text-pace-green-deep"
          >
            Test results
          </TabsTrigger>
          <TabsTrigger value="console" className="p-0 text-[13px] after:hidden">
            Console
          </TabsTrigger>
        </TabsList>
        {visible.length > 0 && (
          <span className="ml-auto">
            <PaceTag tone={passed === visible.length ? "green" : "amber"}>
              {passed} of {visible.length} passed
            </PaceTag>
          </span>
        )}
      </div>
      <TabsContent value="results" className="min-h-0 overflow-y-auto">
        {visible.length ? (
          <TestResults results={visible} />
        ) : (
          <div className="px-4 pt-6">
            <p className="text-[15px] leading-[1.55] text-pace-ink-2">
              {isSubmitted
                ? "No test results recorded."
                : "Run your code to check it against the test cases."}
            </p>
            <p className="mt-1 text-[13px] text-pace-muted">
              Your code is saved automatically.
            </p>
          </div>
        )}
      </TabsContent>
      <TabsContent value="console" className="min-h-0 overflow-y-auto p-4">
        <pre className="whitespace-pre-wrap font-mono text-[13px] leading-[1.65]">
          {output || "No output yet."}
        </pre>
      </TabsContent>
    </Tabs>
  );
}
