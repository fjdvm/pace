import type { TestRunResult } from "@/components/features/assignments/types";
import { cn } from "@/lib/utils";
export function TestResults({
  results,
  mobile = false,
}: {
  results: TestRunResult[];
  mobile?: boolean;
}) {
  return (
    <div className={cn("flex flex-col", mobile && "gap-3")}>
      {results
        .filter((r) => r.visible !== false)
        .map((result, i) => (
          <div
            key={result.testCaseId}
            className={cn(
              "flex items-center gap-4 border-b border-pace-line px-4 py-2",
              mobile &&
                "flex-col items-stretch gap-2 rounded-[8px] border px-3.5 py-3",
              mobile && !result.passed && "border-pace-red bg-pace-red-tint",
            )}
          >
            <div className="flex shrink-0 items-center gap-2 lg:gap-4">
              <span
                className={cn(
                  "flex size-6 items-center justify-center rounded-full text-[11px] font-bold text-white",
                  mobile && "size-5",
                  result.passed ? "bg-pace-green" : "bg-pace-red",
                )}
              >
                {result.passed ? "✓" : "✕"}
              </span>
              <span
                className={cn(
                  "w-14 text-[13px] font-bold",
                  mobile && "w-auto text-[15px]",
                )}
              >
                Test {i + 1}
              </span>
            </div>
            <div className="grid min-w-0 flex-1 grid-cols-3 gap-4">
              {[
                ["Input", result.input.replace(/\n/g, ", ")],
                ["Expected", result.expectedOutput],
                [
                  mobile ? "Yours" : "Your output",
                  result.actualOutput.trim() || "(no output)",
                ],
              ].map(([label, value], j) => (
                <div key={label} className="min-w-0">
                  <p className="text-[11px] font-bold uppercase leading-[1.3] tracking-[0.66px] text-pace-muted">
                    {label}
                  </p>
                  <pre
                    className={cn(
                      "mt-0.5 whitespace-pre-wrap break-words font-mono text-[13px] leading-[1.65]",
                      j === 2 && !result.passed && "text-pace-red",
                    )}
                  >
                    {value}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
