"use client";

import { useEffect, useState } from "react";
import { tickCountdown } from "../shared/countdown";

export function useCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(
      () => setSeconds((current) => tickCountdown(current, initialSeconds)),
      1000,
    );
    return () => clearInterval(timer);
  }, [initialSeconds]);

  return seconds;
}
