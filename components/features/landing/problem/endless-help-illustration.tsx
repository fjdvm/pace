"use client";

import { cn } from "@/lib/utils";
import { LandingIcon } from "../shared/landing-icon";
import { useCycle } from "../shared/use-cycle";

const bubbles = [
  { text: "next step?", left: 24, top: 24 },
  { text: "why error?", left: 170, top: 40 },
  { text: "fix it pls", left: 60, top: 78 },
  { text: "what now?", left: 196, top: 100 },
  { text: "just answer", left: 30, top: 134 },
  { text: "again?", left: 150, top: 150 },
];

export function EndlessHelpIllustration() {
  const { ref, step } = useCycle(9, 650);

  return (
    <div ref={ref} className="absolute inset-0">
      {bubbles.map((bubble, index) => (
        <div
          key={bubble.text}
          className="absolute animate-pace-float"
          style={{
            left: bubble.left,
            top: bubble.top,
            animationDuration: `${3.6 + (index % 3) * 0.7}s`,
            animationDelay: `${index * 0.3}s`,
          }}
        >
          <div
            className={cn(
              "flex items-center gap-1.5 rounded-[14px] bg-white px-3 py-2 transition-all duration-500",
              step > index ? "scale-100 opacity-100" : "scale-75 opacity-0",
            )}
          >
            <LandingIcon name="icon-message" size={13} />
            <span className="pace-small whitespace-nowrap text-pace-ink">
              {bubble.text}
            </span>
          </div>
        </div>
      ))}
      <div
        className={cn(
          "absolute left-[272px] top-[132px] transition-all duration-500",
          step >= 6 ? "scale-100 opacity-100" : "scale-50 opacity-0",
        )}
      >
        <span className="absolute inset-0 animate-pace-pulse-ring rounded-full bg-pace-amber/60" />
        <div className="relative flex size-16 animate-pace-beat items-center justify-center rounded-full bg-pace-amber font-pace-display text-[30px] font-medium leading-[1.2] text-pace-ink">
          ∞
        </div>
      </div>
    </div>
  );
}
