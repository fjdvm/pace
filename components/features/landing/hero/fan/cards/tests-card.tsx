"use client";

import { useCycle } from "../../../shared/use-cycle";
import { FanCardShell } from "../fan-card-shell";

const tests = ["Test 1   2, 5 → 7", "Test 2   10, -3 → 7", "Test 3   0, 0 → 0"];

export function TestsCard() {
  const { ref, step } = useCycle(tests.length + 3, 800);
  return (
    <FanCardShell prompt="Run your code against the test cases.">
      <div ref={ref} className="flex flex-col gap-3">
        {tests.map((label, i) => (
          <div
            key={label}
            className="flex w-full gap-[6px] rounded-[7px] bg-lp-green-tint px-2 py-[6px]"
          >
            <span
              className={`font-lp-sans text-[9px] font-bold text-lp-green-deep transition-opacity duration-300 ${step > i ? "opacity-100" : "opacity-0"}`}
            >
              ✓
            </span>
            <span className="whitespace-pre font-lp-mono text-[8.5px] font-medium text-lp-green-ink">
              {label}
            </span>
          </div>
        ))}
      </div>
    </FanCardShell>
  );
}
