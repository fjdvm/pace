"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import { useMotionEnabled } from "./use-motion-enabled";

export function usePauseOffScreen<T extends Element = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { margin: "100px" });
  const motionEnabled = useMotionEnabled();
  return { ref, running: motionEnabled && inView };
}
