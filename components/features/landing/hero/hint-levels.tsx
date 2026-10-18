"use client";

import { cn } from "@/lib/utils";
import { LandingIcon } from "../shared/landing-icon";
import { useCycle } from "../shared/use-cycle";

const bars = [
  { left: 0, height: 46 },
  { left: 30, height: 62 },
  { left: 60, height: 78 },
  { left: 90, height: 94 },
  { left: 120, height: 110 },
];

export function HintLevels() {
  const { ref, step } = useCycle(5, 1400);
  const level = step + 1;
  const markerShift = (level - 2) * 30;

  return (
    <div ref={ref} className="absolute left-[283px] top-6 h-[150px] w-[170px]">
      {bars.map((bar, index) => (
        <div
          key={bar.left}
          className={cn(
            "absolute w-6 rounded-t-[4px] transition-colors duration-500",
            index + 1 < level && "bg-pace-purple/55",
            index + 1 === level && "bg-pace-purple/85",
            index + 1 > level && "bg-[#e9e6f0]",
          )}
          style={{ left: bar.left, height: bar.height, top: 150 - bar.height }}
        />
      ))}
      <div
        className="absolute left-0 top-0 h-[150px] w-[170px] transition-transform duration-700 ease-out"
        style={{ transform: `translateX(${markerShift}px)` }}
      >
        <div className="absolute left-[51px] top-0 flex h-[150px] w-0 items-center justify-center">
          <div className="-rotate-90">
            <LandingIcon name="hero-level-line" size={150} width={150} height={2} />
          </div>
        </div>
        <LandingIcon
          name="hero-level-knob"
          size={44}
          className="absolute left-[29px] top-[58px]"
        />
        <LandingIcon
          name="hero-level-arrows"
          size={16}
          width={16}
          height={10}
          className="absolute left-[43px] top-[73px]"
        />
        <LandingIcon
          name="hero-level-dot"
          size={6}
          className="absolute left-12 top-[147px]"
        />
        <span className="pace-small absolute left-[22px] top-[-28px] whitespace-nowrap rounded-md bg-pace-purple px-2 py-[3px] text-xs font-semibold text-white">
          Level {level}
        </span>
      </div>
    </div>
  );
}
