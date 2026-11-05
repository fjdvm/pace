"use client";

import { useCycle } from "../../../shared/use-cycle";
import { FanCardShell } from "../fan-card-shell";

const tiers = [
  { label: "Level 1 · Concept", on: true },
  { label: "Level 2 · Where to look", on: true },
  { label: "Level 3 · Approach", on: false },
];

export function HeartsCard() {
  const { ref, step } = useCycle(7, 700);
  const filled = Math.max(3, 5 - step);
  return (
    <FanCardShell prompt="Hints get more specific as hearts are spent.">
      <p ref={ref} className="whitespace-nowrap font-lp-sans text-base font-bold text-lp-red">
        {Array.from({ length: 5 }, (_, i) => (i < filled ? "♥" : "♡")).join(" ")}
      </p>
      {tiers.map(({ label, on }) => (
        <div
          key={label}
          className={`w-full rounded-md px-2 py-[5px] font-lp-sans text-[9px] font-semibold ${on ? "bg-lp-violet-tint text-lp-violet" : "bg-[#f4f4f2] text-[#9a9a9a]"}`}
        >
          {label}
        </div>
      ))}
    </FanCardShell>
  );
}
