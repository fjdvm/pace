"use client";

import { cn } from "@/lib/utils";
import { LandingIcon } from "../shared/landing-icon";
import { useCycle } from "../shared/use-cycle";
import { VisualFrame } from "./visual-frame";

const helpChips = [
  { icon: "icon-code-purple", label: "Explain my code" },
  { icon: "icon-search-purple", label: "Where’s the bug?" },
  { icon: "icon-lightbulb-purple", label: "Explain a concept" },
  { icon: "icon-route-purple", label: "What’s my next step?" },
];

export function TutorHelpVisual() {
  const { ref, step } = useCycle(7, 1000);

  return (
    <VisualFrame className="bg-pace-lavender-tint">
      <div ref={ref} className="absolute inset-0">
        <div className="absolute left-12 top-[68px] grid grid-cols-2 gap-3">
          {helpChips.map((chip, index) => (
            <div
              key={chip.label}
              className={cn(
                "flex w-[276px] items-center gap-2.5 rounded-2xl border-[1.5px] bg-white px-4 py-3.5 transition-all duration-500",
                step === index
                  ? "-translate-y-1 border-pace-purple shadow-[0_8px_0_0_#d9cdf5]"
                  : "border-pace-line shadow-[0_5px_0_0_#e1dceb]",
              )}
            >
              <LandingIcon name={chip.icon} size={18} />
              <span className="pace-body whitespace-nowrap font-semibold text-pace-ink">
                {chip.label}
              </span>
            </div>
          ))}
        </div>
        <div className="absolute left-12 top-[216px] flex w-[564px] flex-col gap-3 rounded-[20px] border-[1.5px] border-pace-line bg-white px-5 py-[18px] shadow-[0_5px_0_0_#e1dceb]">
          <div className="flex min-h-[46px] justify-end">
            <p
              className={cn(
                "pace-body rounded-2xl bg-pace-sunken px-3.5 py-2.5 text-pace-ink transition-all duration-500",
                step >= 4 ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0",
              )}
            >
              Just give me the fixed code.
            </p>
          </div>
          <div
            className={cn(
              "flex min-h-[118px] flex-col gap-2 rounded-2xl bg-pace-lavender-tint px-4 py-3.5 transition-all duration-500",
              step >= 5 ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
            )}
          >
            <div className="flex items-center gap-2">
              <LandingIcon name="icon-sparkles-purple" size={15} />
              <span className="pace-small font-semibold text-pace-purple">PACE Tutor</span>
            </div>
            <p className="pace-body text-pace-ink">
              I can’t write it for you, but I can point you there: line 3 adds two
              values that came from input(). What type does input() return?
            </p>
          </div>
        </div>
        <div
          className={cn(
            "absolute left-[417.77px] top-[196px] transition-all duration-500",
            step >= 5 ? "scale-100 opacity-100" : "scale-75 opacity-0",
          )}
        >
          <div className="flex rotate-[4deg] items-center gap-1.5 whitespace-nowrap rounded-full bg-pace-ink px-3 py-1.5">
            <LandingIcon name="icon-x-white" size={14} />
            <span className="pace-small font-semibold text-white">
              Declined: full solution
            </span>
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}
