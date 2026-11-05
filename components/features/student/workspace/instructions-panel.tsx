import type {
  TestCaseData,
  TestRunResult,
} from "@/components/features/assignments/types";
import { cn } from "@/lib/utils";
type Props = {
  instructions: string;
  testCases: TestCaseData[];
  results: TestRunResult[] | null;
  hiddenCount: number;
};
export function InstructionsPanel({
  instructions,
  testCases,
  results,
  hiddenCount,
}: Props) {
  const example = testCases[0];
  return (
    <section className="flex h-full flex-col gap-3 overflow-y-auto border-r border-pace-line bg-pace-canvas p-5 text-[13px] leading-normal">
      <h2 className="text-base font-bold leading-[1.35]">Instructions</h2>
      <p className="whitespace-pre-wrap">{instructions}</p>
      {example && (
        <div className="rounded-[8px] border border-pace-line bg-white px-3 py-2.5">
          <p className="text-[11px] font-bold uppercase leading-[1.3] tracking-[0.66px] text-pace-muted">
            Example
          </p>
          <p className="mt-1 whitespace-pre-wrap font-mono leading-[1.65]">
            Input: {example.input.replace(/\n/g, ", ")}
          </p>
          <p className="mt-1 whitespace-pre-wrap font-mono leading-[1.65]">
            Output: {example.expectedOutput}
          </p>
        </div>
      )}
      <h2 className="text-base font-bold leading-[1.35]">Test cases</h2>
      {testCases.map((test, i) => {
        const result = results?.find((r) => r.testCaseId === test.id);
        return (
          <div key={test.id} className="flex items-center gap-2.5">
            <span
              aria-label={
                result ? (result.passed ? "Passed" : "Failed") : "Not run"
              }
              className={cn(
                "size-2.5 shrink-0 rounded-full",
                !result
                  ? "bg-pace-line-strong"
                  : result.passed
                    ? "bg-pace-green"
                    : "bg-pace-red",
              )}
            />
            <span className="shrink-0 font-bold">Test {i + 1}</span>
            <span className="whitespace-pre-wrap font-mono leading-[1.65] text-pace-ink-2">
              {test.input.replace(/\n/g, ", ")} → {test.expectedOutput}
            </span>
          </div>
        );
      })}
      <p className="text-pace-muted">
        {hiddenCount} hidden tests run when you submit.
      </p>
    </section>
  );
}
