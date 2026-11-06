"use client";

import { motion } from "motion/react";
import { SparkBuddy } from "../../spark-buddy/spark-buddy";
import { BandShell } from "./band-shell";
import { ImageCard } from "./image-card";
import { AppPanel } from "./app-panel";
import { TypingDots } from "./typing-dots";
import { useSequence } from "./use-sequence";

const times = [300, 900, 1500];
const pop = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.25 } };

function UnguidedAiCard() {
  const { ref, step } = useSequence(times);
  const gaze = step >= 3 ? { x: 4, y: 0 } : { x: 3, y: -3 };
  return (
    <ImageCard className="bg-[#efeeeb]">
      <div ref={ref} className="absolute inset-0 font-lp-sans">
        <AppPanel className="left-[137px] top-[-21px] h-[300px]">
          <div className="flex w-full flex-col gap-[5px] rounded-xl bg-[#f6f6f4] p-3 font-lp-mono text-[11px] font-medium text-[#334155]">
            <p>if n &gt; 0:</p>
            <p className="whitespace-pre">{'    print("Positive")'}</p>
          </div>
        </AppPanel>
        {step >= 1 && (
          <motion.div
            {...pop}
            className="absolute left-[299px] top-[199px] rounded-[14px] bg-white px-3.5 py-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
          >
            <p className="w-[170px] text-[12.5px] font-medium leading-[18px] text-[#111]">Just give me the fixed code.</p>
          </motion.div>
        )}
        {step >= 2 && (
          <motion.div
            {...pop}
            className="absolute left-[149px] top-[261px] rounded-[14px] bg-[#e4f7ec] px-3.5 py-2.5"
          >
            {step === 2 ? (
              <TypingDots />
            ) : (
              <p className="w-[190px] text-[12.5px] font-medium leading-[18px] text-[#111]">
                {"I can't write it for you, but let's find it: what should print when n is 0?"}
              </p>
            )}
          </motion.div>
        )}
        <SparkBuddy gaze={gaze} className="absolute left-[34px] top-[236px] w-[108px]" />
      </div>
    </ImageCard>
  );
}

export function UnguidedAiBand() {
  return (
    <BandShell
      id="unguided-ai"
      tone="white"
      cardFirst
      title={["Guided help,", "not ready-made answers"]}
      body="Spark reads the student's code and latest test results. It explains code, traces output, and points to where an error likely is, but it declines requests for complete solutions or corrected code."
      link="How Spark's limits work →"
      card={<UnguidedAiCard />}
    />
  );
}
