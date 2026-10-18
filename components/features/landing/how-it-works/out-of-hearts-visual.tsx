"use client";

import { cn } from "@/lib/utils";
import { formatCountdown } from "../shared/countdown";
import { LandingIcon } from "../shared/landing-icon";
import { useCycle } from "../shared/use-cycle";
import { useCountdown } from "./use-countdown";
import { VisualFrame } from "./visual-frame";

const suggestions = [
  { icon: "icon-file-dark", label: "Re-read the instructions and examples" },
  { icon: "icon-play", label: "Run your tests and compare the output" },
  { icon: "icon-sparkles-dark-small", label: "Revisit the tutor’s last hint" },
];

export function OutOfHeartsVisual() {
  const seconds = useCountdown(435);
  const { ref, step } = useCycle(4, 1800);

  return (
    <VisualFrame className="bg-pace-peach">
      <div
        ref={ref}
        className="absolute left-20 top-[42px] flex w-[500px] flex-col gap-3 rounded-[20px] border-[1.5px] border-pace-line bg-white px-6 py-5 shadow-[0_5px_0_0_#ebc8bc]"
      >
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((index) => (
              <span
                key={index}
                className="animate-pace-twinkle"
                style={{ animationDelay: `${index * 0.3}s` }}
              >
                <LandingIcon name="heart-gray-outline" size={22} />
              </span>
            ))}
          </div>
          <span className="pace-small flex items-center gap-1.5 rounded-full bg-pace-peach px-3 py-1.5 font-semibold tabular-nums text-pace-red">
            <LandingIcon name="icon-clock-red" size={14} />
            Next heart in {formatCountdown(seconds)}
          </span>
        </div>
        <p className="pace-h4 text-pace-ink">Out of hearts for now</p>
        <p className="pace-body text-pace-ink-2">
          A short break often helps more than another hint. Meanwhile:
        </p>
        {suggestions.map((item, index) => (
          <div
            key={item.label}
            className={cn(
              "flex items-center gap-3 rounded-[14px] px-3.5 py-2.5 transition-all duration-500",
              step === index
                ? "translate-x-1.5 bg-pace-mint"
                : "translate-x-0 bg-pace-canvas",
            )}
          >
            <LandingIcon name={item.icon} size={17} />
            <span className="pace-body whitespace-nowrap text-pace-ink">
              {item.label}
            </span>
          </div>
        ))}
        <span className="pace-small flex w-fit items-center gap-1.5 rounded-full bg-pace-green px-3 py-1.5 font-semibold text-pace-ink">
          <LandingIcon name="icon-check-dark" size={14} />
          Coding and running tests: always free
        </span>
      </div>
    </VisualFrame>
  );
}
