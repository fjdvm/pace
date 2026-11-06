"use client";

import { BandShell } from "./band-shell";
import { ImageCard } from "./image-card";
import { AppPanel } from "./app-panel";
import { useSequence } from "./use-sequence";
import { cn } from "@/lib/utils";

const tiers = ["1 · Concept", "2 · Where to look", "3 · Approach", "4 · Step outline", "5 · Near-pseudocode"];
const times = [600, 1300];

function HeartsCard() {
  const { ref, step } = useSequence(times);
  return (
    <ImageCard className="bg-[#e4eef1]">
      <AppPanel className="left-[137px] top-[23px] font-lp-sans">
        <div ref={ref} className="flex w-full flex-col items-start gap-3">
          <p className="whitespace-nowrap text-xl font-bold text-lp-red" aria-label={`${5 - step} of 5 hearts`}>
            {Array.from({ length: 5 }, (_, i) => (i < 5 - step ? "♥" : "♡")).join(" ")}
          </p>
          <p className="whitespace-nowrap text-[11px] font-medium text-[#8a8a8a]">Next heart in 12:40</p>
          {tiers.map((tier, i) => (
            <div
              key={tier}
              className={cn(
                "w-full whitespace-nowrap rounded-[10px] px-2.5 py-[7px] text-[11.5px] font-semibold transition-colors duration-300",
                i < step ? "bg-lp-violet-tint text-lp-violet" : "bg-[#f4f4f2] text-[#9a9a9a]",
              )}
            >
              {tier}
            </div>
          ))}
        </div>
      </AppPanel>
    </ImageCard>
  );
}

export function HeartsBand() {
  return (
    <BandShell
      id="hearts"
      tone="canvas"
      title={["Hearts that ask students", "to think first"]}
      body="Each question costs one heart, and hearts refill over time. The more hearts spent, the more specific the hint, from a conceptual nudge at level 1 to near-pseudocode at level 5. The design draws on self-regulated learning."
      link="Theoretical framework →"
      card={<HeartsCard />}
    />
  );
}
