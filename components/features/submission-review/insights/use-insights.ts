"use client";
import { useEffect, useState } from "react";
import { getInsights, type InsightsResult } from "@/app/actions/insights/get-insights";

export function useInsights(open: boolean, postId: string, studentId: string, itemId: string) {
  const [state, setState] = useState<{ key: string; result: InsightsResult } | null>(null);
  const key = `${postId}:${studentId}:${itemId}`;
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    getInsights(postId, studentId, itemId)
      .then((result) => !cancelled && setState({ key, result }))
      .catch(() => !cancelled && setState({ key, result: { success: false, error: "Could not load insights" } }));
    return () => {
      cancelled = true;
    };
  }, [open, postId, studentId, itemId, key]);
  return state?.key === key ? state.result : null;
}
