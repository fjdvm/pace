"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { PaceTag } from "@/components/features/student/shared/pace-tag";
import { PaceIcon } from "@/components/features/student/shared/pace-icon";
import type { TestRunResult } from "@/components/features/assignments/types";
import { FailedTestCard } from "./failed-test-card";
import { useRelativeTime } from "./use-relative-time";

type ConsolePanelProps = {
  results: TestRunResult[] | null;
  ranAt: number | null;
  output: string;
  isSubmitted: boolean;
};

export function ConsolePanel({ results, ranAt, output, isSubmitted }: ConsolePanelProps) {
  const [tab, setTab] = useState<"results" | "output">("results");
  const relative = useRelativeTime(ranAt);
  const visible = results?.filter((r) => r.visible !== false) ?? [];
  const passed = visible.filter((r) => r.passed).length;
  const firstFailure = visible.find((r) => !r.passed);
  const failureIndex = firstFailure ? visible.indexOf(firstFailure) + 1 : 0;

  return (
    <div className="flex h-full flex-col gap-2.5 overflow-y-auto border-t border-pace-line bg-white px-5 pb-4 pt-3.5">
      <div className="flex items-center gap-4 text-[13px] leading-normal">
        {(["results", "output"] as const).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn("cursor-pointer", tab === id ? "font-bold text-pace-ink" : "text-pace-muted")}
          >
            {id === "results" ? "Test results" : "Output"}
          </button>
        ))}
        <span className="flex-1" />
        {visible.length > 0 && (
          <PaceTag tone={passed === visible.length ? "green" : "amber"}>
            {passed} of {visible.length} passing
          </PaceTag>
        )}
        {relative && <span className="text-pace-muted">Ran {relative}</span>}
      </div>

      {tab === "results" && visible.length === 0 && (
        <p className="text-[13px] text-pace-muted">
          {isSubmitted ? "No test results recorded." : "Run your tests to see the results here."}
        </p>
      )}
      {tab === "results" && firstFailure && <FailedTestCard index={failureIndex} result={firstFailure} />}
      {tab === "results" && visible.length > 0 && !firstFailure && (
        <p className="rounded-[14px] bg-pace-green-tint p-3.5 text-[13px] font-bold text-pace-green-deep">
          All visible tests passed.
        </p>
      )}
      {tab === "results" && firstFailure && !isSubmitted && (
        <p className="flex items-center gap-2 text-[13px] leading-normal text-pace-ink-2">
          <PaceIcon name="workspace/sparkles-14" size={14} />
          Stuck on this failure? Ask the tutor &ldquo;Where&apos;s the bug?&rdquo; It can see this result.
        </p>
      )}
      {tab === "output" && (
        <pre className="whitespace-pre-wrap font-mono text-[13px] leading-[22px] text-pace-ink-2">
          {output || "No output yet. Run your tests to see compiler output."}
        </pre>
      )}
    </div>
  );
}
