"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { useMotionEnabled } from "../../shared/use-motion-enabled";
import { cn } from "@/lib/utils";

export function AppPanel({ className, children }: { className?: string; children: ReactNode }) {
  const motionEnabled = useMotionEnabled();
  return (
    <motion.div
      data-app-panel
      initial={motionEnabled ? { y: 24, opacity: 0 } : false}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "absolute flex h-[430px] w-[280px] flex-col items-start gap-3 overflow-clip rounded-[36px] bg-white p-[22px]",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
