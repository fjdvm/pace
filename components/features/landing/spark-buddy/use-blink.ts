"use client";

import { useEffect } from "react";
import { animate, useMotionValue } from "motion/react";

export function useBlink(active: boolean) {
  const scaleY = useMotionValue(1);

  useEffect(() => {
    if (!active) return;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(async () => {
        await animate(scaleY, [1, 0.1, 1], { duration: 0.14 });
        schedule();
      }, 3000 + Math.random() * 3000);
    };
    schedule();
    return () => clearTimeout(timer);
  }, [active, scaleY]);

  return scaleY;
}
