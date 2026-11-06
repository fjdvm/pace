"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { useMotionEnabled } from "../../shared/use-motion-enabled";

export function useSequence(times: number[]) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const motionEnabled = useMotionEnabled();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!motionEnabled || !inView) return;
    const timers = times.map((t, i) => setTimeout(() => setStep(i + 1), t));
    return () => timers.forEach(clearTimeout);
  }, [motionEnabled, inView, times]);

  return { ref, step: motionEnabled ? step : times.length, motionEnabled };
}
