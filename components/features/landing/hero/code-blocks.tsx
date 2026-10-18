"use client";

import { cn } from "@/lib/utils";
import { useCycle } from "../shared/use-cycle";

const lines = [
  { text: "a = input()", left: 0, top: 0 },
  { text: "b = input()", left: 10, top: 34 },
  { text: "print(a + b)", left: 0, top: 68 },
  { text: "✕ expected 7, got 34", left: 18, top: 102, error: true },
];

export function CodeBlocks() {
  const { ref, step } = useCycle(7, 800);

  return (
    <div ref={ref} className="absolute left-[38px] top-[242px] h-[150px] w-[180px]">
      {lines.map((line, index) => {
        const visible = step > index;
        return (
          <div
            key={line.text}
            className={cn(
              "absolute rounded-[5px] border bg-white px-2 py-[5px] font-pace-mono text-xs leading-[1.65] shadow-[0_2px_0_0_#e7e5df] transition-all duration-500",
              line.error
                ? "border-pace-red text-pace-red"
                : "border-pace-line text-pace-ink",
              visible
                ? "translate-x-0 opacity-100"
                : "-translate-x-3 opacity-0",
              line.error && visible && "animate-pace-shake",
            )}
            style={{ left: line.left, top: line.top }}
          >
            <span className="whitespace-nowrap">{line.text}</span>
          </div>
        );
      })}
    </div>
  );
}
