import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DetailTestResult } from "./types";

export function TestsTab({ results }: { results: DetailTestResult[] }) {
  if (results.length === 0) return <p className="py-10 text-center text-sm text-pace-muted">No test results recorded.</p>;
  return (
    <ul className="flex flex-col gap-2.5">
      {results.map((result, i) => (
        <li
          key={result.testCaseId || i}
          className={cn("flex gap-3 rounded-xl p-3.5", result.passed ? "bg-pace-green-tint" : "bg-pace-red-tint")}
        >
          {result.passed ? (
            <Check className="mt-0.5 size-4 shrink-0 text-pace-green-deep" />
          ) : (
            <X className="mt-0.5 size-4 shrink-0 text-pace-red" />
          )}
          <div className="min-w-0 flex-1 text-xs text-pace-ink">
            <p className="font-semibold">
              Test {i + 1}
              {result.visible === false && " · hidden"}
            </p>
            <p className="mt-1 truncate font-mono text-pace-ink-2">In: {result.input.replace(/\n/g, "\\n") || "—"}</p>
            <p className="truncate font-mono text-pace-ink-2">Expected: {result.expectedOutput || "—"}</p>
            {!result.passed && (
              <p className="truncate font-mono text-pace-red">Got: {result.actualOutput?.trim() || "—"}</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
