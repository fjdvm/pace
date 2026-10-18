"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { PaceIcon } from "@/components/features/student/shared/pace-icon";
import type { TestCaseData, TestRunResult } from "@/components/features/assignments/types";

type InstructionsPanelProps = {
  instructions: string;
  testCases: TestCaseData[];
  results: TestRunResult[] | null;
  hiddenCount: number;
};

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold uppercase leading-snug tracking-[0.06em] text-pace-muted">{children}</p>
  );
}

function CodeBlock({ value }: { value: string }) {
  return (
    <pre className="whitespace-pre-wrap rounded-xl bg-pace-canvas px-3.5 py-2.5 font-mono text-[13px] leading-[22px] text-pace-ink">
      {value}
    </pre>
  );
}

function TestRow({ index, test, result }: { index: number; test: TestCaseData; result?: TestRunResult }) {
  const state = result ? (result.passed ? "pass" : "fail") : "idle";
  const detail = result
    ? result.passed
      ? `${test.input.replace(/\n/g, " ")} → ${test.expectedOutput}`
      : `expected ${test.expectedOutput}, got ${result.actualOutput.trim() || "nothing"}`
    : `${test.input.replace(/\n/g, " ")} → ${test.expectedOutput}`;
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-xl px-3 py-2.5",
        state === "pass" && "bg-pace-green-tint",
        state === "fail" && "bg-pace-red-tint",
        state === "idle" && "bg-pace-canvas",
      )}
    >
      {state !== "idle" && <PaceIcon name={state === "pass" ? "workspace/check" : "workspace/x"} size={16} />}
      <div className="flex min-w-0 flex-1 flex-col text-[13px] leading-normal">
        <span className="font-semibold text-pace-ink">Test {index + 1}</span>
        <span className="truncate text-pace-ink-2">{detail}</span>
      </div>
    </div>
  );
}

export function InstructionsPanel({ instructions, testCases, results, hiddenCount }: InstructionsPanelProps) {
  const [tab, setTab] = useState<"instructions" | "tests">("instructions");
  const example = testCases[0];
  const [headline, ...rest] = instructions.split("\n\n");
  const tabs = [
    { id: "instructions" as const, label: "Instructions" },
    { id: "tests" as const, label: `Tests (${testCases.length + hiddenCount})` },
  ];

  return (
    <div className="flex h-full w-full flex-col gap-5 overflow-y-auto border-r border-pace-line bg-white px-6 pb-6 pt-5">
      <div role="tablist" className="flex w-max gap-1 rounded-full bg-pace-canvas p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "cursor-pointer rounded-full px-3.5 py-[7px] text-[13px] font-semibold",
              tab === t.id ? "bg-white text-pace-ink shadow-[0_4px_0_0_var(--color-pace-line)]" : "text-pace-ink-2",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "instructions" && (
        <>
          <p className="whitespace-pre-wrap text-[15px] leading-[1.55] text-pace-ink">{headline}</p>
          {rest.length > 0 && (
            <p className="whitespace-pre-wrap text-[13px] leading-normal text-pace-ink-2">{rest.join("\n\n")}</p>
          )}
          {hiddenCount > 0 && (
            <p className="text-[13px] leading-normal text-pace-ink-2">
              Your program is checked against the visible tests below and {hiddenCount} hidden{" "}
              {hiddenCount === 1 ? "test" : "tests"} when you submit.
            </p>
          )}
          {example && (
            <>
              <div className="flex flex-col gap-1.5">
                <Label>Example input</Label>
                <CodeBlock value={example.input || " "} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Expected output</Label>
                <CodeBlock value={example.expectedOutput} />
              </div>
            </>
          )}
        </>
      )}

      <div className="flex flex-col gap-2">
        <Label>Visible tests</Label>
        {testCases.map((tc, i) => (
          <TestRow key={tc.id} index={i} test={tc} result={results?.find((r) => r.testCaseId === tc.id)} />
        ))}
        {hiddenCount > 0 && (
          <p className="flex items-center gap-2 pl-3 text-[13px] text-pace-muted">
            <PaceIcon name="workspace/lock" size={14} />
            {hiddenCount} hidden {hiddenCount === 1 ? "test runs" : "tests run"} on submit
          </p>
        )}
      </div>
    </div>
  );
}
