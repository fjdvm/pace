"use client";

import { useReducedMotion } from "motion/react";

export function useMotionEnabled() {
  return !useReducedMotion();
}
