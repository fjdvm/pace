"use client";

import { motion } from "motion/react";
import { BandShell } from "./band-shell";
import { ImageCard } from "./image-card";
import { AppPanel } from "./app-panel";
import { useSequence } from "./use-sequence";
import { cn } from "@/lib/utils";

const students = ["Kim", "Ana", "Leo"];
const bars = [10, 24, 34, 30, 22, 8, 58];
const box = "w-full rounded-[14px] border border-lp-line bg-white p-3.5";

function MonitoringCard() {
  const { ref, step, motionEnabled } = useSequence([300]);
  return (
    <ImageCard className="bg-[#efeeeb]">
      <AppPanel className="left-[137px] top-[39px] font-lp-sans">
        <div className="flex gap-1.5">
          {students.map((name, i) => (
            <span
              key={name}
              className={cn(
                "rounded-full px-2.5 py-[5px] text-[11px] font-semibold",
                i === 0 ? "bg-[#111] text-white" : "bg-[#f1f1ef] text-[#8a8a8a]",
              )}
            >
              {name}
            </span>
          ))}
        </div>
        <div className={cn(box, "flex flex-col gap-0.5 whitespace-nowrap")}>
          <p className="text-[11px] font-medium text-[#8a8a8a]">Activity flag</p>
          <p className="text-[22px] font-semibold text-lp-amber-ink">Medium</p>
          <p className="text-[10.5px] font-medium text-[#8a8a8a]">Large paste 2 min before turn-in</p>
        </div>
        <div className={cn(box, "flex flex-col gap-2")}>
          <p className="whitespace-nowrap text-[11px] font-semibold text-[#111]">Events while working</p>
          <div ref={ref} className="flex h-[58px] items-end gap-[9px]">
            {bars.map((h, i) => (
              <motion.span
                key={i}
                data-bar
                initial={motionEnabled ? { height: 0 } : false}
                animate={{ height: step >= 1 ? h : 0 }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
                className={cn("w-4 rounded-[3px]", i === bars.length - 1 ? "bg-lp-amber" : "bg-lp-teal-soft")}
              />
            ))}
          </div>
        </div>
      </AppPanel>
    </ImageCard>
  );
}

export function MonitoringBand() {
  return (
    <BandShell
      id="monitoring"
      tone="white"
      cardFirst
      title={["A view of how", "the code was made"]}
      body="Instructors see typing, pasting, and tab-switch events as Low, Medium, or High activity flags, with a timeline for each submission. Flags prompt a closer look; they are not evidence of misconduct on their own."
      link="Problem 3 in the study →"
      card={<MonitoringCard />}
    />
  );
}
