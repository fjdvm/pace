"use client";

import { useCycle } from "../../../shared/use-cycle";
import { FanCardShell } from "../fan-card-shell";

const lines = ["a = int(input())", "b = int(input())", "print(a + b)"];
const total = lines.join("").length;

function visibleLines(typed: number) {
  let left = typed;
  return lines.map((line) => {
    const shown = line.slice(0, Math.max(0, left));
    left -= line.length;
    return shown;
  });
}

export function CodeCard() {
  const { ref, step } = useCycle(total + 24, 80);
  const shown = visibleLines(Math.min(step, total));
  return (
    <FanCardShell prompt="Write a program that adds two numbers.">
      <div
        ref={ref}
        className="flex w-full flex-col gap-1 rounded-lg bg-[#1f2430] p-[10px] font-lp-mono text-[8.5px] font-medium text-[#e2e8f0]"
      >
        {shown.map((text, i) => (
          <p key={lines[i]} className="min-h-[1.2em] whitespace-nowrap">
            {text}
          </p>
        ))}
      </div>
    </FanCardShell>
  );
}
