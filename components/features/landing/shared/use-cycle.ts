"use client";

import { useEffect, useRef, useState } from "react";

export function useCycle(steps: number, intervalMs: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(steps - 1);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: ReturnType<typeof setInterval> | undefined;
    const start = () => {
      if (timer) return;
      timer = setInterval(() => setStep((s) => (s + 1) % steps), intervalMs);
    };
    const stop = () => {
      if (timer) clearInterval(timer);
      timer = undefined;
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setStep(0);
        start();
      } else {
        stop();
      }
    });
    observer.observe(node);

    return () => {
      observer.disconnect();
      stop();
    };
  }, [steps, intervalMs]);

  return { ref, step };
}
