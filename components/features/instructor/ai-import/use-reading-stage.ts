import { useEffect, useState } from "react";

const STEP_MS = 1000;

export function useReadingStage(active: boolean, stages: number) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setSeconds((s) => s + 1), STEP_MS);
    return () => { clearInterval(id); setSeconds(0); };
  }, [active, stages]);
  return { stage: Math.min(Math.floor(seconds / 6), stages - 1), seconds };
}
