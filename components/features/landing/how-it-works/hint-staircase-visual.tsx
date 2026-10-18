"use client";

import { cn } from "@/lib/utils";
import { LandingIcon } from "../shared/landing-icon";
import { useCycle } from "../shared/use-cycle";
import { staircaseLevels } from "./staircase-data";
import { VisualFrame } from "./visual-frame";

export function HintStaircaseVisual() {
  const { ref, step } = useCycle(9, 700);

  return (
    <VisualFrame className="bg-pace-sky">
      <div ref={ref} className="absolute inset-0">
        <span className="pace-small absolute left-12 top-[58px] animate-pace-bob rounded-full bg-pace-ink px-3 py-1.5 font-semibold text-white">
          Hearts spent → hint level
        </span>
        {staircaseLevels.map((item) => {
          const built = step >= item.level - 1;
          const current = step === item.level - 1;
          return (
            <div
              key={item.level}
              className={cn(
                "absolute flex w-[108px] flex-col gap-2 rounded-[20px] border-[1.5px] border-pace-line bg-white px-3 pt-3.5 transition-all duration-700 ease-out",
                built ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0",
                current ? "shadow-[0_5px_0_0_#8aa0ff]" : "shadow-[0_5px_0_0_#c9d3f0]",
              )}
              style={{ left: item.left, top: item.top, height: item.height }}
            >
              <p
                className={cn(
                  "pace-stat tracking-[-0.02em]",
                  item.level === 5 ? "text-pace-red" : "text-pace-ink",
                )}
              >
                {item.level}
              </p>
              <p className="pace-small text-pace-ink-2">{item.label}</p>
              <div className="flex gap-0.5">
                {Array.from({ length: item.level }, (_, index) => (
                  <span
                    key={index}
                    className={cn(
                      "transition-transform duration-500",
                      built ? "scale-100" : "scale-0",
                    )}
                    style={{ transitionDelay: `${300 + index * 120}ms` }}
                  >
                    <LandingIcon name="heart-red-small" size={11} />
                  </span>
                ))}
              </div>
            </div>
          );
        })}
        <p className="pace-small absolute left-12 top-[416px] whitespace-nowrap text-pace-ink-2">
          Level = hearts spent so far (max 5)
        </p>
      </div>
    </VisualFrame>
  );
}
