"use client";

import { cn } from "@/lib/utils";
import { LandingIcon } from "../shared/landing-icon";
import { useCycle } from "../shared/use-cycle";

const guesses = [
  { text: "typed it?", left: 190, top: 30 },
  { text: "pasted it?", left: 200, top: 82 },
  { text: "from AI?", left: 190, top: 134 },
];

export function HiddenProcessIllustration() {
  const { ref, step } = useCycle(6, 800);

  return (
    <div ref={ref} className="absolute inset-0">
      <div className="absolute left-6 top-6 flex w-[150px] animate-pace-float flex-col gap-2 rounded-[16px] bg-white px-3.5 py-3 [animation-duration:4.2s]">
        <div className="flex items-center gap-1.5">
          <LandingIcon name="icon-file-dark" size={14} />
          <span className="pace-small font-semibold text-pace-ink">main.py</span>
        </div>
        {[100, 78, 56].map((width, index) => (
          <span
            key={index}
            className="h-1.5 rounded-full bg-pace-sunken"
            style={{ width: `${width}%` }}
          />
        ))}
        <span className="pace-small text-pace-muted">Final file only</span>
      </div>
      {guesses.map((guess, index) => (
        <div
          key={guess.text}
          className="absolute animate-pace-float"
          style={{
            left: guess.left,
            top: guess.top,
            animationDuration: `${3.8 + index * 0.6}s`,
            animationDelay: `${index * 0.4}s`,
          }}
        >
          <div
            className={cn(
              "flex items-center gap-1.5 rounded-[14px] bg-white px-3 py-2 transition-all duration-500",
              step > index ? "scale-100 opacity-100" : "scale-75 opacity-0",
            )}
          >
            <LandingIcon name="icon-search-purple" size={13} />
            <span className="pace-small whitespace-nowrap text-pace-ink">{guess.text}</span>
          </div>
        </div>
      ))}
      <div
        className={cn(
          "absolute left-[146px] top-[104px] transition-all duration-500",
          step >= 3 ? "scale-100 opacity-100" : "scale-50 opacity-0",
        )}
      >
        <span className="absolute inset-0 animate-pace-pulse-ring rounded-full bg-pace-amber/60" />
        <div className="relative flex size-14 animate-pace-beat items-center justify-center rounded-full bg-pace-amber font-pace-display text-[28px] font-medium leading-[1.2] text-pace-ink">
          ?
        </div>
      </div>
    </div>
  );
}
