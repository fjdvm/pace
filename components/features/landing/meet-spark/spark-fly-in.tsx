"use client";

import { motion } from "motion/react";
import { SparkBuddy } from "../spark-buddy/spark-buddy";
import { useMotionEnabled } from "../shared/use-motion-enabled";

export function SparkFlyIn() {
  const motionEnabled = useMotionEnabled();

  return (
    <motion.div
      data-spark-fly-in
      initial={{ y: 80, opacity: 0 }}
      animate={motionEnabled ? undefined : { y: 0, opacity: 1 }}
      whileInView={motionEnabled ? { y: 0, opacity: 1 } : undefined}
      viewport={{ once: true, amount: 0.4 }}
      transition={
        motionEnabled ? { type: "spring", stiffness: 90, damping: 14 } : { duration: 0 }
      }
      className="relative h-[150px] w-[120px]"
    >
      <SparkBuddy className="absolute left-[-75px] top-[42px] w-[173px]" />
    </motion.div>
  );
}
