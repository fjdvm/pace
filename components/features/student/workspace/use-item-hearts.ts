"use client";
import { useCallback, useEffect, useState } from "react";
import { regenerateHearts } from "@/lib/hearts-logic";
import type { HeartsStateData, WorkspaceViewProps } from "@/components/features/assignments/types";

export function useItemHearts(props: WorkspaceViewProps, activeId: string) {
  const [states, setStates] = useState<Record<string, HeartsStateData>>(() =>
    Object.fromEntries(Object.entries(props.initialTutorStates ?? {}).map(([id, state]) => [id, state.hearts])));
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const updateHearts = useCallback((id: string, state: HeartsStateData) => {
    setStates((previous) => ({ ...previous, [id]: state }));
    setNow(Date.now());
  }, []);
  const state = states[activeId] ?? props.initialHearts;
  const regenerated = regenerateHearts(
    { ...state, lastRegenAt: new Date(state.lastRegenAt) },
    props.assignment.heartsCount, props.assignment.heartsRegenMinutes, new Date(now),
  );
  const seconds = Math.max(0, Math.ceil((regenerated.lastRegenAt.getTime() + props.assignment.heartsRegenMinutes * 60_000 - now) / 1000));
  const timeToRegen = regenerated.currentCount >= props.assignment.heartsCount ? "" :
    `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  return { hearts: { ...regenerated, lastRegenAt: regenerated.lastRegenAt.toISOString() }, timeToRegen, updateHearts };
}
