"use client";

import { useCycle } from "../../../shared/use-cycle";
import { FanCardShell } from "../fan-card-shell";

const bars = [20, 8, 30, 4, 26, 40, 6];

export function TimelineCard() {
  const { ref, step } = useCycle(bars.length + 3, 350);
  return (
    <FanCardShell prompt="See how the code was made.">
      <div ref={ref} className="flex w-full items-end gap-[3px]">
        {bars.map((height, i) => (
          <div
            key={i}
            style={{ height }}
            className={`w-3 origin-bottom rounded-[3px] transition-transform duration-300 ${i === 5 ? "bg-lp-amber" : "bg-lp-green"} ${step > i ? "scale-y-100" : "scale-y-0"}`}
          />
        ))}
      </div>
      <span className="self-start whitespace-nowrap rounded-full bg-lp-amber-tint px-2 py-1 font-lp-sans text-[9px] font-bold text-lp-amber-ink">
        Activity: Medium
      </span>
    </FanCardShell>
  );
}
