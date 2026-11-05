import { useEffect, useState } from "react";

const STEP_MS = 6000;

export function useReadingStage(active: boolean, stages: number) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setStage((s) => Math.min(s + 1, stages - 1)), STEP_MS);
    return () => { clearInterval(id); setStage(0); };
  }, [active, stages]);
  return stage;
}
