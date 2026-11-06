"use client";

import { motion } from "motion/react";
import { SparkBuddy } from "../spark-buddy/spark-buddy";
import { useMotionEnabled } from "../shared/use-motion-enabled";

export function CtaSpark() {
  const motionEnabled = useMotionEnabled();

  return (
    <motion.div
      data-cta-spark
      initial={motionEnabled ? { x: -120, y: 80, opacity: 0 } : false}
      whileInView={motionEnabled ? { x: 0, y: 0, opacity: 1 } : undefined}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ type: "spring", duration: 0.8, bounce: 0.25 }}
      className="pointer-events-none absolute bottom-6 right-4 w-[110px] sm:bottom-10 sm:right-16 sm:w-[173px]"
    >
      <SparkBuddy className="w-full" />
    </motion.div>
  );
}
