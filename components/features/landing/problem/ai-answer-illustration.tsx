"use client";

import { cn } from "@/lib/utils";
import { LandingIcon } from "../shared/landing-icon";
import { useCycle } from "../shared/use-cycle";

const codeLines = ["a = int(input())", "b = int(input())", "print(a + b)"];

export function AiAnswerIllustration() {
  const { ref, step } = useCycle(5, 1100);

  return (
    <div ref={ref} className="absolute inset-0">
      <div
        className={cn(
          "pace-small absolute left-[161px] top-[22px] whitespace-nowrap rounded-[14px] bg-white px-3 py-2 text-pace-ink transition-all duration-500",
          step >= 0 ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
        )}
      >
        Write my sum program
      </div>
      <div
        className={cn(
          "absolute left-6 top-[68px] flex flex-col gap-2 whitespace-nowrap rounded-2xl bg-white px-3.5 py-3 transition-all duration-500",
          step >= 1 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        )}
      >
        <p className="pace-small font-semibold text-pace-ink">
          Here is the complete solution:
        </p>
        <div className="flex flex-col gap-0.5 rounded-lg bg-pace-night px-2.5 py-2 font-pace-mono text-[13px] leading-[1.65] text-pace-cream">
          {codeLines.map((line, index) => (
            <p
              key={line}
              className="transition-opacity duration-500"
              style={{
                opacity: step >= 2 ? 1 : 0.25,
                transitionDelay: `${index * 150}ms`,
              }}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
      <div
        className={cn(
          "absolute left-[121.77px] top-[168px] transition-all duration-500",
          step >= 3 ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
        )}
      >
        <div className="flex rotate-[4deg] items-center gap-1.5 whitespace-nowrap rounded-full bg-pace-red px-3 py-1.5">
          <LandingIcon name="icon-check-white" size={14} />
          <span className="pace-small font-semibold text-white">
            Copied · Submitted · 100%
          </span>
        </div>
      </div>
    </div>
  );
}
